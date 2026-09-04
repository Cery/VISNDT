/**
 * -796_e2e_admin.mjs — Admin console (Vite SPA :3001) real-browser E2E.
 * Strategy mirrors the proven web harness (fixed wait + content-retry), tuned for Vite SPA:
 * after each navigate wait for mount, then re-snapshot if body empty (lazy chunk still loading).
 * One clean pass over: login guard, each module, and list->detail for key lists.
 * Evidence: database/_796_e2e/admin.jsonl   (evidence only, no mutations; output path = repo root).
 */
import { mkdirSync, appendFileSync } from 'node:fs';
const CDP_PORT = 9222;
const ADMIN = 'http://localhost:3001';
const API = 'http://localhost:4000/api/v1';
const OUT = 'database/_796_e2e';       // resolved to repo root F:\Desktop\VISNDT
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor() { this.id = 0; this.pending = new Map(); this.events = []; }
  open(url) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('ws error'));
      this.ws.onmessage = (ev) => {
        try {
          const m = JSON.parse(ev.data);
          if (m.method === 'Runtime.exceptionThrown') {
            const ex = m.params.exceptionDetails;
            this.events.push('EXC: ' + (ex.text || '') + ' :: ' + ((ex.exception && ex.exception.description) || '').slice(0, 160));
          }
          if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
            const a = (m.params.args || []).map((x) => x.value !== undefined ? x.value : (x.description || '')).join(' ');
            this.events.push('CONSOLE-ERROR: ' + a.slice(0, 160));
          }
          if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
        } catch {}
      };
    });
  }
  send(method, params = {}, tmo = 30000) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(method + ' timeout')); }, tmo);
      this.pending.set(id, { resolve: (v) => { clearTimeout(timer); resolve(v); }, reject: (e) => { clearTimeout(timer); reject(e); } });
      try { this.ws.send(JSON.stringify({ id, method, params })); } catch (e) { clearTimeout(timer); reject(e); }
    });
  }
  close() { try { this.ws.close(); } catch {} }
}
async function newTarget() {
  try { const t = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/new?about:blank', { method: 'PUT' })).json(); if (t && t.webSocketDebuggerUrl) return t.webSocketDebuggerUrl; } catch {}
  const ts = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list')).json();
  const p = ts.find((x) => x.type === 'page' && x.url === 'about:blank') || ts.find((x) => x.type === 'page') || ts[0];
  return p.webSocketDebuggerUrl;
}
async function evaluate(cdp, expr) {
  try {
    const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r && r.exceptionDetails) return { __err: r.exceptionDetails.exception?.description || r.exceptionDetails.text };
    return r && r.result ? r.result.value : null;
  } catch (e) { return { __evalErr: e.message }; }
}
async function navigate(cdp, url) {
  await cdp.send('Page.navigate', { url }).catch(() => {});
  await sleep(2800); // allow Vite lazy chunks + data fetch
}
// retry snapshot until meaningful content or max tries
async function snapRetry(cdp, tries = 6) {
  let s = await evaluate(cdp, SNAP);
  for (let i = 0; i < tries && s && s.bodyLen < 60; i++) { await sleep(700); s = await evaluate(cdp, SNAP); }
  return s;
}

const SNAP = `(() => {
  try {
    const clean = (s) => s.normalize('NFKC').replace(/\\s+/g,' ').trim();
    const body = document.body ? document.body.innerText : '';
    const hasErrUi = /页面不存在|404|出错|异常|抱歉|unauthorized|无权|加载失败|Rejected|rejected/i.test(body);
    const isOnLogin = !!document.querySelector('input[type="email"], input[type="password"]');
    const firstRowLink = (() => { const a = Array.from(document.querySelectorAll('a')).find((e)=>/^\\/\\w+\\/.+/.test(e.getAttribute('href')||'')); return a?a.getAttribute('href'):null; })();
    const btns = Array.from(document.querySelectorAll('button')).map((b)=>clean(b.innerText||b.getAttribute('aria-label')||'')).filter(Boolean).filter((v)=>v!=='');
    return { url: location.href, path: location.pathname, hasErrUi, isOnLogin, bodyLen: body.length, text: clean(body).slice(0,220), firstRowLink, btnCount: btns.length, btns: btns.slice(0,16) };
  } catch (e) { return { __err: String(e) }; }
})()`;

