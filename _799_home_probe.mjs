/**
 * 799 M39 - Focused homepage platformization CDP probe.
 * Single Chrome, homepage at 375/768/1024/1440. Checks section presence + horizontal overflow.
 * Minimal scope to avoid the historical memory/crash issues.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9350;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-799-' + Date.now();
const BASE = 'http://localhost:3000';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_799_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--no-proxy-server', '--proxy-bypass-list=*', '--use-fake-ui-for-media-stream',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
], { stdio: 'ignore' });

let msgId = 0;
const pending = new Map();
let ws = null;

function connect(url) { return new Promise((res, rej) => { const s = new WebSocket(url); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); }); }
function send(m, p = {}) { return new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); }); }
async function waitPage() { for (let i = 0; i < 60; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = t.find((x) => x.type === 'page'); if (page) return page; } catch {} await sleep(300); } throw new Error('no page'); }
async function ev(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r?.result?.value; }

const VIEWPORTS = [375, 768, 1024, 1440];
const SECTIONS = ['平台操作模型', '采购方工作流', '能力提供商工作流', '标准化能力分类体系', '推荐产品'];

async function main() {
  await sleep(2500);
  const page = await waitPage();
  ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => {
    const m = JSON.parse(d.data.toString());
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  });
  send('Page.enable'); send('Runtime.enable'); send('Network.enable');
  const results = [];
  for (const w of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: w <= 768 ? 1800 : 900, deviceScaleFactor: 1, mobile: w <= 768 });
    await send('Page.navigate', { url: BASE + '/' });
    await sleep(3500);
    const m = JSON.parse(await ev(`JSON.stringify({
      path: location.pathname,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      bodyScrollWidth: document.body ? document.body.scrollWidth : 0,
      h1: document.querySelector('h1')?.textContent || null,
      sections: [${SECTIONS.map((s) => `document.body.innerText.includes(${JSON.stringify(s)})`).join(',')}]
    })`));
    await send('Page.captureScreenshot', { format: 'png' }).catch(() => {});
    results.push({ viewport: w, ...m });
  }
  const out = { ts: new Date().toISOString(), role: 'public-home', results };
  fs.writeFileSync(SHOT + '/_799_home.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ results: out.results }, null, 2));
  try { await chrome.kill(); } catch {}
  process.exit(0);
}
main().catch((e) => { console.error('ERR', e.message); try{chrome.kill();}catch{}; process.exit(1); });