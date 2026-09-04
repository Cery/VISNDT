import { spawn } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9334;
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-795-' + Date.now();
const BASE = 'http://localhost:3000';
const VIEWPORTS = [375, 768, 1024, 1440];
const URLS = ['/', '/categories', '/products', '/products/zb-k60', '/search?q=超声',
  '/solutions', '/solutions/automotive-casting-defect-inspection-solution', '/solutions/aero-engine-internal-inspection-solution',
  '/knowledge-base', '/knowledge-base/ultrasonic-flaw-detection-basics', '/business', '/insights'];

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${USER}`,
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitJson(target) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(target);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(500);
  }
  throw new Error('CDP endpoint not ready: ' + target);
}

let msgId = 0;
const pending = new Map();

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.onopen = () => resolve(ws);
    ws.onerror = () => reject(new Error('ws error'));
  });
}

function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const ERRORS = [];
async function main() {
  const targets = await waitJson(`http://127.0.0.1:${PORT}/json`);
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('no page target');
  const ws = await connect(page.webSocketDebuggerUrl);

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      ERRORS.push('EXC: ' + (msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text));
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      ERRORS.push('CONSOLE: ' + (msg.params.args || []).map((a) => a.value || a.description || '').join(' '));
    }
  };

  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');

  // Discover a real supplier id (if any link to /suppliers/ appears on product detail page)
  await send(ws, 'Page.navigate', { url: BASE + '/products/zb-k60' });
  await sleep(3500);
  const supExpr = `(()=>{const a=[...document.querySelectorAll('a[href*="/suppliers/"]')].map(x=>x.getAttribute('href'));return JSON.stringify([...new Set(a)].slice(0,5))})()`;
  const spr = await send(ws, 'Runtime.evaluate', { expression: supExpr, returnByValue: true });
  let supplierUrls = [];
  try { supplierUrls = JSON.parse(spr.result.value || '[]'); } catch {}

  const results = [];
  for (const url of URLS) {
    for (const vw of VIEWPORTS) {
      await send(ws, 'Emulation.setDeviceMetricsOverride', { width: vw, height: 900, deviceScaleFactor: 1, mobile: vw <= 768 });
      await send(ws, 'Page.navigate', { url: BASE + url });
      await sleep(3600);
      const expr = `JSON.stringify({
        finalUrl: location.href,
        path: location.pathname,
        vw: innerWidth,
        dcl: document.documentElement.clientWidth,
        dsw: document.documentElement.scrollWidth,
        bsw: document.body ? document.body.scrollWidth : -1,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        robots: document.querySelector('meta[name="robots"]')?.content || null,
        ogurl: document.querySelector('meta[property="og:url"]')?.content || null,
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim().slice(0,60) || null,
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].length,
        links: document.querySelectorAll('a[href="/search"],a[href^="/search"]').length,
        navDiscovery: document.querySelectorAll('a[href="/knowledge-base"],a[href="/products"],a[href="/solutions"],a[href="/search"]').length
      })`;
      const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
      let m = {};
      try { m = JSON.parse(r.result.value); } catch {}
      results.push({ url, viewport: vw, ...m });
    }
  }

  // Supplier profile (discovered or fallback none)
  if (supplierUrls.length) {
    for (const sv of VIEWPORTS) {
      await send(ws, 'Emulation.setDeviceMetricsOverride', { width: sv, height: 900, deviceScaleFactor: 1, mobile: sv <= 768 });
      await send(ws, 'Page.navigate', { url: BASE + supplierUrls[0] });
      await sleep(3600);
      const r = await send(ws, 'Runtime.evaluate', { expression: `JSON.stringify({url:location.href,path:location.pathname,dcl:document.documentElement.clientWidth,dsw:document.documentElement.scrollWidth,bsw:document.body?document.body.scrollWidth:-1,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,canonical:document.querySelector('link[rel="canonical"]')?.href||null,robots:document.querySelector('meta[name="robots"]')?.content||null,title:document.title,jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].length})`, returnByValue: true });
      let mm = {};
      try { mm = JSON.parse(r.result.value); } catch {}
      results.push({ url: supplierUrls[0], viewport: sv, ...mm });
    }
  }

  console.log('SUPPLIER_LINKS=' + JSON.stringify(supplierUrls));
  console.log(JSON.stringify(results, null, 2));
  try { ws.close(); } catch {}
  chrome.kill();
  process.exit(0);
}

main().catch((e) => { console.error('FATAL', e.message); try { chrome.kill(); } catch {} process.exit(2); });