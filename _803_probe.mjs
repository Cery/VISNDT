/**
 * 803_M39 — focused runtime probe for final page-level convergence surfaces.
 * Verifies:
 *  - Knowledge List (Engineering Information Discovery framework) × 4 viewports
 *  - Product Detail (RelevantEngineeringDiscovery layer) × 4 viewports
 *  - Home re-verify × 4 viewports
 *  - Supplier Detail empty/route behavior + Business/About/Login/Register public surfaces
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9468;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-803-' + Date.now();
const WEB = 'http://localhost:3000';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_803_visual';
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
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2400 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 5000);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname,
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 48),
    kbChain: document.body.innerText.includes('ENGINEERING INFORMATION DISCOVERY CHAIN'),
    kbContext: document.body.innerText.includes('从知识语境进入'),
    kbDomain: document.body.innerText.includes('KNOWLEDGE DOMAIN'),
    kbNext: document.body.innerText.includes('对检测问题的下一步工程发现'),
    relDiscovery: document.body.innerText.includes('Relevant Engineering Discovery') || document.body.innerText.includes('相关工程发现'),
    capProviderGroup: document.body.innerText.includes('能力提供方'),
    capProvider: document.body.innerText.includes('CAPABILITY PROVIDER'),
    supNextConn: document.body.innerText.includes('与该能力提供方的下一步工程连接'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  return { surface: path, viewport: width, ...m };
}

async function firstHref(pattern) {
  return await aev(`(() => { const a = Array.from(document.querySelectorAll('a[href]')).map(x => x.getAttribute('href')).filter(h => h && h.match(${JSON.stringify(pattern)})); return a[0] || null; })()`);
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  const results = [];
  const vp = [375, 768, 1024, 1440];

  // Knowledge List × 4 viewports
  for (const w of vp) results.push(await pageState('/knowledge-base', w));

  // Home × 4 viewports (re-verify discovery-first hierarchy)
  for (const w of vp) results.push(await pageState('/', w));

  // Public context surfaces (single 1440 + mobile 375)
  results.push(await pageState('/business', 1440));
  results.push(await pageState('/about', 1440));
  results.push(await pageState('/login', 1440));
  results.push(await pageState('/register', 1440));

  // Product Detail discovery layer: discover a real product href from /products
  await nav(WEB + '/products', 5000);
  const prod = await firstHref('/products/[0-9a-f]');
  if (prod) {
    for (const w of [375, 768, 1024, 1440]) results.push(await pageState(prod, w));
    results.push(await pageState(prod + '#suppliers', 1440));
  } else {
    results.push({ surface: '/products/[id]', viewport: 1440, note: 'no product href found' });
  }

  // Supplier detail route behavior (empty/error/unavailable) — use a synthetic id to test route structure
  results.push(await pageState('/suppliers/nonexistent-id', 1440));

  // Supplier Detail runtime closure — a real PUBLISHED supplier from capability detail
  results.push(await pageState('/suppliers/697c99b2-1447-491a-a68a-566f51ca9181', 1440));
  results.push(await pageState('/suppliers/697c99b2-1447-491a-a68a-566f51ca9181', 375));

  fs.writeFileSync(`${SHOT}/_803_pages.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length, '->', `${SHOT}/_803_pages.json`);
  chrome.kill();
  process.exit(0);
}
main().catch((e) => { console.error('ERR', e); try { chrome.kill(); } catch {} process.exit(1); });