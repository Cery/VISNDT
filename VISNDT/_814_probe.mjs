/** 814 runtime probe — Search Authority & Public Display Convergence.
 *  READ-ONLY public GET navigation; no DB writes, no mutations, no auth bypass.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9514;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-814-' + Date.now();
const WEB = 'http://localhost:3000';
const SHOT = 'F:\\Desktop\\VISNDT\\VISNDT\\database\\_814_visual';
mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch { } await sleep(250); } throw new Error('no page'); }
async function nav(u, ms = 8000) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(x) { try { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function shot(name) { try { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r?.data) writeFileSync(`${SHOT}\\${name}.png`, Buffer.from(r.data, 'base64')); } catch { } }
async function setViewport(w, h) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w <= 768 }); await sleep(400); }
(async () => {
  await sleep(2500);
  const page = await waitPage(); ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  const out = { scenarios: {} };

  async function check(q, name) {
    await setViewport(1440, 900);
    await nav(WEB + '/search?q=' + encodeURIComponent(q), 9000);
    await sleep(900);
    const body = await aev(`document.body.innerText`);
    const res = {
      query: q,
      tabs: await aev(`[...document.querySelectorAll('nav button')].map(b=>(b.innerText||'').trim()).filter(Boolean).slice(0,20)`),
      articleCount: await aev(`document.querySelectorAll('article').length`),
      hasMatchModels: body.includes('匹配型号'),
      hasRelatedSuppliers: body.includes('相关供应商'),
      hasSupplierWordCount: (body.match(/供应商/g) || []).length,
      hasCapabilityModelsWordCount: (body.match(/能力型号/g) || []).length,
      hasCommerce: /[\d,]+\s*(?:CNY|RMB|USD|¥|￥|元)/.test(body) || /价格/.test(body) || /在售/.test(body),
      summary: body.includes('共找到') ? (body.match(/共找到[^\n]{0,40}/) || [null])[0] : null,
    };
    out.scenarios[name] = res;
    await shot('search_' + name);
    return res;
  }

  out.scenarios.zbk60_desktop = await check('ZB-K60', 'zbk60');
  out.scenarios.generic = await check('工业内窥镜', 'generic');
  out.scenarios.olympus = await check('Olympus', 'olympus');
  out.scenarios.iplex = await check('IPLEX', 'iplex');
  // supplier company name — must NOT show an active Supplier tab / section
  out.scenarios.supplierName = await check('深圳市微视光电科技有限公司', 'supplierName');
  // deprecated type param must gracefully normalize (no crash, active tabs intact)
  await nav(WEB + '/search?q=ZB-K60&type=supplier-product', 9000); await sleep(900);
  out.scenarios.deprecatedType = {
    url: await aev(`location.href`),
    tabs: await aev(`[...document.querySelectorAll('nav button')].map(b=>(b.innerText||'').trim()).filter(Boolean).slice(0,20)`),
    hasProductSection: ((await aev(`document.body.innerText`)) || '').includes('产品'),
    hasCommerce: /价格|在售|¥|元/.test(await aev(`document.body.innerText`)),
  };

  // Mobile sweep on ZB-K60 (model-heavy card)
  const mobile = {};
  for (const w of [375, 768, 1024]) {
    await setViewport(w, 900);
    await nav(WEB + '/search?q=ZB-K60', 9000); await sleep(700);
    mobile[w] = {
      hasMatchModels: ((await aev(`document.body.innerText`)) || '').includes('匹配型号'),
      hasHScroll: await aev(`document.documentElement.scrollWidth > document.documentElement.clientWidth`),
      hasCommerce: /价格|在售|¥|元/.test(await aev(`document.body.innerText`)),
    };
    await shot('zbk60_mobile_' + w);
  }
  out.scenarios.mobile = mobile;

  // Product Detail — supplier-models tab must show model identity but NO price
  await setViewport(1440, 900);
  await nav(WEB + '/products/zb-k60', 9000); await sleep(900);
  await aev(`(()=>{var t=[...document.querySelectorAll('button')].find(b=>/能力型号/.test(b.innerText||'')); if(t){t.click(); return true;} return false;})()`);
  await sleep(800);
  out.scenarios.productDetailSupplierModels = {
    url: await aev(`location.pathname`),
    hasModelIdentity: /型号：ZB-K60/.test(await aev(`document.body.innerText`)),
    hasCommerce: /[¥￥]|价格|在售/.test(await aev(`document.body.innerText`)),
  };
  await shot('product_supplier_models');

  try { ws.close(); } catch { } try { chrome.kill(); } catch { }
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(async (e) => { console.error('ERR ' + e.message); try { ws?.close(); } catch { } try { chrome.kill(); } catch { } process.exit(2); });