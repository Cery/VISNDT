import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const users = await p.user.findMany({ select: { id: true, email: true, passwordHash: true, organizationId: true } });
  for (const u of users) {
    const mem = await p.organizationMember.findMany({ where: { userId: u.id }, select: { organizationId: true, role: true } });
    console.log(JSON.stringify({ id: u.id, email: u.email, hasPw: !!u.passwordHash, org: u.organizationId?.slice(0, 8) ?? null, members: mem.map(m => m.organizationId.slice(0, 8) + '/' + m.role) }));
  }
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });