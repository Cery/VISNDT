const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function q(label, fn) { try { return { ok: true, label, value: await fn() }; } catch (e) { return { ok: false, label, err: e.message }; } }
(async () => {
  const out = [];
  out.push(await q('products', () => p.product.findMany({ where: { status: 'ACTIVE' }, select: { id: true, name: true, categoryId: true, _count: { select: { offers: true, parameterValues: true } } }, take: 20 })));
  out.push(await q('offers', () => p.offer.findMany({ select: { id: true, status: true, productId: true, organizationId: true, title: true }, take: 20 })));
  out.push(await q('paramDefs', () => p.parameterDefinition.findMany({ select: { id: true, name: true, code: true, dataType: true, unit: true }, take: 60 })));
  out.push(await q('supplierOrgs', () => p.organization.findMany({ where: { members: { some: { user: { email: 'demo.supplier.01@visndt.local' } } } }, select: { id: true, name: true } })));
  out.push(await q('buyerOrgs', () => p.organization.findMany({ where: { members: { some: { user: { email: 'demo.buyer.01@visndt.local' } } } }, select: { id: true, name: true } })));
  out.push(await q('supplierProducts', () => p.supplierProduct.findMany({ select: { id: true, platformProductId: true, organizationId: true, status: true }, take: 30 })));
  const prods = await p.product.findMany({ where: { status: 'ACTIVE' }, select: { id: true }, take: 5 }).catch(() => []);
  const pv = [];
  for (const pr of prods) {
    const vals = await p.productParameterValue.findMany({ where: { productId: pr.id }, include: { parameterDefinition: true } }).catch(() => []);
    pv.push({ productId: pr.id, n: vals.length, values: vals.map(v => ({ def: v.parameterDefinition && v.parameterDefinition.code, value: v.value, valueNumber: v.valueNumber, unit: v.parameterDefinition && v.parameterDefinition.unit })) });
  }
  out.push({ ok: true, label: 'productParamValues', value: pv });
  console.log(JSON.stringify(out, null, 2));
  await p.$disconnect().catch(()=>{});
  process.exit(0);
})();