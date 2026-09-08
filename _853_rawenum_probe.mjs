import http from 'node:http';
import fs from 'node:fs';
function getPage(port) {
  return new Promise((res, rej) => {
    http.get(`http://localhost:${port}/json/version`, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => { try { res(JSON.parse(d).webSocketDebuggerUrl); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}
const wsUrl = await getPage(9222);
const base = 'http://localhost:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function connect(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url);
    let id = 0; const pending = new Map();
    const timer = setTimeout(() => rej(new Error('timeout')), 10000);
    ws.onopen = () => { clearTimeout(timer); res({ ws, cdp: (m, p = {}, sid) => new Promise((r, j) => { const mid = ++id; pending.set(mid, { r, j }); ws.send(JSON.stringify({ id: mid, sessionId: sid, method: m, params: p })); }) }); };
    ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch { return; } if (m.id != null && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result || {}); } };
    ws.onerror = () => rej(new Error('ws error'));
  });
}
const { ws, cdp } = await connect(wsUrl);
const { targetInfos } = await cdp('Target.getTargets');
let page = targetInfos.find((t) => t.type === 'page');
const { sessionId } = await cdp('Target.attachToTarget', { targetId: page.targetId, flatten: true });
const s = (m, p = {}) => cdp(m, p, sessionId);
const ev = async (e) => (await s('Runtime.evaluate', { expression: e, returnByValue: true })).result.value;
await s('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
await s('Page.navigate', { url: base + '/products/zb-k60' });
await sleep(1800);
const r = await ev(`(() => {
  const tokens = ['ACTIVE','DRAFT','PUBLISHED','PENDING','SUPPLIER','BUYER','REVIEW','ARCHIVED'];
  const text = document.body.innerText;
  const lines = text.split('\\n').map((l) => l.trim()).filter(Boolean);
  const hits = [];
  for (const t of tokens) {
    for (const l of lines) {
      if (l.toUpperCase().includes(t)) hits.push(t + ' :: ' + l);
    }
  }
  return JSON.stringify(hits.slice(0, 60));
})()`);
fs.writeFileSync('f:/Desktop/VISNDT/_853_rawenum_result.json', r, 'utf8');
console.log('WROTE', r.length);
ws.close(); process.exit(0);