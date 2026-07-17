import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParameterGroupDto } from './dto/create-parameter-group.dto';
import { UpdateParameterGroupDto } from './dto/update-parameter-group.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ParameterGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.parameterGroup.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.parameterGroup.count(),
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
}