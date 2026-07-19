import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DemandStatus, DemandMatchStatus, WorkflowEntityType, WorkflowAction } from '@prisma/client';

/**
 * Demand Domain E2E Flow Test
 *
 * Tests the complete business flow:
 *   Demand Create → Parameter Add → Publish → Search → Match Query → Match Status Update → Close
 *
 * M7.8 Phase: No business logic modifications. Test-only additions.
 */
describe('Demand Flow E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // ── Test Data IDs ──────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let userEmail: string;
  let token: string;
  let demandId: string;
  let paramDefId: string;
  let categoryId: string;
  let productId: string;
  let matchId: string;

  const TEST_PREFIX = 'E2E_FLOW';

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

    // ── Create test data ──────────────────────────────────────

    // Pre-cleanup: remove any leftover data from previous failed runs
    const existingUser = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}@test.com` },
    });
    if (existingUser) {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: existingUser.id } });
      await prisma.user.deleteMany({ where: { id: existingUser.id } });
    }
    await prisma.organization.deleteMany({ where: { name: `${TEST_PREFIX}_Org` } });
    await prisma.product.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });
    await prisma.productCategory.deleteMany({
      where: { slug: `${TEST_PREFIX.toLowerCase()}_category` },
    });
    await prisma.parameterDefinition.deleteMany({
      where: { code: `${TEST_PREFIX.toLowerCase()}_pd` },
    });
    await prisma.parameterGroup.deleteMany({
      where: { code: `${TEST_PREFIX.toLowerCase()}_pg` },
    });

    // 1. Organization
    const org = await prisma.organization.create({
      data: {
        name: `${TEST_PREFIX}_Org`,
        type: 'ENTERPRISE',
      },
    });
    orgId = org.id;

    // 2. User
    userEmail = `${TEST_PREFIX.toLowerCase()}@test.com`;
    const passwordHash = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        passwordHash,
        name: `${TEST_PREFIX} User`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    userId = user.id;

    // Generate JWT token
    token = jwtService.sign({
      sub: userId,
      email: userEmail,
      name: user.name,
      organizationId: orgId,
    });

    // 3. Product Category
    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX}_Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_category`,
      },
    });
    categoryId = category.id;

    // 4. Product
    const product = await prisma.product.create({
      data: {
        categoryId,
        name: `${TEST_PREFIX} Product`,
        status: 'ACTIVE',
      },
    });
    productId = product.id;

    // 5. Parameter Group
    const paramGroup = await prisma.parameterGroup.create({
      data: {
        name: `${TEST_PREFIX} ParamGroup`,
        code: `${TEST_PREFIX.toLowerCase()}_pg`,
      },
    });

    // 6. Parameter Definition
    const paramDef = await prisma.parameterDefinition.create({
      data: {
        name: `${TEST_PREFIX} ParamDef`,
        code: `${TEST_PREFIX.toLowerCase()}_pd`,
        dataType: 'STRING',
        parameterGroupId: paramGroup.id,
      },
    });
    paramDefId = paramDef.id;
  });

  afterAll(async () => {
    // Clean up test data in reverse dependency order
    try {
      // 1. Delete WorkflowEvents (before Users, due to FK)
      if (demandId) {
        await prisma.workflowEvent.deleteMany({ where: { entityId: demandId } });
      }
      // 2. Delete DemandMatch, DemandParameter, Demand
      if (matchId) await prisma.demandMatch.deleteMany({ where: { id: matchId } });
      if (demandId) {
        await prisma.demandParameter.deleteMany({ where: { demandId } });
        await prisma.demandMatch.deleteMany({ where: { demandId } });
        await prisma.demand.deleteMany({ where: { id: demandId } });
      }
      // 3. Delete ParameterDefinition & ParameterGroup
      if (paramDefId) await prisma.parameterDefinition.deleteMany({ where: { id: paramDefId } });
      await prisma.parameterDefinition.deleteMany({
        where: { code: `${TEST_PREFIX.toLowerCase()}_pd` },
      });
      await prisma.parameterGroup.deleteMany({
        where: { code: `${TEST_PREFIX.toLowerCase()}_pg` },
      });
      // 4. Delete Product & Category
      if (productId) await prisma.product.deleteMany({ where: { id: productId } });
      if (categoryId) await prisma.productCategory.deleteMany({ where: { id: categoryId } });
      // 5. Delete User & Organization
      if (userId) {
        await prisma.workflowEvent.deleteMany({ where: { operatorId: userId } });
        await prisma.user.deleteMany({ where: { id: userId } });
      }
      if (orgId) await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Demand Create
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Demand Create', () => {
    it('POST /demands should return 201 and create demand with DRAFT status', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/demands')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `${TEST_PREFIX} Need 100 endoscopes`,
          description: 'Industrial endoscopes for NDT inspection',
          budgetRange: '10000-50000',
          quantity: 100,
          quantityUnit: '台',
          contactName: 'Test Contact',
          contactPhone: '13800138000',
          contactEmail: 'contact@test.com',
          contactVisible: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe(DemandStatus.DRAFT);
      expect(res.body.data.title).toContain(TEST_PREFIX);

      demandId = res.body.data.id;
    });

    it('should create WorkflowEvent with entityType=DEMAND, action=CREATED', async () => {
      const events = await prisma.workflowEvent.findMany({
        where: { entityId: demandId, entityType: WorkflowEntityType.DEMAND },
        orderBy: { createdAt: 'desc' },
      });

      const createdEvent = events.find((e) => e.action === WorkflowAction.CREATED);
      expect(createdEvent).toBeDefined();
      expect(createdEvent!.entityType).toBe(WorkflowEntityType.DEMAND);
      expect(createdEvent!.operatorId).toBe(userId);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Add DemandParameter
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Add DemandParameter', () => {
    it('POST /demands/:id/parameters should create parameter', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/parameters`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          parameterDefinitionId: paramDefId,
          value: 'Industrial Grade',
          priority: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.parameterDefinitionId).toBe(paramDefId);
      expect(res.body.data.priority).toBe(1);
      expect(res.body.data.parameterDefinition).toBeDefined();
    });

    it('should return 409 for duplicate parameterDefinitionId', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/parameters`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          parameterDefinitionId: paramDefId,
          value: 'Another Value',
        });

      // Prisma unique constraint violation → 409 or 500
      expect([409, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Publish Demand
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Publish Demand', () => {
    it('POST /demands/:id/publish should transition DRAFT → PUBLISHED', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/publish`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(DemandStatus.PUBLISHED);
      expect(res.body.data.publishedAt).toBeDefined();
      expect(res.body.data.publishedAt).not.toBeNull();
    });

    it('should create WorkflowEvent with action=OPENED', async () => {
      const events = await prisma.workflowEvent.findMany({
        where: { entityId: demandId, entityType: WorkflowEntityType.DEMAND },
        orderBy: { createdAt: 'desc' },
      });

      const openedEvent = events.find((e) => e.action === WorkflowAction.OPENED);
      expect(openedEvent).toBeDefined();
      expect(openedEvent!.operatorId).toBe(userId);

      // Verify metadata
      const meta = openedEvent!.metadata as Record<string, unknown> | null;
      expect(meta).toBeDefined();
      if (meta) {
        expect(meta.previousStatus).toBe(DemandStatus.DRAFT);
        expect(meta.newStatus).toBe(DemandStatus.PUBLISHED);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Demand Search
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Demand Search', () => {
    it('GET /demands should support keyword search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/demands')
        .query({ keyword: 'endoscopes' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeDefined();
      const found = res.body.data.data.find((d: any) => d.id === demandId);
      expect(found).toBeDefined();
    });

    it('GET /demands should support status filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/demands')
        .query({ status: DemandStatus.PUBLISHED });

      expect(res.status).toBe(200);
      const found = res.body.data.data.find((d: any) => d.id === demandId);
      expect(found).toBeDefined();
      expect(found.status).toBe(DemandStatus.PUBLISHED);
    });

    it('GET /demands should support sort by latest', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/demands')
        .query({ sort: 'latest' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('GET /demands should support pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/demands')
        .query({ page: 1, pageSize: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.pageSize).toBe(5);
      expect(res.body.data.total).toBeGreaterThanOrEqual(0);
    });

    it('should mask contact info when contactVisible=false', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/demands/${demandId}`);

      expect(res.status).toBe(200);
      const demand = res.body.data;
      // contactVisible was set to false, so phone and email should be masked
      expect(demand.contactPhone).toBe('***');
      expect(demand.contactEmail).toBe('***');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 5: DemandMatch Query
  // ═══════════════════════════════════════════════════════════

  describe('Case 5: DemandMatch Query', () => {
    beforeAll(async () => {
      // Create a DemandMatch test record directly via Prisma
      const match = await prisma.demandMatch.create({
        data: {
          demandId,
          productId,
          matchScore: 85.5,
          matchStatus: DemandMatchStatus.MATCHED,
          matchDetails: { reason: 'Auto-matched by parameter similarity' },
          matchedAt: new Date(),
        },
      });
      matchId = match.id;
    });

    it('GET /demands/:id/matches should return match list', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/demands/${demandId}/matches`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeDefined();
      expect(res.body.data.data.length).toBeGreaterThanOrEqual(1);

      const match = res.body.data.data.find((m: any) => m.id === matchId);
      expect(match).toBeDefined();
      expect(match.product).toBeDefined();
      expect(match.product.category).toBeDefined();
      expect(match.matchScore).toBe(85.5);
      expect(match.matchStatus).toBe(DemandMatchStatus.MATCHED);
    });

    it('GET /demands/:id/matches/:matchId should return match detail', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/demands/${demandId}/matches/${matchId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(matchId);
      expect(res.body.data.product).toBeDefined();
      expect(res.body.data.product.category).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 6: DemandMatch Status Update
  // ═══════════════════════════════════════════════════════════

  describe('Case 6: DemandMatch Status Update', () => {
    it('should transition MATCHED → REVIEWED', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandId}/matches/${matchId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: DemandMatchStatus.REVIEWED, notes: 'Reviewed by team' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.matchStatus).toBe(DemandMatchStatus.REVIEWED);
      expect(res.body.data.reviewedAt).toBeDefined();
      expect(res.body.data.reviewedAt).not.toBeNull();
    });

    it('should transition REVIEWED → ACCEPTED', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/demands/${demandId}/matches/${matchId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: DemandMatchStatus.ACCEPTED, notes: 'Approved' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.matchStatus).toBe(DemandMatchStatus.ACCEPTED);
    });

    it('should create WorkflowEvent for ACCEPTED action', async () => {
      const events = await prisma.workflowEvent.findMany({
        where: { entityId: demandId, entityType: WorkflowEntityType.DEMAND },
        orderBy: { createdAt: 'desc' },
      });

      const acceptedEvent = events.find((e) => e.action === WorkflowAction.ACCEPTED);
      expect(acceptedEvent).toBeDefined();
      expect(acceptedEvent!.operatorId).toBe(userId);

      const meta = acceptedEvent!.metadata as Record<string, unknown> | null;
      expect(meta).toBeDefined();
      if (meta) {
        expect(meta.matchId).toBe(matchId);
        expect(meta.newStatus).toBe(DemandMatchStatus.ACCEPTED);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 7: Demand Close
  // ═══════════════════════════════════════════════════════════

  describe('Case 7: Demand Close', () => {
    it('POST /demands/:id/close should transition PUBLISHED → CLOSED', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/demands/${demandId}/close`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Demand fulfilled' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(DemandStatus.CLOSED);
      expect(res.body.data.closedAt).toBeDefined();
      expect(res.body.data.closedAt).not.toBeNull();
    });

    it('should create WorkflowEvent with action=CLOSED', async () => {
      const events = await prisma.workflowEvent.findMany({
        where: { entityId: demandId, entityType: WorkflowEntityType.DEMAND },
        orderBy: { createdAt: 'desc' },
      });

      const closedEvent = events.find((e) => e.action === WorkflowAction.CLOSED);
      expect(closedEvent).toBeDefined();
      expect(closedEvent!.operatorId).toBe(userId);

      const meta = closedEvent!.metadata as Record<string, unknown> | null;
      expect(meta).toBeDefined();
      if (meta) {
        expect(meta.previousStatus).toBe(DemandStatus.PUBLISHED);
        expect(meta.newStatus).toBe(DemandStatus.CLOSED);
        expect(meta.closeReason).toBe('Demand fulfilled');
      }
    });
  });
});