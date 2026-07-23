import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as crypto from 'crypto';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);
  private readonly EXPIRY_DAYS = 7;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an invitation for a new user.
   * Only ADMIN role can call this (enforced by controller guard).
   */
  async createInvitation(
    organizationId: string,
    createdBy: string,
    dto: CreateInvitationDto,
  ) {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.EXPIRY_DAYS);

    const invitation = await this.prisma.userInvitation.create({
      data: {
        email: dto.email,
        token,
        organizationId,
        role: dto.role ?? 'MEMBER',
        status: 'PENDING',
        expiresAt,
        createdBy,
      },
    });

    this.logger.log(
      `Invitation created for ${dto.email} (org=${organizationId}, role=${dto.role ?? 'MEMBER'})`,
    );

    return {
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
    };
  }

  /**
   * Validate an invitation token.
   * Returns the invitation if valid, or null if invalid/expired/used.
   */
  async validateInvitation(token: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return null;
    }

    if (invitation.status === 'USED') {
      return null;
    }

    if (invitation.status === 'EXPIRED' || new Date() > invitation.expiresAt) {
      // Mark as expired
      if (invitation.status !== 'EXPIRED') {
        await this.prisma.userInvitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' },
        });
      }
      return null;
    }

    if (invitation.status !== 'PENDING') {
      return null;
    }

    return invitation;
  }

  /**
   * Consume an invitation (mark as USED).
   */
  async consumeInvitation(token: string) {
    await this.prisma.userInvitation.update({
      where: { token },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
    });
  }
}