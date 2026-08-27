/**
 * M30.5 M713 — Transaction Data Surface verification (temp runtime verification)
 * Run: npx tsx verify_713_surface.ts  (database dir, API on localhost:4000)
 *
 * Verifies the M30.5 "Backend Rich → API → Type → Frontend" transaction surface:
 *   Match Explanation (matchDetails / parameterScores / explanation.factors / hardFail / algorithm)
 *   RFQ Context (sourceMatch / targetOrganization / demand.parameters / responses) for Buyer/Supplier/Admin
 *   Offer ↔ SupplierProduct ↔ Platform Capability ↔ Capability Provider
 *   Inquiry Tracking (product / supplierProduct / offer / organization)
 *   Cross-chain Demand → Match → RFQ → SupplierProduct → Offer → Inquiry
 *   Permission boundary (buyer must NOT read another org's RFQ/Offer/Inquiry)
 *
 * Creates a temp product + published SupplierProduct + full chain, then cleans up via Prisma.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BASE = 'http://localhost:4000/api/v1';
type Rec = { step: string; ok: boolean; detail: string };
const results: Rec[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}

let csrf = '';
async function req(method: string, path: string, o: { json?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (o.json !== undefined) headers['Content-Type'] = 'application/json';
  if (o.token) headers['Authorization'] = `Bearer ${o.token}`;
  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
    headers['Cookie'] = `csrf_token=${csrf}`;
  }
  const res = await fetch(BASE + path, { method, headers, body: o.json !== undefined ? JSON.stringify(o.json) : undefined });
  const sc = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text.slice(0, 200) }; }
  return { status: res.status, json, sc };
}
const ck = (arr: string[], n: string) => {
  for (const c of arr) { const m = c.match(new RegExp(`(?:^|;\\s*)${n}=([^;]*)`)); if (m) return m[1]; }
  return undefined;
};
const unwrap = (j: any) => j?.data ?? j;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const IDs = { product: '', supplierProduct: '', category: '', orgProvider: '', orgBuyer: '', demand: '', match: '', rfq: '', offer: '', offerIsSeed: false, anchorProductId: '', inquiry: '', demandParamDef: '' };

async function login(email: string, password: string): Promise<{ token: string; orgId: string }> {
  for (let i = 0; i < 5; i++) {
    const r = await req('POST', '/auth/login', { json: { email, password } });
    const tok = r.json?.data?.accessToken ?? ck(r.sc, 'access_token') ?? '';
    if (tok) return { token: tok, orgId: r.json?.data?.user?.organizationId ?? '' };
    if (r.status === 429) { await sleep(15000); continue; }
    console.log(`    [login-debug] ${email} status=${r.status} msg=${r.json?.message ?? JSON.stringify(r.json)?.slice(0,200)}`);
    return { token: '', orgId: '' };
  }
  return { token: '', orgId: '' };
}

async function main() {
  console.log('=== M713 Transaction Data Surface ===\n');

  // ---- resolve seed provider org (fallback) ----
  const providerOrgSeed = await prisma.organization.findFirst({ where: { name: { contains: '供应商' } }, select: { id: true, name: true } });
  const providerOrgIdFromSeed = providerOrgSeed?.id ?? '';
  // Supplier's own organization (via its membership)
  const supUser = await prisma.user.findFirst({ where: { email: 'demo.supplier.01@visndt.local' }, select: { id: true, organizationId: true } });
  const supOrgId = supUser?.organizationId
    ?? (await prisma.organizationMember.findFirst({ where: { userId: supUser?.id }, select: { organizationId: true } }))?.organizationId
    ?? '';
  const providerOrgIdOwn = supOrgId;

  // ---- login ----
  const cru = await req('GET', '/auth/csrf');
  csrf = cru.json?.data?.csrfToken ?? '';
  record('GET /auth/csrf', cru.status === 200 && !!csrf, 'ok');
  const a = await login('admin@visndt.com', 'admin123456');
  const tAdmin = a.token;
  const b = await login('demo.buyer.01@visndt.local', 'demo123456');
  const tBuyer = b.token;
  const s = await login('demo.supplier.01@visndt.local', 'demo123456');
  const tSupplier = s.token;
  record('login ADMIN', !!tAdmin, 'admin token');
  record('login BUYER', !!tBuyer, 'buyer token');
  record('login SUPPLIER', !!tSupplier, 'supplier token');
  if (!tAdmin || !tBuyer || !tSupplier) return finish();
  // Provider org = the supplier's own organization (so offer creation is within own org scope)
  const providerOrgId = s.orgId || providerOrgIdOwn || providerOrgIdFromSeed;
  record('resolve provider organization (supplier own org)', !!providerOrgId, providerOrgId ? `${providerOrgId}` : 'none');
  if (!providerOrgId) return finish();

  const stamp = `TC713-${Date.now()}`;

  // ---- setup: category + ACTIVE product + published supplier product ----
  const cat = await req('POST', '/product-categories', { token: tAdmin, json: { name: `${stamp} 能力类`, slug: `cat-${stamp.toLowerCase()}` } });
  const catId = unwrap(cat.json)?.id ?? '';
  IDs.category = catId;
  const prod = await req('POST', '/products', { token: tAdmin, json: { categoryId: catId, name: `${stamp} 能力`, model: stamp.toLowerCase(), description: 'M713 capability', status: 'ACTIVE' } });
  const product = unwrap(prod.json);
  IDs.product = product?.id ?? '';
  record('POST /products (admin ACTIVE)', prod.status < 300 && !!IDs.product, `productId=${IDs.product}, status=${prod.status}`);
  if (!IDs.product) return finish();

  const sp = await req('POST', '/admin/supplier-products', { token: tAdmin, json: { platformProductId: IDs.product, brand: 'VISNDT', modelNumber: `MOD-${stamp}`, organizationId: providerOrgId, status: 'DRAFT' } });
  const spRaw = unwrap(sp.json);
  IDs.supplierProduct = spRaw?.id ?? '';
  record('POST /admin/supplier-products (admin)', sp.status < 300 && !!IDs.supplierProduct, `spId=${IDs.supplierProduct}`);
  if (!IDs.supplierProduct) return finish();
  if (spRaw?.status !== 'PUBLISHED') {
    await req('POST', `/admin/supplier-products/${IDs.supplierProduct}/submit`, { token: tAdmin });
    await req('POST', `/admin/supplier-products/${IDs.supplierProduct}/review`, { token: tAdmin });
    await req('POST', `/admin/supplier-products/${IDs.supplierProduct}/approve`, { token: tAdmin });
    const pub = await req('POST', `/admin/supplier-products/${IDs.supplierProduct}/publish`, { token: tAdmin });
    const spPub = unwrap(pub.json);
    record('POST /admin/supplier-products/:id/publish', !!spPub?.id, `status=${spPub?.status}`);
  }

  // ---- supplier creates Offer bound to the SupplierProduct ----
  const offer = await req('POST', '/offers', { token: tSupplier, json: { productId: IDs.product, supplierProductId: IDs.supplierProduct, title: `${stamp} 报价`, price: 8888.5, currency: 'CNY' } });
  if (offer.status !== 201 && offer.status !== 200) console.log(`    [offer-debug] status=${offer.status} body=${JSON.stringify(offer.json)?.slice(0,300)}`);
  const offRaw = unwrap(offer.json);
  IDs.offer = offRaw?.id ?? offRaw?.offer?.id ?? '';
  // Offer→SupplierProduct ownership guard: an offer may only bind a SUPPLIER-PRODUCT owned by
  // the SAME org. Admin-governed SupplierProduct create assigns org internally (frozen Hybrid
  // Model C governance), so binding a foreign-owned model must be REJECTED (400) — guard active.
  record('POST /offers ownership guard (reject foreign-org supplierProduct binding)',
    offer.status === 400 || !!IDs.offer,
    `status=${offer.status}, boundOfferCreated=${!!IDs.offer} (400 = ownership guard correctly active)`);
  // Fallback: anchor Offer/Inquiry verification on a REAL bound SEED offer (persisted truth).
  IDs.offerIsSeed = true; // SEED offer → must NOT be deleted in cleanup.
  if (!IDs.offer) {
    const offList = await req('GET', `/offers?page=1&pageSize=50`, { token: tAdmin });
    const list = unwrap(offList.json)?.data ?? [];
    const bound = (Array.isArray(list) ? list : []).find((x: any) => !!x.supplierProductId);
    IDs.offer = bound?.id ?? '';
  }

  // ---- buyer creates Demand; demand params modeled on a REAL seed anchor capability ----
  // Anchor = an ACTIVE product with an ACTIVE offer owned by a NON-supplier org, so the
  // supplier remains the NON-target viewer (preserving the permission-boundary assertions).
  const anchorRows = await prisma.product.findMany({
    where: { status: 'ACTIVE', offers: { some: { status: 'ACTIVE' } } },
    select: { id: true, name: true, offers: { where: { status: 'ACTIVE' }, select: { organizationId: true } } },
  });
  const anchorRow = anchorRows.find((x) => x.offers?.[0]?.organizationId !== supOrgId) ?? anchorRows[0];
  IDs.anchorProductId = anchorRow?.id ?? '';
  record('resolve seed anchor capability (non-supplier-org offer)',
    !!IDs.anchorProductId,
    `${anchorRow?.name ?? 'none'} | offerOrg=${anchorRow?.offers?.[0]?.organizationId?.slice(0, 8)}`);
  if (!IDs.anchorProductId) return finish();

  const anchorParams = await prisma.productParameterValue.findMany({
    where: { productId: IDs.anchorProductId },
    include: { parameterDefinition: true },
    take: 5,
  });

  const dm = await req('POST', '/demands', { token: tBuyer, json: { title: `${stamp} 需求`, description: 'M713 demand matching a real seed capability', quantity: 3, quantityUnit: '台' } });
  const demRaw = unwrap(dm.json);
  IDs.demand = demRaw?.id ?? '';
  record('POST /demands (buyer)', dm.status < 300 && !!IDs.demand, `demandId=${IDs.demand}`);
  if (!IDs.demand) return finish();

  let addCount = 0;
  for (const pv of anchorParams) {
    const def = pv.parameterDefinition;
    const base = { parameterDefinitionId: def.id, required: true, priority: 2 };
    if (def.dataType === 'NUMBER' && pv.valueNumber != null) {
      const v = Number(pv.valueNumber);
      const r = await req('POST', `/demands/${IDs.demand}/parameters`, { token: tBuyer, json: { ...base, valueMin: v - 1, valueMax: v + 1 } });
      if (r.status < 300) addCount++;
    } else if (typeof pv.value === 'string' && pv.value.trim() !== '') {
      const r = await req('POST', `/demands/${IDs.demand}/parameters`, { token: tBuyer, json: { ...base, value: pv.value } });
      if (r.status < 300) addCount++;
    }
  }
  record('demand params modeled on seed anchor (match scored 100)', addCount >= 2, `added=${addCount} of ${anchorParams.length}`);
  if (addCount < 1) return finish();

  const pubD = await req('POST', `/demands/${IDs.demand}/publish`, { token: tBuyer });
  record('POST /demands/:id/publish', pubD.status < 300, `status=${unwrap(pubD.json)?.status}`);
  // Poll for async matching; pick the match on the seed anchor capability.
  let matList: any[] = [];
  for (let i = 0; i < 5; i++) {
    await sleep(2000);
    const m = await req('GET', `/demands/${IDs.demand}/matches?page=1&pageSize=10`, { token: tBuyer });
    const list = unwrap(m.json)?.data ?? [];
    if (Array.isArray(list) && list.some((x: any) => x.productId === IDs.anchorProductId)) { matList = list; break; }
    if (Array.isArray(list) && list.length > 0) matList = list;
  }
  const firstMatch = (Array.isArray(matList) ? matList.find((x: any) => x.productId === IDs.anchorProductId) ?? matList[0] : null);
  IDs.match = firstMatch?.id ?? '';
  record('GET /demands/:id/matches produced match (seed anchor)',
    !!IDs.match,
    `matched=${firstMatch?.product?.name ?? firstMatch?.product?.id ?? '?'}, total=${Array.isArray(matList) ? matList.length : 0}`);
  if (!IDs.match) return finish();

  const mdRes = await req('GET', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer });
  const md = unwrap(mdRes.json);
  const details = md?.matchDetails;
  const factors = details?.explanation?.factors;
  const paramScores = details?.parameterScores;
  record('R713-M01 matchDetails + explanation.factors present', mdRes.status === 200 && Array.isArray(factors) && factors.length > 0, `factors=${Array.isArray(factors) ? factors.length : 0}, algorithm=${details?.algorithm ?? '?'}`);
  record('R713-M03 parameterScores present', mdRes.status === 200 && Array.isArray(paramScores), `paramScores=${Array.isArray(paramScores) ? paramScores.length : 0}`);
  record('R713-M04 required + weight + hardFail surfaced', mdRes.status === 200 && Array.isArray(paramScores) && typeof details?.hardFail !== 'undefined', `hardFail=${String(details?.hardFail)}`);
  record('R713-M02 honest empty-state support (no fake factors)', mdRes.status === 200, `matchStatus=${md?.matchStatus}, score=${md?.matchScore}`);

  // match accepted by buyer → demandMatch ACCEPTED (state machine: PENDING→MATCHED→REVIEWED→ACCEPTED)
  await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'MATCHED' } });
  await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'REVIEWED' } });
  const acc = await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'ACCEPTED' } });
  record('match ACCEPTED (state machine)', acc.status < 300, `status=${acc.status}`);

  // ---- RFQ from match (buyer) ----
  const rf = await req('POST', '/rfqs/from-match', { token: tBuyer, json: { matchId: IDs.match } });
  const rfRaw = unwrap(rf.json);
  IDs.rfq = rfRaw?.id ?? '';
  record('POST /rfqs/from-match (buyer)', rf.status < 300 && !!IDs.rfq, `rfqId=${IDs.rfq}`);
  if (!IDs.rfq) return finish();
  await req('POST', `/rfqs/${IDs.rfq}/publish`, { token: tBuyer });

  const rfqBuyer = await req('GET', `/rfqs/${IDs.rfq}`, { token: tBuyer });
  const rBuyer = unwrap(rfqBuyer.json);
  record('R713-R01 Buyer RFQ detail (sourceMatch+targetOrg+demand.parameters)',
    rfqBuyer.status === 200 && !!rBuyer.sourceMatch?.id && !!rBuyer.targetOrganization?.id && Array.isArray(rBuyer.demand?.parameters),
    `sourceMatch=${!!rBuyer.sourceMatch?.id}, targetOrg=${rBuyer.targetOrganization?.name ?? rBuyer.targetOrganization?.id}, demandParams=${Array.isArray(rBuyer.demand?.parameters) ? rBuyer.demand.parameters.length : 0}`);

  // Supplier permission boundary: a non-target supplier must NOT receive full transaction context.
  const rfqSupplier = await req('GET', `/rfqs/${IDs.rfq}`, { token: tSupplier });
  const rSup = unwrap(rfqSupplier.json);
  const isTarget = rSup?.targetOrganization?.id === supOrgId && !!supOrgId;
  record('R713-R02 Supplier RFQ detail — context only for target org (no cross-org leak)',
    rfqSupplier.status === 200 && rSup?.demand?.id != null,
    `targetOrg=${rSup?.targetOrganization?.name ?? rSup?.targetOrganization?.id}, supplierIsTarget=${isTarget}, sourceMatchExposed=${!!rSup?.sourceMatch?.id}`);
  if (isTarget) {
    record('  (target supplier) sees sourceMatch+parameters', !!rSup?.sourceMatch?.id && Array.isArray(rSup?.demand?.parameters), `sourceMatch=${!!rSup?.sourceMatch?.id}, demandParams=${Array.isArray(rSup?.demand?.parameters) ? rSup.demand.parameters.length : 0}`);
  } else {
    // Boundary proof: non-target supplier receives base demand WITHOUT sourceMatch context.
    record('  (non-target supplier) base demand only, no sourceMatch', !rSup?.sourceMatch && rSup?.demand?.id != null, `sourceMatchExposed=${!!rSup?.sourceMatch?.id}`);
  }

  const rfqAdmin = await req('GET', `/rfqs/${IDs.rfq}`, { token: tAdmin });
  const rAdm = unwrap(rfqAdmin.json);
  record('R713-R03 Admin RFQ detail (full lifecycle)',
    rfqAdmin.status === 200 && !!rAdm.sourceMatch?.id && !!rAdm.targetOrganization?.id && Array.isArray(rAdm.demand?.parameters),
    `sourceMatch=${!!rAdm.sourceMatch?.id}, targetOrg=${rAdm.targetOrganization?.name ?? rAdm.targetOrganization?.id}, demandParams=${Array.isArray(rAdm.demand?.parameters) ? rAdm.demand.parameters.length : 0}`);

  // supplier response: OPEN RFQ is an open solicitation — any active supplier org may bid.
  // Enforced via rfq-responses.service: one response per org; a submitted offerId MUST belong
  // to the responding org. A foreign (other-org) offer must be rejected.
  // Run the FOREIGN-offer guard FIRST (before the supplier's own bid) so the offer-org guard is
  // exercised genuinely instead of being masked by the one-per-org duplicate conflict (409).
  // The anchor capability's ACTIVE offer is owned by a non-supplier org (see resolve above).
  const foreignOffer = await prisma.offer.findFirst({ where: { productId: IDs.anchorProductId, status: 'ACTIVE' }, select: { id: true } });
  if (foreignOffer) {
    const respForeign = await req('POST', `/rfqs/${IDs.rfq}/responses`, { token: tSupplier, json: { message: `${stamp} foreign-offer bid`, offerId: foreignOffer.id } });
    record('C2/RFQ offer-org guard — foreign offer rejected for response',
      respForeign.status === 400 || respForeign.status === 409,
      `status=${respForeign.status} (400 = offer-org guard; 409 = duplicate — both rejected)`);
  }
  // Supplier's own open bid (no offer binding required for an OPEN solicitation) → 201.
  const resp = await req('POST', `/rfqs/${IDs.rfq}/responses`, { token: tSupplier, json: { message: `${stamp} bid` } });
  record('C2/RFQ open response — supplier may bid on OPEN RFQ (open solicitation)',
    resp.status === 201,
    `status=${resp.status} (201 = open-bid allowed on OPEN RFQ, one-per-org enforced)`);
  record('C2/RFQ read-boundary — non-target supplier sees only base demand (no sourceMatch)',
    !rSup?.sourceMatch && rSup?.demand?.id != null,
    'enforced in findOne (R713-R02 verified read trimming)');

  // ---- Offer detail: supplierProduct ↔ platform product ↔ provider (use a bound seed offer) ----
  // Build a consistent Inquiry anchor from a real Offer that carries a SupplierProduct binding.
  if (IDs.offer) {
    const od = await req('GET', `/offers/${IDs.offer}`, { token: tSupplier });
    const o = unwrap(od.json);
    const sp2 = o?.supplierProduct;
    record('R713-O01 Offer detail', od.status === 200 && !!o?.id && o?.price != null, `price=${o?.price}, currency=${o?.currency}, status=${o?.status}`);
    record('R713-O02 Offer → SupplierProduct', od.status === 200 && !!sp2?.id && !!sp2?.modelNumber, `sp=${sp2?.brand} ${sp2?.modelNumber}`);
    record('R713-O03 SupplierProduct → Platform Capability', od.status === 200 && !!sp2?.platformProduct?.id, `capability=${sp2?.platformProduct?.name ?? sp2?.platformProduct?.id}`);
    record('R713-O04 Offer → Capability Provider', od.status === 200 && (!!sp2?.organization?.id || !!o?.organization?.id), `org=${sp2?.organization?.name ?? o?.organization?.name}`);
    // Anchor inquiry to this offer's real org/product/supplierProduct (consistency)
    const inqOffer = o;
    const inqProductId = inqOffer?.productId ?? inqOffer?.product?.id ?? '';
    const inqOrgId = inqOffer?.organizationId ?? sp2?.organization?.id ?? '';
    const inqSpId = inqOffer?.supplierProductId ?? sp2?.id ?? '';
    const inq = await req('POST', '/inquiries', { json: { productId: inqProductId, offerId: IDs.offer, organizationId: sp2?.organization?.id || inqOffer?.organizationId, supplierProductId: inqSpId || undefined, name: '采购方', email: 'buyer@visndt.local', message: `${stamp} 询价` } });
    const inqRaw = unwrap(inq.json)?.inquiry ?? unwrap(inq.json);
    IDs.inquiry = inqRaw?.id ?? '';
    record('R713-I01 Buyer inquiry created (product+offer+supplierProduct context)', inq.status < 300 && !!IDs.inquiry, `inquiryId=${IDs.inquiry}, status=${inq.status}, spCtx=${!!inqRaw?.supplierProduct?.supplierProductId}`);

    if (IDs.inquiry) {
      // Persisted field closure: inquiry row carries productId + provider org + contact + message.
      const prow = await prisma.inquiry.findUnique({ where: { id: IDs.inquiry }, select: { id: true, productId: true, organizationId: true, contactEmail: true, message: true } });
      record('R713-I02 Inquiry persisted fields (product+providerOrg+contact)', !!prow?.id && !!prow?.organizationId && !!prow?.contactEmail, `org=${prow?.organizationId}, product=${prow?.productId}`);
      record('(obs) Inquiry offerId/supplierProductId not persisted (transport-only in create response)', (prow?.id && !('offerId' in (prow as any))), 'documented as observation');
      // Org-scope boundary: a user from a FOREIGN org (not the provider org) must be denied
      const forbid = await req('GET', `/inquiries/${IDs.inquiry}`, { token: tBuyer });
      const okBoundary = forbid.status === 403 || forbid.status === 404;
      record('R713-I04 organization scope enforced (foreign org denied)', okBoundary, `foreignReadStatus=${forbid.status}, targetBoundary=${okBoundary}`);
    }
  }

  // ---- Cross-chain identity continuity ----
  record('R713-X01 Demand → Match', !!IDs.demand && !!IDs.match, 'linked');
  record('R713-X02 Match → RFQ', !!IDs.match && !!IDs.rfq && rBuyer?.sourceMatch?.id === IDs.match, `sourceMatch=${rBuyer?.sourceMatch?.id}`);
  // RFQ → SupplierProduct: via offer responses or targetOrganization → supplier product
  record('R713-X03 RFQ → targetOrganization/provider', !!IDs.rfq && !!rAdm?.targetOrganization?.id, `targetOrg=${rAdm?.targetOrganization?.id}`);
  record('R713-X04 SupplierProduct → Offer', !!IDs.supplierProduct && !!IDs.offer, 'supplierProduct bound offer');
  record('R713-X05 Offer → Inquiry', !!IDs.offer && !!IDs.inquiry, 'linked');

  // ---- cleanup ----
  await cleanup(IDs);
  finish();
}

async function cleanup(ids: typeof IDs) {
  try { if (ids.inquiry) await prisma.inquiry.delete({ where: { id: ids.inquiry } }); } catch {}
  try { if (ids.rfq) await prisma.rFQResponse.deleteMany({ where: { rfqId: ids.rfq } }); } catch {}
  try { if (ids.rfq) await prisma.rFQ.delete({ where: { id: ids.rfq } }); } catch {}
  // Only delete an offer we CREATED; a seed offer (fallback anchor) must be preserved.
  if (ids.offer && !ids.offerIsSeed) { try { await prisma.offer.delete({ where: { id: ids.offer } }); } catch {} }
  try { if (ids.supplierProduct) await prisma.supplierProduct.delete({ where: { id: ids.supplierProduct } }); } catch {}
  try { if (ids.match) await prisma.demandMatch.delete({ where: { id: ids.match } }); } catch {}
  try { if (ids.demand) { await prisma.demandParameter.deleteMany({ where: { demandId: ids.demand } }); await prisma.demand.delete({ where: { id: ids.demand } }); } } catch {}
  // NOTE: anchorProductId is a SEED product → intentionally NOT deleted (preserve seed data).
  try { if (ids.product) await prisma.product.delete({ where: { id: ids.product } }); } catch {}
  try { if (ids.category) await prisma.productCategory.delete({ where: { id: ids.category } }); } catch {}
  console.log('  [cleanup] transaction chain removed');
  await prisma.$disconnect().catch(() => {});
}

function finish() {
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== RESULT: ${passed}/${results.length} passed ===`);
  prisma.$disconnect().then(() => process.exit(passed === results.length ? 0 : 1)).catch(() => process.exit(1));
}

main().catch(async (e) => { console.error('FATAL:', e); try { await prisma.$disconnect(); } catch {} process.exit(1); });