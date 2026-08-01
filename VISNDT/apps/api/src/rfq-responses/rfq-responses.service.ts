import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQResponseStatus, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqResponseDto } from './dto/create-rfq-response.dto';
import { UpdateRfqResponseDto } from './dto/update-rfq-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';

const RESPONSE_TRANSITIONS: Record<RFQResponseStatus, RFQResponseStatus[]> = {
  SUBMITTED: [RFQResponseStatus.VIEWED],
  VIEWED: [RFQResponseStatus.ACCEPTED, RFQResponseStatus.REJECTED],
  ACCEPTED: [],
  REJECTED: [],
};

@Injectable()
export class RfqResponsesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

  async findMine(organizationId: string) {
    const [data, total] = await Promise.all([
      this.prisma.rFQResponse.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        include: { rfq: true, organization: true, offer: true },
      }),
      this.prisma.rFQResponse.count({ where: { organizationId } }),
    ]);

    return { data, total };
  }

  async create(
    rfqId: string,
    dto: CreateRfqResponseDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to respond to an RFQ',
      );
    }

    const response = await this.prisma.rFQResponse.create({
      data: {
        rfqId,
        organizationId: user.organizationId,
        offerId: dto.offerId,
        message: dto.message,
      },
    });

    // E3: RFQ Response Submitted — notify the RFQ creator
    try {
      const rfq = await this.prisma.rFQ.findUnique({
        where: { id: rfqId },
        select: { createdBy: true },
      });
      if (rfq) {
        await this.notificationsService.create({
          userId: rfq.createdBy,
          type: NotificationType.RESPONSE_UPDATE,
          title: 'New RFQ Response',
          message: `A supplier has submitted a response to your RFQ`,
          referenceType: 'RFQ_RESPONSE',
          referenceId: response.id,
        });
      }
    } catch {
      // Notification failure should not affect the main flow
    }

    return response;
  }

  async update(
    id: string,
    dto: UpdateRfqResponseDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const response = await this.prisma.rFQResponse.findUnique({
      where: { id },
    });

    if (!response) {
      throw new NotFoundException(`RFQ Response ${id} not found`);
    }

    // Ownership validation: only the organization that created the response can update it
    if (user.organizationId && response.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'You do not have permission to update this response',
      );
    }

    if (dto.status) {
      const allowed = RESPONSE_TRANSITIONS[response.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Cannot transition RFQ Response from ${response.status} to ${dto.status}`,
        );
      }
    }

    const updated = await this.prisma.rFQResponse.update({ where: { id }, data: dto });

    // E4/E5: Response Accepted/Rejected — notify the response organization's admins
    if (dto.status === RFQResponseStatus.ACCEPTED || dto.status === RFQResponseStatus.REJECTED) {
      try {
        const statusLabel = dto.status === RFQResponseStatus.ACCEPTED ? 'accepted' : 'rejected';
        await this.notificationsService.createForOrganization(
          response.organizationId,
          {
            type: NotificationType.RESPONSE_UPDATE,
            title: `Response ${statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}`,
            message: `Your RFQ response has been ${statusLabel}`,
            referenceType: 'RFQ_RESPONSE',
            referenceId: response.id,
          },
        );
      } catch {
        // Notification failure should not affect the main flow
      }
    }

    return updated;
  }
}