// 666 Coverage Matrix + Media + Parameter verification (DB raw queries)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const q = (sql) => prisma.$queryRawUnsafe(sql);
(async () => {
  // Coverage Matrix by supplier org
  const rows = await q(`
    select o.name as org, p.name as capability, p.slug as cap_slug,
           sp.brand, sp.series, sp."modelNumber", sp.status,
           (select count(*) from supplier_product_media m where m.supplier_product_id = sp.id) as media,
           (select count(*) from supplier_product_parameter_value v where v.supplier_product_id = sp.id) as params,
           (select count(*) from offer of_ where of_.supplier_product_id = sp.id) as offers
    from supplier_product sp
    join organization o on o.id = sp.organization_id
    join product p on p.id = sp.platform_product_id
    order by o.name, sp.series, sp."modelNumber"
  `);
  const matrix = {};
  for (const r of rows) {
    const key = `${r.org} | ${r.capability}`;
    if (!matrix[key]) matrix[key] = { org: r.org, capability: r.capability, capSlug: r.cap_slug, models: [], statusSet: new Set(), mediaModels: 0, paramModels: 0, offerModels: 0 };
    const m = matrix[key];
    m.models.push(`${r.brand}/${r.series}/${r.modelNumber}[${r.status}]`);
    m.statusSet.add(r.status);
    if (r.media > 0) m.mediaModels++;
    if (r.params > 0) m.paramModels++;
    if (r.offers > 0) m.offerModels++;
  }
  const outMatrix = Object.values(matrix).map((m) => ({
    org: m.org,
    capability: m.capability,
    models: m.models.length,
    statuses: [...m.statusSet].sort(),
    withMedia: m.mediaModels,
    withParams: m.paramModels,
    withOffer: m.offerModels,
  }));

  // Status coverage summary
  const statusRows = await q(`select status, count(*)::int n from supplier_product group by status order by status`);
  // Media types
  const mediaRows = await q(`select media_type, document_type, count(*)::int n from supplier_product_media group by media_type, document_type order by media_type`);
  // Parameter total
  const paramTotal = await q(`select count(*)::int n from supplier_product_parameter_value`);
  // Multi-supplier capability check: any platform product with >=2 orgs
  const multi = await q(`
    select p.name as capability, count(distinct sp.organization_id)::int as orgs, count(distinct sp.id)::int as models
    from supplier_product sp join product p on p.id = sp.platform_product_id
    group by p.name having count(distinct sp.organization_id) >= 2 order by orgs desc
  `);
  // Org id real org check
  const orgCheck = await q(`
    select count(*)::int as sp_total,
           count(*) filter (where o.id is not null)::int as with_real_org,
           count(*) filter (where pp.id is not null)::int as with_real_product
    from supplier_product sp
    left join organization o on o.id = sp.organization_id
    left join product pp on pp.id = sp.platform_product_id
  `);
  // Offer binding integrity
  const offerCheck = await q(`
    select count(*)::int as bound_offers,
           count(*) filter (where of_.organization_id <> sp.organization_id)::int as cross_org_bad,
           count(*) filter (where of_.product_id <> sp.platform_product_id)::int as cross_cap_bad
    from offer of_
    join supplier_product sp on sp.id = of_.supplier_product_id
  `);
  console.log(JSON.stringify({
    coverageMatrix: outMatrix,
    statusCoverage: statusRows,
    mediaTypes: mediaRows,
    paramTotal: paramTotal[0].n,
    multiSupplierCapabilities: multi,
    integrity: orgCheck[0],
    offerIntegrity: offerCheck[0],
  }, null, 2));
  await prisma.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
