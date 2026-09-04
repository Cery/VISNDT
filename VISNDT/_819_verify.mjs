/* 819 Permission Foundation — runtime verification (pure API, no CDP).
   Uses only known-good demo creds (pw demso123456 for @visndt.local seeded users). */
const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`); };
const login = async (email) => {
  const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: PW }) });
  const j = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, token: j?.data?.accessToken } : { ok: false, status: r.status };
};
const csrf = async () => (await (await fetch(API + '/auth/csrf')).json().catch(() => ({})))?.data?.csrfToken || null;
const req = async (token, method, path, body) => {
  const c = await csrf();
  const h = { Authorization: token ? 'Bearer ' + token : '', 'X-CSRF-Token': c, Cookie: 'csrf_token=' + c };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  const r = await fetch(API + path, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
};
const ORG_A = '697c99b2-1447-491a-a68a-566f51ca9181'; // ENABLED supplier (深圳市微视)
const ORG_B = '926d5a96-e1be-455c-8d58-8f4a79b6735d'; // ENABLED supplier (明视)
const ORG_D = 'eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d'; // DISABLED supplier (锐视)
(async () => {
  const admin = await login('demo.admin@visndt.local');
  check('admin login', admin.ok);
  if (!admin.ok) { console.log(JSON.stringify(results, null, 1)); process.exit(2); }
  const c = await csrf();
  const eh = { Authorization: 'Bearer ' + admin.token, 'X-CSRF-Token': c, Cookie: 'csrf_token=' + c, 'Content-Type': 'application/json' };

  const enA = await (await fetch(API + '/organizations/' + ORG_A + '/supplier-product-enablement', { method: 'PATCH', headers: eh, body: JSON.stringify({ enabled: true }) })).json().catch(() => ({}));
  const enB = await (await fetch(API + '/organizations/' + ORG_B + '/supplier-product-enablement', { method: 'PATCH', headers: eh, body: JSON.stringify({ enabled: true }) })).json().catch(() => ({}));
  check('admin enable orgA', enA?.data?.supplierProductManagementEnabled === true);
  check('admin enable orgB', enB?.data?.supplierProductManagementEnabled === true);

  let ppId = null;
  for (const ep of ['/platform-products', '/products']) {
    const r = await fetch(API + ep).catch(() => null);
    if (r && r.ok) { const j = await r.json().catch(() => ({})); const arr = Array.isArray(j?.data?.data) ? j.data.data : (Array.isArray(j?.data) ? j.data : []); if (arr.length && arr[0]?.id) { ppId = arr[0].id; break; } }
  }
  check('found platform product id', !!ppId);
  if (!ppId) process.exit(2);

  const mk = async (orgId, modelNumber) => (await fetch(API + '/admin/supplier-products', { method: 'POST', headers: eh, body: JSON.stringify({ organizationId: orgId, platformProductId: ppId, brand: 'TestBrand819', series: 'S', modelNumber, description: '819 controlled test - non-production', technicalDescription: 't', applicationInfo: 'a' }) })).json().catch(() => ({}));
  const pA = await mk(ORG_A, 'M819-OWN-A');
  const pB = await mk(ORG_B, 'M819-OWN-B');
  const pidA = pA?.data?.id, pidB = pB?.data?.id;
  check('admin created product under orgA', !!pidA);
  check('admin created product under orgB', !!pidB);
  await sleep(200);

  // ENABLED supplier (demo.supplier.01 @ orgB) positive + isolation
  const sup = await login('demo.supplier.01@visndt.local');
  check('ENABLED supplier login', sup.ok);
  const my = await req(sup.token, 'GET', '/supplier-products/my');
  const list = Array.isArray(my?.body?.data?.data) ? my.body.data.data : (Array.isArray(my?.body?.data) ? my.body.data : []);
  check('ENABLED supplier GET /my → 200', my.status === 200, 'status=' + my.status);
  check('ENABLED supplier list contains OWN product', list.some(p => p.id === pidB), 'count=' + list.length);
  check('ENABLED supplier list does NOT contain OTHER-org product', !list.some(p => p.id === pidA));
  const own = await req(sup.token, 'GET', '/supplier-products/my/' + pidB);
  check('ENABLED supplier own findOne → 200', own.status === 200, 'status=' + own.status);
  const cross = await req(sup.token, 'GET', '/supplier-products/my/' + pidA);
  check('CROSS-ORG read of orgA product → 404 (isolated)', cross.status === 404, 'status=' + cross.status);

  // DISABLED supplier → denied
  const supD = await login('demo.supplier.02@visndt.local');
  const dis = await req(supD.token, 'GET', '/supplier-products/my');
  check('DISABLED supplier GET /my → 403', dis.status === 403, 'status=' + dis.status);

  // BUYER → denied
  const buyer = await login('demo.buyer.01@visndt.local');
  const bx = await req(buyer.token, 'GET', '/supplier-products/my');
  check('BUYER GET /my → 403', bx.status === 403, 'status=' + bx.status);

  // Unauthenticated → denied
  const unauth = await req(null, 'GET', '/supplier-products/my');
  check('UNAUTHENTICATED GET /my → 401', unauth.status === 401, 'status=' + unauth.status);

  // Admin-only toggle: a supplier cannot disable another org
  const tog = await req(supD.token, 'PATCH', '/organizations/' + ORG_B + '/supplier-product-enablement', { enabled: false });
  check('supplier PATCH enablement → 403 (admin-only)', tog.status === 403, 'status=' + tog.status);

  // cleanup
  const d1 = await req(admin.token, 'DELETE', '/admin/supplier-products/' + pidA);
  const d2 = await req(admin.token, 'DELETE', '/admin/supplier-products/' + pidB);
  check('cleanup deleted test products', d1.status === 200 && d2.status === 200);

  const passed = results.filter(r => r.pass).length;
  console.log('\n=== 819 VERIFY SUMMARY ===');
  console.log(JSON.stringify({ passCount: passed, total: results.length, ALL_PASS: passed === results.length, items: results }, null, 1));
  process.exit(0);
})().catch((e) => { console.error('FATAL ' + e.message); process.exit(2); });