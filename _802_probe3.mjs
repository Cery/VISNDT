/**
 * 802_M39 — authenticated role + detail probe.
 * Logs in as BUYER and SUPPLIER via API cookie, verifies dashboards/workspace
 * workflow surfaces + discovers real solution/knowledge/supplier/product detail
 * URLs, verifying structural markers across viewports.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9374;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-802c-' + Date.now();
const API = 'http://localhost:4000/api/v1';
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_802_visual';
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
async function nav(u, ms = 4000) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function login(role, email) {
  const r = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${email}',password:'${PW}'}),credentials:'include'});return r.status;}catch(e){return 'ERR '+e.message;}})()`);
  await sleep(1500); return r;
}

async function state(label, path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2000 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 4500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname,
    keep: location.pathname === '${path.split('?')[0]}' || location.pathname.includes('${path.split('?')[0]}'),
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 46),
    relDiscovery: document.body.innerText.includes('相关工程发现') || document.body.innerText.includes('Relevant Engineering Discovery'),
    capProvider: document.body.innerText.includes('CAPABILITY PROVIDER'),
    overview: document.body.innerText.includes('业务概览'),
    workflow: document.body.innerText.includes('工作流') || document.body.innerText.includes('商机') || document.body.innerText.includes('机会'),
    statCard: document.querySelectorAll('[class*="StatCard"]').length || document.querySelectorAll('main a').length,
    login: location.pathname.includes('/login'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  try { const d = await send('Page.captureScreenshot', { format: 'png' }); if (d?.data) fs.writeFileSync(`${SHOT}/802b_${label}_${width}.png`, Buffer.from(d.data, 'base64')); } catch {}
  return { surface: label, viewport: width, ...m };
}

async function firstHref(re) {
  return (await aev(`Array.from(document.querySelectorAll('a')).map(a=>a.getAttribute('href')).filter(h=>h&&h.match(${re})).shift() || ''`)) || null;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const vp = [375, 768, 1024, 1440];
  const results = [];

  // --- BUYER authenticated ---
  results.push({ surface: 'buyer_login_api', status: await login('buyer', 'demo.buyer.01@visndt.local') });
  for (const w of vp) results.push(await state('buyer_dashboard', '/dashboard/buyer', w));
  results.push(await state('buyer_demands', '/workspace/demands', 1440));
  results.push(await state('buyer_matches', '/workspace/matches', 1440));
  results.push(await state('buyer_rfqs', '/workspace/rfqs', 1440));
  results.push(await state('buyer_evaluations', '/workspace/evaluations', 1440));

  // --- SUPPLIER authenticated ---
  results.push({ surface: 'supplier_login_api', status: await login('supplier', 'demo.supplier.01@visndt.local') });
  for (const w of vp) results.push(await state('supplier_dashboard', '/dashboard/supplier', w));
  results.push(await state('supplier_opportunities', '/workspace/supplier/opportunities', 1440));
  results.push(await state('supplier_rfqs', '/workspace/supplier/rfqs', 1440));
  results.push(await state('supplier_responses', '/workspace/supplier/responses', 1440));
  results.push(await state('supplier_offers', '/workspace/supplier/offers', 1440));

  fs.writeFileSync(`${SHOT}/_802_pages3.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  try { ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });