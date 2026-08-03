import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

interface RequestUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
}

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateInquiryDto) {
    // Step 1: Validate Product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, name: true },
    });
    if (!product) {
      throw new NotFoundException(`Product ${dto.productId} not found`);
    }

    // Step 2: Validate Offer exists and belongs to the product
    const offer = await this.prisma.offer.findFirst({
      where: {
        id: dto.offerId,
        productId: dto.productId,
      },
      select: { id: true, organizationId: true },
    });
    if (!offer) {
      throw new NotFoundException(
        `Offer ${dto.offerId} not found for product ${dto.productId}`,
      );
    }

    // Step 3: Validate Organization exists and matches the offer
    if (offer.organizationId !== dto.organizationId) {
      throw new NotFoundException(
        `Organization ${dto.organizationId} does not match offer ${dto.offerId}`,
      );
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
      select: { id: true, name: true },
    });
    if (!organization) {
      throw new NotFoundException(`Organization ${dto.organizationId} not found`);
    }

    // Step 4: Persist Inquiry entity
    const inquiry = await this.prisma.inquiry.create({
      data: {
        productId: dto.productId,
        organizationId: dto.organizationId,
        contactName: dto.name,
        contactEmail: dto.email,
        contactPhone: dto.phone,
        message: dto.message,
      },
    });

    // Step 5: Find organization members to notify
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId: dto.organizationId },
      select: { userId: true },
    });

    if (members.length === 0) {
      return {
        inquiry: {
          id: inquiry.id,
          productId: inquiry.productId,
          productName: product.name,
          organizationId: inquiry.organizationId,
          organizationName: organization.name,
          contactName: inquiry.contactName,
          contactEmail: inquiry.contactEmail,
          status: inquiry.status,
          createdAt: inquiry.createdAt.toISOString(),
        },
        notificationsSent: 0,
      };
    }

    // Step 6: Create notifications for all organization members
    // referenceId now points to inquiry.id (not productId)
    const phoneInfo = dto.phone ? ` Phone: ${dto.phone}.` : '';
    const notificationMessage =
      `Inquiry from ${dto.name} (${dto.email}).${phoneInfo} ` +
      `Product: ${product.name}. Message: ${dto.message}`;

    for (const member of members) {
      await this.notificationsService.create({
        userId: member.userId,
        type: NotificationType.SYSTEM,
        title: `New Product Inquiry: ${product.name}`,
        message: notificationMessage,
        referenceType: 'INQUIRY',
        referenceId: inquiry.id,
      });
    }

    return {
      inquiry: {
        id: inquiry.id,
        productId: inquiry.productId,
        productName: product.name,
        organizationId: inquiry.organizationId,
        organizationName: organization.name,
        contactName: inquiry.contactName,
        contactEmail: inquiry.contactEmail,
        status: inquiry.status,
        createdAt: inquiry.createdAt.toISOString(),
      },
      notificationsSent: members.length,
    };
  }

  /**
   * Get inquiries for the current user's organization.
   * Queries the Inquiry table directly with organization scope.
   */
  async getMyInquiries(user: RequestUser, page: number, pageSize: number) {
    if (!user.organizationId) {
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const where: Prisma.InquiryWhereInput = {
      organizationId: user.organizationId,
    };

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: data.map((inquiry) => this.mapToInquiryResponse(inquiry)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get a single inquiry by its ID.
   * Validates that the requesting user belongs to the same organization.
   */
  async getInquiryById(id: string, user: RequestUser) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    // Organization scope check: user must belong to the same organization
    if (
      user.organizationId &&
      inquiry.organizationId !== user.organizationId
    ) {
      throw new ForbiddenException(
        'You do not have access to this inquiry',
      );
    }

    return this.mapToInquiryResponse(inquiry);
  }

  /**
   * Map an Inquiry entity to a response shape.
   */
  private mapToInquiryResponse(inquiry: {
    id: string;
    productId: string | null;
    organizationId: string | null;
    createdById: string | null;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: inquiry.id,
      productId: inquiry.productId,
      organizationId: inquiry.organizationId,
      createdById: inquiry.createdById,
      contactName: inquiry.contactName,
      contactEmail: inquiry.contactEmail,
      contactPhone: inquiry.contactPhone,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
    };
  }
}