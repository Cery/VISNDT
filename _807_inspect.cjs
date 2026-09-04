// 807 READ-ONLY data-state inspection (no writes). Deleted after use.
const { PrismaClient } = require('F:/Desktop/VISNDT/VISNDT/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js');
const p = new PrismaClient();
(async () => {
  const out = {};
  out.products = await p.product.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, model: true, categoryId: true, _count: { select: { offers: true, parameterValues: true } } },
    take: 20,
  });
  out.offers = await p.offer.findMany({ select: { id: true, status: true, productId: true, organizationId: true, title: true }, take: 20 });
  out.paramDefs = await p.parameterDefinition.findMany({ select: { id: true, name: true, code: true, dataType: true, unit: true }, take: 50 });
  out.supplierOrgs = await p.organization.findMany({ where: { members: { some: { user: { email: 'demo.supplier.01@visndt.local' } } } }, select: { id: true, name: true } });
  out.buyerOrgs = await p.organization.findMany({ where: { members: { some: { user: { email: 'demo.buyer.01@visndt.local' } } } }, select: { id: true, name: true } });
  out.supplierProducts = await p.supplierProduct.findMany({ select: { id: true, platformProductId: true, organizationId: true, status: true }, take: 20 });
  // product parameterValues sample for one product to understand matching fields
  const prods = await p.product.findMany({ where: { status: 'ACTIVE' }, select: { id: true }, take: 3 });
  const pv = [];
  for (const pr of prods) {
    const vals = await p.parameterValue.findMany({ where: { productId: pr.id }, include: { parameterDefinition: true } });
    pv.push({ productId: pr.id, n: vals.length, values: vals.map(v => ({ def: v.parameterDefinition.code, value: v.value, valueNumber: v.valueNumber, unit: v.parameterDefinition.unit })) });
  }
  out.productParamValues = pv;
  console.log(JSON.stringify(out, null, 2));
  await p.$disconnect();
})().catch(async (e) => { console.error(e.message); await p.$disconnect(); process.exit(1); });