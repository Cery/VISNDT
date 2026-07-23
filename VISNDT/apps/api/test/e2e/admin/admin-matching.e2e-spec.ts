import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.6 Admin Matching Stats E2E Test
 *
 * Covers:
 *   1. No token → 401
 *   2. MEMBER → 403
 *   3. ADMIN → 200 with stats fields
 */
describe('Admin Matching Stats E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_ADM_MATCH';

  let orgId: string;
  let adminToken: string;
  let memberToken: string;

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
    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId: member.id, role: 'MEMBER' },
    });
    memberToken = jwtService.sign({
      sub: member.id,
      email: memberEmail,
      name: member.name,
      organizationId: orgId,
    });
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.workflowEvent.deleteMany({
        where: { operator: { email: { startsWith: TEST_PREFIX.toLowerCase() } } },
      });
      await prisma.organizationMember.deleteMany({
        where: { organization: { name: { startsWith: TEST_PREFIX } } },
      });
      await prisma.user.deleteMany({
        where: { email: { startsWith: TEST_PREFIX.toLowerCase() } },
      });
      await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  describe('Admin Matching Stats', () => {
    it('GET /admin/matching/stats should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/admin/matching/stats');
      expect(res.status).toBe(401);
    });

    it('GET /admin/matching/stats should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/matching/stats')
        .set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(403);
    });

    it('GET /admin/matching/stats should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/admin/matching/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('totalMatches');
      expect(res.body.data).toHaveProperty('averageScore');
      expect(res.body.data).toHaveProperty('hardFailCount');
      expect(res.body.data).toHaveProperty('rematchCount');
    });
  });
});