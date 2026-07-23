import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.5.3 RFQ Core E2E Test
 *
 * Covers:
 *   1. Create RFQ
 *   2. Query RFQ
 *   3. Organization isolation
 *   4. Permission validation
 */
describe('RFQ Core E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_RFQ';

  let org1Id: string;
  let org2Id: string;
  let org1UserId: string;
  let org1Token: string;
  let org2UserId: string;
  let org2Token: string;
  let demandId: string;
  let demand2Id: string;
  let rfqId: string;

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
    const org1Email = `${TEST_PREFIX.toLowerCase()}_o1@test.com`;
    const org2Email = `${TEST_PREFIX.toLowerCase()}_o2@test.com`;

    // Clean related RFQ data first (demands ref users, so delete them before users)
    for (const email of [org1Email, org2Email]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
      }
    }
    await prisma.rFQResponse.deleteMany({
      where: { rfq: { demand: { title: { startsWith: TEST_PREFIX } } } },
    });
    await prisma.demandMatch.deleteMany({
      where: { demand: { title: { startsWith: TEST_PREFIX } } },
    });
    await prisma.rFQ.deleteMany({
      where: { demand: { title: { startsWith: TEST_PREFIX } } },
    });
    await prisma.demandParameter.deleteMany({
      where: { demand: { title: { startsWith: TEST_PREFIX } } },
    });
    await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });

    for (const email of [org1Email, org2Email]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // ── Create Organizations ───────────────────────────────────
    const org1 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org1`, type: 'ENTERPRISE' },
    });
    org1Id = org1.id;

    const org2 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org2`, type: 'ENTERPRISE' },
    });
    org2Id = org2.id;

    // ── Create Org1 user ───────────────────────────────────────
    const hash1 = await bcrypt.hash('test123', 10);
    const u1 = await prisma.user.create({
      data: {
        email: org1Email,
        passwordHash: hash1,
        name: `${TEST_PREFIX} Org1User`,
        organizationId: org1Id,
        status: 'ACTIVE',
      },
    });
    org1UserId = u1.id;
    await prisma.organizationMember.create({
      data: { organizationId: org1Id, userId: org1UserId, role: 'MEMBER' },
    });
    org1Token = jwtService.sign({
      sub: org1UserId,
      email: org1Email,
      name: u1.name,
      organizationId: org1Id,
    });

    // ── Create Org2 user ───────────────────────────────────────
    const hash2 = await bcrypt.hash('test123', 10);
    const u2 = await prisma.user.create({
      data: {
        email: org2Email,
        passwordHash: hash2,
        name: `${TEST_PREFIX} Org2User`,
        organizationId: org2Id,
        status: 'ACTIVE',
      },
    });
    org2UserId = u2.id;
    await prisma.organizationMember.create({
      data: { organizationId: org2Id, userId: org2UserId, role: 'MEMBER' },
    });
    org2Token = jwtService.sign({
      sub: org2UserId,
      email: org2Email,
      name: u2.name,
      organizationId: org2Id,
    });

    // ── Create Demand for Org1 ─────────────────────────────────
    const demand = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX}_Demand`,
        description: 'Test demand for RFQ',
        organizationId: org1Id,
        createdBy: org1UserId,
        status: 'PUBLISHED',
      },
    });
    demandId = demand.id;

    // ── Create second Demand for RFQ create test ────────────────
    const demand2 = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX}_Demand2`,
        description: 'Second demand for RFQ create test',
        organizationId: org1Id,
        createdBy: org1UserId,
        status: 'PUBLISHED',
      },
    });
    demand2Id = demand2.id;

    // ── Create initial RFQ ─────────────────────────────────────
    const rfq = await prisma.rFQ.create({
      data: {
        demandId,
        createdBy: org1UserId,
        status: 'DRAFT',
      },
    });
    rfqId = rfq.id;
  }, 30000);

  afterAll(async () => {
    try {
      for (const uid of [org1UserId, org2UserId]) {
        if (uid) {
          await prisma.workflowEvent.deleteMany({ where: { operatorId: uid } });
          await prisma.organizationMember.deleteMany({ where: { userId: uid } });
        }
      }
      await prisma.rFQResponse.deleteMany({
        where: { rfq: { demand: { title: { startsWith: TEST_PREFIX } } } },
      });
      await prisma.demandMatch.deleteMany({
        where: { demand: { title: { startsWith: TEST_PREFIX } } },
      });
      await prisma.rFQ.deleteMany({
        where: { demand: { title: { startsWith: TEST_PREFIX } } },
      });
      await prisma.demandParameter.deleteMany({
        where: { demand: { title: { startsWith: TEST_PREFIX } } },
      });
      await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.user.deleteMany({ where: { id: { in: [org1UserId, org2UserId].filter(Boolean) } } });
      await prisma.organization.deleteMany({ where: { id: { in: [org1Id, org2Id].filter(Boolean) } } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Create RFQ
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Create RFQ', () => {
    it('POST /rfqs should return 201 for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/rfqs')
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ demandId: demand2Id });
      expect(res.status).toBe(201);
      expect(res.body.data.demandId).toBe(demand2Id);
    });

    it('POST /rfqs should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/rfqs')
        .send({ demandId });
      expect(res.status).toBe(401);
    });

    it('POST /rfqs should return 400 for missing demandId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/rfqs')
        .set('Authorization', `Bearer ${org1Token}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Query RFQ
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Query RFQ', () => {
    it('GET /rfqs should return 200 without auth (public read)', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/rfqs');
      expect(res.status).toBe(200);
    });

    it('GET /rfqs/:id should return 200 without auth', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/rfqs/${rfqId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(rfqId);
    });

    it('GET /rfqs/:id should return 404 for non-existent', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/rfqs/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Organization isolation
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Organization isolation', () => {
    it('PATCH /rfqs/:id should return 400 for cross-org update', async () => {
      // Org2 user trying to update Org1's RFQ
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/rfqs/${rfqId}`)
        .set('Authorization', `Bearer ${org2Token}`)
        .send({ status: 'OPEN' });
      expect(res.status).toBe(400);
    });

    it('PATCH /rfqs/:id should return 200 for same-org update', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/rfqs/${rfqId}`)
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ status: 'OPEN' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('OPEN');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Permission validation
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Permission validation', () => {
    it('PATCH /rfqs/:id should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/rfqs/${rfqId}`)
        .send({ status: 'DRAFT' });
      expect(res.status).toBe(401);
    });

    it('PATCH /rfqs/:id with invalid status transition should return 400', async () => {
      // CLOSED RFQ cannot transition (already OPEN → CLOSED not possible without OPEN first)
      // Try illegal transition: OPEN → DRAFT
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/rfqs/${rfqId}`)
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ status: 'DRAFT' });
      expect(res.status).toBe(400);
    });
  });
});