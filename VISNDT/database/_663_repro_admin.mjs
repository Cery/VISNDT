// Reproduce admin dashboard 403: compare admin@visndt.com vs demo.admin@visndt.local
const BASE = 'http://localhost:3001/api/v1';

async function tryLogin(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
  });
  const sc = r.headers.get('set-cookie') || '';
  const body = await r.text();
  let token = null;
  try { const j = JSON.parse(body); token = j?.data?.accessToken || j?.accessToken; } catch {}
  return { status: r.status, cookie: sc, token, body: body.slice(0, 200) };
}

async function call(path, cookie) {
  const r = await fetch(BASE + path, { headers: { Cookie: cookie } });
  return { status: r.status, body: (await r.text()).slice(0, 120) };
}

async function main() {
  const out = [];
  // 1. admin@visndt.com
  const a = await tryLogin('admin@visndt.com', 'admin123456');
  out.push(`login admin@visndt.com -> status=${a.status}`);
  out.push(`  set-cookie present=${!!a.cookie}`);
  if (a.cookie) {
    out.push(`  dashboard/stats  -> ${JSON.stringify(await call('/admin/dashboard/stats', a.cookie))}`);
  }
  // 2. demo.admin@visndt.local (password? likely demo123 or admin123456) - try both
  for (const pw of ['admin123456', 'demo123456']) {
    const d = await tryLogin('demo.admin@visndt.local', pw);
    out.push(`login demo.admin@visndt.local (${pw}) -> status=${d.status}`);
    if (d.cookie) {
      out.push(`  dashboard/stats  -> ${JSON.stringify(await call('/admin/dashboard/stats', d.cookie))}`);
      break;
    }
  }
  console.log(out.join('\n'));
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });