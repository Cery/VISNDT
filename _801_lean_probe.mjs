/**
 * 801 M39 — LEAN page-level reconstruction probe (memory-safe, sequential).
 * Covers the 801-changed surfaces: Compare (evaluation workspace framing),
 * Knowledge (guided empty), Buyer/Supplier dashboards (guided empty states).
 * Roles: GUEST + BUYER + SUPPLIER. Viewports: 375/768/1024/1440.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9365;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-801-' + Date.now();
const API = 'http://localhost:4000/api/v1';
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_801_visual';
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
  await nav(WEB + path, label.includes('_first') ? 6000 : 3500);
  await aev('window.scrollTo(0, document.body.scrollHeight || 0)'); await sleep(500);
  const m = JSON.parse((await aev(`JSON.stringify({
    path: location.pathname,
    overflow: (document.documentElement.scrollWidth-1) > document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 60),
    nextAction: document.body.innerText.includes('下一步工程发现'),
    evalWorkspace: document.body.innerText.includes('确定性评估工作台'),
    guidedEmpty: ['暂无待决策的 RFQ 响应','暂无工程信息资产','请稍后再试','发现检测能力'].filter((t) => document.body.innerText.includes(t)).length,
    header: !!document.querySelector('header')
  })`)) || '{}');
  if (shot) { try { const d = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 }); if (d?.data) fs.writeFileSync(`${SHOT}/801r_${label}_${width}.jpg`, Buffer.from(d.data, 'base64')); } catch {} }
  return { surface: label, viewport: width, ...m };
}

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  send('Page.enable'); send('Runtime.enable');
  const results = [];

  // GUEST — compare + knowledge across viewports (801-changed public surfaces)
  const viewports = [375, 768, 1024, 1440];
  for (const w of viewports) results.push(await snap('compare_empty', '/products/compare', w, w === 1440 || w === 375));
  for (const w of viewports) results.push(await snap('knowledge', '/knowledge-base', w, w === 1440));
  // unchanged-but-reverified public list surfaces
  results.push(await snap('categories_first', '/categories', 1440, true));
  results.push(await snap('products_first', '/products', 1440));
  results.push(await snap('search_first', '/search', 1440));
  results.push(await snap('solutions_first', '/solutions', 1440));

  // AUTH BUYER — dashboard guided empty state
  const buyerLogin = await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'${PW}'}),credentials:'include'}).then(r=>r.status)`);
  await sleep(2200);
  for (const w of viewports) results.push(await snap('buyer_dash', '/dashboard/buyer', w, w === 1440 || w === 375));

  // AUTH SUPPLIER — dashboard guided empty states
  const supplierLogin = await aev(`fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.supplier.01@visndt.local',password:'${PW}'}),credentials:'include'}).then(r=>r.status)`);
  await sleep(2200);
  for (const w of viewports) results.push(await snap('supplier_dash', '/dashboard/supplier', w, w === 1440 || w === 375));

  const out = { ts: new Date().toISOString(), buyerLogin, supplierLogin, results };
  fs.writeFileSync(SHOT + '/_801_pages.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ buyerLogin, supplierLogin, results: out.results.map((r) => ({ s: r.surface, w: r.viewport, ovf: r.overflow, p: r.path, h1: r.h1, next: r.nextAction, eval: r.evalWorkspace, empty: r.guidedEmpty })) }, null, 2));
  try { ws && ws.close(); } catch {}
  try { chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });