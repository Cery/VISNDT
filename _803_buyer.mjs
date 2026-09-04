/** 803 — Buyer critical workflow fresh verify (isolated). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9481;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-803b-' + Date.now();
const API = 'http://localhost:4000/api/v1'; const WEB = 'http://localhost:3000'; const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_803_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server','--proxy-bypass-list=*',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(300); } throw new Error('no page'); }
async function nav(u, ms = 4500) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function state(label, path, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2200 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 4500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname, overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 46),
    workflow: document.body.innerText.includes('工作流') || document.body.innerText.includes('需求') || document.body.innerText.includes('匹配'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  return { surface: label, viewport: width, ...m };
}
async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  await nav(WEB + '/login', 3000);
  const s = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'${PW}'}),credentials:'include'});return r.status;}catch(e){return 'ERR';}})()`);
  const results = [{ probe: 'buyer_login', status: s }];
  if (s === 201 || s === 200) {
    results.push(await state('buyer_dashboard', '/dashboard/buyer', 375));
    results.push(await state('buyer_demands', '/workspace/demands', 1440));
    results.push(await state('buyer_matches', '/workspace/matches', 1440));
    results.push(await state('buyer_rfqs', '/workspace/rfqs', 1440));
  }
  fs.writeFileSync(`${SHOT}/_803_buyer.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  try { ws.close(); } catch {} try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('ERR ' + e.message); try { chrome.kill(); } catch {} process.exit(2); });