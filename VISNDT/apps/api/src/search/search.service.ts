import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus, ContentType, KnowledgeEntryStatus, SupplierProductStatus } from '@prisma/client';

// ============================================
// Unified Search Service — M22.4.1 Unified Search Foundation
//
// Implements 580_ADR-001/002/003:
//   - Single endpoint, unified response contract
//   - KnowledgeEntry replaces Content(KNOWLEDGE) as primary knowledge source
//   - Server-side aggregation (not client-side fan-out)
//
// Retrieval per entity:
//   Product  → name, model, description
//   Knowledge → title, summary, structuredBody (KnowledgeEntry, PUBLISHED)
//   Content   → title, summary (ARTICLE, INSIGHT only; KNOWLEDGE excluded)
//   Solution  → title, summary (SOLUTION)
//   Supplier  → offer title, description (via organization aggregation)
// ============================================

/** Lightweight product result for discovery */
interface ProductDiscoveryItem {
  id: string;
  name: string;
  model: string | null;
  slug: string | null;
  description: string | null;
  category: { id: string; name: string; slug: string } | null;
}

/** Lightweight knowledge entry result */
interface KnowledgeDiscoveryItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  domain: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  publishedAt: Date | null;
}

/** Lightweight content result */
interface ContentDiscoveryItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: Date | null;
  estimatedReadTime: number | null;
  coverImage: { id: string; fileName: string; mimeType: string } | null;
  author: { id: string; name: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string; type: string } }>;
}

/** Lightweight supplier result (aggregated from offers) */
interface SupplierDiscoveryItem {
  organizationId: string;
  organizationName: string;
  offerCount: number;
  offerTitles: string[];
  productNames: string[];
}

/**
 * SupplierProduct discovery item — M28.0 M661.5 Unified Discovery Consolidation.
 *
 * Capability-centric DTO projection (Product = Capability Authority).
 * Only PUBLISHED SupplierProduct ever enters search (published boundary).
 * Result shape: Capability + SupplierProduct + Commercial Summary + Inquiry.
 */
interface SupplierProductDiscoveryItem {
  capability: {
    id: string;
    name: string;
    slug: string | null;
    categoryId: string | null;
  } | null;
  supplierProduct: {
    id: string;
    brand: string;
    series: string | null;
    modelNumber: string;
    slug: string | null;
    status: string;
    platformProductId: string;
  };
  commercialSummary: {
    offerCount: number;
    activeOfferCount: number;
    priceFrom: number | null;
    priceTo: number | null;
    currency: string | null;
  };
  inquiryAvailable: boolean;
}

/** Per-entity search result group */
interface EntitySearchGroup<T> {
  items: T[];
  total: number;
}

/** Unified discovery response */
export interface UnifiedDiscoveryResponse {
  query: string;
  products: EntitySearchGroup<ProductDiscoveryItem>;
  supplierProducts: EntitySearchGroup<SupplierProductDiscoveryItem>;
  knowledge: EntitySearchGroup<KnowledgeDiscoveryItem>;
  content: EntitySearchGroup<ContentDiscoveryItem>;
  solutions: EntitySearchGroup<ContentDiscoveryItem>;
  suppliers: EntitySearchGroup<SupplierDiscoveryItem>;
}

/** A single parsed product filter: parameter + accepted values */
export interface ProductFilter {
  parameterId: string;
  values: string[];
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Execute unified discovery across all entity types.
   * All queries execute in parallel, then results are merged.
   *
   * M24.1.4 — filters only apply to the Product population (server-side,
   * filter-before-pagination). Knowledge/Content/Solution/Supplier are unchanged.
   */
  async search(
    query: string,
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    filters?: string,
    brand?: string,
    series?: string,
    hasActiveOffer?: boolean,
  ): Promise<UnifiedDiscoveryResponse> {
    const skip = (page - 1) * pageSize;
    const productFilters = this.parseFilters(filters);

    const [products, supplierProducts, knowledge, content, solutions, suppliers] = await Promise.all([
      this.searchProducts(query, skip, pageSize, category, productFilters),
      this.searchSupplierProducts(
        query,
        skip,
        pageSize,
        category,
        productFilters,
        brand,
        series,
        hasActiveOffer,
      ),
      this.searchKnowledgeEntries(query, skip, pageSize),
      this.searchContent(query, [ContentType.ARTICLE, ContentType.INSIGHT], skip, pageSize),
      this.searchContent(query, [ContentType.SOLUTION], skip, pageSize),
      this.searchSuppliers(query, skip, pageSize),
    ]);

    this.logger.log(
      `Unified search "${query}": products=${products.total}, supplierProducts=${supplierProducts.total}, knowledge=${knowledge.total}, content=${content.total}, solutions=${solutions.total}, suppliers=${suppliers.total}`,
    );

    return {
      query,
      products,
      supplierProducts,
      knowledge,
      content,
      solutions,
      suppliers,
    };
  }

