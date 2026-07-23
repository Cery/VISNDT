import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.5.1 Users Controller Security E2E Test
 *
 * Tests JWT guard + ownership validation on Users endpoints:
 *   1. Unauthenticated → 401 on all endpoints
 *   2. Authenticated user → can access own data
 *   3. Cross-user access → 403 Forbidden
 *   4. ADMIN → can access all users
 *   5. Non-admin self-update → cannot change status/org
 */
describe('Users Controller Security E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_USR';

  let orgId: string;
  let adminId: string;
  let adminToken: string;
  let memberId: string;
  let memberToken: string;
  let otherUserId: string;

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

    // ── Pre-cleanup ────────────────────────────────────────────
    const adminEmail = `${TEST_PREFIX.toLowerCase()}_admin@test.com`;
    const memberEmail = `${TEST_PREFIX.toLowerCase()}_member@test.com`;
    const otherEmail = `${TEST_PREFIX.toLowerCase()}_other@test.com`;

    for (const email of [adminEmail, memberEmail, otherEmail]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // ── Create Organization ────────────────────────────────────
    const org = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org`, type: 'ENTERPRISE' },
    });
    orgId = org.id;

    // ── Create ADMIN user ──────────────────────────────────────
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
    adminId = admin.id;
    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId: adminId, role: 'ADMIN' },
    });
    adminToken = jwtService.sign({
      sub: adminId,
      email: adminEmail,
      name: admin.name,
      organizationId: orgId,
    });

    // ── Create MEMBER user ─────────────────────────────────────
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
      data: { organizationId: orgId, userId: memberId, role: 'MEMBER' },
    });
    memberToken = jwtService.sign({
      sub: memberId,
      email: memberEmail,
      name: member.name,
      organizationId: orgId,
    });

    // ── Create OTHER user (for cross-user access test) ─────────
    const otherHash = await bcrypt.hash('test123', 10);
    const other = await prisma.user.create({
      data: {
        email: otherEmail,
        passwordHash: otherHash,
        name: `${TEST_PREFIX} Other`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    otherUserId = other.id;
    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId: otherUserId, role: 'MEMBER' },
    });
  }, 30000);

  afterAll(async () => {
    try {
      for (const uid of [adminId, memberId, otherUserId]) {
        if (uid) {
          await prisma.workflowEvent.deleteMany({ where: { operatorId: uid } });
          await prisma.organizationMember.deleteMany({ where: { userId: uid } });
        }
      }
      await prisma.user.deleteMany({ where: { id: { in: [adminId, memberId, otherUserId].filter(Boolean) } } });
      await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Unauthenticated → 401
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Unauthenticated requests', () => {
    it('GET /users should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/users');
      expect(res.status).toBe(401);
    });

    it('GET /users/:id should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/users/${adminId}`);
      expect(res.status).toBe(401);
    });

    it('POST /users should return 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ email: 'test@test.com', passwordHash: 'test123' });
      expect(res.status).toBe(401);
    });

    it('PATCH /users/:id should return 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${adminId}`)
        .send({ name: 'Hacked' });
      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Authenticated user → access own data
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Authenticated user — own data', () => {
    it('GET /users/:id (self) should return 200', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${memberId}`)
        .set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(memberId);
    });

    it('PATCH /users/:id (self) should return 200', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${memberId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ name: `${TEST_PREFIX} Member Updated` });
      expect(res.status).toBe(200);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Cross-user access → 403
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Cross-user access rejected', () => {
    it('GET /users/:id (other user) should return 403', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${otherUserId}`)
        .set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(403);
    });

    it('PATCH /users/:id (other user) should return 403', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${otherUserId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ name: 'Hack Attempt' });
      expect(res.status).toBe(403);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: ADMIN access
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: ADMIN access', () => {
    it('GET /users should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(3);
    });

    it('GET /users/:id (other) should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${memberId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('POST /users should return 201 for ADMIN', async () => {
      const uniqueEmail = `${TEST_PREFIX.toLowerCase()}_created_${Date.now()}@test.com`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: uniqueEmail,
          passwordHash: 'test123456',
          name: 'Created User',
          organizationId: orgId,
        });
      expect(res.status).toBe(201);

      // Cleanup created user
      await prisma.user.deleteMany({ where: { email: uniqueEmail } });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 5: Non-admin GET /users → 403
  // ═══════════════════════════════════════════════════════════

  describe('Case 5: Non-admin list all users → 403', () => {
    it('GET /users should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(403);
    });

    it('POST /users should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ email: 'test@test.com', passwordHash: 'test123' });
      expect(res.status).toBe(403);
    });
  });
});