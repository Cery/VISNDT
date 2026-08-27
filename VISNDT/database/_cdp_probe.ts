// Minimal CDP sanity probe: connect to a /json/new tab, check document state.
const P = 9222;
async function main() {
  const t: any = await fetch(`http://127.0.0.1:${P}/json/new?http://localhost:3000/`, { method: 'PUT' }).then(r => r.json());
  console.log('target url =', t.url, 'ws?', !!t.webSocketDebuggerUrl);
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const i = ++id; pending.set(i, { resolve, reject }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  // navigate and poll href instead of awaiting navigate response
  send('Page.navigate', { url: 'http://localhost:3000/' }).catch(() => console.log('navigate cmd err (ignored)'));
  let href = '';
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const chk = await send('Runtime.evaluate', { expression: 'location.href', returnByValue: true }).catch(() => null);
    href = chk?.result?.value || '';
    if (href.includes('localhost:3000') && href !== 'about:blank') break;
  }
  await new Promise(r => setTimeout(r, 2500));
  const r = await send('Runtime.evaluate', { expression: '({url: location.href, ready: document.readyState, title: document.title, bodyLen: document.body ? document.body.innerText.length : -1, tw: document.title !== ""})', returnByValue: true });
  console.log('NAV href=', href, '\nRESULT:', JSON.stringify(r?.result?.value, null, 2));
  if (r?.exceptionDetails) console.log('EXC:', r.exceptionDetails);
  process.exit(0);
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });