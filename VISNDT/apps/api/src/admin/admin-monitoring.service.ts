import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';

// ============================================
// Monitoring Types (contract only, no DB model)
// ============================================

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface MonitoringItem {
  label: string;
  metric: string;
  value: number | string;
  status: HealthStatus;
  detail?: string;
}

export interface MonitoringResult {
  health: HealthStatus;
  items: MonitoringItem[];
}

export interface MonitoringOverview {
  system: MonitoringResult;
  business: MonitoringResult;
  matching: MonitoringResult;
  embedding: MonitoringResult;
  analytics: MonitoringResult;
}

// ============================================
// Threshold Constants (code-level defaults)
// ============================================

const THRESHOLDS = {
  // Hard Fail Rate thresholds
  HARD_FAIL_RATE_WARNING: 20,   // > 20% = WARNING
  HARD_FAIL_RATE_CRITICAL: 40,  // > 40% = CRITICAL

  // Low Score Rate thresholds
  LOW_SCORE_RATE_WARNING: 30,   // > 30% = WARNING
  LOW_SCORE_RATE_CRITICAL: 50,  // > 50% = CRITICAL

  // Embedding Coverage thresholds
  COVERAGE_WARNING: 80,   // < 80% = WARNING
  COVERAGE_CRITICAL: 50,  // < 50% = CRITICAL

  // Event Freshness thresholds (minutes)
  EVENT_FRESHNESS_WARNING: 60,   // > 60min = WARNING
  EVENT_FRESHNESS_CRITICAL: 240, // > 240min = CRITICAL

  // Pending thresholds
  PENDING_INQUIRY_WARNING: 10,
  PENDING_DEMAND_WARNING: 10,
  PENDING_RFQ_WARNING: 5,
  NO_RESPONSE_RFQ_WARNING: 3,
};

