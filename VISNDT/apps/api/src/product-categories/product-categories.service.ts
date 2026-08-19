import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductCategoryWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { slug: { contains: keyword } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.productCategory.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { children: true },
      }),
      this.prisma.productCategory.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const cat = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { children: true, products: true },
    });
    if (!cat) throw new NotFoundException(`产品分类 ${id} 未找到`);
    return cat;
  }

  /**
   * Product Center → Category Context Relevant Parameters (M24.2.3)
   *
   * Deterministic, non-AI resolution of the parameters actually used by ACTIVE
   * products within a given category:
   *   ProductCategory → ACTIVE Products → ProductParameterValue → ParameterDefinition
   *
   * No search-context / matching / AI is involved. Definitions are deduplicated
   * by parameterDefinitionId (distinct) and ordered stably by `name`.
   *
   * NOTE on ordering: ParameterDefinition has no global `displayOrder` column
   * (the per-product ProductParameterDefinition.displayOrder cannot serve as a
   * cross-product ordering key for a de-duplicated category aggregate), so the
   * stable, explainable ordering used here is `name` ascending. ENUM options are
   * returned with their own `sortOrder` applied.
   */
  async findParameters(categoryId: string) {
    const cat = await this.prisma.productCategory.findUnique({
      where: { id: categoryId },
    });
    if (!cat) throw new NotFoundException(`产品分类 ${categoryId} 未找到`);

    const values = await this.prisma.productParameterValue.findMany({
      where: { product: { categoryId, status: 'ACTIVE' } },
      distinct: ['parameterDefinitionId'],
      select: { parameterDefinitionId: true },
    });

    const definitionIds = values.map((v) => v.parameterDefinitionId);
    if (definitionIds.length === 0) return [];

    return this.prisma.parameterDefinition.findMany({
      where: { id: { in: definitionIds } },
      orderBy: { name: 'asc' },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async create(dto: CreateProductCategoryDto) {
    return this.prisma.productCategory.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductCategoryDto) {
    await this.findOne(id);
    return this.prisma.productCategory.update({ where: { id }, data: dto });
  }

  async batchDelete(ids: string[]) {
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const cat = await this.prisma.productCategory.findUnique({
          where: { id },
          include: {
            _count: {
              select: { products: true, children: true },
            },
          },
        });
        if (!cat) throw new NotFoundException(`ProductCategory ${id} not found`);

        if (cat._count.products > 0 || cat._count.children > 0) {
          const reasons: string[] = [];
          if (cat._count.products > 0) reasons.push(`${cat._count.products} 个产品`);
          if (cat._count.children > 0) reasons.push(`${cat._count.children} 个子分类`);
          const errorCode = cat._count.products > 0 ? 'CATEGORY_HAS_PRODUCTS' : 'CATEGORY_HAS_CHILDREN';
          throw new BadRequestException({
            code: errorCode,
            message: `无法删除该分类：分类下存在 ${reasons.join('、')}，请先移除依赖项后再删除。`,
            details: {
              productCount: cat._count.products,
              childCount: cat._count.children,
            },
          });
        }

        await this.prisma.productCategory.delete({ where: { id } });
        return { id };
      }),
    );

    const succeeded: { id: string }[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'fulfilled') {
        succeeded.push(result.value);
      } else {
        failed.push({ id: ids[i], reason: result.reason.message });
      }
    }

    return { succeeded, failed };
  }

  async remove(id: string) {
    const cat = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { products: true, children: true } 
        } 
      },
    });
    if (!cat) throw new NotFoundException(`ProductCategory ${id} not found`);

    if (cat._count.products > 0 || cat._count.children > 0) {
      const reasons: string[] = [];
      if (cat._count.products > 0) reasons.push(`${cat._count.products} 个产品`);
      if (cat._count.children > 0) reasons.push(`${cat._count.children} 个子分类`);
      const errorCode = cat._count.products > 0 ? 'CATEGORY_HAS_PRODUCTS' : 'CATEGORY_HAS_CHILDREN';
      throw new BadRequestException({
        code: errorCode,
        message: `无法删除该分类：分类下存在 ${reasons.join('、')}，请先移除依赖项后再删除。`,
        details: {
          productCount: cat._count.products,
          childCount: cat._count.children,
        },
      });
    }

    await this.prisma.productCategory.delete({ where: { id } });
    return { id };
  }
}