import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.5.3 Product Core E2E Test
 *
 * Covers:
 *   1. Public product listing and detail
 *   2. ADMIN create / update product
 *   3. MEMBER cannot create / update product
 *   4. Category relation validation
 *   5. Search with keyword
 */
describe('Product Core E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_PROD';

  let orgId: string;
  let adminId: string;
  let adminToken: string;
  let memberId: string;
  let memberToken: string;
  let categoryId: string;
  let productId: string;

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

    for (const email of [adminEmail, memberEmail]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existing.id } });
        await prisma.organizationMember.deleteMany({ where: { userId: existing.id } });
        await prisma.user.deleteMany({ where: { id: existing.id } });
      }
    }
    await prisma.productParameterValue.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
    await prisma.productParameterDefinition.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
    await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.productCategory.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
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

    // ── Create Category ────────────────────────────────────────
    const cat = await prisma.productCategory.create({
      data: { name: `${TEST_PREFIX}_Category`, slug: `${TEST_PREFIX.toLowerCase()}_cat` },
    });
    categoryId = cat.id;

    // ── Create Product ─────────────────────────────────────────
    const product = await prisma.product.create({
      data: {
        categoryId,
        name: `${TEST_PREFIX}_Widget`,
        model: `${TEST_PREFIX}-100`,
        description: 'A test widget',
        status: 'ACTIVE',
      },
    });
    productId = product.id;
  }, 30000);

  afterAll(async () => {
    try {
      for (const uid of [adminId, memberId]) {
        if (uid) {
          await prisma.workflowEvent.deleteMany({ where: { operatorId: uid } });
          await prisma.organizationMember.deleteMany({ where: { userId: uid } });
        }
      }
      await prisma.user.deleteMany({ where: { id: { in: [adminId, memberId].filter(Boolean) } } });
      await prisma.productParameterValue.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
      await prisma.productParameterDefinition.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
      await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
      await prisma.productCategory.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
      await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Public product listing and detail
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Public product access', () => {
    it('GET /products should return 200 without auth', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
    });

    it('GET /products/:id should return 200 without auth', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/products/${productId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(productId);
      expect(res.body.data.name).toContain(TEST_PREFIX);
    });

    it('GET /products/:id should return 404 for non-existent product', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Product search
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Product search', () => {
    it('GET /products?keyword= should filter by name', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/products?keyword=${TEST_PREFIX}_Widget`);
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
    });

    it('GET /products?keyword= should return empty for unknown keyword', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products?keyword=ZZZ_NONEXISTENT_999');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(0);
    });

    it('GET /products?categoryId= should filter by category', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/products?categoryId=${categoryId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
    });

    it('GET /products?status= should filter by status', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products?status=ACTIVE');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: ADMIN create product
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: ADMIN create product', () => {
    it('POST /products should return 201 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          categoryId,
          name: `${TEST_PREFIX}_Created`,
          model: `${TEST_PREFIX}-200`,
          description: 'Admin-created product',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(`${TEST_PREFIX}_Created`);
    });

    it('POST /products should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send({ categoryId, name: 'NoAuth', model: 'X' });
      expect(res.status).toBe(401);
    });

    it('POST /products should return 500 for invalid categoryId format', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ categoryId: 'invalid-uuid', name: 'BadCat' });
      expect(res.status).toBe(500);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: MEMBER permission behavior
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: MEMBER permission behavior', () => {
    it('POST /products should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ categoryId, name: 'MemberProduct', model: 'M-1' });
      expect(res.status).toBe(403);
    });

    it('PATCH /products/:id should return 403 for MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ name: 'Hacked' });
      expect(res.status).toBe(403);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 5: ADMIN update product
  // ═══════════════════════════════════════════════════════════

  describe('Case 5: ADMIN update product', () => {
    it('PATCH /products/:id should return 200 for ADMIN', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: `${TEST_PREFIX}_Widget_Updated` });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(`${TEST_PREFIX}_Widget_Updated`);
    });

    it('PATCH /products/:id should return 401 without auth', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/products/${productId}`)
        .send({ name: 'NoAuth' });
      expect(res.status).toBe(401);
    });

    it('PATCH /products/:id should return 404 for non-existent product', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Ghost' });
      expect(res.status).toBe(404);
    });
  });
});