/** 802_M39 — retry buyer login with stabilized nav, verify buyer workflow surfaces. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9376;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-802d-' + Date.now();
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

let msgId = 0; const pending = new Map(); let ws = null;
function connect(u) { return new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); }); }
function send(m, p = {}) { return new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); }); }
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(300); } throw new Error('no page'); }
async function nav(u, ms = 4000) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function state(label, path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2000 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 4500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname, keep: location.pathname === '${path.split('?')[0]}',
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 46),
    overview: document.body.innerText.includes('业务概览') || document.body.innerText.includes('需求') || document.body.innerText.includes('响应'),
    workflow: document.body.innerText.includes('工作流') || document.body.innerText.includes('需求') || document.body.innerText.includes('匹配'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  try { const d = await send('Page.captureScreenshot', { format: 'png' }); if (d?.data) fs.writeFileSync(`${SHOT}/802b_${label}_${width}.png`, Buffer.from(d.data, 'base64')); } catch {}
  return { surface: label, viewport: width, ...m };
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];

  // Stabilize: navigate to login page, then call API from same-origin-free page context
  await nav(WEB + '/login', 3000);
  // Fetch via page origin localhost:3000 -> API localhost:4000 (browser enforces; use no-cors? use fetch with credentials)
  // Try multiple buyer accounts to find one that exists
  const emails = ['demo.buyer.01@visndt.local', 'buyer@visndt.local', 'demobuyer@visndt.local'];
  let did = null;
  for (const e of emails) {
    const r = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${e}',password:'${PW}'}),credentials:'include'});return r.status;}catch(err){return 'ERR:'+err.message;}})()`);
    results.push({ probe: 'buyer_login', email: e, status: r });
    if (r === 201 || r === 200) { did = e; break; }
    await sleep(1200);
  }
  if (did) {
    for (const w of [375, 1440]) results.push(await state('buyer_dashboard', '/dashboard/buyer', w));
    results.push(await state('buyer_demands', '/workspace/demands', 1440));
    results.push(await state('buyer_matches', '/workspace/matches', 1440));
    results.push(await state('buyer_rfqs', '/workspace/rfqs', 1440));
    results.push(await state('buyer_evaluations', '/workspace/evaluations', 1440));
  } else {
    // If API login impossible from page context, try direct in-node fetch with cookies via document.cookie fallback
    results.push({ note: 'buyer login not established; authenticating via UI fallback not attempted' });
  }

  fs.writeFileSync(`${SHOT}/_802_pages4.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  try { ws.close(); } catch {} try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });