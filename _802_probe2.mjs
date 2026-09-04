/**
 * 802_M39 — supplementary runtime probe: Knowledge Detail (Relevant Engineering
 * Discovery), workspace workflow surfaces (buyer/supplier), search workbench,
 * supplier detail, business/about/login/register. Four viewports where relevant.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9372;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-802b-' + Date.now();
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
    relDiscovery: document.body.innerText.includes('Relevant Engineering Discovery') || document.body.innerText.includes('相关工程发现'),
    workbench: document.body.innerText.includes('ENGINEERING DISCOVERY WORKBENCH'),
    capProvider: document.body.innerText.includes('CAPABILITY PROVIDER'),
    nextConn: document.body.innerText.includes('下一步工程连接') || document.body.innerText.includes('下一步发现'),
    workflow: document.body.innerText.includes('工作流') || document.body.innerText.includes('WORKFLOW') || document.body.innerText.includes('业务概览'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  return { surface: path, viewport: width, ...m };
}

async function firstHref(re) {
  const r = await aev(`Array.from(document.querySelectorAll('a')).map(a=>a.getAttribute('href')).filter(h=>h&&h.match(${re})).shift() || ''`);
  return r || null;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  const vp = [375, 768, 1024, 1440];
  const results = [];

  // Knowledge Detail — discover slug, verify Relevant Engineering Discovery across viewports
  await nav(WEB + '/knowledge-base', 4500);
  const kg = await firstHref('/knowledge-base/[^/]+');
  if (kg) { for (const w of vp) results.push(await pageState(kg, w)); }
  else results.push({ surface: 'knowledge[slug]', viewport: 1440, note: 'no knowledge slug found' });

  // Search Workbench with a query that yields grouped results (broad term)
  for (const q of ['?q=检测', '?q=ultrasonic']) {
    results.push(await pageState('/search' + q, 1440));
  }

  // Supplier list / detail
  await nav(WEB + '/products', 4500);
  const sup = await firstHref('/suppliers/\\d+');
  if (sup) { for (const w of vp) results.push(await pageState(sup, w)); }
  else results.push({ surface: 'supplier[id]', viewport: 1440, note: 'no supplier link from /products' });

  // Public context surfaces
  for (const w of [1440]) {
    results.push(await pageState('/business', w));
    results.push(await pageState('/about', w));
    results.push(await pageState('/login', w));
    results.push(await pageState('/register', w));
    results.push(await pageState('/categories', w));
  }

  // Workspace workflow surfaces (guest => expect redirect to login, no error)
  for (const w of [375, 1440]) {
    results.push(await pageState('/dashboard/buyer', w));
    results.push(await pageState('/dashboard/supplier', w));
  }
  results.push(await pageState('/workspace/demands', 1440));
  results.push(await pageState('/workspace/matches', 1440));
  results.push(await pageState('/workspace/rfqs', 1440));
  results.push(await pageState('/workspace/supplier/opportunities', 1440));
  results.push(await pageState('/workspace/supplier/responses', 1440));
  results.push(await pageState('/workspace/supplier/offers', 1440));

  fs.writeFileSync(`${SHOT}/_802_pages2.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  process.exit(0);
}

main().catch((e) => { console.error('PROBE FAIL', e && e.message); process.exit(1); });