/** 813 READ-ONLY runtime probe — SupplierProduct authority/display/discoverability.
 *  Only navigates public GETs; no DB writes, no auth bypass, no mutations.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9501;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-813-' + Date.now();
const WEB = 'http://localhost:3000';
const SHOT = 'F:\\Desktop\\VISNDT\\VISNDT\\database\\_813_visual';
mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch { } await sleep(250); } throw new Error('no page'); }
async function nav(u, ms = 7000) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(x) { try { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function shot(name) { try { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r?.data) writeFileSync(`${SHOT}\\${name}.png`, Buffer.from(r.data, 'base64')); } catch { } }
async function httpStatus(path) { try { const r = await fetch(WEB + path, { redirect: 'manual' }); return r.status; } catch (e) { return 'ERR ' + e.message; } }
async function setViewport(w, h) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400); }
(async () => {
  await sleep(2500);
  const page = await waitPage(); ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  const out = { routes: {}, scenario: {} };

  // 1) Confirm NO public SupplierProduct central-catalog route exists.
  for (const p of ['/supplier-products', '/supplier-product-center', '/suppliers', '/products']) {
    out.routes[p] = await httpStatus(p);
    await sleep(300);
  }

  // 2) Search: does ZB-K60 resolve to Platform Product, SupplierProduct, Supplier?
  await setViewport(1440, 900);
  await nav(WEB + '/search?q=ZB-K60', 8000);
  await sleep(1000);
  out.scenario.zbk60 = {
    url: await aev(`location.href`),
    tabs: await aev(`[...document.querySelectorAll('nav button')].map(b=>(b.innerText||'').trim()).filter(Boolean).slice(0,20)`),
    articleCards: await aev(`document.querySelectorAll('article').length`),
    bodyHasPrice: await aev(`/价格[^<]{0,30}/.test(document.body.innerText)`),
    bodyHasSupplierWord: await aev(`document.body.innerText.includes('供应商')||document.body.innerText.includes('能力提供商')`),
  };
  await shot('search_zbk60');

  // 3) Generic capability keyword — Product result primary?
  await nav(WEB + '/search?q=工业内窥镜', 8000);
  await sleep(800);
  out.scenario.generic = {
    bodySummary: await aev(`document.body.innerText.includes('共找到')?document.body.innerText.match(/共找到[^\\n]{0,40}/)?.[0]:null`),
    bodyHasPrice: await aev(`/价格[^<]{0,40}/.test(document.body.innerText)`),
  };
  await shot('search_generic');

  // 4) Product Detail — confirm Platform Product centric with supplier-models context.
  await nav(WEB + '/products', 5000);
  await sleep(600);
  const firstProductHref = await aev(`(()=>{var a=document.querySelector('a[href^="/products/"]');return a?a.getAttribute('href'):null})()`);
  if (firstProductHref) {
    await nav(WEB + firstProductHref, 7000);
    await sleep(800);
    out.scenario.productDetail = {
      url: await aev(`location.pathname`),
      hasSupplierModelsBlock: await aev(`document.body.innerText.includes('能力提供商与供应关系')||document.body.innerText.includes('能力提供商')||document.body.innerText.includes('供应型号')`),
    };
    await shot('product_detail');
  }

  try { ws.close(); } catch { } try { chrome.kill(); } catch { }
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(async (e) => { console.error('ERR ' + e.message); try { ws?.close(); } catch { } try { chrome.kill(); } catch { } process.exit(2); });