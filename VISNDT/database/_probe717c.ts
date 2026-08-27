import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const BASE = 'http://localhost:4000/api/v1';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function login(email: string, password: string) {
  const r = await fetch(BASE + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  if (!j?.data?.accessToken) console.log(`[login-debug] ${email} status=${r.status} msg=${j?.message ?? JSON.stringify(j)?.slice(0, 120)}`);
  return { token: j?.data?.accessToken ?? '', orgId: j?.data?.user?.organizationId ?? '' };
}
async function api(method: string, path: string, token: string, body?: unknown) {
  const h: Record<string, string> = {};
  if (body !== undefined) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (csrf) { h['X-CSRF-Token'] = csrf; h['Cookie'] = `csrf_token=${csrf}`; }
  const r = await fetch(BASE + path, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j: any = null; try { j = t ? JSON.parse(t) : null; } catch { j = { raw: t.slice(0, 300) }; }
  return { status: r.status, json: j };
}
const unwrap = (j: any) => j?.data ?? j;

let csrf = '';

async function main() {
  const cru = await fetch(BASE + '/auth/csrf');
  csrf = (await cru.json())?.data?.csrfToken ?? '';
  const a = await login('admin@visndt.com', 'admin123456');
  const b = await login('demo.buyer.01@visndt.local', 'demo123456');
  const s = await login('demo.supplier.01@visndt.local', 'demo123456');
  const sup = await prisma.user.findFirst({ where: { email: 'demo.supplier.01@visndt.local' }, select: { id: true, organizationId: true } });

  const cats = unwrap((await api('GET', '/product-categories', a.token)).json) ?? [];
  const category = Array.isArray(cats) ? cats[0]?.id : cats?.data?.[0]?.id;

  const prodResp = await api('POST', '/products', a.token, {
    name: `PROBE717-${Date.now()} 能力`, model: `P-${Date.now()}`, description: 'probe', categoryId: category, status: 'ACTIVE',
  });
  console.log('prodResp status=', prodResp.status, 'json=', JSON.stringify(prodResp.json)?.slice(0, 300));
  const prod = unwrap(prodResp.json)?.id ?? '';

  const sp = await prisma.supplierProduct.create({
    data: { platformProductId: prod, organizationId: sup!.organizationId, status: 'PUBLISHED', brand: 'B', series: 'S', modelNumber: `SP-${Date.now()}`, reviewedBy: sup!.id, reviewedAt: new Date(), publishedAt: new Date() },
  });

  const offerResp = await api('POST', '/offers', s.token, {
    productId: prod, supplierProductId: sp.id, title: `P-${Date.now()}`, price: 1, currency: 'CNY',
  });
  console.log('offerResp status=', offerResp.status, 'json=', JSON.stringify(offerResp.json)?.slice(0, 300));
  const offer = unwrap(offerResp.json)?.id ?? '';
  await prisma.offer.update({ where: { id: offer }, data: { status: 'ACTIVE' } });

  const strDef = await prisma.parameterDefinition.findFirst({ where: { dataType: 'STRING' }, select: { id: true } });
  const numDef = await prisma.parameterDefinition.findFirst({ where: { dataType: 'NUMBER' }, select: { id: true } });
  const enumDef = await prisma.parameterDefinition.findFirst({ where: { dataType: 'ENUM', options: { some: {} } }, select: { id: true, options: { select: { value: true }, take: 1 } } });
  const enumValue = enumDef?.options?.[0]?.value ?? '';
  await prisma.productParameterValue.createMany({
    data: [
      { productId: prod, parameterDefinitionId: strDef!.id, value: '55英寸' },
      { productId: prod, parameterDefinitionId: numDef!.id, value: '3', valueNumber: 3 },
      { productId: prod, parameterDefinitionId: enumDef!.id, value: enumValue },
    ],
  });

  const d = unwrap((await api('POST', '/demands', b.token, {
    title: `PROBE-${Date.now()} 检测能力需求`, description: 'probe demand', categoryId: category,
    quantity: 1, quantityUnit: '台', contactVisible: false,
  })).json)?.id ?? '';
  await api('POST', `/demands/${d}/parameters`, b.token, { parameterDefinitionId: strDef!.id, value: '55英寸', priority: 1, required: true });
  await api('POST', `/demands/${d}/parameters`, b.token, { parameterDefinitionId: numDef!.id, valueMin: 1, valueMax: 5, priority: 2, required: true });
  await api('POST', `/demands/${d}/parameters`, b.token, { parameterDefinitionId: enumDef!.id, value: enumValue, required: false });
  await api('POST', `/demands/${d}/publish`, b.token, {});
  await sleep(1500);
  await api('POST', `/demands/${d}/rematch`, b.token, {});

  let matchId = '';
  for (let i = 0; i < 8; i++) {
    await sleep(2500);
    const l = unwrap((await api('GET', `/demands/${d}/matches?page=1&pageSize=20`, b.token)).json)?.data ?? [];
    const m = (Array.isArray(l) ? l : []).find((x: any) => x.productId === prod);
    if (m) { matchId = m.id; break; }
  }
  console.log('matchId=', matchId);
  if (matchId) {
    const md = unwrap((await api('GET', `/demands/${d}/matches/${matchId}`, b.token)).json);
    console.log('--- matchDetails JSON ---');
    console.log(JSON.stringify(md.matchDetails, null, 1));
    const re = /AI|knowledge.?based|LLM|语义相似|embedding/i;
    const m2 = JSON.stringify(md.matchDetails).match(re);
    console.log('KEYWORD HIT:', m2?.[0] ?? 'NONE');
  }

  // cleanup
  await prisma.demandMatch.deleteMany({ where: { demandId: d } });
  await prisma.demandParameter.deleteMany({ where: { demandId: d } });
  await prisma.demand.deleteMany({ where: { id: d } });
  await prisma.offer.deleteMany({ where: { id: offer } });
  await prisma.supplierProduct.deleteMany({ where: { id: sp.id } });
  await prisma.productParameterValue.deleteMany({ where: { productId: prod } });
  await prisma.product.deleteMany({ where: { id: prod } });
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
