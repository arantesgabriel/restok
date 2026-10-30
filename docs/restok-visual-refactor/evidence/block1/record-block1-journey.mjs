/* global URL, document, Image, setTimeout, clearTimeout, requestAnimationFrame, Buffer, MediaRecorder, Blob, fetch */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/restok-visual-refactor/evidence/block1');
const screens = path.join(root, 'screens');
const sourceVideoPath = path.join(root, 'compra-interaction-source.webm');
const videoPath = path.join(root, 'compra-interaction.mp4');
const captureFiles = [];
const errors = [];
await mkdir(screens, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const engine = browser.version();

const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  recordVideo: { dir: root, size: { width: 390, height: 844 } },
});
await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4173' ? route.continue() : route.abort());
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/app?scenario=long', { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Compra ilustrativa da casa para o mês' }).waitFor();
await page.evaluate(() => document.fonts.ready);

async function capture(id) {
  await page.mouse.move(1, 100);
  await page.waitForTimeout(700);
  const file = `journey-${String(captureFiles.length + 1).padStart(2,'0')}-${id}.png`;
  await page.screenshot({ path: path.join(screens, file) });
  captureFiles.push({ id, file, viewport: { width: 390, height: 844 }, route: page.url().replace('http://127.0.0.1:4173','') });
}

const video = page.video();
try {
  await capture('initial');

  await page.getByRole('button', { name: 'Pendente', exact: true }).click();
  await capture('filter-pending');

  let firstRow = page.locator('[data-shopping-row]').first();
  const originalName = (await firstRow.locator('button[aria-describedby]').getAttribute('aria-label')).replace(/^Editar /,'');
  await firstRow.getByRole('button', { name: `Editar ${originalName}` }).click();
  const editor = page.getByRole('dialog');
  await editor.waitFor();
  await editor.getByText('Mais detalhes').click();
  const editedName = `${originalName} atualizado`;
  await editor.getByLabel('Nome').fill(editedName);
  await editor.locator('button[type="submit"]').click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  const editedRow = page.locator('[data-shopping-row]').filter({ hasText: editedName });
  await editedRow.waitFor();
  await capture('item-edited');

  const mark = page.getByRole('button', { name: 'Marcar Cebola como comprado' });
  await mark.click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-shopping-row]')].some(row => row.textContent.includes('Cebola') && row.getAttribute('data-item-status') === 'purchased'));
  await capture('item-marked-in-fixture');

  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.locator('[data-shopping-row][data-item-status="purchased"]').filter({ hasText: editedName }).waitFor();
  await capture('filter-all-after-mark');

  await page.getByRole('button', { name: 'Menu da compra' }).click();
  await page.getByRole('menuitem', { name: 'Finalizar compra' }).click();
  const finishDialog = page.getByRole('dialog');
  await finishDialog.waitFor();
  await finishDialog.getByText(/Ainda existem .* itens pendentes/).waitFor();
  await capture('finish-confirmation-pending');

  await finishDialog.getByRole('button', { name: 'Finalizar e salvar' }).click();
  await page.getByRole('heading', { name: 'Compra finalizada' }).waitFor();
  await capture('receipt-fixture-only');
} finally {
  await context.close();
}

if (!video) throw new Error('Playwright não forneceu o handle de gravação de vídeo.');
const temporaryVideo = await video.path();
await rename(temporaryVideo, sourceVideoPath);

