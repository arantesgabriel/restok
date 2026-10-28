"""Match PNGs to decoded video frames; script clock is never treated as media time."""
import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("directory", type=Path)
parser.add_argument("--ffmpeg", required=True)
args = parser.parse_args()
manifest_path = args.directory / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
videos = sorted({capture["video"] for capture in manifest["captures"] if capture.get("video")})
for video in videos:
    captures = [capture for capture in manifest["captures"] if capture.get("video") == video]
    width = 80
    height = round(captures[0]["viewport"]["height"] * width / captures[0]["viewport"]["width"])
    with tempfile.TemporaryDirectory(prefix="restok-media-") as temporary:
        result = subprocess.run([args.ffmpeg, "-i", str(args.directory / video), "-vsync", "0", "-s", f"{width}x{height}", str(Path(temporary) / "%06d.png")], capture_output=True, text=True, check=True)
        fps = float(re.search(r"(\d+(?:\.\d+)?) fps", result.stderr).group(1))
        frames = sorted(Path(temporary).glob("*.png"))
        pixels = [np.asarray(Image.open(frame).convert("RGB"), dtype=np.float32) for frame in frames]
        for capture in captures:
            target = np.asarray(Image.open(args.directory / capture["file"]).convert("RGB").resize((width, height), Image.Resampling.BILINEAR), dtype=np.float32)
            errors = [float(np.abs(frame - target).mean()) for frame in pixels]
            best = int(np.argmin(errors))
            capture["mediaSeek"] = {"seconds": round(best / fps, 3), "frame": best, "fps": fps, "precisionSeconds": round(1 / fps, 3), "meanAbsoluteErrorRgb": round(errors[best], 3), "method": "minimum RGB MAE across every decoded frame at width 80; original video timeline, not script time"}
            if errors[best] > 8:
                raise RuntimeError(f"No reliable frame match: {capture['file']} MAE {errors[best]}")
    print(f"{video}: {len(captures)} matched")
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
