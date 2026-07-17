import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQResponseStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqResponseDto } from './dto/create-rfq-response.dto';
import { UpdateRfqResponseDto } from './dto/update-rfq-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

const RESPONSE_TRANSITIONS: Record<RFQResponseStatus, RFQResponseStatus[]> = {
  SUBMITTED: [RFQResponseStatus.VIEWED],
  VIEWED: [RFQResponseStatus.ACCEPTED, RFQResponseStatus.REJECTED],
  ACCEPTED: [],
  REJECTED: [],
};

@Injectable()
export class RfqResponsesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRfq(rfqId: string, pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.rFQResponse.findMany({
        where: { rfqId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, offer: true },
      }),
      this.prisma.rFQResponse.count({ where: { rfqId } }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const response = await this.prisma.rFQResponse.findUnique({
      where: { id },
      include: { rfq: true, organization: true, offer: true },
    });
    if (!response) throw new NotFoundException(`RFQ Response ${id} not found`);
    return response;
  }

  async create(rfqId: string, dto: CreateRfqResponseDto) {
    return this.prisma.rFQResponse.create({
      data: { ...dto, rfqId },
    });
  }

  async update(id: string, dto: UpdateRfqResponseDto) {
    const response = await this.findOne(id);

    if (dto.status) {
      const allowed = RESPONSE_TRANSITIONS[response.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Cannot transition RFQ Response from ${response.status} to ${dto.status}`,
        );
      }
    }

    return this.prisma.rFQResponse.update({ where: { id }, data: dto });
  }
}