import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const orgs = await p.organization.findMany({ select: { id: true, name: true, type: true, status: true } });
  const users = await p.user.findMany({ select: { id: true, email: true, organizationId: true } });
  console.log('ORGS', JSON.stringify(orgs.map(o => ({ id: o.id.slice(0, 8), name: o.name, type: o.type, status: o.status })), null, 1));
  console.log('USERS', JSON.stringify(users.map(u => ({ id: u.id.slice(0, 8), email: u.email, org: u.organizationId?.slice(0, 8) ?? null })), null, 1));
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });