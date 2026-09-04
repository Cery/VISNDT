import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const orgs = await p.organization.findMany({ select: { id: true, name: true, type: true, status: true } });
  console.log('ORGS', JSON.stringify(orgs.map(o => ({ id: o.id.slice(0,8), name: o.name, type: o.type, status: o.status })), null, 1));
  const sp = await p.supplierProduct.findMany({ select: { id: true, organization: { select: { name: true } }, platformProduct: { select: { name: true } }, brand: true, modelNumber: true, status: true } });
  console.log('ALL_SP', sp.length);
  for (const s of sp) console.log('SP', JSON.stringify({ id: s.id.slice(0,8), org: s.organization?.name, plat: s.platformProduct?.name, brand: s.brand, model: s.modelNumber, status: s.status }));
  // admin routes available in web?
  await p.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });