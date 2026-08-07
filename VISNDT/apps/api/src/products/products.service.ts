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
            `Parameter filter for ${filter.parameterDefinitionId}: value and numeric range (valueMin/valueMax) cannot be used together`,
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
              `Parameter filter for ${filter.parameterDefinitionId}: valueMin (${filter.valueMin}) must be <= valueMax (${filter.valueMax})`,
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
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, parameterValues: { include: { parameterDefinition: true } }, media: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { offers: true, demandMatches: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);

    if (product.offers.length > 0) {
      throw new BadRequestException(
        'Cannot delete product with existing offers. Remove offers first.',
      );
    }
    if (product.demandMatches.length > 0) {
      throw new BadRequestException(
        'Cannot delete product with existing demand matches. Remove matches first.',
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