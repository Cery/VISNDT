import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.productCategory.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { children: true },
      }),
      this.prisma.productCategory.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const cat = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { children: true, products: true },
    });
    if (!cat) throw new NotFoundException(`ProductCategory ${id} not found`);
    return cat;
  }

  async create(dto: CreateProductCategoryDto) {
    return this.prisma.productCategory.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductCategoryDto) {
    await this.findOne(id);
    return this.prisma.productCategory.update({ where: { id }, data: dto });
  }
}