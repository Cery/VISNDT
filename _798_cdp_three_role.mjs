/**
 * 798 M39 Business Loop - Self-contained Three-Role CDP Verification
 * Spawns its own Chrome (headless=new, unique port) so lifecycle is fully controlled.
 * Roles: BUYER / SUPPLIER (full workflow), admin (redirect check)
 * Viewports: 375/768/1024/1440
 * Evidence: horizontal overflow, redirect-to-login, CTA presence, status/timeline markers, screenshots
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-798-' + Date.now();
const BASE = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_798_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ACCOUNTS = {
  buyer: 'demo.buyer.01@visndt.local',
  supplier: 'demo.supplier.01@visndt.local',
  admin: 'demo.admin@visndt.local',
};
const PW = 'demo123456';

const ARG_ROLE = process.argv[2] || 'all';
// Reduced but representative critical-workflow page set (Mobile First-Class essential coverage)
const WORKFLOW = {
  buyer: [
    ['dashboard', '/dashboard/buyer'],
    ['demands', '/workspace/demands'],
    ['demand_create', '/workspace/demands/create'],
    ['demand_match', '/workspace/matches'],
    ['rfqs', '/workspace/rfqs'],
    ['notifications', '/workspace/notifications'],
  ],
  supplier: [
    ['dashboard', '/dashboard/supplier'],
    ['supplier_rfqs', '/workspace/supplier/rfqs'],
    ['supplier_responses', '/workspace/supplier/responses'],
    ['supplier_offers_new', '/workspace/supplier/offers/new'],
    ['supplier_inquiries', '/workspace/supplier/inquiries'],
    ['supplier_opportunities', '/workspace/supplier/opportunities'],
  ],
};
const ROLES = ARG_ROLE === 'all' ? Object.keys(WORKFLOW) : [ARG_ROLE];
const VIEWPORTS = [375, 768, 1024, 1440];

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-proxy-server', '--proxy-bypass-list=*', '--use-fake-ui-for-media-stream',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
], { stdio: 'ignore' });

let msgId = 0;
const pending = new Map();
let ws = null;
const exceptions = [];

function connect(url) { return new Promise((res, rej) => { const s = new WebSocket(url); s.onopen = () => res(s); s.onerror = (e) => rej(new Error('ws ' + e.message)); }); }
function send(m, p = {}) { return new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); }); }
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = t.find((x) => x.type === 'page'); if (page) return page; } catch {} await sleep(400); } throw new Error('no page target'); }
function setViewport(w) { return send('Emulation.setDeviceMetricsOverride', { width: w, height: w <= 768 ? 1200 : 900, deviceScaleFactor: 1, mobile: w <= 768 }); }
async function nav(url, ms = 3400) { await send('Page.navigate', { url }); await sleep(ms); }
async function ev(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }); return r.result?.value; }
async function aev(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result?.value; }
async function metrics() {
  return JSON.parse(await ev(`JSON.stringify({
    path: location.pathname,
    onLogin: document.querySelector('#login-email')!==null,
    dcl: document.documentElement.clientWidth,
    dsw: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim().slice(0,50)||null,
    sidebar: !!document.querySelector('aside, [data-sidebar]'),
    ctas: [...document.querySelectorAll('button,a[href]')].filter(x=>{const q=x.getBoundingClientRect();return q.width>0&&q.height>0&&q.top<innerHeight}).length,
    statusBadges: document.querySelectorAll('[class*="badge"],[class*="Badge"]').length,
  })`) || '{}');
}

const RESULTS = [];
const ISSUES = [];
const LANDINGS = [];

async function login(role) {
  // warm up by loading an origin page (also validates localhost connectivity)
  try { await nav(BASE + '/login', 2600); } catch {}
  const status = await aev(`(async()=>{
    try{
      const r = await fetch('${API}' + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${ACCOUNTS[role]}',password:'${PW}'}),credentials:'include'});
      return 'HTTP_' + r.status;
    }catch(e){ return 'FETCH_ERR:' + e.message; }
  })()`);
  await sleep(1500);
  let cookies = null;
  try { const ck = await send('Network.getAllCookies'); cookies = ck.cookies.filter(c=>c.name==='access_token').map(c=>'access_token@'+c.domain); } catch {}
  return { role, status, cookies, path: await ev('location.pathname') };
}

async function webAlive() {
  try { const r = await fetch(BASE + '/login', { method: 'HEAD' }); return r.ok; } catch { return false; }
}

async function warmup(role) {
  // Pre-compile every route once at desktop so the viewport loop is light
  await setViewport(1440);
  for (const [name, route] of WORKFLOW[role]) {
    try { await nav(BASE + route, 4200); } catch {}
    if (!(await webAlive())) { throw new Error('WEB_DOWN during warmup:' + name); }
  }
}

async function runRole(role) {
  LANDINGS.push(role + '=>' + JSON.stringify(await login(role)));
  // re-enter an authenticated route to settle role context
  await nav(BASE + '/workspace/demands', 3500);
  await warmup(role);
  await send('Page.reload', { ignoreCache: false }); await sleep(1500);
  for (const vw of VIEWPORTS) {
    await setViewport(vw);
    for (const [name, route] of WORKFLOW[role]) {
      try {
        await nav(BASE + route, 3200);
        const m = await metrics();
        const dclTag = m.dcl;
        let shot = null;
        try { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); shot = `${role}_${name}_${dclTag}w.png`; fs.writeFileSync(path.join(SHOT, shot), s.data, 'base64'); } catch (e) { shot = 'ERR ' + e.message; }
        m.shot = shot;
        console.log(role + ':' + name + '@' + vw + ' overflow=' + m.overflow + ' ctas=' + m.ctas + ' path=' + m.path);
        RESULTS.push({ role, page: name, route, vw, ...m });
        if (m.onLogin) ISSUES.push({ role, page: name, vw, cause: 'redirected to LOGIN (auth lost)' });
        if (m.overflow > 1) ISSUES.push({ role, page: name, vw, overflow: m.overflow, cause: 'horizontal overflow' });
        if (!m.ctas) ISSUES.push({ role, page: name, vw, cause: 'no visible CTA' });
      } catch (e) {
        ISSUES.push({ role, page: name, vw, cause: 'NAV_FAIL ' + e.message });
      }
      // checkpoint write
      fs.writeFileSync(path.join(SHOT, 'results.json'), JSON.stringify({ ts: Date.now(), results: RESULTS, issues: ISSUES, landings: LANDINGS }, null, 2));
    }
  }
  await send('Runtime.evaluate', { expression: `fetch('${API}' + '/auth/logout',{method:'POST',credentials:'include'}).catch(()=>{})` });
  await sleep(1200);
}

async function main() {
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  ws.addEventListener('message', (evd) => {
    const m = JSON.parse(evd.data.toString());
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') exceptions.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
  });

  for (const role of ROLES) {
    await runRole(role);
  }
  const adminLogin = await login('admin');
  LANDINGS.push('admin=>' + JSON.stringify(adminLogin));

  const out = { ts: new Date().toISOString(), landings: LANDINGS, results: RESULTS, issues: ISSUES, exceptions };
  fs.writeFileSync(path.join(SHOT, 'results.json'), JSON.stringify(out, null, 2));
  console.log('PAGES=' + RESULTS.length);
  console.log('LANDINGS=' + JSON.stringify(LANDINGS));
  console.log('ISSUES=' + ISSUES.length);
  console.log(JSON.stringify(ISSUES, null, 2));
  console.log('EXCEPTIONS=' + exceptions.length);
  try { ws.close(); } catch {}
  chrome.kill();
  process.exit(0);
}
main().catch((e) => { console.error('FATAL ' + e.message); try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });