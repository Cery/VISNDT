// WP-3A.3 assessment — current Product Detail + Related Discovery runtime state.
// Real headed Chrome. Evaluate before deciding reconstruction scope.
import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';

const BASE = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const PORT = 9371;
const UD = '.edge-cdp-3a3';
const SHOTS = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/827';

async function until(d, expr, ms = 9000, step = 250) {
  const t0 = Date.now(); let last = null;
  while (Date.now() - t0 < ms) { last = await d.evaluate(expr).catch(() => null); if (last) return last; await sleep(step); }
  return last;
}
const results = [];
function record(area, action, note, pass) {
  results.push({ pass: !!pass });
  console.log(`${pass ? 'PASS' : 'INFO'} | ${area} | ${action} | ${note}`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect(); await sleep(1200);

  const PROD_A = 'a5a26d69-320f-4c95-a480-3d15f2faea2a'; // POP 4 三维扫描仪 (has 1 related)
  const PROD_B = '38a711ff-9352-40ea-978b-90ecd566b826'; // MetroY Ultra

  // ---------- 1. /products list → detail A ----------
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/products`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(800);
  await d.goto(`${BASE}/products/${PROD_A}`); await d.waitFor(`document.body.innerText.includes('POP 4')`, 15000); await sleep(1200);

  // detail identity
  const h1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  record('Detail', 'H1 identity', h1, h1.includes('POP 4'));
  // tabs present
  const tabs = await d.evaluate(`Array.from(document.querySelectorAll('[role=tab]')).map(t=>t.innerText.trim()).join('|')`);
  record('Detail', 'Tab bar', tabs, tabs.split('|').length >= 5);
  // overview spec cells
  const cells = await d.evaluate(`(document.body.innerText.match(/MODEL|CATEGORY|SPEC FIELDS|REV/g)||[]).join(',')`);
  record('Detail', 'Spec cells', cells.slice(0,120), cells.includes('MODEL'));
  // description
  const desc = await d.evaluate(`(document.body.innerText.includes('能力描述'))`);
  record('Detail', 'Description block', String(desc), desc);
  // capability profile
  const cap = await d.evaluate(`(document.body.innerText.includes('能力档案')||document.body.innerText.includes('能力提供商与供应关系'))`);
  record('Detail', 'Capability profile', String(cap), cap);
  // supplier context (capability provider section)
  const sup = await d.evaluate(`(document.body.innerText.includes('能力提供商')||document.body.innerText.includes('已发布能力型号'))`);
  record('Detail', 'Supplier context', String(sup), sup);

  // related products tab
  await d.evaluate(`(() => { const t=Array.from(document.querySelectorAll('[role=tab]')).find(t=>t.innerText.includes('相关能力')); if(t) t.click(); return !!t; })()`);
  const rel = await until(d, `document.body.innerText.includes('相关能力') && (document.body.innerText.includes('MetroY')||document.body.innerText.includes('暂无相关产品'))`, 8000);
  const relText = await d.evaluate(`(document.body.innerText.includes('MetroY Ultra') ? 'MetroY present' : (document.body.innerText.includes('暂无相关产品') ? 'empty-state' : 'none'))`);
  record('Related', 'Related products tab', relText, relText === 'MetroY present');
  await d.screenshot(`${SHOTS}/3a3_detail_related_1440.png`);

  // navigate A → B
  await d.evaluate(`(() => { const a=Array.from(document.querySelectorAll('a[href^="/products/"]')).find(a=>a.getAttribute('href').includes('${PROD_B}')); if(a){ a.click(); return true;} return false; })()`);
  const onB = await until(d, `location.pathname.includes('${PROD_B}')`, 8000);
  record('Related', 'A → B detail nav', `onB=${onB}`, !!onB);
  await d.screenshot(`${SHOTS}/3a3_detail_B_1440.png`);

  // ---------- 2. security probe (browser context) ----------
  const scan = await d.evaluate(`(async () => {
    const r = await fetch(${JSON.stringify(`${API}/products/${PROD_A}`)}, {credentials:'include'});
    const j = await r.json();
    const s = JSON.stringify(j);
    const creds = s.match(/passwordHash|hashedPassword|"password"|refreshToken|accessToken|"secret"/g);
    return { status: r.status, creds: creds ? Array.from(creds) : [] };
  })()`);
  record('Security', 'detail API creds', `status=${scan.status} creds=[${(scan.creds||[]).join(',')}]`, scan.status === 200 && !(scan.creds||[]).length);

  // ---------- 3. responsive 375/768/1024 ----------
  for (const [w,h] of [[375,812],[768,900],[1024,900]]) {
    await d.setViewport(w, h); await d.goto(`${BASE}/products/${PROD_A}`); await d.waitFor(`!!document.querySelector('h1')`, 12000); await sleep(700);
    const ov = await d.hasOverflow();
    const tabsVisible = await d.evaluate(`(document.querySelector('[role=tab]')?.offsetParent !== null)`);
    record('Responsive', `${w} detail`, `overflow=${ov} tabsVisible=${tabsVisible}`, !ov && tabsVisible);
    if (w === 375) await d.screenshot(`${SHOTS}/3a3_detail_375.png`);
  }

  // ---------- 4. console errors ----------
  await sleep(600);
  record('Console', 'errors', `${d.consoleErrors.length} [${d.consoleErrors.slice(0,3).join('; ')}]`, d.consoleErrors.length === 0);

  const passed = results.filter(r=>r.pass).length;
  console.log(`\n=== ASSESS: ${passed}/${results.length} PASS ===`);
  await sleep(300);
  process.exit(0);
})().catch(e=>{ console.error('ERR', e); process.exit(2); });