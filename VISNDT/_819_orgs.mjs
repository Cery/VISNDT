import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const orgs = await p.organization.findMany({ select: { id: true, name: true, type: true, status: true, supplierProductManagementEnabled: true } });
  console.log('ORGS', JSON.stringify(orgs.map(o => ({ id: o.id, name: o.name, type: o.type, status: o.status, enabled: o.supplierProductManagementEnabled })), null, 1));
  const orgMembers = await p.organizationMember.findMany({ select: { id: true, organizationId: true, userId: true, role: true } });
  console.log('MEMBERS', JSON.stringify(orgMembers.map(m => ({ org: m.organizationId.slice(0, 8), user: m.userId.slice(0, 8), role: m.role })), null, 1));
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });