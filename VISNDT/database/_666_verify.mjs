// 666 M28.1 Demo Scale Fixture Formalization — Runtime Validation Matrix (v4)
// Wire format for /search: { success, data, message, timestamp } where data = unified payload.
// Constraints: q REQUIRED (empty string ok), pageSize max 50. Total logins = 4 (< 5/min).
const BASE = 'http://localhost:4000/api/v1';
const out = [];

async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const set = r.headers.get('set-cookie') || '';
  const cookies = set.split(/,(?=\s*\w+=\w+)/);
  const filtered = cookies
    .filter((c) => /(access_token|refresh_token)=/.test(c))
    .map((c) => c.split(';')[0])
    .join('; ');
  return { status: r.status, cookie: filtered };
}

async function get(path, cookie) {
  const r = await fetch(BASE + path, { headers: { Cookie: cookie || '' } });
  let body = null;
  try { body = await r.json(); } catch {}
  return { status: r.status, body };
}

const itemsOf = (dim) => (Array.isArray(dim) ? dim : Array.isArray(dim?.items) ? dim.items : []);
// unwrap ApiResponse envelope { success, data } -> data; fall back to raw body
const unwrap = (body) => (body?.data && typeof body.data === 'object' && body.data !== null ? body.data : body);
const supItems = (body) => itemsOf(unwrap(body)?.supplierProducts);
const supTotal = (body) => unwrap(body)?.supplierProducts?.total;
const dataArr = (body) => {
  const d = body?.data;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.items)) return d.items;
  return [];
};

