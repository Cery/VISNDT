import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQStatus, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';

const RFQ_TRANSITIONS: Record<RFQStatus, RFQStatus[]> = {
  DRAFT: [RFQStatus.OPEN],
  OPEN: [RFQStatus.RESPONDING, RFQStatus.CLOSED, RFQStatus.CANCELLED],
  RESPONDING: [RFQStatus.CLOSED, RFQStatus.CANCELLED],
  CLOSED: [],
  CANCELLED: [],
};

@Injectable()
export class RfqsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

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
    const rfq = await this.prisma.rFQ.create({
      data: {
        demandId: dto.demandId,
        createdBy: user.id,
      },
    });

    // E1: RFQ Created — notify the demand creator
    try {
      const demand = await this.prisma.demand.findUnique({
        where: { id: dto.demandId },
        select: { createdBy: true, title: true },
      });
      if (demand) {
        await this.notificationsService.create({
          userId: demand.createdBy,
          type: NotificationType.RFQ_UPDATE,
          title: 'New RFQ Created',
          message: `RFQ for demand "${demand.title || 'Untitled'}" has been created`,
          referenceType: 'RFQ',
          referenceId: rfq.id,
        });
      }
    } catch {
      // Notification failure should not affect the main flow
    }

    return rfq;
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

    const updated = await this.prisma.rFQ.update({ where: { id }, data: dto });

    // E2: RFQ Status Changed — notify the RFQ creator
    if (dto.status) {
      try {
        await this.notificationsService.create({
          userId: rfq.createdBy,
          type: NotificationType.RFQ_UPDATE,
          title: 'RFQ Status Updated',
          message: `RFQ status changed to "${dto.status}"`,
          referenceType: 'RFQ',
          referenceId: rfq.id,
        });
      } catch {
        // Notification failure should not affect the main flow
      }
    }

    return updated;
  }
}