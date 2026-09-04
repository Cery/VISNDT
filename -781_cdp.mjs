import { spawn } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-' + Date.now();
const BASE = 'http://localhost:3000';
const VIEWPORTS = [375, 768, 1024, 1440];
const URLS = ['/products/zb-k60', '/products', '/workspace/supplier/members'];

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
  throw new Error('CDP endpooint not ready: ' + target);
}

let msgId = 0;
const pending = new Map();
let errors = [];

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.onopen = () => resolve(ws);
    ws.onerror = (e) => reject(new Error('ws error'));
  });
}

function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

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
    } else if (msg.method && msg.method === 'Runtime.exceptionThrown') {
      errors.push('EXCEPTION: ' + JSON.stringify(msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text));
    } else if (msg.method && msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry?.level)) {
      errors.push(`LOG[${msg.params.entry.level}]: ${msg.params.entry.text}`);
    } else if (msg.method && msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const t = (msg.params.args || []).map((a) => a.value || a.description || '').join(' ');
      errors.push('CONSOLE: ' + t);
    }
  };

  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');
  await send(ws, 'Log.enable');

  const results = [];
  for (const url of URLS) {
    for (const vw of VIEWPORTS) {
      errors = [];
      await send(ws, 'Emulation.setDeviceMetricsOverride', { width: vw, height: 800, deviceScaleFactor: 1, mobile: vw <= 768 });
      await send(ws, 'Page.navigate', { url: BASE + url });
      await sleep(3500);
      const expr = `JSON.stringify({
        url: location.pathname,
        vw: innerWidth,
        dcl: document.documentElement.clientWidth,
        dsw: document.documentElement.scrollWidth,
        bsw: document.body ? document.body.scrollWidth : -1,
        doverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      })`;
      const r = await send(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
      let m = {};
      try { m = JSON.parse(r.result.value); } catch {}
      const cons = errors.slice(0, 3);
      results.push({ url, viewport: vw, ...m, pre640: m.bsw > m.dcl ? m.bsw - m.dcl : 0, consoleErrors: cons });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  try { ws.close(); } catch {}
  chrome.kill();
  process.exit(0);
}

main().catch((e) => { console.error('FATAL', e.message); try { chrome.kill(); } catch {} process.exit(2); });