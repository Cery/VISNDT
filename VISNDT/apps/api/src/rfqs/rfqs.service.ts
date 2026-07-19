import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

const RFQ_TRANSITIONS: Record<RFQStatus, RFQStatus[]> = {
  DRAFT: [RFQStatus.OPEN],
  OPEN: [RFQStatus.RESPONDING, RFQStatus.CLOSED, RFQStatus.CANCELLED],
  RESPONDING: [RFQStatus.CLOSED, RFQStatus.CANCELLED],
  CLOSED: [],
  CANCELLED: [],
};

@Injectable()
export class RfqsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { demand: true, createdByUser: true },
      }),
      this.prisma.rFQ.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: true, createdByUser: true },
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);
    return rfq;
  }

  async create(
    dto: CreateRfqDto,
    user: { id: string; organizationId?: string | null },
  ) {
    return this.prisma.rFQ.create({
      data: {
        demandId: dto.demandId,
        createdBy: user.id,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateRfqDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: { select: { organizationId: true } } },
    });

    if (!rfq) {
      throw new NotFoundException(`RFQ ${id} not found`);
    }

    // Ownership validation: user must be the creator or belong to the same org
    const isCreator = rfq.createdBy === user.id;
    const isSameOrg = user.organizationId && rfq.demand?.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to update this RFQ',
      );
    }

    if (dto.status) {
      const allowed = RFQ_TRANSITIONS[rfq.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Cannot transition RFQ from ${rfq.status} to ${dto.status}`,
        );
      }
    }

    return this.prisma.rFQ.update({ where: { id }, data: dto });
  }
}