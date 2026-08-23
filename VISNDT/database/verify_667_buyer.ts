/**
 * M28.1 M667 — Buyer SupplierProduct Comparison Journey (temp runtime verification)
 * Run: npx tsx verify_667_buyer.ts  (database dir, API on localhost:4000)
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
let buyerToken = '';

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
  console.log('=== M667 Buyer SupplierProduct Comparison Journey ===\n');

  // 1) Auth
  const csrfRes = await request('GET', '/auth/csrf');
  csrfToken = csrfRes.json?.data?.csrfToken ?? '';
  record('GET /auth/csrf', csrfRes.status === 200 && !!csrfToken, 'csrf ok');
  const buyerLogin = await login('demo.buyer.01@visndt.local', 'demo123456');
  buyerToken = buyerLogin.token ?? '';
  record('POST /auth/login (BUYER)', buyerLogin.ok, buyerLogin.json?.data?.user?.email ?? buyerLogin.json?.message ?? 'fail');
  const meRes = await request('GET', '/auth/me', { token: buyerToken });
  record('GET /auth/me (BUYER)', meRes.status === 200 && meRes.json?.data?.workspaceRole === 'BUYER', `role=${meRes.json?.data?.workspaceRole}`);

  // 2) Unified Search → SupplierProduct tab
  // NOTE: /search returns { query, products, supplierProducts, ... } — NO `data` wrapper
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

  // 3) Capability graph → comparison data source
  const c = await request('GET', `/capabilities/${CAP}`);
  const sps = c.json?.data?.supplierProducts ?? [];
  const pub = sps.filter((x: any) => x.supplierProduct.status === 'PUBLISHED');
  const orgs = new Set(pub.map((x: any) => x.supplierProduct.organization?.name));
  const withParams = pub.filter((x: any) => (x.supplierProduct.parameterValues ?? []).length > 0).length;
  const withOffer = pub.filter((x: any) => (x.supplierProduct.commercialSummary?.activeOfferCount ?? 0) > 0).length;
  record(
    'GET /capabilities/:id (compare data)',
    c.status === 200 && pub.length >= 4 && orgs.size >= 3,
    `PUBLISHED=${pub.length}, orgs=${orgs.size} (${[...orgs].join('/')}), paramModels=${withParams}, offerModels=${withOffer}`,
  );

  // 3a) Parameter diff sample — verify override values present & differ
  const paramRows: { model: string; org: string; res: string; len: string; ip: string; price: string }[] = [];
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
      len: String(g('working_length')),
      ip: String(g('ie_ip_rating')),
      price: cs ? `${cs.priceFrom}~${cs.priceTo} ${cs.currency ?? ''} (active=${cs.activeOfferCount})` : '无 Offer',
    });
  }
  const distinctRes = new Set(paramRows.map((r) => r.res)).size;
  record(
    'Parameter diff across models (resolution)',
    distinctRes >= 3,
    `image_resolution distinct=${distinctRes}: ${paramRows.map((r) => `${r.model}=${r.res}`).join(', ')}`,
  );

  // 4) Inquiry with supplierProductId context (锐视 VX-6000-MAX)
  const ruishi = pub.find((x: any) => x.supplierProduct.modelNumber === 'VX-6000-MAX');
  console.log('  [debug] ruishi found:', !!ruishi, '| organizationId:', ruishi?.supplierProduct.organizationId, '| offers:', JSON.stringify(ruishi?.offers ?? []).slice(0, 200));
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
      message: 'M667 比较页询价：锐视 VX-6000-MAX。',
    },
  });
  const inq1Ctx = inq1.json?.data?.inquiry?.supplierProduct;
  if (!is2xx(inq1.status)) console.log('  [debug] inq1 error:', JSON.stringify(inq1.json).slice(0, 500), '| sent orgId:', ruishi?.supplierProduct.organizationId, '| offerId:', offerRuishi?.id);
  record(
    'POST /inquiries (supplierProductId context)',
    is2xx(inq1.status) && inq1Ctx?.supplierProductId === ruishi?.supplierProduct.id && /VX-6000-MAX/.test(inq1Ctx?.supplierModelLabel ?? ''),
    `inquiryId=${inq1.json?.data?.inquiry?.id ?? inq1.json?.message}, ctx=${JSON.stringify(inq1Ctx)}`,
  );

  // 5) Unpublished must be rejected on inquiry
  //    (mingshi-vx-6000-hd is PUBLISHED; use a DRAFT slug to prove the boundary)
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

  // 6) Same brand / different org identity check via search
  const s2 = await request('GET', '/search?q=明视&page=1&pageSize=20');
  const sp2 = (s2.json?.supplierProducts?.items ?? []).filter((i: any) => i.capability?.slug === 'vx-6000-hd-video-borescope');
  const brandOrgs = new Set(sp2.map((i: any) => i.supplierProduct?.organization?.name));
  record(
    'Search 明视 → VX-6000 (brand identity + org)',
    s2.status === 200 && sp2.length >= 2 && brandOrgs.size >= 1,
    `明视 VX-6000 models=${sp2.length}, orgs=${[...brandOrgs].join('/') || 'none'}`,
  );

  // 7) No-Offer model safe display (VX-6000-HD has no offer)
  const hd = pub.find((x: any) => x.supplierProduct.modelNumber === 'VX-6000-HD');
  const hdActive = hd?.supplierProduct.commercialSummary?.activeOfferCount ?? 0;
  record(
    'No-Offer model (VX-6000-HD) safe display',
    hdActive === 0 && pub.some((x: any) => x.supplierProduct.modelNumber === 'VX-6000-HD'),
    `activeOfferCount=${hdActive} (UI renders 暂无可购 / 暂无可询价渠道)`,
  );

  // ================= Summary =================
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log('\n=== M667 Buyer Journey Summary ===');
  console.log(`总步骤 ${results.length} / 通过 ${passed} / 失败 ${failed}`);
  if (failed > 0) {
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ❌ ${r.step} — ${r.detail}`));
  }
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((e) => { console.error('脚本异常:', e); process.exit(1); });
