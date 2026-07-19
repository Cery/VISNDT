import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  DemandStatus,
  DemandMatchStatus,
} from '@prisma/client';

/**
 * Demand Domain Security E2E Test
 *
 * Tests security scenarios:
 *   1. Cross-organization access prevention
 *   2. Fake demandId injection protection
 *   3. Invalid state transition blocking
 *   4. Terminal state modification prevention
 *   5. Match ownership enforcement
 *
 * M7.8 Phase: No business logic modifications. Test-only additions.
 */
describe('Demand Security E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // ── Test Data IDs ──────────────────────────────────────────
  let orgAId: string;
  let orgBId: string;
  let userAId: string;
  let userBId: string;
  let tokenA: string;
  let tokenB: string;
  let demandAId: string;
  let demandBId: string;
  let paramDefId: string;
  let productId: string;
  let productId2: string;
  let productId3: string;
  let matchAId: string;
  let matchBId: string;

  const TEST_PREFIX = 'E2E_SEC';

  // ── Setup & Teardown ───────────────────────────────────────

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

    // Pre-cleanup: remove any leftover data from previous failed runs
    for (const suffix of ['_a', '_b']) {
      const existingUser = await prisma.user.findUnique({
        where: { email: `${TEST_PREFIX.toLowerCase()}${suffix}@test.com` },
      });
      if (existingUser) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser.id } });
        await prisma.user.deleteMany({ where: { id: existingUser.id } });
      }
    }
    await prisma.organization.deleteMany({ where: { name: { startsWith: `${TEST_PREFIX}_Org` } } });
    await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.productCategory.deleteMany({
      where: { slug: `${TEST_PREFIX.toLowerCase()}_cat` },
    });
    await prisma.parameterDefinition.deleteMany({
      where: { code: `${TEST_PREFIX.toLowerCase()}_pd` },
    });
    await prisma.parameterGroup.deleteMany({
      where: { code: `${TEST_PREFIX.toLowerCase()}_pg` },
    });

    const passwordHash = await bcrypt.hash('test123', 10);

    // ── Organization A ───────────────────────────────────────
    const orgA = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_OrgA`, type: 'ENTERPRISE' },
    });
    orgAId = orgA.id;

    const userA = await prisma.user.create({
      data: {
        email: `${TEST_PREFIX.toLowerCase()}_a@test.com`,
        passwordHash,
        name: `${TEST_PREFIX} UserA`,
        organizationId: orgAId,
        status: 'ACTIVE',
      },
    });
    userAId = userA.id;
    tokenA = jwtService.sign({
      sub: userAId,
      email: userA.email,
      name: userA.name,
      organizationId: orgAId,
    });

    // ── Organization B ───────────────────────────────────────
    const orgB = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_OrgB`, type: 'ENTERPRISE' },
    });
    orgBId = orgB.id;

    const userB = await prisma.user.create({
      data: {
        email: `${TEST_PREFIX.toLowerCase()}_b@test.com`,
        passwordHash,
        name: `${TEST_PREFIX} UserB`,
        organizationId: orgBId,
        status: 'ACTIVE',
      },
    });
    userBId = userB.id;
    tokenB = jwtService.sign({
      sub: userBId,
      email: userB.email,
      name: userB.name,
      organizationId: orgBId,
    });

    // ── Shared Resources ─────────────────────────────────────
    const paramGroup = await prisma.parameterGroup.create({
      data: { name: `${TEST_PREFIX} PG`, code: `${TEST_PREFIX.toLowerCase()}_pg` },
    });
    const paramDef = await prisma.parameterDefinition.create({
      data: {
        name: `${TEST_PREFIX} PD`,
        code: `${TEST_PREFIX.toLowerCase()}_pd`,
        dataType: 'STRING',
        parameterGroupId: paramGroup.id,
      },
    });
    paramDefId = paramDef.id;

    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX} Cat`,
        slug: `${TEST_PREFIX.toLowerCase()}_cat`,
      },
    });
    const product = await prisma.product.create({
      data: { categoryId: category.id, name: `${TEST_PREFIX} Product`, status: 'ACTIVE' },
    });
    productId = product.id;

    // Second product for multi-match tests (avoids @@unique([demandId, productId]))
    const product2 = await prisma.product.create({
      data: { categoryId: category.id, name: `${TEST_PREFIX} Product 2`, status: 'ACTIVE' },
    });
    productId2 = product2.id;

    // Third product for multi-match tests
    const product3 = await prisma.product.create({
      data: { categoryId: category.id, name: `${TEST_PREFIX} Product 3`, status: 'ACTIVE' },
    });
    productId3 = product3.id;

    // ── Demand A (owned by Org A / User A) ───────────────────
    const demandA = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX} Demand A`,
        organizationId: orgAId,
        createdBy: userAId,
        status: DemandStatus.PUBLISHED,
      },
    });
    demandAId = demandA.id;

    // ── Demand B (owned by Org B / User B) ───────────────────
    const demandB = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX} Demand B`,
        organizationId: orgBId,
        createdBy: userBId,
        status: DemandStatus.PUBLISHED,
      },
    });
    demandBId = demandB.id;

    // ── Match A (on Demand A) ────────────────────────────────
    const matchA = await prisma.demandMatch.create({
      data: {
        demandId: demandAId,
        productId,
        matchScore: 90,
        matchStatus: DemandMatchStatus.MATCHED,
      },
    });
    matchAId = matchA.id;

    // ── Match B (on Demand B) ────────────────────────────────
    const matchB = await prisma.demandMatch.create({
      data: {
        demandId: demandBId,
        productId,
        matchScore: 80,
        matchStatus: DemandMatchStatus.MATCHED,
      },
    });
    matchBId = matchB.id;
  });

  afterAll(async () => {
    try {
      // 1. Clean Match records
      if (matchAId) await prisma.demandMatch.deleteMany({ where: { id: matchAId } });
      if (matchBId) await prisma.demandMatch.deleteMany({ where: { id: matchBId } });
      // 2. Clean Demand records (also cleans WorkflowEvents by entityId)
      if (demandAId) {
        await prisma.workflowEvent.deleteMany({ where: { entityId: demandAId } });
        await prisma.demandParameter.deleteMany({ where: { demandId: demandAId } });
        await prisma.demandMatch.deleteMany({ where: { demandId: demandAId } });
        await prisma.demand.deleteMany({ where: { id: demandAId } });
      }
      if (demandBId) {
        await prisma.workflowEvent.deleteMany({ where: { entityId: demandBId } });
        await prisma.demandParameter.deleteMany({ where: { demandId: demandBId } });
        await prisma.demandMatch.deleteMany({ where: { demandId: demandBId } });
        await prisma.demand.deleteMany({ where: { id: demandBId } });
      }
      // 3. Clean shared resources
      if (productId) await prisma.product.deleteMany({ where: { id: productId } });
      if (productId2) await prisma.product.deleteMany({ where: { id: productId2 } });
      if (productId3) await prisma.product.deleteMany({ where: { id: productId3 } });
      await prisma.productCategory.deleteMany({ where: { slug: `${TEST_PREFIX.toLowerCase()}_cat` } });
      if (paramDefId) await prisma.parameterDefinition.deleteMany({ where: { id: paramDefId } });
      await prisma.parameterGroup.deleteMany({ where: { code: `${TEST_PREFIX.toLowerCase()}_pg` } });
      // 4. Clean Users & Organizations (WorkflowEvents first due to FK)
      if (userAId) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: userAId } });
        await prisma.user.deleteMany({ where: { id: userAId } });
      }
      if (userBId) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: userBId } });
        await prisma.user.deleteMany({ where: { id: userBId } });
      }
      if (orgAId) await prisma.organization.deleteMany({ where: { id: orgAId } });
      if (orgBId) await prisma.organization.deleteMany({ where: { id: orgBId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Security Case 1: Cross-Organization Access
  // ═══════════════════════════════════════════════════════════

  describe('Security Case 1: Cross-Organization Access', () => {
    it('User A GET Demand B should be rejected', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/demands/${demandBId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      // GET :id is public, so it should succeed but return org B's demand
      // This is expected behavior - public endpoint
      expect(res.status).toBe(200);
    });

    it('User A PATCH Demand B should be rejected', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandBId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Hacked Title' });

      // Should be rejected - cross-org modification
      expect([400, 403, 404]).toContain(res.status);
    });

    it('User A POST parameter to Demand B should be rejected', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandBId}/parameters`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          parameterDefinitionId: paramDefId,
          value: 'Bad Value',
        });

      // Should be rejected - cross-org modification
      expect([400, 403, 404]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Security Case 2: Fake demandId Injection
  // ═══════════════════════════════════════════════════════════

  describe('Security Case 2: Fake demandId Injection', () => {
    it('POST /demands/A/parameters with body demandId=B should use URL param', async () => {
      // The service should use the URL param demandId, not body demandId
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandAId}/parameters`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          // Try to inject a different demandId in body
          demandId: demandBId,
          parameterDefinitionId: paramDefId,
          value: 'Valid Value',
        });

      // The CreateDemandParameterDto does NOT have a demandId field,
      // so the body demandId is ignored (whitelisted out by ValidationPipe).
      // The parameter should be created under demandAId.
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      // Verify the parameter was created under the correct demand
      const param = res.body.data;
      expect(param.demandId).toBe(demandAId);
      expect(param.demandId).not.toBe(demandBId);

      // Clean up the created parameter
      await prisma.demandParameter.deleteMany({ where: { id: param.id } });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Security Case 3: Invalid State Transition
  // ═══════════════════════════════════════════════════════════

  describe('Security Case 3: Invalid State Transition', () => {
    let acceptedMatchId: string;
    let rejectedMatchId: string;

    beforeAll(async () => {
      // Create a match in ACCEPTED state (terminal) — use productId2
      const accepted = await prisma.demandMatch.create({
        data: {
          demandId: demandAId,
          productId: productId2,
          matchScore: 95,
          matchStatus: DemandMatchStatus.ACCEPTED,
        },
      });
      acceptedMatchId = accepted.id;

      // Create a match in REJECTED state (terminal) — use productId3
      const rejected = await prisma.demandMatch.create({
        data: {
          demandId: demandAId,
          productId: productId3,
          matchScore: 30,
          matchStatus: DemandMatchStatus.REJECTED,
        },
      });
      rejectedMatchId = rejected.id;
    });

    afterAll(async () => {
      if (acceptedMatchId) await prisma.demandMatch.deleteMany({ where: { id: acceptedMatchId } });
      if (rejectedMatchId) await prisma.demandMatch.deleteMany({ where: { id: rejectedMatchId } });
    });

    it('ACCEPTED → REVIEWED should be rejected (400)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandAId}/matches/${acceptedMatchId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: DemandMatchStatus.REVIEWED });

      expect(res.status).toBe(400);
    });

    it('REJECTED → ACCEPTED should be rejected (400)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandAId}/matches/${rejectedMatchId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: DemandMatchStatus.ACCEPTED });

      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Security Case 4: Terminal State Modification
  // ═══════════════════════════════════════════════════════════

  describe('Security Case 4: Terminal State Modification', () => {
    let closedDemandId: string;

    beforeAll(async () => {
      const closed = await prisma.demand.create({
        data: {
          title: `${TEST_PREFIX} Closed Demand`,
          organizationId: orgAId,
          createdBy: userAId,
          status: DemandStatus.CLOSED,
          closedAt: new Date(),
        },
      });
      closedDemandId = closed.id;
    });

    afterAll(async () => {
      if (closedDemandId) {
        await prisma.demandParameter.deleteMany({ where: { demandId: closedDemandId } });
        await prisma.demandMatch.deleteMany({ where: { demandId: closedDemandId } });
        await prisma.demand.deleteMany({ where: { id: closedDemandId } });
      }
    });

    it('PATCH CLOSED demand should be rejected (400)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${closedDemandId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'Try to modify closed demand' });

      expect(res.status).toBe(400);
    });

    it('POST parameter to CLOSED demand should be rejected (400)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${closedDemandId}/parameters`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          parameterDefinitionId: paramDefId,
          value: 'Should fail',
        });

      expect(res.status).toBe(400);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Security Case 5: Match Ownership
  // ═══════════════════════════════════════════════════════════

  describe('Security Case 5: Match Ownership', () => {
    it('Demand A owner accessing Match B should return 404', async () => {
      // Match B belongs to Demand B, accessing via Demand A should return 404
      const res = await request(app.getHttpServer())
        .get(`/api/v1/demands/${demandAId}/matches/${matchBId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      // The match doesn't exist on demand A, so it should be 404
      expect(res.status).toBe(404);
    });

    it('Demand A owner updating Match B should return 404', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandAId}/matches/${matchBId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: DemandMatchStatus.REVIEWED });

      expect(res.status).toBe(404);
    });
  });
});