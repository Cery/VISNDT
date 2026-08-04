const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete all admin-related data
  await prisma.organizationMember.deleteMany({ where: { role: 'ADMIN' } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'admin' } } });
  await prisma.organization.deleteMany({ where: { type: 'ADMIN' } });
  console.log('Admin data cleaned');
  await prisma.$disconnect();
}
main();