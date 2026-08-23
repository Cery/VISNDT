/**
 * M28.1 M667 — Supplier + Admin regression smoke (temp runtime verification)
 * Run: npx tsx verify_667_regression.ts  (database dir, API on localhost:4000)
 */
const BASE = 'http://localhost:4000/api/v1';
const results: { step: string; ok: boolean; detail: string }[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}
const is2xx = (s: number) => s >= 200 && s < 300;

async function request(method: string, path: string, opts: { json?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : undefined,
  });
  const setCookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text.slice(0, 200) }; }
  return { status: res.status, json, setCookies };
}
function extractCookie(setCookies: string[], name: string): string | undefined {
  for (const c of setCookies) {
    const m = c.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    if (m) return m[1];
  }
  return undefined;
}
async function login(email: string, password: string) {
  const r = await request('POST', '/auth/login', { json: { email, password } });
  const token = extractCookie(r.setCookies, 'access_token');
  return { ok: r.status >= 200 && r.status < 300 && !!token, token, status: r.status, json: r.json };
}

async function main() {
  console.log('=== M667 Supplier + Admin Regression Smoke ===\n');

  // ---- Supplier regression ----
  const sup = await login('demo.supplier.01@visndt.local', 'demo123456');
  record('POST /auth/login (SUPPLIER)', sup.ok, sup.status === 200 ? 'ok' : `status=${sup.status}`);
  const me = await request('GET', '/auth/me', { token: sup.token });
  record('GET /auth/me (SUPPLIER)', me.status === 200 && me.json?.data?.workspaceRole === 'SUPPLIER', `role=${me.json?.data?.workspaceRole}`);
  // Supplier runtime: my supplier products (664 scaling entry via workspace)
  const mySp = await request('GET', '/workspace/supplier/runtime/products?page=1&pageSize=5', { token: sup.token });
  const spItems = Array.isArray(mySp.json?.data?.data) ? mySp.json.data.data : (Array.isArray(mySp.json?.data) ? mySp.json.data : []);
  record('GET /workspace/supplier/runtime/products', is2xx(mySp.status) && spItems.length >= 1, `status=${mySp.status} items=${spItems.length}`);
  // Supplier runtime inquiry context: use a model OWNED by demo.supplier.01 (明视 VX-6000-PRO)
  const cap = await request('GET', '/capabilities/933ed0db-08e7-4ede-a2c2-ebb1e8521cd1');
  const pubArr = (cap.json?.data?.supplierProducts ?? []).filter((x: any) => x.supplierProduct.status === 'PUBLISHED');
  const mingshiPro = pubArr.find((x: any) => x.supplierProduct.modelNumber === 'VX-6000-PRO');
  const mingshiProId = mingshiPro?.supplierProduct?.id ?? '';
  const inquiryCtx = await request('GET', `/workspace/supplier/runtime/products/${mingshiProId}/inquiry-context`, { token: sup.token });
  record('GET workspace supplier runtime inquiry-context', is2xx(inquiryCtx.status), `status=${inquiryCtx.status} (VX-6000-PRO owner)`);
  // Ownership boundary: demo.supplier.01 must NOT read 锐视's VX-6000-MAX inquiry context (403)
  const otherCtx = await request('GET', '/workspace/supplier/runtime/products/3686a62b-9d1f-4ee3-8336-3e8be68d712a/inquiry-context', { token: sup.token });
  record('Cross-org inquiry-context blocked', otherCtx.status === 403, `status=${otherCtx.status} (expected 403)`);
  // Supplier offers runtime (offers listing is role-scoped in service)
  const myOffers = await request('GET', '/offers?page=1&pageSize=5', { token: sup.token });
  record('GET /offers (supplier listing)', is2xx(myOffers.status), `status=${myOffers.status}`);

  // ---- Admin regression ----
  const adm = await login('demo.admin@visndt.local', 'demo123456');
  record('POST /auth/login (ADMIN)', adm.ok, adm.status === 200 ? 'ok' : `status=${adm.status}`);
  const meA = await request('GET', '/auth/me', { token: adm.token });
  record('GET /auth/me (ADMIN)', meA.status === 200 && !!meA.json?.data?.email, `email=${meA.json?.data?.email} (workspaceRole=null by design)`);
  const dash = await request('GET', '/admin/dashboard/stats', { token: adm.token });
  record('GET /admin/dashboard/stats', is2xx(dash.status), `status=${dash.status}`);
  const pool = await request('GET', '/admin/dashboard/pending', { token: adm.token });
  record('GET /admin/dashboard/pending', is2xx(pool.status), `status=${pool.status}`);
  // SupplierProduct admin pool (664 added admin supplier product management)
  const spPool = await request('GET', '/admin/supplier-products?page=1&pageSize=5', { token: adm.token });
  record('GET /admin/supplier-products', is2xx(spPool.status), `status=${spPool.status}`);

  // ---- Buyer read-path regression (compare relies on read API) ----
  record('GET /capabilities/:id (buyer read)', is2xx(cap.status) && pubArr.length === 7, `status=${cap.status} PUBLISHED=${pubArr.length}`);
  const detail = await request('GET', '/products/933ed0db-08e7-4ede-a2c2-ebb1e8521cd1');
  record('GET /products/:id (buyer read)', is2xx(detail.status), `status=${detail.status}`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Regression Summary: ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) console.log('FAILED:', failed.map((f) => f.step).join(' | '));
  process.exitCode = failed.length ? 1 : 0;
}
main().catch((e) => { console.error('脚本异常:', e); process.exit(1); });
