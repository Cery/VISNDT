import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  DemandMatchStatus,
  DemandStatus,
  NotificationStatus,
  OfferStatus,
  RFQStatus,
  RFQResponseStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { WorkspaceBuyerDemandDto } from './dto/workspace-buyer-demand.dto';
import { WorkspaceBuyerOverviewDto } from './dto/workspace-buyer-overview.dto';
import { WorkspaceBuyerPendingResponseDto } from './dto/workspace-buyer-pending-response.dto';
import { WorkspaceSupplierOverviewDto } from './dto/workspace-supplier-overview.dto';
import { WorkspaceSupplierResponseDto } from './dto/workspace-supplier-response.dto';
import { WorkspaceSupplierRfqDto } from './dto/workspace-supplier-rfq.dto';
import {
  WorkspaceSupplierProductDto,
  WorkspaceSupplierProductsDto,
} from './dto/workspace-supplier-product.dto';
import { WorkspaceSupplierProductsQueryDto } from './dto/workspace-supplier-products-query.dto';
import { WorkspaceSupplierInquiryContextDto } from './dto/workspace-supplier-inquiry-context.dto';

type BuyerWorkspaceUser = AuthRequest['user'];

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  getStatus() {
    return {
      module: 'workspace',
      status: 'ready',
    };
  }

  async getBuyerOverview(user: BuyerWorkspaceUser): Promise<WorkspaceBuyerOverviewDto> {
    const organizationId = this.getBuyerOrganizationId(user);

    const [
      demandTotal,
      demandStatusGroups,
      matchTotal,
      matchStatusGroups,
      rfqTotal,
      pendingCount,
      acceptedCount,
      rejectedCount,
      unreadCount,
    ] = await Promise.all([
      this.prisma.demand.count({
        where: { organizationId },
      }),
      this.prisma.demand.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { _all: true },
      }),
      this.prisma.demandMatch.count({
        where: {
          demand: {
            organizationId,
          },
        },
      }),
      this.prisma.demandMatch.groupBy({
        by: ['matchStatus'],
        where: {
          demand: {
            organizationId,
          },
        },
        _count: { _all: true },
      }),
      this.prisma.rFQ.count({
        where: {
          demand: {
            organizationId,
          },
        },
      }),
      this.prisma.rFQResponse.count({
        where: {
          status: RFQResponseStatus.SUBMITTED,
          rfq: {
            demand: {
              organizationId,
            },
          },
        },
      }),
      this.prisma.rFQResponse.count({
        where: {
          status: RFQResponseStatus.ACCEPTED,
          rfq: {
            demand: {
              organizationId,
            },
          },
        },
      }),
      this.prisma.rFQResponse.count({
        where: {
          status: RFQResponseStatus.REJECTED,
          rfq: {
            demand: {
              organizationId,
            },
          },
        },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.UNREAD,
          user: {
            organizationId,
          },
        },
      }),
    ]);

    return {
      demandSummary: {
        total: demandTotal,
        statusCounts: this.createStatusCountMap(
          Object.values(DemandStatus),
          demandStatusGroups.map((group) => ({
            key: group.status,
            count: group._count._all,
          })),
        ),
      },
      matchSummary: {
        total: matchTotal,
        statusCounts: this.createStatusCountMap(
          Object.values(DemandMatchStatus),
          matchStatusGroups.map((group) => ({
            key: group.matchStatus,
            count: group._count._all,
          })),
        ),
      },
      rfqSummary: {
        total: rfqTotal,
      },
      responseSummary: {
        pendingCount,
        acceptedCount,
        rejectedCount,
      },
      notificationSummary: {
        unreadCount,
      },
    };
  }

  async getBuyerDemands(user: BuyerWorkspaceUser): Promise<WorkspaceBuyerDemandDto[]> {
    const organizationId = this.getBuyerOrganizationId(user);

    const demands = await this.prisma.demand.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            matches: true,
            rfqs: true,
          },
        },
      },
    });

    return demands.map((demand) => ({
      id: demand.id,
      title: demand.title,
      status: demand.status,
      createdAt: demand.createdAt,
      updatedAt: demand.updatedAt,
      matchCount: demand._count.matches,
      rfqCount: demand._count.rfqs,
    }));
  }

  async getBuyerPendingDecisions(user: BuyerWorkspaceUser): Promise<WorkspaceBuyerPendingResponseDto[]> {
    const organizationId = this.getBuyerOrganizationId(user);

    const responses = await this.prisma.rFQResponse.findMany({
      where: {
        status: RFQResponseStatus.SUBMITTED,
        rfq: {
          demand: {
            organizationId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        rfq: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            demand: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return responses.map((response) => ({
      id: response.id,
      status: response.status,
      pendingSince: response.createdAt,
      rfq: {
        id: response.rfq.id,
        status: response.rfq.status,
        createdAt: response.rfq.createdAt,
        updatedAt: response.rfq.updatedAt,
      },
      demand: {
        id: response.rfq.demand.id,
        title: response.rfq.demand.title,
        status: response.rfq.demand.status,
        createdAt: response.rfq.demand.createdAt,
        updatedAt: response.rfq.demand.updatedAt,
      },
      supplierOrganization: {
        id: response.organization.id,
        name: response.organization.name,
        type: response.organization.type,
      },
    }));
  }

  async getSupplierOverview(user: BuyerWorkspaceUser): Promise<WorkspaceSupplierOverviewDto> {
    const organizationId = this.getSupplierOrganizationId(user);

    const [
      rfqTotal,
      rfqStatusGroups,
      responseTotal,
      responseStatusGroups,
      unreadCount,
      matchTotal,
      matchStatusGroups,
    ] = await Promise.all([
      this.prisma.rFQ.count({
        where: { targetOrganizationId: organizationId },
      }),
      this.prisma.rFQ.groupBy({
        by: ['status'],
        where: { targetOrganizationId: organizationId },
        _count: { _all: true },
      }),
      this.prisma.rFQResponse.count({
        where: { organizationId },
      }),
      this.prisma.rFQResponse.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { _all: true },
      }),
      this.prisma.notification.count({
        where: {
          status: NotificationStatus.UNREAD,
          user: {
            organizationId,
          },
        },
      }),
      this.prisma.demandMatch.count({
        where: {
          offer: {
            organizationId,
          },
        },
      }),
      this.prisma.demandMatch.groupBy({
        by: ['matchStatus'],
        where: {
          offer: {
            organizationId,
          },
        },
        _count: { _all: true },
      }),
    ]);

    return {
      rfqSummary: {
        total: rfqTotal,
        statusCounts: this.createStatusCountMap(
          Object.values(RFQStatus),
          rfqStatusGroups.map((group) => ({
            key: group.status,
            count: group._count._all,
          })),
        ),
      },
      responseSummary: {
        total: responseTotal,
        statusCounts: this.createStatusCountMap(
          Object.values(RFQResponseStatus),
          responseStatusGroups.map((group) => ({
            key: group.status,
            count: group._count._all,
          })),
        ),
      },
      notificationSummary: {
        unreadCount,
      },
      matchSummary: {
        total: matchTotal,
        statusCounts: this.createStatusCountMap(
          Object.values(DemandMatchStatus),
          matchStatusGroups.map((group) => ({
            key: group.matchStatus,
            count: group._count._all,
          })),
        ),
      },
    };
  }

  async getSupplierRfqs(user: BuyerWorkspaceUser): Promise<WorkspaceSupplierRfqDto[]> {
    const organizationId = this.getSupplierOrganizationId(user);

    const rfqs = await this.prisma.rFQ.findMany({
      where: {
        targetOrganizationId: organizationId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        demand: {
          select: {
            title: true,
            organization: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return rfqs.map((rfq) => ({
      id: rfq.id,
      title: rfq.demand.title,
      reference: rfq.id,
      status: rfq.status,
      createdAt: rfq.createdAt,
      updatedAt: rfq.updatedAt,
      buyerOrganization: {
        id: rfq.demand.organization?.id,
        name: rfq.demand.organization?.name,
        type: rfq.demand.organization?.type,
      },
    }));
  }

  async getSupplierResponses(user: BuyerWorkspaceUser): Promise<WorkspaceSupplierResponseDto[]> {
    const organizationId = this.getSupplierOrganizationId(user);

    const responses = await this.prisma.rFQResponse.findMany({
      where: {
        organizationId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        rfq: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            demand: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                organization: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return responses.map((response) => ({
      id: response.id,
      status: response.status,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      rfq: {
        id: response.rfq.id,
        title: response.rfq.demand.title,
        reference: response.rfq.id,
        status: response.rfq.status,
        createdAt: response.rfq.createdAt,
        updatedAt: response.rfq.updatedAt,
      },
      demand: {
        id: response.rfq.demand.id,
        title: response.rfq.demand.title,
        status: response.rfq.demand.status,
        createdAt: response.rfq.demand.createdAt,
        updatedAt: response.rfq.demand.updatedAt,
      },
      buyerOrganization: {
        id: response.rfq.demand.organization?.id,
        name: response.rfq.demand.organization?.name,
        type: response.rfq.demand.organization?.type,
      },
    }));
  }

  /**
   * Supplier Runtime — SupplierProduct Overview.
   *
   * Predicate: organizationId → SupplierProduct List → Published / Active Context.
   * Read-only. Exposes the supplier's own capability models with their lifecycle
   * status and a summarized commercial availability (Offer = Commercial Layer).
   */
  async getSupplierProducts(
    user: BuyerWorkspaceUser,
    query?: WorkspaceSupplierProductsQueryDto,
  ): Promise<WorkspaceSupplierProductsDto> {
    const organizationId = this.getSupplierOrganizationId(user);

    const page = Math.max(1, query?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query?.pageSize ?? 20));
    const skip = (page - 1) * pageSize;

    // Conditional filters: status (multi) / series / unified search (q).
    const conditions: Record<string, unknown>[] = [{ organizationId }];

    const rawQ = query?.q?.trim();
    if (rawQ) {
      conditions.push({
        OR: [
          { brand: { contains: rawQ, mode: 'insensitive' as const } },
          { series: { contains: rawQ, mode: 'insensitive' as const } },
          { modelNumber: { contains: rawQ, mode: 'insensitive' as const } },
          {
            platformProduct: {
              OR: [
                { name: { contains: rawQ, mode: 'insensitive' as const } },
                { model: { contains: rawQ, mode: 'insensitive' as const } },
              ],
            },
          },
        ],
      });
    }

    const rawStatus = query?.status?.trim();
    const statusList = rawStatus
      ? rawStatus.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    if (statusList.length > 0) {
      conditions.push({ status: { in: statusList } });
    }

    const rawSeries = query?.series?.trim();
    if (rawSeries) {
      conditions.push({ series: { contains: rawSeries, mode: 'insensitive' as const } });
    }

    const where = conditions.length === 1 ? conditions[0] : { AND: conditions };

    const [supplierProducts, total] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          brand: true,
          series: true,
          modelNumber: true,
          slug: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
          platformProduct: { select: { id: true, name: true } },
          offers: { select: { id: true, status: true, price: true } },
        },
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    const data: WorkspaceSupplierProductDto[] = supplierProducts.map(
      (item) => {
        const offers = item.offers ?? [];
        const activeOffers = offers.filter(
          (offer) => offer.status === OfferStatus.ACTIVE,
        );
        const publishedPrices = activeOffers
          .map((offer) => (offer.price !== null ? Number(offer.price) : null))
          .filter((price): price is number => price !== null && !Number.isNaN(price));

        return {
          id: item.id,
          brand: item.brand,
          series: item.series,
          modelNumber: item.modelNumber,
          slug: item.slug,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          platformProduct: item.platformProduct,
          commercialSummary: {
            total: offers.length,
            activeCount: activeOffers.length,
            minPrice:
              publishedPrices.length > 0
                ? Math.min(...publishedPrices)
                : null,
            maxPrice:
              publishedPrices.length > 0
                ? Math.max(...publishedPrices)
                : null,
          },
        };
      },
    );

    return { data, total, page, pageSize };
  }

  /**
   * Supplier Runtime — Inquiry Context View (read-only).
   *
   * Predicate: SupplierProduct → Related Inquiry Context.
   * Buyer Interest is surfaced at the Platform Capability level (the Platform
   * Product the SupplierProduct anchors on), preserving cross-model interest.
   * Ownership of the SupplierProduct is enforced before any inquiry is read.
   */
  async getSupplierInquiryContext(
    user: BuyerWorkspaceUser,
    supplierProductId: string,
  ): Promise<WorkspaceSupplierInquiryContextDto> {
    const organizationId = this.getSupplierOrganizationId(user);

    const supplierProduct = await this.prisma.supplierProduct.findFirst({
      where: { id: supplierProductId, organizationId },
      select: {
        brand: true,
        series: true,
        modelNumber: true,
        status: true,
        platformProductId: true,
        platformProduct: { select: { name: true } },
      },
    });
    if (!supplierProduct) {
      throw new ForbiddenException(
        `SupplierProduct ${supplierProductId} does not belong to organization ${organizationId}`,
      );
    }

    const inquiries = await this.prisma.inquiry.findMany({
      where: { productId: supplierProduct.platformProductId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        contactName: true,
        message: true,
        createdAt: true,
      },
    });

    const supplierModelLabel =
      `${supplierProduct.brand} ${supplierProduct.series ?? ''} ${supplierProduct.modelNumber}`.trim();

    return {
      supplierProductId,
      supplierModelLabel,
      status: supplierProduct.status,
      platformProductId: supplierProduct.platformProductId,
      platformProductName: supplierProduct.platformProduct?.name ?? '',
      inquiries: inquiries.map((inquiry) => ({
        id: inquiry.id,
        status: inquiry.status,
        contactName: inquiry.contactName,
        message: inquiry.message,
        createdAt: inquiry.createdAt,
      })),
      total: inquiries.length,
    };
  }

  private getBuyerOrganizationId(user: BuyerWorkspaceUser): string {
    if (user.workspaceRole !== 'BUYER') {
      throw new ForbiddenException('Buyer workspace APIs are only available to BUYER users');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('Buyer workspace APIs require an organization context');
    }

    return user.organizationId;
  }

  private getSupplierOrganizationId(user: BuyerWorkspaceUser): string {
    if (user.workspaceRole !== 'SUPPLIER') {
      throw new ForbiddenException('Supplier workspace APIs are only available to SUPPLIER users');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('Supplier workspace APIs require an organization context');
    }

    return user.organizationId;
  }

  private createStatusCountMap<TStatus extends string>(
    statuses: readonly TStatus[],
    entries: Array<{ key: TStatus; count: number }>,
  ): Record<TStatus, number> {
    const initialCounts = statuses.reduce(
      (accumulator, status) => {
        accumulator[status] = 0;
        return accumulator;
      },
      {} as Record<TStatus, number>,
    );

    for (const entry of entries) {
      initialCounts[entry.key] = entry.count;
    }

    return initialCounts;
  }
}
