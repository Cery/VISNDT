import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalOrganizations,
      totalProducts,
      totalDemands,
      publishedDemands,
      totalMatches,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.organization.count(),
      this.prisma.product.count(),
      this.prisma.demand.count(),
      this.prisma.demand.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.demandMatch.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      organizations: {
        total: totalOrganizations,
      },
      products: {
        total: totalProducts,
      },
      demands: {
        total: totalDemands,
        published: publishedDemands,
      },
      matching: {
        totalMatches,
      },
    };
  }

  async getRecentActivities() {
    const [users, demands, matches, notifications] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.demand.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.demandMatch.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          matchScore: true,
          matchStatus: true,
          createdAt: true,
        },
      }),
      this.prisma.notification.findMany({
        where: { status: 'UNREAD' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          type: true,
          title: true,
          createdAt: true,
        },
      }),
    ]);

    return { users, demands, matches, notifications };
  }

  async getPendingItems() {
    const [
      usersPending,
      demandsPending,
      rfqPending,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { status: { in: ['INACTIVE', 'SUSPENDED'] } },
      }),
      this.prisma.demand.count({
        where: { status: 'DRAFT' },
      }),
      this.prisma.rFQ.count({
        where: { status: { in: ['DRAFT', 'OPEN'] } },
      }),
      this.prisma.notification.count({
        where: { status: 'UNREAD' },
      }),
    ]);

    return {
      usersPending,
      demandsPending,
      rfqPending,
      unreadNotifications,
    };
  }

  async getSystemStatus() {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    const lastDemand = await this.prisma.demand.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const latestDate = [lastUser?.createdAt, lastDemand?.createdAt]
      .filter((d): d is Date => d !== null && d !== undefined)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const [users, organizations, products, demands, matches] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.product.count(),
      this.prisma.demand.count(),
      this.prisma.demandMatch.count(),
    ]);

    return {
      database: 'connected',
      api: 'healthy',
      lastUpdated: latestDate?.toISOString() ?? new Date().toISOString(),
      entityCounts: {
        users,
        organizations,
        products,
        demands,
        matches,
      },
    };
  }
}