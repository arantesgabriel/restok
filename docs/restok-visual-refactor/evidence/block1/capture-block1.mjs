/* global URL, document, getComputedStyle, innerHeight, innerWidth */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve('docs/restok-visual-refactor/evidence/block1');
const output = path.join(root, 'screens');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const viewports = [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]];
const relevantFiles = [
  'components/app/app-shell.tsx', 'components/app/app-shell.module.css', 'components/restok-app.tsx',
  'components/shopping/budget-summary.tsx', 'components/shopping/category-section.tsx', 'components/shopping/item-row.tsx',
  'components/shopping/shopping-context.tsx', 'components/shopping/shopping-controls.module.css',
  'components/shopping/shopping-toolbar.tsx', 'components/shopping/shopping-view.tsx', 'components/shopping/shopping.module.css',
  'components/shopping/status-toggle.tsx', 'tests/e2e/fixtures.ts',
];
const source = execFileSync('git', ['diff', '--', ...relevantFiles]);
const manifest = {
  kind: 'BLOCO 1 / COMPRA / E2E-FIXTURE / sem backend',
  createdAt: new Date().toISOString(),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  sourceDiffSha256: createHash('sha256').update(source).digest('hex'),
  engine: browser.version(), dpr: 1, zoom: 1,
  fixture: 'Vite 127.0.0.1:4173, componentes e CSS reais; data/Auth/realtime substituídos localmente',
  captures: [], checks: [], interactions: [], errors: [],
};

async function createContext(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4173' ? route.continue() : route.abort());
  return context;
}

