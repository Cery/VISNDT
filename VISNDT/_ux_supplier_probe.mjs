import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const user = await p.user.findUnique({
    where: { email: 'demo.supplier.01@visndt.local' },
    select: { id: true, email: true, organizationId: true },
  });
  const org = user ? await p.organization.findUnique({ where: { id: user.organizationId }, select: { id: true, name: true, type: true, status: true } }) : null;

  const myProducts = org ? await p.supplierProduct.findMany({
    where: { organizationId: org.id },
    include: { platformProduct: { select: { id: true, name: true, slug: true } }, organization: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  }) : [];

  // platform products incl ZB-K60
  const zbs = await p.product.findMany({
    where: { OR: [ { name: { contains: 'ZB' } }, { name: { contains: 'K60' } }, { slug: { contains: 'k60' } } ] },
    select: { id: true, name: true, slug: true, model: true },
  });
  // a sample of all platform products count
  const ppCount = await p.product.count();

  // a supplierProduct owned by ANOTHER org (for cross-org test)
  const otherOrgSp = await p.supplierProduct.findFirst({
    where: { organizationId: { not: org?.id }, status: 'DRAFT' },
    select: { id: true, organizationId: true },
  });

  console.log('USER', JSON.stringify(user?.id?.slice(0,8), null, 0), user?.email);
  console.log('ORG', JSON.stringify(org));
  console.log('MY_PRODUCT_COUNT', myProducts.length);
  for (const m of myProducts) {
    console.log('MINE', JSON.stringify({ id: m.id.slice(0,8), brand: m.brand, modelNumber: m.modelNumber, status: m.status, plat: m.platformProduct?.name, slug: m.platformProduct?.slug, created: m.createdAt }));
  }
  console.log('ZBS', JSON.stringify(zbs, null, 1));
  console.log('PLATFORM_PRODUCT_COUNT', ppCount);
  console.log('OTHER_ORG_SP', JSON.stringify(otherOrgSp));
  // any admin route guard check for supplier org
  await p.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });