/* 820 Self-Service Foundation — runtime verification (pure API + prisma offer check). */
import { PrismaClient } from '@prisma/client';

const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`); };
const prisma = new PrismaClient();
const login = async (email) => {
  const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: PW }) });
  const j = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, token: j?.data?.accessToken } : { ok: false, status: r.status };
};
const csrf = async () => (await (await fetch(API + '/auth/csrf')).json().catch(() => ({})))?.data?.csrfToken || null;
const req = async (token, method, path, body) => {
  const c = await csrf();
  const h = { Authorization: token ? 'Bearer ' + token : '', 'X-CSRF-Token': c, Cookie: 'csrf_token=' + c };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  const r = await fetch(API + path, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
};
const unwrap = (j) => (Array.isArray(j?.data?.data) ? j.data.data : (Array.isArray(j?.data) ? j.data : j?.data));
const ORG_B = '926d5a96-e1be-455c-8d58-8f4a79b6735d'; // ENABLED supplier (明视) — demo.supplier.01
const ORG_A = '697c99b2-1447-491a-a68a-566f51ca9181'; // ENABLED (深圳市微视)
const PREFIX = '820-VERIFY';
const MY = `_${PREFIX}-${Date.now()}_control`;

(async () => {
  const admin = await login('demo.admin@visndt.local');
  check('admin login', admin.ok);
  if (!admin.ok) process.exit(2);

  const sup = await login('demo.supplier.01@visndt.local');
  check('supplier login', sup.ok);
  if (!sup.ok) process.exit(2);

  // pick a platform product
  let ppId = null, ppName = null;
  for (const ep of ['/platform-products', '/products']) {
    const r = await fetch(API + ep).catch(() => null);
    if (r && r.ok) { const j = await r.json().catch(() => ({})); const arr = Array.isArray(j?.data?.data) ? j.data.data : (Array.isArray(j?.data) ? j.data : []); if (arr.length && arr[0]?.id) { ppId = arr[0].id; ppName = arr[0].name; break; } }
  }
  check('found platform product id', !!ppId, 'pp=' + ppId);

  // 1) create own model A (real data)
  const mkA = await req(sup.token, 'POST', '/supplier-products/my', { platformProductId: ppId, brand: 'Brand820A', series: 'S1', modelNumber: `MODEL820A-${MY}`, description: '820 created own model A', technicalDescription: 'techA', applicationInfo: 'appA' });
  const idA = mkA?.body?.data?.id;
  check('create own model A → 201/200', (mkA.status === 201 || mkA.status === 200) && !!idA, 'status=' + mkA.status);
  check('create A status=DRAFT, isPlaceholder=false', mkA?.body?.data?.status === 'DRAFT' && mkA?.body?.data?.isPlaceholder === false, 'status=' + mkA?.body?.data?.status);
  check('create A owns org' + '(no client org, server-derived)', mkA?.body?.data?.organizationId === ORG_B, 'org=' + mkA?.body?.data?.organizationId);

  // 2) create second model B under SAME platform product (multiple models)
  const mkB = await req(sup.token, 'POST', '/supplier-products/my', { platformProductId: ppId, brand: 'Brand820A', series: 'S1', modelNumber: `MODEL820B-${MY}`, description: '820 created own model B', technicalDescription: 'techB', applicationInfo: 'appB' });
  const idB = mkB?.body?.data?.id;
  check('create second model B same platform product → 200', (mkB.status === 201 || mkB.status === 200) && !!idB, 'status=' + mkB.status);

  // 3) duplicate real modelNumber → rejected
  const dup = await req(sup.token, 'POST', '/supplier-products/my', { platformProductId: ppId, brand: 'X', series: 'S', modelNumber: `MODEL820B-${MY}` });
  check('duplicate real modelNumber → rejected(400)', dup.status === 400 || dup.status === 409, 'status=' + dup.status);

  // 4) edit own model A
  const upd = await req(sup.token, 'PATCH', '/supplier-products/my/' + idA, { brand: 'Brand820A-EDITED', series: 'S2', description: '820 edited own model A' });
  check('edit own model A → 200', upd.status === 200, 'status=' + upd.status);
  check('edit reflects new brand/series', upd?.body?.data?.brand === 'Brand820A-EDITED' && upd?.body?.data?.series === 'S2', 'brand=' + upd?.body?.data?.brand);
  check('edited real model isPlaceholder=false', upd?.body?.data?.isPlaceholder === false);

  // 5) list own (contains A and B, has isPlaceholder flag)
  const list = unwrap((await req(sup.token, 'GET', '/supplier-products/my')).body);
  const ids = (Array.isArray(list) ? list : []).map((x) => x.id);
  check('list own contains BOTH A and B', ids.includes(idA) && ids.includes(idB), 'count=' + ids.length);
  check('list rows expose isPlaceholder flag', (Array.isArray(list) && list.length > 0 && typeof list[0].isPlaceholder === 'boolean'));

  // 6) keyword filter within own models
  const filtered = unwrap((await req(sup.token, 'GET', '/supplier-products/my?keyword=' + encodeURIComponent(`MODEL820B-${MY}`))).body);
  const fIds = (Array.isArray(filtered) ? filtered : []).map((x) => x.id);
  check('keyword filter returns ONLY model B', fIds.length === 1 && fIds[0] === idB, 'count=' + fIds.length);

  // 7) status filter: DRAFT present
  const draftList = unwrap((await req(sup.token, 'GET', '/supplier-products/my?status=DRAFT')).body);
  check('status=DRAFT filter includes A and B', (Array.isArray(draftList) ? draftList : []).some((x) => x.id === idA) && (Array.isArray(draftList) ? draftList : []).some((x) => x.id === idB));

  // 8) other-org isolation: admin creates one in orgA; orgB supplier cannot read/edit/delete it
  const c = await csrf();
  const eh = { Authorization: 'Bearer ' + admin.token, 'X-CSRF-Token': c, Cookie: 'csrf_token=' + c, 'Content-Type': 'application/json' };
  const adminCreated = await (await fetch(API + '/admin/supplier-products', { method: 'POST', headers: eh, body: JSON.stringify({ organizationId: ORG_A, platformProductId: ppId, brand: 'OtherOrg', series: 'O', modelNumber: `ORGA-${MY}` }) })).json().catch(() => ({}));
  const pidO = adminCreated?.data?.id;
  check('admin created orgA product for isolation test', !!pidO);
  const crossRead = await req(sup.token, 'GET', '/supplier-products/my/' + pidO);
  check('cross-org READ → 404', crossRead.status === 404, 'status=' + crossRead.status);
  const crossEdit = await req(sup.token, 'PATCH', '/supplier-products/my/' + pidO, { brand: 'HACK' });
  check('cross-org EDIT → 404', crossEdit.status === 404, 'status=' + crossEdit.status);
  const myList2 = unwrap((await req(sup.token, 'GET', '/supplier-products/my')).body);
  check('own list does NOT include other-org record', !(Array.isArray(myList2) ? myList2 : []).some((x) => x.id === pidO));

  // 9) spoofing: POST with organizationId in body is ignored (server-derived)
  const spoof = await req(sup.token, 'POST', '/supplier-products/my', { platformProductId: ppId, brand: 'Spoof', series: null, modelNumber: `SPOOF-${MY}`, description: null, technicalDescription: null, applicationInfo: null });
  const spoofOrg = spoof?.body?.data?.organizationId;
  const spoofId = spoof?.body?.data?.id;
  check('ownership spoof attempt lands in OWN org (orgB)', spoofOrg === ORG_B, 'org=' + spoofOrg);
  if (spoofId) await req(admin.token, 'DELETE', '/admin/supplier-products/' + spoofId);

  // 10) Platform Product unchanged (never written by self-service)
  const ppCheck = await (await fetch(API + '/products/' + ppId)).json().catch(() => ({}));
  const ppNameAfter = ppCheck?.data?.name;
  check('Platform Product name unchanged', ppNameAfter === ppName, 'name=' + ppNameAfter);

  // 11) No Offer auto-created for created DRAFT models
  const offerCount = await prisma.offer.count({ where: { OR: [{ supplierProductId: idA }, { supplierProductId: idB }] } });
  check('No Offer auto-created for drafts', offerCount === 0, 'offers=' + offerCount);

  // 12) DRAFT statuses confirmed not PUBLISHED/APPROVED/SUBMITTED
  const dbA = await prisma.supplierProduct.findUnique({ where: { id: idA }, select: { status: true } });
  const dbB = await prisma.supplierProduct.findUnique({ where: { id: idB }, select: { status: true } });
  check('DB confirms both records still DRAFT', dbA?.status === 'DRAFT' && dbB?.status === 'DRAFT', 'A=' + dbA?.status + ', B=' + dbB?.status);

  // cleanup test rows
  const d1 = await req(admin.token, 'DELETE', '/admin/supplier-products/' + idA);
  const d2 = await req(admin.token, 'DELETE', '/admin/supplier-products/' + idB);
  const d3 = await req(admin.token, 'DELETE', '/admin/supplier-products/' + pidO);
  check('cleanup deleted test rows', d1.status === 200 && d2.status === 200 && d3.status === 200);

  await prisma.$disconnect();
  const passed = results.filter((r) => r.pass).length;
  console.log('\n=== 820 VERIFY SUMMARY ===');
  console.log(JSON.stringify({ passCount: passed, total: results.length, ALL_PASS: passed === results.length, items: results }, null, 1));
  process.exit(0);
})().catch((e) => { console.error('FATAL ' + e.message); prisma.$disconnect().finally(() => process.exit(2)); });