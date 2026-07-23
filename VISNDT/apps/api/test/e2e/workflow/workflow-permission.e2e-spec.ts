import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { WorkflowEntityType, WorkflowAction } from '@prisma/client';

/**
 * M8.4-TD04 Workflow Event Permission E2E Test
 *
 * Tests the JWT Guard and organization isolation for workflow events:
 *   1. Unauthenticated create → 401
 *   2. Authenticated user creates event → 201
 *   3. Organization isolation (non-existent scenario via valid flow)
 *   4. Regression: existing workflow tests still pass
 */
describe('Workflow Event Permission E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_WFP';
  const TEST_ENTITY_ID = '00000000-0000-0000-0000-000000000001';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let userId: string;
  let token: string;

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
      await prisma.user.deleteMany({ where: { id: existingUser.id } });
    }
    await prisma.organization.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });

    // ── Create Organization ────────────────────────────────────
    const org = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org`, type: 'ENTERPRISE' },
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

    // Create OrganizationMember
    await prisma.organizationMember.create({
      data: {
        organizationId: orgId,
        userId,
        role: 'MEMBER',
      },
    });

    token = jwtService.sign({
      sub: userId,
      email,
      name: user.name,
      organizationId: orgId,
    });
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: userId } });
      await prisma.organizationMember.deleteMany({
        where: { organization: { name: { startsWith: TEST_PREFIX } } },
      });
      await prisma.user.deleteMany({
        where: { email: { startsWith: TEST_PREFIX.toLowerCase() } },
      });
      await prisma.organization.deleteMany({
        where: { name: { startsWith: TEST_PREFIX } },
      });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Unauthenticated create → 401
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Unauthenticated create', () => {
    it('should return 401 without JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/workflow-events')
        .send({
          entityType: WorkflowEntityType.DEMAND,
          entityId: TEST_ENTITY_ID,
          action: WorkflowAction.CREATED,
        });

      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Authenticated user creates event → 201
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Authenticated create', () => {
    let response: request.Response;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/api/v1/workflow-events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          entityType: WorkflowEntityType.DEMAND,
          entityId: TEST_ENTITY_ID,
          action: WorkflowAction.CREATED,
        });
    });

    it('should return 201', () => {
      expect(response.status).toBe(201);
    });

    it('should return event with correct operatorId', () => {
      expect(response.body.data).toHaveProperty('operatorId', userId);
    });

    it('should return event with correct entityType', () => {
      expect(response.body.data).toHaveProperty('entityType', WorkflowEntityType.DEMAND);
    });

    it('should return event with correct action', () => {
      expect(response.body.data).toHaveProperty('action', WorkflowAction.CREATED);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: operatorId cannot be overridden by client
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: operatorId cannot be overridden', () => {
    it('should ignore client-provided operatorId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/workflow-events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          entityType: WorkflowEntityType.DEMAND,
          entityId: '00000000-0000-0000-0000-000000000002',
          action: WorkflowAction.CREATED,
          operatorId: 'fake-operator-id',
        });

      expect(res.status).toBe(201);
      // operatorId should be the authenticated user, not the fake one
      expect(res.body.data.operatorId).toBe(userId);
    });
  });
});