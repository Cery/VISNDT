import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const u = await p.user.findUnique({
    where: { email: 'demo.admin@visndt.local' },
    include: { organization: true },
  });
  console.log('USER', u?.email, 'orgId=', u?.organizationId, 'orgType=', u?.organization?.type);
  if (!u) return;
  const m = await p.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: u.organizationId, userId: u.id } },
  });
  console.log('MEMBER role=', m?.role);
})().finally(() => p.$disconnect());