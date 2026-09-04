import { Injectable, Logger } from '@nestjs/common';
import { SupplierProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  SupplierModelFacetSearchResponseDTO,
  SupplierModelSearchResultItemDTO,
  SupplierModelParameterFacetDTO,
  SupplierModelFacetOptionDTO,
  SupplierModelCommercialFacetDTO,
} from './dto/supplier-model-facet-search.dto';

/**
 * Supplier Model Facet Search — M28.0 M661.4.
 *
 * Search = Discovery Acceleration Layer, NOT Business Authority.
 * Only PUBLISHED SupplierProduct is indexed (published boundary enforced at
 * the WHERE clause). Results are DTO projections derived from the discovery
 * graph:
 *
 *   Platform Product (Capability Authority)
 *        ↓
 *   SupplierProduct (PUBLISHED, Supplier Model Entity)
 *        ↓
 *   Offers (Commercial layer — summary only)
 *
 * Supports:
 *   - Capability filter (category / keyword)
 *   - Supplier Model filter (brand / series / modelNumber)
 *   - Technical Parameter facet (SupplierProductParameterValue)
 *   - Commercial Availability facet (Has Active Offer / Inquiry Available)
 *
 * Non responsibility: no quote decision, no trading, no order, no payment,
 * no monetized supplier ranking.
 */
/** SupplierProduct dimension facet bundle (served by unified `/search` — M28.0 M661.6). */
export interface SupplierProductFacetBundle {
  brands: SupplierModelFacetOptionDTO[];
  series: SupplierModelFacetOptionDTO[];
  commercial: SupplierModelCommercialFacetDTO;
}

