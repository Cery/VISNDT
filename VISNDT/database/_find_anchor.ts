import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const prods = await p.product.findMany({
    where: { status: 'ACTIVE', offers: { some: { status: 'ACTIVE' } } },
    select: { id: true, name: true },
  });
  for (const r of prods) {
    const off = await p.offer.findFirst({
      where: { productId: r.id, status: 'ACTIVE' },
      select: { organizationId: true },
    });
    const pv = await p.productParameterValue.findMany({
      where: { productId: r.id },
      include: { parameterDefinition: true },
    });
    console.log('PRODUCT', r.name.slice(0, 24), '| offerOrg', (off?.organizationId || '').slice(0, 8));
    for (const v of pv.slice(0, 12)) {
      console.log('    ', v.parameterDefinition.name, '| type=', v.parameterDefinition.dataType, '| val=', String(v.value).slice(0, 30), '| min=', v.valueMin, '| max=', v.valueMax, '| defId=', v.parameterDefinition.id);
    }
  }
  await p.$disconnect();
})();