/* 805 runtime verification: Public/role-based API data-projection boundary.
 * Confirms SEC-804-P0-01 is fixed at API level and the same class is gone.
 * Controlled test accounts only (demo.*), read-only, no data mutation.
 */
const API = 'http://localhost:4000/api/v1';
const SENS = ['password', 'passwordhash', 'refreshtoken', 'accesstoken', 'secret', 'privatekey', 'apikey', 'session'];
const PW = 'demo123456';

function scan(obj, path, found) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((x, i) => scan(x, path + '[' + i + ']', found)); return; }
  for (const k of Object.keys(obj)) {
    const v = obj[k], p = path ? path + '.' + k : k, lk = k.toLowerCase();
    if (SENS.some((s) => lk.includes(s))) found.push({ path: p, type: typeof v });
    if (v && typeof v === 'object') scan(v, p, found);
  }
}
const leak = (o) => { const f = []; scan(o, '', f); return f; };

async function login(email) {
  const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: PW }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.data?.accessToken) return { ok: false, status: r.status, body: j };
  return { ok: true, token: j.data.accessToken };
}
const get = async (path, token) => {
  const r = await fetch(API + path, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, body: j };
};

const results = [];
const rec = (id, ok, detail) => results.push({ id, ok: ok ? 'PASS' : 'FAIL', detail });

(async () => {
  // --- Guest: public list ---
  let g = await get('/demands?page=1&pageSize=5');
  let f = leak(g.body);
  rec('Guest List /demands (no cred)', f.length === 0, f.length ? JSON.stringify(f.slice(0,3)) : 'no sensitive fields, items=' + (g.body?.data?.data?.length ?? 0));

  // --- Guest: public detail ---
  const firstId = g.body?.data?.data?.[0]?.id;
  let d = await get('/demands/' + firstId);
  f = leak(d.body);
  const cu = d.body?.data?.createdByUser;
  rec('Guest Detail /demands/:id (no cred)', d.status === 200 && f.length === 0 && !(cu && 'passwordHash' in cu), 'status=' + d.status + ' sensitive=' + f.length + ' createdByUser=' + JSON.stringify(cu));
  // positive: demand identity + public metadata retained
  rec('Guest Detail positive fields', !!firstId && d.status === 200 && d.body?.data?.id === firstId && 'title' in d.body?.data && 'status' in d.body?.data, 'id/title/status present');

  // --- Guest: another public detail (RFQ list is public) ---
  let rfq = await get('/rfqs?page=1&pageSize=5');
  f = leak(rfq.body);
  rec('Guest public /rfqs (no cred)', f.length === 0, 'status=' + rfq.status + ' sensitive=' + f.length + ' items=' + (rfq.body?.data?.data?.length ?? 0));

  // --- Guest: public /workflow-events ---
  let wf = await get('/workflow-events?page=1&pageSize=5');
  f = leak(wf.body);
  const op = wf.body?.data?.data?.[0]?.operator;
  rec('Guest public /workflow-events (no cred)', f.length === 0 && !(op && 'passwordHash' in op), 'status=' + wf.status + ' sensitive=' + f.length + ' operator=' + JSON.stringify(op));

  // --- Buyer ---
  const buyer = await login('demo.buyer.01@visndt.local');
  if (!buyer.ok) { rec('Buyer login', false, 'login failed'); } else {
    // buyer own demands (org scope)
    let my = await get('/demands/my', buyer.token);
    f = leak(my.body);
    rec('Buyer /demands/my (no cred, org-scoped)', my.status === 200 && f.length === 0, 'status=' + my.status + ' sensitive=' + f.length);
    // buyer accesses a public demand (from another org) - allowed since public
    let cross = await get('/demands/' + firstId, buyer.token);
    f = leak(cross.body);
    rec('Buyer public cross demand (no cred)', cross.status === 200 && f.length === 0, 'status=' + cross.status + ' sensitive=' + f.length);
  }

  // --- Supplier ---
  const supplier = await login('demo.supplier.01@visndt.local');
  if (!supplier.ok) { rec('Supplier login', false, 'login failed'); } else {
    let sd = await get('/demands/' + firstId, supplier.token);
    f = leak(sd.body);
    rec('Supplier public demand (no cred)', sd.status === 200 && f.length === 0, 'status=' + sd.status + ' sensitive=' + f.length);
    // supplier private buyer workspace data -> should reject (400/403/401)
    let sb = await get('/demands/my', supplier.token);
    rec('Supplier @ private buyer org scope (/demands/my) rejected', sb.status >= 400, 'status=' + sb.status);
  }

  // --- Admin ---
  const admin = await login('demo.admin.01@visndt.local');
  if (!admin.ok) { rec('Admin login', false, 'login failed'); } else {
    let usr = await get('/users?page=1&pageSize=5', admin.token);
    f = leak(usr.body);
    rec('Admin /users list (no cred)', usr.status === 200 && f.length === 0, 'status=' + usr.status + ' sensitive=' + f.length);
    let stats = await get('/admin/stats', admin.token);
    rec('Admin /admin/stats reachable', stats.status < 500, 'status=' + stats.status);
  }

  console.log(JSON.stringify(results, null, 2));
})().catch((e) => { console.error('PROBE ERROR ' + e.message); process.exit(1); });