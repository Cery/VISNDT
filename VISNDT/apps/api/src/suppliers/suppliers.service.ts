import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListSupplierDto } from './dto/list-supplier.dto';
import {
  SupplierListItemDto,
  SupplierDetailDto,
  SupplierProductDto,
  SupplierMatchDto,
} from './dto/supplier-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all supplier organizations (type='supplier')
   */
  async findAll(query: ListSupplierDto): Promise<{
    items: SupplierListItemDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 20, keyword } = query;
    const skip = (page - 1) * pageSize;

    const where: any = { type: 'supplier' };
    if (keyword) {
      where.name = { contains: keyword, mode: 'insensitive' };
    }

    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { offers: true } },
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    const items: SupplierListItemDto[] = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      type: org.type,
      offersCount: org._count.offers,
    }));

    return { items, total, page, pageSize };
  }

  /**
   * Get supplier detail by organization ID
   */
  async findOne(id: string): Promise<SupplierDetailDto> {
    const org = await this.prisma.organization.findFirst({
      where: { id, type: 'supplier' },
      include: {
        _count: {
          select: {
            offers: true,
            demands: true,
          },
        },
        offers: {
          select: { productId: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Count unique products across all offers
    const uniqueProductIds = new Set(org.offers.map((o) => o.productId));
    const productCount = uniqueProductIds.size;

    // Count total matches across all offers
    const matchCount = await this.prisma.demandMatch.count({
      where: {
        offer: { organizationId: id },
      },
    });

    return {
      id: org.id,
      name: org.name,
      type: org.type,
      status: org.status,
      productCount,
      offerCount: org._count.offers,
      matchCount,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  /**
   * List products offered by a supplier (via Offer model)
   */
  async findProducts(
    id: string,
    pagination: PaginationDto,
  ): Promise<{
    items: SupplierProductDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    // Verify supplier exists
    const supplier = await this.prisma.organization.findFirst({
      where: { id, type: 'supplier' },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [offers, total] = await Promise.all([
      this.prisma.offer.findMany({
        where: { organizationId: id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: { category: true },
          },
        },
      }),
      this.prisma.offer.count({ where: { organizationId: id } }),
    ]);

    const items: SupplierProductDto[] = offers.map((offer) => ({
      id: offer.product.id,
      name: offer.product.name,
      model: offer.product.model || undefined,
      status: offer.product.status,
      category: offer.product.category
        ? {
            id: offer.product.category.id,
            name: offer.product.category.name,
            slug: offer.product.category.slug,
          }
        : null,
      offerStatus: offer.status,
      offerId: offer.id,
    }));

    return { items, total, page, pageSize };
  }

  /**
   * List demand matches for a supplier's offers (JWT protected)
   * Only the supplier's own organization members can view
   */
  async findMatches(
    id: string,
    userOrganizationId: string | undefined,
    pagination: PaginationDto,
  ): Promise<{
    items: SupplierMatchDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    // Verify supplier exists
    const supplier = await this.prisma.organization.findFirst({
      where: { id, type: 'supplier' },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Ownership check: only members of this supplier organization can view matches
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new ForbiddenException(
        'You can only view matches for your own organization',
      );
    }

    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [matches, total] = await Promise.all([
      this.prisma.demandMatch.findMany({
        where: {
          offer: { organizationId: id },
        },
        skip,
        take: pageSize,
        orderBy: { matchedAt: 'desc' },
        include: {
          demand: {
            select: { id: true, title: true, status: true },
          },
          product: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.demandMatch.count({
        where: {
          offer: { organizationId: id },
        },
      }),
    ]);

    const items: SupplierMatchDto[] = matches.map((match) => ({
      id: match.id,
      matchScore: match.matchScore,
      matchStatus: match.matchStatus,
      demand: {
        id: match.demand.id,
        title: match.demand.title,
        status: match.demand.status,
      },
      product: {
        id: match.product.id,
        name: match.product.name,
      },
      matchedAt: match.matchedAt?.toISOString(),
      reviewedAt: match.reviewedAt?.toISOString(),
    }));

    return { items, total, page, pageSize };
  }
}