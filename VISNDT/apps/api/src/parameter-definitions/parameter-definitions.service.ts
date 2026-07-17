import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParameterDefinitionDto } from './dto/create-parameter-definition.dto';
import { UpdateParameterDefinitionDto } from './dto/update-parameter-definition.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ParameterDefinitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.parameterDefinition.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { group: true },
      }),
      this.prisma.parameterDefinition.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const def = await this.prisma.parameterDefinition.findUnique({
      where: { id },
      include: { group: true, options: true },
    });
    if (!def) throw new NotFoundException(`ParameterDefinition ${id} not found`);
    return def;
  }

  async create(dto: CreateParameterDefinitionDto) {
    return this.prisma.parameterDefinition.create({ data: dto });
  }

  async update(id: string, dto: UpdateParameterDefinitionDto) {
    await this.findOne(id);
    return this.prisma.parameterDefinition.update({ where: { id }, data: dto });
  }
}