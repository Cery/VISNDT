import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryKnowledgeMappingDto, UpdateProductCategoryKnowledgeMappingDto } from './dto/product-category-knowledge-mapping.dto';

@Injectable()
export class AdminProductCategoryKnowledgeMappingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.productCategoryKnowledgeMapping.findMany({
      include: {
        productCategory: { select: { id: true, name: true, slug: true } },
        knowledgeCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: [{ productCategory: { name: 'asc' } }, { sortOrder: 'asc' }],
    });
  }

  async findById(id: string) {
    const mapping = await this.prisma.productCategoryKnowledgeMapping.findUnique({
      where: { id },
      include: {
        productCategory: { select: { id: true, name: true, slug: true } },
        knowledgeCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
    if (!mapping) {
      throw new NotFoundException(`Mapping ${id} not found`);
    }
    return mapping;
  }

  async create(dto: CreateProductCategoryKnowledgeMappingDto) {
    // Verify ProductCategory exists
    const productCategory = await this.prisma.productCategory.findUnique({
      where: { id: dto.productCategoryId },
    });
    if (!productCategory) {
      throw new NotFoundException(`ProductCategory ${dto.productCategoryId} not found`);
    }

    // Verify KnowledgeCategory exists
    const knowledgeCategory = await this.prisma.knowledgeCategory.findUnique({
      where: { id: dto.knowledgeCategoryId },
    });
    if (!knowledgeCategory) {
      throw new NotFoundException(`KnowledgeCategory ${dto.knowledgeCategoryId} not found`);
    }

    // Check duplicate
    const existing = await this.prisma.productCategoryKnowledgeMapping.findUnique({
      where: {
        productCategoryId_knowledgeCategoryId: {
          productCategoryId: dto.productCategoryId,
          knowledgeCategoryId: dto.knowledgeCategoryId,
        },
      },
    });
    if (existing) {
      throw new ConflictException(
        `Mapping already exists: ProductCategory ${dto.productCategoryId} ↔ KnowledgeCategory ${dto.knowledgeCategoryId}`,
      );
    }

    return this.prisma.productCategoryKnowledgeMapping.create({
      data: {
        productCategoryId: dto.productCategoryId,
        knowledgeCategoryId: dto.knowledgeCategoryId,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: {
        productCategory: { select: { id: true, name: true, slug: true } },
        knowledgeCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProductCategoryKnowledgeMappingDto) {
    const mapping = await this.prisma.productCategoryKnowledgeMapping.findUnique({
      where: { id },
    });
    if (!mapping) {
      throw new NotFoundException(`Mapping ${id} not found`);
    }

    return this.prisma.productCategoryKnowledgeMapping.update({
      where: { id },
      data: {
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: {
        productCategory: { select: { id: true, name: true, slug: true } },
        knowledgeCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    const mapping = await this.prisma.productCategoryKnowledgeMapping.findUnique({
      where: { id },
    });
    if (!mapping) {
      throw new NotFoundException(`Mapping ${id} not found`);
    }

    return this.prisma.productCategoryKnowledgeMapping.update({
      where: { id },
      data: { isActive },
      include: {
        productCategory: { select: { id: true, name: true, slug: true } },
        knowledgeCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async delete(id: string) {
    const mapping = await this.prisma.productCategoryKnowledgeMapping.findUnique({
      where: { id },
    });
    if (!mapping) {
      throw new NotFoundException(`Mapping ${id} not found`);
    }

    return this.prisma.productCategoryKnowledgeMapping.delete({ where: { id } });
  }
}