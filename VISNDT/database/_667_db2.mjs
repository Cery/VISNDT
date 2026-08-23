/* 667 DB baseline — full fixture distribution + published comparison candidates */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  const sps = await prisma.supplierProduct.findMany({
    include: {
      organization: { select: { name: true } },
      platformProduct: { select: { name: true, slug: true } },
      _count: { select: { parameterValues: true, offers: true } },
    },
    orderBy: [{ platformProduct: { name: 'asc' } }, { organization: { name: 'asc' } }, { modelNumber: 'asc' }],
  });

  const rows = sps.map((s) => ({
    cap: s.platformProduct.name,
    org: s.organization.name,
    brand: s.brand,
    series: s.series,
    model: s.modelNumber,
    status: s.status,
    pv: s._count.parameterValues,
    offers: s._count.offers,
  }));
  console.table(rows);

  // Published comparison candidates: capabilities with >=2 PUBLISHED SP across >=2 orgs
  const published = sps.filter((s) => s.status === 'PUBLISHED');
  console.log('\n[PUBLISHED count]', published.length);
  const byCap = new Map();
  for (const s of published) {
    const k = s.platformProduct.name;
    if (!byCap.has(k)) byCap.set(k, { orgs: new Set(), models: 0, pvModels: 0 });
    byCap.get(k).orgs.add(s.organization.name);
    byCap.get(k).models++;
    if (s._count.parameterValues > 0) byCap.get(k).pvModels++;
  }
  for (const [k, v] of byCap) {
    console.log(`[CAP] ${k} -> published=${v.models} orgs=${[...v.orgs].join('|')} withPv=${v.pvModels}`);
  }
})()
  .finally(() => prisma.$disconnect());
