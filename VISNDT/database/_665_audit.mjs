// 665 M28.0 Platform Productization End-to-End Experience Audit — runtime journey script
// Hits the live API on :4000 with real demo accounts. Read-oriented; creates only ONE demo inquiry
// as real journey evidence (reversible demo data, not production).
import { writeFileSync } from 'node:fs';

const BASE = 'http://localhost:4000/api/v1';
const results = { health: null, logins: {}, buyer: {}, supplier: {}, admin: {}, loop: {} };
const out = [];
const rec = (key, val) => { results[key] = val; return results[key]; };

function headers(extra = {}) { return { 'Content-Type': 'application/json', ...extra }; }

async function raw(path, opts = {}) {
  const res = await fetch(BASE + path, { redirect: 'manual', ...opts, headers: headers(opts.headers) });
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body, cookies: res.headers.getSetCookie ? res.headers.getSetCookie() : [] };
}

// build cookie header from set-cookie pairs
function cookieStr(cookieArr) {
  const names = new Set();
  for (const c of cookieArr) {
    const m = c.split(';')[0];
    const name = m.split('=')[0];
    if (['access_token', 'refresh_token'].includes(name)) names.add(m);
  }
  return [...names].join('; ');
}

async function login(email, password) {
  const r = await raw('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  return { status: r.status, cookie: cookieStr(r.cookies), body: r.body };
}

async function authGet(cookie, path) {
  const r = await raw(path, { headers: { Cookie: cookie } });
  const d = r.body?.data ?? r.body;
  return { status: r.status, data: d, raw: r.body };
}

const summarize = (o) => (o ? JSON.stringify(o) : '');

(async () => {
  // health
  const h = await raw('/health');
  rec('health', { status: h.status, body: h.body });

  // ───────── 1. LOGINS ─────────
  const accounts = [
    ['admin', 'demo.admin@visndt.local'],
    ['buyer', 'demo.buyer.01@visndt.local'],
    ['supplier1', 'demo.supplier.01@visndt.local'],
    ['supplier2', 'demo.supplier.02@visndt.local'],
  ];
  const cookies = {};
  for (const [k, email] of accounts) {
    const l = await login(email, 'demo123456');
    cookies[k] = l.cookie;
    results.logins[k] = { status: l.status, hasCookie: !!l.cookie, email: l.body?.data?.email ?? null };
    out.push(`LOGIN[${k}] ${email} -> ${l.status} cookie=${!!l.cookie} email=${l.body?.data?.email ?? '-'}`);
  }

  // ───────── 2. BUYER PUBLIC DISCOVERY ─────────
  const buyer = {};
  // unified search
  const sAll = await raw('/search?q=' + encodeURIComponent('检测'));
  buyer.searchAll = { status: sAll.status, spTotal: sAll.body?.supplierProducts?.total ?? null, spItems: (sAll.body?.supplierProducts?.items ?? []).length, productsTotal: sAll.body?.products?.total ?? null, hasFacets: !!sAll.body?.supplierProductFacets };
  out.push(`BUYER /search?q=检测 -> ${sAll.status} spTotal=${buyer.searchAll.spTotal} productsTotal=${buyer.searchAll.productsTotal} facets=${buyer.searchAll.hasFacets}`);

  // supplier-product search
  const sp = await raw('/search?type=supplier-product&q=' + encodeURIComponent('明视'));
  buyer.spSearch = { status: sp.status, total: sp.body?.supplierProducts?.total ?? null, items: (sp.body?.supplierProducts?.items ?? []).length };
  out.push(`BUYER /search?type=supplier-product&q=明视 -> ${sp.status} total=${buyer.spSearch.total} items=${buyer.spSearch.items}`);
  // capture first published SP for inquiry
  const firstSP = sp.body?.supplierProducts?.items?.find((i) => i.supplierProduct?.status === 'PUBLISHED');

  // search/context + facets
  const ctx = await raw('/search/context?q=' + encodeURIComponent('检测'));
  buyer.context = { status: ctx.status, hasPollution: null };
  out.push(`BUYER /search/context -> ${ctx.status}`);

  // capability / product detail
  const capSlug = firstSP?.capability?.slug;
  const capId = firstSP?.capability?.id;
  const prodId = firstSP?.supplierProduct?.platformProductId;
  buyer.firstSP = {
    orgName: firstSP?.supplierProduct?.organization?.name ?? null,
    brand: firstSP?.supplierProduct?.brand ?? null,
    series: firstSP?.supplierProduct?.series ?? null,
    modelNumber: firstSP?.supplierProduct?.modelNumber ?? null,
    status: firstSP?.supplierProduct?.status ?? null,
    commercial: firstSP?.commercialSummary ?? null,
    inquiryAvailable: firstSP?.inquiryAvailable ?? null,
    orgId: firstSP?.supplierProduct?.organization?.id ?? null,
    spprodId: firstSP?.supplierProduct?.id ?? null,
    capId,
    prodId,
  };
  out.push(`BUYER firstSP -> org=${buyer.firstSP.orgName} brand=${buyer.firstSP.brand} series=${buyer.firstSP.series} model=${buyer.firstSP.modelNumber} status=${buyer.firstSP.status} commercial=${JSON.stringify(buyer.firstSP.commercial)} inqAvail=${buyer.firstSP.inquiryAvailable}`);

  // product detail by slug (platform product / capability)
  if (capSlug) {
    const pd = await raw('/products/' + capSlug);
    buyer.productDetail = { status: pd.status, name: pd.body?.data?.name ?? pd.body?.name ?? null };
    out.push(`BUYER /products/${capSlug} -> ${pd.status} name=${buyer.productDetail.name}`);
  }
  // capabilities/:id
  if (capId) {
    const cd = await raw('/capabilities/' + capId);
    buyer.capDetail = { status: cd.status };
    out.push(`BUYER /capabilities/${capId} -> ${cd.status}`);
  }

  // find an offer for inquiry: use /offers (org-scoped) as buyer, else fall back via supplier runtime
  let offerId = null;
  const offs = await raw('/offers', { method: 'GET' });
  buyer.offers = { status: offs.status };
  out.push(`BUYER /offers -> ${offs.status}`);
  if (offs.status === 200 && offs.body?.data?.length) {
    const o = offs.body.data.find((x) => x.supplierProductId === firstSP?.supplierProduct?.id) || offs.body.data[0];
    offerId = o.id;
    buyer.inquiryOfferId = offerId;
  }

  // ───────── 3. CREATE INQUIRY (real journey) ─────────
  buyer.inquiry = { status: null, contextOk: null };
  if (firstSP && buyer.firstSP.prodId && buyer.firstSP.orgId) {
    const inq = await raw('/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        productId: buyer.firstSP.prodId,
        offerId: offerId ?? '00000000-0000-0000-0000-000000000000',
        organizationId: buyer.firstSP.orgId,
        supplierProductId: buyer.firstSP.spprodId,
        name: 'Demo Buyer',
        email: 'demo.buyer.01@visndt.local',
        message: '665 audit: please provide quotation for this model.',
      }),
    });
    buyer.inquiry.status = inq.status;
    const inqId = inq.body?.data?.id ?? inq.body?.data?.data?.id ?? null;
    buyer.inquiry.id = inqId;
    out.push(`BUYER POST /inquiries -> ${inq.status} id=${inqId}`);
    // buyer reads back my inquiries (auth) to confirm context fields
    if (inqId) {
      const mine = await authGet(cookies.buyer, '/inquiries/' + inqId);
      const d = mine.data?.data ?? mine.data;
      buyer.inquiry.contextOk = !!(d && (d.supplierProductId === buyer.firstSP.spprodId));
      buyer.inquiry.readback = { status: mine.status, model: d?.supplierProduct?.modelNumber ?? d?.modelNumber ?? null, org: d?.supplierOrganization?.name ?? d?.organization?.name ?? null };
      out.push(`BUYER GET /inquiries/${inqId} -> ${mine.status} model=${buyer.inquiry.readback.model} org=${buyer.inquiry.readback.org}`);
      buyer.inquiryId = inqId;
    }
  }

  // ───────── 4. SUPPLIER JOURNEY (supplier1) ─────────
  const supplier = {};
  const rt = await authGet(cookies.supplier1, '/workspace/supplier/runtime/products?page=2&pageSize=5');
  supplier.runtimePaged = { status: rt.status, page: rt.data?.page, pageSize: rt.data?.pageSize, total: rt.data?.total, items: (rt.data?.data ?? []).length };
  out.push(`SUP /runtime/products?page=2&pageSize=5 -> ${rt.status} page=${supplier.runtimePaged.page} total=${supplier.runtimePaged.total} items=${supplier.runtimePaged.items}`);
  const rtPublish = await authGet(cookies.supplier1, '/workspace/supplier/runtime/products?status=PUBLISHED');
  supplier.statusFilter = { status: rtPublish.status, total: rtPublish.data?.total };
  out.push(`SUP /runtime/products?status=PUBLISHED -> ${rtPublish.status} total=${supplier.statusFilter.total}`);
  const rtQ = await authGet(cookies.supplier1, '/workspace/supplier/runtime/products?q=' + encodeURIComponent('VX-6000'));
  supplier.qSearch = { status: rtQ.status, total: rtQ.data?.total };
  out.push(`SUP /runtime/products?q=VX-6000 -> ${rtQ.status} total=${supplier.qSearch.total}`);
  const rtSeries = await authGet(cookies.supplier1, '/workspace/supplier/runtime/products?series=' + encodeURIComponent('精密扫描'));
  supplier.seriesFilter = { status: rtSeries.status, total: rtSeries.data?.total };
  out.push(`SUP /runtime/products?series=精密扫描 -> ${rtSeries.status} total=${supplier.seriesFilter.total}`);

  // buyer interest / inquiry context for the created inquiry's SP
  if (buyer.inquiryId && buyer.firstSP.spprodId) {
    const ic = await authGet(cookies.supplier1, `/workspace/supplier/runtime/products/${buyer.firstSP.spprodId}/inquiry-context`);
    supplier.inquiryContext = { status: ic.status };
    const icd = ic.data?.data ?? ic.data;
    supplier.inquiryContext.spId = icd?.id;
    supplier.inquiryContext.inquiries = Array.isArray(icd?.inquiries) ? icd.inquiries.length : null;
    out.push(`SUP /runtime/products/:id/inquiry-context -> ${ic.status} sp=${supplier.inquiryContext.spId} inquiries=${supplier.inquiryContext.inquiries}`);
  }
  const ov = await authGet(cookies.supplier1, '/workspace/supplier/overview');
  supplier.overview = { status: ov.status };
  out.push(`SUP /workspace/supplier/overview -> ${ov.status}`);
  const rfqAvail = await authGet(cookies.supplier1, '/rfqs/available');
  supplier.rfqsAvailable = { status: rfqAvail.status };
  out.push(`SUP /rfqs/available -> ${rfqAvail.status}`);

  // second supplier scale check (supplier2 multi-supplier)
  const ov2 = await authGet(cookies.supplier2, '/workspace/supplier/overview');
  supplier.overview2 = { status: ov2.status };
  out.push(`SUP2 /workspace/supplier/overview -> ${ov2.status}`);

  // ───────── 5. ADMIN JOURNEY (admin) ─────────
  const admin = {};
  const dash = {};
  for (const p of ['stats', 'activities', 'pending', 'status', 'trend']) {
    const r = await authGet(cookies.admin, '/admin/dashboard/' + p);
    dash[p] = r.status;
    out.push(`ADMIN /admin/dashboard/${p} -> ${r.status}`);
  }
  admin.dashboard = dash;
  // governance pool
  const pool = await authGet(cookies.admin, '/admin/supplier-products?page=1&pageSize=10');
  admin.pool = { status: pool.status, total: pool.data?.total ?? null, items: (pool.data?.data ?? pool.data?.items ?? []).length };
  out.push(`ADMIN /admin/supplier-products?page=1&pageSize=10 -> ${pool.status} total=${admin.pool.total}`);
  const poolPub = await authGet(cookies.admin, '/admin/supplier-products?status=PUBLISHED');
  admin.filterPublished = { status: poolPub.status, total: poolPub.data?.total ?? null };
  out.push(`ADMIN /admin/supplier-products?status=PUBLISHED -> ${poolPub.status} total=${admin.filterPublished.total}`);
  // governance detail (any item)
  const someId = pool.status === 200 ? (pool.data?.data?.[0]?.id ?? pool.data?.items?.[0]?.id ?? null) : null;
  if (someId) {
    const det = await authGet(cookies.admin, '/admin/supplier-products/' + someId);
    admin.poolDetail = { status: det.status, id: someId };
    out.push(`ADMIN /admin/supplier-products/:id -> ${det.status}`);
  }
  // media / content / knowledge / analytics
  admin.files = (await authGet(cookies.admin, '/files?page=1&pageSize=5')).status;
  admin.content = (await authGet(cookies.admin, '/content/public')).status;
  admin.knowledgeDomains = (await authGet(cookies.admin, '/knowledge/domains')).status;
  admin.analytics = (await authGet(cookies.admin, '/admin/analytics/business/funnel')).status;
  admin.monitoring = (await authGet(cookies.admin, '/admin/monitoring/overview')).status;
  admin.audit = (await authGet(cookies.admin, '/admin/audit-logs')).status;
  out.push(`ADMIN media/files=${admin.files} content=${
    admin.content} knowledge/domains=${admin.knowledgeDomains} analytics=${admin.analytics} monitoring=${admin.monitoring} audit=${admin.audit}`);

  // ───────── 6. BUSINESS CLOSED LOOP (read existing real records) ─────────
  const loop = {};
  const dm = await authGet(cookies.buyer, '/demands/mine');
  loop.demands = { status: dm.status };
  out.push(`LOOP GET /demands/mine -> ${dm.status}`);
  const mt = await raw('/matches');
  loop.matches = { status: mt.status, count: Array.isArray(mt.body?.data) ? mt.body.data.length : null };
  out.push(`LOOP GET /matches -> ${mt.status} count=${loop.matches.count}`);
  const rfqMi = await authGet(cookies.buyer, '/rfqs/mine');
  loop.rfqs = { status: rfqMi.status };
  out.push(`LOOP GET /rfqs/mine -> ${rfqMi.status}`);
  const notif = await authGet(cookies.buyer, '/notifications');
  loop.notifications = { status: notif.status };
  out.push(`LOOP GET /notifications -> ${notif.status}`);

  rec('buyer', buyer);
  rec('supplier', supplier);
  rec('admin', admin);
  rec('loop', loop);
  writeFileSync('_665_results.json', JSON.stringify(results, null, 2));
  console.log('\n===== 665 AUDIT SUMMARY =====');
  console.log(out.join('\n'));
})().catch((e) => { console.error('FATAL', e); process.exit(1); });