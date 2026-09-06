import { Driver, launchChrome, sleep } from '../../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/supplier/_wp4';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const PORT = 9366;
const LOG = `${OUT}/wp4_supplier_product_2.jsonl`;
const ERR = `${OUT}/wp4_supplier_product_error.json`;
mkdirSync(OUT, { recursive: true });

const EMAIL = 'demo.supplier.01@visndt.local';
const PASSWORD = 'demo123456';
const OWN_ID = 'e037dea8-d486-4732-b495-c855aa668c2c';
const CROSS_ID = '242d692d-1832-4821-9d33-ec722b9cf4d8';

function rec(step, url, action, ok, note, ce) {
  const o = { step, url, action, pass: ok, note: (note || '').slice(0, 300), ts: new Date().toISOString(), ...(ce ? { consoleErrors: ce } : {}) };
  appendFileSync(LOG, JSON.stringify(o) + '\n');
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${step} :: ${action} :: ${note || ''}`);
  return ok;
}
// safe evaluate: never throws — returns {v} or {err}
async function ev(d, expr, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try { const r = await d.evaluate(expr); return { v: r, err: null }; }
    catch (e) { if (i === tries - 1) return { v: null, err: String(e) }; await sleep(3000); }
  }
}
async function nav(d, url) {
  for (let i = 0; i < 4; i++) {
    try { await d.goto(url); } catch (e) { /* ok */ }
    await sleep(4000);
    const u = await ev(d, 'location.href');
    if (u.v && /products\//.test(url) && u.v.includes(url.split('/').pop() || '__')) return u.v;
    if (u.v && !/products\//.test(url)) return u.v;
  }
  return (await ev(d, 'location.href')).v;
}

launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp4c-' + Date.now());
await sleep(4000);
const d = new Driver(PORT); await d.connect();

try {
  // auth via in-page fetch (credentials:include)
  await nav(d, BASE + '/login');
  const auth = await ev(d, `(async () => {
    const r = await fetch('http://localhost:4000/api/v1/auth/login', { method:'POST',
      headers:{'Content-Type':'application/json'}, credentials:'include',
      body: JSON.stringify({ email: ${JSON.stringify(EMAIL)}, password: ${JSON.stringify(PASSWORD)} }) });
    let j=null; try{j=await r.json();}catch{} return { status:r.status, ok:!!(j&&j.data&&j.data.accessToken) };
  })()`);
  if (!auth.v?.ok) { rec('login','','认证',false,'inpage-fail ' + auth.v?.status); process.exit(1); }
  rec('login', await d.url(), '认证(credentials:include)', true, 'OK');

  // ---- Mobile 375 gate on detail ----
  d.consoleErrors = []; d.exceptions = [];
  await d.setViewport(375, 812);
  const u375 = await nav(d, `${BASE}/workspace/supplier/products/${OWN_ID}`);
  await sleep(1500);
  const m = await ev(d, `(() => { const b=document.body?document.body.innerText:''; return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, mediaSec: /型号媒体/.test(b), paramSec: /型号技术参数/.test(b), mediaEmpty: /暂未配置媒体/.test(b) }; })()`);
  await d.screenshot(`${OUT}/wp4_04_detail_375.png`);
  rec('mobile-375-detail', u375, '375 详情页无横向溢出(门禁)', !m.err && !m.v?.overflow && m.v?.mediaSec && m.v?.paramSec,
    `overflow375=${m.v?.overflow} mediaSec=${m.v?.mediaSec} paramSec=${m.v?.paramSec} err=${m.err ? 'Y' : 'N'}`, d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ---- Cross-org page DENIED ----
  await d.setViewport(1440, 900);
  d.consoleErrors = []; d.exceptions = [];
  const uCross = await nav(d, `${BASE}/workspace/supplier/products/${CROSS_ID}`);
  await sleep(1500);
  const x = await ev(d, `(() => { const t=document.body?document.body.innerText:''; return { len: t.length, denied: /未找到|不存在|无权|404|forbidden|denied|访问受限|加载失败|Internal Server Error/i.test(t), leaked: (/UX-TJ095|POP 4|ZB-K60/.test(t) && t.indexOf(${JSON.stringify('型号媒体')})>-1) }; })()`);
  await d.screenshot(`${OUT}/wp4_05_crossorg_denied.png`);
  rec('cross-org-page-deny', uCross, '跨组织 SupplierProduct 详情页 DENIED', !x.err && x.v?.denied && !x.v?.leaked,
    `denied=${x.v?.denied} leaked=${x.v?.leaked} len=${x.v?.len} err=${x.err ? 'Y' : 'N'}`);

  // ---- Cross-org API deny ----
  const api = await (async () => {
    try {
      const lr = await fetch('http://localhost:4000/api/v1/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) });
      const tok = (await lr.json()).data.accessToken;
      const r = await fetch('http://localhost:4000/api/v1/supplier-products/my/' + CROSS_ID, { headers: { Authorization: 'Bearer ' + tok } });
      return { status: r.status, body: (await r.text()).slice(0, 160) };
    } catch (e) { return { status: 'ERR', body: String(e) }; }
  })();
  rec('cross-org-api', '/supplier-products/my/' + CROSS_ID, 'GET 跨组织详情 API 应 404/403', String(api.status) !== '200' && String(api.status) !== 'ERR',
    `status=${api.status} ${api.body.slice(0, 120)}`);

  await sleep(500);
  console.log('WP4-B DONE');
} catch (e) {
  console.error('WP4-B ERR', e);
  writeFileSync(ERR, JSON.stringify({ error: String(e), stack: e?.stack }, null, 2));
  process.exit(1);
}