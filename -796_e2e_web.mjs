/**
 * -796_e2e_web.mjs — Tri-role real-browser E2E over Web frontend (:3000).
 * Roles: GUEST / BUYER / SUPPLIER.
 * For each (role, path): inject auth cookies (or clear for guest) -> navigate ->
 * capture { title, h1, http-ish status, buttons, links, fragment, consoleErrors, exceptions, redirectLanding }.
 * Also performs list->detail discovery for parameterized routes and CTA-button availability probe.
 * Evidence written to database/_796_e2e/web.jsonl  (evidence only, no mutations).
 */
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const CDP_PORT = 9222;
const WEB = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const OUT = 'database/_796_e2e';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor() { this.id = 0; this.pending = new Map(); this.events = []; }
  open(url) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(new Error('ws error'));
      this.ws.onmessage = (ev) => {
        try {
          const m = JSON.parse(ev.data);
          if (m.method === 'Runtime.exceptionThrown') {
            const ex = m.params.exceptionDetails;
            this.events.push('EXC: ' + (ex.text || '') + ' :: ' + ((ex.exception && ex.exception.description) || '').slice(0, 180));
          }
          if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
            const a = (m.params.args || []).map((x) => x.value !== undefined ? x.value : (x.description || '')).join(' ');
            this.events.push('CONSOLE-ERROR: ' + a.slice(0, 180));
          }
          if (m.id && this.pending.has(m.id)) {
            const p = this.pending.get(m.id); this.pending.delete(m.id);
            m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result);
          }
        } catch {}
      };
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(method + ' timeout')); }, 15000);
      this.pending.set(id, { resolve: (v) => { clearTimeout(timer); resolve(v); }, reject: (e) => { clearTimeout(timer); reject(e); } });
      try { this.ws.send(JSON.stringify({ id, method, params })); } catch (e) { clearTimeout(timer); reject(e); }
    });
  }
  close() { try { this.ws.close(); } catch {} }
}

async function newTarget() {
  try {
    const t = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/new?about:blank', { method: 'PUT' })).json();
    if (t && t.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
  } catch {}
  const ts = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list')).json();
  const p = ts.find((x) => x.type === 'page' && x.url === 'about:blank') || ts.find((x) => x.type === 'page') || ts[0];
  return p.webSocketDebuggerUrl;
}

async function evaluate(cdp, expr, awaitPromise = true) {
  const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise });
  if (r && r.exceptionDetails) return { __err: r.exceptionDetails.text || 'eval exception' };
  return r && r.result ? r.result.value : null;
}

function parseCookies(h) {
  return (Array.isArray(h) ? h : [h]).filter(Boolean).map((raw) => {
    const [nv] = raw.split(';');
    const eq = nv.indexOf('=');
    return { name: nv.slice(0, eq).trim(), value: nv.slice(eq + 1).trim() };
  });
}
async function loginCookies(email) {
  const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'demo123456' }) });
  if (!res.ok) throw new Error('login failed ' + res.status + ' ' + email);
  return parseCookies(res.headers.getSetCookie());
}
async function setCookies(cdp, cookies) {
  await cdp.send('Network.clearBrowserCookies').catch(() => {});
  for (const c of cookies) {
    await cdp.send('Network.setCookie', { name: c.name, value: c.value, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }).catch(() => {});
  }
  await cdp.send('Network.clearBrowserCache').catch(() => {});
}

const SNAPSHOT = `(() => {
  const clean = (s) => s.normalize('NFKC').replace(/\\s+/g, ' ').trim();
  const h1 = clean(document.querySelector('h1')?.innerText || '');
  const title = clean(document.title || '');
  const hasErrUi = /(页面不存在|404|error|出错|异常|抱歉|unauthorized|无权|权限不足|access denied)/i.test(document.body.innerText);
  const btns = Array.from(document.querySelectorAll('button')).map((b) => clean(b.innerText || (b.getAttribute('aria-label') || ''))).filter(Boolean);
  const links = Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')).filter((v, i, arr) => v && arr.indexOf(v) === i);
  const bodyLen = document.body ? document.body.innerText.length : 0;
  const url = location.href;
  const formInputs = Array.from(document.querySelectorAll('input, select, textarea')).map((e) => e.getAttribute('name') || e.getAttribute('placeholder') || e.tagName).slice(0, 12);
  const mainText = clean(document.body.innerText).slice(0, 400);
  return { url, title, h1, bodyLen, hasErrUi, btns: btns.slice(0, 20), links: links.slice(0, 26), formInputs, mainText, time: Date.now() };
})()`;

