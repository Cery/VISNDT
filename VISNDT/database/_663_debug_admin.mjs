import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const log = [];

async function run() {
  log.push('=== 663 debug: admin role resolution ===');

  const users = await prisma.user.findMany({
    where: { email: { contains: 'admin' } },
    select: {
      id: true,
      email: true,
      organizationId: true,
      status: true,
      organization: { select: { name: true, type: true, status: true } },
    },
  });
  log.push(`admin-like users: ${users.length}`);
  for (const u of users) {
    log.push(`  ${u.email} | orgId=${u.organizationId ?? 'NULL'} | status=${u.status} | org=${u.organization ? `${u.organization.name}/${u.organization.type}/${u.organization.status}` : 'NONE'}`);
    if (u.organizationId) {
      const m = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: u.organizationId, userId: u.id } },
      });
      log.push(`    membership role=${m ? m.role : 'NO MEMBERSHIP ROW'}`);
    } else {
      log.push('    (no organizationId -> RolesGuard rejects with 403)');
    }
  }
}

run()
  .catch((e) => { log.push('ERROR: ' + e.message); console.log(log.join('\n')); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(log.join('\n'));
  });