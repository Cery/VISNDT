import { PrismaClient } from '../../node_modules/.prisma/client/index.js';
const prisma = new PrismaClient();
try {
  const sps = await prisma.supplierProduct.findMany({ select: { id: true, organizationId: true, status: true, brand: true, modelNumber: true } });
  console.log(JSON.stringify(sps, null, 1));
  const orgs = await prisma.organization.findMany({ select: { id: true, name: true, type: true } });
  console.log('\nORGS\n', JSON.stringify(orgs, null, 1));
} finally { await prisma.$disconnect(); }