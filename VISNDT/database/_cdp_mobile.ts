/**
 * M717 §16 Mobile Runtime QA via real Edge headless + CDP.
 * Detects horizontal overflow on core pages at multiple viewports.
 * Uses ONE reusable tab: Emulation.setDeviceMetricsOverride + Page.navigate(poll href).
 * Node v24 global WebSocket as CDP client. Memory-efficient (1 tab).
 */
const CDP_PORT = 9222;
const SEND_TIMEOUT = 8000;

const FRAMES: { label: string; width: number; height: number }[] = [
  { label: '375px', width: 375, height: 760 },
  { label: '390px', width: 390, height: 844 },
  { label: '768px', width: 768, height: 1024 },
  { label: '1024px', width: 1024, height: 768 },
  { label: '1440px', width: 1440, height: 900 },
];

const PAGES: [string, string, boolean][] = [
  ['Home', '/', false],
  ['Search', '/search', false],
  ['Products', '/products', false],
  ['Categories', '/categories', false],
  ['Solutions', '/solutions', false],
  ['Knowledge', '/knowledge', false],
  ['Workspace(LoginGuard)', '/workspace', true],
  ['Demands', '/workspace/demands', true],
  ['Matches', '/workspace/matches', true],
  ['Rfqs', '/workspace/rfqs', true],
  ['Supplier Inquiries', '/workspace/supplier/inquiries', true],
  ['Supplier Offers', '/workspace/supplier/offers', true],
];

const results: { step: string; ok: boolean; detail: string }[] = [];
function rec(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  process.stdout.write(`${ok ? 'OK  ' : 'WARN'} ${step} — ${detail}\n`);
}

class CDP {
  private ws!: WebSocket;
  private id = 0;
  private pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();
  open(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('ws connect error'));
      this.ws.onmessage = (ev: any) => {
        try {
          const msg = JSON.parse(ev.data as string);
          if (msg.id && this.pending.has(msg.id)) {
            const p = this.pending.get(msg.id)!;
            this.pending.delete(msg.id);
            msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
          }
        } catch {}
      };
    });
  }
  send(method: string, params: any = {}): Promise<any> {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method} timeout`)); }, SEND_TIMEOUT);
      this.pending.set(id, {
        resolve: (v: any) => { clearTimeout(timer); resolve(v); },
        reject: (e: Error) => { clearTimeout(timer); reject(e); },
      });
      try { this.ws.send(JSON.stringify({ id, method, params })); } catch (e: any) { clearTimeout(timer); reject(e); }
    });
  }
  close() { try { this.ws.close(); } catch {} }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let version: any;
  try { version = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then(r => r.json()); }
  catch { process.stdout.write('WARN CDP NOT AVAILABLE\n'); process.exit(2); }
  rec('MA.0 CDP version', true, version.Browser);

  // One reusable page target (about:blank — we navigate it explicitly)
  let target: any;
  try { target = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new`, { method: 'PUT' }).then(r => r.json()); }
  catch { target = null; }
  if (!target?.webSocketDebuggerUrl) {
    const list: any[] = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then(r => r.json());
    const t = (list || []).find((x) => x.type === 'page') ?? (list || [])[0];
    target = t;
  }
  if (!target?.webSocketDebuggerUrl) { process.stdout.write('WARN NO PAGE TARGET\n'); process.exit(2); }
  const cdp = new CDP();
  await cdp.open(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const evaluate = async (expr: string, timeoutMs = 10000) => {
    const r = await Promise.race([cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true }), sleep(timeoutMs).then(() => null)]);
    return r?.result?.value;
  };

  // Fire navigate, then poll location.href until it reaches the target URL (real nav proof)
  const navigate = async (path: string, timeoutMs = 20000) => {
    cdp.send('Page.navigate', { url: 'http://localhost:3000' + path }).catch(() => {});
    const want = path === '/' ? 'http://localhost:3000/' : 'http://localhost:3000' + path;
    const start = Date.now();
    let href = '';
    while (Date.now() - start < timeoutMs) {
      await sleep(400);
      href = await evaluate('location.href', 3000) || '';
      if (href.startsWith(want) && href !== 'about:blank') break;
    }
    return href;
  };

  // ---- Best-effort login ----
  let loggedIn = false;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 760, deviceScaleFactor: 1, mobile: true, screenWidth: 375, screenHeight: 760 });
  await navigate('/login');
  await sleep(3000);
  const lg = await evaluate(`(async () => { try {
    const c = await fetch('http://localhost:4000/api/v1/auth/csrf', { credentials:'include', mode:'cors' }).then(r=>r.json());
    const s = await fetch('http://localhost:4000/api/v1/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:'demo.buyer.01@visndt.local', password:'demo123456'}), credentials:'include', mode:'cors' });
    return { status: s.status };
  } catch (e) { return { error: String(e) }; } })()`, 12000);
  loggedIn = lg?.status === 201 || lg?.status === 200;
  rec('MA.1 login (buyer, best-effort)', loggedIn, `status=${lg?.status} err=${lg?.error ?? 'none'}`);

  // ---- Home overflow across all viewports (same tab) ----
  for (const frame of FRAMES) {
    try {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: frame.width, height: frame.height, deviceScaleFactor: 1, mobile: frame.width < 768, screenWidth: frame.width, screenHeight: frame.height });
      await navigate('/');
      await sleep(2200);
      const m = await evaluate(`({iw:window.innerWidth, sw:document.documentElement.scrollWidth, bw:document.body?document.body.scrollWidth:0, title:document.title, bodyLen:document.body?document.body.innerText.length:0})`);
      const rendered = !!m && (m.title.length > 0 || (m.bodyLen || 0) > 0);
      const overflow = rendered && !(m.sw <= m.iw + 1 && m.bw <= m.iw + 1);
      rec(`MA.2 Home @ ${frame.label}`, rendered && !overflow, `iw=${m?.iw} docSW=${m?.sw} bodyW=${m?.bw} rendered=${rendered} title="${m?.title?.slice(0,20)}"`);
    } catch (e: any) { rec(`MA.2 Home @ ${frame.label}`, false, `err ${e.message}`); }
  }

  // ---- Core pages @ 375px ----
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 760, deviceScaleFactor: 1, mobile: true, screenWidth: 375, screenHeight: 760 });
  for (const [name, path, needsAuth] of PAGES) {
    if (needsAuth) {
      rec(`MA.3 ${name} (375px)`, false, `NOT VERIFIED — login ${loggedIn ? 'ok' : 'unavailable'} (runtime mobile auth boundary)`);
      continue;
    }
    try {
      await navigate(path);
      await sleep(2200);
      const m = await evaluate(`({iw:window.innerWidth, sw:document.documentElement.scrollWidth, bw:document.body?document.body.scrollWidth:0, title:document.title, bodyLen:document.body?document.body.innerText.length:0, text:document.body?document.body.innerText.slice(0,30).replace(/\\s+/g,' '):''})`);
      const rendered = !!m && (m.title.length > 0 || (m.bodyLen || 0) > 0);
      const overflow = rendered && !(m.sw <= m.iw + 1 && m.bw <= m.iw + 1);
      rec(`MA.3 ${name} (375px)`, rendered && !overflow, `iw=${m?.iw} docSW=${m?.sw} bodyW=${m?.bw} rendered=${rendered} title="${m?.title?.slice(0,20)}" text="${m?.text}"`);
    } catch (e: any) { rec(`MA.3 ${name} (375px)`, false, `err ${e.message}`); }
  }

  cdp.close();
  const pass = results.filter(r => r.ok).length;
  const warned = results.length - pass;
  process.stdout.write(`\n=== MOBILE QA: ${pass}/${results.length} ok, ${warned} warn/not-verified ===\n`);
  process.exit(0);
}

main().catch((e) => { process.stdout.write(`FATAL: ${e.stack || e}\n`); process.exit(1); });