async function openPurchase(page, scenario = 'long') {
  await page.goto(`http://127.0.0.1:4173/app?scenario=${scenario}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Compra ilustrativa da casa para o mês' }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}

async function measure(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
    };
    const rows = [...document.querySelectorAll('[data-shopping-row]')];
    const dock = document.querySelector('[data-shopping-dock]');
    const boundary = visible(dock) ? dock.getBoundingClientRect().top : innerHeight;
    const status = rows[0]?.querySelector('button[aria-pressed]');
    const context = document.querySelector('[data-app-context]');
    const pending = document.querySelector('[data-purchase-intermediate-pending]');
    const main = document.querySelector('[data-app-main]');
    const budget = document.querySelector('[data-budget-summary]');
    const budgetEdit = budget?.querySelector('button');
    const measureText = (element, parent) => element ? {
      text: element.textContent?.trim() ?? '',
      fontSize: getComputedStyle(element).fontSize,
      width: element.getBoundingClientRect().width,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      parentWidth: parent?.clientWidth ?? null,
      parentScrollWidth: parent?.scrollWidth ?? null,
      overflows: element.scrollWidth > element.clientWidth + 1 || Boolean(parent && parent.scrollWidth > parent.clientWidth + 1),
    } : null;
    const budgetTotal = budget?.querySelector('strong');
    const budgetBalance = budget?.querySelector('b');
    const extremePriceRow = document.querySelector('[data-shopping-row][data-total-extreme="true"]');
    const extremePrice = extremePriceRow?.querySelector('[data-item-total]');
    const unpricedRow = document.querySelector('[data-shopping-row][data-item-price-missing="true"]');
    const unpricedLabel = unpricedRow?.querySelector('[data-item-price-missing-label]');
    const firstCategory = document.querySelector('[data-category-section]');
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      rows: rows.length,
      firstRow: rect(rows[0]),
      firstRowHeight: rows[0]?.getBoundingClientRect().height ?? null,
      firstRowStatus: status ? { pressed: status.getAttribute('aria-pressed'), label: status.getAttribute('aria-label'), height: status.getBoundingClientRect().height } : null,
      firstRowActionHeight: rows[0]?.querySelector('.rowActions button')?.getBoundingClientRect().height ?? null,
      completeRowsAboveDock: rows.filter(row => row.getBoundingClientRect().top >= 0 && row.getBoundingClientRect().bottom <= boundary).length,
      firstCategory: rect(firstCategory),
      budget: rect(budget),
      budgetEditHeight: budgetEdit?.getBoundingClientRect().height ?? null,
      budgetLongFlags: budget ? { total: budget.getAttribute('data-total-long') ?? null, balance: budget.getAttribute('data-balance-long') ?? null } : null,
      budgetTotal: measureText(budgetTotal, budget),
      budgetBalance: measureText(budgetBalance, budget),
      extremeRowTotal: measureText(extremePrice, extremePriceRow),
      unpricedLabel: measureText(unpricedLabel, unpricedRow),
      unpricedLabelAligned: Boolean(unpricedRow && unpricedLabel && Math.abs(unpricedRow.getBoundingClientRect().right - unpricedLabel.getBoundingClientRect().right - 12) <= 2),
      dock: rect(dock), dockVisible: visible(dock),
      sidebarVisible: visible(document.querySelector('[data-app-sidebar]')),
      contextVisible: visible(context),
      context: rect(context),
      desktopAddVisible: visible(document.querySelector('[data-purchase-desktop-add]')),
      intermediatePendingVisible: visible(pending),
      intermediatePendingDisabled: pending?.disabled ?? null,
      menuTriggers: [...document.querySelectorAll('button[aria-haspopup="menu"]')].filter(visible).map(element => element.getAttribute('aria-label')),
      heading: rect(document.querySelector('h1')),
      main: rect(main),
      fonts: getComputedStyle(document.body).fontFamily,
      active: document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName ?? null,
    };
  });
}

async function capture(page, width, height, id) {
  await page.waitForTimeout(180);
  const file = `${width}-${height}-${id}.png`;
  await page.screenshot({ path: path.join(output, file) });
  const geometry = await measure(page);
  manifest.captures.push({ id, file, route: page.url().replace('http://127.0.0.1:4173', ''), viewport: { width, height }, geometry });
  if (id !== 'loading') manifest.checks.push({ id: `${width}x${height}-${id}-no-horizontal-overflow`, passed: geometry.horizontalOverflow === 0, value: geometry.horizontalOverflow });
  return geometry;
}

try {
  for (const [width, height] of viewports) {
    const context = await createContext(width, height);
    const page = await context.newPage();
    page.on('pageerror', error => manifest.errors.push({ viewport: `${width}x${height}`, message: error.message }));
    await openPurchase(page);
    const geometry = await capture(page, width, height, 'compra-filled');
    manifest.checks.push(
      { id: `${width}x${height}-purchase-rows`, passed: geometry.rows === 33, value: geometry.rows },
      { id: `${width}x${height}-row-status-target`, passed: (geometry.firstRowStatus?.height ?? 0) >= 44, value: geometry.firstRowStatus },
      { id: `${width}x${height}-budget-edit-target`, passed: (geometry.budgetEditHeight ?? 0) >= 44, value: geometry.budgetEditHeight },
      { id: `${width}x${height}-single-global-organize`, passed: geometry.menuTriggers.filter(label => label?.startsWith('Organizar lista')).length === 1, value: geometry.menuTriggers },
    );
    if (width < 1024) manifest.checks.push({ id: `${width}x${height}-mobile-dock`, passed: geometry.dockVisible, value: geometry.dockVisible });
    if (width < 1024) manifest.checks.push({ id: `${width}x${height}-mobile-no-desktop-actions`, passed: !geometry.desktopAddVisible && !geometry.intermediatePendingVisible, value: { add: geometry.desktopAddVisible, pending: geometry.intermediatePendingVisible } });
    if (width === 320) manifest.checks.push({ id: `${width}x${height}-first-row-above-dock`, passed: geometry.completeRowsAboveDock >= 1, value: geometry.completeRowsAboveDock });
    if (width === 1280) manifest.checks.push({ id: `${width}x${height}-four-rows-above-fold`, passed: geometry.completeRowsAboveDock >= 4, value: geometry.completeRowsAboveDock });
    if (width >= 1024) manifest.checks.push({ id: `${width}x${height}-desktop-no-dock`, passed: !geometry.dockVisible, value: geometry.dockVisible });
    if (width >= 1024 && width < 1200) manifest.checks.push({ id: `${width}x${height}-intermediate-pending`, passed: geometry.intermediatePendingVisible && !geometry.contextVisible, value: { pending: geometry.intermediatePendingVisible, context: geometry.contextVisible } });
    if (width >= 1200) manifest.checks.push({ id: `${width}x${height}-desktop-context`, passed: geometry.contextVisible && geometry.desktopAddVisible, value: { context: geometry.contextVisible, add: geometry.desktopAddVisible } });
    if (width >= 1600) {
      const wideLayout = {
        mainRight: geometry.main?.right,
        contentWidth: geometry.firstRow?.width,
        contextRight: geometry.context?.right,
      };
      manifest.checks.push({
        id: `${width}x${height}-wide-layout-uses-viewport`,
        passed: (wideLayout.mainRight ?? 0) >= width - 1
          && (wideLayout.contentWidth ?? 0) >= width * 0.68
          && Math.abs(width - (wideLayout.contextRight ?? 0)) <= 32,
        value: wideLayout,
      });
    }

    if ([320,390,1440].includes(width)) {
      for (const scenario of ['money','money-equal','money-over','money-high','stress']) {
        await openPurchase(page, scenario);
        const moneyGeometry = await capture(page, width, height, `compra-${scenario}`);
        if (scenario === 'money-equal' || scenario === 'money-over') manifest.checks.push({ id: `${width}x${height}-${scenario}-unpriced-value-stays-explicit`, passed: !moneyGeometry.unpricedLabel?.overflows && moneyGeometry.unpricedLabelAligned, value: { label: moneyGeometry.unpricedLabel, aligned: moneyGeometry.unpricedLabelAligned } });
        if (scenario === 'money-high' || scenario === 'stress') manifest.checks.push(
          { id: `${width}x${height}-${scenario}-no-page-overflow`, passed: moneyGeometry.horizontalOverflow === 0, value: moneyGeometry.horizontalOverflow },
          { id: `${width}x${height}-${scenario}-no-clipped-budget-text`, passed: !moneyGeometry.budgetTotal?.overflows && !moneyGeometry.budgetBalance?.overflows, value: { total: moneyGeometry.budgetTotal, balance: moneyGeometry.budgetBalance } },
        );
        if (scenario === 'stress') manifest.checks.push({ id: `${width}x${height}-stress-no-clipped-row-price`, passed: !moneyGeometry.extremeRowTotal?.overflows, value: moneyGeometry.extremeRowTotal });
        if (scenario === 'stress') {
          const longTotalRow = page.locator('[data-shopping-row][data-total-extreme="true"]').first();
          await longTotalRow.scrollIntoViewIfNeeded();
          const rowMetrics = await longTotalRow.evaluate(row => {
            const price = row.querySelector('[data-item-total]');
            return { rowWidth: row.clientWidth, rowScrollWidth: row.scrollWidth, totalText: price?.textContent?.trim() ?? null, totalWidth: price?.clientWidth ?? null, totalScrollWidth: price?.scrollWidth ?? null, totalFontSize: price ? getComputedStyle(price).fontSize : null };
          });
          await capture(page,width,height,'compra-stress-long-total-row');
          manifest.checks.push({ id: `${width}x${height}-stress-row-price-contained`, passed: rowMetrics.totalWidth !== null && rowMetrics.totalScrollWidth <= rowMetrics.totalWidth && rowMetrics.rowScrollWidth <= rowMetrics.rowWidth, value: rowMetrics });
        }
      }
      await openPurchase(page, 'empty-list');
      await capture(page, width, height, 'compra-empty-active');
    }
    if (width === 1024) {
      await openPurchase(page, 'money-high');
      const zeroPending = await capture(page,width,height,'compra-no-pending');
      manifest.checks.push({ id: `${width}x${height}-no-pending-disabled`, passed: zeroPending.intermediatePendingVisible && zeroPending.intermediatePendingDisabled === true, value: { visible: zeroPending.intermediatePendingVisible, disabled: zeroPending.intermediatePendingDisabled } });
    }
    if ([390,1440].includes(width)) {
      await openPurchase(page, 'list100');
      const list100 = await capture(page, width, height, 'compra-list100');
      manifest.checks.push({ id: `${width}x${height}-list100-rendered`, passed: list100.rows === 100, value: list100.rows });
    }
    await context.close();
  }

  {
    const context = await createContext(390,844);
    const page = await context.newPage();
    page.on('pageerror', error => manifest.errors.push({ surface: 'interactions', message: error.message }));
    await openPurchase(page);
    const organize = page.getByRole('button', { name: /Organizar lista/ });
    const search = page.getByRole('searchbox', { name: 'Buscar na lista' });
    await search.focus();
    await page.keyboard.press('Tab');
    const organizeFocus = await organize.evaluate(element => ({ focused: element === document.activeElement, focusVisible: element.matches(':focus-visible'), outline: getComputedStyle(element).outlineStyle, outlineWidth: getComputedStyle(element).outlineWidth, outlineOffset: getComputedStyle(element).outlineOffset }));
    await capture(page,390,844,'compra-organize-focus');
    manifest.checks.push({ id: 'organize-keyboard-focus', passed: organizeFocus.focused && organizeFocus.focusVisible && organizeFocus.outline === 'solid' && organizeFocus.outlineWidth === '2px' && organizeFocus.outlineOffset === '3px', value: organizeFocus });
    await organize.evaluate(element => element.blur());
    await organize.hover();
    const hoverBackground = await organize.evaluate(element => getComputedStyle(element).backgroundColor);
    await capture(page,390,844,'compra-organize-hover');
    manifest.interactions.push({ id: 'organize-hover', passed: hoverBackground !== 'rgba(0, 0, 0, 0)' && hoverBackground !== 'transparent', value: hoverBackground });
    const box = await organize.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const pressedTransform = await organize.evaluate(element => getComputedStyle(element).transform);
    await capture(page,390,844,'compra-organize-pressed');
    await page.mouse.up();
    manifest.interactions.push({ id: 'organize-pressed', passed: pressedTransform !== 'none', value: pressedTransform });
    await page.getByRole('menuitem', { name: 'Ordenar por nome A–Z' }).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('menu').waitFor({ state: 'detached' });
    manifest.interactions.push({ id: 'organize-menu-escape', passed: await organize.evaluate(element => element === document.activeElement) });
    await organize.click();
    await page.getByRole('menuitem', { name: 'Ordenar por nome A–Z' }).click();
    await page.locator('[data-purchase-results] [data-shopping-row]').first().waitFor();
    manifest.interactions.push({ id: 'global-sort', passed: await page.locator('[data-category-section]').count() === 0 && await page.locator('[data-purchase-results] [data-shopping-row]').count() === 33 });

    await search.fill('nenhum-resultado-restok');
    await page.getByRole('heading', { name: 'Nenhum item encontrado' }).waitFor();
    const noResult = await capture(page,390,844,'compra-search-empty');
    manifest.checks.push({ id: 'search-empty-state', passed: noResult.rows === 0 && noResult.horizontalOverflow === 0, value: noResult });
    await page.getByRole('button', { name: 'Limpar busca e filtros' }).click();
    await page.locator('[data-shopping-row]').first().waitFor();
    manifest.interactions.push({ id: 'clear-search', passed: await search.inputValue() === '' });

    const purchasedFilter = page.getByRole('button', { name: 'Comprado', exact: true });
    await purchasedFilter.click();
    await page.getByRole('heading', { name: 'Nenhum item em comprado' }).waitFor();
    manifest.interactions.push({ id: 'purchased-filter', passed: await purchasedFilter.getAttribute('aria-pressed') === 'true' && await page.locator('[data-item-status="purchased"]').count() === 0 });
    await page.getByRole('button', { name: 'Todos', exact: true }).click();

    await organize.click();
    await page.getByRole('menuitem', { name: 'Agrupar por categoria' }).click();
    await page.locator('[data-category-section]').first().waitFor();
    manifest.interactions.push({ id: 'restore-category-mode', passed: await page.locator('[data-category-section]').count() > 0 });

    const localSort = page.getByRole('button', { name: /Alimentos em ordem/ });
    const sortBefore = await localSort.getAttribute('aria-pressed');
    await localSort.click();
    manifest.interactions.push({ id: 'category-sort-independent', passed: await localSort.getAttribute('aria-pressed') !== sortBefore });

    const pendingStatus = page.getByRole('button', { name: /^Marcar .* como comprado$/ }).first();
    const pendingRow = pendingStatus.locator('xpath=ancestor::*[@data-shopping-row]');
    const itemName = (await pendingStatus.getAttribute('aria-label')).replace(/^Marcar /,'').replace(/ como comprado$/,'');
    await pendingStatus.click();
    await page.waitForFunction(name => [...document.querySelectorAll('[data-shopping-row]')].some(row => row.textContent.includes(name) && row.getAttribute('data-item-status') === 'purchased'), itemName);
    const undo = page.getByRole('button', { name: `Desfazer situação de ${itemName}` });
    await undo.waitFor();
    await undo.click();
    await page.waitForFunction(name => [...document.querySelectorAll('[data-shopping-row]')].some(row => row.textContent.includes(name) && row.getAttribute('data-item-status') === 'pending'), itemName);
    manifest.interactions.push({ id: 'mark-and-undo', passed: await pendingRow.getAttribute('data-item-status') === 'pending' });

    const alreadyHave = page.getByRole('button', { name: /^Marcar .* como já temos$/ }).first();
    const alreadyName = (await alreadyHave.getAttribute('aria-label')).replace(/^Marcar /,'').replace(/ como já temos$/,'');
    await alreadyHave.click();
    await page.waitForFunction(name => [...document.querySelectorAll('[data-shopping-row]')].some(row => row.textContent.includes(name) && row.getAttribute('data-item-status') === 'already_have'), alreadyName);
    manifest.interactions.push({ id: 'already-have', passed: true, item: alreadyName });

    const editTrigger = page.getByRole('button', { name: /^Editar / }).first();
    await editTrigger.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor();
    await capture(page,390,844,'compra-item-editor');
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    manifest.interactions.push({ id: 'editor-escape-focus-return', passed: await editTrigger.evaluate(element => element === document.activeElement) });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await editTrigger.click();
    await page.getByRole('dialog').waitFor();
    const reducedAnimation = await page.locator('[data-sheet-panel]').evaluate(element => ({ animation: getComputedStyle(element).animationName, duration: getComputedStyle(element).animationDuration }));
    await capture(page,390,844,'compra-item-editor-reduced-motion');
    manifest.checks.push({ id: 'editor-reduced-motion', passed: reducedAnimation.animation === 'none' && reducedAnimation.duration === '0s', value: reducedAnimation });
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await context.close();
  }

  for (const [width,height] of [[390,844],[1440,900]]) {
    const context = await createContext(width,height);
    const page = await context.newPage();
    page.on('pageerror', error => manifest.errors.push({ surface: 'states', viewport: `${width}x${height}`, message: error.message }));
    await page.goto('http://127.0.0.1:4173/app?scenario=error');
    await page.getByText('Não foi possível carregar os dados da casa. Verifique a conexão e tente novamente.').waitFor({ state: 'attached' });
    await page.locator('details summary').first().click();
    await capture(page,width,height,'compra-load-error');
    await page.goto('http://127.0.0.1:4173/app?scenario=loading');
    await page.getByText('Liberar resposta da fixture').waitFor();
    await capture(page,width,height,'compra-loading');
    await page.getByRole('button',{name:'Liberar resposta da fixture'}).click();
    await page.getByRole('heading',{name:'Compra ilustrativa da casa para o mês'}).waitFor();
    manifest.interactions.push({ id: `${width}x${height}-loading-release`, passed: true });
    await context.close();
  }

  for (const [width,height] of [[390,844],[1440,900]]) {
    const context = await createContext(width,height);
    for (const [id,route] of [['landing','/'],['login','/login'],['reset','/reset-password']]) {
      const page = await context.newPage();
      page.on('pageerror', error => manifest.errors.push({ surface:id, viewport:`${width}x${height}`, message:error.message }));
      const response = await page.goto(`http://127.0.0.1:4173${route}`,{waitUntil:'domcontentloaded'});
      await page.locator('h1').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => ({
        heading:document.querySelector('h1')?.textContent?.trim() ?? null,
        horizontalOverflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,
        font:getComputedStyle(document.body).fontFamily,
      }));
      const file = `smoke-${width}x${height}-${id}.png`;
      await page.screenshot({path:path.join(output,file)});
      manifest.captures.push({id:`smoke-${id}`,file,route,viewport:{width,height},status:response?.status()??null,...result});
      manifest.checks.push({id:`smoke-${id}-${width}x${height}`,passed:Boolean(response?.ok())&&result.horizontalOverflow===0,value:{status:response?.status()??null,...result}});
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
}

const failedChecks = manifest.checks.filter(check => !check.passed);
const failedInteractions = manifest.interactions.filter(check => !check.passed);
if (manifest.errors.length || failedChecks.length || failedInteractions.length) {
  throw new Error(`Evidence failures: ${manifest.errors.length} page errors, ${failedChecks.length} checks, ${failedInteractions.length} interactions. See manifest.json.`);
}
