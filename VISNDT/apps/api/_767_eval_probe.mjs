import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const esc = (s) => JSON.stringify(s);
(async () => {
  const users = await p.user.findMany({ select: { id: true, email: true, organizationId: true }, take: 30 });
  const orgs = await p.organization.findMany({ select: { id: true, name: true, type: true }, take: 30 });
  const products = await p.product.findMany({ select: { id: true, name: true, slug: true, status: true }, where: { status: 'ACTIVE' }, take: 30 });
  const sps = await p.supplierProduct.findMany({ select: { id: true, brand: true, modelNumber: true, status: true, platformProductId: true, organizationId: true }, take: 30 });
  const memberRoles = await p.organizationMember.findMany({ select: { userId: true, organizationId: true, role: true }, take: 50 });
  console.log('USERS:', esc(users));
  console.log('ORGS:', esc(orgs));
  console.log('PRODUCTS:', esc(products));
  console.log('SUPPLIER_PRODUCTS:', esc(sps));
  console.log('MEMBER_ROLES:', esc(memberRoles));
  await p.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });