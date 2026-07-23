import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DemandStatus, DemandMatchStatus, ParameterDataType } from '@prisma/client';

/**
 * M8.3.2 Manual Rematch E2E Test
 *
 * Tests the manual rematch endpoint:
 *   1. Normal rematch — delete old matches, re-run matching, get new results
 *   2. Repeat execution — no duplicate records
 *   3. Permission 403 — unauthorized user
 *   4. Non-existent Demand 404
 */
describe('Manual Rematch E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_RM';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let user2Id: string; // Another org user for permission test
  let token: string;
  let otherToken: string; // Token for another org user
  let categoryId: string;
  let pdId: string; // Parameter definition

  // ── Setup ───────────────────────────────────────────────────

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
    const existingUser = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` },
    });
    if (existingUser) {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser.id } });
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser.id } });
    }
    const existingUser2 = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}2@test.com` },
    });
    if (existingUser2) {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser2.id } });
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser2.id } });
    }
    await prisma.user.deleteMany({
      where: { email: { in: [`${TEST_PREFIX.toLowerCase()}@test.com`, `${TEST_PREFIX.toLowerCase()}2@test.com`] } },
    });

    // Cleanup by prefix
    await prisma.demandMatch.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
    await prisma.demandParameter.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
    await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
    await prisma.offer.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
    await prisma.productParameterValue.deleteMany({
      where: { product: { name: { startsWith: TEST_PREFIX } } },
    });
    await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.parameterDefinition.deleteMany({ where: { code: { startsWith: TEST_PREFIX.toLowerCase() } } });
    await prisma.parameterGroup.deleteMany({ where: { code: { startsWith: TEST_PREFIX.toLowerCase() } } });
    await prisma.productCategory.deleteMany({
      where: { slug: { startsWith: TEST_PREFIX.toLowerCase() } },
    });

    // ── Create Organization ────────────────────────────────────
    const org = await prisma.organization.create({
      data: {
        name: `${TEST_PREFIX}_SupplierOrg`,
        type: 'supplier',
      },
    });
    orgId = org.id;

    // ── Create another org for permission test ─────────────────
    const otherOrg = await prisma.organization.create({
      data: {
        name: `${TEST_PREFIX}_OtherOrg`,
        type: 'supplier',
      },
    });

    // ── Create Users ───────────────────────────────────────────
    const email = `${TEST_PREFIX.toLowerCase()}@test.com`;
    const passwordHash = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: `${TEST_PREFIX} User`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    userId = user.id;

    token = jwtService.sign({
      sub: userId,
      email,
      name: user.name,
      organizationId: orgId,
    });

    // Other org user (for permission test)
    const otherEmail = `${TEST_PREFIX.toLowerCase()}2@test.com`;
    const otherPwHash = await bcrypt.hash('test123', 10);
    const otherUser = await prisma.user.create({
      data: {
        email: otherEmail,
        passwordHash: otherPwHash,
        name: `${TEST_PREFIX} OtherUser`,
        organizationId: otherOrg.id,
        status: 'ACTIVE',
      },
    });
    user2Id = otherUser.id;

    otherToken = jwtService.sign({
      sub: user2Id,
      email: otherEmail,
      name: otherUser.name,
      organizationId: otherOrg.id,
    });

    // ── Create Category ────────────────────────────────────────
    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_cat`,
      },
    });
    categoryId = category.id;

    // ── Create Parameter Group & Definition ────────────────────
    const pg = await prisma.parameterGroup.create({
      data: {
        name: `${TEST_PREFIX} ParamGroup`,
        code: `${TEST_PREFIX.toLowerCase()}_pg`,
      },
    });

    const pd = await prisma.parameterDefinition.create({
      data: {
        name: '镜头视向',
        code: `${TEST_PREFIX.toLowerCase()}_lens`,
        dataType: ParameterDataType.ENUM,
        parameterGroupId: pg.id,
      },
    });
    pdId = pd.id;
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.demandMatch.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demandParameter.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.offer.deleteMany({ where: { product: { name: { startsWith: TEST_PREFIX } } } });
      await prisma.productParameterValue.deleteMany({
        where: { product: { name: { startsWith: TEST_PREFIX } } },
      });
      await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
      await prisma.parameterDefinition.deleteMany({ where: { code: { startsWith: TEST_PREFIX.toLowerCase() } } });
      await prisma.parameterGroup.deleteMany({ where: { code: { startsWith: TEST_PREFIX.toLowerCase() } } });
      await prisma.productCategory.deleteMany({
        where: { slug: { startsWith: TEST_PREFIX.toLowerCase() } },
      });
      if (userId) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: userId } });
        await prisma.organizationMember.deleteMany({ where: { userId } });
        await prisma.user.deleteMany({ where: { id: userId } });
      }
      if (user2Id) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: user2Id } });
        await prisma.organizationMember.deleteMany({ where: { userId: user2Id } });
        await prisma.user.deleteMany({ where: { id: user2Id } });
      }
      if (orgId) await prisma.organization.deleteMany({ where: { id: orgId } });
      // Clean up other org
      await prisma.organization.deleteMany({ where: { name: `${TEST_PREFIX}_OtherOrg` } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ── Helpers ─────────────────────────────────────────────────

  async function createProductWithParam(name: string, paramValue: string): Promise<string> {
    const product = await prisma.product.create({
      data: {
        name,
        status: 'ACTIVE',
        categoryId,
        parameterValues: {
          create: [{ parameterDefinitionId: pdId, value: paramValue }],
        },
      },
    });
    await prisma.offer.create({
      data: {
        title: `${name} Offer`,
        organizationId: orgId,
        productId: product.id,
        status: 'ACTIVE',
      },
    });
    return product.id;
  }

  async function createDemand(title: string, paramValue: string): Promise<string> {
    const demand = await prisma.demand.create({
      data: {
        title,
        organizationId: orgId,
        createdBy: userId,
        status: DemandStatus.DRAFT,
        contactName: 'Test',
        contactPhone: '13800000000',
        contactEmail: 'test@test.com',
        parameters: {
          create: [
            {
              parameterDefinitionId: pdId,
              value: paramValue,
              required: true,
              priority: 3,
            },
          ],
        },
      },
    });
    return demand.id;
  }

  // ═══════════════════════════════════════════════════════════
  // Test 1: Normal Rematch
  // ═══════════════════════════════════════════════════════════

  describe('Test 1: Normal Rematch', () => {
    let demandId: string;

    beforeAll(async () => {
      // Create product
      await createProductWithParam(`${TEST_PREFIX}_Product_Rematch1`, '直视');

      // Create demand
      demandId = await createDemand(`${TEST_PREFIX}_Demand_Rematch1`, '直视');
    });

    it('should complete rematch successfully', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/rematch`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Rematch completed');
      expect(res.body.data.demandId).toBe(demandId);
      expect(res.body.data.matched).toBeGreaterThanOrEqual(0);
      expect(res.body.data.totalCandidates).toBeGreaterThanOrEqual(0);

      // Verify matches exist
      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 2: Repeat Execution — No Duplicates
  // ═══════════════════════════════════════════════════════════

  describe('Test 2: Repeat Execution — No Duplicates', () => {
    let demandId: string;

    beforeAll(async () => {
      await createProductWithParam(`${TEST_PREFIX}_Product_Rematch2`, '直视');
      demandId = await createDemand(`${TEST_PREFIX}_Demand_Rematch2`, '直视');
    });

    it('should produce consistent match count on repeated rematch', async () => {
      // First rematch
      const res1 = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/rematch`)
        .set('Authorization', `Bearer ${token}`);
      expect(res1.status).toBe(201);

      const count1 = await prisma.demandMatch.count({ where: { demandId } });
      expect(count1).toBeGreaterThan(0);

      // Second rematch — should delete old and re-create same count
      const res2 = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/rematch`)
        .set('Authorization', `Bearer ${token}`);
      expect(res2.status).toBe(201);

      const count2 = await prisma.demandMatch.count({ where: { demandId } });
      expect(count2).toBe(count1);

      // Third rematch
      const res3 = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/rematch`)
        .set('Authorization', `Bearer ${token}`);
      expect(res3.status).toBe(201);

      const count3 = await prisma.demandMatch.count({ where: { demandId } });
      expect(count3).toBe(count1);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 3: Permission 403 — Unauthorized User
  // ═══════════════════════════════════════════════════════════

  describe('Test 3: Permission 403', () => {
    let demandId: string;

    beforeAll(async () => {
      await createProductWithParam(`${TEST_PREFIX}_Product_Rematch3`, '直视');
      demandId = await createDemand(`${TEST_PREFIX}_Demand_Rematch3`, '直视');
    });

    it('should reject rematch from different organization user', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/rematch`)
        .set('Authorization', `Bearer ${otherToken}`);

      // validateDemandOwnership throws BadRequestException (400) or ForbiddenException (403)
      expect([400, 403]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 4: Non-existent Demand 404
  // ═══════════════════════════════════════════════════════════

  describe('Test 4: Non-existent Demand 404', () => {
    it('should return 404 for non-existent demand', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${fakeId}/rematch`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});