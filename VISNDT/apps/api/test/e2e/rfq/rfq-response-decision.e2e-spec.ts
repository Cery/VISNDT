import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import {
  DemandMatchStatus,
  DemandStatus,
  NotificationType,
  OfferStatus,
  RFQResponseStatus,
  RFQStatus,
  WorkflowAction,
  WorkflowEntityType,
} from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * M14.3.2.7 RFQ Response Decision E2E Test
 *
 * Covers:
 *   1. Accepted Match -> POST /rfqs/from-match
 *   2. Supplier submit RFQResponse
 *   3. Buyer POST /rfq-responses/:id/view
 *   4. Buyer POST /rfq-responses/:id/accept
 *   5. Buyer POST /rfq-responses/:id/reject
 *   6. Supplier calling accept/reject must fail
 */
describe('RFQ Response Decision E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_RFQ_DECISION';

  const buyerEmail = `${TEST_PREFIX.toLowerCase()}_buyer@test.com`;
  const supplierAdminEmail = `${TEST_PREFIX.toLowerCase()}_supplier_admin@test.com`;
  const supplierMemberEmail = `${TEST_PREFIX.toLowerCase()}_supplier_member@test.com`;

  let buyerOrgId: string;
  let supplierOrgId: string;
  let buyerUserId: string;
  let supplierAdminUserId: string;
  let supplierMemberUserId: string;
  let buyerToken: string;
  let supplierAdminToken: string;
  let supplierMemberToken: string;
  let categoryId: string;
  let productAId: string;
  let productBId: string;
  let demandId: string;
  let offerAId: string;
  let offerBId: string;
  let matchAId: string;
  let matchBId: string;

  let rfqAcceptId: string;
  let rfqRejectId: string;
  let responseAcceptId: string;
  let responseRejectId: string;

  const signToken = (userId: string, email: string, name: string, organizationId: string) =>
    jwtService.sign({
      sub: userId,
      email,
      name,
      organizationId,
    });

  const expectWorkflowEvent = async ({
    entityId,
    entityType,
    action,
    operatorId,
  }: {
    entityId: string;
    entityType: WorkflowEntityType;
    action: WorkflowAction;
    operatorId: string;
  }) => {
    const event = await prisma.workflowEvent.findFirst({
      where: { entityId, entityType, action },
      orderBy: { createdAt: 'desc' },
    });

    expect(event).toBeDefined();
    expect(event!.operatorId).toBe(operatorId);

    return event!;
  };

  const findNotifications = async (userId: string, referenceId: string) =>
    prisma.notification.findMany({
      where: {
        userId,
        type: NotificationType.RESPONSE_UPDATE,
        referenceId,
      },
      orderBy: { createdAt: 'asc' },
    });

  const cleanupTestData = async () => {
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [buyerEmail, supplierAdminEmail, supplierMemberEmail],
        },
      },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);

    if (existingUserIds.length > 0) {
      await prisma.notification.deleteMany({
        where: { userId: { in: existingUserIds } },
      });
      await prisma.auditLog.deleteMany({
        where: { operatorId: { in: existingUserIds } },
      });
      await prisma.workflowEvent.deleteMany({
        where: { operatorId: { in: existingUserIds } },
      });
    }

    await prisma.rFQResponse.deleteMany({
      where: {
        rfq: {
          demand: {
            title: { startsWith: TEST_PREFIX },
          },
        },
      },
    });
    await prisma.rFQ.deleteMany({
      where: {
        demand: {
          title: { startsWith: TEST_PREFIX },
        },
      },
    });
    await prisma.demandMatch.deleteMany({
      where: {
        demand: {
          title: { startsWith: TEST_PREFIX },
        },
      },
    });
    await prisma.offer.deleteMany({
      where: { title: { startsWith: TEST_PREFIX } },
    });
    await prisma.demand.deleteMany({
      where: { title: { startsWith: TEST_PREFIX } },
    });
    await prisma.product.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });
    await prisma.productCategory.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });

    if (existingUserIds.length > 0) {
      await prisma.organizationMember.deleteMany({
        where: { userId: { in: existingUserIds } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: existingUserIds } },
      });
    }

    await prisma.organization.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });
  };

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

    await cleanupTestData();

    const buyerOrg = await prisma.organization.create({
      data: {
        name: `${TEST_PREFIX}_BuyerOrg`,
        type: 'BUYER',
      },
    });
    buyerOrgId = buyerOrg.id;

    const supplierOrg = await prisma.organization.create({
      data: {
        name: `${TEST_PREFIX}_SupplierOrg`,
        type: 'SUPPLIER',
      },
    });
    supplierOrgId = supplierOrg.id;

    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX}_Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_category`,
      },
    });
    categoryId = category.id;

    const [productA, productB] = await Promise.all([
      prisma.product.create({
        data: {
          categoryId,
          name: `${TEST_PREFIX}_Product_A`,
          model: `${TEST_PREFIX}-A`,
          description: 'Targeted RFQ product A',
          status: 'ACTIVE',
        },
      }),
      prisma.product.create({
        data: {
          categoryId,
          name: `${TEST_PREFIX}_Product_B`,
          model: `${TEST_PREFIX}-B`,
          description: 'Targeted RFQ product B',
          status: 'ACTIVE',
        },
      }),
    ]);
    productAId = productA.id;
    productBId = productB.id;

    const [buyerPasswordHash, supplierAdminPasswordHash, supplierMemberPasswordHash] =
      await Promise.all([
        bcrypt.hash('test123', 10),
        bcrypt.hash('test123', 10),
        bcrypt.hash('test123', 10),
      ]);

    const buyerUser = await prisma.user.create({
      data: {
        email: buyerEmail,
        passwordHash: buyerPasswordHash,
        name: `${TEST_PREFIX} Buyer`,
        organizationId: buyerOrgId,
        status: 'ACTIVE',
      },
    });
    buyerUserId = buyerUser.id;

    const supplierAdminUser = await prisma.user.create({
      data: {
        email: supplierAdminEmail,
        passwordHash: supplierAdminPasswordHash,
        name: `${TEST_PREFIX} Supplier Admin`,
        organizationId: supplierOrgId,
        status: 'ACTIVE',
      },
    });
    supplierAdminUserId = supplierAdminUser.id;

    const supplierMemberUser = await prisma.user.create({
      data: {
        email: supplierMemberEmail,
        passwordHash: supplierMemberPasswordHash,
        name: `${TEST_PREFIX} Supplier Member`,
        organizationId: supplierOrgId,
        status: 'ACTIVE',
      },
    });
    supplierMemberUserId = supplierMemberUser.id;

    await prisma.organizationMember.createMany({
      data: [
        {
          organizationId: buyerOrgId,
          userId: buyerUserId,
          role: 'MEMBER',
        },
        {
          organizationId: supplierOrgId,
          userId: supplierAdminUserId,
          role: 'ADMIN',
        },
        {
          organizationId: supplierOrgId,
          userId: supplierMemberUserId,
          role: 'MEMBER',
        },
      ],
    });

    buyerToken = signToken(
      buyerUserId,
      buyerEmail,
      buyerUser.name ?? `${TEST_PREFIX} Buyer`,
      buyerOrgId,
    );
    supplierAdminToken = signToken(
      supplierAdminUserId,
      supplierAdminEmail,
      supplierAdminUser.name ?? `${TEST_PREFIX} Supplier Admin`,
      supplierOrgId,
    );
    supplierMemberToken = signToken(
      supplierMemberUserId,
      supplierMemberEmail,
      supplierMemberUser.name ?? `${TEST_PREFIX} Supplier Member`,
      supplierOrgId,
    );

    const demand = await prisma.demand.create({
      data: {
        title: `${TEST_PREFIX}_Demand`,
        description: 'Buyer demand for targeted RFQ decision flow',
        organizationId: buyerOrgId,
        createdBy: buyerUserId,
        status: DemandStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
    demandId = demand.id;

    const [offerA, offerB] = await Promise.all([
      prisma.offer.create({
        data: {
          organizationId: supplierOrgId,
          productId: productAId,
          createdBy: supplierAdminUserId,
          title: `${TEST_PREFIX}_Offer_A`,
          description: 'Supplier offer for decision accept flow',
          status: OfferStatus.ACTIVE,
        },
      }),
      prisma.offer.create({
        data: {
          organizationId: supplierOrgId,
          productId: productBId,
          createdBy: supplierAdminUserId,
          title: `${TEST_PREFIX}_Offer_B`,
          description: 'Supplier offer for decision reject flow',
          status: OfferStatus.ACTIVE,
        },
      }),
    ]);
    offerAId = offerA.id;
    offerBId = offerB.id;

    const [matchA, matchB] = await Promise.all([
      prisma.demandMatch.create({
        data: {
          demandId,
          productId: productAId,
          offerId: offerAId,
          matchScore: 98.2,
          matchStatus: DemandMatchStatus.ACCEPTED,
          matchDetails: { channel: 'e2e', path: 'accept' },
          matchedAt: new Date(),
          reviewedAt: new Date(),
        },
      }),
      prisma.demandMatch.create({
        data: {
          demandId,
          productId: productBId,
          offerId: offerBId,
          matchScore: 97.6,
          matchStatus: DemandMatchStatus.ACCEPTED,
          matchDetails: { channel: 'e2e', path: 'reject' },
          matchedAt: new Date(),
          reviewedAt: new Date(),
        },
      }),
    ]);
    matchAId = matchA.id;
    matchBId = matchB.id;
  }, 30000);

  afterAll(async () => {
    try {
      if (prisma) {
        await cleanupTestData();
      }
    } catch (error) {
      console.warn('Cleanup warning:', (error as Error).message);
    }

    if (app) {
      await app.close();
    }
  });

  describe('Case 1: Accepted Match -> POST /rfqs/from-match', () => {
    it('should create targeted RFQ for accept flow and emit workflow + notification', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/rfqs/from-match')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ matchId: matchAId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sourceMatchId).toBe(matchAId);
      expect(res.body.data.targetOrganizationId).toBe(supplierOrgId);
      expect(res.body.data.status).toBe(RFQStatus.DRAFT);
      rfqAcceptId = res.body.data.id;

      const rfq = await prisma.rFQ.findUnique({
        where: { id: rfqAcceptId },
      });
      expect(rfq).toBeDefined();
      expect(rfq!.demandId).toBe(demandId);
      expect(rfq!.sourceMatchId).toBe(matchAId);
      expect(rfq!.targetOrganizationId).toBe(supplierOrgId);

      const createdEvent = await expectWorkflowEvent({
        entityId: rfqAcceptId,
        entityType: WorkflowEntityType.RFQ,
        action: WorkflowAction.CREATED,
        operatorId: buyerUserId,
      });
      const metadata = createdEvent.metadata as Record<string, unknown> | null;
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.demandId).toBe(demandId);
        expect(metadata.sourceMatchId).toBe(matchAId);
        expect(metadata.targetOrganizationId).toBe(supplierOrgId);
      }

      const supplierNotification = await prisma.notification.findFirst({
        where: {
          userId: supplierAdminUserId,
          type: NotificationType.RFQ_UPDATE,
          referenceId: rfqAcceptId,
        },
      });
      expect(supplierNotification).toBeDefined();
      expect(supplierNotification!.title).toBe('New RFQ Assigned');
    });

    it('should create targeted RFQ for reject flow', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/rfqs/from-match')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ matchId: matchBId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sourceMatchId).toBe(matchBId);
      expect(res.body.data.targetOrganizationId).toBe(supplierOrgId);
      expect(res.body.data.status).toBe(RFQStatus.DRAFT);
      rfqRejectId = res.body.data.id;
    });

    it('should publish both targeted RFQs so supplier can respond', async () => {
      for (const rfqId of [rfqAcceptId, rfqRejectId]) {
        const res = await request(app.getHttpServer())
          .post(`/api/v1/rfqs/${rfqId}/publish`)
          .set('Authorization', `Bearer ${buyerToken}`);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe(RFQStatus.OPEN);
        expect(res.body.data.publishedAt).toBeDefined();
      }
    });
  });

  describe('Case 2: Supplier submit RFQResponse', () => {
    it('should submit response for accept flow and notify buyer', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfqs/${rfqAcceptId}/responses`)
        .set('Authorization', `Bearer ${supplierMemberToken}`)
        .send({
          offerId: offerAId,
          message: 'Supplier response for accept flow',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rfqId).toBe(rfqAcceptId);
      expect(res.body.data.organizationId).toBe(supplierOrgId);
      expect(res.body.data.status).toBe(RFQResponseStatus.SUBMITTED);
      responseAcceptId = res.body.data.id;

      const response = await prisma.rFQResponse.findUnique({
        where: { id: responseAcceptId },
      });
      expect(response).toBeDefined();
      expect(response!.offerId).toBe(offerAId);
      expect(response!.message).toBe('Supplier response for accept flow');
      expect(response!.reviewedBy).toBeNull();
      expect(response!.reviewedAt).toBeNull();
      expect(response!.decisionNote).toBeNull();

      const buyerNotification = await prisma.notification.findFirst({
        where: {
          userId: buyerUserId,
          type: NotificationType.RESPONSE_UPDATE,
          referenceId: responseAcceptId,
        },
      });
      expect(buyerNotification).toBeDefined();
      expect(buyerNotification!.title).toBe('New RFQ Response');
    });

    it('should submit response for reject flow and notify buyer', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfqs/${rfqRejectId}/responses`)
        .set('Authorization', `Bearer ${supplierMemberToken}`)
        .send({
          offerId: offerBId,
          message: 'Supplier response for reject flow',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rfqId).toBe(rfqRejectId);
      expect(res.body.data.organizationId).toBe(supplierOrgId);
      expect(res.body.data.status).toBe(RFQResponseStatus.SUBMITTED);
      responseRejectId = res.body.data.id;
    });
  });

  describe('Case 3: Supplier permission guard on accept/reject', () => {
    it('should reject supplier accept and reject calls with 403', async () => {
      for (const action of ['accept', 'reject'] as const) {
        const res = await request(app.getHttpServer())
          .post(`/api/v1/rfq-responses/${responseAcceptId}/${action}`)
          .set('Authorization', `Bearer ${supplierMemberToken}`)
          .send({ decisionNote: `Supplier should not ${action}` });

        expect(res.status).toBe(403);
      }

      const response = await prisma.rFQResponse.findUnique({
        where: { id: responseAcceptId },
      });
      expect(response).toBeDefined();
      expect(response!.status).toBe(RFQResponseStatus.SUBMITTED);
      expect(response!.reviewedBy).toBeNull();
      expect(response!.reviewedAt).toBeNull();
      expect(response!.decisionNote).toBeNull();
    });

    it('should also reject supplier admin accept and reject calls with 403', async () => {
      for (const action of ['accept', 'reject'] as const) {
        const res = await request(app.getHttpServer())
          .post(`/api/v1/rfq-responses/${responseRejectId}/${action}`)
          .set('Authorization', `Bearer ${supplierAdminToken}`)
          .send({ decisionNote: `Supplier admin should not ${action}` });

        expect(res.status).toBe(403);
      }
    });
  });

  describe('Case 4: Buyer view and accept response', () => {
    it('should mark response as VIEWED and create reviewed workflow event without notification', async () => {
      const beforeNotifications = await findNotifications(supplierAdminUserId, responseAcceptId);

      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfq-responses/${responseAcceptId}/view`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(RFQResponseStatus.VIEWED);
      expect(res.body.data.reviewedBy).toBe(buyerUserId);
      expect(res.body.data.reviewedAt).toBeDefined();
      expect(res.body.data.decisionNote).toBeNull();

      const response = await prisma.rFQResponse.findUnique({
        where: { id: responseAcceptId },
      });
      expect(response).toBeDefined();
      expect(response!.status).toBe(RFQResponseStatus.VIEWED);
      expect(response!.reviewedBy).toBe(buyerUserId);
      expect(response!.reviewedAt).not.toBeNull();
      expect(response!.decisionNote).toBeNull();

      const reviewedEvent = await expectWorkflowEvent({
        entityId: responseAcceptId,
        entityType: WorkflowEntityType.RFQ_RESPONSE,
        action: WorkflowAction.REVIEWED,
        operatorId: buyerUserId,
      });
      const metadata = reviewedEvent.metadata as Record<string, unknown> | null;
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.previousStatus).toBe(RFQResponseStatus.SUBMITTED);
        expect(metadata.rfqId).toBe(rfqAcceptId);
        expect(metadata.demandId).toBe(demandId);
        expect(metadata.buyerOrganizationId).toBe(buyerOrgId);
        expect(metadata.supplierOrganizationId).toBe(supplierOrgId);
        expect(metadata.targetOrganizationId).toBe(supplierOrgId);
      }

      const afterNotifications = await findNotifications(supplierAdminUserId, responseAcceptId);
      expect(afterNotifications).toHaveLength(beforeNotifications.length);
    });

    it('should accept response, persist decision fields, create workflow event and notification', async () => {
      const decisionNote = 'Accepted after buyer review';

      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfq-responses/${responseAcceptId}/accept`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ decisionNote });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(RFQResponseStatus.ACCEPTED);
      expect(res.body.data.reviewedBy).toBe(buyerUserId);
      expect(res.body.data.reviewedAt).toBeDefined();
      expect(res.body.data.decisionNote).toBe(decisionNote);

      const response = await prisma.rFQResponse.findUnique({
        where: { id: responseAcceptId },
      });
      expect(response).toBeDefined();
      expect(response!.status).toBe(RFQResponseStatus.ACCEPTED);
      expect(response!.reviewedBy).toBe(buyerUserId);
      expect(response!.reviewedAt).not.toBeNull();
      expect(response!.decisionNote).toBe(decisionNote);

      const acceptedEvent = await expectWorkflowEvent({
        entityId: responseAcceptId,
        entityType: WorkflowEntityType.RFQ_RESPONSE,
        action: WorkflowAction.ACCEPTED,
        operatorId: buyerUserId,
      });
      const metadata = acceptedEvent.metadata as Record<string, unknown> | null;
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.previousStatus).toBe(RFQResponseStatus.VIEWED);
        expect(metadata.rfqId).toBe(rfqAcceptId);
        expect(metadata.demandId).toBe(demandId);
        expect(metadata.buyerOrganizationId).toBe(buyerOrgId);
        expect(metadata.supplierOrganizationId).toBe(supplierOrgId);
        expect(metadata.targetOrganizationId).toBe(supplierOrgId);
        expect(metadata.decisionNote).toBe(decisionNote);
      }

      const notifications = await findNotifications(supplierAdminUserId, responseAcceptId);
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Response Accepted');
      expect(notifications[0].message).toContain('has been accepted');
      expect(notifications[0].message).toContain(decisionNote);
    });
  });

  describe('Case 5: Buyer view and reject response', () => {
    it('should mark response as VIEWED before reject flow', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfq-responses/${responseRejectId}/view`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(RFQResponseStatus.VIEWED);
      expect(res.body.data.reviewedBy).toBe(buyerUserId);
      expect(res.body.data.reviewedAt).toBeDefined();
      expect(res.body.data.decisionNote).toBeNull();
    });

    it('should reject response, persist decision fields, create workflow event and notification', async () => {
      const decisionNote = 'Rejected due to delivery mismatch';

      const res = await request(app.getHttpServer())
        .post(`/api/v1/rfq-responses/${responseRejectId}/reject`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ decisionNote });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe(RFQResponseStatus.REJECTED);
      expect(res.body.data.reviewedBy).toBe(buyerUserId);
      expect(res.body.data.reviewedAt).toBeDefined();
      expect(res.body.data.decisionNote).toBe(decisionNote);

      const response = await prisma.rFQResponse.findUnique({
        where: { id: responseRejectId },
      });
      expect(response).toBeDefined();
      expect(response!.status).toBe(RFQResponseStatus.REJECTED);
      expect(response!.reviewedBy).toBe(buyerUserId);
      expect(response!.reviewedAt).not.toBeNull();
      expect(response!.decisionNote).toBe(decisionNote);

      const rejectedEvent = await expectWorkflowEvent({
        entityId: responseRejectId,
        entityType: WorkflowEntityType.RFQ_RESPONSE,
        action: WorkflowAction.REJECTED,
        operatorId: buyerUserId,
      });
      const metadata = rejectedEvent.metadata as Record<string, unknown> | null;
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.previousStatus).toBe(RFQResponseStatus.VIEWED);
        expect(metadata.rfqId).toBe(rfqRejectId);
        expect(metadata.demandId).toBe(demandId);
        expect(metadata.buyerOrganizationId).toBe(buyerOrgId);
        expect(metadata.supplierOrganizationId).toBe(supplierOrgId);
        expect(metadata.targetOrganizationId).toBe(supplierOrgId);
        expect(metadata.decisionNote).toBe(decisionNote);
      }

      const notifications = await findNotifications(supplierAdminUserId, responseRejectId);
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Response Rejected');
      expect(notifications[0].message).toContain('has been rejected');
      expect(notifications[0].message).toContain(decisionNote);
    });
  });
});
