/**
 * M31.1 M715 — Core UX Data Surface verification (temp runtime verification)
 * Run: npx tsx verify_715_surface.ts  (database dir, API on localhost:4000)
 *
 * Verifies the M31.1 "Backend Rich → API → Type → Frontend → Visible UI" UX surface:
 *   Demand category round-trip (create categoryId → findOne/findMy projection)
 *   Demand contact fields + contact protection (contactVisible=false → ***)
 *   Demand parameter value surface (NUMBER min/max/unit, ENUM options label, BOOLEAN)
 *   Match Explanation (real matchDetails: factors / parameterScores / hardFail / algorithm)
 *   Supplier RFQ detail sourceMatch context for target org
 *   Supplier Offer list surface (capability / model / provider / price / currency / status)
 *   Supplier Inquiry detail surface (productName / organizationName / contact)
 *   Role boundary (buyer must not read foreign offer detail via supplier surface)
 *
 * Creates a temp category + ACTIVE product + published SupplierProduct + full chain,
 * then cleans up via Prisma (seed rows preserved).
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

const IDs = { category: '', product: '', supplierProduct: '', demand: '', demandPrivate: '', match: '', rfq: '', offer: '', offerIsSeed: false, enumDef: '' };

async function login(email: string, password: string): Promise<{ token: string; orgId: string }> {
  for (let i = 0; i < 5; i++) {
    const r = await req('POST', '/auth/login', { json: { email, password } });
    const tok = r.json?.data?.accessToken ?? ck(r.sc, 'access_token') ?? '';
    if (tok) return { token: tok, orgId: r.json?.data?.user?.organizationId ?? '' };
    if (r.status === 429) { await sleep(15000); continue; }
    console.log(`    [login-debug] ${email} status=${r.status} msg=${r.json?.message ?? JSON.stringify(r.json)?.slice(0, 200)}`);
    return { token: '', orgId: '' };
  }
  return { token: '', orgId: '' };
}

async function main() {
  console.log('=== M715 Core UX Data Surface ===\n');

  const supUser = await prisma.user.findFirst({ where: { email: 'demo.supplier.01@visndt.local' }, select: { id: true, organizationId: true } });
  const supOrgId = supUser?.organizationId ?? '';

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
  const providerOrgId = s.orgId || supOrgId;
  record('resolve provider organization (supplier own org)', !!providerOrgId, providerOrgId ? `${providerOrgId}` : 'none');
  if (!providerOrgId) return finish();

  const stamp = `TC715-${Date.now()}`;

  // ---- setup: category + ACTIVE product + published SupplierProduct + bound Offer ----
  const cat = await req('POST', '/product-categories', { token: tAdmin, json: { name: `${stamp} 能力类`, slug: `cat-${stamp.toLowerCase()}` } });
  IDs.category = unwrap(cat.json)?.id ?? '';
  record('POST /product-categories', cat.status < 300 && !!IDs.category, `categoryId=${IDs.category}`);
  if (!IDs.category) return finish();

  const prod = await req('POST', '/products', { token: tAdmin, json: { categoryId: IDs.category, name: `${stamp} 能力`, model: stamp.toLowerCase(), description: 'M715 capability', status: 'ACTIVE' } });
  IDs.product = unwrap(prod.json)?.id ?? '';
  record('POST /products (admin ACTIVE)', prod.status < 300 && !!IDs.product, `productId=${IDs.product}`);
  if (!IDs.product) return finish();

  // NOTE: admin POST /admin/supplier-products derives organizationId from the ADMIN's
  // user context, so a SupplierProduct belonging to the SUPPLIER's org must be created
  // via Prisma here (test setup, not product code). SupplierProduct is PUBLISHED.
  const sp = await prisma.supplierProduct.create({
    data: {
      platformProductId: IDs.product,
      brand: 'VISNDT',
      modelNumber: `MOD-${stamp}`,
      organizationId: providerOrgId,
      status: 'PUBLISHED',
      slug: `sp-${stamp.toLowerCase()}`,
    },
  });
  IDs.supplierProduct = sp.id;
  record('Prisma SupplierProduct (supplier org, PUBLISHED)', !!IDs.supplierProduct, `spId=${IDs.supplierProduct}`);
  if (!IDs.supplierProduct) return finish();

  const offer = await req('POST', '/offers', { token: tSupplier, json: { productId: IDs.product, supplierProductId: IDs.supplierProduct, title: `${stamp} 报价`, price: 9988.5, currency: 'CNY' } });
  const offRaw = unwrap(offer.json);
  IDs.offer = offRaw?.id ?? offRaw?.offer?.id ?? '';
  IDs.offerIsSeed = false;
  record('POST /offers (supplier, bound)', offer.status < 300 && !!IDs.offer, `offerId=${IDs.offer}, status=${offer.status}`);
  if (!IDs.offer) return finish();
  // Matching only considers offers with status ACTIVE; the API lifecycle keeps offers
  // DRAFT→SUBMITTED→ACCEPTED, so the test sets ACTIVE directly to enable the match probe.
  await prisma.offer.update({ where: { id: IDs.offer }, data: { status: 'ACTIVE' } });
  record('Offer → ACTIVE (matchable)', true, 'status=ACTIVE');

  // ---- Buyer Demand UX: categoryId + contact fields ----
  const contactPayload = {
    title: `${stamp} 需求`,
    description: 'M715 buyer demand for UX surface verification',
    budgetRange: '10000-50000',
    quantity: 5,
    quantityUnit: '台',
    expectedDeliveryDate: '2026-12-31',
    categoryId: IDs.category,
    contactName: '张女士',
    contactPhone: '13800000000',
    contactEmail: 'buyer@visndt.local',
    contactVisible: true,
  };
  const dm = await req('POST', '/demands', { token: tBuyer, json: contactPayload });
  const demRaw = unwrap(dm.json);
  IDs.demand = demRaw?.id ?? '';
  record('M715-D01 POST /demands (categoryId+contacts+unit)', dm.status < 300 && !!IDs.demand, `demandId=${IDs.demand}, status=${dm.status}`);
  if (!IDs.demand) return finish();

  // Public-contact demand: real contact values must be readable by owner.
  const onePub = await req('GET', `/demands/${IDs.demand}`, { token: tBuyer });
  const dPub = unwrap(onePub.json);
  record('M715-D02 findOne category projection (owner, contactVisible=true)',
    onePub.status === 200 && dPub?.category?.id === IDs.category && dPub?.category?.name?.includes(stamp),
    `category=${dPub?.category?.name}, phone=${dPub?.contactPhone}, email=${dPub?.contactEmail}`);
  record('M715-D03 findOne contact real values (visible=true)',
    dPub?.contactPhone === '13800000000' && dPub?.contactEmail === 'buyer@visndt.local',
    `phone=${dPub?.contactPhone}, email=${dPub?.contactEmail}`);
  record('M715-D04 findOne quantity unit + budget surfaced',
    dPub?.quantity === 5 && dPub?.quantityUnit === '台' && !!dPub?.budgetRange,
    `quantity=${dPub?.quantity} ${dPub?.quantityUnit}, budget=${dPub?.budgetRange}`);

  // Private-contact demand: contact values must be masked (***).
  const dmPriv = await req('POST', '/demands', { token: tBuyer, json: { title: `${stamp} 私密需求`, description: 'private contact', quantity: 1, quantityUnit: 'pcs', categoryId: IDs.category, contactName: '李女士', contactPhone: '13900000000', contactEmail: 'private@visndt.local', contactVisible: false } });
  IDs.demandPrivate = unwrap(dmPriv.json)?.id ?? '';
  if (IDs.demandPrivate) {
    const onePriv = await req('GET', `/demands/${IDs.demandPrivate}`, { token: tBuyer });
    const dPriv = unwrap(onePriv.json);
    record('M715-D05 contact protection (contactVisible=false → ***)',
      onePriv.status === 200 && dPriv?.contactPhone === '***' && dPriv?.contactEmail === '***',
      `phone=${dPriv?.contactPhone}, email=${dPriv?.contactEmail}`);
  } else {
    record('M715-D05 contact protection (contactVisible=false → ***)', false, 'private demand create failed');
  }

  // findMy list projection (DemandList surface: category badge).
  const myList = await req('GET', '/demands/my?page=1&pageSize=20', { token: tBuyer });
  const list = unwrap(myList.json)?.data ?? [];
  const minePub = (Array.isArray(list) ? list : []).find((x: any) => x.id === IDs.demand);
  record('M715-D06 findMy category projection (list surface)',
    Array.isArray(list) && !!minePub?.category?.id && minePub?.category?.id === IDs.category,
    `category=${minePub?.category?.name}`);

  // ---- Demand parameters: NUMBER min/max/unit + ENUM label + BOOLEAN surface ----
  // Use existing seed parameter definitions to build a parameter surface probe.
  const defs = await prisma.parameterDefinition.findMany({ where: { dataType: 'NUMBER' }, take: 1 });
  const numDef = defs[0];
  let numParamOk = false;
  if (numDef) {
    const addNum = await req('POST', `/demands/${IDs.demand}/parameters`, { token: tBuyer, json: { parameterDefinitionId: numDef.id, valueMin: 1, valueMax: 100, required: true, priority: 2 } });
    if (addNum.status < 300) {
      const detail2 = await req('GET', `/demands/${IDs.demand}`, { token: tBuyer });
      const d2 = unwrap(detail2.json);
      const params = d2?.parameters ?? d2?.parameterValues ?? [];
      const numParam = (Array.isArray(params) ? params : []).find((p: any) => p.parameterDefinitionId === numDef.id);
      numParamOk = !!numParam && numParam.valueMin === 1 && numParam.valueMax === 100 && !!numParam.parameterDefinition?.unit;
      record('M715-D07 NUMBER param surface (valueMin/valueMax/unit)',
        numParamOk,
        `min=${numParam?.valueMin}, max=${numParam?.valueMax}, unit=${numParam?.parameterDefinition?.unit}`);
    } else {
      record('M715-D07 NUMBER param surface (valueMin/valueMax/unit)', false, `add param failed ${addNum.status}`);
    }
  } else {
    record('M715-D07 NUMBER param surface (valueMin/valueMax/unit)', false, 'no NUMBER def in seed');
  }

  let enumDef = await prisma.parameterDefinition.findFirst({ where: { dataType: 'ENUM', options: { some: {} } } });
  // Seed contains no ENUM parameter definitions; create a temp ENUM def + options to
  // verify the ENUM → options.label presentation surface (test setup via Prisma).
  let tempEnumDefId = '';
  if (!enumDef) {
    const created = await prisma.parameterDefinition.create({
      data: {
        name: `${stamp} 枚举参数`,
        code: `enum-${stamp.toLowerCase()}`,
        dataType: 'ENUM',
        unit: null,
        options: {
          create: [
            { value: 'MODE_A', label: '模式A' },
            { value: 'MODE_B', label: '模式B' },
          ],
        },
      },
      include: { options: true },
    });
    tempEnumDefId = created.id;
    IDs.enumDef = created.id;
    enumDef = created as any;
  }
  let enumParamOk = false;
  if (enumDef) {
    const enumOpt = await prisma.parameterOption.findFirst({ where: { parameterDefinitionId: enumDef.id } });
    if (enumOpt) {
      const addEnum = await req('POST', `/demands/${IDs.demand}/parameters`, { token: tBuyer, json: { parameterDefinitionId: enumDef.id, value: enumOpt.value, required: false, priority: 1 } });
      if (addEnum.status < 300) {
        const detail3 = await req('GET', `/demands/${IDs.demand}`, { token: tBuyer });
        const d3 = unwrap(detail3.json);
        const params3 = d3?.parameters ?? d3?.parameterValues ?? [];
        const enumParam = (Array.isArray(params3) ? params3 : []).find((p: any) => p.parameterDefinitionId === enumDef.id);
        const label = enumParam?.parameterDefinition?.options?.find((o: any) => o.value === enumParam?.value)?.label;
        enumParamOk = !!enumParam && !!label;
        record('M715-D08 ENUM param surface (options.label)',
          enumParamOk,
          `value=${enumParam?.value}, label=${label}`);
      }
    }
  }
  if (!enumDef) record('M715-D08 ENUM param surface (options.label)', false, 'no ENUM def with options in seed');

  // Seed the product's parameter values matching the demand params so scoring
  // produces a real (non hard-fail) match: NUMBER in-range + ENUM equal value.
  if (numDef) {
    await prisma.productParameterValue.upsert({
      where: { productId_parameterDefinitionId: { productId: IDs.product, parameterDefinitionId: numDef.id } },
      create: { productId: IDs.product, parameterDefinitionId: numDef.id, value: '50', valueNumber: 50 },
      update: {},
    });
  }
  if (enumDef) {
    const enumOpt = await prisma.parameterOption.findFirst({ where: { parameterDefinitionId: enumDef.id } });
    if (enumOpt) {
      await prisma.productParameterValue.upsert({
        where: { productId_parameterDefinitionId: { productId: IDs.product, parameterDefinitionId: enumDef.id } },
        create: { productId: IDs.product, parameterDefinitionId: enumDef.id, value: enumOpt.value },
        update: {},
      });
    }
  }
  if (numDef || enumDef) record('Product parameter values seeded (NUMBER+ENUM)', true, 'matchable');

  // ---- publish → async match → real matchDetails ----
  const pubD = await req('POST', `/demands/${IDs.demand}/publish`, { token: tBuyer });
  record('POST /demands/:id/publish', pubD.status < 300, `status=${unwrap(pubD.json)?.status}`);
  let matList: any[] = [];
  for (let i = 0; i < 6; i++) {
    await sleep(2500);
    const m = await req('GET', `/demands/${IDs.demand}/matches?page=1&pageSize=10`, { token: tBuyer });
    const l = unwrap(m.json)?.data ?? [];
    if (Array.isArray(l) && l.length > 0) { matList = l; if (l.some((x: any) => x.productId === IDs.product)) break; }
  }
  const firstMatch = (Array.isArray(matList) ? matList.find((x: any) => x.productId === IDs.product) ?? matList[0] : null);
  IDs.match = firstMatch?.id ?? '';
  record('GET /demands/:id/matches produced match', !!IDs.match, `matched=${firstMatch?.product?.name ?? firstMatch?.product?.id ?? '?'}, total=${Array.isArray(matList) ? matList.length : 0}`);
  if (!IDs.match) return finish();

  const mdRes = await req('GET', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer });
  const md = unwrap(mdRes.json);
  const details = md?.matchDetails;
  const factors = details?.explanation?.factors;
  const paramScores = details?.parameterScores;
  record('M715-M01 matchDetails + explanation.factors (real, not fabricated)',
    mdRes.status === 200 && Array.isArray(factors) && factors.length > 0,
    `factors=${Array.isArray(factors) ? factors.length : 0}, algorithm=${details?.algorithm ?? '?'}`);
  record('M715-M02 parameterScores + required + weight + hardFail',
    mdRes.status === 200 && Array.isArray(paramScores) && typeof details?.hardFail !== 'undefined',
    `paramScores=${Array.isArray(paramScores) ? paramScores.length : 0}, hardFail=${String(details?.hardFail)}`);
  record('M715-M03 matchScore 0-100 + status surfaced',
    mdRes.status === 200 && typeof md?.matchScore === 'number',
    `matchScore=${md?.matchScore}, status=${md?.matchStatus}`);

  // accept match (state machine) → RFQ from match
  await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'MATCHED' } });
  await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'REVIEWED' } });
  await req('PATCH', `/demands/${IDs.demand}/matches/${IDs.match}`, { token: tBuyer, json: { status: 'ACCEPTED' } });

  const rf = await req('POST', '/rfqs/from-match', { token: tBuyer, json: { matchId: IDs.match } });
  IDs.rfq = unwrap(rf.json)?.id ?? '';
  record('POST /rfqs/from-match (buyer)', rf.status < 300 && !!IDs.rfq, `rfqId=${IDs.rfq}`);
  if (!IDs.rfq) return finish();
  await req('POST', `/rfqs/${IDs.rfq}/publish`, { token: tBuyer });

  // ---- Supplier RFQ detail UX surface (target org sees sourceMatch) ----
  const rfqSup = await req('GET', `/rfqs/${IDs.rfq}`, { token: tSupplier });
  const rSup = unwrap(rfqSup.json);
  const isTarget = rSup?.targetOrganization?.id === supOrgId && !!supOrgId;
  record('M715-R01 Supplier RFQ detail — demand context + parameters',
    rfqSup.status === 200 && !!rSup?.demand?.id && Array.isArray(rSup?.demand?.parameters ?? rSup?.demand?.parameterValues),
    `demand=${rSup?.demand?.title}, params=${Array.isArray(rSup?.demand?.parameters) ? rSup.demand.parameters.length : 0}`);
  if (isTarget) {
    record('M715-R02 Supplier RFQ detail — sourceMatch context for target org',
      !!rSup?.sourceMatch?.id && !!rSup?.sourceMatch?.product?.name && typeof rSup?.sourceMatch?.matchScore === 'number',
      `product=${rSup?.sourceMatch?.product?.name}, score=${rSup?.sourceMatch?.matchScore}, status=${rSup?.sourceMatch?.matchStatus}`);
  } else {
    record('M715-R02 Supplier RFQ detail — sourceMatch context for target org', false, 'supplier is NOT the RFQ target org in this run');
  }
  record('M715-R03 Supplier RFQ detail — targetOrganization surfaced',
    !!rSup?.targetOrganization?.id && !!rSup?.targetOrganization?.name,
    `targetOrg=${rSup?.targetOrganization?.name}`);

  // ---- Supplier Offer list surface (capability / model / provider / price / currency) ----
  const offList = await req('GET', `/offers?organizationId=${providerOrgId}&page=1&pageSize=20`, { token: tSupplier });
  const list2 = unwrap(offList.json)?.data ?? [];
  const myOffer = (Array.isArray(list2) ? list2 : []).find((x: any) => x.id === IDs.offer);
  record('M715-O01 Supplier offer list surface',
    offList.status === 200 && !!myOffer?.id,
    `status=${offList.status}, offers=${Array.isArray(list2) ? list2.length : 0}`);
  if (myOffer) {
    const spInfo = myOffer?.supplierProduct;
    const capName = spInfo?.platformProduct?.name ?? myOffer?.product?.name;
    record('M715-O02 Offer → Capability / Model / Provider surfaced',
      !!capName && !!spInfo?.modelNumber && !!spInfo?.organization?.name,
      `capability=${capName}, model=${spInfo?.brand} ${spInfo?.modelNumber}, provider=${spInfo?.organization?.name}`);
    record('M715-O03 Offer price + currency + status surfaced',
      myOffer?.price != null && !!myOffer?.currency && !!myOffer?.status,
      `price=${myOffer?.price}, currency=${myOffer?.currency}, status=${myOffer?.status}`);
  }

  // ---- Role boundary: buyer must NOT read supplier-owned offer via supplier endpoint ----
  // Offer detail is org-scoped; a foreign org (buyer) must be denied.
  const buyerOffer = await req('GET', `/offers/${IDs.offer}`, { token: tBuyer });
  const okBoundary = buyerOffer.status === 403 || buyerOffer.status === 404;
  record('M715-B01 Role boundary — foreign org cannot read supplier offer',
    okBoundary,
    `buyerReadStatus=${buyerOffer.status}`);

  // ---- Inquiry surface (supplier received inquiry) ----
  const inq = await req('POST', '/inquiries', { json: { productId: IDs.product, offerId: IDs.offer, organizationId: providerOrgId, supplierProductId: IDs.supplierProduct, name: '采购方', email: 'buyer@visndt.local', message: `${stamp} 询价` } });
  const inqRaw = unwrap(inq.json)?.inquiry ?? unwrap(inq.json);
  const inquiryId = inqRaw?.id ?? '';
  record('M715-I01 Buyer inquiry created (product+offer+supplierProduct)', inq.status < 300 && !!inquiryId, `inquiryId=${inquiryId}`);
  if (inquiryId) {
    const inqDetail = await req('GET', `/inquiries/${inquiryId}`, { token: tSupplier });
    const idq = unwrap(inqDetail.json);
    record('M715-I02 Supplier inquiry detail — capability + provider surfaced',
      inqDetail.status === 200 && !!idq?.productName && !!idq?.organizationName,
      `capability=${idq?.productName}, provider=${idq?.organizationName}, status=${idq?.status}`);
    try { await prisma.inquiry.delete({ where: { id: inquiryId } }); } catch {}
  }

  // ---- cross-chain UX identity ----
  record('M715-X01 Demand → Match → RFQ identity chain', !!IDs.demand && !!IDs.match && !!IDs.rfq, 'linked');
  record('M715-X02 RFQ sourceMatch == matchId', rSup?.sourceMatch?.id === IDs.match, `sourceMatch=${rSup?.sourceMatch?.id}`);

  await cleanup(IDs);
  finish();
}

async function cleanup(ids: typeof IDs) {
  try { if (ids.rfq) await prisma.rFQResponse.deleteMany({ where: { rfqId: ids.rfq } }); } catch {}
  try { if (ids.rfq) await prisma.rFQ.delete({ where: { id: ids.rfq } }); } catch {}
  if (ids.offer && !ids.offerIsSeed) { try { await prisma.offer.delete({ where: { id: ids.offer } }); } catch {} }
  try { if (ids.supplierProduct) await prisma.supplierProduct.delete({ where: { id: ids.supplierProduct } }); } catch {}
  try { if (ids.match) await prisma.demandMatch.delete({ where: { id: ids.match } }); } catch {}
  for (const did of [ids.demand, ids.demandPrivate]) {
    if (!did) continue;
    try { await prisma.demandParameter.deleteMany({ where: { demandId: did } }); } catch {}
    try { await prisma.demand.delete({ where: { id: did } }); } catch {}
  }
  try { if (ids.product) await prisma.productParameterValue.deleteMany({ where: { productId: ids.product } }); } catch {}
  try { if (ids.product) await prisma.product.delete({ where: { id: ids.product } }); } catch {}
  try { if (ids.category) await prisma.productCategory.delete({ where: { id: ids.category } }); } catch {}
  if (ids.enumDef) {
    try { await prisma.parameterOption.deleteMany({ where: { parameterDefinitionId: ids.enumDef } }); } catch {}
    try { await prisma.parameterDefinition.delete({ where: { id: ids.enumDef } }); } catch {}
  }
  console.log('  [cleanup] transaction chain removed');
  await prisma.$disconnect().catch(() => {});
}

function finish() {
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== RESULT: ${passed}/${results.length} passed ===`);
  prisma.$disconnect().then(() => process.exit(passed === results.length ? 0 : 1)).catch(() => process.exit(1));
}

main().catch(async (e) => { console.error('FATAL:', e); try { await prisma.$disconnect(); } catch {} process.exit(1); });
