/**
 * 800 M39 Whole-site frontend platformization — runtime probe.
 * Verifies the reconstructed global platform shell (header platform vocabulary,
 * layer nav, no overflow) across ALL public routes + key authenticated surfaces.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9362;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-800-' + Date.now();
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
async function nav(u, ms = 3200) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; }

const PUBLIC_ROUTES = [
  '/', '/search', '/categories', '/products', '/products/compare',
  '/solutions', '/knowledge-base', '/business', '/about', '/register', '/login',
];

async function snap(label, path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 1800 : 900, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 3400);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(600);
  const m = JSON.parse(await aev(`JSON.stringify({
    path: location.pathname,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 60),
    brand: document.body.innerText.includes('工业检测能力发现平台'),
    navDiscover: document.body.innerText.includes('能力分类') && document.body.innerText.includes('统一检索'),
    layerLabels: ['发现','评估','技术内容','连接'].filter((l) => document.body.innerText.includes(l)).length,
    header: !!document.querySelector('header'),
    footer: !!document.querySelector('footer')
  })`));
  try { const d = await send('Page.captureScreenshot', { format: 'png' }); if (d?.data) fs.writeFileSync(`${SHOT}/800r_${label}_${width}.png`, Buffer.from(d.data, 'base64')); } catch {}
  return { surface: label, viewport: width, ...m };
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];

  // All public routes at default desktop (1440)
  for (const path of PUBLIC_ROUTES) {
    results.push(await snap('route_' + path.replace(/\//g, '_').replace(/_$/, '') || 'home', path, 1440));
  }

  // Mobile verification on key redesigned surfaces + header
  for (const [label, path] of [['home_m', '/'], ['search_m', '/search'], ['categories_m', '/categories'], ['products_m', '/products'], ['login_m', '/login']]) {
    results.push(await snap(label, path, 375));
  }

  // 1024 tablet header check (mega nav hidden, drawer reachable)
  results.push(await snap('home_1024', '/', 1024));

  // detail pages: grab first canonical link from listings
  const detailExtract = async (listingPath, cssSel) => {
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await nav(WEB + listingPath, 3200);
    const href = await aev(`(()=>{const a=document.querySelector('${cssSel}');return a?a.getAttribute('href'):null})()`);
    return href ? (href.startsWith('http') ? new URL(href).pathname + new URL(href).search : href) : null;
  };
  const detailJobs = [
    ['category', '/categories', 'a[href*="/categories/"]:not([href$="/categories"])'],
    ['product', '/products', 'a[href*="/products/"]:not([href$="/products"]):not([href$="/products/compare"])'],
    ['solution', '/solutions', 'a[href*="/solutions/"]:not([href$="/solutions"])'],
    ['knowledge', '/knowledge-base', 'a[href*="/knowledge-base/"]:not([href$="/knowledge-base"])'],
  ];
  for (const [name, listPath, sel] of detailJobs) {
    try {
      const href = await detailExtract(listPath, sel);
      if (href) results.push(await snap('detail_' + name, href, 1440));
      else results.push({ surface: 'detail_' + name, viewport: 1440, note: 'no link extracted', overflow: false });
    } catch (e) { results.push({ surface: 'detail_' + name, viewport: 1440, note: e.message, overflow: false }); }
  }

  // Authenticated: buyer + supplier dashboard
  await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'${PW}'}),credentials:'include'})`);
  await sleep(1500);
  results.push(await snap('buyer_dashboard', '/dashboard/buyer', 1440));
  await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.supplier.01@visndt.local',password:'${PW}'}),credentials:'include'})`);
  await sleep(1500);
  results.push(await snap('supplier_dashboard', '/dashboard/supplier', 1440));

  const out = { ts: new Date().toISOString(), role: '800 whole-site', results };
  fs.writeFileSync(SHOT + '/_800_wholesite.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ results: out.results.map((r) => ({ surface: r.surface, viewport: r.viewport, overflow: r.overflow, path: r.path, h1: r.h1, brand: r.brand, layerLabels: r.layerLabels })) }, null, 2));
  try { ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });