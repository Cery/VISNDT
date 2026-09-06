import { Driver, launchChrome, sleep } from '../../../../_ux_browser_helper.mjs';
import { mkdirSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/supplier/_wp4';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const PORT = 9368;
const LOG = `${OUT}/wp4_regression.jsonl`;

let chromeFailed = false;
function rec(step, url, action, ok, note, ce) {
  const o = { step, url, action, pass: ok, note: (note || '').slice(0, 300), ts: new Date().toISOString(), ...(ce ? { consoleErrors: ce } : {}) };
  appendFileSync(LOG, JSON.stringify(o) + '\n');
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${step} :: ${action} :: ${note || ''}`);
  return ok;
}
async function waitBody(d, minLen = 300, timeout = 25000, minText = []) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try { const t = await d.bodyText(); if (t.length >= minLen && minText.every(k => t.includes(k))) return t; } catch {}
    await sleep(1200);
  }
  return await d.bodyText();
}
async function nav(url) {
  try { await d.goto(url); } catch (e) { /* compile timeout — ok */ }
  await sleep(3500);
  return await d.url();
}
async function loginAs(email) {
  await d.goto(BASE + '/login'); await sleep(3500);
  const res = await d.evaluate(`(async () => {
    const r = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ email: ${JSON.stringify(email)}, password: "demo123456" }),
    });
    let j = null; try { j = await r.json(); } catch {}
    return { status: r.status, ok: !!(j && j.data && j.data.accessToken) };
  })()`);
  return res.ok;
}

launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp4r-' + Date.now());
await sleep(4000);
const d = new Driver(PORT); await d.connect();

try {
  // ── Guest public regression (1440 + no console errors + no overflow) ──
  const publicRoutes = [
    ['home', '/', ['能力发现', '产品']],
    ['search', '/search?q=内窥镜', []],
    ['products', '/products', ['产品']],
    ['product-detail', '/products/zb-tj095', ['ZB-TJ095']],
    ['knowledge', '/knowledge', ['知识']],
    ['solutions', '/solutions', ['解决方案']],
  ];
  for (const [step, path, keys] of publicRoutes) {
    d.consoleErrors = []; d.exceptions = [];
    await d.setViewport(1440, 900);
    await nav(BASE + path);
    const body = await waitBody(d, 300, 25000, keys);
    const okKeys = keys.every(k => body.includes(k));
    const over = await d.hasOverflow();
    rec(`pub-${step}`, await d.url(), `公开 ${step} 200 渲染(回归)`, okKeys && !over,
      `keys=${okKeys} overflow=${over} len=${body.length}`,
      d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);
  }

  // ── Buyer Workspace regression (auth as buyer) ──
  const buyerOk = await loginAs('demo.buyer.01@visndt.local');
  rec('buyer-login', await d.url(), 'Buyer 认证(回归)', buyerOk, 'buyerOk=' + buyerOk);
  d.consoleErrors = []; d.exceptions = [];
  await nav(BASE + '/dashboard/buyer');
  const bb = await waitBody(d, 300, 25000, ['采购旅程', '需求']);
  const over = await d.hasOverflow();
  rec('buyer-workspace', await d.url(), 'Buyer Workspace 渲染(回归)', /采购旅程/.test(bb), `overflow=${over} len=${bb.length}`,
    d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  await sleep(500);
  console.log('WP4 REGRESSION DONE');
} catch (e) {
  console.error('WP4 REG ERR', e);
  process.exit(1);
}