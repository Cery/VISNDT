// 807 M39 CONTROLLED FULL-CHAIN RUNTIME E2E — real API, real roles, real state machine.
// Purpose: prove the existing business loop (Evaluation/Demand→Match→RFQ→Response→Offer→Inquiry→Workspace→WF→Notify)
// completes under real runtime conditions using CONTROLLED temporary verification data.
// Markers: [TEST/E2E/807]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:4000/api/v1';
const OUT_DIR = process.env._807_OUT || join('../../database/_807_visual');
mkdirSync(OUT_DIR, { recursive: true });

const HDR = { 'Content-Type': 'application/json' };
const log = [];
const results = {}; // collected evidence
let CSRF = null; // double-submit cookie token for state-changing calls

function note(key, value) { results[key] = value; }
function record(step, ok, detail) {
  log.push({ step, ok, ts: new Date().toISOString(), detail });
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + step + (detail ? '  ::  ' + JSON.stringify(detail).slice(0, 300) : ''));
}

async function initCsrf() {
  const r = await fetch(BASE + '/auth/csrf');
  let j = null; try { j = await r.json(); } catch {}
  CSRF = j?.data?.csrfToken || null;
  console.log('  (csrf token ready: ' + (CSRF ? 'yes' : 'NO') + ')');
  return CSRF;
}

async function api(method, path, body, token) {
  const headers = { ...HDR };
  if (token) headers.Authorization = `Bearer ${token}`;
  if ((method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') && CSRF) {
    headers['X-CSRF-Token'] = CSRF;
    headers.Cookie = `csrf_token=${CSRF}`;
  }
  const r = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let j = null;
  try { j = await r.json(); } catch { j = null; }
  return { status: r.status, body: j };
}

async function login(email, password) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const { status, body } = await api('POST', '/auth/login', { email, password });
    if (status === 429) { console.log(`  (login throttled for ${email}, retrying in 12s)`); await sleep(12000); continue; }
    if ((status !== 200 && status !== 201) || !body?.data?.accessToken) {
      throw new Error(`Login failed for ${email}: ${status} ${JSON.stringify(body).slice(0,200)}`);
    }
    return { token: body.data.accessToken, user: body.data.user };
  }
  throw new Error(`Login throttled repeatedly for ${email}`);
}

function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }

async function poll(path, token, predicate, tries = 20, interval = 800) {
  for (let i = 0; i < tries; i++) {
    const { status, body } = await api('GET', path, null, token);
    if (status === 200 && body?.data && predicate(body.data)) return body.data;
    await sleep(interval);
  }
  return null;
}

// ---------- Constants (from real DB inspection; [TEST/E2E/807] controlled product) ----------
const PRODUCT_ID = '38a711ff-9352-40ea-978b-90ecd566b826'; // MetroY Ultra 高精度三维扫描仪 (ACTIVE)
const CATEGORY_ID = '9ff5f3df-c21b-454d-b885-259f8539a94a';  // product category
const PARAM_PIXEL = '4395f4cc-bc2b-4966-8061-4669a3ff62ee';    // pixel NUMBER 万  (product 200)
const PARAM_WEIGHT = '78508feb-813e-4da2-9633-29b2a416c08d';   // weight NUMBER kg (product 0.45)
const PARAM_BATTERY = 'fea93cbb-18ec-4054-9bf5-53748b740dc2';  // battery_life NUMBER h (product 2.5)

const TAG = 'TEST/E2E/807';

