/* 667 DB baseline — locate VX-6000 capability and its supplier products (direct Prisma read) */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  // Find platform products matching VX-6000 by name/slug/model
  const products = await prisma.product.findMany({
    where: { OR: [{ name: { contains: 'VX' } }, { slug: { contains: 'vx' } }, { model: { contains: 'VX' } }] },
    select: { id: true, name: true, slug: true, status: true, model: true },
    orderBy: { name: 'asc' },
  });
  console.log('[PLATFORM PRODUCTS (VX*)]', JSON.stringify(products));

  // For each, get supplier products
  for (const p of products) {
    const sps = await prisma.supplierProduct.findMany({
      where: { platformProductId: p.id },
      include: {
        organization: { select: { id: true, name: true } },
        parameterValues: { include: { parameterDefinition: { select: { id: true, name: true, code: true, dataType: true, unit: true, parameterGroupId: true } } } },
        offers: { select: { id: true, status: true, price: true, currency: true, organizationId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`[CAP ${p.name} (${p.slug})] spCount=${sps.length}`);
    for (const sp of sps) {
      console.log(`  SP ${sp.modelNumber} | org=${sp.organization?.name} | brand=${sp.brand} | series=${sp.series} | status=${sp.status} | pv=${sp.parameterValues.length} | offers=${sp.offers.map((o) => o.status).join(',')}`);
    }
  }

  // Overall fixture count
  const total = await prisma.supplierProduct.count();
  const published = await prisma.supplierProduct.count({ where: { status: 'PUBLISHED' } });
  console.log('[TOTAL SP]', total, 'published=', published);
})()
  .finally(() => prisma.$disconnect());
