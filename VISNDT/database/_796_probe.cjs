const { PrismaClient } = require('@prisma/client');
async function main() {
  const p = new PrismaClient();
  const u = await p.user.findUnique({
    where: { email: 'demo.admin@visndt.local' },
    include: { organization: true },
  });
  console.log('USER', u && u.email, 'orgId=', u && u.organizationId, 'orgType=', u && u.organization && u.organization.type);
  if (u) {
    const m = await p.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: u.organizationId, userId: u.id } },
    });
    console.log('MEMBER role=', m && m.role);
  }
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });