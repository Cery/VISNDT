import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const log = [];

async function run() {
  log.push('=== ADMIN organizations ===');
  const orgs = await prisma.organization.findMany({
    where: { type: 'ADMIN' },
    select: { id: true, name: true, status: true },
  });
  for (const o of orgs) {
    const members = await prisma.organizationMember.count({ where: { organizationId: o.id } });
    log.push(`  ${o.name} | id=${o.id} | status=${o.status} | members=${members}`);
  }

  log.push('\n=== admin@visndt.com record ===');
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@visndt.com' },
    select: { id: true, email: true, organizationId: true, status: true },
  });
  log.push(JSON.stringify(admin));
  if (admin?.organizationId) {
    const m = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: admin.organizationId, userId: admin.id } },
    });
    log.push(`  membership: ${m ? JSON.stringify(m) : 'NULL (NO ROW)'}`);
  } else {
    log.push('  organizationId is NULL');
  }
}

run()
  .catch((e) => { log.push('ERROR: ' + e.message); console.log(log.join('\n')); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(log.join('\n'));
  });