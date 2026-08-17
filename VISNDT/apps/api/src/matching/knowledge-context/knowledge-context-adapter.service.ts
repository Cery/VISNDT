import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  KnowledgeContext,
  KnowledgeEntryRef,
  KnowledgeDomainRef,
  KnowledgeCategoryRef,
} from './knowledge-context.types';

/**
 * KnowledgeContextAdapter
 *
 * M23.0 Read-side Capability Foundation.
 *
 * Resolves Knowledge Context from a DemandMatch without modifying:
 * - MatchingService
 * - ScoringService
 * - weighted_v1 algorithm
 * - DemandMatch schema
 * - Database structure
 *
 * Resolution Flow:
 *   DemandMatch → Product → ProductCategory
 *     → KnowledgeDomain (name-based match)
 *     → KnowledgeCategory (under domain)
 *     → KnowledgeEntry (PUBLISHED, in domain/category)
 *     → KnowledgeRelation (PREREQUISITE / RELATED / FOLLOWUP)
 *     → KnowledgeContext
 */
@Injectable()
export class KnowledgeContextAdapter {
  private readonly logger = new Logger(KnowledgeContextAdapter.name);

  /** Maximum number of relevant entries to include per category */
  private readonly MAX_RELEVANT_ENTRIES = 5;

  /** Maximum number of relation entries to include per type */
  private readonly MAX_RELATION_ENTRIES = 5;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve the Knowledge Context for a given DemandMatch.
   *
   * @param matchId - The DemandMatch UUID
   * @returns KnowledgeContext — runtime computed, not persisted
   * @throws NotFoundException if the match does not exist
   */
  async resolveKnowledgeContext(matchId: string): Promise<KnowledgeContext> {
    // Step 1: Load the DemandMatch with product + category info
    const match = await this.prisma.demandMatch.findUnique({
      where: { id: matchId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    const productCategory = match.product.category;
    const productCategoryName = productCategory.name;
    const productCategorySlug = productCategory.slug;

    // Step 2: Find matching KnowledgeDomain by product category name/slug
    const domain = await this.resolveKnowledgeDomain(
      productCategoryName,
      productCategorySlug,
    );

    // Step 3: Find matching KnowledgeCategory under the domain
    const category = domain
      ? await this.resolveKnowledgeCategory(domain.id, productCategoryName)
      : null;

    // Step 4: Find relevant KnowledgeEntries
    const entryFilter = domain
      ? { domainId: domain.id }
      : {};
    const categoryFilter = category
      ? { categoryId: category.id }
      : {};

    const relevantEntries = await this.findRelevantEntries({
      ...entryFilter,
      ...categoryFilter,
    });

    // Step 5: Resolve KnowledgeRelations for relevant entries
    const { prerequisite, related, followup } =
      await this.resolveRelations(relevantEntries);

    this.logger.log(
      `Resolved KnowledgeContext for match ${matchId}: domain=${domain?.slug ?? 'none'}, entries=${relevantEntries.length}, prerequisite=${prerequisite.length}, related=${related.length}, followup=${followup.length}`,
    );

    return {
      domain: domain
        ? { id: domain.id, name: domain.name, slug: domain.slug }
        : null,
      category: category
        ? { id: category.id, name: category.name, slug: category.slug }
        : null,
      relevantEntries,
      prerequisiteKnowledge: prerequisite,
      relatedKnowledge: related,
      followupKnowledge: followup,
    };
  }

  /**
   * Resolve a KnowledgeDomain matching the product category.
   * Uses name-based matching (case-insensitive) then falls back to slug prefix.
   */
  private async resolveKnowledgeDomain(
    productCategoryName: string,
    productCategorySlug: string,
  ): Promise<KnowledgeDomainRef | null> {
    // Try exact name match first
    let domain = await this.prisma.knowledgeDomain.findFirst({
      where: { name: { equals: productCategoryName, mode: 'insensitive' } },
      select: { id: true, name: true, slug: true },
    });

    if (domain) return domain;

    // Try contains match on name
    domain = await this.prisma.knowledgeDomain.findFirst({
      where: { name: { contains: productCategoryName, mode: 'insensitive' } },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (domain) return domain;

    // Try slug match
    domain = await this.prisma.knowledgeDomain.findFirst({
      where: { slug: { contains: productCategorySlug, mode: 'insensitive' } },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    return domain ?? null;
  }

  /**
   * Resolve a KnowledgeCategory under the domain matching the product category.
   */
  private async resolveKnowledgeCategory(
    domainId: string,
    productCategoryName: string,
  ): Promise<KnowledgeCategoryRef | null> {
    // Try name match within domain
    let category = await this.prisma.knowledgeCategory.findFirst({
      where: {
        domainId,
        name: { contains: productCategoryName, mode: 'insensitive' },
      },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (category) return category;

    // Fallback: first category in domain
    category = await this.prisma.knowledgeCategory.findFirst({
      where: { domainId },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: 'asc' },
    });

    return category ?? null;
  }

  /**
   * Find PUBLISHED KnowledgeEntries matching the given filters.
   */
  private async findRelevantEntries(filters: {
    domainId?: string;
    categoryId?: string;
  }): Promise<KnowledgeEntryRef[]> {
    const entries = await this.prisma.knowledgeEntry.findMany({
      where: {
        status: 'PUBLISHED',
        ...filters,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: this.MAX_RELEVANT_ENTRIES,
    });

    return entries;
  }

  /**
   * Resolve KnowledgeRelations for a set of relevant entries.
   * Groups relations by type: PREREQUISITE, RELATED, FOLLOWUP.
   */
  private async resolveRelations(
    entries: KnowledgeEntryRef[],
  ): Promise<{
    prerequisite: KnowledgeEntryRef[];
    related: KnowledgeEntryRef[];
    followup: KnowledgeEntryRef[];
  }> {
    if (entries.length === 0) {
      return { prerequisite: [], related: [], followup: [] };
    }

    const entryIds = entries.map((e) => e.id);

    // Query relations where relevant entries are the source
    const relations = await this.prisma.knowledgeRelation.findMany({
      where: {
        sourceId: { in: entryIds },
        relationType: {
          in: ['PREREQUISITE', 'RELATED', 'FOLLOWUP'],
        },
        target: { status: 'PUBLISHED' },
      },
      include: {
        target: {
          select: { id: true, title: true, slug: true, summary: true },
        },
      },
      take: this.MAX_RELATION_ENTRIES * 3, // Overall limit across all types
    });

    const prerequisite: KnowledgeEntryRef[] = [];
    const related: KnowledgeEntryRef[] = [];
    const followup: KnowledgeEntryRef[] = [];

    for (const rel of relations) {
      const ref: KnowledgeEntryRef = {
        id: rel.target.id,
        title: rel.target.title,
        slug: rel.target.slug,
        summary: rel.target.summary,
      };

      switch (rel.relationType) {
        case 'PREREQUISITE':
          if (prerequisite.length < this.MAX_RELATION_ENTRIES) {
            prerequisite.push(ref);
          }
          break;
        case 'RELATED':
          if (related.length < this.MAX_RELATION_ENTRIES) {
            related.push(ref);
          }
          break;
        case 'FOLLOWUP':
          if (followup.length < this.MAX_RELATION_ENTRIES) {
            followup.push(ref);
          }
          break;
      }
    }

    return { prerequisite, related, followup };
  }
}