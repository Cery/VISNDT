// 815 READ-ONLY persistence audit probe.
// Only count / findMany / groupBy / distinct. No writes. No auth bypass. No mutations.
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient();
const out = {};
const anon = (s) => (s ? s.slice(0, 8) : null);

(async () => {
  out.supplierProductTotal = await prisma.supplierProduct.count();
  const byStatus = await prisma.supplierProduct.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  out.statusDistribution = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));

  const byOrg = await prisma.supplierProduct.groupBy({
    by: ['organizationId'],
    _count: { _all: true },
  });
  out.orgCount = byOrg.length;
  out.topOrgs = byOrg
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 10)
    .map((r) => ({ org: anon(r.organizationId), n: r._count._all }));

  const byPP = await prisma.supplierProduct.groupBy({
    by: ['platformProductId'],
    _count: { _all: true },
  });
  out.platformProductCount = byPP.length;
  out.topPlatformProducts = byPP
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 10)
    .map((r) => ({ pp: anon(r.platformProductId), n: r._count._all }));

  out.samples = [];
  const all = await prisma.supplierProduct.findMany({
    select: { organizationId: true, platformProductId: true, modelNumber: true, status: true, publishedAt: true },
    orderBy: { createdAt: 'asc' },
    take: 40,
  });
  for (const r of all) {
    out.samples.push({
      org: anon(r.organizationId),
      pp: anon(r.platformProductId),
      model: r.modelNumber,
      status: r.status,
      published: r.publishedAt ? 'yes' : 'no',
    });
  }
  const pubOrgs = await prisma.supplierProduct.findMany({
    where: { status: 'PUBLISHED' },
    select: { organizationId: true },
    distinct: ['organizationId'],
  });
  out.orgsWithPublished = pubOrgs.length;

  out.offerTotal = await prisma.offer.count();
  out.offerWithSupplierProduct = await prisma.offer.count({
    where: { supplierProductId: { not: null } },
  });

  out.platformProductTotal = await prisma.product.count();
  out.categoryTotal = await prisma.productCategory.count();
  out.paramDefinitionTotal = await prisma.parameterDefinition.count();
  out.organizationTotal = await prisma.organization.count();

  const group = await prisma.supplierProduct.groupBy({
    by: ['organizationId', 'platformProductId'],
    _count: { _all: true },
  });
  out.maxModelsPerOrgPlatform = group.reduce((m, r) => Math.max(m, r._count._all), 0);
  out.multiModelGroups = group
    .filter((r) => r._count._all > 1)
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 10)
    .map((r) => ({ org: anon(r.organizationId), pp: anon(r.platformProductId), n: r._count._all }));

  const ppOrgs = await prisma.supplierProduct.groupBy({
    by: ['platformProductId', 'organizationId'],
    _count: { _all: true },
  });
  const ppMap = {};
  for (const r of ppOrgs) {
    ppMap[r.platformProductId] = (ppMap[r.platformProductId] || new Set()).add(r.organizationId);
  }
  out.multiSupplierPlatformProducts = Object.entries(ppMap)
    .map(([pp, s]) => ({ pp: anon(pp), orgs: s.size }))
    .filter((r) => r.orgs > 1)
    .sort((a, b) => b.orgs - a.orgs)
    .slice(0, 10);

  console.log(JSON.stringify(out, null, 2));
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });