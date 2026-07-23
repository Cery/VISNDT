import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MatchingService } from '../../../src/matching/matching.service';
import { DemandStatus, ParameterDataType } from '@prisma/client';

/**
 * M8.3.3 Matching Performance Benchmark E2E
 *
 * Validates Matching Engine performance at scale:
 *   Case 1: 1000 Products — no category filter
 *   Case 2: 10000 Products — 10 categories, category filter impact
 *   Case 3: Rematch Performance — initial vs rematch
 *   Case 4: Parameter Complexity — 5/10/20 parameters
 */
describe('Matching Performance Benchmark', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let matchingService: MatchingService;

  const TEST_PREFIX = 'E2E_BM';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let defaultCategoryId: string;
  let pdLensDirectionId: string;
  let pdDiameterId: string;

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
    const existingUser = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` },
    });
    if (existingUser) {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser.id } });
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser.id } });
    }
    await prisma.user.deleteMany({ where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` } });
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

    // Bulk cleanup by prefix
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
      data: { name: `${TEST_PREFIX}_SupplierOrg`, type: 'supplier' },
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

    // ── Create Default Category ────────────────────────────────
    const cat = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Default Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_default`,
      },
    });
    defaultCategoryId = cat.id;

    // ── Create Parameter Group ─────────────────────────────────
    const pg = await prisma.parameterGroup.create({
      data: {
        name: `${TEST_PREFIX} ParamGroup`,
        code: `${TEST_PREFIX.toLowerCase()}_pg`,
      },
    });

    // ── Create Core Parameter Definitions ──────────────────────
    const pdLens = await prisma.parameterDefinition.create({
      data: {
        name: '镜头视向',
        code: `${TEST_PREFIX.toLowerCase()}_lens`,
        dataType: ParameterDataType.ENUM,
        parameterGroupId: pg.id,
      },
    });
    pdLensDirectionId = pdLens.id;

    const pdDia = await prisma.parameterDefinition.create({
      data: {
        name: '管径',
        code: `${TEST_PREFIX.toLowerCase()}_diameter`,
        dataType: ParameterDataType.NUMBER,
        unit: 'mm',
        parameterGroupId: pg.id,
      },
    });
    pdDiameterId = pdDia.id;
  }, 60000);

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
      if (orgId) await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ── Helpers ─────────────────────────────────────────────────

  /**
   * Bulk create products with parameter values and offers.
   * Uses createMany for efficiency.
   */
  async function bulkCreateProducts(
    count: number,
    categoryId: string,
    namePrefix: string,
    paramDefId: string,
    paramValue: string,
    paramValueNumber: number,
    startIdx: number = 1,
  ): Promise<string[]> {
    // Step 1: Create products in bulk
    const productData = Array.from({ length: count }, (_, i) => ({
      id: undefined as string | undefined,
      name: `${namePrefix}_${startIdx + i}`,
      status: 'ACTIVE' as const,
      categoryId,
    }));

    // Use individual creates for reliable ID tracking
    const productIds: string[] = [];
    const batchSize = 500;
    for (let batch = 0; batch < count; batch += batchSize) {
      const end = Math.min(batch + batchSize, count);
      const batchPromises = productData.slice(batch, end).map(async (p) => {
        const product = await prisma.product.create({ data: p });
        return product.id;
      });
      const ids = await Promise.all(batchPromises);
      productIds.push(...ids);
    }

    // Step 2: Create parameter values in bulk
    const paramValueData = productIds.map((pid) => ({
      productId: pid,
      parameterDefinitionId: paramDefId,
      value: paramValue,
      valueNumber: paramValueNumber,
    }));

    for (let batch = 0; batch < paramValueData.length; batch += batchSize) {
      const chunk = paramValueData.slice(batch, batch + batchSize);
      await prisma.productParameterValue.createMany({ data: chunk });
    }

    // Step 3: Create offers in bulk
    const offerData = productIds.map((pid, i) => ({
      title: `${namePrefix}_Offer_${startIdx + i}`,
      organizationId: orgId,
      productId: pid,
      status: 'ACTIVE' as const,
    }));

    for (let batch = 0; batch < offerData.length; batch += batchSize) {
      const chunk = offerData.slice(batch, batch + batchSize);
      await prisma.offer.createMany({ data: chunk });
    }

    return productIds;
  }

  async function createDemand(
    title: string,
    params: Array<{
      parameterDefinitionId: string;
      value?: string;
      valueMin?: number;
      valueMax?: number;
      required?: boolean;
      priority?: number;
    }>,
    categoryId?: string,
  ): Promise<string> {
    const demand = await prisma.demand.create({
      data: {
        title,
        organizationId: orgId,
        createdBy: userId,
        status: DemandStatus.DRAFT,
        categoryId: categoryId ?? null,
        contactName: 'Test',
        contactPhone: '13800000000',
        contactEmail: 'test@test.com',
        parameters: {
          create: params.map((p) => ({
            parameterDefinitionId: p.parameterDefinitionId,
            value: p.value ?? null,
            valueMin: p.valueMin ?? null,
            valueMax: p.valueMax ?? null,
            required: p.required ?? false,
            priority: p.priority ?? 1,
          })),
        },
      },
    });
    return demand.id;
  }

  // ═══════════════════════════════════════════════════════════
  // Case 1: 1000 Products — No Category Filter
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: 1000 Products — No Category', () => {
    let demandId: string;
    let productIds: string[] = [];

    beforeAll(async () => {
      console.log('[Benchmark] Creating 1000 products...');
      const startCreate = Date.now();

      productIds = await bulkCreateProducts(
        1000,
        defaultCategoryId,
        `${TEST_PREFIX}_P1K`,
        pdLensDirectionId,
        '直视',
        0,
      );

      console.log(`[Benchmark] 1000 products created in ${Date.now() - startCreate}ms`);

      // Create demand with matching params
      demandId = await createDemand(`${TEST_PREFIX}_Demand_1K`, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
      ]);
    }, 120000);

    it('should match 1000 products under 5 seconds', async () => {
      const start = Date.now();
      const result = await matchingService.match(demandId);
      const elapsed = Date.now() - start;

      console.log('='.repeat(60));
      console.log('[Case 1] 1000 Products — No Category');
      console.log(`  Candidates: ${result.totalCandidates}`);
      console.log(`  Matched:    ${result.matched}`);
      console.log(`  Skipped:    ${result.skipped}`);
      console.log(`  ElapsedMs:  ${result.elapsedMs}`);
      console.log(`  WallClock:  ${elapsed}ms`);
      console.log('='.repeat(60));

      expect(result.totalCandidates).toBeGreaterThanOrEqual(1000);
      expect(result.matched).toBeGreaterThan(0);
      expect(result.elapsedMs).toBeLessThan(5000);
    }, 30000);
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: 10000 Products — 10 Categories, Category Filter
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: 10K Products — Category Filter', () => {
    let demandId: string;
    let categoryIds: string[] = [];
    let targetCategoryId: string;

    beforeAll(async () => {
      // Create 10 categories
      console.log('[Benchmark] Creating 10 categories...');
      for (let i = 0; i < 10; i++) {
        const cat = await prisma.productCategory.create({
          data: {
            name: `${TEST_PREFIX} Cat ${i}`,
            slug: `${TEST_PREFIX.toLowerCase()}_cat_${i}`,
          },
        });
        categoryIds.push(cat.id);
      }
      targetCategoryId = categoryIds[0]; // Demand will use category A

      // Create 1000 products per category (10000 total)
      console.log('[Benchmark] Creating 10000 products (10 categories × 1000)...');
      const startCreate = Date.now();

      const batchPromises = categoryIds.map((catId, idx) =>
        bulkCreateProducts(
          1000,
          catId,
          `${TEST_PREFIX}_P10K_C${idx}`,
          pdLensDirectionId,
          '直视',
          0,
          idx * 1000 + 1,
        ),
      );
      await Promise.all(batchPromises);

      console.log(`[Benchmark] 10000 products created in ${Date.now() - startCreate}ms`);

      // Create demand with category A
      demandId = await createDemand(
        `${TEST_PREFIX}_Demand_10K`,
        [
          {
            parameterDefinitionId: pdLensDirectionId,
            value: '直视',
            required: true,
            priority: 3,
          },
        ],
        targetCategoryId,
      );
    }, 300000); // 5 min timeout for creation

    it('should filter by category and reduce candidates ~10x', async () => {
      const start = Date.now();
      const result = await matchingService.match(demandId);
      const elapsed = Date.now() - start;

      console.log('='.repeat(60));
      console.log('[Case 2] 10000 Products — 10 Categories, Demand=Cat A');
      console.log(`  Candidates:  ${result.totalCandidates}`);
      console.log(`  Matched:     ${result.matched}`);
      console.log(`  Skipped:     ${result.skipped}`);
      console.log(`  ElapsedMs:   ${result.elapsedMs}`);
      console.log(`  WallClock:   ${elapsed}ms`);
      console.log(`  FilterRatio: ${result.totalCandidates > 0 ? `1/${Math.round(10000 / result.totalCandidates)}` : 'N/A'}`);
      console.log('='.repeat(60));

      // Category filter should reduce candidates significantly
      // With 10 categories × 1000 each, category filter → ~1000 candidates
      expect(result.totalCandidates).toBeLessThanOrEqual(1500);
      expect(result.totalCandidates).toBeGreaterThanOrEqual(800);
      expect(result.matched).toBeGreaterThan(0);
      expect(result.elapsedMs).toBeLessThan(10000);
    }, 30000);
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Rematch Performance
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Rematch Performance', () => {
    let demandId: string;
    let productIds: string[] = [];
    let initialElapsed: number;
    let rematchElapsed: number;

    beforeAll(async () => {
      // Create 500 products
      productIds = await bulkCreateProducts(
        500,
        defaultCategoryId,
        `${TEST_PREFIX}_P_RM`,
        pdLensDirectionId,
        '直视',
        0,
      );

      demandId = await createDemand(`${TEST_PREFIX}_Demand_RM`, [
        {
          parameterDefinitionId: pdLensDirectionId,
          value: '直视',
          required: true,
          priority: 3,
        },
      ]);
    }, 60000);

    it('should measure initial match vs rematch performance', async () => {
      // Initial match
      const start1 = Date.now();
      const result1 = await matchingService.match(demandId);
      initialElapsed = result1.elapsedMs;

      // Delete matches (simulate rematch)
      await prisma.demandMatch.deleteMany({ where: { demandId } });

      // Rematch
      const start2 = Date.now();
      const result2 = await matchingService.match(demandId);
      rematchElapsed = result2.elapsedMs;

      console.log('='.repeat(60));
      console.log('[Case 3] Rematch Performance (500 products)');
      console.log(`  Initial Match:  ${initialElapsed}ms`);
      console.log(`  Rematch:        ${rematchElapsed}ms`);
      console.log(`  Delta:          ${rematchElapsed - initialElapsed}ms`);
      console.log(`  Candidates:     ${result1.totalCandidates}`);

      // Verify both produce results
      expect(result1.matched).toBeGreaterThan(0);
      expect(result2.matched).toBeGreaterThan(0);
      expect(result1.totalCandidates).toBe(result2.totalCandidates);

      // Rematch should be similar or faster (no cold start)
      console.log('='.repeat(60));
    }, 30000);
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Parameter Complexity
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Parameter Complexity (5/10/20 params)', () => {
    let productId: string;
    let paramDefIds: string[] = [];
    const SCALES = [5, 10, 20];

    beforeAll(async () => {
      // Create 20 extra parameter definitions (NUMBER type)
      const pg = await prisma.parameterGroup.findFirst({
        where: { code: `${TEST_PREFIX.toLowerCase()}_pg` },
      });

      for (let i = 1; i <= 20; i++) {
        const pd = await prisma.parameterDefinition.create({
          data: {
            name: `参数${i}`,
            code: `${TEST_PREFIX.toLowerCase()}_param_${i}`,
            dataType: ParameterDataType.NUMBER,
            unit: 'unit',
            parameterGroupId: pg!.id,
          },
        });
        paramDefIds.push(pd.id);
      }

      // Create one product with values for all 20 params
      const product = await prisma.product.create({
        data: {
          name: `${TEST_PREFIX}_Product_Complex`,
          status: 'ACTIVE',
          categoryId: defaultCategoryId,
          parameterValues: {
            create: paramDefIds.map((pdId) => ({
              parameterDefinitionId: pdId,
              value: '50',
              valueNumber: 50,
            })),
          },
        },
      });

      await prisma.offer.create({
        data: {
          title: `${TEST_PREFIX}_Product_Complex Offer`,
          organizationId: orgId,
          productId: product.id,
          status: 'ACTIVE',
        },
      });

      productId = product.id;
    }, 60000);

    for (const scale of SCALES) {
      it(`should score with ${scale} parameters`, async () => {
        // Use first `scale` parameter definitions
        const usedParamDefs = paramDefIds.slice(0, scale);

        const demand = await createDemand(
          `${TEST_PREFIX}_Demand_Complex_${scale}`,
          usedParamDefs.map((pdId, i) => ({
            parameterDefinitionId: pdId,
            valueMin: 40,
            valueMax: 60,
            required: true,
            priority: scale - i, // descending priority
          })),
        );

        const start = Date.now();
        const result = await matchingService.match(demand);
        const elapsed = Date.now() - start;

        console.log(`[Case 4] ${scale} params: ${result.elapsedMs}ms, matched=${result.matched}, candidates=${result.totalCandidates}`);

        expect(result.totalCandidates).toBeGreaterThanOrEqual(1);
        expect(result.matched).toBeGreaterThan(0);
      }, 15000);
    }

    it('should report parameter complexity summary', async () => {
      console.log('='.repeat(60));
      console.log('[Case 4] Parameter Complexity Summary');
      console.log('  Scale: 5, 10, 20 parameters');
      console.log('  Product: 1 (with all 20 params)');
      console.log('  Demand: 1 per scale');
      console.log('  See individual test logs for timing');
      console.log('='.repeat(60));

      expect(true).toBe(true); // Summary marker
    });
  });
});