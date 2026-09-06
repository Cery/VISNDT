import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const dem = await p.demand.findFirst({ where: { title: { contains: '807' } }, select: { id: true, title: true, categoryId: true, status: true, organizationId: true } });
  console.log('DEMAND807:', JSON.stringify(dem));

  // product + category
  const prod = await p.product.findFirst({ where: { name: { contains: 'MetroY' } }, select: { id: true, name: true, status: true, categoryId: true, category: { select: { id: true, name: true } } } });
  console.log('PROD:', JSON.stringify(prod));

  // supplier org with ACTIVE offers on that product
  const offers = await p.offer.findMany({ where: { productId: prod?.id, status: 'ACTIVE' }, select: { id: true, organizationId: true, status: true } });
  console.log('ACTIVE OFFERS on prod:', offers.map(o=>`${o.id.slice(0,8)} org=${o.organizationId.slice(0,8)}`).join(' | '));
  const supOrgId = offers[0]?.organizationId;
  const supOrg = supOrgId ? await p.organization.findUnique({ where: { id: supOrgId }, select: { id: true, name: true, type: true, supplierProductManagementEnabled: true } }) : null;
  console.log('SUP_ORG:', JSON.stringify(supOrg));

  // buyer org
  const buyOrg = await p.organization.findUnique({ where: { id: dem?.organizationId }, select: { id: true, name: true, type: true } });
  console.log('BUY_ORG:', JSON.stringify(buyOrg));

  // members (users) for buyer & supplier orgs
  const buyUsers = dem ? await p.organizationMember.findMany({ where: { organizationId: dem.organizationId }, select: { user: { select: { id: true, email: true, name: true } }, role: true } }) : [];
  const supUsers = supOrgId ? await p.organizationMember.findMany({ where: { organizationId: supOrgId }, select: { user: { select: { id: true, email: true, name: true } }, role: true } }) : [];
  console.log('BUY_MEMBERS:', buyUsers.map(u=>`${u.user.email} role=${u.role}`).join(' | '));
  console.log('SUP_MEMBERS:', supUsers.map(u=>`${u.user.email} role=${u.role}`).join(' | '));

  // admin users
  const admins = await p.organizationMember.findMany({ where: { organization: { type: 'ADMIN' } }, take: 5, select: { user: { select: { id: true, email: true, name: true } }, role: true } });
  console.log('ADMIN_MEMBERS:', admins.map(u=>`${u.user.email} role=${u.role}`).join(' | '));

  // categories sample
  const cats = await p.productCategory.findMany({ take: 10, select: { id: true, name: true } });
  console.log('CATEGORIES:', cats.map(c=>`${c.name}`).join(' | '));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });