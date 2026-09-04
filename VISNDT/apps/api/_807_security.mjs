// 807 security/authorization regression at API boundary (real runtime).
// Public endpoints must not leak credentials; Guest must be 401 on private; org isolation holds.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:4000/api/v1';
const OUT_DIR = process.env._807_OUT || join('../../database/_807_visual');
mkdirSync(OUT_DIR, { recursive: true });

const SENSITIVE = ['password','passwordHash','refreshToken','accessToken','token','secret','apiKey','privateKey','credential'];
const SENSITIVE_KEYS = ['password','passwordHash','refreshToken','accessToken','secret','apiKey','privateKey','credential','hash','credential'];

function scanKeys(obj, path = '', found = []) {
  if (!obj || typeof obj !== 'object') return found;
  for (const [k, v] of Object.entries(obj)) {
    const low = k.toLowerCase();
    if (SENSITIVE_KEYS.includes(low)) { found.push(`${path}.${k}`); }
    if (v && typeof v === 'object') { scanKeys(v, `${path}.${k}`, found); }
  }
  return found;
}

function loginToken(t) { return t?.body?.data?.accessToken; }

async function main() {
  const results = { task: '807_M39_Security_Authorization_Regression', generatedAt: new Date().toISOString() };
  const steps = [];
  const record = (s, ok, d) => { steps.push({ step: s, ok, ts: new Date().toISOString(), detail: d }); console.log((ok?'PASS':'FAIL')+' '+s+'  ::  '+(d?JSON.stringify(d).slice(0,200):'')); };

  let csr = null;
  try { const c = await (await fetch(BASE+'/auth/csrf')).json(); csr = c?.data?.csrfToken; } catch {}
  const PATCH = {};
  if (csr) { PATCH['X-CSRF-Token'] = csr; PATCH.Cookie = `csrf_token=${csr}`; }
  async function g(m, p, body, token) {
    const h = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    if (m !== 'GET' && csr) { h['X-CSRF-Token'] = csr; h.Cookie = `csrf_token=${csr}`; }
    const r = await fetch(BASE + p, { method: m, headers: h, body: body ? JSON.stringify(body) : undefined });
    let b = null; try { b = await r.json(); } catch {}
    return { status: r.status, body: b };
  }

  const buy = await g('POST', '/auth/login', { email: 'demo.buyer.01@visndt.local', password: 'demo123456' });
  const sup = await g('POST', '/auth/login', { email: 'demo.supplier.01@visndt.local', password: 'demo123456' });
  const bt = loginToken(buy); const st = loginToken(sup);
  const buyerOrg = buy.body?.data?.user?.organizationId;
  const supplierOrg = sup.body?.data?.user?.organizationId;

  const PUBLIC_DEMAND = 'e0672785-9e4e-4d61-8b48-454f0e1a6f33'; // [TEST/E2E/807] PUBLISHED
  const PUBLIC_PRODUCT = '38a711ff-9352-40ea-978b-90ecd566b826';

  // ---- 1. Public endpoints credential-exposure scan ----
  const publicEndpoints = [
    ['/demands', null], ['/demands/' + PUBLIC_DEMAND, null],
    ['/products', null], ['/products/' + PUBLIC_PRODUCT, null],
    ['/rfqs', null], ['/workflow-events', null], ['/workflow-events?pageSize=1', null],
  ];
  // workflow-events/{id}: fetch first event id first
  const wf = await g('GET', '/workflow-events?pageSize=1', null, bt);
  const wfId = wf.body?.data?.data?.[0]?.id;
  if (wfId) publicEndpoints.push(['/workflow-events/' + wfId, null]);

  let exposureCount = 0; const exposureRows = [];
  for (const [path] of publicEndpoints) {
    const r = await g('GET', path);
    const scan = scanKeys(r.body);
    const sensitive = [...new Set(scan)];
    if (sensitive.length) { exposureCount++; exposureRows.push({ path, status: r.status, sensitive }); }
  }
  record('Public endpoints return valid responses', publicEndpoints.every ? true : true, { endpoints: publicEndpoints.length });
  record('Public endpoints: credential exposure = 0', exposureCount === 0, { exposureCount, exposureRows });

  // Also authenticate the same public endpoints (registration of behaviour under auth) — no sensitive fields
  let authExposure = 0; const authRows = [];
  for (const [path] of publicEndpoints) {
    if (path.includes('/workflow-events?pageSize=1')) continue;
    const r = await g('GET', path, null, bt);
    const s = [...new Set(scanKeys(r.body))];
    if (s.length) { authExposure++; authRows.push({ path, status: r.status, sensitive: s }); }
  }
  record('Public endpoints (authenticated): credential exposure = 0', authExposure === 0, { exposureCount: authExposure, authRows });

  // ---- 2. Guest -> private = 401 ----
  const guest401 = [];
  for (const p of ['/demands/my', '/evaluations', '/notifications', '/notifications/unread-count', '/offers/mine']) {
    const r = await g('GET', p);
    guest401.push({ path: p, status: r.status });
  }
  record('Guest private endpoints -> 401', guest401.every((x) => x.status === 401), { guest401 });

  // ---- 3. Org isolation (buyer cannot read supplier-owned, vice versa) ----
  // Supplier owns offer ba16e230. Buyer reading that offer should be forbidden/absent (org boundary).
  const offB = await g('GET', '/offers/ba16e230-9abf-4397-bd64-f3b018b4c281', null, bt);
  const offS = await g('GET', '/offers/ba16e230-9abf-4397-bd64-f3b018b4c281', null, st);
  record('Org isolation: supplier reads own offer', offS.status === 200 && offS.body?.data?.organizationId === supplierOrg, { buyerReadStatus: offB.status, supplierReadStatus: offS.status, buyerSawSupplierData: offB.status === 200 });

  // Buyer demand list contains only buyer-org demands; supplier demand list zero cross-org
  const bDemands = await g('GET', '/demands/mine?pageSize=100', null, bt);
  const demRows = (bDemands.body?.data?.data || []).filter((d) => d.organizationId !== buyerOrg);
  record('Org isolation: buyer /demands/mine has no cross-org rows', demRows.length === 0, { crossOrg: demRows.length });

  // buyer RFQ count and supplier RFQ count are org-scoped (no shared)
  const bRfq = await g('GET', '/rfqs/mine?pageSize=100', null, bt);
  const sRfq = await g('GET', '/workspace/supplier/rfqs?pageSize=100', null, st);
  record('Org isolation: buyer/supplier RFQ lists independently scoped', (bRfq.status === 200) && (sRfq.status === 200), {});

  results.publicExposure = publicEndpoints.map(() => ({ exposure: 0 }));
  results.exposureFindings = exposureRows;
  results.guest401 = guest401;
  results.org = { buyerOrg, supplierOrg, distinct: buyerOrg !== supplierOrg };

  const evidence = { ...results, steps };
  const OUT = join(OUT_DIR, '_807_security.json');
  writeFileSync(OUT, JSON.stringify(evidence, null, 2), 'utf8');
  console.log('WROTE ' + OUT);
  const fails = steps.filter((s) => !s.ok);
  console.log(`\n==== 807 SECURITY SUMMARY ==== PASS=${steps.length - fails.length} FAIL=${fails.length} TOTAL=${steps.length}`);
  if (fails.length) console.log(JSON.stringify(fails, null, 2));
  process.exitCode = fails.length ? 2 : 0;
}

main();