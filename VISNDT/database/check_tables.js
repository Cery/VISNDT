const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if user_invitation table exists by trying to query
  try {
    const c = await prisma.userInvitation.count();
    console.log('UserInvitation count:', c);
  } catch (e) {
    console.log('UserInvitation error:', e.message);
  }
  
  // Check all tables
  const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log('Tables:', JSON.stringify(tables, null, 2));
  
  await prisma.$disconnect();
}
main();