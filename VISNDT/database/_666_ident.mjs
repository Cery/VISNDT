// 666 Fixture Identification — all SupplierProducts must match slug prefix (scale|mingshi|ruishi|zhongke)-
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const q = (sql) => prisma.$queryRawUnsafe(sql);
(async () => {
  const rows = await q(`select slug, brand, series, "modelNumber", status from supplier_product order by slug`);
  const pat = /^(scale|mingshi|ruishi|zhongke)-/;
  const missing = rows.filter((r) => !pat.test(r.slug));
  console.log(JSON.stringify({
    total: rows.length,
    identifiable: rows.length - missing.length,
    missing: missing.map((m) => m.slug),
    slugs: rows.map((r) => r.slug),
  }, null, 2));
  await prisma.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
