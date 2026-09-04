/** 803_M39 — authenticated Buyer/Supplier workflow runtime verification (CDP). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9381;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-803-wf-' + Date.now();
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_803_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-proxy-server', '--proxy-bypass-list=*',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
], { stdio: 'ignore' });

let msgId = 0; const pending = new Map(); let ws = null;
function connect(u) { return new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); }); }
function send(m, p = {}) { return new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); }); }
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(300); } throw new Error('no page'); }
async function nav(u, ms = 2500) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function setViewport(width, height) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
}

async function login(email) {
  await nav(WEB + '/login', 2500);
  const filled = await aev(`(() => {
    const setVal = (sel, v) => { const el = document.querySelector(sel); if(!el) return false; const proto = el.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el, v); el.dispatchEvent(new Event('input',{bubbles:true})); return true; };
    const okE = setVal('#login-email', ${JSON.stringify(email)});
    const okP = setVal('#login-password', ${JSON.stringify(PW)});
    return okE && okP;
  })()`);
  if (!filled) return { ok: false, why: 'form-not-found' };
  const didSubmit = await aev(`(() => { const f = document.querySelector('#login-password')?.closest('form'); if(!f) return null; try { f.requestSubmit(); return true; } catch { return false; } })()`);
  if (didSubmit !== true) return { ok: false, why: 'submit-failed' };
  // wait for redirect to /dashboard (role split) up to ~6s
  let dest = await aev('location.pathname');
  for (let i = 0; i < 24; i++) { await sleep(250); const p = await aev('location.pathname'); if (p && p.startsWith('/dashboard')) { dest = p; break; } }
  const logged = await aev(`(async () => { try { const r = await fetch('/api/v1/auth/me', { credentials: 'include' }); const j = await r.json(); return { status: r.status, role: j?.data?.workspaceRole || null }; } catch(e) { return { status: 0, role: null, err: String(e) }; } })()`);
  return { ok: true, dest, me: logged };
}

async function state(label, path, width) {
  const height = width <= 768 ? 2200 : 1000;
  await setViewport(width, height);
  await nav(WEB + path, 2600);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(250);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname, keep: location.pathname === '${path.split('?')[0]}',
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 48),
    ctx: document.body.innerText.includes('工作流') || document.body.innerText.includes('需求') || document.body.innerText.includes('匹配') || document.body.innerText.includes('商机') || document.body.innerText.includes('响应') || document.body.innerText.includes('报价') || document.body.innerText.includes('询价'),
    next: document.body.innerText.includes('下一步') || document.body.innerText.includes('创建') || document.body.innerText.includes('发起'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  try { const d = await send('Page.captureScreenshot', { format: 'png' }); if (d?.data) fs.writeFileSync(`${SHOT}/803wf_${label}_${width}.png`, Buffer.from(d.data, 'base64')); } catch {}
  return { label, viewport: width, ...m };
}

async function clearSession() {
  // best-effort real logout endpoint, fallback to clearing browser cookies
  await nav(WEB + '/dashboard/buyer', 2000);
  const r = await aev(`(async () => { try { const r = await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }); return r.status; } catch(e) { return String(e); } })()`);
  await send('Network.clearBrowserCookies').catch(() => {});
  return r;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];

  // ===== BUYER LOGIN + WORKFLOW =====
  const buyerLogin = await login('demo.buyer.01@visndt.local');
  results.push({ phase: 'buyer_login', ...buyerLogin });
  if (buyerLogin.ok) {
    for (const v of [1440, 375]) {
      results.push(await state('buyer-dashboard', '/dashboard/buyer', v));
      results.push(await state('buyer-demands', '/workspace/demands', v));
      results.push(await state('buyer-matches', '/workspace/matches', v));
      results.push(await state('buyer-rfqs', '/workspace/rfqs', v));
      results.push(await state('buyer-notifications', '/workspace/notifications', v));
    }
  }

  // ===== switch to SUPPLIER =====
  const logoutRes = await clearSession();
  results.push({ phase: 'logout_for_supplier', logout: logoutRes });
  const supLogin = await login('demo.supplier.01@visndt.local');
  results.push({ phase: 'supplier_login', ...supLogin });
  if (supLogin.ok) {
    for (const v of [1440, 375]) {
      results.push(await state('sup-dashboard', '/dashboard/supplier', v));
      results.push(await state('sup-opportunities', '/workspace/supplier/opportunities', v));
      results.push(await state('sup-rfqs', '/workspace/supplier/rfqs', v));
      results.push(await state('sup-responses', '/workspace/supplier/responses', v));
      results.push(await state('sup-offers', '/workspace/supplier/offers', v));
      results.push(await state('sup-inquiries', '/workspace/supplier/inquiries', v));
    }
  }

  fs.writeFileSync('F:/Desktop/VISNDT/VISNDT/database/_803_visual/_803_workflow.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  try { send('Browser.close'); } catch {}
  process.exit(0);
}
main().catch(async (e) => { console.error('FATAL', e); try { send('Browser.close'); } catch {} process.exit(1); });