// Serve the captured source and output on loopback, with byte ranges for real
// browser seeks. The browser re-encodes the captured recording into indexed MP4.
const allowed = new Map([
  ['/source.webm', sourceVideoPath],
  ['/video.mp4', videoPath],
  ...captureFiles.map(capture => [`/screens/${encodeURIComponent(capture.file)}`, path.join(screens,capture.file)]),
]);
const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url, 'http://127.0.0.1').pathname;
  if (requestPath === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><meta charset="utf-8"><title>Verificação local de seeks</title>');
    return;
  }
  if (request.method === 'POST' && requestPath === '/video.mp4') {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    await writeFile(videoPath, Buffer.concat(chunks));
    response.writeHead(204); response.end();
    return;
  }
  const asset = allowed.get(requestPath);
  if (!asset) { response.writeHead(404); response.end(); return; }
  try {
    const data = await readFile(asset);
    const videoAsset = asset.endsWith('.webm') || asset.endsWith('.mp4');
    const contentType = asset.endsWith('.webm') ? 'video/webm' : asset.endsWith('.mp4') ? 'video/mp4' : 'image/png';
    const range = /bytes=(\d*)-(\d*)/i.exec(request.headers.range ?? '');
    if (videoAsset) response.setHeader('accept-ranges', 'bytes');
    response.setHeader('cache-control', 'no-store'); response.setHeader('content-type', contentType);
    if (range && videoAsset) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
      response.writeHead(206, { 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${data.length}` });
      response.end(data.subarray(start, end + 1));
    } else {
      response.writeHead(200, { 'content-length': data.byteLength }); response.end(data);
    }
  } catch {
    response.writeHead(500); response.end();
  }
});

let verification;
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const verifyPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await verifyPage.goto(`http://127.0.0.1:${address.port}/`);
  const references = captureFiles.map(capture => ({ ...capture, url: `/screens/${encodeURIComponent(capture.file)}` }));
  const normalized = await verifyPage.evaluate(async ({ sourceUrl, outputUrl }) => {
    const source = document.createElement('video'); source.muted = true; source.playsInline = true; source.preload = 'auto'; source.src = sourceUrl;
    await new Promise((resolve, reject) => { source.addEventListener('loadedmetadata', resolve, { once: true }); source.addEventListener('error', () => reject(new Error('A gravação WebM não pôde ser decodificada.')), { once: true }); });
    await new Promise(resolve => source.addEventListener('loadeddata', resolve, { once: true }));
    const canvas = document.createElement('canvas'); canvas.width = source.videoWidth; canvas.height = source.videoHeight;
    const context = canvas.getContext('2d'); const stream = canvas.captureStream(25);
    const mimeType = 'video/mp4;codecs=avc1.42E01E';
    if (!MediaRecorder.isTypeSupported(mimeType)) throw new Error('Edge sem suporte a gravação MP4 necessária para indexar os seeks.');
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 }); const chunks = [];
    recorder.addEventListener('dataavailable', event => { if (event.data.size) chunks.push(event.data); });
    const stopped = new Promise(resolve => recorder.addEventListener('stop', resolve, { once: true }));
    const draw = () => { if (source.readyState >= 2) context.drawImage(source, 0, 0, canvas.width, canvas.height); if (!source.ended) requestAnimationFrame(draw); };
    recorder.start(200); requestAnimationFrame(draw); await source.play(); await new Promise(resolve => source.addEventListener('ended', resolve, { once: true }));
    recorder.stop(); await stopped;
    const blob = new Blob(chunks, { type: recorder.mimeType });
    const response = await fetch(outputUrl, { method: 'POST', body: blob });
    if (response.status !== 204) throw new Error(`Falha ao salvar MP4 indexado: HTTP ${response.status}`);
    return { mimeType: recorder.mimeType, bytes: blob.size, sourceDuration: source.duration };
  }, { sourceUrl: '/source.webm', outputUrl: '/video.mp4' });
  verification = await verifyPage.evaluate(async ({ videoUrl, references }) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.src = videoUrl;
    document.body.append(video);
    await new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', resolve, { once: true });
      video.addEventListener('error', () => reject(new Error('WebM não pôde ser decodificado.')), { once: true });
    });
    await new Promise(resolve => video.addEventListener('loadeddata', resolve, { once: true }));

    const width = 80;
    const height = Math.round(video.videoHeight * width / video.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const targets = [];
    for (const reference of references) {
      const image = new Image(); image.src = reference.url;
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
      context.clearRect(0,0,width,height); context.drawImage(image,0,0,width,height);
      targets.push({ reference, pixels: context.getImageData(0,0,width,height).data });
    }

    const best = Object.fromEntries(targets.map(({ reference }) => [reference.id, { mae: Infinity }]));
    const stepSeconds = 0.04;
    const frameCount = Math.ceil(video.duration / stepSeconds);
    for (let index = 1; index <= frameCount; index++) {
      const requested = Math.min(index * stepSeconds, video.duration - 0.001);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Seek demorou em ${requested.toFixed(3)}s`)), 5000);
        video.addEventListener('seeked', () => { clearTimeout(timer); resolve(); }, { once: true });
        video.currentTime = requested;
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      context.clearRect(0,0,width,height); context.drawImage(video,0,0,width,height);
      const pixels = context.getImageData(0,0,width,height).data;
      const actualTime = video.currentTime;
      for (const target of targets) {
        let absoluteError = 0;
        for (let pixel = 0; pixel < pixels.length; pixel += 4) {
          absoluteError += Math.abs(pixels[pixel] - target.pixels[pixel]);
          absoluteError += Math.abs(pixels[pixel + 1] - target.pixels[pixel + 1]);
          absoluteError += Math.abs(pixels[pixel + 2] - target.pixels[pixel + 2]);
        }
        const mae = absoluteError / (width * height * 3);
        if (mae < best[target.reference.id].mae) best[target.reference.id] = { seconds: actualTime, sampledSeekSeconds: requested, frameIndex: index, mae };
      }
    }
    return {
      video: { duration: video.duration, width: video.videoWidth, height: video.videoHeight, readyState: video.readyState },
      method: `HTMLVideoElement actual seeks every ${stepSeconds}s; compare scaled 80px-wide decoded canvas frame with captured PNG RGB after H.264 normalization`,
      maxRgbMeanAbsoluteError: 10,
      captures: targets.map(({ reference }) => ({ id: reference.id, file: reference.file, viewport: reference.viewport, ...best[reference.id], passed: best[reference.id].mae <= 10 })),
    };
  }, { videoUrl: '/video.mp4', references });
  verification.normalization = normalized;
  await verifyPage.close();
} finally {
  await new Promise(resolve => server.close(resolve));
  await browser.close();
}

const result = {
  kind: 'Compra / vídeo de interação real do harness E2E-FIXTURE / sem backend',
  createdAt: new Date().toISOString(),
  viewport: { width: 390, height: 844 }, dpr: 1, zoom: 1,
  engine,
  videoFile: path.basename(videoPath), sourceVideo: path.basename(sourceVideoPath), videoBytes: (await stat(videoPath)).size,
  route: '/app?scenario=long', fixture: 'dados, Auth e persistência locais; nenhum acesso Supabase',
  interactions: ['filtrar pendentes', 'editar item', 'marcar comprado', 'filtrar todos', 'confirmar finalização com pendentes', 'recibo renderizado pela resposta local simulada'],
  pageErrors: errors,
  ...verification,
};
await writeFile(path.join(root,'journey-manifest.json'),JSON.stringify(result,null,2)+'\n');
await writeFile(path.join(root,'manifest.json'),JSON.stringify({
  ...JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8')),
  video: { file: result.videoFile, source: result.sourceVideo, manifest: 'journey-manifest.json', duration: result.video.duration, seeks: result.captures },
},null,2)+'\n');

if (errors.length || result.captures.some(capture => !capture.passed)) throw new Error('Vídeo e seeks foram gravados, mas pelo menos uma comparação real não atingiu o limite. Consulte journey-manifest.json.');
