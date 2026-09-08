// 853 runtime mobile/responsive semantic probe
import http from 'node:http';
function getPage(port) {
  return new Promise((res, rej) => {
    http.get(`http://localhost:${port}/json/version`, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => { try { res(JSON.parse(d).webSocketDebuggerUrl); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}
const wsUrl = process.argv[2] || await getPage(9222);
const base = 'http://localhost:3000';
const pages = ['/', '/products', '/products/zb-k60', '/search', '/categories', '/solutions', '/knowledge-base'];
const viewports = [375, 768, 1440];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FORBIDDEN = ['能力型号', '能力提供商', '能力管理', '能力产品', 'SupplierProduct', 'Approved Supplier Model'];

function connect(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const timer = setTimeout(() => rej(new Error('connect timeout')), 10000);
    ws.onopen = () => { clearTimeout(timer); res({ ws, cdp: (method, params = {}, sid) => new Promise((r, j) => {
      const mid = ++id; pending.set(mid, { r, j });
      ws.send(JSON.stringify({ id: mid, sessionId: sid, method, params }));
    }) }); };
    ws.onmessage = (ev) => {
      let m; try { m = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString()); } catch { return; }
      if (m.id != null && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result || {}); }
    };
    ws.onerror = (e) => { clearTimeout(timer); rej(new Error('ws error')); };
  });
}

const { ws, cdp } = await connect(wsUrl);
const { targetInfos } = await cdp('Target.getTargets');
let page = targetInfos.find((t) => t.type === 'page');
if (!page) { const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' }); page = { targetId }; }
const { sessionId } = await cdp('Target.attachToTarget', { targetId: page.targetId, flatten: true });
const s = (method, params = {}) => cdp(method, params, sessionId);
const evalInPage = async (expr) => (await s('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

let passCount = 0, failItems = [];
for (const vw of viewports) {
  await s('Emulation.setDeviceMetricsOverride', { width: vw, height: 900, deviceScaleFactor: 1, mobile: vw < 500 });
  for (const p of pages) {
    await s('Page.navigate', { url: base + p });
    await sleep(1600);
    const r = await evalInPage(`(() => {
      const cw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const body = document.body ? document.body.innerText : '';
      const found = ${JSON.stringify(FORBIDDEN)}.filter((f) => body.includes(f));
      const rawEnum = /(>|\\s)ACTIVE|(>|\\s)DRAFT|(>|\\s)PUBLISHED|(>|\\s)PENDING|SUPPLIER|BUYER(\\s|<)/.test(body);
      return JSON.stringify({ cw, sw, overflow: sw > cw, h1: document.querySelectorAll('h1').length, forbidden: found, rawEnum });
    })()`);
    const o = JSON.parse(r);
    const ok = !o.overflow && o.forbidden.length === 0 && !o.rawEnum;
    if (ok) passCount++; else failItems.push({ vw, p, ...o });
    console.log(`[${vw}px] ${p} :: ${r} :: ${ok ? 'PASS' : 'FAIL'}`);
  }
}
await s('Emulation.clearDeviceMetricsOverride');
ws.close();
console.log(`\nSUMMARY pass=${passCount}/${viewports.length * pages.length}`);
if (failItems.length) { console.log('FAILURES:', JSON.stringify(failItems, null, 2)); process.exit(2); }
process.exit(0);