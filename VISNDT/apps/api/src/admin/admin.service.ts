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
}