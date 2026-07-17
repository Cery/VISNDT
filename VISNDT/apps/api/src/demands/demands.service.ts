import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DemandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.demand.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, createdByUser: true },
      }),
      this.prisma.demand.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const demand = await this.prisma.demand.findUnique({
      where: { id },
      include: { organization: true, createdByUser: true },
    });
    if (!demand) throw new NotFoundException(`Demand ${id} not found`);
    return demand;
  }

  async create(dto: CreateDemandDto) {
    return this.prisma.demand.create({
      data: {
        ...dto,
        parametersJson: dto.parametersJson as Prisma.InputJsonValue,
      },
    });
  }

  async update(id: string, dto: UpdateDemandDto) {
    await this.findOne(id);
    return this.prisma.demand.update({
      where: { id },
      data: {
        ...dto,
        parametersJson: dto.parametersJson as Prisma.InputJsonValue | undefined,
      },
    });
  }
}