  // ============================================
  // Filter Contract Parsing
  // ============================================

  /**
   * Parse the minimal filter wire format:
   *   `parameterId:value1,value2;parameterId2:value3`
   *
   * Semantics:
   *   - Same parameterId → values joined with OR
   *   - Different parameterId → joined with AND (handled by where.AND)
   */
  private parseFilters(raw?: string): ProductFilter[] {
    if (!raw) return [];

    const filters: ProductFilter[] = [];
    for (const part of raw.split(';')) {
      const colonIdx = part.indexOf(':');
      if (colonIdx === -1) continue;

      const parameterId = part.slice(0, colonIdx).trim();
      const values = part
        .slice(colonIdx + 1)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      if (parameterId && values.length > 0) {
        filters.push({ parameterId, values });
      }
    }
    return filters;
  }

  // ============================================
  // Product Search Adapter
  // ============================================
  private async searchProducts(
    keyword: string,
    skip: number,
    take: number,
    category?: string,
    filters: ProductFilter[] = [],
  ): Promise<EntitySearchGroup<ProductDiscoveryItem>> {
    // Filter-before-pagination: category + parameter filters are applied to
    // the WHERE clause so the filtered candidate population drives pagination.
    const parameterAnds = filters.map((f) => ({
      parameterValues: {
        some: {
          parameterDefinitionId: f.parameterId,
          value: { in: f.values },
        },
      },
    }));

    const where = {
      status: 'ACTIVE' as const,
      ...(category ? { categoryId: category } : {}),
      OR: [
        { name: { contains: keyword, mode: 'insensitive' as const } },
        { model: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
      ],
      ...(parameterAnds.length > 0 ? { AND: parameterAnds } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          model: true,
          slug: true,
          description: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  // ============================================
  // SupplierProduct Search Adapter (M28.0 M661.5)
  // ============================================

  /**
   * SupplierProduct search dimension integrated into the unified `/search`.
   *
   * Consolidation of 661.4 SupplierProduct search into the single unified
   * discovery model. Search = Discovery Acceleration Layer, NOT Business
   * Authority; Platform Product remains the Capability Authority.
   *
   * Published Boundary: only SupplierProductStatus.PUBLISHED ever enters search.
   * Result Projection: Capability + SupplierProduct + Commercial Summary + Inquiry.
   * Results are DTO projections — no raw Prisma relation is returned.
   */
  private async searchSupplierProducts(
    keyword: string,
    skip: number,
    take: number,
    category?: string,
    filters: ProductFilter[] = [],
    brand?: string,
    series?: string,
    hasActiveOffer?: boolean,
  ): Promise<EntitySearchGroup<SupplierProductDiscoveryItem>> {
    const ands: Record<string, unknown>[] = [];

    // ─── Published boundary (M661.5 §5.1) ───
    ands.push({ status: SupplierProductStatus.PUBLISHED });

    // Keyword matches Capability (platform product) OR Supplier Model identity.
    if (keyword) {
      ands.push({
        OR: [
          { brand: { contains: keyword, mode: 'insensitive' as const } },
          { series: { contains: keyword, mode: 'insensitive' as const } },
          { modelNumber: { contains: keyword, mode: 'insensitive' as const } },
          {
            platformProduct: {
              OR: [
                { name: { contains: keyword, mode: 'insensitive' as const } },
                { model: { contains: keyword, mode: 'insensitive' as const } },
                { description: { contains: keyword, mode: 'insensitive' as const } },
              ],
            },
          },
        ],
      });
    }

    // Capability facet (Product = Capability Authority).
    if (category) {
      ands.push({ platformProduct: { categoryId: category } });
    }

    // Supplier Model facet (brand / series).
    if (brand) {
      ands.push({ brand: { contains: brand, mode: 'insensitive' as const } });
    }
    if (series) {
      ands.push({ series: { contains: series, mode: 'insensitive' as const } });
    }

    // Commercial availability facet: Has Active Offer.
    if (hasActiveOffer === true) {
      ands.push({ offers: { some: { status: 'ACTIVE' } } });
    }

    // Technical parameter facet: one AND per parameter, OR within values.
    for (const f of filters) {
      ands.push({
        parameterValues: {
          some: {
            parameterDefinitionId: f.parameterId,
            value: { in: f.values },
          },
        },
      });
    }

    const where = ands.length === 1 ? ands[0] : { AND: ands };

    const [items, total] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        skip,
        take,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
        select: {
          id: true,
          brand: true,
          series: true,
          modelNumber: true,
          slug: true,
          status: true,
          platformProductId: true,
          platformProduct: {
            select: { id: true, name: true, slug: true, categoryId: true },
          },
          offers: {
            select: { id: true, status: true, price: true, currency: true },
          },
          organization: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    const projected: SupplierProductDiscoveryItem[] = items.map((sp) => {
      const offers = sp.offers ?? [];
      const activeOffers = offers.filter((o) => o.status === 'ACTIVE');
      const prices = activeOffers
        .map((o) => Number(o.price))
        .filter((p) => Number.isFinite(p) && p > 0)
        .sort((a, b) => a - b);

      return {
        capability: sp.platformProduct
          ? {
              id: sp.platformProduct.id,
              name: sp.platformProduct.name,
              slug: sp.platformProduct.slug,
              categoryId: sp.platformProduct.categoryId,
            }
          : {
              id: sp.platformProductId,
              name: '',
              slug: null,
              categoryId: null,
            },
        supplierProduct: {
          id: sp.id,
          brand: sp.brand,
          series: sp.series,
          modelNumber: sp.modelNumber,
          slug: sp.slug,
          status: sp.status,
          platformProductId: sp.platformProductId,
          organization: sp.organization
            ? { id: sp.organization.id, name: sp.organization.name }
            : null,
        },
        commercialSummary: {
          offerCount: offers.length,
          activeOfferCount: activeOffers.length,
          priceFrom: prices.length > 0 ? prices[0] : null,
          priceTo: prices.length > 0 ? prices[prices.length - 1] : null,
          currency:
            activeOffers.find((o) => o.currency)?.currency ??
            offers.find((o) => o.currency)?.currency ??
            null,
        },
        inquiryAvailable: true,
      };
    });

    return { items: projected, total };
  }

  // ============================================
  // KnowledgeEntry Search Adapter (ADR-003)
  // ============================================
  private async searchKnowledgeEntries(
    keyword: string,
    skip: number,
    take: number,
  ): Promise<EntitySearchGroup<KnowledgeDiscoveryItem>> {
    const where = {
      status: KnowledgeEntryStatus.PUBLISHED,
      OR: [
        { title: { contains: keyword, mode: 'insensitive' as const } },
        { summary: { contains: keyword, mode: 'insensitive' as const } },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.knowledgeEntry.findMany({
        where,
        skip,
        take,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          publishedAt: true,
          domain: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.knowledgeEntry.count({ where }),
    ]);

    return { items, total };
  }

  // ============================================
  // Content Search Adapter
  // ============================================
  private async searchContent(
    keyword: string,
    types: ContentType[],
    skip: number,
    take: number,
  ): Promise<EntitySearchGroup<ContentDiscoveryItem>> {
    const where = {
      status: ContentStatus.PUBLISHED,
      type: { in: types },
      OR: [
        { title: { contains: keyword, mode: 'insensitive' as const } },
        { summary: { contains: keyword, mode: 'insensitive' as const } },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          type: true,
          title: true,
          slug: true,
          summary: true,
          publishedAt: true,
          estimatedReadTime: true,
          coverImage: { select: { id: true, fileName: true, mimeType: true } },
          author: { select: { id: true, name: true } },
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true, type: true },
              },
            },
          },
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return { items: items as ContentDiscoveryItem[], total };
  }

  // ============================================
  // Supplier Search Adapter (via Offers)
  // ============================================
  private async searchSuppliers(
    keyword: string,
    _skip: number,
    _take: number,
  ): Promise<EntitySearchGroup<SupplierDiscoveryItem>> {
    // Fetch all matching offers and aggregate by organization
    const offers = await this.prisma.offer.findMany({
      where: {
        status: { in: ['SUBMITTED', 'ACCEPTED'] },
        OR: [
          { title: { contains: keyword, mode: 'insensitive' as const } },
          { description: { contains: keyword, mode: 'insensitive' as const } },
        ],
      },
      select: {
        id: true,
        title: true,
        organization: { select: { id: true, name: true, type: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate by organizationId
    const orgMap = new Map<string, SupplierDiscoveryItem>();
    for (const offer of offers) {
      const orgId = offer.organization.id;
      if (!orgMap.has(orgId)) {
        orgMap.set(orgId, {
          organizationId: orgId,
          organizationName: offer.organization.name,
          offerCount: 0,
          offerTitles: [],
          productNames: [],
        });
      }
      const entry = orgMap.get(orgId)!;
      if (offer.title && !entry.offerTitles.includes(offer.title)) {
        entry.offerTitles.push(offer.title);
      }
      if (offer.product?.name && !entry.productNames.includes(offer.product.name)) {
        entry.productNames.push(offer.product.name);
      }
      entry.offerCount++;
    }

    const items = Array.from(orgMap.values());
    return { items, total: items.length };
  }
}