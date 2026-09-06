/** 811 FINAL verification (el.click SPA navigation - reliable).
 * Reproduces the user's two exact complaints after an admin category delete:
 *  A) Home CategorySection rail must drop the deleted category on return.
 *  B) /products category filter/sidebar must drop the deleted category.
 * Also asserts the server stops returning the deleted category (hard delete).
 */
import { spawn } from 'node:child_process';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9500;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811fin-' + Date.now();
const API = 'http://localhost:4000/api/v1';
const WEB = 'http://localhost:3000';
const PW = 'demo123456';
const EMAIL = 'demo.admin@visndt.local';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function login() { const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PW }) }); const j = await r.json().catch(() => ({})); return r.ok && j?.data?.accessToken ? j.data.accessToken : null; }
async function csrfToken() { const r = await fetch(API + '/auth/csrf'); const j = await r.json().catch(() => ({})); return j?.data?.csrfToken || null; }
async function adminMut(method, path, body) { const token = await login(), csrf = await csrfToken(); const h = { Authorization: 'Bearer ' + token, 'X-CSRF-Token': csrf, Cookie: 'csrf_token=' + csrf }; if (body) h['Content-Type'] = 'application/json'; const r = await fetch(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {} return { status: r.status, body: j }; }
async function pubCatNames() { const r = await fetch(API + '/product-categories?page=1&pageSize=100'); const j = await r.json().catch(() => ({})); return (j?.data?.data || []).map((x) => x.name); }

const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId = 0; const pending = new Map(); let ws = null;
const connect = (u) => new Promise((res, rej) => { const s = new WebSocket(u); s.onopen = () => res(s); s.onerror = () => rej(new Error('ws')); });
const send = (m, p = {}) => new Promise((res, rej) => { const id = ++msgId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method: m, params: p })); });
async function waitPage() { for (let i = 0; i < 80; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) return p; } catch {} await sleep(250); } throw new Error('no page'); }
async function nav(u, ms) { await send('Page.navigate', { url: u }); await sleep(ms); }
async function aev(x) { try { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r?.result?.value; } catch { return null; } }
async function clickExact(href) { return aev(`(()=>{const a=[...document.querySelectorAll('a[href]')].find(x=>x.getAttribute('href')===${JSON.stringify(href)});if(!a)return {found:false};a.click();return {found:true};})()`); }
const path = () => aev(`location.pathname`);
const homeRailHas = (name) => aev(`(()=>[...document.querySelectorAll('a[href^="/products?categoryId="]')].some(a=>(a.textContent||'').includes(${JSON.stringify(name)})))()`);
const homeRailNames = () => aev(`(()=>[...document.querySelectorAll('a[href^="/products?categoryId="]')].map(a=>(a.textContent||'').replace(/\\s+/g,'').includes(${JSON.stringify('811')})?1:0))()`);
const bodyCount = (name) => aev(`(()=>{var n,w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),c=0;while(n=w.nextNode()){var p=n.parentElement;if(p&&(p.tagName==='SCRIPT'||p.tagName==='STYLE'||/RSC/.test(p.tagName)))continue;var t=n.textContent;if(t.indexOf(${JSON.stringify(name)})>=0)c++}return c})()`);

(async () => {
  await sleep(2500);
  const page = await waitPage(); ws = await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message', (d) => { const m = JSON.parse(d.data.toString()); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable');

  const name = '811终验ZZ' + Date.now().toString().slice(-4);
  const out = { name, steps: {} };
  let tmpId = null;
  try {
    // create
    const cr = await adminMut('POST', '/product-categories', { name, slug: '811fin' + Date.now(), parentId: null });
    tmpId = cr.body?.data?.id || cr.body?.id;
    out.steps.create = { status: cr.status };

    // full load home; temp shows in CategorySection
    await nav(WEB + '/', 6000);
    for (let i = 0; i < 30 && !(await homeRailHas(name)); i++) await sleep(500);
    out.steps.home_shows_after_create = await homeRailHas(name);

    // client nav -> /products; temp appears in filter/sidebar/rail
    await clickExact('/products'); await sleep(5000);
    out.steps.products_path = await path();
    out.steps.products_body_count_after_create = await bodyCount(name);

    // DELETE
    const del = await adminMut('DELETE', '/product-categories/' + tmpId);
    const namesAfterDelete = await pubCatNames();
    out.steps.delete = { status: del.status, server_still_returns: namesAfterDelete.includes(name) };

    // A) client back home -> section must drop it
    await clickExact('/'); await sleep(5000);
    out.steps.home_path = await path();
    out.steps.home_rail_still_has_after_delete = await homeRailHas(name);

    // B) client -> /products -> filter must drop it
    await clickExact('/products'); await sleep(5000);
    out.steps.products_body_count_after_delete = await bodyCount(name);

    // PASS summary
    out.PASS = {
      server_drops: out.steps.delete.server_still_returns === false,
      home_section_drops_after_delete: out.steps.home_rail_still_has_after_delete === false,
      products_filter_drops_after_delete: out.steps.products_body_count_after_delete === 0,
    };
    console.log(JSON.stringify(out, null, 2));
    await new Promise((r) => setTimeout(r, 500));
  } finally {
    if (tmpId) await adminMut('DELETE', '/product-categories/' + tmpId).catch(() => {});
    try { ws?.close(); } catch {} try { chrome.kill(); } catch {} process.exit(0);
  }
})().catch(async (e) => { console.error('ERR ' + e.message); try { ws?.close(); } catch {} try { chrome.kill(); } catch {} process.exit(2); });