import { Driver, launchChrome, sleep } from '../../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/supplier/_wp4';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const PORT = 9363;
const LOG = `${OUT}/wp4_supplier_product.jsonl`;
const ERR = `${OUT}/wp4_supplier_product_error.json`;

const EMAIL = 'demo.supplier.01@visndt.local';
const PASSWORD = 'demo123456';
const OWN_ID = 'e037dea8-d486-4732-b495-c855aa668c2c';   // 明视 org
const CROSS_ID = '242d692d-1832-4821-9d33-ec722b9cf4d8'; // 深圳市微视 org (cross-org → DENIED)

let withDate = true;
const pass = [];
function rec(step, url, action, ok, note, ce) {
  const o = { step, url, action, pass: ok, note: (note || '').slice(0, 300), ...(withDate ? { ts: new Date().toISOString() } : {}), ...(ce ? { consoleErrors: ce } : {}) };
  appendFileSync(LOG, JSON.stringify(o) + '\n');
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${step} :: ${action} :: ${note || ''}`);
  return ok;
}
async function hasField(d, sel) { return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }
async function waitBody(d, minLen = 400, timeout = 25000, minText = []) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try {
      const t = await d.bodyText();
      if (t.length >= minLen && minText.every(k => t.includes(k))) return t;
    } catch {}
    await sleep(1200);
  }
  return await d.bodyText();
}
// Robust navigation: ignores Page.navigate timeout (slow dev-compile), ensures we land on the target.
async function nav(url) {
  try { await d.goto(url); } catch (e) { /* timeout while compiling — ok */ }
  await sleep(3500);
  return await d.url();
}

launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp4b-' + Date.now());
await sleep(4000);
const d = new Driver(PORT); await d.connect();

// ---------- Authenticate via in-page fetch (credentials:include) so the browser persists auth cookies natively ----------
async function auth() {
  await d.goto(BASE + '/login'); await sleep(3500);
  const res = await d.evaluate(`(async () => {
    const r = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: ${JSON.stringify(EMAIL)}, password: ${JSON.stringify(PASSWORD)} }),
    });
    let j = null; try { j = await r.json(); } catch {}
    return { status: r.status, ok: !!(j && j.data && j.data.accessToken), email: j?.data?.user?.email };
  })()`);
  if (!res.ok) return { ok: false, url: await d.url(), how: 'inpage-fail ' + res.status };
  await d.goto(BASE + '/'); await sleep(3500);
  const u = await d.url();
  return { ok: u && !/login/.test(u), url: u, how: 'inpage' };
}

try {
  // ---- 1. Authenticate (in-page fetch with credentials:include) ----
  const a = await auth();
  rec('login', a.url || await d.url(), 'Supplier 认证(API token → cookie 注入 / UI)', a.ok, 'auth=' + (a.ok ? ('OK via ' + (a.how || 'unknown')) : ('FAIL ' + JSON.stringify(a))));
  if (!a.ok) throw new Error('AUTH FAIL: ' + JSON.stringify(a));
  await sleep(2000);

  // ---- 2. My Products list ----
  d.consoleErrors = []; d.exceptions = [];
  await nav(BASE + '/workspace/supplier/products');
  const listBody = await waitBody(d, 300, 25000, ['我的产品']);
  const listHasModel = /UX-TJ095-TEST|UX光纤/.test(listBody);
  const listOver = await d.hasOverflow();
  await d.screenshot(`${OUT}/wp4_02_products_1440.png`);
  rec('my-products', await d.url(), 'My Products 列表渲染', listHasModel && /我的产品/.test(listBody),
    `hasModel=${listHasModel} overflow=${listOver} len=${listBody.length}`,
    d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ---- 3. Open own detail ----
  d.consoleErrors = []; d.exceptions = [];
  await nav(`${BASE}/workspace/supplier/products/${OWN_ID}`);
  const detBody = await waitBody(d, 300, 25000, ['型号媒体']);
  const hasMediaSec = /型号媒体/.test(detBody);
  const hasParamSec = /型号技术参数/.test(detBody);
  const hasMediaEmpty = /暂未配置媒体/.test(detBody);
  const hasParamEmpty = /尚未填写型号级参数覆盖/.test(detBody);
  await d.screenshot(`${OUT}/wp4_03_detail_1440.png`);
  rec('own-detail', await d.url(), 'Own SupplierProduct 详情页(NESTED image 375 later)',
    hasMediaSec && hasParamSec && hasMediaEmpty && hasParamEmpty,
    `mediaSec=${hasMediaSec} paramSec=${hasParamSec} mediaEmpty=${hasMediaEmpty} paramEmpty=${hasParamEmpty} model=${/UX-TJ095-TEST/.test(detBody)}`,
    d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ---- 4. No broken image / no overflow 1440 ----
  const broken = await d.evaluate(`Array.from(document.querySelectorAll('img')).some(i => i.complete && i.naturalWidth === 0)`);
  const detailOver1440 = await d.hasOverflow();
  rec('own-detail-render', await d.url(), '无断图 / 1440 无横向溢出', !broken && !detailOver1440,
    `brokenImage=${broken} overflow1440=${detailOver1440}`);

  // ---- 5. Mobile 375 gate ----
  await d.setViewport(375, 812);
  await nav(`${BASE}/workspace/supplier/products/${OWN_ID}`);
  const mobBody = await waitBody(d, 300, 25000, ['型号媒体']);
  const mobOver = await d.hasOverflow();
  await d.screenshot(`${OUT}/wp4_04_detail_375.png`);
  rec('mobile-375-detail', await d.url(), '375 详情页无横向溢出(门禁)', !mobOver && /型号媒体/.test(mobBody),
    `overflow375=${mobOver} mediaSec=${/型号媒体/.test(mobBody)}`);

  // ---- 6. Cross-org DENIED (detail page renders error state) ----
  await d.setViewport(1440, 900);
  d.consoleErrors = []; d.exceptions = [];
  await nav(`${BASE}/workspace/supplier/products/${CROSS_ID}`);
  const xBody = await (async () => { const t = await d.bodyText(); return t; })();
  await d.screenshot(`${OUT}/wp4_05_crossorg_denied.png`);
  const leaked = /未找到|不存在|无权|404|forbidden|denied|访问受限|加载失败|Internal Server Error/i.test(xBody)
    ? false : (xBody.includes('UX-TJ095-TEST') || xBody.includes('POP 4') || xBody.includes('ZB-')); // if error hint present -> not a leak
  const deniedHint = /未找到|不存在|无权|404|forbidden|denied|not found|访问受限|加载失败/i.test(xBody);
  rec('cross-org-deny', await d.url(), '跨组织 SupplierProduct 详情 DENIED', deniedHint && !leaked,
    `crossId=${CROSS_ID} deniedHint=${deniedHint} leaked=${leaked} len=${xBody.length}`,
    d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ---- 7. API-level cross-org deny ----
  let api;
  try {
    const login = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const tok = (await login.json()).data.accessToken;
    const r = await fetch('http://localhost:4000/api/v1/supplier-products/my/' + CROSS_ID, {
      headers: { Authorization: 'Bearer ' + tok },
    });
    api = { status: r.status, body: (await r.text()).slice(0, 160) };
  } catch (e) { api = { status: 'ERR', body: String(e) }; }
  rec('cross-org-api', '/supplier-products/my/' + CROSS_ID, 'GET 跨组织详情 API 应 404/403', String(api.status) !== '200' && String(api.status) !== 'ERR',
    `status=${api.status} ${api.body.slice(0, 130)}`);

  await sleep(500);
  console.log('WP4 BROWSER DONE');
} catch (e) {
  console.error('WP4 ERR', e);
  writeFileSync(ERR, JSON.stringify({ error: String(e), stack: e?.stack }, null, 2));
  process.exit(1);
}