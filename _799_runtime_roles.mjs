/**
 * 799 M39 - Focused runtime role probe.
 * Single headless Chrome. Verifies route/render/CTA/overflow for:
 *   GUEST  : /search, /products
 *   BUYER  : /dashboard/buyer (login via API cookie)
 *   SUPPLIER: /dashboard/supplier
 * Reuses the proven CDP message-listener pattern. Minimal crash risk.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9360;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-799r-' + Date.now();
const API = 'http://localhost:4000/api/v1';
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_799_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-proxy-server', '--proxy-bypass-list=*',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
], { stdio: 'ignore' });

let msgId = 0;
const pending = new Map();
let ws = null;
function connect(u) { return new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); }); }
function send(m, p = {}) { return new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); }); }
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(300); } throw new Error('no page'); }
async function nav(u, ms = 3500) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; }

async function checkSurface(label, path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 1800 : 900, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 3800);
  const m = JSON.parse(await aev(`JSON.stringify({
    path: location.pathname,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 50),
    nav: !!document.querySelector('nav'),
    links: document.querySelectorAll('a').length,
    loginForm: !!document.querySelector('#login-email')
  })`));
  try { const d = await send('Page.captureScreenshot', { format: 'png' }); if (d?.data) fs.writeFileSync(`${SHOT}/799r_${label}_${width}.png`, Buffer.from(d.data, 'base64')); } catch {}
  return { surface: label, viewport: width, ...m };
}

async function login(role, email) {
  const r = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${email}',password:'${PW}'}),credentials:'include'});return r.status;}catch(e){return 'ERR '+e.message;}})()`);
  await sleep(1500);
  return r;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];

  // GUEST public discovery
  results.push(await checkSurface('guest_search', '/search', 1440));
  results.push(await checkSurface('guest_products', '/products', 1024));

  // BUYER
  const bLogin = await login('buyer', 'demo.buyer.01@visndt.local');
  results.push({ surface: 'buyer_login', status: bLogin });
  results.push(await checkSurface('buyer_dashboard', '/dashboard/buyer', 1440));
  results.push(await checkSurface('buyer_dashboard_mobile', '/dashboard/buyer', 375));

  // SUPPLIER
  const sLogin = await login('supplier', 'demo.supplier.01@visndt.local');
  results.push({ surface: 'supplier_login', status: sLogin });
  results.push(await checkSurface('supplier_dashboard', '/dashboard/supplier', 1440));
  results.push(await checkSurface('supplier_opportunities', '/workspace/supplier/opportunities', 1024));

  const out = { ts: new Date().toISOString(), results };
  fs.writeFileSync(SHOT + '/_799_runtime_roles.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ results: out.results.map((r) => ({ surface: r.surface, viewport: r.viewport, status: r.status, path: r.path, overflow: r.overflow, h1: r.h1, links: r.links, loginForm: r.loginForm })) }, null, 2));
  try { ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });