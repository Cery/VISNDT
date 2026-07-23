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
 * M8.3.1 Matching Category Filter E2E Test
 *
 * Tests the category filter optimization:
 *   1. Same Category Match — Demand.categoryId matches Product.categoryId → 匹配
 *   2. Different Category Exclusion — 不同分类不参与匹配
 *   3. No Category Compatibility — Demand.categoryId=null → 查询全部 Product
 *
 * NOTE: Demand.categoryId is now formalized in the Prisma schema (M8.4-TD01).
 * Tests use Prisma-native categoryId field.
 */
describe('Matching Category Filter E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let matchingService: MatchingService;

  const TEST_PREFIX = 'E2E_CAT';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let token: string;
  let categoryAId: string;
  let categoryBId: string;
  let pdId: string; // parameter definition

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

    // ── Create Categories ──────────────────────────────────────
    const catA = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Category A`,
        slug: `${TEST_PREFIX.toLowerCase()}_cat_a`,
      },
    });
    categoryAId = catA.id;

    const catB = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Category B`,
        slug: `${TEST_PREFIX.toLowerCase()}_cat_b`,
      },
    });
    categoryBId = catB.id;

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

  // ── Helpers ─────────────────────────────────────────────────

  async function createProductWithCategory(
    name: string,
    categoryId: string,
    paramValue: string,
  ): Promise<string> {
    const product = await prisma.product.create({
      data: {
        name,
        status: 'ACTIVE',
        categoryId,
        parameterValues: {
          create: [
            {
              parameterDefinitionId: pdId,
              value: paramValue,
            },
          ],
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

  async function createDemandWithCategory(
    title: string,
    categoryId: string | null,
    paramValue: string,
  ): Promise<string> {
    // Create demand via Prisma with native categoryId field
    const demand = await prisma.demand.create({
      data: {
        title,
        organizationId: orgId,
        createdBy: userId,
        status: DemandStatus.DRAFT,
        categoryId,
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
  // Test 1: Same Category Match
  // ═══════════════════════════════════════════════════════════

  describe('Test 1: Same Category Match', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Product in Category A
      productId = await createProductWithCategory(
        `${TEST_PREFIX}_Product_SameCat`,
        categoryAId,
        '直视',
      );

      // Demand in Category A
      demandId = await createDemandWithCategory(
        `${TEST_PREFIX}_Demand_SameCat`,
        categoryAId,
        '直视',
      );
    });

    it('should match product in same category', async () => {
      const result = await matchingService.match(demandId);

      expect(result.matched).toBeGreaterThan(0);
      expect(result.totalCandidates).toBeGreaterThanOrEqual(1);

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      expect(matches.length).toBeGreaterThan(0);
      // Verify the matched product is the one in the same category
      const matchedProductIds = matches.map((m) => m.productId);
      expect(matchedProductIds).toContain(productId);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 2: Different Category Exclusion
  // ═══════════════════════════════════════════════════════════

  describe('Test 2: Different Category Exclusion', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Product in Category B
      productId = await createProductWithCategory(
        `${TEST_PREFIX}_Product_DiffCat`,
        categoryBId,
        '直视',
      );

      // Demand in Category A
      demandId = await createDemandWithCategory(
        `${TEST_PREFIX}_Demand_DiffCat`,
        categoryAId,
        '直视',
      );
    });

    it('should NOT match product in different category', async () => {
      const result = await matchingService.match(demandId);
      // Different category → product in Category B excluded from candidates
      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      const matchedProductIds = matches.map((m) => m.productId);
      // Product in different category (B) should NOT be matched
      expect(matchedProductIds).not.toContain(productId);
      // Only products in the same category (A) should be matched
      if (result.totalCandidates > 0) {
        for (const match of matches) {
          const matchedProduct = await prisma.product.findUnique({
            where: { id: match.productId },
          });
          expect(matchedProduct!.categoryId).toBe(categoryAId);
        }
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Test 3: No Category Compatibility
  // ═══════════════════════════════════════════════════════════

  describe('Test 3: No Category Compatibility', () => {
    let demandId: string;
    let productId: string;

    beforeAll(async () => {
      // Product in Category A
      productId = await createProductWithCategory(
        `${TEST_PREFIX}_Product_NoCat`,
        categoryAId,
        '直视',
      );

      // Demand without categoryId (null)
      demandId = await createDemandWithCategory(
        `${TEST_PREFIX}_Demand_NoCat`,
        null,
        '直视',
      );
    });

    it('should match all products when demand has no category', async () => {
      const result = await matchingService.match(demandId);

      expect(result.matched).toBeGreaterThan(0);
      expect(result.totalCandidates).toBeGreaterThanOrEqual(1);

      const matches = await prisma.demandMatch.findMany({
        where: { demandId },
      });
      expect(matches.length).toBeGreaterThan(0);
      // Product in category A should be matched (no category filter)
      const matchedProductIds = matches.map((m) => m.productId);
      expect(matchedProductIds).toContain(productId);
    });
  });
});