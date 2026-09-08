import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParameterDefinitionDto } from './dto/create-parameter-definition.dto';
import { UpdateParameterDefinitionDto } from './dto/update-parameter-definition.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';

@Injectable()
export class ParameterDefinitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword, categoryId, parameterGroupId } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ParameterDefinitionWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { code: { contains: keyword } },
      ];
    }
    if (parameterGroupId) {
      where.parameterGroupId = parameterGroupId;
    }
    if (categoryId) {
      where.group = { categoryId };
    }

    const [data, total] = await Promise.all([
      this.prisma.parameterDefinition.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { group: { include: { category: true } }, options: { orderBy: { sortOrder: 'asc' } } },
      }),
      this.prisma.parameterDefinition.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const def = await this.prisma.parameterDefinition.findUnique({
      where: { id },
      include: { group: true, options: true },
    });
    if (!def) throw new NotFoundException(`参数定义 ${id} 未找到`);
    return def;
  }

  async create(dto: CreateParameterDefinitionDto) {
    return this.prisma.parameterDefinition.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateParameterDefinitionDto) {
    await this.findOne(id);
    return this.prisma.parameterDefinition.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    const def = await this.prisma.parameterDefinition.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { productValues: true, productAssociations: true } 
        } 
      },
    });
    if (!def) throw new NotFoundException(`参数定义 ${id} 未找到`);

    if (def._count.productValues > 0 || def._count.productAssociations > 0) {
      throw new BadRequestException(
        `无法删除该参数定义：参数定义关联了 ${def._count.productValues} 个产品参数值和 ${def._count.productAssociations} 个产品关联，请先移除关联后再删除。`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.parameterOption.deleteMany({ where: { parameterDefinitionId: id } }),
      this.prisma.parameterDefinition.delete({ where: { id } }),
    ]);

    return { id };
  }

  async batchDelete(dto: BatchDeleteDto) {
    const { ids } = dto;
    const results = await Promise.allSettled(
      ids.map((id) => this.remove(id)),
    );
    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        succeeded.push(ids[index]);
      } else {
        failed.push({ id: ids[index], reason: result.reason.message });
      }
    });
    return { succeeded, failed };
  }
}