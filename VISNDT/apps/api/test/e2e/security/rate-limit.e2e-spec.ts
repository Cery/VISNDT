import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DemandStatus } from '@prisma/client';

/**
 * M8.4-TD05 Rate Limit E2E Test
 *
 * Tests per-endpoint throttling:
 *   1. Login throttling: 5 req/min → 429 on 6th
 *   2. Register throttling: 5 req/min → 429 on 6th
 *   3. Rematch throttling: 10 req/min → 429 on 11th
 *   4. Normal request below limit → 200/401 (not 429)
 */
describe('Rate Limit E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_RL';

  let orgId: string;
  let userId: string;
  let token: string;
  let demandId: string;

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
      await prisma.demandMatch.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demandParameter.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.deleteMany({ where: { id: existingUser.id } });
    }
    await prisma.organization.deleteMany({ where: { name: { startsWith: TEST_PREFIX } } });

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

    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId, role: 'ADMIN' },
    });

    token = jwtService.sign({
      sub: userId,
      email,
      name: user.name,
      organizationId: orgId,
    });

    // ── Create a Demand for rematch test ───────────────────────
    const demand = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX}_Demand`,
        organizationId: orgId,
        createdBy: userId,
        status: DemandStatus.PUBLISHED,
        contactName: 'Test',
        contactPhone: '13800000000',
        contactEmail: 'test@test.com',
      },
    });
    demandId = demand.id;
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.workflowEvent.deleteMany({ where: { operatorId: userId } });
      await prisma.demandMatch.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demandParameter.deleteMany({ where: { demand: { title: { startsWith: TEST_PREFIX } } } });
      await prisma.demand.deleteMany({ where: { title: { startsWith: TEST_PREFIX } } });
      await prisma.organizationMember.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
      await prisma.organization.deleteMany({ where: { id: orgId } });
    } catch (e) {
      console.warn('Cleanup warning:', (e as Error).message);
    }
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════
  // Case 1: Login throttling (5 req/min)
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Login throttling', () => {
    it('should return 429 after exceeding 5 requests per minute', async () => {
      const responses: number[] = [];

      // Send 6 rapid requests; the first 5 should not be rate-limited (they'll get 401 for bad creds)
      for (let i = 0; i < 6; i++) {
        const res = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email: 'nonexistent@test.com', password: 'wrong' });
        responses.push(res.status);
      }

      // At least one of the last requests should be 429
      expect(responses.length).toBe(6);
      // The throttle counts all requests, so the 6th should be 429
      expect(responses[5]).toBe(429);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Register throttling (5 req/min)
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Register throttling', () => {
    it('should return 429 after exceeding 5 registration requests', async () => {
      const responses: number[] = [];

      for (let i = 0; i < 6; i++) {
        const res = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email: `throttle_test_${i}@test.com`,
            password: 'test123',
            name: 'Throttle Test',
            inviteToken: 'invalid-token',
          });
        responses.push(res.status);
      }

      expect(responses[5]).toBe(429);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Rematch throttling (10 req/min)
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Rematch throttling', () => {
    it('should return 429 after exceeding 10 rematch requests', async () => {
      const responses: number[] = [];

      for (let i = 0; i < 11; i++) {
        const res = await request(app.getHttpServer())
          .post(`/api/v1/demands/${demandId}/rematch`)
          .set('Authorization', `Bearer ${token}`);
        responses.push(res.status);
      }

      expect(responses[10]).toBe(429);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Within limit — normal response (unthrottled GET)
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Within limit — normal response', () => {
    it('should return 200/401 (not 429) for a single request to public endpoint', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health');

      // Should not be throttled (global limit: 100/min, single request)
      expect(res.status).not.toBe(429);
    });
  });
});