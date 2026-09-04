import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const offers = await p.offer.findMany({ take: 5, select: { id: true, productId: true, supplierProductId: true, price: true, currency: true, status: true } });
  console.log('offers in DB:', offers.length);
  console.log(JSON.stringify(offers, null, 1));
  if (offers.length === 0) {
    console.log('NO OFFERS in DB — will need to create one to prove stripping.');
  }
  const pub = await p.supplierProduct.findMany({ where: { status: 'PUBLISHED' }, take: 3, select: { id: true, platformProductId: true, organizationId: true, modelNumber: true, brand: true } });
  console.log('published supplierProducts:', JSON.stringify(pub, null, 1));
  await p.$disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });