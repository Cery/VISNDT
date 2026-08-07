import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationStatus, Prisma } from '@prisma/client';

interface RequestUser {
  id: string;
  email: string;
  organizationId?: string | null;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Determine the access scope for the current user.
   * - ADMIN users: can see notifications from all users in their organization
   * - MEMBER users: can only see their own notifications
   */
  private async getAccessScope(
    requestUser: RequestUser,
  ): Promise<{ userId?: string; organizationId?: string }> {
    // Check if user is an ADMIN in any organization
    const isAdmin = await this.prisma.organizationMember.findFirst({
      where: { userId: requestUser.id, role: 'ADMIN' },
    });

    if (isAdmin && requestUser.organizationId) {
      // ADMIN: org-scoped access
      return { organizationId: requestUser.organizationId };
    }

    // MEMBER: own notifications only
    return { userId: requestUser.id };
  }

  /**
   * Build Prisma where clause from access scope and optional filters
   */
  private buildWhereClause(
    scope: { userId?: string; organizationId?: string },
    query: QueryNotificationsDto,
  ) {
    const where: Record<string, unknown> = {};

    if (scope.userId) {
      where.userId = scope.userId;
    } else if (scope.organizationId) {
      where.user = { organizationId: scope.organizationId };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    return where;
  }

  async findAll(query: QueryNotificationsDto, requestUser: RequestUser) {
    const { page = 1, pageSize = 20 } = query;
    const skip = (page - 1) * pageSize;
    const scope = await this.getAccessScope(requestUser);
    const where = this.buildWhereClause(scope, query);

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string, requestUser: RequestUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: { user: { select: { id: true, organizationId: true } } },
    });

    if (!notification) {
      throw new NotFoundException(`Notification ${id} not found`);
    }

    await this.validateAccess(notification, requestUser);
    return notification;
  }

  async markAsRead(id: string, requestUser: RequestUser) {
    const notification = await this.findOne(id, requestUser);

    return this.prisma.notification.update({
      where: { id: notification.id },
      data: { status: NotificationStatus.READ },
    });
  }

  async markAllAsRead(requestUser: RequestUser) {
    const scope = await this.getAccessScope(requestUser);
    const where: Record<string, unknown> = { status: NotificationStatus.UNREAD };

    if (scope.userId) {
      where.userId = scope.userId;
    } else if (scope.organizationId) {
      where.user = { organizationId: scope.organizationId };
    }

    const result = await this.prisma.notification.updateMany({
      where,
      data: { status: NotificationStatus.READ },
    });

    return { updatedCount: result.count };
  }

  async getUnreadCount(requestUser: RequestUser) {
    const scope = await this.getAccessScope(requestUser);
    const where: Record<string, unknown> = { status: NotificationStatus.UNREAD };

    if (scope.userId) {
      where.userId = scope.userId;
    } else if (scope.organizationId) {
      where.user = { organizationId: scope.organizationId };
    }

    const count = await this.prisma.notification.count({ where });
    return { count };
  }

  /**
   * Validate that the requesting user has access to the notification.
   * - ADMIN: can access notifications from users in their organization
   * - MEMBER: can only access their own notifications
   */
  private async validateAccess(
    notification: { userId: string; user?: { organizationId: string | null } },
    requestUser: RequestUser,
  ): Promise<void> {
    // Own notification — always allowed
    if (notification.userId === requestUser.id) return;

    // Check if ADMIN in the same org
    const isAdmin = await this.prisma.organizationMember.findFirst({
      where: { userId: requestUser.id, role: 'ADMIN' },
    });

    if (
      isAdmin &&
      requestUser.organizationId &&
      notification.user?.organizationId === requestUser.organizationId
    ) {
      return;
    }

    throw new ForbiddenException('You do not have access to this notification');
  }

  /**
   * Create a notification for a specific user.
   * This is an internal method — not exposed via API.
   */
  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
      },
    });
  }

  /**
   * Create notifications for all ADMIN members of an organization.
   * Gracefully returns [] if no members are found.
   * This is an internal method — not exposed via API.
   */
  async createForOrganization(
    organizationId: string,
    dto: Omit<CreateNotificationDto, 'userId'>,
  ) {
    // Query ADMIN members of the organization
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId, role: 'ADMIN' },
      select: { userId: true },
    });

    if (members.length === 0) {
      return [];
    }

    const data: Prisma.NotificationCreateManyInput[] = members.map(
      (member) => ({
        userId: member.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
      }),
    );

    await this.prisma.notification.createMany({ data });

    // Return the created notifications
    return this.prisma.notification.findMany({
      where: {
        userId: { in: members.map((m) => m.userId) },
        type: dto.type,
        title: dto.title,
      },
      orderBy: { createdAt: 'desc' },
      take: members.length,
    });
  }

  async batchDelete(ids: string[]) {
    const result = await this.prisma.notification.deleteMany({
      where: { id: { in: ids } },
    });
    return { deletedCount: result.count };
  }
}