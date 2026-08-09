import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  RFQResponseStatus,
  NotificationType,
  RFQStatus,
  OrganizationStatus,
  UserStatus,
  Prisma,
} from '@prisma/client';
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

  async findMine(organizationId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.rFQResponse.findMany({
        where: { organizationId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          rfq: {
            include: {
              demand: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          organization: true,
          offer: true,
        },
      }),
      this.prisma.rFQResponse.count({ where: { organizationId } }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
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
    const organizationId = user.organizationId;

    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
      include: {
        user: {
          select: {
            status: true,
          },
        },
        organization: {
          select: {
            status: true,
          },
        },
      },
    });

    if (
      !membership ||
      membership.user.status !== UserStatus.ACTIVE ||
      membership.organization.status !== OrganizationStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Current user must be an active organization member to respond to an RFQ',
      );
    }

    const [rfq, existingResponse, offer] = await Promise.all([
      this.prisma.rFQ.findUnique({
        where: { id: rfqId },
        select: {
          id: true,
          status: true,
          publishedAt: true,
          createdBy: true,
        },
      }),
      this.prisma.rFQResponse.findUnique({
        where: {
          rfqId_organizationId: {
            rfqId,
            organizationId,
          },
        },
        select: { id: true },
      }),
      dto.offerId
        ? this.prisma.offer.findUnique({
            where: { id: dto.offerId },
            select: {
              id: true,
              organizationId: true,
            },
          })
        : Promise.resolve(null),
    ]);

    if (!rfq) {
      throw new NotFoundException(`RFQ ${rfqId} not found`);
    }

    // In the current RFQ workflow, OPEN is the published state exposed to suppliers.
    if (rfq.status !== RFQStatus.OPEN || !rfq.publishedAt) {
      throw new BadRequestException(
        'Only published RFQs can receive responses',
      );
    }

    if (existingResponse) {
      throw new ConflictException(
        'Your organization has already submitted a response to this RFQ',
      );
    }

    if (dto.offerId && !offer) {
      throw new NotFoundException(`Offer ${dto.offerId} not found`);
    }

    if (offer && offer.organizationId !== organizationId) {
      throw new BadRequestException(
        'Offer must belong to the current user organization',
      );
    }

    const response = await (async () => {
      try {
        return await this.prisma.rFQResponse.create({
          data: {
            rfqId,
            organizationId,
            offerId: dto.offerId,
            message: dto.message,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            'Your organization has already submitted a response to this RFQ',
          );
        }
        throw error;
      }
    })();

    // E3: RFQ Response Submitted — notify the RFQ creator
    try {
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
