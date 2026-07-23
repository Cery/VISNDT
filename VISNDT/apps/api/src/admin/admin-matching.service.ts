import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminMatchingService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatchingStats() {
    const [totalMatches, avgScoreResult, hardFailCount, rematchCount] = await Promise.all([
      this.prisma.demandMatch.count(),
      this.prisma.demandMatch.aggregate({
        _avg: { matchScore: true },
      }),
      this.prisma.demandMatch.count({
        where: { matchScore: { lt: 0 } },
      }),
      this.prisma.workflowEvent.count({
        where: { action: 'CREATED', entityType: 'DEMAND' },
      }),
    ]);

    return {
      totalMatches,
      averageScore: avgScoreResult._avg.matchScore
        ? Math.round(avgScoreResult._avg.matchScore * 100) / 100
        : 0,
      hardFailCount,
      rematchCount,
    };
  }
}