import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  console.log('total supplierProducts:', await p.supplierProduct.count());
  const last = await p.supplierProduct.findMany({ orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, brand: true, modelNumber: true, status: true, organizationId: true } });
  console.log('recent:', JSON.stringify(last, null, 1));
  const leftovers = await p.supplierProduct.findMany({ where: { modelNumber: { contains: '-2026', mode: 'insensitive' } }, select: { id: true, modelNumber: true, status: true } });
  console.log('date-tagged leftovers:', leftovers.length, JSON.stringify(leftovers));
  await p.$disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });