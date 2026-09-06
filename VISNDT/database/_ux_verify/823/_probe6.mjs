import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const orgs = await p.organization.findMany({
    where: { id: 'b99cdbc7-eea1-4f09-bfd2-ed4753e3724c' },
    select: { id: true, name: true, type: true },
  });
  console.log('ORG:', JSON.stringify(orgs));
  const mem = await p.organizationMember.findMany({
    where: { organizationId: 'b99cdbc7-eea1-4f09-bfd2-ed4753e3724c' },
    select: { role: true, user: { select: { id: true, email: true, name: true, status: true } } },
  });
  console.log('MEMBERS:', mem.map(m=>`${m.user.email} role=${m.role} st=${m.user.status}`).join(' | '));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });