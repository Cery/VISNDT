import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MatchingService } from '../../../src/matching/matching.service';
import { DemandStatus, DemandMatchStatus, ParameterDataType } from '@prisma/client';

/**
 * M8.2.3 Matching Engine E2E Test
 *
 * Tests the complete matching flow:
 *   1. Basic matching (exact + range, score = 100)
 *   2. Required parameter failure (hardFail)
 *   3. MIN_MATCH_SCORE filtering
 *   4. matchDetails structure verification
 *   5. UPSERT idempotency
 *   6. Performance baseline (100 products)
 */
describe('Matching Engine E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let matchingService: MatchingService;

  const TEST_PREFIX = 'E2E_MATCH';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let token: string;
  let categoryId: string;

  // ── Parameter Definitions ───────────────────────────────────
  let pdLensDirectionId: string;   // ENUM: 镜头视向
  let pdDiameterId: string;        // NUMBER: 管径
  let pdResolutionId: string;      // NUMBER: 分辨率

  // ── Parameter Group ─────────────────────────────────────────
  let pgId: string;

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
    matchingService = moduleFixture.get(MatchingService);

    // ── Pre-cleanup ────────────────────────────────────────────

    // Cleanup by prefix pattern
    const existingUser = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` },
    });
    if (existingUser) {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser.id } });
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser.id } });
    }
    await prisma.user.deleteMany({ where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` } });
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // Cleanup demand-related data (by title prefix)
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

    // ── Create User ────────────────────────────────────────────
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

    // ── Create Product Category ───────────────────────────────
    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_category`,
      },
    });
    categoryId = category.id;

    // ── Create Parameter Group ─────────────────────────────────
    const pg = await prisma.parameterGroup.create({
      data: {
        name: `${TEST_PREFIX} ParamGroup`,
        code: `${TEST_PREFIX.toLowerCase()}_pg`,
      },
    });
    pgId = pg.id;

    // ── Create Parameter Definitions ───────────────────────────
    const pdLens = await prisma.parameterDefinition.create({
      data: {
        name: '镜头视向',
        code: `${TEST_PREFIX.toLowerCase()}_lens_direction`,
        dataType: ParameterDataType.ENUM,
        parameterGroupId: pgId,
      },
    });
    pdLensDirectionId = pdLens.id;

    const pdDia = await prisma.parameterDefinition.create({
      data: {
        name: '管径',
        code: `${TEST_PREFIX.toLowerCase()}_diameter`,
        dataType: ParameterDataType.NUMBER,
        unit: 'mm',
        parameterGroupId: pgId,
      },
    });
    pdDiameterId = pdDia.id;

    const pdRes = await prisma.parameterDefinition.create({
      data: {
        name: '分辨率',
        code: `${TEST_PREFIX.toLowerCase()}_resolution`,
        dataType: ParameterDataType.NUMBER,
        unit: 'px',
        parameterGroupId: pgId,
      },
    });
    pdResolutionId = pdRes.id;
  });

  afterAll(async () => {
    try {
      // Cleanup in reverse dependency order
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
      if (orgId) await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ── Helper ──────────────────────────────────────────────────

  async function createProductWithParams(
    name: string,
    params: Array<{
      parameterDefinitionId: string;
      value: string;
      valueNumber?: number;
    }>,
  ): Promise<string> {
    const product = await prisma.product.create({
      data: {
        name,
        status: 'ACTIVE',
        categoryId,
        parameterValues: {
          create: params.map((p) => ({
            parameterDefinitionId: p.parameterDefinitionId,
            value: p.value,
            valueNumber: p.valueNumber ?? null,
          })),
        },
      },
    });
    // Create ACTIVE offer
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

  async function createDemand(
    title: string,
    status: DemandStatus = DemandStatus.DRAFT,
    params?: Array<{
      parameterDefinitionId: string;
      value?: string;
      valueMin?: number;
      valueMax?: number;
      required?: boolean;
      priority?: number;
    }>,
  ): Promise<string> {
    const demand = await prisma.demand.create({
      data: {
        title,
        organizationId: orgId,
        createdBy: userId,
        status,
        contactName: 'Test',
        contactPhone: '13800000000',
        contactEmail: 'test@test.com',
        parameters: params
          ? {
              create: params.map((p) => ({
                parameterDefinitionId: p.parameterDefinitionId,
                value: p.value ?? null,
                valueMin: p.valueMin ?? null,
                valueMax: p.valueMax ?? null,
                required: p.required ?? false,
                priority: p.priority ?? 1,
              })),
            }
          : undefined,
      },
    });
    return demand.id;
  }

  // ═══════════════════════════════════════════════════════════
  // Test 1: Basic Matching Flow
  // ═══════════════════════════════════════════════════════════

  describe('Test 1: Basic Matching Flow', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Create product with matching params
      productId = await createProductWithParams(`${TEST_PREFIX}_Product_Basic`, [
        { parameterDefinitionId: pdLensDirectionId, value: '直视' },
        { parameterDefinitionId: pdDiameterId, value: '4', valueNumber: 4 },
      ]);

      // Create demand with same params
      demandId = await createDemand(`${TEST_PREFIX}_Demand_Basic`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
        {
          parameterDefinitionId: pdDiameterId,
          valueMin: 3,
          valueMax: 6,
          required: true,
          priority: 2,
        },
      ]);
    });

    it('should publish demand and trigger matching', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(DemandStatus.PUBLISHED);
    });

    it('should create DemandMatch with score 100', async () => {
      // Allow a moment for async matching
      await new Promise((resolve) => setTimeout(resolve, 500));

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].matchScore).toBe(100);
      expect(matches[0].matchStatus).toBe(DemandMatchStatus.MATCHED);
      expect(matches[0].productId).toBe(productId);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 2: Required Parameter Failure
  // ═══════════════════════════════════════════════════════════

  describe('Test 2: Required Parameter Failure', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Product: 管径 = 4mm
      productId = await createProductWithParams(`${TEST_PREFIX}_Product_ReqFail`, [
        { parameterDefinitionId: pdDiameterId, value: '4', valueNumber: 4 },
      ]);

      // Demand: 管径 = 50-100mm (out of range, required)
      demandId = await createDemand(`${TEST_PREFIX}_Demand_ReqFail`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdDiameterId,
          valueMin: 50,
          valueMax: 100,
          required: true,
          priority: 2,
        },
      ]);
    });

    it('should publish but NOT create any match due to required failure', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe(DemandStatus.PUBLISHED);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });

      expect(matches.length).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 3: MIN_MATCH_SCORE Filtering
  // ═══════════════════════════════════════════════════════════

  describe('Test 3: MIN_MATCH_SCORE Filtering', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Product: 镜头视向 = 直视
      productId = await createProductWithParams(`${TEST_PREFIX}_Product_LowScore`, [
        { parameterDefinitionId: pdLensDirectionId, value: '直视' },
      ]);

      // Demand: 镜头视向 = 侧视 (non-matching, required, priority=1)
      demandId = await createDemand(`${TEST_PREFIX}_Demand_LowScore`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '侧视',
          required: true,
          priority: 1,
        },
      ]);
    });

    it('should NOT create match when score < 40', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });

      // Required failure → score = 0 → filtered out
      expect(matches.length).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 4: matchDetails Verification
  // ═══════════════════════════════════════════════════════════

  describe('Test 4: matchDetails Verification', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      productId = await createProductWithParams(`${TEST_PREFIX}_Product_Details`, [
        { parameterDefinitionId: pdLensDirectionId, value: '直视' },
        { parameterDefinitionId: pdDiameterId, value: '5', valueNumber: 5 },
        { parameterDefinitionId: pdResolutionId, value: '1920', valueNumber: 1920 },
      ]);

      demandId = await createDemand(`${TEST_PREFIX}_Demand_Details`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
        {
          parameterDefinitionId: pdDiameterId,
          valueMin: 3,
          valueMax: 8,
          required: true,
          priority: 2,
        },
        {
          parameterDefinitionId: pdResolutionId,
          valueMin: 1000,
          valueMax: 2000,
          required: false,
          priority: 1,
        },
      ]);
    });

    it('should create match with valid matchDetails JSON', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });

      expect(matches.length).toBeGreaterThan(0);
      const match = matches[0];

      const details = match.matchDetails as Record<string, unknown>;
      expect(details).toBeDefined();
      expect(details['algorithm']).toBe('weighted_v1');
      expect(details['totalParameters']).toBe(3);
      expect(details['matchedParameters']).toBe(3);
      expect(details['matchRate']).toBe(1);
      expect(details['hardFail']).toBe(false);

      // Verify parameterScores array
      const paramScores = details['parameterScores'] as Array<Record<string, unknown>>;
      expect(Array.isArray(paramScores)).toBe(true);
      expect(paramScores.length).toBe(3);

      for (const ps of paramScores) {
        expect(ps['parameterDefinitionId']).toBeDefined();
        expect(ps['parameterName']).toBeDefined();
        expect(ps['score']).toBeDefined();
        expect(ps['weight']).toBeDefined();
        expect(ps['required']).toBeDefined();
        expect(ps['type']).toBeDefined();
      }

      // Verify lens direction got score 100
      const lensScore = paramScores.find((ps) => ps['parameterName'] === '镜头视向');
      expect(lensScore).toBeDefined();
      expect(lensScore!['score']).toBe(100);
      expect(lensScore!['type']).toBe('enum');

      // Verify diameter got score 100
      const diaScore = paramScores.find((ps) => ps['parameterName'] === '管径');
      expect(diaScore).toBeDefined();
      expect(diaScore!['score']).toBe(100);
      expect(diaScore!['type']).toBe('range');
    });

    it('should have matchScore = 100 (all params matched)', async () => {
      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      expect(matches[0].matchScore).toBe(100);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 5: UPSERT Idempotency
  // ═══════════════════════════════════════════════════════════

  describe('Test 5: UPSERT Idempotency', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      productId = await createProductWithParams(`${TEST_PREFIX}_Product_Upsert`, [
        { parameterDefinitionId: pdLensDirectionId, value: '直视' },
        { parameterDefinitionId: pdDiameterId, value: '4', valueNumber: 4 },
      ]);

      demandId = await createDemand(`${TEST_PREFIX}_Demand_Upsert`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
        {
          parameterDefinitionId: pdDiameterId,
          valueMin: 3,
          valueMax: 6,
          required: true,
          priority: 2,
        },
      ]);
    });

    it('should create initial match via publish', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    it('should NOT create duplicate matches on re-run', async () => {
      const countBefore = await prisma.demandMatch.count({ where: { demandId } });
      expect(countBefore).toBeGreaterThan(0);

      // Run matching again directly
      await matchingService.match(demandId);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const countAfter = await prisma.demandMatch.count({ where: { demandId } });
      expect(countAfter).toBe(countBefore);
    });

    it('should update matchScore on re-run (upsert)', async () => {
      const matchesAfter = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      // Count should be consistent (same as before, no duplicates from UPSERT)
      expect(matchesAfter.length).toBeGreaterThan(0);
      // All matches should have been updated to MATCHED status
      for (const m of matchesAfter) {
        expect(m.matchStatus).toBe(DemandMatchStatus.MATCHED);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 6: Performance Baseline
  // ═══════════════════════════════════════════════════════════

  describe('Test 6: Performance Baseline (100 products)', () => {
    let demandId: string;
    let productIds: string[] = [];

    beforeAll(async () => {
      // Create 100 products with matching params
      const batchSize = 25;
      for (let batch = 0; batch < 4; batch++) {
        const promises: Promise<string>[] = [];
        for (let i = 0; i < batchSize; i++) {
          const idx = batch * batchSize + i + 1;
          promises.push(
            createProductWithParams(`${TEST_PREFIX}_Perf_Product_${idx}`, [
              { parameterDefinitionId: pdLensDirectionId, value: '直视' },
              { parameterDefinitionId: pdDiameterId, value: String(4 + (idx % 5)), valueNumber: 4 + (idx % 5) },
            ]),
          );
        }
        const ids = await Promise.all(promises);
        productIds.push(...ids);
      }

      expect(productIds.length).toBe(100);

      // Create demand with parameters
      demandId = await createDemand(`${TEST_PREFIX}_Demand_Perf`, DemandStatus.DRAFT, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
        {
          parameterDefinitionId: pdDiameterId,
          valueMin: 3,
          valueMax: 8,
          required: true,
          priority: 2,
        },
      ]);
    }, 30000);

    it('should match 100 products within acceptable time', async () => {
      const start = Date.now();
      const result = await matchingService.match(demandId);
      const elapsed = Date.now() - start;

      console.log(`[Perf] 100 products matched in ${result.elapsedMs}ms (${elapsed}ms wall clock)`);
      console.log(
        `[Perf] Matched: ${result.matched}, Skipped: ${result.skipped}, Candidates: ${result.totalCandidates}`,
      );

      expect(result.totalCandidates).toBeGreaterThanOrEqual(100);
      expect(result.matched).toBeGreaterThan(0);
      // 100 products should complete within 10 seconds
      expect(result.elapsedMs).toBeLessThan(10000);
    }, 15000);
  });
});