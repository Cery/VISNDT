/** 811 FINAL VERIFY — no window.__visndtQC dependency.
 *  create temp cat -> full-load home (shown) -> admin delete -> pure client nav /products -> /
 *  assert: category text gone from visible DOM + a category fetch fired during nav.
 */
import { spawn } from 'node:child_process';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9497;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811f-' + Date.now();
const API = 'http://localhost:4000/api/v1', WEB = 'http://localhost:3000', PW = 'demo123456', EMAIL = 'demo.admin@visndt.local';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function login(e) { const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password: PW }) }); const j = await r.json().catch(() => ({})); return r.ok && j?.data?.accessToken ? j.data.accessToken : null; }
async function csrfToken() { const r = await fetch(API + '/auth/csrf', { method: 'GET' }); const j = await r.json().catch(() => ({})); return j?.data?.csrfToken || null; }
async function adminMut(method, path, body) {
  const token = await login(EMAIL), csrf = await csrfToken();
  const h = { Authorization: 'Bearer ' + token, 'X-CSRF-Token': csrf, 'Cookie': 'csrf_token=' + csrf }; if (body) h['Content-Type'] = 'application/json';
  const r = await fetch(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch { } return { status: r.status, body: j };
}
const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null; let catReqs = 0;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch { } await sleep(250); } throw new Error('no page'); }
async function nav(u, ms = 7000) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(x) { try { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function spaClick(hrefPart) {
  const ok = await aev(`(()=>{const a=[...document.querySelectorAll('a')].find(x=>{var h=x.getAttribute('href');if(!h)return false;try{return new URL(h,location.origin).pathname===${JSON.stringify(hrefPart)}}catch{return h===${JSON.stringify(hrefPart)}}});
    if(!a) return false; a.click(); return true;})()`);
  return { ok };
}
async function visibleHas(name) {
  return await aev(`(()=>{var n,w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),s='';while(n=w.nextNode()){var p=n.parentElement;if(p&&(p.tagName==='SCRIPT'||p.tagName==='STYLE'||p.tagName==='NOSCRIPT'||/RSC|font|link|meta|template/.test(p.tagName)))continue;s+=n.textContent}return s.indexOf(${JSON.stringify(name)})>=0})()`);
}
(async () => {
  await sleep(2500);
  const page = await waitPage(); ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString());
    if (m.method === 'Network.responseReceived') { const u = m.params?.response?.url || ''; if (u.includes('/product-categories')) catReqs += 1; }
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');

  const name = '811终验FF' + Date.now().toString().slice(-4);
  const slug = '811fv' + Date.now();
  const cr = await adminMut('POST', '/product-categories', { name, slug, parentId: null });
  const tmpId = cr.body?.data?.id || cr.body?.id;

  await nav(WEB + '/', 7000);
  for (let i = 0; i < 25; i++) { if (await visibleHas(name)) break; await sleep(600); }
  const shownCreate = await visibleHas(name);

  const del = await adminMut('DELETE', '/product-categories/' + tmpId);
  const mark = catReqs;
  await spaClick('/products'); await sleep(4500);
  const locProducts = await aev(`location.pathname`);
  await spaClick('/'); await sleep(5000);
  const locHome = await aev(`location.pathname`);
  for (let i = 0; i < 30; i++) { if (await aev(`document.body.innerText.includes('工业检测')||document.body.innerText.includes('推荐产品')`)) break; await sleep(500); }
  await sleep(1500);
  const shownAfter = await visibleHas(name);
  const navFetched = catReqs - mark;

  if (tmpId) { await adminMut('DELETE', '/product-categories/' + tmpId); }
  console.log(JSON.stringify({
    tmpId, adminCreate: cr.status, adminDelete: del.status, shownCreate,
    realNav: { locProducts, locHome }, navFetchedCatRequests: navFetched,
    RESULT: { deletedStillVisibleAfterSpaReturn: shownAfter, PASS: (!shownAfter && navFetched > 0) },
  }, null, 2));
  try { ws.close(); } catch { } try { chrome.kill(); } catch { }
  process.exit(0);
})().catch(async (e) => { console.error('ERR ' + e.message); try { ws?.close(); } catch { } try { chrome.kill(); } catch { } process.exit(2); });