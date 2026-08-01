import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

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

    // Step 4: Find organization members to notify
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId: dto.organizationId },
      select: { userId: true },
    });

    if (members.length === 0) {
      // No members to notify — still return success
      return {
        inquiry: {
          productId: dto.productId,
          productName: product.name,
          organizationId: dto.organizationId,
          organizationName: organization.name,
          visitorName: dto.name,
          visitorEmail: dto.email,
        },
        notificationsSent: 0,
      };
    }

    // Step 5: Create notifications for all organization members
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
        referenceId: dto.productId,
      });
    }

    return {
      inquiry: {
        productId: dto.productId,
        productName: product.name,
        organizationId: dto.organizationId,
        organizationName: organization.name,
        visitorName: dto.name,
        visitorEmail: dto.email,
      },
      notificationsSent: members.length,
    };
  }
}