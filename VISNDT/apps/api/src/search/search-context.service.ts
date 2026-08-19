import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  SearchContextResponse,
  RelevantCategoryContext,
  ParameterFacet,
  FacetValue,
} from './search-context.types';

// ============================================
// Search Context Service — M24.1.3
//
// Implements ADR-M24-009/010:
//   - Query-Level Search Context, pagination-independent
//   - Based on Full Matching Candidate Population
//   - Common Filter Intersection (not Union)
//   - Deterministic, data-driven, no AI/LLM
//
// Semantic flow:
//   Search Query
//     → Query Normalization
//     → Candidate Product Population (full, no pagination)
//     → Relevant ProductCategory Context
//     → Relevant Parameter Definitions
//     → Facet Metadata
// ============================================

@Injectable()
export class SearchContextService {
  private readonly logger = new Logger(SearchContextService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Compute query-level search context for the given keyword.
   *
   * This is independent of pagination — it always operates on the
   * full matching candidate population.
   */
  async getContext(query: string): Promise<SearchContextResponse> {
    const normalizedQuery = query.trim();

    // ── Step 1: Find all matching candidate products (full population) ──
    const candidateProducts = await this.findCandidateProducts(normalizedQuery);

    if (candidateProducts.length === 0) {
      this.logger.log(`Search context "${normalizedQuery}": no candidates`);
      return {
        query: normalizedQuery,
        candidateCount: 0,
        relevantCategories: [],
        commonFilters: [],
        categorySpecificFilters: {},
      };
    }

    const candidateIds = candidateProducts.map((p) => p.id);

    // ── Step 2: Extract relevant product categories ──
    const relevantCategories = this.extractRelevantCategories(candidateProducts);

    // ── Step 3: Get all parameter definitions used by candidate products ──
    const categoryParamMap = await this.buildCategoryParameterMap(
      candidateIds,
      relevantCategories,
    );

    // ── Step 4: Compute common filter intersection ──
    const commonFilters = this.computeCommonIntersection(
      relevantCategories,
      categoryParamMap,
    );

    // ── Step 5: Compute category-specific filters ──
    const categorySpecificFilters = this.computeCategorySpecific(
      relevantCategories,
      categoryParamMap,
      commonFilters,
    );

    // ── Step 6: Enrich parameters with available facet values ──
    const allParamIds = new Set<string>();
    commonFilters.forEach((p) => allParamIds.add(p.parameterId));
    Object.values(categorySpecificFilters).forEach((params) =>
      params.forEach((p) => allParamIds.add(p.parameterId)),
    );

    const facetValues = await this.collectFacetValues(candidateIds, [...allParamIds]);

    // Attach facet values to parameter facets
    this.attachFacetValues(commonFilters, facetValues);
    for (const params of Object.values(categorySpecificFilters)) {
      this.attachFacetValues(params, facetValues);
    }

    this.logger.log(
      `Search context "${normalizedQuery}": ${candidateProducts.length} candidates, ` +
        `${relevantCategories.length} categories, ${commonFilters.length} common filters`,
    );

    return {
      query: normalizedQuery,
      candidateCount: candidateProducts.length,
      relevantCategories,
      commonFilters,
      categorySpecificFilters,
    };
  }

  // ─── Step 1: Candidate Product Population ─────────────────

  private async findCandidateProducts(
    keyword: string,
  ): Promise<Array<{ id: string; categoryId: string; category: { name: string; slug: string } }>> {
    return this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: keyword, mode: 'insensitive' as const } },
          { model: { contains: keyword, mode: 'insensitive' as const } },
          { description: { contains: keyword, mode: 'insensitive' as const } },
        ],
      },
      select: {
        id: true,
        categoryId: true,
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      // NO skip / take — full population
    });
  }

  // ─── Step 2: Category Context ─────────────────────────────

  private extractRelevantCategories(
    products: Array<{ id: string; categoryId: string; category: { name: string; slug: string } }>,
  ): RelevantCategoryContext[] {
    const categoryMap = new Map<string, RelevantCategoryContext>();

    for (const p of products) {
      const existing = categoryMap.get(p.categoryId);
      if (existing) {
        existing.productCount++;
      } else {
        categoryMap.set(p.categoryId, {
          id: p.categoryId,
          name: p.category.name,
          slug: p.category.slug,
          productCount: 1,
        });
      }
    }

    // Sort by product count descending
    return [...categoryMap.values()].sort((a, b) => b.productCount - a.productCount);
  }

  // ─── Step 3: Category → Parameter Map ─────────────────────

  /**
   * Build a map from categoryId → parameter definitions
   * by finding which parameters are used by products in each category.
   */
  private async buildCategoryParameterMap(
    candidateIds: string[],
    categories: RelevantCategoryContext[],
  ): Promise<Map<string, ParameterFacet[]>> {
    const categoryParamMap = new Map<string, ParameterFacet[]>();

    // Get all product-parameter associations for candidate products
    const associations = await this.prisma.productParameterDefinition.findMany({
      where: {
        productId: { in: candidateIds },
      },
      select: {
        productId: true,
        displayOrder: true,
        parameterDefinition: {
          select: {
            id: true,
            name: true,
            code: true,
            dataType: true,
            unit: true,
          },
        },
      },
    });

    // Also get parameter values for products that have values but no explicit association
    const paramValues = await this.prisma.productParameterValue.findMany({
      where: {
        productId: { in: candidateIds },
        parameterDefinitionId: {
          notIn: associations.map((a) => a.parameterDefinition.id),
        },
      },
      select: {
        productId: true,
        parameterDefinition: {
          select: {
            id: true,
            name: true,
            code: true,
            dataType: true,
            unit: true,
          },
        },
      },
      distinct: ['productId', 'parameterDefinitionId'],
    });

    // Build productId → categoryId map
    const productCategoryMap = await this.buildProductCategoryMap(candidateIds);

    // Merge all parameter references
    const allParamRefs = [
      ...associations.map((a) => ({
        productId: a.productId,
        parameterId: a.parameterDefinition.id,
        parameterName: a.parameterDefinition.name,
        parameterKey: a.parameterDefinition.code,
        parameterType: a.parameterDefinition.dataType,
        unit: a.parameterDefinition.unit,
        sortOrder: a.displayOrder,
      })),
      ...paramValues.map((pv) => ({
        productId: pv.productId,
        parameterId: pv.parameterDefinition.id,
        parameterName: pv.parameterDefinition.name,
        parameterKey: pv.parameterDefinition.code,
        parameterType: pv.parameterDefinition.dataType,
        unit: pv.parameterDefinition.unit,
        sortOrder: 0,
      })),
    ];

    // Group by category
    for (const cat of categories) {
      const catParams = new Map<string, ParameterFacet>();
      for (const ref of allParamRefs) {
        const catId = productCategoryMap.get(ref.productId);
        if (catId !== cat.id) continue;

        if (!catParams.has(ref.parameterId)) {
          catParams.set(ref.parameterId, {
            parameterId: ref.parameterId,
            parameterName: ref.parameterName,
            parameterKey: ref.parameterKey,
            parameterType: ref.parameterType,
            unit: ref.unit,
            sortOrder: ref.sortOrder,
            availableValues: [],
          });
        }
      }
      categoryParamMap.set(cat.id, [...catParams.values()]);
    }

    return categoryParamMap;
  }

  private async buildProductCategoryMap(
    productIds: string[],
  ): Promise<Map<string, string>> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, categoryId: true },
    });

    const map = new Map<string, string>();
    for (const p of products) {
      map.set(p.id, p.categoryId);
    }
    return map;
  }

  // ─── Step 4: Common Filter Intersection ────────────────────

  /**
   * Common filters = parameters that appear in ALL relevant categories.
   * This is an INTERSECTION, not a UNION.
   */
  private computeCommonIntersection(
    categories: RelevantCategoryContext[],
    categoryParamMap: Map<string, ParameterFacet[]>,
  ): ParameterFacet[] {
    if (categories.length === 0) return [];
    if (categories.length === 1) {
      return categoryParamMap.get(categories[0].id) ?? [];
    }

    // Start with the first category's parameter IDs
    const firstCatParams = categoryParamMap.get(categories[0].id) ?? [];
    const commonParamIds = new Set<string>(
      firstCatParams.map((p) => p.parameterId),
    );

    // Intersect with each subsequent category
    for (let i = 1; i < categories.length; i++) {
      const catParams = categoryParamMap.get(categories[i].id) ?? [];
      const catParamIds = new Set(catParams.map((p) => p.parameterId));

      for (const id of commonParamIds) {
        if (!catParamIds.has(id)) {
          commonParamIds.delete(id);
        }
      }
    }

    // Build result from first category's parameter definitions
    const commonParams = firstCatParams.filter((p) =>
      commonParamIds.has(p.parameterId),
    );

    return commonParams.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // ─── Step 5: Category-Specific Filters ─────────────────────

  /**
   * Category-specific = parameters in a category MINUS common filters.
   */
  private computeCategorySpecific(
    categories: RelevantCategoryContext[],
    categoryParamMap: Map<string, ParameterFacet[]>,
    commonFilters: ParameterFacet[],
  ): Record<string, ParameterFacet[]> {
    const commonIds = new Set(commonFilters.map((p) => p.parameterId));
    const result: Record<string, ParameterFacet[]> = {};

    for (const cat of categories) {
      const catParams = categoryParamMap.get(cat.id) ?? [];
      const specific = catParams.filter((p) => !commonIds.has(p.parameterId));
      if (specific.length > 0) {
        result[cat.id] = specific.sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }

    return result;
  }

  // ─── Step 6: Facet Values ──────────────────────────────────

  /**
   * Collect available values for each parameter from candidate products.
   */
  private async collectFacetValues(
    candidateIds: string[],
    paramIds: string[],
  ): Promise<Map<string, FacetValue[]>> {
    if (paramIds.length === 0) return new Map();

    const values = await this.prisma.productParameterValue.findMany({
      where: {
        productId: { in: candidateIds },
        parameterDefinitionId: { in: paramIds },
      },
      select: {
        parameterDefinitionId: true,
        value: true,
        productId: true,
      },
    });

    // Also fetch ParameterOption labels for display
    const options = await this.prisma.parameterOption.findMany({
      where: {
        parameterDefinitionId: { in: paramIds },
      },
      select: {
        parameterDefinitionId: true,
        value: true,
        label: true,
      },
    });

    // Build value → label map per parameter
    const labelMap = new Map<string, Map<string, string>>();
    for (const opt of options) {
      if (!labelMap.has(opt.parameterDefinitionId)) {
        labelMap.set(opt.parameterDefinitionId, new Map());
      }
      labelMap.get(opt.parameterDefinitionId)!.set(opt.value, opt.label);
    }

    // Aggregate values per parameter
    const facetMap = new Map<string, Map<string, number>>();
    for (const v of values) {
      if (!facetMap.has(v.parameterDefinitionId)) {
        facetMap.set(v.parameterDefinitionId, new Map());
      }
      const valMap = facetMap.get(v.parameterDefinitionId)!;
      valMap.set(v.value, (valMap.get(v.value) ?? 0) + 1);
    }

    // Convert to FacetValue arrays
    const result = new Map<string, FacetValue[]>();
    for (const [paramId, valMap] of facetMap) {
      const paramLabels = labelMap.get(paramId);
      const facetValues: FacetValue[] = [];
      for (const [value, count] of valMap) {
        facetValues.push({
          value,
          label: paramLabels?.get(value) ?? value,
          count,
        });
      }
      // Sort by count descending
      facetValues.sort((a, b) => b.count - a.count);
      result.set(paramId, facetValues);
    }

    return result;
  }

  /**
   * Attach collected facet values to parameter facet objects.
   */
  private attachFacetValues(
    params: ParameterFacet[],
    facetValues: Map<string, FacetValue[]>,
  ): void {
    for (const param of params) {
      param.availableValues = facetValues.get(param.parameterId) ?? [];
    }
  }
}