import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplierProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * DiscoveryService — M28.0 Hybrid Model C Aggregation Foundation.
 *
 * Service-layer aggregation graph:
 *   Capability (Platform Product)
 *        ↓
 *     SupplierProducts   (SupplierProduct.platformProductId -> Product.id)
 *        ↓
 *     Offers             (Offer.supplierProductId -> SupplierProduct.id)
 *
 * This is an internal read/aggregation foundation. It intentionally does NOT
 * modify Search, Matching, or any other module. No transport layer here.
 */
@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregate the capability graph for a Platform Product:
   *   Capability → SupplierProducts → Offers (commercial sources).
   *
   * Only PUBLISHED supplier products are surfaced by default (reviewed content).
   * SupplierProducts are ordered deterministically (createdAt desc, then id).
   */
  async findCapabilityGraph(
    platformProductId: string,
    params: { includeDrafts?: boolean } = {},
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: platformProductId },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        status: true,
      },
    });
    if (!product) {
      throw new NotFoundException(
        `Platform Product ${platformProductId} not found`,
      );
    }

    const statusFilter = params.includeDrafts
      ? undefined
      : (SupplierProductStatus.PUBLISHED as SupplierProductStatus);

    const supplierProducts = await this.prisma.supplierProduct.findMany({
      where: {
        platformProductId,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        organizationId: true,
        brand: true,
        series: true,
        modelNumber: true,
        slug: true,
        status: true,
        description: true,
        technicalDescription: true,
        organization: { select: { id: true, name: true } },
        media: {
          where: { isPrimary: true },
          take: 1,
          select: { id: true, fileAssetId: true, mediaType: true, title: true },
        },
        // SupplierProduct technical overrides — the Buyer Comparison data source.
        // Only the parameter definitions needed for rendering are exposed; no raw
        // governance data. M28.1 M667 SupplierProduct Comparison Experience.
        parameterValues: {
          select: {
            id: true,
            parameterDefinitionId: true,
            value: true,
            valueNumber: true,
            parameterDefinition: {
              select: {
                id: true,
                name: true,
                code: true,
                dataType: true,
                unit: true,
                parameterGroupId: true,
              },
            },
          },
        },
      },
    });

    const supplierProductIds = supplierProducts.map((sp) => sp.id);

    const offers =
      supplierProductIds.length > 0
        ? await this.prisma.offer.findMany({
            where: { supplierProductId: { in: supplierProductIds } },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              organizationId: true,
              productId: true,
              supplierProductId: true,
              title: true,
              description: true,
              price: true,
              currency: true,
              status: true,
            },
          })
        : [];

    return {
      capability: product,
      supplierProducts,
      offers,
      _meta: {
        capabilityId: platformProductId,
        supplierProductCount: supplierProducts.length,
        offerCount: offers.length,
      },
    };
  }

  /**
   * Aggregate the commercial layer for a SupplierProduct:
   *   SupplierProduct → Offers (its commercial records) → Capability.
   *
   * Ownership-isolated consumer: pass the owning organizationId to keep reads scoped.
   */
  async findSupplierProductCommercials(
    supplierProductId: string,
    organizationId?: string,
  ) {
    const supplierProduct = await this.prisma.supplierProduct.findFirst({
      where: {
        id: supplierProductId,
        ...(organizationId ? { organizationId } : {}),
      },
      select: {
        id: true,
        organizationId: true,
        platformProductId: true,
        brand: true,
        series: true,
        modelNumber: true,
        status: true,
      },
    });
    if (!supplierProduct) {
      throw new NotFoundException(
        `SupplierProduct ${supplierProductId} not found`,
      );
    }

    const offers = await this.prisma.offer.findMany({
      where: { supplierProductId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        organizationId: true,
        productId: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        status: true,
      },
    });

    const platformProduct = await this.prisma.product.findUnique({
      where: { id: supplierProduct.platformProductId },
      select: { id: true, name: true, slug: true, status: true },
    });

    return {
      supplierProduct,
      platformProduct,
      offers,
      _meta: { offerCount: offers.length },
    };
  }
}