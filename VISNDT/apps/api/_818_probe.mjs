// 818 READ-ONLY persistence audit probe.
// Only count / findMany / groupBy / distinct. No writes. No auth bypass. No mutations.
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config();
const prisma = new PrismaClient();
const out = {};
const anon = (s) => (s ? s.slice(0, 8) : null);

(async () => {
  out.supplierProductTotal = await prisma.supplierProduct.count();
  const byStatus = await prisma.supplierProduct.groupBy({ by: ['status'], _count: { _all: true } });
  out.statusDistribution = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));

  // Attach-created DRAFT detection: brand == platform product name AND modelNumber == platform product slug.
  const drafts = await prisma.supplierProduct.findMany({
    where: { status: 'DRAFT' },
    select: {
      id: true, organizationId: true, platformProductId: true,
      brand: true, series: true, modelNumber: true, slug: true, createdAt: true,
      platformProduct: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  const draftAnon = [];
  for (const d of drafts) {
    const isPlaceholder = (d.brand === d.platformProduct?.name) && (String(d.modelNumber || '') === (d.platformProduct?.slug || ''));
    draftAnon.push({
      id: anon(d.id), org: anon(d.organizationId), pp: anon(d.platformProductId),
      brandEqName: d.brand === d.platformProduct?.name,
      modelEqSlug: String(d.modelNumber || '') === (d.platformProduct?.slug || ''),
      isPlaceholder, status: d.status, slug: d.slug,
    });
  }
  out.attachDraftCount = draftAnon.filter((d) => d.isPlaceholder).length;
  out.attachDrafts = draftAnon;

  // Multiple-model audit: models per (org, platformProduct).
  const perOrgPP = await prisma.supplierProduct.groupBy({ by: ['organizationId', 'platformProductId'], _count: { _all: true } });
  out.maxModelsPerOrgPlatform = perOrgPP.reduce((m, r) => Math.max(m, r._count._all), 0);
  out.orgPlatformGroupsOver1 = perOrgPP.filter((r) => r._count._all > 1).map((r) => ({ org: anon(r.organizationId), pp: anon(r.platformProductId), n: r._count._all }));

  // Multiple-supplier audit: orgs per platformProduct.
  const perPP = await prisma.supplierProduct.groupBy({ by: ['platformProductId'], _count: { _all: true } });
  const orgsByPP = await prisma.supplierProduct.groupBy({ by: ['platformProductId', 'organizationId'], _count: { _all: true } });
  const ppOrgs = {};
  for (const r of orgsByPP) (ppOrgs[r.platformProductId] = ppOrgs[r.platformProductId] || new Set()).add(r.organizationId);
  out.multiSupplierPlatforms = Object.entries(ppOrgs).map(([pp, s]) => ({ pp: anon(pp), orgs: s.size })).filter((r) => r.orgs > 1);

  // Uniqueness semantics: within a DRAFT-attach (org,pp), is modelNumber constant (= slug) or distinct?
  out.modelNumbersPerDraftGroupDupes = [];
  for (const g of perOrgPP) {
    if (g._count._all <= 1) continue;
    const rows = await prisma.supplierProduct.findMany({
      where: { organizationId: g.organizationId, platformProductId: g.platformProductId },
      select: { modelNumber: true, brand: true },
    });
    const distinctModels = new Set(rows.map((r) => r.modelNumber)).size;
    const distinctBrands = new Set(rows.map((r) => r.brand)).size;
    out.modelNumbersPerDraftGroupDupes.push({
      org: anon(g.organizationId), pp: anon(g.platformProductId), total: g._count._all,
      distinctModels, distinctBrands, isAssociationLevel: distinctModels === 1,
    });
  }

  // Ownership: distinct orgs (organizationId is non-nullable by schema — no null possible).
  const distOrgs = await prisma.supplierProduct.findMany({ select: { organizationId: true }, distinct: ['organizationId'] });
  out.owningOrgCount = distOrgs.length;
  const pubOrgs = await prisma.supplierProduct.findMany({ where: { status: 'PUBLISHED' }, select: { organizationId: true }, distinct: ['organizationId'] });
  out.orgsWithPublished = pubOrgs.length;

  // Offer association.
  out.offerTotal = await prisma.offer.count();
  out.offerWithSupplierProduct = await prisma.offer.count({ where: { supplierProductId: { not: null } } });

  // Find supplier test users by org for API role probe.
  const supplierUsers = await prisma.user.findMany({
    select: { id: true, email: true, organizationId: true },
  });
  out.users = supplierUsers.map((u) => ({ id: anon(u.id), email: u.email, org: anon(u.organizationId) }));

  out.platformProductTotal = await prisma.product.count();
  out.organizationTotal = await prisma.organization.count();

  console.log(JSON.stringify(out, null, 2));
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });