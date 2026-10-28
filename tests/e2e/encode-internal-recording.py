"""Encode timestamped CUA screenshots without inventing UI states or tween frames.

Usage: python encode-internal-recording.py path/to/recording.json path/to/ffmpeg.exe
The 25fps container holds the last acquired real image until the next acquisition.
This is sampled screen recording, not evidence of sub-frame motion latency.
"""
from pathlib import Path
import bisect
import io
import json
import math
import statistics
import subprocess
import sys

import numpy as np
from PIL import Image

manifest_path = Path(sys.argv[1]).resolve()
ffmpeg = sys.argv[2]
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
frames = manifest["frames"]
root = Path(__file__).resolve().parents[2]
source = root / manifest["sourceDirectory"]
output = manifest_path.parent / "interaction.webm"
origin = frames[0]["endMs"]
times = [frame["endMs"] - origin for frame in frames]
frame_count = math.ceil(times[-1] / 40) + 1
indices = [max(0, bisect.bisect_right(times, index * 40) - 1) for index in range(frame_count)]
originals = [Image.open(source / frame["file"]).convert("RGB") for frame in frames]
canvas_size = (max(image.width for image in originals), max(image.height for image in originals))
# CUA excludes the page scrollbar in some acquisitions. Pad the missing edge;
# never resize/crop captured UI to force a constant video frame size.
images = []
for image in originals:
    canvas = Image.new("RGB", canvas_size, (247, 250, 245))
    canvas.paste(image, (0, 0))
    buffer = io.BytesIO()
    canvas.save(buffer, format="JPEG", quality=100, subsampling=0)
    images.append(buffer.getvalue())
process = subprocess.Popen([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-c:v", "mjpeg", "-r", "25", "-i", "pipe:0", "-an", "-c:v", "libvpx", "-qmin", "0", "-qmax", "10", "-crf", "4", "-b:v", "2M", "-deadline", "good", str(output)], stdin=subprocess.PIPE)
for index in indices:
    process.stdin.write(images[index])
process.stdin.close()
if process.wait() != 0:
    raise RuntimeError("Video encoding failed")

checks = []
for at_ms in [600, 1000, 2400, 3200, 4000]:
    tick = min(round(at_ms / 40), frame_count - 1)
    timestamp = tick * 40 / 1000
    expected = Image.open(io.BytesIO(images[indices[tick]])).convert("RGB")
    reference = manifest_path.parent / f"reference-{tick:03}.png"
    decoded = manifest_path.parent / f"seek-{tick:03}.png"
    expected.save(reference)
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-ss", str(timestamp), "-i", str(output), "-frames:v", "1", str(decoded)], check=True)
    actual = Image.open(decoded).convert("RGB")
    if actual.size != expected.size:
        raise AssertionError("Seek frame dimensions differ")
    mae = float(np.abs(np.asarray(expected, dtype=float) - np.asarray(actual, dtype=float)).mean())
    checks.append({"timeSeconds": timestamp, "precisionMs": 40, "sourceIndex": indices[tick], "reference": reference.name, "decoded": decoded.name, "mae": mae, "passed": mae <= 3})

result = {"video": output.name, "method": manifest["method"], "sourceFrames": len(frames), "encodedFrames": frame_count, "containerFps": 25, "clockOriginMs": origin, "acquisitionMedianMs": statistics.median(frame["endMs"] - frame["startMs"] for frame in frames), "acquisitionMaxMs": max(frame["endMs"] - frame["startMs"] for frame in frames), "noInterpolation": True, "canvasSize": canvas_size, "padding": "right/bottom only where CUA cropped scrollbar; original UI pixels never resized", "checks": checks}
(manifest_path.parent / "media-checks.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(json.dumps(result, indent=2))
if not all(check["passed"] for check in checks):
    raise AssertionError("At least one seek failed image correspondence")
