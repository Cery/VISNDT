const wsUrl = process.argv[2];
const base = 'http://localhost:3000';
const pages = ['/search?q=' + encodeURIComponent('工业内窥镜'), '/products', '/products/zb-k60', '/knowledge-base', '/solutions', '/categories'];
const viewports = [375, 768, 1440];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const timer = setTimeout(() => rej(new Error('connect timeout')), 8000);
    ws.onopen = () => { clearTimeout(timer); res({ ws, cdp: (method, params = {}, sid) => new Promise((r, j) => {
      const mid = ++id; pending.set(mid, { r, j });
      ws.send(JSON.stringify({ id: mid, sessionId: sid, method, params }));
    }) }); };
    ws.onmessage = (ev) => {
      let m; try { m = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString()); } catch { return; }
      if (m.id != null && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result || {}); }
    };
    ws.onerror = (e) => { clearTimeout(timer); rej(new Error('ws error' + (e && e.message ? ': ' + e.message : ''))); };
  });
}

const { ws, cdp } = await connect(wsUrl);
console.log('connected');
const { targetInfos } = await cdp('Target.getTargets');
console.log('targets', targetInfos.map((t) => t.type).join(','));
const page = targetInfos.find((t) => t.type === 'page');
console.log('page', page ? page.targetId : 'NONE');
const { sessionId } = await cdp('Target.attachToTarget', { targetId: page.targetId, flatten: true });
console.log('sessionId', sessionId);
const s = (method, params = {}) => cdp(method, params, sessionId);
const evalInPage = async (expr) => (await s('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

for (const vw of viewports) {
  await s('Emulation.setDeviceMetricsOverride', { width: vw, height: 900, deviceScaleFactor: 1, mobile: vw < 500 });
  for (const p of pages) {
    await s('Page.navigate', { url: base + p });
    await sleep(1500);
    const r = await evalInPage('JSON.stringify({cw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, ov: document.documentElement.scrollWidth > document.documentElement.clientWidth, h1: document.querySelectorAll("h1").length})');
    console.log(`[${vw}px] ${p} :: ${r}`);
  }
}
await s('Emulation.clearDeviceMetricsOverride');
ws.close();
process.exit(0);