async function main() {
  // ---- 16. Admin Governance pool first (id -> org map for multi-supplier attribution) ----
  const adm = await login('demo.admin@visndt.local', 'demo123456');
  const apool = await get('/admin/supplier-products?pageSize=100', adm.cookie);
  const apoolArr = dataArr(apool.body);
  const idToOrg = {};
  for (const x of apoolArr) idToOrg[x.id] = x.organization?.name || '?';
  out.push(`[16-ADMIN] login=${adm.status} pool n=${apoolArr.length} orgs=${[...new Set(Object.values(idToOrg))].join(',')}`);
  if (apoolArr.length) {
    const det = await get('/admin/supplier-products/' + apoolArr[0].id, adm.cookie);
    const d = det.body?.data;
    out.push(`[16-ADMIN-DETAIL] status=${det.status} hasOrg=${!!d?.organization} hasProduct=${!!d?.platformProduct} brand=${d?.brand} series=${d?.series} model=${d?.modelNumber} media=${Array.isArray(d?.media) ? d.media.length : 'n/a'} params=${Array.isArray(d?.parameterValues) ? d.parameterValues.length : 'n/a'} offer=${d?.offer ? 'yes' : 'no'}`);
  }
  const apub = await get('/admin/supplier-products?status=PUBLISHED&pageSize=100', adm.cookie);
  const apubArr = dataArr(apub.body);
  out.push(`[16-ADMIN-FILTER] status=PUBLISHED n=${apubArr.length} allMatch=${apubArr.every((i) => i.status === 'PUBLISHED')}`);

  // ---- 14. Published / Non-Published Boundary (public /search) ----
  const search = await get('/search?q=&type=supplier-product&pageSize=50', '');
  const spItems = supItems(search.body);
  const spStatus = {};
  for (const i of spItems) {
    const st = i.supplierProduct?.status || 'UNKNOWN';
    spStatus[st] = (spStatus[st] || 0) + 1;
  }
  const onlyPublished = Object.keys(spStatus).every((k) => k === 'PUBLISHED');
  out.push(`[14-BOUNDARY] public supplier-product total=${supTotal(search.body)} status=${JSON.stringify(spStatus)} onlyPublished=${onlyPublished}`);

  // ---- Buyer Discovery (single login, many calls) ----
  const buyer = await login('demo.buyer.01@visndt.local', 'demo123456');
  out.push(`[BUYER] login=${buyer.status}`);
  const kw = await get('/search?q=%E5%86%85%E7%AA%A5%E9%95%9C&type=supplier-product&pageSize=50', buyer.cookie);
  const kwItems = supItems(kw.body);
  out.push(`[13-KEYWORD] q=内窥镜 total=${supTotal(kw.body)} n=${kwItems.length} allPublished=${kwItems.every((i) => i.supplierProduct?.status === 'PUBLISHED')}`);
  const br = await get('/search?q=&brand=%E6%98%8E%E8%A7%86&type=supplier-product&pageSize=50', buyer.cookie);
  const brItems = supItems(br.body);
  out.push(`[13-BRAND] brand=明视 total=${supTotal(br.body)} allMatch=${brItems.every((i) => i.supplierProduct?.brand === '明视')}`);
  const se = await get('/search?q=&series=%E7%B2%BE%E5%AF%86%E6%89%AB%E6%8F%8F%E7%B3%BB%E5%88%97&type=supplier-product&pageSize=50', buyer.cookie);
  const seItems = supItems(se.body);
  out.push(`[13-SERIES] series=精密扫描系列 total=${supTotal(se.body)} allMatch=${seItems.every((i) => i.supplierProduct?.series === '精密扫描系列')}`);
  const ho = await get('/search?q=&hasOffer=true&type=supplier-product&pageSize=50', buyer.cookie);
  const hoItems = supItems(ho.body);
  out.push(`[13-HASOFFER] hasOffer=true total=${supTotal(ho.body)} allHaveOffer=${hoItems.every((i) => (i.commercialSummary?.activeOfferCount ?? 0) > 0)}`);
  const pg1 = await get('/search?q=&page=1&pageSize=2&type=supplier-product', buyer.cookie);
  const pg2 = await get('/search?q=&page=2&pageSize=2&type=supplier-product', buyer.cookie);
  const p1Items = supItems(pg1.body);
  const p2Items = supItems(pg2.body);
  const distinct = new Set([...p1Items.map((i) => i.supplierProduct?.id), ...p2Items.map((i) => i.supplierProduct?.id)]);
  out.push(`[13-PAGINATION] page1 n=${p1Items.length} page2 n=${p2Items.length} distinct=${distinct.size} total=${supTotal(pg1.body)}`);

  // ---- 19. Multi-Supplier (VX-6000) via admin org map ----
  const multi = await get('/search?q=VX-6000&type=supplier-product&pageSize=50', buyer.cookie);
  const multiItems = supItems(multi.body);
  const orgMap = {};
  for (const i of multiItems) {
    const on = idToOrg[i.supplierProduct?.id] || '?';
    orgMap[on] = (orgMap[on] || 0) + 1;
  }
  out.push(`[19-MULTI-SUPPLIER] q=VX-6000 total=${supTotal(multi.body)} suppliers=${Object.keys(orgMap).length} perOrg=${JSON.stringify(orgMap)} allPublished=${multiItems.every((i) => i.supplierProduct?.status === 'PUBLISHED')}`);

  // ---- 15. Supplier Isolation (s1 & s2) ----
  const s1 = await login('demo.supplier.01@visndt.local', 'demo123456');
  const s2 = await login('demo.supplier.02@visndt.local', 'demo123456');
  const r1 = await get('/workspace/supplier/runtime/products?pageSize=100', s1.cookie);
  const r2 = await get('/workspace/supplier/runtime/products?pageSize=100', s2.cookie);
  const a1 = dataArr(r1.body);
  const a2 = dataArr(r2.body);
  const id1 = new Set(a1.map((x) => x.id));
  const cross = a2.filter((x) => id1.has(x.id)).length;
  const brand1 = [...new Set(a1.map((x) => x.brand))];
  const brand2 = [...new Set(a2.map((x) => x.brand))];
  out.push(`[15-ISOLATION] s1(${s1.status}) n=${a1.length} brands=${JSON.stringify(brand1)} | s2(${s2.status}) n=${a2.length} brands=${JSON.stringify(brand2)} | crossVisible=${cross}`);

  // ---- 18. Inquiry Context (s1 PUBLISHED model) ----
  const pub1 = a1.find((x) => x.status === 'PUBLISHED');
  if (pub1) {
    const ctx = await get(`/workspace/supplier/runtime/products/${pub1.id}/inquiry-context`, s1.cookie);
    const c = ctx.body?.data ?? ctx.body;
    out.push(`[18-INQUIRY-CONTEXT] model=${pub1.modelNumber} -> status=${ctx.status} keys=${c ? JSON.stringify(Object.keys(c)) : 'NONE'}`);
  } else {
    out.push('[18-INQUIRY-CONTEXT] no PUBLISHED model for s1');
  }

  console.log(out.join('\n'));
  console.log('DONE');
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
