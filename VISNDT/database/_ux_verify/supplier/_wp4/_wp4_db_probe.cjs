const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const sps = await p.supplierProduct.findMany({
    select: {
      id: true, organizationId: true, modelNumber: true, brand: true, status: true,
      platformProduct: { select: { id: true, name: true, slug: true } },
      _count: { select: { media: true, parameterValues: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(JSON.stringify(sps, null, 2));
  await p.$disconnect();
})().catch(async (e) => { console.error(e); await p.$disconnect(); process.exit(1); });