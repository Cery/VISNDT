// 666 M28.1 Regression Verification (read-only; no data pollution)
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
const unwrap = (body) => (body?.data && typeof body.data === 'object' && body.data !== null ? body.data : body);
const totalOf = (body) => unwrap(body)?.total ?? (Array.isArray(unwrap(body)) ? unwrap(body).length : '-');
const itemsOf = (body) => { const d = unwrap(body); if (Array.isArray(d)) return d; if (Array.isArray(d?.data)) return d.data; if (Array.isArray(d?.items)) return d.items; return []; };

const code = (r) => `${r.status}`;
const firstId = (body) => itemsOf(body)[0]?.id ?? null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // Public read-only
  const prodList = await get('/products?pageSize=5', '');
  const prodId = firstId(prodList.body);
  out.push(`[PRODUCT-LIST] public /products -> ${code(prodList)} first=${!!prodId}`);
  if (prodId) {
    const prodDetail = await get('/products/' + prodId, '');
    const p = unwrap(prodDetail.body);
    out.push(`[PRODUCT-DETAIL] public /products/:id -> ${code(prodDetail)} name=${p?.name ?? '-'}`);
  }
  const offers = await get('/offers?pageSize=5', '');
  out.push(`[OFFER] public /offers -> ${code(offers)} total=${totalOf(offers.body)}`);
  const search = await get('/search?q=%E5%86%85%E7%AA%A5%E9%95%9C&pageSize=10', '');
  const sp = unwrap(search.body);
  out.push(`[SEARCH] public /search q=内窥镜 -> ${code(search)} products=${sp?.products?.total ?? '-'} sp=${sp?.supplierProducts?.total ?? '-'}`);

  // Buyer (authed)
  await sleep(1500);
  const buyer = await login('demo.buyer.01@visndt.local', 'demo123456');
  out.push(`[BUYER-LOGIN] ${buyer.status}`);
  const inquiries = await get('/inquiries/mine', buyer.cookie);
  out.push(`[INQUIRY] buyer /inquiries/mine -> ${code(inquiries)} total=${totalOf(inquiries.body)}`);
  const demands = await get('/demands?pageSize=5', buyer.cookie);
  out.push(`[DEMAND] buyer /demands -> ${code(demands)} total=${totalOf(demands.body)}`);
  const rfqMine = await get('/rfqs/mine', buyer.cookie);
  out.push(`[RFQ] buyer /rfqs/mine -> ${code(rfqMine)} total=${totalOf(rfqMine.body)}`);

  // Supplier (authed)
  await sleep(1500);
  const sup = await login('demo.supplier.01@visndt.local', 'demo123456');
  out.push(`[SUP-LOGIN] ${sup.status}`);
  const supRfq = await get('/workspace/supplier/rfqs', sup.cookie);
  out.push(`[RFQ-SUPPLIER] supplier /workspace/supplier/rfqs -> ${code(supRfq)} total=${totalOf(supRfq.body)}`);

  // Admin (authed)
  await sleep(1500);
  const adm = await login('demo.admin@visndt.local', 'demo123456');
  out.push(`[ADM-LOGIN] ${adm.status}`);
  const mStats = await get('/admin/matching/stats', adm.cookie);
  out.push(`[MATCHING] admin /admin/matching/stats -> ${code(mStats)}`);
  const dStats = await get('/admin/dashboard/stats', adm.cookie);
  out.push(`[ADMIN-DASH] admin /admin/dashboard/stats -> ${code(dStats)}`);

  console.log(out.join('\n'));
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
