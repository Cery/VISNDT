import { Injectable, Logger } from '@nestjs/common';
import { DemandMatchStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring/scoring.service';
import { CategoryHelper } from './helpers/category.helper';
import { MatchResultDto } from './dto/match-result.dto';
import { DEFAULT_MATCH_CONFIG } from './types/match-context';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
    private readonly categoryHelper: CategoryHelper,
  ) {}

  /**
   * 对指定 Demand 执行全量匹配。
   * 在 Demand.publish() 后调用。
   */
  async match(demandId: string): Promise<MatchResultDto> {
    const startTime = Date.now();

    // Step 1: 加载 Demand（含参数 + 参数定义）
    const demand = await this.prisma.demand.findUnique({
      where: { id: demandId },
      include: {
        parameters: {
          include: { parameterDefinition: true },
        },
      },
    });

    if (!demand) {
      this.logger.warn(`Demand ${demandId} not found, skipping match`);
      return { matched: 0, skipped: 0, totalCandidates: 0, elapsedMs: 0 };
    }

    const demandParams = demand.parameters;

    // 如果 Demand 没有参数，跳过匹配
    if (demandParams.length === 0) {
      this.logger.log(`Demand ${demandId} has no parameters, skipping match`);
      return { matched: 0, skipped: 0, totalCandidates: 0, elapsedMs: 0 };
    }

    // Step 2: 查询候选产品（ACTIVE + 有 ACTIVE Offer + Category Filter）
    // 如果 Demand 有 categoryId，只查询同分类产品；否则查询全部
    const demandCategoryId = await this.categoryHelper.getDemandCategoryId(demandId);
    const categoryFilter = demandCategoryId
      ? { categoryId: demandCategoryId }
      : {};

    const candidates = await this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        ...categoryFilter,
        offers: {
          some: { status: 'ACTIVE' },
        },
      },
      include: {
        parameterValues: {
          include: { parameterDefinition: true },
        },
        offers: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (candidates.length === 0) {
      this.logger.log(`No candidate products found for Demand ${demandId}`);
      return { matched: 0, skipped: 0, totalCandidates: 0, elapsedMs: Date.now() - startTime };
    }

    // Step 3-4: 逐产品评分
    const scoredResults: Array<{
      productId: string;
      offerId: string | null;
      matchScore: number;
      matchDetails: Record<string, unknown>;
    }> = [];

    let skippedCount = 0;

    for (const candidate of candidates) {
      const scoreResult = this.scoring.calculateScore(
        demandParams.map((dp) => ({
          id: dp.id,
          parameterDefinitionId: dp.parameterDefinitionId,
          parameterDefinition: {
            id: dp.parameterDefinition.id,
            name: dp.parameterDefinition.name,
            code: dp.parameterDefinition.code,
            dataType: dp.parameterDefinition.dataType,
            unit: dp.parameterDefinition.unit,
          },
          value: dp.value,
          valueMin: dp.valueMin,
          valueMax: dp.valueMax,
          required: dp.required,
          priority: dp.priority,
        })),
        {
          id: candidate.id,
          name: candidate.name,
          parameterValues: candidate.parameterValues,
          offers: candidate.offers,
        },
      );

      // Step 5: 过滤低分匹配
      if (scoreResult.totalScore < DEFAULT_MATCH_CONFIG.minMatchScore) {
        skippedCount++;
        continue;
      }

      // 选择最佳 Offer（第一个 ACTIVE）
      const bestOffer = candidate.offers[0] ?? null;

      scoredResults.push({
        productId: candidate.id,
        offerId: bestOffer?.id ?? null,
        matchScore: scoreResult.totalScore,
        matchDetails: {
          algorithm: 'weighted_v1',
          totalParameters: scoreResult.totalParameters,
          matchedParameters: scoreResult.matchedParameters,
          matchRate: scoreResult.matchRate,
          hardFail: scoreResult.hardFail,
          failReason: scoreResult.failReason,
          parameterScores: scoreResult.parameterScores.map((ps) => ({
            parameterDefinitionId: ps.parameterDefinitionId,
            parameterName: ps.parameterName,
            parameterCode: ps.parameterCode,
            dataType: ps.dataType,
            demandValue: ps.demandValue,
            demandRange: ps.demandRange,
            productValue: ps.productValue,
            productValueNumber: ps.productValueNumber,
            score: ps.score,
            weight: ps.weight,
            required: ps.required,
            type: ps.type,
            unit: ps.unit,
          })),
        },
      });
    }

    // 按分数降序排列，限制数量
    scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    const topResults = scoredResults.slice(0, DEFAULT_MATCH_CONFIG.maxMatchesPerDemand);

    // Step 6: 批量创建/更新 DemandMatch
    let matchedCount = 0;
    for (const result of topResults) {
      await this.prisma.demandMatch.upsert({
        where: {
          demandId_productId: {
            demandId,
            productId: result.productId,
          },
        },
        create: {
          demandId,
          productId: result.productId,
          offerId: result.offerId,
          matchScore: result.matchScore,
          matchStatus: DemandMatchStatus.MATCHED,
          matchDetails: result.matchDetails as any,
          matchedAt: new Date(),
        },
        update: {
          matchScore: result.matchScore,
          matchStatus: DemandMatchStatus.MATCHED,
          matchDetails: result.matchDetails as any,
          offerId: result.offerId,
          matchedAt: new Date(),
        },
      });
      matchedCount++;
    }

    const elapsedMs = Date.now() - startTime;
    this.logger.log(
      `Demand ${demandId} matched: ${matchedCount} matched, ${skippedCount} skipped, ${candidates.length} candidates, ${elapsedMs}ms`,
    );

    return {
      matched: matchedCount,
      skipped: skippedCount,
      totalCandidates: candidates.length,
      elapsedMs,
    };
  }
}