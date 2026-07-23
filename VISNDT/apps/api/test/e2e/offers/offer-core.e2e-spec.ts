import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.5.3 Offer Core E2E Test
 *
 * Covers:
 *   1. Authentication requirements
 *   2. Create offer
 *   3. Query offers
 *   4. Permission / organization isolation
 */
describe('Offer Core E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_OFFER';

  let org1Id: string;
  let org2Id: string;
  let org1UserId: string;
  let org1Token: string;
  let org2UserId: string;
  let org2Token: string;
  let productId: string;
  let product2Id: string;
  let categoryId: string;
  let offerId: string;

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

    for (const email of [org1Email, org2Email]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.offer.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
    await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.productCategory.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // ── Create Organizations ───────────────────────────────────
    const org1 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org1`, type: 'ENTERPRISE' },
    });
    org1Id = org1.id;

    const org2 = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org2`, type: 'SUPPLIER' },
    });
    org2Id = org2.id;

    // ── Create Category & Product ──────────────────────────────
    const cat = await prisma.productCategory.create({
      data: { name: `${TEST_PREFIX}_Cat`, slug: `${TEST_PREFIX.toLowerCase()}_cat` },
    });
    categoryId = cat.id;

    const product = await prisma.product.create({
      data: {
        categoryId,
        name: `${TEST_PREFIX}_Product`,
        model: `${TEST_PREFIX}-M1`,
        description: 'Test product for offer',
        status: 'ACTIVE',
      },
    });
    productId = product.id;

    const product2 = await prisma.product.create({
      data: {
        categoryId,
        name: `${TEST_PREFIX}_Product2`,
        model: `${TEST_PREFIX}-M2`,
        description: 'Second product for offer create test',
        status: 'ACTIVE',
      },
    });
    product2Id = product2.id;

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

    // ── Create an initial offer for Org1 ───────────────────────
    const offer = await prisma.offer.create({
      data: {
        organizationId: org1Id,
        productId,
        title: `${TEST_PREFIX}_Initial`,
        description: 'Initial offer',
        status: 'ACTIVE',
      },
    });
    offerId = offer.id;
  }, 30000);

  afterAll(async () => {
    try {
      for (const uid of [org1UserId, org2UserId]) {
        if (uid) {
          await prisma.workflowEvent.deleteMany({ where: { operatorId: uid } });
          await prisma.organizationMember.deleteMany({ where: { userId: uid } });
        }
      }
      await prisma.user.deleteMany({ where: { id: { in: [org1UserId, org2UserId].filter(Boolean) } } });
      await prisma.offer.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
      await prisma.productCategory.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
      await prisma.organization.deleteMany({ where: { id: { in: [org1Id, org2Id].filter(Boolean) } } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Authentication
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Authentication', () => {
    it('GET /offers should return 200 without auth (public read)', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/offers');
      expect(res.status).toBe(200);
    });

    it('GET /offers/:id should return 200 without auth (public read)', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/offers/${offerId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(offerId);
    });

    it('POST /offers should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/offers')
        .send({ productId, title: 'NoAuth' });
      expect(res.status).toBe(401);
    });

    it('PATCH /offers/:id should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/offers/${offerId}`)
        .send({ title: 'Hacked' });
      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Create offer
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Create offer', () => {
    it('POST /offers should return 201 for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/offers')
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ productId: product2Id, title: `${TEST_PREFIX}_NewOffer`, description: 'A new offer' });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe(`${TEST_PREFIX}_NewOffer`);
      expect(res.body.data.organizationId).toBe(org1Id);
    });

    it('POST /offers should return 400 for missing productId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/offers')
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ title: 'MissingProduct' });
      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Query offers
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Query offers', () => {
    it('GET /offers should return paginated results', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/offers?page=1&pageSize=5');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('page');
    });

    it('GET /offers/:id should return 404 for non-existent', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/offers/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Permission / organization isolation
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Organization isolation', () => {
    it('PATCH /offers/:id should return 404 for cross-org update', async () => {
      // Org2 user trying to update Org1's offer
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/offers/${offerId}`)
        .set('Authorization', `Bearer ${org2Token}`)
        .send({ title: 'CrossOrgHack' });
      expect(res.status).toBe(404);
    });

    it('PATCH /offers/:id should return 200 for own org', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/offers/${offerId}`)
        .set('Authorization', `Bearer ${org1Token}`)
        .send({ title: `${TEST_PREFIX}_Updated` });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(`${TEST_PREFIX}_Updated`);
    });
  });
});