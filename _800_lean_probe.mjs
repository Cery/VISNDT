/**
 * 800 M39 — LEAN whole-site runtime probe (memory-safe).
 * Representative public surfaces + key authenticated, sequential, moderate waits.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9364;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-800b-' + Date.now();
const API = 'http://localhost:4000/api/v1';
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_800_visual';
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
async function nav(u, ms) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function snap(label, path, width, shot = false) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 1800 : 900, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, label === 'home_1440' ? 5000 : 3000);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(500);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname,
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 55),
    brand: document.body.innerText.includes('工业检测能力发现平台'),
    layerLabels: ['能力分类','统一检索'].filter((l) => document.body.innerText.includes(l)).length,
    header: !!document.querySelector('header'), footer: !!document.querySelector('footer')
  })`)) || '{}');
  if (shot) { try { const d = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); if (d?.data) fs.writeFileSync(`${SHOT}/800r_${label}_${width}.jpg`, Buffer.from(d.data, 'base64')); } catch {} }
  return { surface: label, viewport: width, ...m };
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  const results = [];

  const desktop = ['/', '/search', '/categories', '/products', '/solutions', '/knowledge-base', '/business', '/about', '/login', '/register', '/products/compare'];
  for (const p of desktop) results.push(await snap('r' + (p.replace(/\//g, '_') || 'home'), p, 1440, p === '/'));

  results.push(await snap('home_375', '/', 375, true));
  results.push(await snap('search_375', '/search', 375));
  results.push(await snap('login_375', '/login', 375));
  results.push(await snap('home_768', '/', 768));
  results.push(await snap('home_1024', '/', 1024));

  // authenticated
  await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'${PW}'}),credentials:'include'})`); await sleep(1800);
  results.push(await snap('buyer_dashboard', '/dashboard/buyer', 1440, true));
  await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.supplier.01@visndt.local',password:'${PW}'}),credentials:'include'})`); await sleep(1800);
  results.push(await snap('supplier_dashboard', '/dashboard/supplier', 1440, true));

  const out = { ts: new Date().toISOString(), results };
  fs.writeFileSync(SHOT + '/_800_wholesite.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ results: out.results.map((r) => ({ surface: r.surface, viewport: r.viewport, overflow: r.overflow, path: r.path, h1: r.h1, brand: r.brand, layers: r.layerLabels })) }, null, 2));
  try { ws && ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });