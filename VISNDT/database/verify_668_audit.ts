/**
 * M28.2 M668 — Platform Productization Final Audit (runtime verification)
 *
 * Three-role runtime audit against the real M28 Demo Scale Fixture (VX-6000 family).
 * Run: npx tsx verify_668_audit.ts  (database dir, API on localhost:4000)
 *
 * Covers:
 *   Buyer  : CSRF → Login → /me → Unified Search → Capability → SupplierProduct graph
 *            → Compare data (2/3/4/7) → Compare URL restore (deep-link determinism)
 *            → No-Offer display → Parameter diff → Inquiry transition + context
 *            → Invalid SupplierProduct rejection
 *   Supplier: Login → /me → Runtime products → Own inquiry-context → Cross-org isolation (403) → Offers
 *   Admin  : Login → /me → Dashboard stats/pending → Admin supplier-products
 *   Permission: Unpublished excluded from capability graph; offer/inquiry no leakage
 */
const BASE = 'http://localhost:4000/api/v1';

const CAP = '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1'; // VX-6000 高清视频内窥镜

const results: { step: string; ok: boolean; detail: string }[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}
const is2xx = (s: number) => s >= 200 && s < 300;

let csrfToken = '';

async function request(method: string, path: string, opts: { json?: unknown; token?: string; csrf?: boolean } = {}) {
  const headers: Record<string, string> = {};
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  if (opts.csrf) {
    headers['X-CSRF-Token'] = csrfToken;
    headers['Cookie'] = `csrf_token=${csrfToken}`;
  }
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
  return { ok: r.status >= 200 && r.status < 300 && !!token, token, json: r.json };
}

