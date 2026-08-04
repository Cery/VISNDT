const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { startsWith: 'admin' } },
    select: { id: true, email: true, name: true, organizationId: true },
  });
  console.log('Users:', JSON.stringify(users, null, 2));

  const orgs = await prisma.organization.findMany({
    where: { type: 'ADMIN' },
    select: { id: true, name: true, type: true },
  });
  console.log('Admin Orgs:', JSON.stringify(orgs, null, 2));

  const members = await prisma.organizationMember.findMany({
    select: { id: true, organizationId: true, userId: true, role: true },
  });
  console.log('Members:', JSON.stringify(members, null, 2));

  await prisma.$disconnect();
}
main();