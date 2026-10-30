import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = fs.readFileSync(path.join(root, 'original/dist/r2.js'), 'utf8');
const start = input.indexOf('var homeItems=[');
const stop = input.indexOf('var savedHouse =');
if (start < 0 || stop < 0) throw new Error('Original fixture definitions not found.');
// Isolated evaluation of data declarations only; no DOM application execution.
const result = vm.runInNewContext(
  input.slice(start, stop) + '\n({homeItems,homeCatalog,houses,screenMeta,paletteOptions})',
  Object.create(null),
  { timeout: 1000 }
);
const folder = path.join(root, 'fixtures');
fs.mkdirSync(folder, {recursive: true});
const write = (name, data) => fs.writeFileSync(
  path.join(folder, name), JSON.stringify(data, null, 2) + '\n', 'utf8'
);
write('demo-seed.json', {
  provenance: {
    type: 'exact_demonstration_data',
    source: 'original/dist/r2.js',
    commit: 'f0214b71d9497caa62ccaa3b804579f7cd757959',
    realProductionData: false
  },
  ...result
});
write('initial-state.json', {
  provenance: {
    type: 'transcribed_original_default',
    source: 'original/dist/r2.js',
    note: 'house defaults to home unless localStorage has campo selected'
  },
  state: {
    view: 'compra', device: '390', palette: 'eucalipto', motion: 'standard',
    house: 'home', purchaseFilter: 'all', productCategory: 'Todos',
    q: '', historyDetail: null, historyMonth: 'Todos', houseMenu: false,
    modal: null, modalMeta: null, error: '', invite: null,
    lastChanged: null, lastAdded: null, filterChanged: false
  },
  localStorage: { 'restok-r25-active-house': 'home' }
});
write('scenarios.json', {
  provenance: {
    type: 'derived_qa_matrix',
    note: 'The tests are suggestions; they have not been executed. synthetic=true means not in the published seed.'
  },
  cases: [
    { id: 'compra_home', house: 'home', view: 'compra', fixture: 'houses.home.items' },
    { id: 'catalog_home', house: 'home', view: 'casa', fixture: 'houses.home.catalog' },
    { id: 'history_home', house: 'home', view: 'historico', fixture: 'houses.home.history' },
    { id: 'people_home', house: 'home', view: 'pessoas', fixture: 'houses.home.members' },
    { id: 'compra_campo', house: 'campo', view: 'compra', fixture: 'houses.campo.items' },
    { id: 'catalog_campo', house: 'campo', view: 'casa', fixture: 'houses.campo.catalog' },
    { id: 'history_empty_campo', house: 'campo', view: 'historico', fixture: 'houses.campo.history' },
    { id: 'people_campo', house: 'campo', view: 'pessoas', fixture: 'houses.campo.members' },
    { id: 'todo_filter', house: 'home', view: 'compra', stateOverride: {purchaseFilter:'todo'} },
    { id: 'done_filter', house: 'home', view: 'compra', stateOverride: {purchaseFilter:'done'} },
    { id: 'have_filter', house: 'home', view: 'compra', stateOverride: {purchaseFilter:'have'} },
    { id: 'coffee_search', house: 'home', view: 'compra', stateOverride: {q:'Café'} },
    { id: 'empty_search', house: 'home', view: 'casa', stateOverride: {q:'Produto inexistente'} },
    { id: 'oct_history_detail', house: 'home', view: 'historico', stateOverride: {historyDetail:'oct1'} },
    { id: 'budget_zero', house: 'home', view: 'compra', synthetic: true, fixtureOverride: {budget:0} },
    { id: 'budget_exceeded', house: 'home', view: 'compra', synthetic: true, fixtureOverride: {budget:1} }
  ]
});
console.log('Fixtures extracted from original source.');
