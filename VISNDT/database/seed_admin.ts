import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding admin account...');

  const hash = await bcrypt.hash('admin123456', 10);

  const org = await prisma.organization.create({
    data: {
      name: 'Admin Organization',
      type: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Organization created:', org.id);

  const user = await prisma.user.create({
    data: {
      email: 'admin@vip.com',
      passwordHash: hash,
      name: 'Admin',
      status: 'ACTIVE',
      organizationId: org.id,
    },
  });
  console.log('User created:', user.email, user.id);

  const member = await prisma.organizationMember.create({
    data: {
      organizationId: org.id,
      userId: user.id,
      role: 'ADMIN',
    },
  });
  console.log('Member created:', member.id);

  console.log('\n=== Admin account ready ===');
  console.log('Email:    admin@vip.com');
  console.log('Password: admin123456');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());