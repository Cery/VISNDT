import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.6 Admin Demand Override E2E Test
 *
 * Covers:
 *   1. No token → 401
 *   2. MEMBER (owner) → 403 (admin endpoint)
 *   3. ADMIN → 200 (bypasses owner check)
 */
describe('Admin Demand Override E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_ADM_DEM';

  let orgId: string;
  let adminToken: string;
  let memberToken: string;
  let memberId: string;
  let demandId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    jwtService = moduleFixture.get(JwtService);

    const adminEmail = `${TEST_PREFIX.toLowerCase()}_admin@test.com`;
    const memberEmail = `${TEST_PREFIX.toLowerCase()}_member@test.com`;

    for (const email of [adminEmail, memberEmail]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.demandMatch.deleteMany({
      where: { demand: { title: { startsWith: TEST_PREFIX } } },
    });
    await prisma.demandParameter.deleteMany({
      where: { demand: { title: { startsWith: TEST_PREFIX } } },
    });
    await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    const org = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org`, type: 'ENTERPRISE' },
    });
    orgId = org.id;

    const adminHash = await bcrypt.hash('test123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminHash,
        name: `${TEST_PREFIX} Admin`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId: admin.id, role: 'ADMIN' },
    });
    adminToken = jwtService.sign({
      sub: admin.id,
      email: adminEmail,
      name: admin.name,
      organizationId: orgId,
    });

    const memberHash = await bcrypt.hash('test123', 10);
    const member = await prisma.user.create({
      data: {
        email: memberEmail,
        passwordHash: memberHash,
        name: `${TEST_PREFIX} Member`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    memberId = member.id;
    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId: member.id, role: 'MEMBER' },
    });
    memberToken = jwtService.sign({
      sub: member.id,
      email: memberEmail,
      name: member.name,
      organizationId: orgId,
    });

    const demand = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX}_Demand`,
        description: 'Test demand',
        organizationId: orgId,
        createdBy: memberId,
        status: 'DRAFT',
      },
    });
    demandId = demand.id;
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.workflowEvent.deleteMany({
        where: { operator: { email: { startsWith: TEST_PREFIX.toLowerCase() } } },
      });
      await prisma.organizationMember.deleteMany({
        where: { organization: { name: { startsWith: TEST_PREFIX } } },
      });
      await prisma.demandMatch.deleteMany({
        where: { demand: { title: { startsWith: TEST_PREFIX } } },
      });
      await prisma.demandParameter.deleteMany({
        where: { demand: { title: { startsWith: TEST_PREFIX } } },
      });
      await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.user.deleteMany({
        where: { email: { startsWith: TEST_PREFIX.toLowerCase() } },
      });
      await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  describe('Admin Demand Override', () => {
    it('PATCH /admin/demands/:id should return 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/demands/${demandId}`)
        .send({ title: 'Hacked' });
      expect(res.status).toBe(401);
    });

    it('PATCH /admin/demands/:id should return 403 for MEMBER (even owner)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/demands/${demandId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ title: 'MemberUpdate' });
      expect(res.status).toBe(403);
    });

    it('PATCH /admin/demands/:id should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/admin/demands/${demandId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: `${TEST_PREFIX}_AdminUpdated` });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(`${TEST_PREFIX}_AdminUpdated`);
    });

    it('PATCH /admin/demands/:id should return 404 for non-existent demand', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/admin/demands/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Ghost' });
      expect(res.status).toBe(404);
    });
  });
});