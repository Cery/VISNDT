import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const log = [];

async function run() {
  log.push('=== 664 Runtime Data Baseline ===');

  const total = await prisma.supplierProduct.count();
  log.push(`SupplierProduct total = ${total}`);

  const byStatus = await prisma.supplierProduct.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  log.push('Status distribution: ' + JSON.stringify(byStatus.map(s => [s.status, s._count._all])));

  const byOrg = await prisma.supplierProduct.groupBy({
    by: ['organizationId'],
    _count: { _all: true },
  });
  log.push('By organization: ' + JSON.stringify(byOrg.map(s => [s.organizationId, s._count._all])));

  const bySeries = await prisma.supplierProduct.groupBy({
    by: ['series'],
    _count: { _all: true },
  });
  log.push('By series: ' + JSON.stringify(bySeries.map(s => [s.series, s._count._all])));

  const pub = await prisma.supplierProduct.count({ where: { status: 'PUBLISHED' } });
  log.push(`PUBLISHED = ${pub}`);

  const offerBound = await prisma.offer.count({ where: { supplierProductId: { not: null } } });
  log.push(`Offer bound to SupplierProduct = ${offerBound}`);
}

run()
  .catch((e) => { log.push('ERROR: ' + e.message); console.log(log.join('\n')); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(log.join('\n'));
  });