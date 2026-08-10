import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import {
  DemandMatchStatus,
  DemandStatus,
  NotificationStatus,
  NotificationType,
  OfferStatus,
  RFQResponseStatus,
  RFQStatus,
} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('Workspace E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const TEST_PREFIX = 'E2E_WORKSPACE';
  const testEmails = {
    buyerA: `${TEST_PREFIX.toLowerCase()}_buyer_a@test.com`,
    buyerB: `${TEST_PREFIX.toLowerCase()}_buyer_b@test.com`,
    supplierA: `${TEST_PREFIX.toLowerCase()}_supplier_a@test.com`,
    supplierB: `${TEST_PREFIX.toLowerCase()}_supplier_b@test.com`,
    noOrg: `${TEST_PREFIX.toLowerCase()}_no_org@test.com`,
  };

  let buyerAOrgId: string;
  let buyerBOrgId: string;
  let supplierAOrgId: string;
  let supplierBOrgId: string;

  let buyerAUserId: string;
  let buyerBUserId: string;
  let supplierAUserId: string;
  let supplierBUserId: string;
  let noOrgUserId: string;

  let buyerAToken: string;
  let buyerBToken: string;
  let supplierAToken: string;
  let supplierBToken: string;
  let noOrgToken: string;

  let categoryId: string;
  let productA1Id: string;
  let productA2Id: string;
  let productB1Id: string;

  let demandA1Id: string;
  let demandA2Id: string;
  let demandB1Id: string;

  let offerA1Id: string;
  let offerA2Id: string;
  let offerB1Id: string;

  let matchA1Id: string;
  let matchA2Id: string;
  let matchB1Id: string;

  let rfqA1Id: string;
  let rfqA2Id: string;
  let rfqB1Id: string;

  let responseA1Id: string;
  let responseA2Id: string;
  let responseB1Id: string;

  const signToken = (userId: string, email: string, name: string, organizationId?: string | null) =>
    jwtService.sign({
      sub: userId,
      email,
      name,
      organizationId: organizationId ?? null,
    });

  const getWithToken = (path: string, token: string) =>
    request(app.getHttpServer()).get(path).set('Authorization', `Bearer ${token}`);

  const sortIds = (items: Array<{ id: string }>) => items.map((item) => item.id).sort();

  const cleanupTestData = async () => {
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: Object.values(testEmails),
        },
      },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);

    if (existingUserIds.length > 0) {
      await prisma.workflowEvent.deleteMany({
        where: { operatorId: { in: existingUserIds } },
      });
      await prisma.notification.deleteMany({
        where: { userId: { in: existingUserIds } },
      });
      await prisma.auditLog.deleteMany({
        where: { operatorId: { in: existingUserIds } },
      });
      await prisma.refreshToken.deleteMany({
        where: { userId: { in: existingUserIds } },
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
      where: {
        title: { startsWith: TEST_PREFIX },
      },
    });
    await prisma.demand.deleteMany({
      where: {
        title: { startsWith: TEST_PREFIX },
      },
    });
    await prisma.product.deleteMany({
      where: {
        name: { startsWith: TEST_PREFIX },
      },
    });
    await prisma.productCategory.deleteMany({
      where: {
        slug: `${TEST_PREFIX.toLowerCase()}_category`,
      },
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
      where: {
        name: { startsWith: TEST_PREFIX },
      },
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

    const passwordHash = await bcrypt.hash('test123', 10);

    const [buyerAOrg, buyerBOrg, supplierAOrg, supplierBOrg] = await Promise.all([
      prisma.organization.create({
        data: { name: `${TEST_PREFIX}_BuyerOrg_A`, type: 'BUYER' },
      }),
      prisma.organization.create({
        data: { name: `${TEST_PREFIX}_BuyerOrg_B`, type: 'BUYER' },
      }),
      prisma.organization.create({
        data: { name: `${TEST_PREFIX}_SupplierOrg_A`, type: 'SUPPLIER' },
      }),
      prisma.organization.create({
        data: { name: `${TEST_PREFIX}_SupplierOrg_B`, type: 'SUPPLIER' },
      }),
    ]);

    buyerAOrgId = buyerAOrg.id;
    buyerBOrgId = buyerBOrg.id;
    supplierAOrgId = supplierAOrg.id;
    supplierBOrgId = supplierBOrg.id;

    const [buyerAUser, buyerBUser, supplierAUser, supplierBUser, noOrgUser] = await Promise.all([
      prisma.user.create({
        data: {
          email: testEmails.buyerA,
          passwordHash,
          name: `${TEST_PREFIX} Buyer A`,
          organizationId: buyerAOrgId,
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          email: testEmails.buyerB,
          passwordHash,
          name: `${TEST_PREFIX} Buyer B`,
          organizationId: buyerBOrgId,
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          email: testEmails.supplierA,
          passwordHash,
          name: `${TEST_PREFIX} Supplier A`,
          organizationId: supplierAOrgId,
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          email: testEmails.supplierB,
          passwordHash,
          name: `${TEST_PREFIX} Supplier B`,
          organizationId: supplierBOrgId,
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          email: testEmails.noOrg,
          passwordHash,
          name: `${TEST_PREFIX} No Org`,
          status: 'ACTIVE',
        },
      }),
    ]);

    buyerAUserId = buyerAUser.id;
    buyerBUserId = buyerBUser.id;
    supplierAUserId = supplierAUser.id;
    supplierBUserId = supplierBUser.id;
    noOrgUserId = noOrgUser.id;

    await prisma.organizationMember.createMany({
      data: [
        { organizationId: buyerAOrgId, userId: buyerAUserId, role: 'MEMBER' },
        { organizationId: buyerBOrgId, userId: buyerBUserId, role: 'MEMBER' },
        { organizationId: supplierAOrgId, userId: supplierAUserId, role: 'MEMBER' },
        { organizationId: supplierBOrgId, userId: supplierBUserId, role: 'MEMBER' },
      ],
    });

    buyerAToken = signToken(buyerAUserId, testEmails.buyerA, buyerAUser.name ?? 'Buyer A', buyerAOrgId);
    buyerBToken = signToken(buyerBUserId, testEmails.buyerB, buyerBUser.name ?? 'Buyer B', buyerBOrgId);
    supplierAToken = signToken(
      supplierAUserId,
      testEmails.supplierA,
      supplierAUser.name ?? 'Supplier A',
      supplierAOrgId,
    );
    supplierBToken = signToken(
      supplierBUserId,
      testEmails.supplierB,
      supplierBUser.name ?? 'Supplier B',
      supplierBOrgId,
    );
    noOrgToken = signToken(noOrgUserId, testEmails.noOrg, noOrgUser.name ?? 'No Org', null);

    const category = await prisma.productCategory.create({
      data: {
        name: `${TEST_PREFIX}_Category`,
        slug: `${TEST_PREFIX.toLowerCase()}_category`,
      },
    });
    categoryId = category.id;

    const [productA1, productA2, productB1] = await Promise.all([
      prisma.product.create({
        data: {
          categoryId,
          name: `${TEST_PREFIX}_Product_A1`,
          model: `${TEST_PREFIX}-A1`,
          description: 'Workspace E2E product A1',
          status: 'ACTIVE',
        },
      }),
      prisma.product.create({
        data: {
          categoryId,
          name: `${TEST_PREFIX}_Product_A2`,
          model: `${TEST_PREFIX}-A2`,
          description: 'Workspace E2E product A2',
          status: 'ACTIVE',
        },
      }),
      prisma.product.create({
        data: {
          categoryId,
          name: `${TEST_PREFIX}_Product_B1`,
          model: `${TEST_PREFIX}-B1`,
          description: 'Workspace E2E product B1',
          status: 'ACTIVE',
        },
      }),
    ]);

    productA1Id = productA1.id;
    productA2Id = productA2.id;
    productB1Id = productB1.id;

    const [demandA1, demandA2, demandB1] = await Promise.all([
      prisma.demand.create({
        data: {
          title: `${TEST_PREFIX}_Demand_A1`,
          description: 'Buyer A demand 1',
          organizationId: buyerAOrgId,
          createdBy: buyerAUserId,
          status: DemandStatus.PUBLISHED,
          publishedAt: new Date('2026-08-10T00:00:00.000Z'),
        },
      }),
      prisma.demand.create({
        data: {
          title: `${TEST_PREFIX}_Demand_A2`,
          description: 'Buyer A demand 2',
          organizationId: buyerAOrgId,
          createdBy: buyerAUserId,
          status: DemandStatus.PROCESSING,
        },
      }),
      prisma.demand.create({
        data: {
          title: `${TEST_PREFIX}_Demand_B1`,
          description: 'Buyer B demand 1',
          organizationId: buyerBOrgId,
          createdBy: buyerBUserId,
          status: DemandStatus.PUBLISHED,
          publishedAt: new Date('2026-08-10T00:00:00.000Z'),
        },
      }),
    ]);

    demandA1Id = demandA1.id;
    demandA2Id = demandA2.id;
    demandB1Id = demandB1.id;

    const [offerA1, offerA2, offerB1] = await Promise.all([
      prisma.offer.create({
        data: {
          organizationId: supplierAOrgId,
          productId: productA1Id,
          createdBy: supplierAUserId,
          title: `${TEST_PREFIX}_Offer_A1`,
          description: 'Supplier A offer 1',
          status: OfferStatus.ACTIVE,
        },
      }),
      prisma.offer.create({
        data: {
          organizationId: supplierAOrgId,
          productId: productA2Id,
          createdBy: supplierAUserId,
          title: `${TEST_PREFIX}_Offer_A2`,
          description: 'Supplier A offer 2',
          status: OfferStatus.ACTIVE,
        },
      }),
      prisma.offer.create({
        data: {
          organizationId: supplierBOrgId,
          productId: productB1Id,
          createdBy: supplierBUserId,
          title: `${TEST_PREFIX}_Offer_B1`,
          description: 'Supplier B offer 1',
          status: OfferStatus.ACTIVE,
        },
      }),
    ]);

    offerA1Id = offerA1.id;
    offerA2Id = offerA2.id;
    offerB1Id = offerB1.id;

    const [matchA1, matchA2, matchB1] = await Promise.all([
      prisma.demandMatch.create({
        data: {
          demandId: demandA1Id,
          productId: productA1Id,
          offerId: offerA1Id,
          matchScore: 98.5,
          matchStatus: DemandMatchStatus.ACCEPTED,
          matchDetails: { scope: 'workspace-e2e', lane: 'buyer-a-1' },
          matchedAt: new Date('2026-08-10T01:00:00.000Z'),
          reviewedAt: new Date('2026-08-10T01:05:00.000Z'),
        },
      }),
      prisma.demandMatch.create({
        data: {
          demandId: demandA2Id,
          productId: productA2Id,
          offerId: offerA2Id,
          matchScore: 91.2,
          matchStatus: DemandMatchStatus.MATCHED,
          matchDetails: { scope: 'workspace-e2e', lane: 'buyer-a-2' },
          matchedAt: new Date('2026-08-10T02:00:00.000Z'),
        },
      }),
      prisma.demandMatch.create({
        data: {
          demandId: demandB1Id,
          productId: productB1Id,
          offerId: offerB1Id,
          matchScore: 88.8,
          matchStatus: DemandMatchStatus.REVIEWED,
          matchDetails: { scope: 'workspace-e2e', lane: 'buyer-b-1' },
          matchedAt: new Date('2026-08-10T03:00:00.000Z'),
          reviewedAt: new Date('2026-08-10T03:05:00.000Z'),
        },
      }),
    ]);

    matchA1Id = matchA1.id;
    matchA2Id = matchA2.id;
    matchB1Id = matchB1.id;

    const [rfqA1, rfqA2, rfqB1] = await Promise.all([
      prisma.rFQ.create({
        data: {
          demandId: demandA1Id,
          sourceMatchId: matchA1Id,
          targetOrganizationId: supplierAOrgId,
          createdBy: buyerAUserId,
          status: RFQStatus.OPEN,
          publishedAt: new Date('2026-08-10T04:00:00.000Z'),
        },
      }),
      prisma.rFQ.create({
        data: {
          demandId: demandA2Id,
          sourceMatchId: matchA2Id,
          targetOrganizationId: supplierAOrgId,
          createdBy: buyerAUserId,
          status: RFQStatus.DRAFT,
        },
      }),
      prisma.rFQ.create({
        data: {
          demandId: demandB1Id,
          sourceMatchId: matchB1Id,
          targetOrganizationId: supplierBOrgId,
          createdBy: buyerBUserId,
          status: RFQStatus.OPEN,
          publishedAt: new Date('2026-08-10T05:00:00.000Z'),
        },
      }),
    ]);

    rfqA1Id = rfqA1.id;
    rfqA2Id = rfqA2.id;
    rfqB1Id = rfqB1.id;

    const reviewedAt = new Date('2026-08-10T06:00:00.000Z');

    const [responseA1, responseA2, responseB1] = await Promise.all([
      prisma.rFQResponse.create({
        data: {
          rfqId: rfqA1Id,
          organizationId: supplierAOrgId,
          offerId: offerA1Id,
          message: 'Supplier A submitted response',
          status: RFQResponseStatus.SUBMITTED,
        },
      }),
      prisma.rFQResponse.create({
        data: {
          rfqId: rfqA2Id,
          organizationId: supplierAOrgId,
          offerId: offerA2Id,
          message: 'Supplier A accepted response history',
          status: RFQResponseStatus.ACCEPTED,
          reviewedBy: buyerAUserId,
          reviewedAt,
          decisionNote: 'Accepted in prior review',
        },
      }),
      prisma.rFQResponse.create({
        data: {
          rfqId: rfqB1Id,
          organizationId: supplierBOrgId,
          offerId: offerB1Id,
          message: 'Supplier B submitted response',
          status: RFQResponseStatus.SUBMITTED,
        },
      }),
    ]);

    responseA1Id = responseA1.id;
    responseA2Id = responseA2.id;
    responseB1Id = responseB1.id;

    await prisma.notification.createMany({
      data: [
        {
          userId: buyerAUserId,
          type: NotificationType.RESPONSE_UPDATE,
          status: NotificationStatus.UNREAD,
          title: `${TEST_PREFIX} Buyer A Notification`,
          message: 'Buyer A unread notification',
          referenceType: 'RFQ_RESPONSE',
          referenceId: responseA1Id,
        },
        {
          userId: supplierAUserId,
          type: NotificationType.RFQ_UPDATE,
          status: NotificationStatus.UNREAD,
          title: `${TEST_PREFIX} Supplier A Notification`,
          message: 'Supplier A unread notification',
          referenceType: 'RFQ',
          referenceId: rfqA1Id,
        },
        {
          userId: buyerBUserId,
          type: NotificationType.RESPONSE_UPDATE,
          status: NotificationStatus.UNREAD,
          title: `${TEST_PREFIX} Buyer B Notification`,
          message: 'Buyer B unread notification',
          referenceType: 'RFQ_RESPONSE',
          referenceId: responseB1Id,
        },
        {
          userId: supplierBUserId,
          type: NotificationType.RFQ_UPDATE,
          status: NotificationStatus.UNREAD,
          title: `${TEST_PREFIX} Supplier B Notification`,
          message: 'Supplier B unread notification',
          referenceType: 'RFQ',
          referenceId: rfqB1Id,
        },
        {
          userId: supplierAUserId,
          type: NotificationType.RFQ_UPDATE,
          status: NotificationStatus.READ,
          title: `${TEST_PREFIX} Supplier A Read Notification`,
          message: 'Supplier A read notification',
          referenceType: 'RFQ',
          referenceId: rfqA2Id,
        },
      ],
    });
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

  describe('Buyer Workspace', () => {
    it('Buyer can access own organization overview data', async () => {
      const res = await getWithToken('/api/v1/workspace/buyer/overview', buyerAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.demandSummary.total).toBe(2);
      expect(res.body.data.demandSummary.statusCounts.PUBLISHED).toBe(1);
      expect(res.body.data.demandSummary.statusCounts.PROCESSING).toBe(1);
      expect(res.body.data.matchSummary.total).toBe(2);
      expect(res.body.data.matchSummary.statusCounts.ACCEPTED).toBe(1);
      expect(res.body.data.matchSummary.statusCounts.MATCHED).toBe(1);
      expect(res.body.data.rfqSummary.total).toBe(2);
      expect(res.body.data.responseSummary.pendingCount).toBe(1);
      expect(res.body.data.responseSummary.acceptedCount).toBe(1);
      expect(res.body.data.responseSummary.rejectedCount).toBe(0);
      expect(res.body.data.notificationSummary.unreadCount).toBe(1);
    });

    it('Buyer can access only its own demand list', async () => {
      const res = await getWithToken('/api/v1/workspace/buyer/demands', buyerAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(sortIds(res.body.data)).toEqual([demandA1Id, demandA2Id].sort());

      const demandMap = new Map(
        res.body.data.map((item: { id: string; matchCount: number; rfqCount: number }) => [
          item.id,
          item,
        ]),
      );

      expect(demandMap.get(demandA1Id)).toMatchObject({ matchCount: 1, rfqCount: 1 });
      expect(demandMap.get(demandA2Id)).toMatchObject({ matchCount: 1, rfqCount: 1 });
      expect(demandMap.has(demandB1Id)).toBe(false);
    });

    it('Buyer can access only its own pending decisions', async () => {
      const res = await getWithToken('/api/v1/workspace/buyer/pending-decisions', buyerAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(sortIds(res.body.data)).toEqual([responseA1Id]);
      expect(res.body.data[0]).toMatchObject({
        id: responseA1Id,
        status: RFQResponseStatus.SUBMITTED,
        supplierOrganization: {
          id: supplierAOrgId,
          type: 'SUPPLIER',
        },
        demand: {
          id: demandA1Id,
          title: `${TEST_PREFIX}_Demand_A1`,
        },
        rfq: {
          id: rfqA1Id,
          status: RFQStatus.OPEN,
        },
      });
    });

    it('Buyer without organizationId cannot access buyer workspace APIs', async () => {
      for (const path of [
        '/api/v1/workspace/buyer/overview',
        '/api/v1/workspace/buyer/demands',
        '/api/v1/workspace/buyer/pending-decisions',
      ]) {
        const res = await getWithToken(path, noOrgToken);
        expect(res.status).toBe(403);
      }
    });

    it('Supplier role cannot access buyer workspace APIs', async () => {
      for (const path of [
        '/api/v1/workspace/buyer/overview',
        '/api/v1/workspace/buyer/demands',
        '/api/v1/workspace/buyer/pending-decisions',
      ]) {
        const res = await getWithToken(path, supplierAToken);
        expect(res.status).toBe(403);
      }
    });

    it('Buyer A data is isolated from Buyer B data', async () => {
      const [buyerADemandsRes, buyerBDemandsRes, buyerAPendingRes, buyerBPendingRes] = await Promise.all([
        getWithToken('/api/v1/workspace/buyer/demands', buyerAToken),
        getWithToken('/api/v1/workspace/buyer/demands', buyerBToken),
        getWithToken('/api/v1/workspace/buyer/pending-decisions', buyerAToken),
        getWithToken('/api/v1/workspace/buyer/pending-decisions', buyerBToken),
      ]);

      expect(sortIds(buyerADemandsRes.body.data)).toEqual([demandA1Id, demandA2Id].sort());
      expect(sortIds(buyerBDemandsRes.body.data)).toEqual([demandB1Id]);
      expect(sortIds(buyerAPendingRes.body.data)).toEqual([responseA1Id]);
      expect(sortIds(buyerBPendingRes.body.data)).toEqual([responseB1Id]);
      expect(sortIds(buyerADemandsRes.body.data)).not.toEqual(sortIds(buyerBDemandsRes.body.data));
      expect(sortIds(buyerAPendingRes.body.data)).not.toEqual(sortIds(buyerBPendingRes.body.data));
    });
  });

  describe('Supplier Workspace', () => {
    it('Supplier can access own organization overview data', async () => {
      const res = await getWithToken('/api/v1/workspace/supplier/overview', supplierAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rfqSummary.total).toBe(2);
      expect(res.body.data.rfqSummary.statusCounts.OPEN).toBe(1);
      expect(res.body.data.rfqSummary.statusCounts.DRAFT).toBe(1);
      expect(res.body.data.responseSummary.total).toBe(2);
      expect(res.body.data.responseSummary.statusCounts.SUBMITTED).toBe(1);
      expect(res.body.data.responseSummary.statusCounts.ACCEPTED).toBe(1);
      expect(res.body.data.notificationSummary.unreadCount).toBe(1);
      expect(res.body.data.matchSummary.total).toBe(2);
      expect(res.body.data.matchSummary.statusCounts.ACCEPTED).toBe(1);
      expect(res.body.data.matchSummary.statusCounts.MATCHED).toBe(1);
    });

    it('Supplier can access only RFQs assigned to its own organization', async () => {
      const res = await getWithToken('/api/v1/workspace/supplier/rfqs', supplierAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(sortIds(res.body.data)).toEqual([rfqA1Id, rfqA2Id].sort());

      const rfqMap = new Map(res.body.data.map((item: { id: string }) => [item.id, item]));
      expect(rfqMap.get(rfqA1Id)).toMatchObject({
        id: rfqA1Id,
        title: `${TEST_PREFIX}_Demand_A1`,
        reference: rfqA1Id,
        status: RFQStatus.OPEN,
        buyerOrganization: {
          id: buyerAOrgId,
          type: 'BUYER',
        },
      });
      expect(rfqMap.get(rfqA2Id)).toMatchObject({
        id: rfqA2Id,
        title: `${TEST_PREFIX}_Demand_A2`,
        reference: rfqA2Id,
        status: RFQStatus.DRAFT,
      });
      expect(rfqMap.has(rfqB1Id)).toBe(false);
    });

    it('Supplier can access only responses submitted by its own organization', async () => {
      const res = await getWithToken('/api/v1/workspace/supplier/responses', supplierAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(sortIds(res.body.data)).toEqual([responseA1Id, responseA2Id].sort());

      const responseMap = new Map(res.body.data.map((item: { id: string }) => [item.id, item]));
      expect(responseMap.get(responseA1Id)).toMatchObject({
        id: responseA1Id,
        status: RFQResponseStatus.SUBMITTED,
        rfq: {
          id: rfqA1Id,
          title: `${TEST_PREFIX}_Demand_A1`,
          status: RFQStatus.OPEN,
        },
        demand: {
          id: demandA1Id,
          title: `${TEST_PREFIX}_Demand_A1`,
        },
        buyerOrganization: {
          id: buyerAOrgId,
          type: 'BUYER',
        },
      });
      expect(responseMap.get(responseA2Id)).toMatchObject({
        id: responseA2Id,
        status: RFQResponseStatus.ACCEPTED,
        rfq: {
          id: rfqA2Id,
          reference: rfqA2Id,
        },
      });
      expect(responseMap.has(responseB1Id)).toBe(false);
    });

    it('Buyer role cannot access supplier workspace APIs', async () => {
      for (const path of [
        '/api/v1/workspace/supplier/overview',
        '/api/v1/workspace/supplier/rfqs',
        '/api/v1/workspace/supplier/responses',
      ]) {
        const res = await getWithToken(path, buyerAToken);
        expect(res.status).toBe(403);
      }
    });

    it('Supplier A data is isolated from Supplier B data', async () => {
      const [supplierARfqsRes, supplierBRfqsRes, supplierAResponsesRes, supplierBResponsesRes] =
        await Promise.all([
          getWithToken('/api/v1/workspace/supplier/rfqs', supplierAToken),
          getWithToken('/api/v1/workspace/supplier/rfqs', supplierBToken),
          getWithToken('/api/v1/workspace/supplier/responses', supplierAToken),
          getWithToken('/api/v1/workspace/supplier/responses', supplierBToken),
        ]);

      expect(sortIds(supplierARfqsRes.body.data)).toEqual([rfqA1Id, rfqA2Id].sort());
      expect(sortIds(supplierBRfqsRes.body.data)).toEqual([rfqB1Id]);
      expect(sortIds(supplierAResponsesRes.body.data)).toEqual([responseA1Id, responseA2Id].sort());
      expect(sortIds(supplierBResponsesRes.body.data)).toEqual([responseB1Id]);
      expect(sortIds(supplierARfqsRes.body.data)).not.toEqual(sortIds(supplierBRfqsRes.body.data));
      expect(sortIds(supplierAResponsesRes.body.data)).not.toEqual(sortIds(supplierBResponsesRes.body.data));
    });
  });
});
