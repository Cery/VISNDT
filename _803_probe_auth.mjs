/**
 * 803_M39 — authenticated workflow final convergence probe.
 * Verifies Buyer + Supplier critical workflow pages render on mobile (375) and desktop (1440),
 * each expressing object/state/prev-context/next-action within the platform workflow.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9476;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-803a-' + Date.now();
const API = 'http://localhost:4000/api/v1';
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
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(300); } throw new Error('no page'); }
async function nav(u, ms = 4000) { try { await send('Page.navigate', { url: u }); } catch {} await sleep(ms); }
async function aev(expr) { try { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }

async function state(label, path, width, flux) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: width <= 768 ? 2200 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  await nav(WEB + path, 4500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(400);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname, role: location.pathname.includes('supplier') ? 'supplier' : 'buyer',
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 46),
    workflow: document.body.innerText.includes('工作流') || document.body.innerText.includes('机会') || document.body.innerText.includes('需求'),
    objState: document.body.innerText.includes('状态') || document.body.innerText.includes('待处理') || document.body.innerText.includes('全部'),
    nextAction: document.body.innerText.includes('下一步') || document.body.innerText.includes('创建') || document.body.innerText.includes('新建'),
    err: !!document.querySelector('#__next_error__') || document.body.innerText.includes('Internal Server Error') || document.body.innerText.includes('Application error')
  })`)) || '{}');
  return { surface: label, role: flux, viewport: width, ...m };
}

async function roleState(role) {
  const res = [];
  if (role === 'buyer') {
    for (const w of [375, 1440]) res.push(await state('buyer_dashboard', '/dashboard/buyer', w, 'buyer'));
    res.push(await state('buyer_demands', '/workspace/demands', 375, 'buyer'));
    res.push(await state('buyer_matches', '/workspace/matches', 1440, 'buyer'));
    res.push(await state('buyer_rfqs', '/workspace/rfqs', 1440, 'buyer'));
  } else {
    for (const w of [375, 1440]) res.push(await state('supplier_dashboard', '/dashboard/supplier', w, 'supplier'));
    res.push(await state('supplier_opportunities', '/workspace/supplier/opportunities', 375, 'supplier'));
    res.push(await state('supplier_rfqs', '/workspace/supplier/rfqs', 1440, 'supplier'));
    res.push(await state('supplier_responses', '/workspace/supplier/responses', 1440, 'supplier'));
    res.push(await state('supplier_offers', '/workspace/supplier/offers', 1440, 'supplier'));
  }
  return res;
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];
  await nav(WEB + '/login', 3000);

  // BUYER
  let b = null;
  for (const e of ['demo.buyer.01@visndt.local', 'buyer@visndt.local']) {
    const r = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${e}',password:'${PW}'}),credentials:'include'});return r.status;}catch(err){return 'ERR';}})()`);
    results.push({ probe: 'buyer_login', email: e, status: r });
    if (r === 201 || r === 200) { b = e; break; }
    await sleep(1000);
  }
  if (b) { results.push(...await roleState('buyer')); }
  else { results.push({ note: 'buyer login not established' }); }

  // SUPPLIER
  let s = null;
  for (const e of ['demo.supplier.01@visndt.local', 'supplier@visndt.local', 'demo.supplier@visndt.local', 'supplier@visndt.local']) {
    const r = await aev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${e}',password:'${PW}'}),credentials:'include'});return r.status;}catch(err){return 'ERR';}})()`);
    results.push({ probe: 'supplier_login', email: e, status: r });
    if (r === 201 || r === 200) { s = e; break; }
    await sleep(1000);
  }
  if (s) { results.push(...await roleState('supplier')); }
  else { results.push({ note: 'supplier login not established' }); }

  fs.writeFileSync(`${SHOT}/_803_auth.json`, JSON.stringify(results, null, 2));
  console.log('WRITTEN', results.length);
  try { ws.close(); } catch {} try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });