import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.5.2 Organizations Controller Security E2E Test
 *
 * Tests JWT guard + ownership isolation + ADMIN control on Organizations endpoints:
 *   1. Unauthenticated → 401 on all endpoints
 *   2. Authenticated MEMBER → can view own org, cannot view other orgs
 *   3. Cross-organization access → 403 Forbidden
 *   4. ADMIN → can list all orgs, create, update
 *   5. Non-admin → cannot create or update orgs
 */
describe('Organizations Controller Security E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_ORG';

  let org1Id: string;
  let org2Id: string;
  let adminId: string;
  let adminToken: string;
  let member1Id: string;
  let member1Token: string;
  let member2Id: string;
  let member2Token: string;

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
    const member1Email = `${TEST_PREFIX.toLowerCase()}_m1@test.com`;
    const member2Email = `${TEST_PREFIX.toLowerCase()}_m2@test.com`;

    for (const email of [adminEmail, member1Email, member2Email]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // ── Create Organization 1 ──────────────────────────────────
    const org1 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org1`, type: 'ENTERPRISE' },
    });
    org1Id = org1.id;

    // ── Create Organization 2 ──────────────────────────────────
    const org2 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org2`, type: 'SUPPLIER' },
    });
    org2Id = org2.id;

    // ── Create ADMIN user (in org1) ────────────────────────────
    const adminHash = await bcrypt.hash('test123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminHash,
        name: `${TEST_PREFIX} Admin`,
        organizationId: org1Id,
        status: 'ACTIVE',
      },
    });
    adminId = admin.id;
    await prisma.organizationMember.create({
      data: { organizationId: org1Id, userId: adminId, role: 'ADMIN' },
    });
    adminToken = jwtService.sign({
      sub: adminId,
      email: adminEmail,
      name: admin.name,
      organizationId: org1Id,
    });

    // ── Create MEMBER1 user (in org1) ──────────────────────────
    const member1Hash = await bcrypt.hash('test123', 10);
    const member1 = await prisma.user.create({
      data: {
        email: member1Email,
        passwordHash: member1Hash,
        name: `${TEST_PREFIX} Member1`,
        organizationId: org1Id,
        status: 'ACTIVE',
      },
    });
    member1Id = member1.id;
    await prisma.organizationMember.create({
      data: { organizationId: org1Id, userId: member1Id, role: 'MEMBER' },
    });
    member1Token = jwtService.sign({
      sub: member1Id,
      email: member1Email,
      name: member1.name,
      organizationId: org1Id,
    });

    // ── Create MEMBER2 user (in org2) ──────────────────────────
    const member2Hash = await bcrypt.hash('test123', 10);
    const member2 = await prisma.user.create({
      data: {
        email: member2Email,
        passwordHash: member2Hash,
        name: `${TEST_PREFIX} Member2`,
        organizationId: org2Id,
        status: 'ACTIVE',
      },
    });
    member2Id = member2.id;
    await prisma.organizationMember.create({
      data: { organizationId: org2Id, userId: member2Id, role: 'MEMBER' },
    });
    member2Token = jwtService.sign({
      sub: member2Id,
      email: member2Email,
      name: member2.name,
      organizationId: org2Id,
    });
  }, 30000);

  afterAll(async () => {
    try {
      for (const uid of [adminId, member1Id, member2Id]) {
        if (uid) {
          await prisma.workflowEvent.deleteMany({ where: { operatorId: uid } });
          await prisma.organizationMember.deleteMany({ where: { userId: uid } });
        }
      }
      await prisma.user.deleteMany({ where: { id: { in: [adminId, member1Id, member2Id].filter(Boolean) } } });
      await prisma.organization.deleteMany({ where: { id: { in: [org1Id, org2Id].filter(Boolean) } } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Unauthenticated → 401
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Unauthenticated requests', () => {
    it('GET /organizations should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/organizations');
      expect(res.status).toBe(401);
    });

    it('GET /organizations/:id should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/organizations/${org1Id}`);
      expect(res.status).toBe(401);
    });

    it('POST /organizations should return 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/organizations')
        .send({ name: 'Hacked Org', type: 'ENTERPRISE' });
      expect(res.status).toBe(401);
    });

    it('PATCH /organizations/:id should return 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/organizations/${org1Id}`)
        .send({ name: 'Hacked' });
      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Authenticated MEMBER — own org
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Authenticated MEMBER — own organization', () => {
    it('GET /organizations/:id (own org) should return 200', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/organizations/${org1Id}`)
        .set('Authorization', `Bearer ${member1Token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(org1Id);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Cross-organization access → 403
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Cross-organization access rejected', () => {
    it('GET /organizations/:id (other org) should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/organizations/${org2Id}`)
        .set('Authorization', `Bearer ${member1Token}`);
      expect(res.status).toBe(403);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: ADMIN access
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: ADMIN access', () => {
    it('GET /organizations should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/organizations')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(2);
    });

    it('GET /organizations/:id (any org) should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/organizations/${org2Id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('POST /organizations should return 201 for ADMIN', async () => {
      const uniqueName = `${TEST_PREFIX}_Created_${Date.now()}`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: uniqueName, type: 'ENTERPRISE' });
      expect(res.status).toBe(201);

      // Cleanup created org
      await prisma.organization.deleteMany({ where: { name: uniqueName } });
    });

    it('PATCH /organizations/:id should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/organizations/${org1Id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: `${TEST_PREFIX}_Org1_Updated` });
      expect(res.status).toBe(200);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 5: Non-admin restricted operations
  // ═══════════════════════════════════════════════════════════

  describe('Case 5: Non-admin restricted operations', () => {
    it('GET /organizations should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/organizations')
        .set('Authorization', `Bearer ${member1Token}`);
      expect(res.status).toBe(403);
    });

    it('POST /organizations should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${member1Token}`)
        .send({ name: 'Unauthorized Org', type: 'ENTERPRISE' });
      expect(res.status).toBe(403);
    });

    it('PATCH /organizations/:id should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/organizations/${org1Id}`)
        .set('Authorization', `Bearer ${member1Token}`)
        .send({ name: 'Hack Attempt' });
      expect(res.status).toBe(403);
    });
  });
});