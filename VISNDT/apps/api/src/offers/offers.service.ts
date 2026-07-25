import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.offer.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, product: true },
      }),
      this.prisma.offer.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { organization: true, product: true },
    });
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);
    return offer;
  }

  async create(
    dto: CreateOfferDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to create an offer',
      );
    }

    const offer = await this.prisma.offer.create({
      data: {
        ...dto,
        organizationId: user.organizationId,
      },
    });

    // E8: Offer Created — notify the organization's admin members
    try {
      await this.notificationsService.createForOrganization(
        user.organizationId,
        {
          type: NotificationType.RESPONSE_UPDATE,
          title: 'New Offer Created',
          message: `A new offer has been created in your organization`,
          referenceType: 'OFFER',
          referenceId: offer.id,
        },
      );
    } catch {
      // Notification failure should not affect the main flow
    }

    return offer;
  }

  async update(
    id: string,
    dto: UpdateOfferDto,
    user: { organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to update an offer',
      );
    }

    const offer = await this.prisma.offer.findFirst({
      where: { id, organizationId: user.organizationId },
    });

    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }

    return this.prisma.offer.update({ where: { id }, data: dto });
  }
}