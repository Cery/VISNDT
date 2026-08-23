// 664 runtime verification: Supplier Runtime pagination/search/filter + Search org display
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
  // Keep a minimal cookie header (access_token + refresh_token + csrf-like)
  const filtered = cookies
    .filter((c) => /(access_token|refresh_token)=/.test(c))
    .map((c) => c.split(';')[0])
    .join('; ');
  return { status: r.status, cookie: filtered };
}

async function get(path, cookie) {
  const r = await fetch(BASE + path, { headers: { Cookie: cookie } });
  const body = await r.json();
  return { status: r.status, body };
}

async function main() {
  const sup = await login('demo.supplier.01@visndt.local', 'demo123456');
  out.push(`supplier login status=${sup.status} cookie=${!!sup.cookie}`);
  if (!sup.cookie) { console.log(out.join('\n')); return; }

  // A. Pagination + metadata
  const p1 = await get('/workspace/supplier/runtime/products?page=1&pageSize=5', sup.cookie);
  out.push(`[A] page1 size5 -> status=${p1.status} total=${p1.body?.data?.total} page=${p1.body?.data?.page} pageSize=${p1.body?.data?.pageSize} items=${p1.body?.data?.data?.length}`);

  // B. Status filter (PUBLISHED only, large pageSize)
  const pub = await get('/workspace/supplier/runtime/products?status=PUBLISHED&page=1&pageSize=100', sup.cookie);
  const onlyPub = (pub.body?.data?.data ?? []).every((i) => i.status === 'PUBLISHED');
  out.push(`[B] status=PUBLISHED -> total=${pub.body?.data?.total} allPublished=${onlyPub}`);

  // C. Search by q (model substring from data)
  const firstModel = p1.body?.data?.data?.[0];
  if (firstModel) {
    const qword = firstModel.modelNumber.slice(0, 4);
    const sq = await get(`/workspace/supplier/runtime/products?q=${encodeURIComponent(qword)}`, sup.cookie);
    out.push(`[C] q=${qword} -> total=${sq.body?.data?.total} matched=${sq.body?.data?.data?.every((i)=> (i.modelNumber+i.brand+i.series).includes(qword))}`);
  }

  // D. Series filter
  const series = p1.body?.data?.data?.find((i) => i.series)?.series;
  if (series) {
    const sfs = await get(`/workspace/supplier/runtime/products?series=${encodeURIComponent(series)}`, sup.cookie);
    const ok = (sfs.body?.data?.data ?? []).every((i) => i.series === series);
    out.push(`[D] series=${series} -> total=${sfs.body?.data?.total} allMatch=${ok}`);
  }

  // E. Combined: status + series
  if (series) {
    const combo = await get(`/workspace/supplier/runtime/products?status=PUBLISHED&series=${encodeURIComponent(series)}`, sup.cookie);
    const ok = (combo.body?.data?.data ?? []).every((i) => i.status === 'PUBLISHED' && i.series === series);
    out.push(`[E] status=PUBLISHED&series=${series} -> total=${combo.body?.data?.total} allMatch=${ok}`);
  }

  // F. Search supplier-product org display (public /search)
  const se = await login('demo.buyer.01@visndt.local', 'demo123456');
  const cookie2 = se.cookie || sup.cookie;
  const s = await get('/search?type=supplier-product&q=%E6%98%8E%E8%A7%86', cookie2);
  const items = s.body?.supplierProducts?.items ?? [];
  out.push(`[F] search supplier-product 明视 -> status=${s.status} total=${s.body?.supplierProducts?.total}`);
  if (items[0]) {
    const org = items[0].supplierProduct?.organization;
    out.push(`    first card org=${org ? `${org.name}(${org.id})` : 'NONE'} brand=${items[0].supplierProduct?.brand} model=${items[0].supplierProduct?.modelNumber} price=${items[0].commercialSummary?.priceFrom}~${items[0].commercialSummary?.priceTo}`);
  }

  console.log(out.join('\n'));
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });