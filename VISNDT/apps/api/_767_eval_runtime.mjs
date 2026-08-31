/* 767 M34.6 Runtime Verification — Evaluation + Connection
 * Runs against http://localhost:3001/api/v1
 * [767 CONTROLLED EVALUATION] / [767 CONTROLLED INQUIRY] test data
 */
const base = 'http://localhost:3001/api/v1';

const BUYER_A = { email: 'buyer@visndt.com', password: 'admin123456' }; // VISNDT 采购方企业 (BUYER)
const BUYER_B = { email: 'demo.buyer.01@visndt.local', password: 'demo123456' }; // 江南航空检测技术中心 (BUYER)
const SUPPLIER = { email: 'supplier@visndt.com', password: 'admin123456' }; // SUPPLIER (negative RBAC)

const PRODUCT_ID = 'ebb1c034-4280-480b-89ce-29753660e126'; // ZB-K60 工业检测内窥镜 (ACTIVE)
const SP_ID = '02507f4c-34fa-4aef-aabe-79fc409986e8'; // VSNDT ZB-K60 (PUBLISHED)

const results = [];
function log(name, ok, detail) {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}${detail ? ' | ' + detail : ''}`);
}

async function api(method, path, { token, csrf, body, cookie } = {}) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (csrf) headers['X-CSRF-Token'] = csrf;
  if (body) headers['Content-Type'] = 'application/json';
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // capture set-cookie
  });
  const raw = await res.text();
  let data = null;
  try { data = JSON.parse(raw); } catch { data = raw; }
  const setCookie = res.headers.get('set-cookie');
  return { status: res.status, data, setCookie };
}

async function login(creds) {
  const r = await api('POST', '/auth/login', { body: creds });
  const token = r?.data?.data?.accessToken;
  return { token, status: r.status };
}

// CSRF double-submit-cookie: need a cookie jar. Simplest deterministic path:
// obtain CSRF token; it sets csrf_token cookie (httpOnly:false). We read token
// from body and send both.
async function getCsrf() {
  const r = await api('GET', '/auth/csrf');
  const csrf = r?.data?.data?.csrfToken ?? r?.data?.csrfToken ?? null;
  const setCookie = r.setCookie || '';
  // parse csrf_token=...  from Set-Cookie
  const m = /csrf_token=([^;]+)/.exec(setCookie) || [];
  return { csrf, cookie: m[1] ? `csrf_token=${m[1]}` : null };
}

(async () => {
  // ---- Login (Q1 setup) ----
  const a = await login(BUYER_A);
  const b = await login(BUYER_B);
  const s = await login(SUPPLIER);
  log('Q-LOGIN-BUYER_A', a.status === 201 && !!a.token, `status=${a.status}`);
  log('Q-LOGIN-BUYER_B', b.status === 201 && !!b.token, `status=${b.status}`);
  log('Q-LOGIN-SUPPLIER', s.status === 201 && !!s.token, `status=${s.status}`);

  const csrfA = await getCsrf();

  // ---- Cleanup: remove leftover [767 CONTROLLED EVALUATION] rows for buyer A so the run is idempotent ----
  const mineClean = await api('GET', '/evaluations', { token: a.token });
  const leftovers = ((mineClean?.data?.data?.data ?? [])).filter((e) =>
    typeof e.note === 'string' && e.note.includes('[767 CONTROLLED EVALUATION]'));
  for (const e of leftovers) {
    await api('DELETE', `/evaluations/${e.id}`, { token: a.token, csrf: csrfA.csrf, cookie: csrfA.cookie });
  }
  if (leftovers.length) console.log(`CLEANUP: removed ${leftovers.length} leftover controlled evaluations`);

  // ---- Q3: Create Evaluation (Product) ----
  const created = await api('POST', '/evaluations', {
    token: a.token, csrf: csrfA.csrf, cookie: csrfA.cookie,
    body: { targetType: 'PRODUCT', targetId: PRODUCT_ID, state: 'SHORTLISTED', note: '[767 CONTROLLED EVALUATION] zb-k60 interest' },
  });
  const evalId = created?.data?.data?.id;
  log('Q3-CREATE_EVAL_PRODUCT', created.status === 201 && !!evalId, `status=${created.status} id=${evalId}`);

  // ---- Q4: Read created evaluation ----
  const readBack = await api('GET', `/evaluations/${evalId}`, { token: a.token });
  log('Q4-READ_EVAL', readBack.status === 200 && readBack?.data?.data?.id === evalId, `status=${readBack.status}`);

  // ---- Q5: Persistence — new request (fresh token context), re-read ----
  const csrfA2 = await getCsrf();
  const readFresh = await api('GET', `/evaluations/${evalId}`, { token: a.token });
  log('Q5-PERSISTENCE', readFresh.status === 200 && readFresh?.data?.data?.targetId === PRODUCT_ID && readFresh?.data?.data?.state === 'SHORTLISTED', `status=${readFresh.status}`);

  // also list (mine) includes it
  const mine = await api('GET', '/evaluations', { token: a.token });
  const inMine = (mine?.data?.data?.data ?? []).some((e) => e.id === evalId);
  log('Q5B-LIST_MINE_PERSIST', mine.status === 200 && inMine, `status=${mine.status} total=${mine?.data?.data?.total}`);

  // ---- Q6: Update state ----
  const updated = await api('PATCH', `/evaluations/${evalId}`, {
    token: a.token, csrf: csrfA2.csrf, cookie: csrfA2.cookie,
    body: { state: 'CONTACTED' },
  });
  log('Q6-UPDATE_EVAL', updated.status === 200 && updated?.data?.data?.state === 'CONTACTED', `status=${updated.status}`);

  // ---- Q7: Ownership isolation — Buyer B cannot read A's evaluation ----
  const crossRead = await api('GET', `/evaluations/${evalId}`, { token: b.token });
  log('Q7-OWNERSHIP_ISOLATION', crossRead.status === 403, `status=${crossRead.status} (expected 403)`);

  // ---- Q8: Invalid target ----
  const fakeUUID = '00000000-0000-4000-8000-000000000000';
  const csrfA3 = await getCsrf();
  const invalidProd = await api('POST', '/evaluations', {
    token: a.token, csrf: csrfA3.csrf, cookie: csrfA3.cookie,
    body: { targetType: 'PRODUCT', targetId: fakeUUID },
  });
  const invalidSp = await api('POST', '/evaluations', {
    token: a.token, csrf: csrfA3.csrf, cookie: csrfA3.cookie,
    body: { targetType: 'SUPPLIER_PRODUCT', targetId: fakeUUID },
  });
  log('Q8-INVALID_PRODUCT', invalidProd.status === 404, `status=${invalidProd.status}`);
  log('Q8B-INVALID_SUPPLIERPRODUCT', invalidSp.status === 404, `status=${invalidSp.status}`);

  // ---- Q9: Duplicate protection (same user+target) ----
  const csrfA4 = await getCsrf();
  const dup = await api('POST', '/evaluations', {
    token: a.token, csrf: csrfA4.csrf, cookie: csrfA4.cookie,
    body: { targetType: 'PRODUCT', targetId: PRODUCT_ID, state: 'COMPARING' },
  });
  log('Q9-DUPLICATE_PROTECTION', dup.status === 409, `status=${dup.status} (expected 409)`);

  // ---- Q10: Connection — create SupplierProduct evaluation then resolve context ----
  const spEval = await api('POST', '/evaluations', {
    token: a.token, csrf: csrfA4.csrf, cookie: csrfA4.cookie,
    body: { targetType: 'SUPPLIER_PRODUCT', targetId: SP_ID, state: 'INTERESTED', note: '[767 CONTROLLED EVALUATION] supplier model' },
  });
  const spEvalId = spEval?.data?.data?.id;
  log('Q10-CREATE_SP_EVAL', spEval.status === 201 && !!spEvalId, `status=${spEval.status}`);

  const conn = await api('GET', `/evaluations/${spEvalId}/connection`, { token: a.token });
  const connData = conn?.data?.data;
  log('Q10-CONNECTION_CONTEXT', conn.status === 200 && !!connData?.productId && !!connData?.organizationId && !!connData?.supplierProductId,
    `status=${conn.status} productId=${connData?.productId} orgId=${connData?.organizationId} spId=${connData?.supplierProductId}`);

  // ---- Q11: Inquiry Runtime — read /inquiries/mine after owning an evaluation and connection ----
  const csrfA5 = await getCsrf();
  const connP = await api('GET', `/evaluations/${evalId}/connection`, { token: a.token });
  const offerId = connP?.data?.data?.offerId;
  const orgIdP = connP?.data?.data?.organizationId;
  log('Q11A-PRODUCT_CONNECTION', connP.status === 200 && !!orgIdP, `status=${connP.status} orgId=${orgIdP} offerId=${offerId}`);

  const inquiriesMine = await api('GET', '/inquiries/mine', { token: a.token });
  log('Q11-INQUIRY_RUNTIME', inquiriesMine.status === 200, `status=${inquiriesMine.status} total=${inquiriesMine?.data?.data?.total}`);

  // negative RBAC: supplier must be forbidden
  const supTry = await api('GET', '/evaluations', { token: s.token });
  log('Q-RBAC_SUPPLIER_FORBIDDEN', supTry.status === 403, `status=${supTry.status} (expected 403)`);

  console.log('\n==== SUMMARY ====');
  const pass = results.filter((r) => r.ok).length;
  console.log(`${pass}/${results.length} passed`);
  process.exit(0);
})().catch((e) => { console.error('SCRIPT ERROR', e); process.exit(1); });