import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus, ContentType, KnowledgeEntryStatus } from '@prisma/client';

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

/** Per-entity search result group */
interface EntitySearchGroup<T> {
  items: T[];
  total: number;
}

/** Unified discovery response */
export interface UnifiedDiscoveryResponse {
  query: string;
  products: EntitySearchGroup<ProductDiscoveryItem>;
  knowledge: EntitySearchGroup<KnowledgeDiscoveryItem>;
  content: EntitySearchGroup<ContentDiscoveryItem>;
  solutions: EntitySearchGroup<ContentDiscoveryItem>;
  suppliers: EntitySearchGroup<SupplierDiscoveryItem>;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Execute unified discovery across all entity types.
   * All queries execute in parallel, then results are merged.
   */
  async search(query: string, page: number = 1, pageSize: number = 10): Promise<UnifiedDiscoveryResponse> {
    const skip = (page - 1) * pageSize;

    const [products, knowledge, content, solutions, suppliers] = await Promise.all([
      this.searchProducts(query, skip, pageSize),
      this.searchKnowledgeEntries(query, skip, pageSize),
      this.searchContent(query, [ContentType.ARTICLE, ContentType.INSIGHT], skip, pageSize),
      this.searchContent(query, [ContentType.SOLUTION], skip, pageSize),
      this.searchSuppliers(query, skip, pageSize),
    ]);

    this.logger.log(
      `Unified search "${query}": products=${products.total}, knowledge=${knowledge.total}, content=${content.total}, solutions=${solutions.total}, suppliers=${suppliers.total}`,
    );

    return { query, products, knowledge, content, solutions, suppliers };
  }

  // ============================================
  // Product Search Adapter
  // ============================================
  private async searchProducts(
    keyword: string,
    skip: number,
    take: number,
  ): Promise<EntitySearchGroup<ProductDiscoveryItem>> {
    const where = {
      status: 'ACTIVE' as const,
      OR: [
        { name: { contains: keyword, mode: 'insensitive' as const } },
        { model: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
      ],
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