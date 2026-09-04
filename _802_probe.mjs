/**
 * 802_M39 — focused runtime probe for structurally recomposed surfaces.
 * Public priority: Solutions, Categories, Products, Search, Compare,
 * Solution Detail, Supplier Detail (+ discovery of real hrefs from list pages).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9368;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-802-' + Date.now();
const WEB = 'http://localhost:3000';
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
async function nav(u, ms) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function pageState(path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2000 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 4500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname,
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 40),
    journey: document.body.innerText.includes('CAPABILITY DISCOVERY JOURNEY'),
    evalRibbon: document.body.innerText.includes('CAPABILITY EVALUATION'),
    workbench: document.body.innerText.includes('ENGINEERING DISCOVERY WORKBENCH'),
    solution: document.body.innerText.includes('SOLUTION INDEX'),
    relDiscovery: document.body.innerText.includes('Relevant Engineering Discovery') || document.body.innerText.includes('相关工程发现'),
    capProvider: document.body.innerText.includes('CAPABILITY PROVIDER'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  return { surface: path, viewport: width, ...m };
}

async function firstHref(pattern) {
  const h = await aev(`(() => { const a = Array.from(document.querySelectorAll('a[href]')).map(x => x.getAttribute('href')).filter(h => h && h.match(${JSON.stringify(pattern)})); return a[0] || null; })()`);
  return h;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  const results = [];
  const vp = [375, 768, 1024, 1440];

  // Primary list surfaces × 4 viewports
  for (const w of vp) results.push(await pageState('/solutions', w));
  for (const w of vp) results.push(await pageState('/categories', w));
  for (const w of vp) results.push(await pageState('/products', w));
  results.push(await pageState('/products/compare', 1440));
  results.push(await pageState('/search?q=ultrasonic', 1440));
  results.push(await pageState('/knowledge-base', 1440));

  // Discover a solution detail slug + supplier id, then verify
  await nav(WEB + '/solutions', 4500);
  const sol = await firstHref('/solutions/.+');
  if (sol) { for (const w of vp) results.push(await pageState(sol, w)); results.push(await pageState(sol, 1440)); }
  else results.push({ surface: '/solutions/[slug]', viewport: 1440, note: 'no slug found' });

  await nav(WEB + '/search?type=supplier-product', 4500);
  const sup = await firstHref('/suppliers/\\d+');
  if (sup) { for (const w of vp) results.push(await pageState(sup, w)); }
  else results.push({ surface: '/suppliers/[id]', viewport: 1440, note: 'no supplier found' });

  fs.writeFileSync(`${SHOT}/_802_pages.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });