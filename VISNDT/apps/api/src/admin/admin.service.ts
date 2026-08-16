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
      totalContent,
      totalDemands,
      publishedDemands,
      totalInquiries,
      totalRfqs,
      totalOffers,
      totalMatches,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.organization.count(),
      this.prisma.product.count(),
      this.prisma.content.count(),
      this.prisma.demand.count(),
      this.prisma.demand.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.inquiry.count(),
      this.prisma.rFQ.count(),
      this.prisma.offer.count(),
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
      content: {
        total: totalContent,
      },
      demands: {
        total: totalDemands,
        published: publishedDemands,
      },
      inquiries: {
        total: totalInquiries,
      },
      rfqs: {
        total: totalRfqs,
      },
      offers: {
        total: totalOffers,
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
      inquiriesPending,
      rfqPending,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { status: { in: ['INACTIVE', 'SUSPENDED'] } },
      }),
      this.prisma.demand.count({
        where: { status: 'DRAFT' },
      }),
      this.prisma.inquiry.count({
        where: { status: 'NEW' },
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
      inquiriesPending,
      rfqPending,
      unreadNotifications,
    };
  }

  async getDashboardTrend() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const events = await this.prisma.conversionEvent.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { event: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Build daily trend map for the last 7 days
    const dailyMap: Record<string, {
      pageViews: number; productViews: number; contentViews: number;
      searches: number; inquiries: number; ctaClicks: number;
    }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { pageViews: 0, productViews: 0, contentViews: 0, searches: 0, inquiries: 0, ctaClicks: 0 };
    }

    for (const evt of events) {
      const key = evt.createdAt.toISOString().slice(0, 10);
      if (!dailyMap[key]) continue;
      switch (evt.event) {
        case 'PAGE_VIEW': dailyMap[key].pageViews++; break;
        case 'PRODUCT_VIEW': dailyMap[key].productViews++; break;
        case 'CONTENT_VIEW': dailyMap[key].contentViews++; break;
        case 'SEARCH': dailyMap[key].searches++; break;
        case 'INQUIRY_START':
        case 'INQUIRY_SUBMIT': dailyMap[key].inquiries++; break;
        case 'CTA_CLICK': dailyMap[key].ctaClicks++; break;
      }
    }

    return Object.entries(dailyMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));
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