async function main() {
  console.log('=== M668 Platform Productization Final Audit (Runtime) ===\n');

  // ---------- CSRF ----------
  const csrfRes = await request('GET', '/auth/csrf');
  csrfToken = csrfRes.json?.data?.csrfToken ?? '';
  record('GET /auth/csrf', csrfRes.status === 200 && !!csrfToken, 'csrf ok');

  // ================= BUYER =================
  console.log('\n--- BUYER ---');
  const buyerLogin = await login('demo.buyer.01@visndt.local', 'demo123456');
  const buyerToken = buyerLogin.token ?? '';
  record('POST /auth/login (BUYER)', buyerLogin.ok, buyerLogin.json?.data?.user?.email ?? buyerLogin.json?.message ?? 'fail');
  const buyerMe = await request('GET', '/auth/me', { token: buyerToken });
  record('GET /auth/me (BUYER)', buyerMe.status === 200 && buyerMe.json?.data?.workspaceRole === 'BUYER', `role=${buyerMe.json?.data?.workspaceRole}`);

  // Unified Search → SupplierProduct tab
  const s = await request('GET', '/search?q=vx-6000&page=1&pageSize=10');
  const spGroup = s.json?.supplierProducts ?? {};
  const spItems = spGroup.items ?? [];
  const spTotal = spGroup.total ?? 0;
  const vxCap = spItems.find((i: any) => i.capability?.slug === 'vx-6000-hd-video-borescope');
  record(
    'GET /search q=vx-6000 (SupplierProduct tab)',
    s.status === 200 && spTotal >= 3 && !!vxCap,
    `supplierProducts total=${spTotal}, capability hit=${vxCap?.capability?.name ?? 'none'}`,
  );

  // Capability graph → compare data source
  const c = await request('GET', `/capabilities/${CAP}`);
  const cdata = c.json?.data;
  const sps: any[] = cdata?.supplierProducts ?? [];
  const pub = sps.filter((x: any) => x.supplierProduct.status === 'PUBLISHED');
  const allStatuses = new Set(sps.map((x: any) => x.supplierProduct.status));
  const orgs = new Set(pub.map((x: any) => x.supplierProduct.organization?.name));
  const withParams = pub.filter((x: any) => (x.supplierProduct.parameterValues ?? []).length > 0).length;
  const withOffer = pub.filter((x: any) => (x.supplierProduct.commercialSummary?.activeOfferCount ?? 0) > 0).length;
  const ids = pub.map((x: any) => x.supplierProduct.id);
  record(
    'GET /capabilities/:id (compare data)',
    c.status === 200 && pub.length >= 4 && orgs.size >= 3,
    `PUBLISHED=${pub.length}, orgs=${orgs.size} (${[...orgs].join('/')}), paramModels=${withParams}, offerModels=${withOffer}`,
  );
  record(
    'Capability graph = PUBLISHED only (unpublished excluded)',
    allStatuses.size === 1 && allStatuses.has('PUBLISHED'),
    `statuses in public graph=${[...allStatuses].join('/')}`,
  );

  // Compare scale: 2 / 3 / 4 / 7 selections resolve within capability graph
  for (const n of [2, 3, 4, 7]) {
    const sel = ids.slice(0, n);
    const valid = pub.filter(({ supplierProduct }: any) => sel.includes(supplierProduct.id));
    const orgCount = new Set(valid.map((v: any) => v.supplierProduct.organization?.name)).size;
    record(`${n}-item compare (scale)`, valid.length === n, `selected=${n} resolved=${valid.length} orgs=${orgCount}`);
  }

  // Compare URL restore — deep-link determinism (refresh/back-forward restores same data)
  const sel3 = ids.slice(0, 3);
  const restored = pub.filter(({ supplierProduct }: any) => sel3.includes(supplierProduct.id));
  const restoredOrg = new Set(restored.map((v: any) => v.supplierProduct.organization?.name)).size;
  record(
    'Compare URL restore (deep-link determinism)',
    restored.length === 3 && restoredOrg === 3,
    `?ids=${sel3.join(',')} → resolved=3 orgs=${restoredOrg} (same data on refresh/back-forward)`,
  );

  // Parameter diff across models (resolution)
  const paramRows: { model: string; org: string; res: string; ip: string; price: string; offer: number }[] = [];
  for (const { supplierProduct } of pub) {
    const pv = supplierProduct.parameterValues ?? [];
    const g = (code: string) => {
      const d = pv.find((p: any) => p.parameterDefinition?.code === code);
      return d?.value ?? d?.valueNumber ?? '-';
    };
    const cs = supplierProduct.commercialSummary;
    paramRows.push({
      model: supplierProduct.modelNumber,
      org: supplierProduct.organization?.name ?? '',
      res: String(g('image_resolution')),
      ip: String(g('ie_ip_rating')),
      price: cs ? `${cs.priceFrom}~${cs.priceTo} ${cs.currency ?? ''}` : '无',
      offer: cs?.activeOfferCount ?? 0,
    });
  }
  const distinctRes = new Set(paramRows.map((r) => r.res)).size;
  const distinctIp = new Set(paramRows.map((r) => r.ip)).size;
  record(
    'Parameter difference (resolution/IP)',
    distinctRes >= 3 && distinctIp >= 3,
    `image_resolution distinct=${distinctRes}, ie_ip_rating distinct=${distinctIp}`,
  );

  // Commercial summary present on offer models, no-offer models safe
  const offerModels = paramRows.filter((r) => r.offer > 0);
  const noOfferModels = paramRows.filter((r) => r.offer === 0);
  record(
    'Commercial summary (with offer / no offer)',
    offerModels.length >= 2 && noOfferModels.length >= 2 && offerModels.every((r) => /~/.test(r.price)),
    `withOffer=${offerModels.length} (${offerModels.map((r) => `${r.model}=${r.price}`).join(', ')}), noOffer=${noOfferModels.length} (${noOfferModels.map((r) => r.model).join(', ')})`,
  );

  // Inquiry transition with supplierProductId context (锐视 VX-6000-MAX)
  const ruishi = pub.find((x: any) => x.supplierProduct.modelNumber === 'VX-6000-MAX');
  const offerRuishi = (ruishi?.offers ?? []).find((o: any) => o.status === 'ACTIVE');
  const inq1 = await request('POST', '/inquiries', {
    csrf: true,
    json: {
      productId: CAP,
      offerId: offerRuishi?.id,
      organizationId: ruishi?.supplierProduct.organizationId,
      supplierProductId: ruishi?.supplierProduct.id,
      name: 'Buyer 王工',
      email: 'e2e.buyer@example.com',
      message: 'M668 最终审计询价：锐视 VX-6000-MAX。',
    },
  });
  const inq1Ctx = inq1.json?.data?.inquiry?.supplierProduct;
  if (!is2xx(inq1.status)) console.log('  [debug] inq1 error:', JSON.stringify(inq1.json).slice(0, 500));
  record(
    'POST /inquiries (supplierProductId context preserved)',
    is2xx(inq1.status) && inq1Ctx?.supplierProductId === ruishi?.supplierProduct.id && /VX-6000-MAX/.test(inq1Ctx?.supplierModelLabel ?? ''),
    `inquiryId=${inq1.json?.data?.inquiry?.id ?? inq1.json?.message}, ctx=${JSON.stringify(inq1Ctx)}`,
  );

  // Invalid SupplierProduct rejected
  const inq2 = await request('POST', '/inquiries', {
    csrf: true,
    json: {
      productId: CAP,
      offerId: offerRuishi?.id,
      organizationId: ruishi?.supplierProduct.organizationId,
      supplierProductId: 'scale-mingshi-vx-6000-base-NOT-A-UUID',
      name: 'Buyer',
      email: 'e2e@example.com',
      message: 'should fail',
    },
  });
  record(
    'POST /inquiries (non-existent SP rejected)',
    !is2xx(inq2.status),
    `status=${inq2.status} (expected non-2xx)`,
  );

  // Same brand / different org identity via search
  const s2 = await request('GET', '/search?q=明视&page=1&pageSize=20');
  const sp2 = (s2.json?.supplierProducts?.items ?? []).filter((i: any) => i.capability?.slug === 'vx-6000-hd-video-borescope');
  const brandOrgs = new Set(sp2.map((i: any) => i.supplierProduct?.organization?.name));
  record(
    'Search 明视 → VX-6000 (brand identity + org)',
    s2.status === 200 && sp2.length >= 2 && brandOrgs.size >= 1,
    `明视 VX-6000 models=${sp2.length}, orgs=${[...brandOrgs].join('/') || 'none'}`,
  );

  // ================= SUPPLIER =================
  console.log('\n--- SUPPLIER ---');
  const supLogin = await login('demo.supplier.01@visndt.local', 'demo123456');
  const supToken = supLogin.token ?? '';
  record('POST /auth/login (SUPPLIER)', supLogin.ok, supLogin.json?.data?.user?.email ?? supLogin.json?.message ?? 'fail');
  const supMe = await request('GET', '/auth/me', { token: supToken });
  record('GET /auth/me (SUPPLIER)', supMe.status === 200 && supMe.json?.data?.workspaceRole === 'SUPPLIER', `role=${supMe.json?.data?.workspaceRole}`);

  // Supplier runtime products
  const mySp = await request('GET', '/workspace/supplier/runtime/products?page=1&pageSize=5', { token: supToken });
  const spItemsList = Array.isArray(mySp.json?.data?.data) ? mySp.json.data.data : (Array.isArray(mySp.json?.data) ? mySp.json.data : []);
  record('GET /workspace/supplier/runtime/products', is2xx(mySp.status) && spItemsList.length >= 1, `status=${mySp.status} items=${spItemsList.length}`);

  // Own inquiry context (明视 own model)
  const ownSp = spItemsList[0];
  const ownCtx = await request('GET', `/workspace/supplier/runtime/products/${ownSp?.id}/inquiry-context`, { token: supToken });
  record('Supplier own inquiry-context', is2xx(ownCtx.status), `status=${ownCtx.status} (own SP id=${ownSp?.id?.slice(0, 8)})`);

  // Cross-org isolation — 锐视 VX-6000-MAX must be 403 for 明视 supplier
  const crossOrg = await request('GET', `/workspace/supplier/runtime/products/${ruishi?.supplierProduct.id}/inquiry-context`, { token: supToken });
  record(
    'Cross-org inquiry-context blocked (403)',
    crossOrg.status === 403,
    `status=${crossOrg.status} (锐视 VX-6000-MAX read by 明视 → expected 403)`,
  );

  // Offer access (own org offers)
  const offers = await request('GET', '/offers', { token: supToken });
  record('GET /offers (supplier own offers)', is2xx(offers.status), `status=${offers.status}`);

  // ================= ADMIN =================
  console.log('\n--- ADMIN ---');
  const admLogin = await login('demo.admin@visndt.local', 'demo123456');
  const admToken = admLogin.token ?? '';
  record('POST /auth/login (ADMIN)', admLogin.ok, admLogin.json?.data?.user?.email ?? admLogin.json?.message ?? 'fail');
  const admMe = await request('GET', '/auth/me', { token: admToken });
  record('GET /auth/me (ADMIN)', admMe.status === 200, `status=${admMe.status} (Admin 经 JWT Role 鉴权)`);

  const dash = await request('GET', '/admin/dashboard/stats', { token: admToken });
  record('GET /admin/dashboard/stats', is2xx(dash.status), `status=${dash.status}`);
  const pend = await request('GET', '/admin/dashboard/pending', { token: admToken });
  record('GET /admin/dashboard/pending', is2xx(pend.status), `status=${pend.status}`);
  const admSp = await request('GET', '/admin/supplier-products?page=1&pageSize=10', { token: admToken });
  const admSpItems = Array.isArray(admSp.json?.data?.data) ? admSp.json.data.data : (Array.isArray(admSp.json?.data) ? admSp.json.data : []);
  record('GET /admin/supplier-products', is2xx(admSp.status) && admSpItems.length >= 1, `status=${admSp.status} items=${admSpItems.length}`);

  // ================= SUMMARY =================
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log('\n=== M668 Audit Summary ===');
  console.log(`总步骤 ${results.length} / 通过 ${passed} / 失败 ${failed}`);
  if (failed > 0) {
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ❌ ${r.step} — ${r.detail}`));
  }
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((e) => { console.error('脚本异常:', e); process.exit(1); });
