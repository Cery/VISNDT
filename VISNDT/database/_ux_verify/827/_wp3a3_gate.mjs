// WP-3A.3 Product Detail + Related Discovery — final closeout gate.
// Real headed Chrome. Covers: detail structure, real related chain (A→B→B detail),
// empty-state (no-related product), tabs keyboard nav (new a11y), responsive, security.
import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';

const BASE = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const PORT = 9375;
const UD = '.edge-cdp-3a3gate';
const SHOTS = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/827';

const PROD_A = 'a5a26d69-320f-4c95-a480-3d15f2faea2a'; // POP 4 三维扫描仪 (related=1)
const PROD_B = '38a711ff-9352-40ea-978b-90ecd566b826'; // MetroY Ultra 高精度三维扫描仪
const PROD_EMPTY = 'ebb1c034-4280-480b-89ce-29753660e126'; // ZB-K60 内窥镜 (related=0)

async function until(d, expr, ms = 9000, step = 250) {
  const t0 = Date.now(); let last = null;
  while (Date.now() - t0 < ms) { last = await d.evaluate(expr).catch(() => null); if (last) return last; await sleep(step); }
  return last;
}
function esc(d) {
  return d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }).then(() =>
    d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }));
}
const results = [];
function record(area, action, note, pass) {
  results.push({ pass: !!pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${area} | ${action} | ${note}`);
}

async function credScan(d, url) {
  return d.evaluate(`(async () => {
    const r = await fetch(${JSON.stringify(url)}, {credentials:'include'});
    const j = await r.json();
    const s = JSON.stringify(j);
    const creds = s.match(/passwordHash|hashedPassword|"password"|refreshToken|accessToken|"secret"|privateContact/g);
    return { status: r.status, creds: creds ? Array.from(creds) : [] };
  })()`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect(); await sleep(1200);

  // ============ 1. Product List → Detail A ============
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/products`); await d.waitFor(`!!document.querySelector('header')`, 15000);
  const cardCount = await until(d, `(() => { const n=Array.from(document.querySelectorAll('a[href^="/products/"]')).filter(a=>/^\\/products\\/[a-zA-Z0-9-]+/.test(a.getAttribute('href')||'')).length; return n > 2 ? n : 0; })()`, 9000);
  record('List', 'products list cards', `${cardCount}`, Number(cardCount) >= 4);

  await d.goto(`${BASE}/products/${PROD_A}`); await d.waitFor(`document.body.innerText.includes('POP 4')`, 15000); await sleep(1200);
  const h1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  record('Detail', 'H1 identity', h1, h1.includes('POP 4'));
  const tabs = await d.evaluate(`Array.from(document.querySelectorAll('[role=tab]')).map(t=>t.innerText.trim()).join('|')`);
  record('Detail', 'Tab bar', tabs, tabs.split('|').length === 7);
  const specCells = await d.evaluate(`(document.body.innerText.match(/MODEL|CATEGORY|SPEC FIELDS|REV/g)||[]).join(',')`);
  record('Detail', 'Spec ledger cells', specCells, specCells.includes('MODEL') && specCells.includes('REV'));
  const descBlock = await d.evaluate(`document.body.innerText.includes('能力描述')`);
  record('Detail', 'Summary/description', String(descBlock), descBlock);
  const capProfile = await d.evaluate(`document.body.innerText.includes('能力档案') && document.body.innerText.includes('能力提供商与供应关系')`);
  record('Detail', 'Capability profile + supplier rel', String(capProfile), capProfile);
  const breadcrumb = await d.evaluate(`!!document.querySelector('nav[aria-label]') || document.body.innerText.includes('能力列表')`);
  record('Detail', 'Breadcrumb nav', String(breadcrumb), breadcrumb);

  // ============ 2. Parameters tab (real data) ============
  await d.evaluate(`(() => { const t=Array.from(document.querySelectorAll('[role=tab]')).find(t=>t.innerText.includes('技术参数')); if(t) t.click(); return !!t; })()`);
  const params = await until(d, `document.body.innerText.includes('技术参数') && (document.querySelector('table') !== null)`, 8000);
  const paramRows = await d.evaluate(`document.querySelectorAll('table tbody tr').length`);
  record('Specs', 'Parameters tab real table', `rows=${paramRows}`, !!params && Number(paramRows) > 0);

  // ============ 3. Tabs keyboard navigation (new a11y) ============
  // normalize: focus overview (Home), regardless of prior tab state
  await d.evaluate(`document.querySelector('#tab-overview').focus()`);
  await d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await sleep(300);
  const focusedOverview = await d.evaluate(`document.activeElement?.id === 'tab-overview'`);
  // ArrowRight → specifications (from overview)
  await d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await sleep(400);
  const afterRight = await d.evaluate(`({active: document.activeElement?.id||'', selected: document.querySelector('[role=tab][aria-selected=true]')?.id||''})`);
  record('A11y', 'ArrowRight → next tab', JSON.stringify(afterRight), afterRight.active === 'tab-specifications' && afterRight.selected === 'tab-specifications');
  // End → related
  await d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await sleep(400);
  const afterEnd = await d.evaluate(`({active: document.activeElement?.id||'', selected: document.querySelector('[role=tab][aria-selected=true]')?.id||''})`);
  record('A11y', 'End → last tab', JSON.stringify(afterEnd), afterEnd.active === 'tab-related' && afterEnd.selected === 'tab-related');
  // ArrowLeft → knowledge
  await d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
  await d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
  await sleep(400);
  const afterLeft = await d.evaluate(`document.activeElement?.id||''`);
  record('A11y', 'ArrowLeft → prev tab', afterLeft, afterLeft === 'tab-knowledge');
  // Home → overview
  await d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await sleep(400);
  const afterHome = await d.evaluate(`document.activeElement?.id||''`);
  record('A11y', 'Home → first tab', afterHome, afterHome === 'tab-overview');
  // roving tabindex check
  const roving = await d.evaluate(`Array.from(document.querySelectorAll('[role=tab]')).map(t=>t.tabIndex).join(',')`);
  record('A11y', 'Roving tabindex', roving, roving === '0,-1,-1,-1,-1,-1,-1');
  // aria-controls + panel linkage
  const aria = await d.evaluate(`(() => { const t=document.querySelector('[role=tab]'); const p=document.querySelector('#product-detail-tabpanel'); return { controls: t?.getAttribute('aria-controls'), panelLabelledby: p?.getAttribute('aria-labelledby') }; })()`);
  record('A11y', 'aria-controls + panel labelledby', JSON.stringify(aria), aria.controls === 'product-detail-tabpanel' && (aria.panelLabelledby||'').startsWith('tab-'));

  // ============ 4. Related Discovery: A → B → B detail (real chain) ============
  await d.evaluate(`(() => { const t=Array.from(document.querySelectorAll('[role=tab]')).find(t=>t.innerText.includes('相关能力')); if(t) t.click(); return !!t; })()`);
  const relB = await until(d, `document.body.innerText.includes('MetroY Ultra')`, 8000);
  const relCardLink = await d.evaluate(`(() => { const a=Array.from(document.querySelectorAll('a[href^="/products/"]')).find(a=>a.getAttribute('href').includes('${PROD_B}')); return a?a.getAttribute('href'):''; })()`);
  record('Related', 'Related tab shows real product B', `link=${relCardLink}`, !!relB && relCardLink.includes(PROD_B));
  if (relCardLink) { await d.click(`a[href="${relCardLink}"]`); await sleep(2000); }
  const onB = await d.evaluate(`location.pathname`);
  const bH1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  record('Related', 'A → B detail nav', `${onB} | ${bH1}`, onB.includes(PROD_B) && bH1.includes('MetroY'));
  await d.screenshot(`${SHOTS}/3a3_gate_detail_B_1440.png`);

  // ============ 5. Empty state (ZB-K60, 0 related) ============
  await d.goto(`${BASE}/products/${PROD_EMPTY}`); await d.waitFor(`document.body.innerText.includes('ZB-K60')`, 15000); await sleep(1000);
  await d.evaluate(`(() => { const t=Array.from(document.querySelectorAll('[role=tab]')).find(t=>t.innerText.includes('相关能力')); if(t) t.click(); return !!t; })()`);
  const emptyState = await until(d, `document.body.innerText.includes('暂无相关产品')`, 8000);
  record('Related', 'Empty-state (no related)', String(emptyState), !!emptyState);
  await d.screenshot(`${SHOTS}/3a3_gate_empty_related_1440.png`);

  // ============ 6. Security (browser-context) ============
  const scanA = await credScan(d, `${API}/products/${PROD_A}`);
  record('Security', 'detail API creds', `status=${scanA.status} creds=[${(scanA.creds||[]).join(',')}]`, scanA.status === 200 && !(scanA.creds||[]).length);
  const scanList = await credScan(d, `${API}/products?status=ACTIVE&page=1&pageSize=5`);
  record('Security', 'list API creds', `status=${scanList.status} creds=[${(scanList.creds||[]).join(',')}]`, scanList.status === 200 && !(scanList.creds||[]).length);

  // ============ 7. Responsive 1440/1024/768/375 ============
  for (const [w,h] of [[1440,900],[1024,900],[768,900],[375,812]]) {
    await d.setViewport(w, h); await d.goto(`${BASE}/products/${PROD_A}`); await d.waitFor(`!!document.querySelector('h1')`, 12000); await sleep(700);
    const ov = await d.hasOverflow();
    const tabVisible = await d.evaluate(`(document.querySelector('[role=tab]')?.offsetParent !== null)`);
    record('Responsive', `${w} detail`, `overflow=${ov} tabVisible=${tabVisible}`, !ov && tabVisible);
    if (w === 375) { await d.screenshot(`${SHOTS}/3a3_gate_detail_375.png`); }
  }

  // ============ 8. Console errors ============
  await sleep(500);
  record('Console', 'errors during flow', `${d.consoleErrors.length} [${d.consoleErrors.slice(0,3).join('; ')}]`, d.consoleErrors.length === 0);

  const passed = results.filter(r=>r.pass).length;
  console.log(`\n=== WP-3A.3 GATE: ${passed}/${results.length} PASS ===`);
  await sleep(300);
  process.exit(passed === results.length ? 0 : 1);
})().catch(e=>{ console.error('SCRIPT ERR', e); process.exit(2); });