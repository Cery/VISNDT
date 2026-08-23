import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const log = [];

const TARGET_ORG_ID = '3159cda3-2057-3da9-c572-68b00c082cb5'; // VISNDT 平台运营中心 (ADMIN, same as demo.admin)
const ADMIN_EMAIL = 'admin@visndt.com';

async function run() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) throw new Error(`user not found: ${ADMIN_EMAIL}`);

  const oldOrgId = admin.organizationId;

  const updated = await prisma.user.update({
    where: { id: admin.id },
    data: { organizationId: TARGET_ORG_ID },
  });
  log.push(`user.organizationId: ${oldOrgId ?? 'NULL'} -> ${updated.organizationId}`);

  const member = await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: TARGET_ORG_ID, userId: admin.id },
    },
    update: { role: 'ADMIN' },
    create: { organizationId: TARGET_ORG_ID, userId: admin.id, role: 'ADMIN' },
  });
  log.push(`membership: ${JSON.stringify({ role: member.role })} (${member.id})`);

  log.push('DONE');
}

run()
  .catch((e) => { log.push('ERROR: ' + e.message); console.log(log.join('\n')); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(log.join('\n'));
  });