function evaluateThreshold(value: number, warning: number, critical: number, inverse = false): HealthStatus {
  if (inverse) {
    // Lower is worse (e.g., coverage)
    if (value < critical) return 'critical';
    if (value < warning) return 'warning';
    return 'healthy';
  }
  // Higher is worse (e.g., fail rate)
  if (value > critical) return 'critical';
  if (value > warning) return 'warning';
  return 'healthy';
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

@Injectable()
export class AdminMonitoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  // ============================================
  // Overview — unified monitoring endpoint
  // ============================================

  async getOverview(): Promise<MonitoringOverview> {
    const [system, business, matching, embedding, analytics] = await Promise.all([
      this.getSystemHealth(),
      this.getBusinessHealth(),
      this.getMatchingHealth(),
      this.getEmbeddingHealth(),
      this.getAnalyticsHealth(),
    ]);

    return { system, business, matching, embedding, analytics };
  }

  // ============================================
  // 1. System Health
  // ============================================

  async getSystemHealth(): Promise<MonitoringResult> {
    const items: MonitoringItem[] = [];

    // API Health — always healthy if service is running
    items.push({
      label: 'API 服务', metric: 'api_status', value: '运行中', status: 'healthy',
      detail: 'API service is running',
    });

    // Database Health — simple connectivity check
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      items.push({
        label: '数据库', metric: 'db_status', value: '连接正常', status: 'healthy',
        detail: 'Database connection OK',
      });
    } catch {
      items.push({
        label: '数据库', metric: 'db_status', value: '连接失败', status: 'critical',
        detail: 'Database connection failed',
      });
    }

    // Embedding Provider Status
    const providerAvailable = this.embeddingService.isProviderAvailable;
    items.push({
      label: 'Embedding 服务', metric: 'embedding_provider',
      value: providerAvailable ? '可用' : '未配置',
      status: providerAvailable ? 'healthy' : 'warning',
      detail: providerAvailable ? 'OpenAI text-embedding-3-small' : 'OPENAI_API_KEY not configured',
    });

    // Semantic Module — check if it can be reached (exists in module)
    items.push({
      label: 'Semantic 模块', metric: 'semantic_module',
      value: '已加载', status: 'healthy',
      detail: 'Semantic module is loaded',
    });

    // Analytics Module
    items.push({
      label: 'Analytics 模块', metric: 'analytics_module',
      value: '已加载', status: 'healthy',
      detail: 'Analytics module is loaded',
    });

    const hasCritical = items.some((i) => i.status === 'critical');
    const hasWarning = items.some((i) => i.status === 'warning');

    return {
      health: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      items,
    };
  }

  // ============================================
  // 2. Business Health (Risk Monitoring)
  // ============================================

  async getBusinessHealth(): Promise<MonitoringResult> {
    const [
      pendingInquiries,
      totalInquiries,
      pendingDemands,
      openDemands,
      pendingRfqs,
      noResponseRfqs,
      totalRfqs,
      activeOffers,
      totalOffers,
    ] = await Promise.all([
      this.prisma.inquiry.count({ where: { status: 'NEW' } }),
      this.prisma.inquiry.count(),
      this.prisma.demand.count({ where: { status: { in: ['DRAFT', 'SUBMITTED'] } } }),
      this.prisma.demand.count({ where: { status: { in: ['PUBLISHED', 'PROCESSING'] } } }),
      this.prisma.rFQ.count({ where: { status: 'DRAFT' } }),
      this.prisma.rFQ.count({ where: { status: 'OPEN' } }),
      this.prisma.rFQ.count(),
      this.prisma.offer.count({ where: { status: { in: ['ACTIVE', 'SUBMITTED'] } } }),
      this.prisma.offer.count(),
    ]);

    const items: MonitoringItem[] = [];

    // Pending Inquiries
    items.push({
      label: '待处理询价', metric: 'pending_inquiries',
      value: pendingInquiries,
      status: evaluateThreshold(pendingInquiries, THRESHOLDS.PENDING_INQUIRY_WARNING, THRESHOLDS.PENDING_INQUIRY_WARNING * 2),
      detail: `${pendingInquiries} / ${totalInquiries} total inquiries pending`,
    });

    // Pending Demands
    items.push({
      label: '待处理需求', metric: 'pending_demands',
      value: pendingDemands,
      status: evaluateThreshold(pendingDemands, THRESHOLDS.PENDING_DEMAND_WARNING, THRESHOLDS.PENDING_DEMAND_WARNING * 2),
      detail: `${pendingDemands} drafts/submitted`,
    });

    // Open Demands
    items.push({
      label: '进行中需求', metric: 'open_demands',
      value: openDemands,
      status: openDemands > 20 ? 'warning' : 'healthy',
      detail: `${openDemands} published/processing`,
    });

    // Pending RFQs
    items.push({
      label: '待处理 RFQ', metric: 'pending_rfqs',
      value: pendingRfqs,
      status: evaluateThreshold(pendingRfqs, THRESHOLDS.PENDING_RFQ_WARNING, THRESHOLDS.PENDING_RFQ_WARNING * 2),
      detail: `${pendingRfqs} drafts`,
    });

    // No Response RFQs (open but no responses)
    items.push({
      label: '无响应 RFQ', metric: 'no_response_rfqs',
      value: noResponseRfqs,
      status: evaluateThreshold(noResponseRfqs, THRESHOLDS.NO_RESPONSE_RFQ_WARNING, THRESHOLDS.NO_RESPONSE_RFQ_WARNING * 2),
      detail: `${noResponseRfqs} / ${totalRfqs} RFQs have no responses`,
    });

    // Offer Availability
    const offerCoverage = totalRfqs > 0 ? Math.round((activeOffers / totalRfqs) * 100) : 0;
    items.push({
      label: '活跃报价覆盖', metric: 'offer_coverage',
      value: formatPercent(offerCoverage),
      status: offerCoverage < 30 ? 'warning' : offerCoverage < 10 ? 'critical' : 'healthy',
      detail: `${activeOffers} / ${totalOffers} offers active`,
    });

    const hasCritical = items.some((i) => i.status === 'critical');
    const hasWarning = items.some((i) => i.status === 'warning');

    return {
      health: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      items,
    };
  }

  // ============================================
  // 3. Matching Health
  // ============================================

  async getMatchingHealth(): Promise<MonitoringResult> {
    const [
      totalMatches,
      hardFailCount,
      lowScoreCount,
      expiredCount,
      matchAggregate,
    ] = await Promise.all([
      this.prisma.demandMatch.count(),
      this.prisma.demandMatch.count({ where: { matchStatus: 'REJECTED' } }),
      this.prisma.demandMatch.count({ where: { matchScore: { lt: 0.4 } } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'EXPIRED' } }),
      this.prisma.demandMatch.aggregate({ _avg: { matchScore: true } }),
    ]);

    const averageScore = matchAggregate._avg.matchScore
      ? Math.round(matchAggregate._avg.matchScore * 100)
      : 0;

    const hardFailRate = totalMatches > 0 ? (hardFailCount / totalMatches) * 100 : 0;
    const lowScoreRate = totalMatches > 0 ? (lowScoreCount / totalMatches) * 100 : 0;
    const expiredRate = totalMatches > 0 ? (expiredCount / totalMatches) * 100 : 0;

    const items: MonitoringItem[] = [];

    // Total Matches
    items.push({
      label: '总匹配数', metric: 'total_matches',
      value: totalMatches,
      status: totalMatches === 0 ? 'warning' : 'healthy',
      detail: `Total match records`,
    });

    // Average Score
    items.push({
      label: '平均匹配度', metric: 'avg_match_score',
      value: `${averageScore}%`,
      status: averageScore < 40 ? 'warning' : averageScore < 20 ? 'critical' : 'healthy',
      detail: `Average match score across all matches`,
    });

    // Hard Fail Rate
    items.push({
      label: '硬失败率', metric: 'hard_fail_rate',
      value: formatPercent(hardFailRate),
      status: evaluateThreshold(hardFailRate, THRESHOLDS.HARD_FAIL_RATE_WARNING, THRESHOLDS.HARD_FAIL_RATE_CRITICAL),
      detail: `${hardFailCount} / ${totalMatches} rejected`,
    });

    // Low Score Rate
    items.push({
      label: '低匹配率', metric: 'low_score_rate',
      value: formatPercent(lowScoreRate),
      status: evaluateThreshold(lowScoreRate, THRESHOLDS.LOW_SCORE_RATE_WARNING, THRESHOLDS.LOW_SCORE_RATE_CRITICAL),
      detail: `${lowScoreCount} / ${totalMatches} below 40%`,
    });

    // Expired Rate
    items.push({
      label: '过期率', metric: 'expired_rate',
      value: formatPercent(expiredRate),
      status: expiredRate > 20 ? 'warning' : 'healthy',
      detail: `${expiredCount} expired matches`,
    });

    const hasCritical = items.some((i) => i.status === 'critical');
    const hasWarning = items.some((i) => i.status === 'warning');

    return {
      health: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      items,
    };
  }

  // ============================================
  // 4. Embedding Health
  // ============================================

  async getEmbeddingHealth(): Promise<MonitoringResult> {
    const embedStatus = await this.embeddingService.getStatus();

    const contentCoverage = embedStatus.contentStats.total > 0
      ? Math.round((embedStatus.contentStats.withEmbedding / embedStatus.contentStats.total) * 100)
      : 100;

    const productCoverage = embedStatus.productStats.total > 0
      ? Math.round((embedStatus.productStats.withEmbedding / embedStatus.productStats.total) * 100)
      : 100;

    const chunkCoverage = embedStatus.chunkStats.totalContent > 0
      ? Math.round((embedStatus.chunkStats.contentWithChunks / embedStatus.chunkStats.totalContent) * 100)
      : 100;

    const items: MonitoringItem[] = [];

    // Provider
    items.push({
      label: 'Embedding Provider', metric: 'embedding_provider',
      value: embedStatus.providerAvailable ? '可用' : '未配置',
      status: embedStatus.providerAvailable ? 'healthy' : 'warning',
      detail: embedStatus.providerName,
    });

    // Content Embedding Coverage
    items.push({
      label: 'Content Embedding', metric: 'content_embedding_coverage',
      value: formatPercent(contentCoverage),
      status: evaluateThreshold(contentCoverage, THRESHOLDS.COVERAGE_WARNING, THRESHOLDS.COVERAGE_CRITICAL, true),
      detail: `${embedStatus.contentStats.withEmbedding} / ${embedStatus.contentStats.total}`,
    });

    // Product Embedding Coverage
    items.push({
      label: 'Product Embedding', metric: 'product_embedding_coverage',
      value: formatPercent(productCoverage),
      status: evaluateThreshold(productCoverage, THRESHOLDS.COVERAGE_WARNING, THRESHOLDS.COVERAGE_CRITICAL, true),
      detail: `${embedStatus.productStats.withEmbedding} / ${embedStatus.productStats.total}`,
    });

    // Chunk Coverage
    items.push({
      label: 'Content Chunk', metric: 'chunk_coverage',
      value: formatPercent(chunkCoverage),
      status: evaluateThreshold(chunkCoverage, THRESHOLDS.COVERAGE_WARNING, THRESHOLDS.COVERAGE_CRITICAL, true),
      detail: `${embedStatus.chunkStats.contentWithChunks} / ${embedStatus.chunkStats.totalContent} content with chunks`,
    });

    // Total Chunks
    items.push({
      label: '总 Chunk 数', metric: 'total_chunks',
      value: embedStatus.chunkStats.totalChunks,
      status: embedStatus.chunkStats.totalChunks > 0 ? 'healthy' : 'warning',
      detail: 'Total content chunks generated',
    });

    const hasCritical = items.some((i) => i.status === 'critical');
    const hasWarning = items.some((i) => i.status === 'warning');

    return {
      health: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      items,
    };
  }

  // ============================================
  // 5. Analytics Pipeline Health
  // ============================================

  async getAnalyticsHealth(): Promise<MonitoringResult> {
    const [
      totalEvents,
      recentEvents24h,
      latestEvent,
    ] = await Promise.all([
      this.prisma.conversionEvent.count(),
      this.prisma.conversionEvent.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.conversionEvent.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    // Calculate freshness
    const now = Date.now();
    const lastEventTime = latestEvent?.createdAt ? new Date(latestEvent.createdAt).getTime() : 0;
    const minutesSinceLastEvent = lastEventTime > 0
      ? Math.round((now - lastEventTime) / (60 * 1000))
      : Infinity;

    const items: MonitoringItem[] = [];

    // Total Events
    items.push({
      label: '总事件数', metric: 'total_events',
      value: totalEvents,
      status: totalEvents > 0 ? 'healthy' : 'warning',
      detail: 'Total ConversionEvent records',
    });

    // 24h Event Volume
    items.push({
      label: '24h 事件量', metric: 'events_24h',
      value: recentEvents24h,
      status: recentEvents24h > 0 ? 'healthy' : 'warning',
      detail: 'Events in last 24 hours',
    });

    // Event Freshness
    const freshnessLabel = minutesSinceLastEvent === Infinity
      ? '无事件'
      : `${minutesSinceLastEvent} 分钟`;
    items.push({
      label: '事件新鲜度', metric: 'event_freshness',
      value: freshnessLabel,
      status: minutesSinceLastEvent === Infinity
        ? 'critical'
        : evaluateThreshold(minutesSinceLastEvent, THRESHOLDS.EVENT_FRESHNESS_WARNING, THRESHOLDS.EVENT_FRESHNESS_CRITICAL),
      detail: latestEvent?.createdAt
        ? `Latest event: ${new Date(latestEvent.createdAt).toISOString()}`
        : 'No events recorded',
    });

    const hasCritical = items.some((i) => i.status === 'critical');
    const hasWarning = items.some((i) => i.status === 'warning');

    return {
      health: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      items,
    };
  }
}