const MODULES = ['home','operation-center','analytics','business-analytics','monitoring','audit-intelligence',
  'products','demands','matching','users','organizations','notifications','rfqs','offers','supplier-products',
  'inquiries','parameter-groups','parameter-definitions','product-categories','audit-logs','content','embedding',
  'knowledge/domains','knowledge/categories','knowledge/entries','media','files/orphans','product-category-knowledge-mappings'];

const results = [];
const log = (r) => { results.push(r); appendFileSync(`${OUT}/admin.jsonl`, JSON.stringify(r) + '\n'); };

async function main() {
  const login = await (await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'demo.admin@visndt.local', password: 'demo123456' }) })).json();
  if (!login || !login.data || !login.data.accessToken) { console.error('ADMIN LOGIN FAIL', JSON.stringify(login).slice(0,200)); process.exit(1); }
  const token = login.data.accessToken;
  const user = login.data.user;
  const tokenExpiresAt = (JSON.parse(atob(token.split('.')[1])).exp || 0) * 1000;
  const persisted = JSON.stringify({ state: { accessToken: token, user: { ...user, role: 'ADMIN' }, isAuthenticated: true, tokenExpiresAt }, version: 0 });

  const cdp = new CDP();
  await cdp.open(await newTarget());
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  // seed origin then capture login page
  await navigate(cdp, ADMIN + '/login');
  await evaluate(cdp, `localStorage.setItem('visndt-auth', ${JSON.stringify(persisted)}); 'seeded'`);
  log({ role: 'ADMIN', path: '/login', phase: 'login', ...(await snapRetry(cdp)), consoleErrors: cdp.events.filter((e)=>e.startsWith('CONSOLE-ERROR')).slice(0,2), exceptions: cdp.events.filter((e)=>e.startsWith('EXC')).slice(0,2) });

  // unauthenticated guard check
  {
    cdp.events.length = 0;
    await cdp.send('Network.clearBrowserCookies').catch(()=>{});
    await evaluate(cdp, `localStorage.removeItem('visndt-auth'); 'cleared'`);
    await navigate(cdp, ADMIN + '/home');
    log({ role: 'ADMIN', path: '/home', phase: 'guard-unauth', ...(await snapRetry(cdp)), consoleErrors: cdp.events.filter((e)=>e.startsWith('CONSOLE-ERROR')).slice(0,2), exceptions: cdp.events.filter((e)=>e.startsWith('EXC')).slice(0,2) });
  }

  // authorized module pass
  for (const mod of MODULES) {
    cdp.events.length = 0;
    await evaluate(cdp, `localStorage.setItem('visndt-auth', ${JSON.stringify(persisted)}); 'ok'`);
    await navigate(cdp, ADMIN + '/' + mod);
    log({ role: 'ADMIN', path: '/' + mod, phase: 'auth', ...(await snapRetry(cdp)), consoleErrors: cdp.events.filter((e)=>e.startsWith('CONSOLE-ERROR')).slice(0,2), exceptions: cdp.events.filter((e)=>e.startsWith('EXC')).slice(0,2) });
  }

  // list->detail for key lists
  for (const mod of ['products','demands','users','organizations','rfqs','offers','supplier-products','inquiries','notifications']) {
    cdp.events.length = 0;
    await evaluate(cdp, `localStorage.setItem('visndt-auth', ${JSON.stringify(persisted)}); 'ok'`);
    await navigate(cdp, ADMIN + '/' + mod);
    const s = await snapRetry(cdp);
    if (s && s.firstRowLink) {
      await navigate(cdp, ADMIN + s.firstRowLink);
      log({ role: 'ADMIN', path: '/' + mod, detail: s.firstRowLink, phase: 'detail', ...(await snapRetry(cdp)), consoleErrors: cdp.events.filter((e)=>e.startsWith('CONSOLE-ERROR')).slice(0,2), exceptions: cdp.events.filter((e)=>e.startsWith('EXC')).slice(0,2) });
    }
  }

  cdp.close();
  console.log('DONE_ADMIN', results.length);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });