import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M8.4-TD03 Auth Invitation E2E Test
 *
 * Tests the invitation-based registration flow:
 *   1. Register without invitation token → 401
 *   2. Register with valid invitation token → 201
 *   3. Register with duplicate (used) token → 401
 *   4. Register with expired token → 401
 *   5. Create invitation → 201 (Admin only)
 *   6. Create invitation without auth → 401
 */
describe('Auth Invitation E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_INV';

  // ── Shared IDs ──────────────────────────────────────────────
  let orgId: string;
  let adminUserId: string;
  let adminToken: string;
  let validInviteToken: string;

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
    await prisma.userInvitation.deleteMany({
      where: { email: { startsWith: TEST_PREFIX.toLowerCase() } },
    });
    const existingUser = await prisma.user.findUnique({
      where: { email: `${TEST_PREFIX.toLowerCase()}_admin@test.com` },
    });
    if (existingUser) {
      await prisma.organizationMember.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.deleteMany({ where: { id: existingUser.id } });
    }
    await prisma.user.deleteMany({
      where: { email: `${TEST_PREFIX.toLowerCase()}_new@test.com` },
    });
    await prisma.organization.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });

    // ── Create Organization ────────────────────────────────────
    const org = await prisma.organization.create({
      data: { name: `${TEST_PREFIX}_Org`, type: 'ENTERPRISE' },
    });
    orgId = org.id;

    // ── Create Admin User ──────────────────────────────────────
    const adminEmail = `${TEST_PREFIX.toLowerCase()}_admin@test.com`;
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: `${TEST_PREFIX} Admin`,
        organizationId: orgId,
        status: 'ACTIVE',
      },
    });
    adminUserId = adminUser.id;

    // Create OrganizationMember as ADMIN
    await prisma.organizationMember.create({
      data: {
        organizationId: orgId,
        userId: adminUserId,
        role: 'ADMIN',
      },
    });

    adminToken = jwtService.sign({
      sub: adminUserId,
      email: adminEmail,
      name: adminUser.name,
      organizationId: orgId,
    });

    // ── Create a valid invitation for testing ──────────────────
    const invite = await prisma.userInvitation.create({
      data: {
        email: `${TEST_PREFIX.toLowerCase()}_new@test.com`,
        token: 'valid-test-token-00000000-0000-0000-0000-000000000001',
        organizationId: orgId,
        role: 'MEMBER',
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdBy: adminUserId,
      },
    });
    validInviteToken = invite.token;

    // ── Create an expired invitation for testing ───────────────
    await prisma.userInvitation.create({
      data: {
        email: `${TEST_PREFIX.toLowerCase()}_expired@test.com`,
        token: 'expired-test-token-00000000-0000-0000-0000-000000000002',
        organizationId: orgId,
        role: 'MEMBER',
        status: 'PENDING',
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: adminUserId,
      },
    });
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.userInvitation.deleteMany({
        where: { email: { startsWith: TEST_PREFIX.toLowerCase() } },
      });
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
  // Case 1: Register without invitation token
  // ═══════════════════════════════════════════════════════════

  describe('Case 1: Register without invitation token', () => {
    it('should return 401 for registration without inviteToken', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'random@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 2: Register with valid invitation token
  // ═══════════════════════════════════════════════════════════

  describe('Case 2: Register with valid invitation token', () => {
    let response: request.Response;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `${TEST_PREFIX.toLowerCase()}_new@test.com`,
          password: 'password123',
          name: 'New User',
          inviteToken: validInviteToken,
        });
    });

    it('should return 201 Created', () => {
      expect(response.status).toBe(201);
    });

    it('should return accessToken', () => {
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should return user with organizationId', () => {
      expect(response.body.data.user).toHaveProperty('organizationId', orgId);
    });

    it('should create OrganizationMember record', async () => {
      const user = response.body.data.user;
      const membership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: orgId,
            userId: user.id,
          },
        },
      });
      expect(membership).toBeTruthy();
      expect(membership!.role).toBe('MEMBER');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 3: Register with duplicate (used) token
  // ═══════════════════════════════════════════════════════════

  describe('Case 3: Register with duplicate token', () => {
    it('should return 401 for used token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'another@test.com',
          password: 'password123',
          inviteToken: validInviteToken,
        });

      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 4: Register with expired token
  // ═══════════════════════════════════════════════════════════

  describe('Case 4: Register with expired token', () => {
    it('should return 401 for expired token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `${TEST_PREFIX.toLowerCase()}_expired@test.com`,
          password: 'password123',
          inviteToken: 'expired-test-token-00000000-0000-0000-0000-000000000002',
        });

      expect(res.status).toBe(401);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 5: Login after registration
  // ═══════════════════════════════════════════════════════════

  describe('Case 5: Login works', () => {
    it('should login with registered user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: `${TEST_PREFIX.toLowerCase()}_new@test.com`,
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // Case 6: Create invitation (Admin only)
  // ═══════════════════════════════════════════════════════════

  describe('Case 6: Create invitation', () => {
    it('should return 201 for admin creating invitation', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: `${TEST_PREFIX.toLowerCase()}_invited@test.com`,
          role: 'MEMBER',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe(`${TEST_PREFIX.toLowerCase()}_invited@test.com`);
      expect(res.body.data.status).toBe('PENDING');
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/invitations')
        .send({
          email: 'someone@test.com',
        });

      expect(res.status).toBe(401);
    });
  });
});