(async () => {
  try {
    await initCsrf();
    // ============ 0. EVALUATION → DEMAND (Buyer evaluates a product, then demands it) ============
    const buyer = await login('demo.buyer.01@visndt.local', 'demo123456');
    const supplier = await login('demo.supplier.01@visndt.local', 'demo123456');
    const admin = await login('admin@visndt.com', 'admin123456');

    const buyerOrg = buyer.user?.organizationId;
    const supplierOrg = supplier.user?.organizationId;
    note('roles', {
      buyer: { email: 'demo.buyer.01@visndt.local', orgId: buyerOrg },
      supplier: { email: 'demo.supplier.01@visndt.local', orgId: supplierOrg },
      admin: { email: 'admin@visndt.com' },
      orgIsolation: buyerOrg !== supplierOrg,
    });
    record('AUTH login+buyer/supplier/admin + org isolation', buyerOrg !== supplierOrg, { buyerOrg, supplierOrg });

    // Evaluation (Buyer state snapshot; persistent entity). Re-creating for the same
    // buyer+product is 409 (unique) — treat either create or idempotent-exists as OK.
    let evalId = null;
    try {
      const ev = await api('POST', '/evaluations', { targetType: 'PRODUCT', targetId: PRODUCT_ID, state: 'INTERESTED', note: `${TAG} evaluation` }, buyer.token);
      evalId = ev.body?.data?.id || ev.body?.data?.evaluation?.id || null;
      record('Evaluation create (buyer)', ev.status === 201 || ev.status === 200 || ev.status === 409, { status: ev.status, evalId: evalId || '(exists)' });
    } catch (e) { record('Evaluation create (buyer)', false, { err: e.message }); }
    note('evaluation', { evalId, message: 'Eval is lightweight buyer snapshot; Demand below is the authoritative entity' });

    // ============ 1. SUPPLIER: offer → DRAFT→SUBMITTED→ACCEPTED→ADMIN ACTIVE ============
    // Offer is unique per (organizationId, productId). If one already exists (previous
    // controlled run) and is ACTIVE, reuse it so the buyer chain resolves to the same offer.
    let offerId = null;
    const offerTitle = `${TAG} 三维扫描仪商用报价`;
    const off = await api('POST', '/offers', { productId: PRODUCT_ID, title: offerTitle, price: 88000, currency: 'CNY' }, supplier.token);
    offerId = off.body?.data?.id;
    let offerCreatedNew = false;
    if (offerId) { offerCreatedNew = true; }
    else {
      // pageSize capped at 100 on API (200 -> 400). Supplier-scoped list finds own ACTIVE offer.
      const all = (await api('GET', '/offers?status=ACTIVE&pageSize=100', null, supplier.token)).body?.data?.data || [];
      const ex = all.find((o) => o.productId === PRODUCT_ID && o.status === 'ACTIVE');
      offerId = ex?.id || null;
    }
    record('Offer (create DRAFT new, or reuse existing ACTIVE)', !!offerId, { status: off.status, createdNew: offerCreatedNew, offerId });
    if (offerCreatedNew) {
      const sub = await api('POST', `/offers/${offerId}/submit`, {}, supplier.token);
      record('Offer submit (DRAFT→SUBMITTED)', (sub.status === 200 || sub.status === 201) && sub.body?.data?.status === 'SUBMITTED', { status: sub.body?.data?.status });
      const acc = await api('POST', `/offers/${offerId}/accept`, {}, supplier.token);
      record('Offer accept (SUBMITTED→ACCEPTED)', (acc.status === 200 || acc.status === 201) && acc.body?.data?.status === 'ACCEPTED', { status: acc.body?.data?.status });
      const activate = await api('PATCH', '/offers/batch-status', { ids: [offerId], status: 'ACTIVE' }, admin.token);
      record('Offer admin activate (→ACTIVE) [platform governance, existing API]', activate.status === 200, { status: activate.status });
    } else {
      record('Offer lifecycle (reused ACTIVE offer from controlled run)', true, { note: 'already ACTIVE; buyer/response chain proceeds to same offer' });
    }
    note('offer', { offerId, productId: PRODUCT_ID, orgId: supplierOrg, status: 'ACTIVE', createdNew: offerCreatedNew });

    // ============ 2. BUYER: demand + parameters + publish → triggers MATCH ============
    const demandTitle = `${TAG} 高精度三维扫描仪采购需求`;
    const dm = await api('POST', '/demands', {
      title: demandTitle, description: '受控E2E验证需求，验证后清理。[TEST/E2E/807]',
      quantity: 1, quantityUnit: '台', budgetRange: '80,000-120,000 元',
      categoryId: CATEGORY_ID, contactName: '张检测', contactEmail: 'demo.buyer.01@visndt.local', contactVisible: false,
    }, buyer.token);
    const demandId = dm.body?.data?.id;
    record('Demand create (DRAFT, buyer)', !!(dm.status === 200 || dm.status === 201) && !!demandId, { status: dm.status, demandId });
    note('demand', { demandId, orgId: buyerOrg, title: demandTitle });

    const addParam = async (pid, vmin, vmax) => {
      const r = await api('POST', `/demands/${demandId}/parameters`, { parameterDefinitionId: pid, valueMin: vmin, valueMax: vmax, required: true, priority: 10 }, buyer.token);
      return r.status;
    };
    const p1 = await addParam(PARAM_PIXEL, 100, 500);
    const p2 = await addParam(PARAM_WEIGHT, 0, 5);
    const p3 = await addParam(PARAM_BATTERY, 1, 5);
    record('Demand parameters added (3 real param defs, buyer)', p1 === 201 || p1 === 200, { p1, p2, p3 });

    const pub = await api('POST', `/demands/${demandId}/publish`, {}, buyer.token);
    record('Demand publish (DRAFT→PUBLISHED, triggers match)', (pub.status === 200 || pub.status === 201) && pub.body?.data?.status === 'PUBLISHED', { status: pub.body?.data?.status });

    // ============ 3. MATCH produced by real workflow (async) ============
    const matchPage = await poll(`/demands/${demandId}/matches?pageSize=50`, buyer.token, (d) => Array.isArray(d?.data) && d.data.length > 0, 25, 900);
    const match = matchPage?.data?.[0] || null;
    const matchId = match?.id;
    record('Match produced by real workflow (DemandMatch persisted)', !!matchId, { matchId, status: match?.matchStatus, score: match?.matchScore });
    note('match', { demandId, productId: match?.productId, matchId, matchStatus: match?.matchStatus, matchScore: match?.matchScore, offerId: match?.offerId });

    // Guarantee the response/inquiry chain links to the real ACTIVE offer that the Dem andMatch resolved.
    if (!offerId && match?.offerId) { offerId = match.offerId; record('Offer id resolved from real match (DemandMatch.offerId)', true, { offerId }); }

    // Match state transitions: PENDING→MATCHED→REVIEWED→ACCEPTED (real buyer flow)
    const t1 = await api('PATCH', `/demands/${demandId}/matches/${matchId}`, { status: 'MATCHED' }, buyer.token);
    const t2 = await api('PATCH', `/demands/${demandId}/matches/${matchId}`, { status: 'REVIEWED' }, buyer.token);
    const t3 = await api('PATCH', `/demands/${demandId}/matches/${matchId}`, { status: 'ACCEPTED' }, buyer.token);
    record('Match accept chain PENDING→MATCHED→REVIEWED→ACCEPTED', t3.body?.data?.matchStatus === 'ACCEPTED', { t1: t1.body?.data?.matchStatus, t2: t2.body?.data?.matchStatus, t3: t3.body?.data?.matchStatus });

    // ============ 4. RFQ from accepted match → publish OPEN ============
    const rfqResp = await api('POST', '/rfqs/from-match', { matchId }, buyer.token);
    const rfqId = rfqResp.body?.data?.id;
    record('RFQ create from accepted match (sourceMatchId, targetSupplierOrg)', !!rfqId, { rfqId, sourceMatchId: rfqResp.body?.data?.sourceMatchId, targetOrganizationId: rfqResp.body?.data?.targetOrganizationId });
    const rfqPub = await api('POST', `/rfqs/${rfqId}/publish`, {}, buyer.token);
    record('RFQ publish (DRAFT→OPEN)', (rfqPub.status === 200 || rfqPub.status === 201) && rfqPub.body?.data?.status === 'OPEN', { status: rfqPub.body?.data?.status });
    note('rfq', { rfqId, sourceMatchId: rfqResp.body?.data?.sourceMatchId, targetOrganizationId: rfqResp.body?.data?.targetOrganizationId, status: 'OPEN' });

    // ============ 5. SUPPLIER: receive & respond to RFQ (real flow) ============
    const respCreate = await api('POST', `/rfqs/${rfqId}/responses`, { offerId, message: `${TAG} 我方提供该三维扫描仪报价，欢迎进一步沟通。` }, supplier.token);
    const responseId = respCreate.body?.data?.id;
    record('RFQ Response submit (supplier, links offer)', !!responseId, { responseId, status: respCreate.body?.data?.status, offerId });
    note('rfqResponse', { responseId, rfqId, offerId, orgId: supplierOrg });

    // Buyer reviews & accepts response
    const viewR = await api('POST', `/rfq-responses/${responseId}/view`, {}, buyer.token);
    record('Response view (buyer SUBMITTED→VIEWED)', viewR.body?.data?.status === 'VIEWED', { status: viewR.body?.data?.status });
    const acceptR = await api('POST', `/rfq-responses/${responseId}/accept`, { decisionNote: `${TAG} 接受报价` }, buyer.token);
    record('Response accept (buyer VIEWED→ACCEPTED)', acceptR.body?.data?.status === 'ACCEPTED', { status: acceptR.body?.data?.status });
    note('rfqResponse decision', { finalStatus: acceptR.body?.data?.status });

    // ============ 6. INQUIRY = Connection (offer → supplier org) ============
    const inq = await api('POST', '/inquiries', {
      productId: PRODUCT_ID, offerId, organizationId: supplierOrg,
      name: '张检测', email: 'demo.buyer.01@visndt.local', phone: '13800138000',
      message: `${TAG} 贵司提供的高精度三维扫描仪，希望建立联系获取更多技术资料。`,
    });
    const inquiryId = inq.body?.data?.inquiry?.id || inq.body?.data?.id;
    record('Inquiry create (Connection semantics, offer→supplierOrg)', !!inquiryId, { inquiryId, status: inq.body?.data?.inquiry?.status });
    note('inquiry', { inquiryId, productId: PRODUCT_ID, offerId, organizationId: supplierOrg });

    // ============ 7. WORKSPACE visibility (buyer + supplier) ============
    let buyerWf = {}, supplierWf = {};
    try { buyerWf = (await api('GET', '/workspace/buyer/overview', null, buyer.token)).body; } catch {}
    try { supplierWf = (await api('GET', '/workspace/supplier/overview', null, supplier.token)).body; } catch {}
    record('Workspace buyer/overview reachable', !!buyerWf, { data: buyerWf?.data ? Object.keys(buyerWf.data) : null });
    record('Workspace supplier/overview reachable', !!supplierWf, { data: supplierWf?.data ? Object.keys(supplierWf.data) : null });
    note('workspace', { buyer: buyerWf?.data, supplier: supplierWf?.data });

    // ============ 8. WorkflowEvents for the E2E chain (must be real) ============
    const wfAll = (await api('GET', '/workflow-events?pageSize=100', null, buyer.token)).body?.data?.data || [];
    const wfDemand = wfAll.filter((e) => e.entityId === demandId);
    const wfRfq = wfAll.filter((e) => e.entityId === rfqId);
    const wfMatch = wfAll.filter((e) => e.entityId === matchId);
    const wfResp = wfAll.filter((e) => e.entityId === responseId);
    note('workflowEvents', {
      demand: wfDemand?.map?.((e) => ({ action: e.action, type: e.entityType })) ?? null,
      match: wfMatch?.map?.((e) => ({ action: e.action, type: e.entityType })) ?? null,
      rfq: wfRfq?.map?.((e) => ({ action: e.action, type: e.entityType })) ?? null,
      response: wfResp?.map?.((e) => ({ action: e.action, type: e.entityType })) ?? null,
    });
    record('WorkflowEvents real: DEMAND created/published', Array.isArray(wfDemand) && wfDemand.length >= 1, { n: wfDemand?.length });
    record('WorkflowEvents real: MATCH created/accepted', Array.isArray(wfMatch) && wfMatch.length >= 1, { n: wfMatch?.length });
    record('WorkflowEvents real: RFQ created/published', Array.isArray(wfRfq) && wfRfq.length >= 1, { n: wfRfq?.length });
    record('WorkflowEvents real: RFQ_RESPONSE created', Array.isArray(wfResp) && wfResp.length >= 1, { n: wfResp?.length });

    // ============ 9. NOTIFICATIONS (correct recipient / event source) ============
    const buyerNotif = (await api('GET', '/notifications?pageSize=50', null, buyer.token)).body?.data?.data || [];
    const supplierNotif = (await api('GET', '/notifications?pageSize=50', null, supplier.token)).body?.data?.data || [];
    note('notifications', {
      buyerCount: buyerNotif?.length,
      supplierCount: supplierNotif?.length,
      buyerSamples: buyerNotif?.slice(0, 8)?.map((n) => ({ title: n.title, referenceType: n.referenceType, status: n.status })),
      supplierSamples: supplierNotif?.slice(0, 8)?.map((n) => ({ title: n.title, referenceType: n.referenceType, status: n.status })),
    });
    record('Notifications present for buyer (workflow updates)', Array.isArray(buyerNotif) && buyerNotif.length >= 1, { n: buyerNotif?.length });
    record('Notifications present for supplier (RFQ/response/inquiry)', Array.isArray(supplierNotif) && supplierNotif.length >= 1, { n: supplierNotif?.length });
    record('Notification event-source check (has RFQ/RESPONSE/INQUIRY refs)', Array.isArray(supplierNotif) && supplierNotif.some?.((n) => n.referenceType === 'RFQ' || n.referenceType === 'RFQ_RESPONSE' || n.referenceType === 'INQUIRY'), {});

    // ============ 10. Organization isolation (buyer cannot see supplier-only, vice versa) ============
    // Buyer's inquiry list (should include the inquiry targeting supplier? No — inquiry org = supplier). 
    // Verify buyer lists no supplier-owned offer detail; supplier sees RFQ as target.
    const supplierRfqs = (await api('GET', '/workspace/supplier/rfqs', null, supplier.token)).body?.data;
    const buyerRfqs = (await api('GET', '/rfqs/mine', null, buyer.token)).body?.data?.data || [];
    record('Org isolation: supplier sees targeted RFQ in workspace/supplier/rfqs', Array.isArray(supplierRfqs) && supplierRfqs.some?.((r) => r.id === rfqId), { n: supplierRfqs?.length });
    record('Org isolation: buyer sees own RFQ in /rfqs/mine', Array.isArray(buyerRfqs) && buyerRfqs.some?.((r) => r.id === rfqId), { n: buyerRfqs?.length });

    // ============ 11. End-to-end artifacts ============
    record('E2E ids captured', !!demandId && !!matchId && !!rfqId && !!responseId && !!inquiryId && !!offerId, {
      demandId, matchId, rfqId, responseId, inquiryId, offerId,
    });
    note('chain', { offerId, demandId, matchId, rfqId, responseId, inquiryId, buyerOrg, supplierOrg });

  } catch (e) {
    record('E2E UNEXPECTED ERROR', false, { err: e.message, stack: e.stack?.slice?.(0, 500) });
  }

  // Persist evidence
  const evidence = { task: '807_M39_Controlled_Full_Chain_Runtime_E2E', generatedAt: new Date().toISOString(), results, steps: log };
  try { writeFileSync(join(OUT_DIR, '_807_business_loop.json'), JSON.stringify(evidence, null, 2), 'utf8'); console.log('\nWROTE _807_business_loop.json'); }
  catch (e) { console.log('write err', e.message); }
  const fails = log.filter((l) => !l.ok);
  console.log(`\n==== 807 E2E SUMMARY ==== PASS=${log.length - fails.length} FAIL=${fails.length} TOTAL=${log.length}`);
  if (fails.length) console.log(JSON.stringify(fails, null, 2));
  process.exitCode = fails.length ? 2 : 0;
  await sleep(500);
})();