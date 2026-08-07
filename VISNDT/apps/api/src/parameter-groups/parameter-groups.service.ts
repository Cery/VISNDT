import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParameterGroupDto } from './dto/create-parameter-group.dto';
import { UpdateParameterGroupDto } from './dto/update-parameter-group.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';

@Injectable()
export class ParameterGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ParameterGroupWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { code: { contains: keyword } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.parameterGroup.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.parameterGroup.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const group = await this.prisma.parameterGroup.findUnique({
      where: { id },
      include: { definitions: true },
    });
    if (!group) throw new NotFoundException(`ParameterGroup ${id} not found`);
    return group;
  }

  async create(dto: CreateParameterGroupDto) {
    return this.prisma.parameterGroup.create({ data: dto });
  }

  async update(id: string, dto: UpdateParameterGroupDto) {
    await this.findOne(id);
    return this.prisma.parameterGroup.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const group = await this.prisma.parameterGroup.findUnique({
      where: { id },
      include: { _count: { select: { definitions: true } } },
    });
    if (!group) throw new NotFoundException(`ParameterGroup ${id} not found`);
    if (group._count.definitions > 0) {
      throw new BadRequestException(
        `Cannot delete parameter group with ${group._count.definitions} definition(s). Remove definitions first.`,
      );
    }

    await this.prisma.parameterGroup.delete({ where: { id } });
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