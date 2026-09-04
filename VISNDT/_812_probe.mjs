/** 812 runtime verification — multi-viewport layout + functional search cases.
 *  Uses el.click() for real client nav (proven reliable for Next Link).
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9498;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-812-' + Date.now();
const WEB = 'http://localhost:3000';
const SHOT = 'F:\\Desktop\\VISNDT\\VISNDT\\database\\_812_visual';
mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch { } await sleep(250); } throw new Error('no page'); }
async function nav(u, ms = 6000) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(x) { try { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function shot(name) { try { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r?.data) writeFileSync(`${SHOT}\\${name}.png`, Buffer.from(r.data, 'base64')); } catch { } }
async function setViewport(w, h) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(500); }
async function setInput(value) {
  return aev(`(()=>{const i=document.querySelector('header input[aria-label="搜索关键词"]');if(!i)return 'no-input';const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(i,${JSON.stringify(value)});i.dispatchEvent(new Event('input',{bubbles:true}));return 'ok'})()`);
}
async function submitSearch() { return aev(`(()=>{const f=document.querySelector('header form');if(!f)return 'no-form';f.requestSubmit();return 'ok'})()`); }
async function layout(caps) {
  return aev(`(()=>{var de=document.documentElement;var header=document.querySelector('header');var hasTypeBtn=[...document.querySelectorAll('header button')].some(b=>['全部','产品','能力型号','供应商','知识','方案'].includes((b.innerText||'').trim()));var input=document.querySelector('header input[aria-label="搜索关键词"]');return {overflow:de.scrollWidth>de.clientWidth,sw:de.scrollWidth,cw:de.clientWidth,headerSearchExists:!!input,hasTypeSelectorBtn:hasTypeBtn,headerCaps:header?{w:Math.round(header.getBoundingClientRect().width)}:null,${caps||''}}})()`);
}
(async () => {
  await sleep(2500);
  const page = await waitPage(); ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  const out = { viewports: {}, functional: {} };

  for (const w of [1440, 1024, 1280]) {
    await setViewport(w, 900);
    await nav(WEB + '/', 5000);
    await sleep(800);
    out.viewports[String(w)] = { top: await layout('') };
    await shot(`home_${w}`);
  }
  for (const w of [768, 375]) {
    await setViewport(w, 812);
    await nav(WEB + '/', 5000);
    await sleep(800);
    const top = await layout('');
    await aev(`(()=>{var h=document.querySelector('header button[aria-label="切换菜单"]');if(h)h.click();return 'ok'})()`);
    await sleep(600);
    const drawer = await aev(`(()=>{var input=document.querySelector('header input[aria-label="搜索关键词"]');var typeBtn=[...document.querySelectorAll('header button')].some(b=>['全部','产品','能力型号','供应商','知识','方案'].includes((b.innerText||'').trim()));return {overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,drawerSearchExists:!!input,drawerHasTypeSelectorBtn:typeBtn}})()`);
    out.viewports[String(w)] = { top, drawer };
    await shot(`home_${w}`);
  }

  await setViewport(1440, 900);
  await nav(WEB + '/', 5000); await sleep(800);

  // Case B
  await setInput('工业内窥镜'); await sleep(700);
  const dropdownBefore = await aev(`(()=>{var d=[...document.querySelectorAll('header div')].find(x=>(x.innerText||'').includes('产品名称建议'));return !!d})()`);
  await submitSearch();
  for (let i = 0; i < 30; i++) { if (await aev(`location.pathname.includes('/search')`)) break; await sleep(500); }
  await sleep(3000);
  out.functional.caseB = {
    url: await aev(`location.href`),
    path: await aev(`location.pathname`),
    params: await aev(`location.search`),
    hasTypeParam: await aev(`new URLSearchParams(location.search).has('type')`),
    resultsMounted: await aev(`document.body.innerText.includes('条结果')`),
  };
  await shot('search_product');

  // Case E
  await aev(`history.back()`); await sleep(2500);
  const backUrl = await aev(`location.href`);
  await aev(`history.forward()`); await sleep(2500);
  const fwdUrl = await aev(`location.href`);
  out.functional.caseE = { backUrl, fwdUrl, fwdOnSearch: await aev(`location.pathname.includes('/search')`) };

  // Case C
  await nav(WEB + '/', 5000); await sleep(800);
  await setInput('超声检测方案供应商'); await sleep(400);
  await submitSearch();
  for (let i = 0; i < 30; i++) { if (await aev(`location.pathname.includes('/search')`)) break; await sleep(500); }
  await sleep(3000);
  out.functional.caseC = {
    url: await aev(`location.href`),
    params: await aev(`location.search`),
    sectionLabels: await aev(`[...document.querySelectorAll('button,span,h3')].map(x=>x.innerText).filter(t=>t&&["检测产品","检测方案","能力型号","供应商","知识"].some(k=>t.includes(k))).slice(0,8)`),
  };
  await shot('search_generic');

  // Case D
  await nav(WEB + '/', 5000); await sleep(800);
  await setInput('内窥'); await sleep(900);
  const ddShown = await aev(`(()=>{var d=[...document.querySelectorAll('header div')].find(x=>(x.innerText||'').includes('产品名称建议'));return !!d})()`);
  const sugCount = await aev(`(()=>{var ul=[...document.querySelectorAll('header ul')].find(x=>x.querySelectorAll('li').length>0);return ul?ul.querySelectorAll('li').length:0})()`);
  const clickStatus = await aev(`(()=>{var li=document.querySelector('header ul li button');if(li){li.click();return 'clicked'}return 'none'})()`);
  await sleep(600);
  const inputAfterSug = await aev(`document.querySelector('header input[aria-label="搜索关键词"]').value`);
  await submitSearch();
  for (let i = 0; i < 30; i++) { if (await aev(`location.pathname.includes('/search')`)) break; await sleep(500); }
  await sleep(2500);
  out.functional.caseD = { ddShown, sugCount, clickStatus, inputAfterSug, searchUrl: await aev(`location.href`) };
  await shot('search_suggestion');

  // Case A
  await nav(WEB + '/search', 5000); await sleep(800);
  await aev(`(()=>{const f=document.querySelector('header form');const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;const i=document.querySelector('header input[aria-label="搜索关键词"]');s.call(i,'   ');i.dispatchEvent(new Event('input',{bubbles:true}));return 'ok'})()`);
  await sleep(200);
  await submitSearch();
  await sleep(1200);
  out.functional.caseA = { urlAfterEmptySubmit: await aev(`location.href`), stillOnSearch: await aev(`location.pathname.includes('/search')`) };

  try { ws.close(); } catch { } try { chrome.kill(); } catch { }
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(async (e) => { console.error('ERR ' + e.message); try { ws?.close(); } catch { } try { chrome.kill(); } catch { } process.exit(2); });