const EXT = `(() => ({
  firstMatchLink: (() => { const a = document.querySelector('a[href*="/workspace/matches/"], a[href*="/workspace/rfqs/"], a[href*="/workspace/demands/"], a[href*="/products/"], a[href*="/solutions/"], a[href*="/suppliers/"], a[href*="/knowledge-base/"]'); return a ? a.getAttribute('href') : null; })(),
  hasInquiryCta: !!Array.from(document.querySelectorAll('a,button')).find((e) => /询价|inquire|inquiry|发起询价|enquiry/i.test((e.innerText||'') + ' ' + (e.getAttribute('aria-label')||''))),
  hasSubmit: !!Array.from(document.querySelectorAll('button')).find((b) => /提交|创建|保存|新建|发布|发送|confirm|create|save|publish/i.test(b.innerText)),
}))()`;

const accounts = {
  buyer: 'demo.buyer.01@visndt.local',
  supplier: 'demo.supplier.01@visndt.local',
};

// role -> list of [path, isProtected?]
const MATRIX = {
  GUEST: [
    ['/', false], ['/categories', false], ['/products', false], ['/search?q=超声', false],
    ['/solutions', false], ['/knowledge-base', false], ['/business', false],
    ['/products/compare', false], ['/about', false],
    ['/workspace', true], ['/dashboard', true], ['/workspace/demands', true],
  ],
  BUYER: [
    ['/dashboard', true], ['/dashboard/buyer', true], ['/workspace', true],
    ['/workspace/demands', true], ['/workspace/demands/create', true],
    ['/workspace/matches', true], ['/workspace/rfqs', true], ['/workspace/rfqs/create', true],
    ['/workspace/notifications', true], ['/workspace/settings', true], ['/workspace/dashboard', true],
    ['/products', false], ['/categories', false],
  ],
  SUPPLIER: [
    ['/dashboard', true], ['/dashboard/supplier', true], ['/workspace', true],
    ['/workspace/supplier', true], ['/workspace/supplier/members', true],
    ['/workspace/supplier/rfqs', true], ['/workspace/supplier/responses', true],
    ['/workspace/supplier/offers', true], ['/workspace/supplier/offers/new', true],
    ['/workspace/supplier/inquiries', true], ['/workspace/supplier/profile', true],
    ['/workspace/supplier/opportunities', true], ['/workspace/supplier/display', true],
    ['/workspace/supplier/dashboard', true],
  ],
};

const results = [];
const log = (r) => { results.push(r); appendFileSync(`${OUT}/web.jsonl`, JSON.stringify(r) + '\n'); };

async function main() {
  const token = await newTarget();
  const cdp = new CDP();
  await cdp.open(token);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  for (const role of Object.keys(MATRIX)) {
    if (role !== 'GUEST') {
      // can only inject same user; buyer/supplier separate
    }
  }

  // guest pass
  await cdp.send('Network.clearBrowserCookies').catch(() => {});
  for (const [path, prot] of MATRIX.GUEST) {
    await runPath(cdp, 'GUEST', path, prot, null);
  }

  // buyer pass
  const bc = await loginCookies(accounts.buyer);
  for (const [path, prot] of MATRIX.BUYER) {
    await setCookies(cdp, bc);
    await runPath(cdp, 'BUYER', path, prot, bc);
  }

  // supplier pass
  const sc = await loginCookies(accounts.supplier);
  for (const [path, prot] of MATRIX.SUPPLIER) {
    await setCookies(cdp, sc);
    await runPath(cdp, 'SUPPLIER', path, prot, sc);
  }

  cdp.close();
  console.log('DONE_RESULTS', results.length);
  console.log(JSON.stringify(results, null, 1));
}

async function runPath(cdp, role, path, prot, cookies) {
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: WEB + path }).catch(() => {});
  await sleep(2600);
  const snap = await evaluate(cdp, SNAPSHOT);
  const ext = await evaluate(cdp, EXT);
  const landed = snap && snap.url ? snap.url.replace(WEB, '') : path;
  const rec = {
    role, path,
    landed,
    h1: snap && snap.h1,
    title: snap && snap.title,
    bodyLen: snap && snap.bodyLen,
    hasErrUi: snap && snap.hasErrUi,
    expectProtected: !!prot,
    isRedirectToLogin: /\/login/.test(landed),
    mainText: snap && snap.mainText,
    btnCount: snap && snap.btns ? snap.btns.length : 0,
    linkCount: snap && snap.links ? snap.links.length : 0,
    formInputs: snap && snap.formInputs,
    hasInquiryCta: ext && ext.hasInquiryCta,
    hasSubmit: ext && ext.hasSubmit,
    firstMatchLink: ext && ext.firstMatchLink,
    consoleErrors: cdp.events.filter((e) => e.startsWith('CONSOLE-ERROR')).slice(0, 4),
    exceptions: cdp.events.filter((e) => e.startsWith('EXC')).slice(0, 4),
  };
  log(rec);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });