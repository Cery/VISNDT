// 664 three-role + scale regression (HTTP, ports to direct backend :4000)
const BASE = 'http://localhost:4000/api/v1';
const out = [];

async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const set = r.headers.get('set-cookie') || '';
  const cookies = set.split(/,(?=\s*\w+=\w+)/);
  const filtered = cookies.filter((c) => /(access_token|refresh_token)=/.test(c)).map((c) => c.split(';')[0]).join('; ');
  return { status: r.status, cookie: filtered };
}
async function get(path, cookie) {
  const r = await fetch(BASE + path, { headers: { Cookie: cookie || '' } });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
}

async function main() {
  const sup = await login('demo.supplier.01@visndt.local', 'demo123456');
  const buyer = await login('demo.buyer.01@visndt.local', 'demo123456');
  const admin = await login('admin@visndt.com', 'admin123456');
  out.push(`logins supplier=${sup.status} buyer=${buyer.status} admin=${admin.status}`);

  // A. Page 2 / Page 3 (total 11, pageSize 5)
  const p2 = await get('/workspace/supplier/runtime/products?page=2&pageSize=5', sup.cookie);
  out.push(`[A] page2 size5 -> items=${p2.body?.data?.data?.length} page=${p2.body?.data?.page}`);
  const p3 = await get('/workspace/supplier/runtime/products?page=3&pageSize=5', sup.cookie);
  out.push(`[A] page3 size5 -> items=${p3.body?.data?.data?.length} total=${p3.body?.data?.total}`);

  // B. Buyer: public search publishes-only boundary + multi-supplier same capability
  const s = await get('/search?q=%E6%98%8E%E8%A7%86', buyer.cookie);
  const sps = s.body?.supplierProducts?.items ?? [];
  const emptyCap = sps.filter((i) => i.capability && !i.capability.name).length;
  const orgSet = new Set(sps.map((i) => i.supplierProduct?.organization?.id).filter(Boolean));
  out.push(`[B] buyer search 明视 -> sp=${s.body?.supplierProducts?.total} distinctOrgs=${orgSet.size} emptyCapabilityName=${emptyCap}`);

  // C. Supplier inquiry-context for first PUBLISHED product
  const pubList = await get('/workspace/supplier/runtime/products?status=PUBLISHED&page=1&pageSize=100', sup.cookie);
  const pid = pubList.body?.data?.data?.[0]?.id;
  if (pid) {
    const ctx = await get(`/workspace/supplier/runtime/products/${pid}/inquiry-context`, sup.cookie);
    out.push(`[C] inquiry-context ${pid.slice(0,8)} -> status=${ctx.status} statusField=${ctx.body?.data?.status} inquiries=${ctx.body?.data?.inquiries?.length}`);
  }

  // D. Admin supplier-products pool list + status filter
  const adminPool = await get('/admin/supplier-products?page=1&pageSize=50', admin.cookie);
  out.push(`[D] admin pool -> status=${adminPool.status} total=${adminPool.body?.data?.total ?? adminPool.body?.total}`);
  const adminPub = await get('/admin/supplier-products?status=PUBLISHED', admin.cookie);
  const poolItems = adminPub.body?.data?.data ?? adminPub.body?.data ?? [];
  const pubOnly = (Array.isArray(poolItems) ? poolItems : []).every((i) => i.status === 'PUBLISHED');
  out.push(`[D] admin status=PUBLISHED -> total=${adminPub.body?.data?.total ?? adminPub.body?.total} allPublished=${pubOnly}`);

  // E. Admin dashboard regression (403 fix)
  const stats = await get('/admin/dashboard/stats', admin.cookie);
  out.push(`[E] admin dashboard/stats -> ${stats.status}`);

  console.log(out.join('\n'));
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });