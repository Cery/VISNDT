import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'name']);

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SearchProductDto) {
    const { page = 1, pageSize = 20, keyword, categoryId, status, sortBy, sortOrder, parameterFilters } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {};
    const conditions: Prisma.ProductWhereInput[] = [];

    // Keyword search: OR across name, model, description
    if (keyword) {
      conditions.push({
        OR: [
          { name: { contains: keyword } },
          { model: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      });
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Parameter filters: AND across multiple parameter values
    if (parameterFilters && parameterFilters.length > 0) {
      for (const filter of parameterFilters) {
        const hasValue = filter.value !== undefined;
        const hasRange = filter.valueMin !== undefined || filter.valueMax !== undefined;

        // Mutual exclusion: value and valueMin/valueMax cannot be used together
        if (hasValue && hasRange) {
          throw new BadRequestException(
            `参数过滤器 ${filter.parameterDefinitionId}: 值(value)和数值范围(valueMin/valueMax)不能同时使用`,
          );
        }

        if (hasRange) {
          // Validate valueMin <= valueMax
          if (
            filter.valueMin !== undefined &&
            filter.valueMax !== undefined &&
            filter.valueMin > filter.valueMax
          ) {
            throw new BadRequestException(
              `参数过滤器 ${filter.parameterDefinitionId}: valueMin (${filter.valueMin}) 必须 <= valueMax (${filter.valueMax})`,
            );
          }

          // Numeric range query using valueNumber
          const valueNumberFilter: Prisma.FloatNullableFilter = {};
          if (filter.valueMin !== undefined) valueNumberFilter.gte = filter.valueMin;
          if (filter.valueMax !== undefined) valueNumberFilter.lte = filter.valueMax;

          conditions.push({
            parameterValues: {
              some: {
                parameterDefinitionId: filter.parameterDefinitionId,
                valueNumber: valueNumberFilter,
              },
            },
          });
        } else {
          // Exact match (existing behavior)
          conditions.push({
            parameterValues: {
              some: {
                parameterDefinitionId: filter.parameterDefinitionId,
                value: filter.value,
              },
            },
          });
        }
      }
    }

    // Merge AND conditions
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    // Sort with whitelist
    const field = sortBy && ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';
    const dir = sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [field]: dir },
        include: { category: true, createdBy: { include: { organization: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    // M24.2.4 (603) — Capability Discovery Card enrichment (read-only).
    const enriched = await this.enrichWithCardFields(data);

    return { data: enriched, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * M24.2.4 (603) — attach presentation-only list fields for the Capability
   * Discovery Card. No new models, no schema change, no AI / search / matching:
   *   - primaryMedia: the single primary IMAGE media (isPrimary → displayOrder),
   *     exposing only fileAssetId (frontend builds the public /files/:id/download
   *     URL) — never a full media list.
   *   - keyParameters: up to 3 core parameters actually assigned to the product,
   *     resolved via ProductParameterValue → ParameterDefinition and ordered
   *     deterministically by ProductParameterDefinition.displayOrder (per-product
   *     curated order), falling back to name asc → id asc.
   */
  private async enrichWithCardFields<T extends { id: string }>(products: T[]) {
    if (products.length === 0) return products;

    const ids = products.map((p) => p.id);

    const [mediaRecords, values, associations] = await Promise.all([
      this.prisma.productMedia.findMany({
        where: { productId: { in: ids }, mediaType: 'IMAGE' },
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        select: {
          id: true,
          productId: true,
          fileAssetId: true,
          mediaType: true,
          title: true,
          isPrimary: true,
          displayOrder: true,
        },
      }),
      this.prisma.productParameterValue.findMany({
        where: { productId: { in: ids } },
        select: {
          productId: true,
          parameterDefinitionId: true,
          value: true,
          valueNumber: true,
          parameterDefinition: {
            select: { id: true, name: true, code: true, dataType: true, unit: true },
          },
        },
      }),
      this.prisma.productParameterDefinition.findMany({
        where: { productId: { in: ids } },
        select: { productId: true, parameterDefinitionId: true, displayOrder: true },
      }),
    ]);

    // One primary image per product (first after isPrimary → displayOrder).
    const primaryMediaByProduct = new Map<string, (typeof mediaRecords)[number]>();
    for (const m of mediaRecords) {
      if (!primaryMediaByProduct.has(m.productId)) {
        primaryMediaByProduct.set(m.productId, m);
      }
    }

    // Per-product curated parameter order (ProductParameterDefinition.displayOrder).
    const orderMap = new Map<string, number>();
    for (const a of associations) {
      orderMap.set(`${a.productId}:${a.parameterDefinitionId}`, a.displayOrder);
    }

    const valuesByProduct = new Map<string, (typeof values)>();
    for (const v of values) {
      const list = valuesByProduct.get(v.productId) ?? [];
      list.push(v);
      valuesByProduct.set(v.productId, list);
    }

    return products.map((p) => {
      const primaryMedia = primaryMediaByProduct.get(p.id) ?? null;

      const list = valuesByProduct.get(p.id) ?? [];
      list.sort((a, b) => {
        const ao = orderMap.get(`${a.productId}:${a.parameterDefinitionId}`) ?? Number.MAX_SAFE_INTEGER;
        const bo = orderMap.get(`${b.productId}:${b.parameterDefinitionId}`) ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        const nameCmp = a.parameterDefinition.name.localeCompare(b.parameterDefinition.name);
        if (nameCmp !== 0) return nameCmp;
        return a.parameterDefinitionId.localeCompare(b.parameterDefinitionId);
      });

      const keyParameters = list.slice(0, 3).map((v) => ({
        parameterDefinitionId: v.parameterDefinitionId,
        name: v.parameterDefinition.name,
        code: v.parameterDefinition.code,
        dataType: v.parameterDefinition.dataType,
        unit: v.parameterDefinition.unit,
        value: v.value,
        valueNumber: v.valueNumber,
      }));

      return { ...p, primaryMedia, keyParameters };
    });
  }

  // UUID format regex: 8-4-4-4-12 hex digits (lenient — supports demo deterministic IDs)
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  async findOne(idOrSlug: string) {
    const isUuid = ProductsService.UUID_REGEX.test(idOrSlug);

    const product = await this.prisma.product.findUnique({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        category: true,
        parameterValues: { include: { parameterDefinition: true } },
        media: true,
        createdBy: { include: { organization: true } },
        // 公开询价链路：产品详情页需根据 offers 推导询价对象（offer + 组织）
        offers: {
          include: { organization: true },
        },
      },
    });
    if (!product) throw new NotFoundException(`产品 ${idOrSlug} 未找到`);
    return product;
  }

  /**
   * Product → Related Knowledge resolution (M24.1.6)
   *
   * Deterministic mapping chain, no AI / keyword / random recommendation:
   *   Product → ProductCategory → ProductCategoryKnowledgeMapping (isActive)
   *           → KnowledgeCategory → KnowledgeEntry (PUBLISHED)
   *
   * The authoritative source of association is ProductCategoryKnowledgeMapping
   * exclusively (ADR-M24-008 / 009 / 010). Knowledge Domain is derived from
   * KnowledgeCategory → KnowledgeDomain and is NOT stored in the mapping.
   */
  async findRelatedKnowledge(idOrSlug: string) {
    const isUuid = ProductsService.UUID_REGEX.test(idOrSlug);

    const product = await this.prisma.product.findUnique({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      select: { id: true, categoryId: true },
    });
    if (!product) throw new NotFoundException(`产品 ${idOrSlug} 未找到`);

    // 1. Resolve active knowledge-category mappings for the product's category,
    //    ordered by mapping sortOrder (stable, explainable ordering).
    const mappings = await this.prisma.productCategoryKnowledgeMapping.findMany({
      where: { productCategoryId: product.categoryId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { knowledgeCategoryId: true, sortOrder: true },
    });

    if (mappings.length === 0) {
      return [];
    }

    const categoryOrder = new Map<string, number>(
      mappings.map((m) => [m.knowledgeCategoryId, m.sortOrder]),
    );

    // 2. Retrieve PUBLISHED knowledge entries across the mapped categories.
    const entries = await this.prisma.knowledgeEntry.findMany({
      where: {
        categoryId: { in: [...categoryOrder.keys()] },
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        publishedAt: true,
        categoryId: true,
        category: { select: { id: true, name: true, slug: true } },
        domain: { select: { id: true, name: true, slug: true } },
      },
    });

    // 3. Deduplicate by KnowledgeEntry id (defensive; an entry belongs to one
    //    category) and order deterministically:
    //    mapping sortOrder (category) asc → publishedAt desc → id asc.
    const deduped = new Map<string, (typeof entries)[number]>();
    for (const entry of entries) {
      if (!deduped.has(entry.id)) {
        deduped.set(entry.id, entry);
      }
    }

    return [...deduped.values()].sort((a, b) => {
      const ao = categoryOrder.get(a.categoryId) ?? 0;
      const bo = categoryOrder.get(b.categoryId) ?? 0;
      if (ao !== bo) return ao - bo;
      const ta = new Date(a.publishedAt ?? 0).getTime();
      const tb = new Date(b.publishedAt ?? 0).getTime();
      if (ta !== tb) return tb - ta;
      return a.id.localeCompare(b.id);
    });
  }

  /**
   * Product → Related Products resolution (M24.1.8)
   *
   * Deterministic, non-AI discovery: other ACTIVE products within the SAME
   * ProductCategory as the current product. The current product is excluded.
   * Ordering is stable and explainable: createdAt desc → id asc.
   *
   * No supplier / organization / offer / matching / search-ranking data is used,
   * and none is returned — only public product-card fields. Compare is purposely
   * not part of this resolver: it is user-selected via the existing
   * /products/compare?ids= flow.
   */
  async findRelatedProducts(idOrSlug: string) {
    const isUuid = ProductsService.UUID_REGEX.test(idOrSlug);

    const product = await this.prisma.product.findUnique({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      select: { id: true, categoryId: true },
    });
    if (!product) throw new NotFoundException(`产品 ${idOrSlug} 未找到`);

    // No category → deterministically zero related products (never fall back to
    // the whole catalog).
    if (!product.categoryId) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        status: 'ACTIVE',
        id: { not: product.id },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        categoryId: true,
        name: true,
        model: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: true,
      },
    });
  }

  async create(dto: CreateProductDto, createdById?: string) {
    const data = { ...dto, createdById } as any;
    return this.prisma.product.create({ data });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string, force?: boolean) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { offers: { include: { rfqResponses: true } }, demandMatches: true, inquiries: true },
    });
    if (!product) throw new NotFoundException(`产品 ${id} 未找到`);

    if (force) {
      // Force mode: cascading delete in a transaction
      const deletedAssociations = await this.prisma.$transaction(async (tx) => {
        const result: Record<string, number> = {};

        const offerIds = product.offers.map((o) => o.id);

        // 1. Delete rfqResponses associated with product's offers first
        if (offerIds.length > 0) {
          const { count } = await tx.rFQResponse.deleteMany({
            where: { offerId: { in: offerIds } },
          });
          if (count > 0) result['rfqResponses'] = count;
        }

        // 2. Delete demandMatches BEFORE offers — DemandMatch has offerId FK referencing Offer
        if (product.demandMatches.length > 0) {
          const { count } = await tx.demandMatch.deleteMany({
            where: { productId: id },
          });
          result['demandMatches'] = count;
        }

        // 3. Delete offers
        if (offerIds.length > 0) {
          const { count } = await tx.offer.deleteMany({
            where: { productId: id },
          });
          result['offers'] = count;
        }

        // 4. Delete inquiries
        if (product.inquiries.length > 0) {
          const { count } = await tx.inquiry.deleteMany({
            where: { productId: id },
          });
          result['inquiries'] = count;
        }

        // 5. Delete media, parameterValues, parameterDefinitions
        const { count: mediaCount } = await tx.productMedia.deleteMany({ where: { productId: id } });
        if (mediaCount > 0) result['media'] = mediaCount;

        const { count: pvCount } = await tx.productParameterValue.deleteMany({ where: { productId: id } });
        if (pvCount > 0) result['parameterValues'] = pvCount;

        const { count: pdCount } = await tx.productParameterDefinition.deleteMany({ where: { productId: id } });
        if (pdCount > 0) result['parameterDefinitions'] = pdCount;

        // 6. Delete product
        await tx.product.delete({ where: { id } });

        return result;
      });

      return { id, deletedAssociations };
    }

    // Non-force mode: existing behavior
    if (product.offers.length > 0 || product.inquiries.length > 0 || product.demandMatches.length > 0) {
      const reasons: string[] = [];
      if (product.offers.length > 0) reasons.push(`${product.offers.length} 条报价记录`);
      if (product.inquiries.length > 0) reasons.push(`${product.inquiries.length} 条询价记录`);
      if (product.demandMatches.length > 0) reasons.push(`${product.demandMatches.length} 条需求匹配记录`);
      throw new BadRequestException(
        `该产品存在关联的${reasons.join('、')}，请先移除关联数据后再删除，或勾选"同时删除关联数据"进行级联删除。`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.productMedia.deleteMany({ where: { productId: id } }),
      this.prisma.productParameterValue.deleteMany({ where: { productId: id } }),
      this.prisma.productParameterDefinition.deleteMany({ where: { productId: id } }),
      this.prisma.product.delete({ where: { id } }),
    ]);

    return { id };
  }

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const results = await Promise.allSettled(
      ids.map((id) => this.remove(id)),
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    return { count: succeeded };
  }

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const result = await this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    return { count: result.count };
  }
}