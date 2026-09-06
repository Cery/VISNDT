import { Driver, launchChrome, sleep } from '../../../../_ux_browser_helper.mjs';
import { mkdirSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/supplier/_wp4';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const PORT = 9366;
const LOG = `${OUT}/wp4_public_viewports.jsonl`;

const EMAIL = 'demo.supplier.01@visndt.local';
const PASSWORD = 'demo123456';
const OWN_ID = 'e037dea8-d486-4732-b495-c855aa668c2c';

const pass = [];
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
async function auth() {
  await d.goto(BASE + '/login'); await sleep(3500);
  const res = await d.evaluate(`(async () => {
    const r = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ email: ${JSON.stringify(EMAIL)}, password: ${JSON.stringify(PASSWORD)} }),
    });
    let j = null; try { j = await r.json(); } catch {}
    return { status: r.status, ok: !!(j && j.data && j.data.accessToken) };
  })()`);
  if (!res.ok) return false;
  await d.goto(BASE + '/'); await sleep(3000);
  return !/login/.test(await d.url());
}

launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp4c-' + Date.now());
await sleep(4000);
const d = new Driver(PORT); await d.connect();

try {
  const a = await auth();
  rec('login', await d.url(), 'Supplier 认证', !!a, 'auth=' + a);
  if (!a) throw new Error('AUTH FAIL');

  // ── Supplier detail at 1024 / 768 (spot-check) ──
  const detailUrl = `${BASE}/workspace/supplier/products/${OWN_ID}`;
  for (const vp of [1024, 768]) {
    d.consoleErrors = []; d.exceptions = [];
    await d.setViewport(vp, 900);
    await nav(detailUrl);
    const body = await waitBody(d, 300, 25000, ['型号媒体']);
    const over = await d.hasOverflow();
    rec(`vp-${vp}-detail`, await d.url(), `${vp} 详情页无横向溢出`, !over && /型号媒体/.test(body), `overflow=${over} mediaSec=${/型号媒体/.test(body)}`,
      d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);
  }

  // ── Public Product Detail: PUBLISHED supporting model context (public route — public regardless of session) ──
  d.consoleErrors = []; d.exceptions = [];
  for (const [vp, label] of [[1440, '1440'], [375, '375']]) {
    await d.setViewport(vp, 900);
    await nav(`${BASE}/products/zb-tj095`);
    const body = await waitBody(d, 400, 25000, ['ZB-TJ095']);
    // published model name "ZB-TJ095" present; unpublished "UX-TJ095" must NOT appear
    const over = await d.hasOverflow();
    const hasPublished = /ZB-TJ095 光纤检测内窥镜/.test(body) || body.includes('ZB-TJ095');
    const leakedUnpublished = body.includes('UX-TJ095-TEST');
    await d.screenshot(`${OUT}/wp4_public_${vp}.png`);
    rec(`public-${vp}`, await d.url(), `公开产品页 ${label} 已发布型号上下文、未发布不泄露`, hasPublished && !leakedUnpublished && !over,
      `published=${hasPublished} leakUnpublished=${leakedUnpublished} overflow=${over}`);
  }

  await sleep(500);
  console.log('WP4 PUBLIC/VIEWPORT DONE');
} catch (e) {
  console.error('WP4 PUB ERR', e);
  process.exit(1);
}