import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const list = await p.supplierProduct.findMany({ where: { status: 'DRAFT' }, orderBy: { updatedAt: 'desc' }, select: { id: true, brand: true, modelNumber: true, description: true, organizationId: true } });
  console.log(JSON.stringify(list, null, 1));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });