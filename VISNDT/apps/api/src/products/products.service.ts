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

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, parameterValues: { include: { parameterDefinition: true } }, media: true, createdBy: { include: { organization: true } } },
    });
    if (!product) throw new NotFoundException(`产品 ${id} 未找到`);
    return product;
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