import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const u = await p.user.findUnique({ where: { email: 'demo.admin@visndt.local' }, select: { id: true, email: true } });
  console.log('USER', u.id);
  const mem = await p.organizationMember.findMany({ where: { userId: u.id }, select: { organizationId: true, role: true, organization: { select: { name: true, type: true } } } });
  console.log('MEMBERSHIPS:', JSON.stringify(mem, null, 1));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });