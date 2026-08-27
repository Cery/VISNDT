/**
 * M30.4 M712 — Demand/RFQ Technical Parameter Data Chain (temp runtime verification)
 * Run: npx tsx verify_712_param_chain.ts  (database dir, API on localhost:4000)
 * Verifies: Demand param persist → Demand detail回显 → RFQ detail projection includes demand.parameters(with ENUM options)
 * Creates a temp ENUM definition via Prisma (test-only), cleaned up at the end.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BASE = 'http://localhost:4000/api/v1';
const results: { step: string; ok: boolean; detail: string }[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}
let cc = { csrf: '', token: '' };
async function req(method: string, path: string, o: { json?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (o.json !== undefined) headers['Content-Type'] = 'application/json';
  if (o.token) headers['Authorization'] = `Bearer ${o.token}`;
  if (cc.csrf) {
    headers['X-CSRF-Token'] = cc.csrf;
    headers['Cookie'] = `csrf_token=${cc.csrf}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: o.json !== undefined ? JSON.stringify(o.json) : undefined,
  });
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

async function main() {
  console.log('=== M712 Demand/RFQ Technical Parameter Chain ===\n');

  // temp ENUM definition + options
  const defCode = `m712_enum_${Date.now()}`;
  const tempDef = await prisma.parameterDefinition.create({
    data: { name: 'M712 光源类型(临时)', code: defCode, dataType: 'ENUM', unit: null, required: false },
  });
  const opts = [
    { parameterDefinitionId: tempDef.id, value: 'LED', label: 'LED', sortOrder: 0 },
    { parameterDefinitionId: tempDef.id, value: 'LASER', label: '激光', sortOrder: 1 },
  ];
  await prisma.parameterOption.createMany({ data: opts });
  console.log('  [setup] temp ENUM def', tempDef.id, 'options', opts.length);

  const csrfRes = await req('GET', '/auth/csrf');
  cc.csrf = csrfRes.json?.data?.csrfToken ?? '';
  record('GET /auth/csrf', csrfRes.status === 200 && !!cc.csrf, 'ok');

  const l = await req('POST', '/auth/login', { json: { email: 'demo.buyer.01@visndt.local', password: 'demo123456' } });
  cc.token = l.json?.data?.accessToken ?? ck(l.sc, 'access_token') ?? '';
  record('POST /auth/login (BUYER)', l.status >= 200 && l.status < 300 && !!cc.token, l.json?.data?.user?.email ?? l.json?.message ?? 'fail');
  if (!cc.token) { await cleanup(tempDef.id, null); return finish(); }

  const defsRes = await req('GET', '/parameter-definitions?page=1&pageSize=100', { token: cc.token });
  // /parameter-definitions returns a paginated object { data:[...], total, ... }
  const defs = unwrap(defsRes.json)?.data ?? [];
  if (defsRes.status !== 200 || defs.length === 0) {
    console.log('  [debug] defsRes status=', defsRes.status, JSON.stringify(defsRes.json)?.slice(0, 300));
  }
  const strDef = defs.find((d: any) => d.dataType === 'STRING');
  const numDef = defs.find((d: any) => d.dataType === 'NUMBER');
  record('parameter definitions resolved (STR/NUM + temp ENUM)', !!strDef && !!numDef && !!tempDef.id, `STR=${strDef?.name}, NUM=${numDef?.name}, tempENUM=${tempDef.code}`);
  if (!strDef || !numDef) { await cleanup(tempDef.id, null); return finish(); }

  const stamp = `M712-${Date.now()}`;
  const created = await req('POST', '/demands', {
    token: cc.token,
    json: { title: `M712 参数链验证 ${stamp}`, description: 'runtime parameter chain check', quantity: 5, quantityUnit: '台' },
  });
  const demand = unwrap(created.json);
  if (created.status < 200 || created.status >= 300 || !demand?.id) {
    console.log('  [debug] POST /demands status=', created.status, JSON.stringify(created.json)?.slice(0, 300));
  }
  record('POST /demands', created.status >= 200 && created.status < 300 && !!demand?.id, `id=${demand?.id}`);
  if (!demand?.id) { await cleanup(tempDef.id, null); return finish(); }
  const demandId = demand.id;

  const pStr = await req('POST', `/demands/${demandId}/parameters`, { token: cc.token, json: { parameterDefinitionId: strDef.id, value: '高清', required: true, priority: 2 } });
  const pNum = await req('POST', `/demands/${demandId}/parameters`, { token: cc.token, json: { parameterDefinitionId: numDef.id, valueMin: 100, valueMax: 500, required: true, priority: 1 } });
  const pEnum = await req('POST', `/demands/${demandId}/parameters`, { token: cc.token, json: { parameterDefinitionId: tempDef.id, value: 'LED', required: false, priority: 0 } });
  record('POST /demands/:id/parameters (STR/NUM/ENUM)', pStr.status >= 200 && pNum.status >= 200 && pEnum.status >= 200, `str=${pStr.status}, num=${pNum.status}, enum=${pEnum.status}`);

  const detail = await req('GET', `/demands/${demandId}`, { token: cc.token });
  const dParams = unwrap(detail.json)?.parameters ?? [];
  const enumInDetail = dParams.find((p: any) => p.parameterDefinitionId === tempDef.id);
  record(
    'GET /demands/:id includes parameters(with ENUM options)',
    dParams.length >= 3 && (enumInDetail?.parameterDefinition?.options ?? []).length >= 2,
    `count=${dParams.length}, enumOptions=${(enumInDetail?.parameterDefinition?.options ?? []).length}`,
  );

  const pList = await req('GET', `/demands/${demandId}/parameters`, { token: cc.token });
  const lp = unwrap(pList.json) ?? [];
  const enumInList = lp.find((p: any) => p.parameterDefinitionId === tempDef.id);
  record('GET /demands/:id/parameters includes options', pList.status === 200 && lp.length >= 3 && (enumInList?.parameterDefinition?.options ?? []).length >= 2, `count=${lp.length}, enumOptions=${(enumInList?.parameterDefinition?.options ?? []).length}`);

  // Matching engine consumption: publish → async match(demandId) consumes demand parameters
  const pub = await req('POST', `/demands/${demandId}/publish`, { token: cc.token });
  const pubDemand = unwrap(pub.json);
  record('POST /demands/:id/publish triggers matching', pub.status >= 200 && pub.status < 300 && pubDemand?.status === 'PUBLISHED', `status=${pubDemand?.status}`);
  await new Promise((r) => setTimeout(r, 1500)); // allow async matching to settle
  const matchesRes = await req('GET', `/demands/${demandId}/matches?page=1&pageSize=10`, { token: cc.token });
  const matches = unwrap(matchesRes.json);
  record(
    'GET /demands/:id/matches (matching consumed params, no regression)',
    matchesRes.status === 200 && Array.isArray(matches?.data) && typeof matches?.total === 'number',
    `status=${matchesRes.status}, total=${matches?.total ?? 'n/a'}, items=${Array.isArray(matches?.data) ? matches.data.length : 'n/a'}`,
  );

  const rfqRes = await req('POST', '/rfqs', { token: cc.token, json: { demandId } });
  const rfq = unwrap(rfqRes.json);
  record('POST /rfqs (from demand)', rfqRes.status >= 200 && rfqRes.status < 300 && !!rfq?.id, `rfqId=${rfq?.id}`);
  if (!rfq?.id) { await cleanup(tempDef.id, demandId); return finish(); }

  const rfqDetail = await req('GET', `/rfqs/${rfq.id}`, { token: cc.token });
  const rp = unwrap(rfqDetail.json)?.demand?.parameters ?? [];
  const enumInRfq = rp.find((p: any) => p.parameterDefinitionId === tempDef.id);
  const rOrg = !!unwrap(rfqDetail.json)?.demand?.organization;
  record(
    'GET /rfqs/:id includes demand.parameters(with ENUM options)',
    rfqDetail.status === 200 && rp.length >= 3 && (enumInRfq?.parameterDefinition?.options ?? []).length >= 2 && rOrg,
    `params=${rp.length}, enumOptions=${(enumInRfq?.parameterDefinition?.options ?? []).length}, organization=${rOrg}`,
  );

  // NOTE: DELETE /demands/:id is ADMIN-only (RBAC). Cleanup via Prisma below.
  await cleanup(tempDef.id, demandId);
  finish();
}

async function cleanup(defId: string, demandId: string | null) {
  try {
    if (demandId) {
      try { await prisma.rFQ.deleteMany({ where: { demandId } }); } catch {}
      try { await prisma.demandParameter.deleteMany({ where: { demandId } }); } catch {}
      try { await prisma.demand.delete({ where: { id: demandId } }); } catch {}
    }
    await prisma.parameterOption.deleteMany({ where: { parameterDefinitionId: defId } });
    await prisma.parameterDefinition.delete({ where: { id: defId } });
    console.log('  [cleanup] temp ENUM def + demand/rfq removed');
  } catch (e) {
    console.log('  [cleanup] partial:', (e as Error).message);
  }
  await prisma.$disconnect().catch(() => {});
}

function finish() {
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== RESULT: ${passed}/${results.length} passed ===`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch(async (e) => { console.error('FATAL:', e); try { await prisma.$disconnect(); } catch {} process.exit(1); });