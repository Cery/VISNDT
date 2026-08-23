import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const rows = await p.supplierProduct.findMany({
    where: { modelNumber: { contains: 'VX-6000' }, status: 'DRAFT' },
    select: {
      slug: true, modelNumber: true, brand: true, series: true, status: true,
      organization: { select: { name: true } },
      platformProduct: { select: { id: true, name: true } },
      parameterValues: { select: { value: true, valueNumber: true, parameterDefinition: { select: { code: true, name: true } } } },
    },
  });
  for (const r of rows) {
    console.log(`\n--- ${r.slug} | ${r.brand} ${r.series} ${r.modelNumber} | org=${r.organization?.name}`);
    console.log('   params:', (r.parameterValues ?? []).map((v) => `${v.parameterDefinition?.code}=${v.value ?? v.valueNumber ?? '-'}`).join(', ') || '(none)');
    const offers = await p.offer.count({ where: { supplierProductId: (await p.supplierProduct.findUnique({ where: { slug: r.slug }, select: { id: true } }))?.id } });
    console.log('   offers:', offers);
  }
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