@Injectable()
export class SupplierModelFacetSearchService {
  private readonly logger = new Logger(SupplierModelFacetSearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * M28.0 M661.6 — Unified Search Runtime Consolidation.
   * Compute the SupplierProduct dimension facet bundle over the published
   * candidate population (pagination-independent) so the unified `/search`
   * response can serve the brand / series / commercial facets directly.
   * SearchPage therefore only consumes `/search` and never the legacy
   * `/search/supplier-models` endpoint.
   */
  async getFacets(params: {
    keyword?: string;
    categoryId?: string;
    brand?: string;
    series?: string;
    hasActiveOffer?: boolean;
    parameterFilters?: string;
  }): Promise<SupplierProductFacetBundle> {
    const where = this.buildWhere({
      keyword: (params.keyword ?? '').trim(),
      categoryId: params.categoryId?.trim() || undefined,
      brand: params.brand?.trim() || undefined,
      series: params.series?.trim() || undefined,
      hasActiveOffer: params.hasActiveOffer,
      parameterFilters: this.parseParameterFilters(params.parameterFilters),
    });

    const candidateIds = await this.prisma.supplierProduct.findMany({
      where,
      select: { id: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
    });

    const allIds = candidateIds.map((sp) => sp.id);
    if (allIds.length === 0) {
      return { brands: [], series: [], commercial: { hasActiveOffer: 0, inquiryAvailable: 0 } };
    }

    const facets = await this.buildFacets(allIds, where);
    return {
      brands: facets.brands,
      series: facets.series,
      commercial: facets.commercial,
    };
  }

  async search(params: {
    keyword?: string;
    categoryId?: string;
    brand?: string;
    series?: string;
    hasActiveOffer?: boolean;
    /** parameterValue filter wire format: paramId:val1,val2;paramId2:val3 */
    parameterFilters?: string;
    page?: number;
    pageSize?: number;
  }): Promise<SupplierModelFacetSearchResponseDTO> {
    const keyword = (params.keyword ?? '').trim();
    const categoryId = params.categoryId?.trim() || undefined;
    const brand = params.brand?.trim() || undefined;
    const series = params.series?.trim() || undefined;
    const hasActiveOffer = params.hasActiveOffer;
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
    const skip = (page - 1) * pageSize;

    const parameterFilters = this.parseParameterFilters(params.parameterFilters);

    // Filter-before-pagination candidate WHERE for the published population.
    const where = this.buildWhere({
      keyword,
      categoryId,
      brand,
      series,
      hasActiveOffer,
      parameterFilters,
    });

    const [candidateIds, itemCount] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        select: { id: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    const allIds = candidateIds.map((sp) => sp.id);
    const pageIds = allIds.slice(skip, skip + pageSize);

    // Facet aggregation operates on the full published candidate population
    // (pagination-independent), consistent with the Search Context pattern.
    const facets = allIds.length
      ? await this.buildFacets(allIds, where)
      : this.emptyFacets();

    const items =
      pageIds.length > 0
        ? await this.buildItems(pageIds)
        : [];

    this.logger.log(
      `SupplierModel facet search "${keyword}": ${itemCount} published models, page ${page}`,
    );

    return {
      query: keyword,
      items,
      total: itemCount,
      facets,
    };
  }

  // ============================================
  // WHERE Construction (published boundary)
  // ============================================

  private buildWhere(params: {
    keyword: string;
    categoryId?: string;
    brand?: string;
    series?: string;
    hasActiveOffer?: boolean;
    parameterFilters: { parameterId: string; values: string[] }[];
  }): Record<string, unknown> {
    const ands: Record<string, unknown>[] = [];

    // Published boundary — only PUBLISHED SupplierProduct enters search.
    ands.push({ status: SupplierProductStatus.PUBLISHED });

    // Capability filter: capability keyword (platform product / capability) and
    // category are applied at the SupplierProduct→Product relation.
    if (params.keyword || params.categoryId) {
      const capability: Record<string, unknown> = {};
      if (params.categoryId) capability.categoryId = params.categoryId;
      if (params.keyword) {
        capability.OR = [
          { name: { contains: params.keyword, mode: 'insensitive' as const } },
          { model: { contains: params.keyword, mode: 'insensitive' as const } },
          { description: { contains: params.keyword, mode: 'insensitive' as const } },
        ];
      }
      ands.push({ platformProduct: capability });
    }

    // Supplier Model filter: brand / series.
    if (params.brand) {
      ands.push({ brand: { contains: params.brand, mode: 'insensitive' as const } });
    }
    if (params.series) {
      ands.push({ series: { contains: params.series, mode: 'insensitive' as const } });
    }

    // Commercial Availability facet: Has Active Offer.
    if (params.hasActiveOffer === true) {
      ands.push({ offers: { some: { status: 'ACTIVE' } } });
    }

    // Technical Parameter facet: one AND per parameter, OR within values.
    for (const f of params.parameterFilters) {
      ands.push({
        parameterValues: {
          some: {
            parameterDefinitionId: f.parameterId,
            value: { in: f.values },
          },
        },
      });
    }

    return ands.length === 1 ? ands[0] : { AND: ands };
  }

  private parseParameterFilters(raw?: string): { parameterId: string; values: string[] }[] {
    if (!raw) return [];
    const filters: { parameterId: string; values: string[] }[] = [];
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
  // Item Projection (DTO only, no raw relation)
  // ============================================

  private async buildItems(
    supplierProductIds: string[],
  ): Promise<SupplierModelSearchResultItemDTO[]> {
    const supplierProducts = await this.prisma.supplierProduct.findMany({
      where: { id: { in: supplierProductIds } },
      select: {
        id: true,
        brand: true,
        series: true,
        modelNumber: true,
        slug: true,
        status: true,
        platformProductId: true,
        parameterValues: {
          select: { id: true },
        },
        platformProduct: {
          select: {
            id: true,
            name: true,
            slug: true,
            categoryId: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    // Order returned items to match candidate ordering.
    const orderMap = new Map(
      supplierProductIds.map((id, idx) => [id, idx]),
    );
    const ordered = supplierProducts
      .filter((sp) => orderMap.has(sp.id))
      .sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);

    return ordered.map((sp) => {
      return {
        capability: {
          id: sp.platformProduct?.id ?? sp.platformProductId,
          name: sp.platformProduct?.name ?? '',
          slug: sp.platformProduct?.slug ?? null,
          categoryId: sp.platformProduct?.categoryId ?? null,
        },
        supplierProduct: {
          id: sp.id,
          brand: sp.brand,
          series: sp.series,
          modelNumber: sp.modelNumber,
          slug: sp.slug,
          status: sp.status,
          platformProductId: sp.platformProductId,
        },
        facetSummary: {
          parameterCount: sp.parameterValues?.length ?? 0,
          primaryCategoryName: sp.platformProduct?.category?.name ?? null,
        },
        inquiryAvailable: true,
      };
    });
  }

  // ============================================
  // Facet Aggregation (pagination-independent)
  // ============================================

  private emptyFacets() {
    return {
      capabilities: [],
      brands: [],
      series: [],
      parameters: [],
      commercial: { hasActiveOffer: 0, inquiryAvailable: 0 },
    };
  }

  private async buildFacets(supplierProductIds: string[], where: Record<string, unknown>) {
    const suppliers = await this.prisma.supplierProduct.findMany({
      where: { id: { in: supplierProductIds } },
      select: {
        brand: true,
        series: true,
        offers: { where: { status: 'ACTIVE' }, select: { id: true } },
        platformProduct: {
          select: {
            categoryId: true,
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    // Capability facet from category.
    const capabilityMap = new Map<string, SupplierModelFacetOptionDTO>();
    // Brand facet.
    const brandMap = new Map<string, SupplierModelFacetOptionDTO>();
    // Series facet.
    const seriesMap = new Map<string, SupplierModelFacetOptionDTO>();
    // Commercial aggregation.
    let hasActiveOfferCount = 0;

    for (const sp of suppliers) {
      const cat = sp.platformProduct?.category;
      const catId = cat?.id ?? sp.platformProduct?.categoryId ?? '';
      if (catId) {
        const label = cat?.name ?? catId;
        capabilityMap.set(catId, {
          value: catId,
          label,
          count: (capabilityMap.get(catId)?.count ?? 0) + 1,
        });
      }

      if (sp.brand) {
        brandMap.set(sp.brand, {
          value: sp.brand,
          label: sp.brand,
          count: (brandMap.get(sp.brand)?.count ?? 0) + 1,
        });
      }

      if (sp.series) {
        seriesMap.set(sp.series, {
          value: sp.series,
          label: sp.series,
          count: (seriesMap.get(sp.series)?.count ?? 0) + 1,
        });
      }

      if ((sp.offers?.length ?? 0) > 0) {
        hasActiveOfferCount++;
      }
    }

    const parameters = await this.buildParameterFacets(supplierProductIds);

    return {
      capabilities: [...capabilityMap.values()].sort((a, b) => b.count - a.count),
      brands: [...brandMap.values()].sort((a, b) => b.count - a.count),
      series: [...seriesMap.values()].sort((a, b) => b.count - a.count),
      parameters,
      commercial: {
        hasActiveOffer: hasActiveOfferCount,
        // By design all PUBLISHED supplier models carry an inquiry entry.
        inquiryAvailable: supplierProductIds.length,
      },
    };
  }

  private async buildParameterFacets(
    supplierProductIds: string[],
  ): Promise<SupplierModelParameterFacetDTO[]> {
    const values = await this.prisma.supplierProductParameterValue.findMany({
      where: { supplierProductId: { in: supplierProductIds } },
      select: {
        parameterDefinitionId: true,
        value: true,
        parameterDefinition: {
          select: {
            id: true,
            name: true,
            code: true,
            unit: true,
          },
        },
      },
    });

    const options = await this.prisma.parameterOption.findMany({
      where: {
        parameterDefinitionId: {
          in: values.map((v) => v.parameterDefinitionId),
        },
      },
      select: {
        parameterDefinitionId: true,
        value: true,
        label: true,
      },
    });

    const labelMap = new Map<string, Map<string, string>>();
    for (const opt of options) {
      if (!labelMap.has(opt.parameterDefinitionId)) {
        labelMap.set(opt.parameterDefinitionId, new Map());
      }
      labelMap.get(opt.parameterDefinitionId)!.set(opt.value, opt.label);
    }

    const metaMap = new Map<string, { name: string; code: string; unit: string | null }>();
    const facetValueMap = new Map<string, Map<string, number>>();

    for (const v of values) {
      const pid = v.parameterDefinitionId;
      if (!metaMap.has(pid)) {
        metaMap.set(pid, {
          name: v.parameterDefinition?.name ?? pid,
          code: v.parameterDefinition?.code ?? pid,
          unit: v.parameterDefinition?.unit ?? null,
        });
      }
      if (!facetValueMap.has(pid)) {
        facetValueMap.set(pid, new Map());
      }
      const valMap = facetValueMap.get(pid)!;
      valMap.set(v.value, (valMap.get(v.value) ?? 0) + 1);
    }

    const result: SupplierModelParameterFacetDTO[] = [];
    for (const [pid, valMap] of facetValueMap) {
      const meta = metaMap.get(pid)!;
      const values: SupplierModelFacetOptionDTO[] = [];
      for (const [value, count] of valMap) {
        values.push({
          value,
          label: labelMap.get(pid)?.get(value) ?? value,
          count,
        });
      }
      values.sort((a, b) => b.count - a.count);
      result.push({
        parameterId: pid,
        parameterName: meta.name,
        parameterKey: meta.code,
        unit: meta.unit,
        values,
      });
    }

    // Sort parameters by name for deterministic display.
    result.sort((a, b) => a.parameterName.localeCompare(b.parameterName));
    return result;
  }
}