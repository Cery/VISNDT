import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Demand Funnel: status distribution for the full demand lifecycle
   */
  async getBusinessFunnel() {
    const [
      totalDemands,
      draft,
      published,
      submitted,
      processing,
      closed,
      cancelled,
      totalInquiries,
      totalRfqs,
      totalOffers,
      totalMatches,
    ] = await Promise.all([
      this.prisma.demand.count(),
      this.prisma.demand.count({ where: { status: 'DRAFT' } }),
      this.prisma.demand.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.demand.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.demand.count({ where: { status: 'PROCESSING' } }),
      this.prisma.demand.count({ where: { status: 'CLOSED' } }),
      this.prisma.demand.count({ where: { status: 'CANCELLED' } }),
      this.prisma.inquiry.count(),
      this.prisma.rFQ.count(),
      this.prisma.offer.count(),
      this.prisma.demandMatch.count(),
    ]);

    return {
      // Demand status funnel
      demandFunnel: [
        { stage: 'DRAFT', label: '草稿', count: draft },
        { stage: 'PUBLISHED', label: '已发布', count: published },
        { stage: 'SUBMITTED', label: '已提交', count: submitted },
        { stage: 'PROCESSING', label: '处理中', count: processing },
        { stage: 'CLOSED', label: '已关闭', count: closed },
        { stage: 'CANCELLED', label: '已取消', count: cancelled },
      ],
      // Business pipeline overview
      pipeline: {
        totalInquiries,
        totalDemands,
        totalRfqs,
        totalOffers,
        totalMatches,
      },
      // Conversion rates
      conversionRates: {
        inquiryToDemand: totalInquiries > 0 ? Math.round((totalDemands / totalInquiries) * 100) : 0,
        demandToRfq: totalDemands > 0 ? Math.round((totalRfqs / totalDemands) * 100) : 0,
        rfqToOffer: totalRfqs > 0 ? Math.round((totalOffers / totalRfqs) * 100) : 0,
        offerToMatch: totalOffers > 0 ? Math.round((totalMatches / totalOffers) * 100) : 0,
      },
    };
  }

  /**
   * RFQ Lifecycle: RFQ status distribution + response status distribution
   */
  async getBusinessLifecycle() {
    const [
      totalRfqs,
      rfqDraft,
      rfqOpen,
      rfqResponding,
      rfqClosed,
      rfqCancelled,
      totalResponses,
      responseSubmitted,
      responseViewed,
      responseAccepted,
      responseRejected,
    ] = await Promise.all([
      this.prisma.rFQ.count(),
      this.prisma.rFQ.count({ where: { status: 'DRAFT' } }),
      this.prisma.rFQ.count({ where: { status: 'OPEN' } }),
      this.prisma.rFQ.count({ where: { status: 'RESPONDING' } }),
      this.prisma.rFQ.count({ where: { status: 'CLOSED' } }),
      this.prisma.rFQ.count({ where: { status: 'CANCELLED' } }),
      this.prisma.rFQResponse.count(),
      this.prisma.rFQResponse.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.rFQResponse.count({ where: { status: 'VIEWED' } }),
      this.prisma.rFQResponse.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.rFQResponse.count({ where: { status: 'REJECTED' } }),
    ]);

    const rfqCompletionRate = totalRfqs > 0
      ? Math.round(((rfqClosed) / totalRfqs) * 100)
      : 0;

    const responseAcceptRate = totalResponses > 0
      ? Math.round((responseAccepted / totalResponses) * 100)
      : 0;

    const avgResponsesPerRfq = totalRfqs > 0
      ? (totalResponses / totalRfqs).toFixed(1)
      : '0.0';

    return {
      rfqLifecycle: [
        { stage: 'DRAFT', label: '草稿', count: rfqDraft },
        { stage: 'OPEN', label: '开放中', count: rfqOpen },
        { stage: 'RESPONDING', label: '响应中', count: rfqResponding },
        { stage: 'CLOSED', label: '已关闭', count: rfqClosed },
        { stage: 'CANCELLED', label: '已取消', count: rfqCancelled },
      ],
      responseDistribution: [
        { stage: 'SUBMITTED', label: '已提交', count: responseSubmitted },
        { stage: 'VIEWED', label: '已查看', count: responseViewed },
        { stage: 'ACCEPTED', label: '已接受', count: responseAccepted },
        { stage: 'REJECTED', label: '已拒绝', count: responseRejected },
      ],
      metrics: {
        totalRfqs,
        totalResponses,
        rfqCompletionRate,
        responseAcceptRate,
        avgResponsesPerRfq: parseFloat(avgResponsesPerRfq),
      },
    };
  }

  /**
   * Business Conversion Metrics: full pipeline from inquiry to match
   */
  async getBusinessConversion() {
    const [
      totalInquiries,
      inquiryNew,
      inquiryProcessing,
      inquiryReplied,
      inquiryClosed,
      totalDemands,
      totalRfqs,
      rfqWithResponses,
      totalResponses,
      totalOffers,
      offerActive,
      offerAccepted,
      totalMatches,
      matchAccepted,
    ] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: 'NEW' } }),
      this.prisma.inquiry.count({ where: { status: 'PROCESSING' } }),
      this.prisma.inquiry.count({ where: { status: 'REPLIED' } }),
      this.prisma.inquiry.count({ where: { status: 'CLOSED' } }),
      this.prisma.demand.count(),
      this.prisma.rFQ.count(),
      this.prisma.rFQ.count({ where: { status: { in: ['OPEN', 'RESPONDING'] } } }),
      this.prisma.rFQResponse.count(),
      this.prisma.offer.count(),
      this.prisma.offer.count({ where: { status: { in: ['ACTIVE', 'SUBMITTED'] } } }),
      this.prisma.offer.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.demandMatch.count(),
      this.prisma.demandMatch.count({ where: { matchStatus: 'ACCEPTED' } }),
    ]);

    return {
      // Inquiry status distribution
      inquiryStatus: [
        { stage: 'NEW', label: '新询价', count: inquiryNew },
        { stage: 'PROCESSING', label: '处理中', count: inquiryProcessing },
        { stage: 'REPLIED', label: '已回复', count: inquiryReplied },
        { stage: 'CLOSED', label: '已关闭', count: inquiryClosed },
      ],
      // Offer status distribution
      offerStatus: [
        { stage: 'ACTIVE', label: '活跃', count: offerActive },
        { stage: 'ACCEPTED', label: '已接受', count: offerAccepted },
      ],
      // Full conversion pipeline
      pipeline: {
        inquiries: totalInquiries,
        demands: totalDemands,
        rfqs: totalRfqs,
        activeRfqs: rfqWithResponses,
        responses: totalResponses,
        offers: totalOffers,
        acceptedOffers: offerAccepted,
        matches: totalMatches,
        acceptedMatches: matchAccepted,
      },
      // Detailed conversion rates
      conversionRates: {
        inquiryToDemand: totalInquiries > 0 ? Math.round((totalDemands / totalInquiries) * 100) : 0,
        demandToRfq: totalDemands > 0 ? Math.round((totalRfqs / totalDemands) * 100) : 0,
        rfqToResponse: totalRfqs > 0 ? Math.round((totalResponses / totalRfqs) * 100) : 0,
        responseToOffer: totalResponses > 0 ? Math.round((totalOffers / totalResponses) * 100) : 0,
        offerToMatch: totalOffers > 0 ? Math.round((totalMatches / totalOffers) * 100) : 0,
      },
    };
  }

  /**
   * Matching Business Metrics: match score distribution + status distribution
   */
  async getBusinessMatching() {
    const [
      totalMatches,
      matchPending,
      matchMatched,
      matchReviewed,
      matchAccepted,
      matchRejected,
      matchExpired,
      // Score distribution
      highScoreMatches,
      mediumScoreMatches,
      lowScoreMatches,
      // Average score using aggregate
      matchAggregate,
    ] = await Promise.all([
      this.prisma.demandMatch.count(),
      this.prisma.demandMatch.count({ where: { matchStatus: 'PENDING' } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'MATCHED' } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'REVIEWED' } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'ACCEPTED' } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'REJECTED' } }),
      this.prisma.demandMatch.count({ where: { matchStatus: 'EXPIRED' } }),
      this.prisma.demandMatch.count({ where: { matchScore: { gte: 0.7 } } }),
      this.prisma.demandMatch.count({ where: { matchScore: { gte: 0.4, lt: 0.7 } } }),
      this.prisma.demandMatch.count({ where: { matchScore: { lt: 0.4 } } }),
      this.prisma.demandMatch.aggregate({ _avg: { matchScore: true } }),
    ]);

    const averageScore = matchAggregate._avg.matchScore
      ? Math.round(matchAggregate._avg.matchScore * 100)
      : 0;

    return {
      // Match status distribution
      statusDistribution: [
        { status: 'PENDING', label: '待处理', count: matchPending },
        { status: 'MATCHED', label: '已匹配', count: matchMatched },
        { status: 'REVIEWED', label: '已审查', count: matchReviewed },
        { status: 'ACCEPTED', label: '已接受', count: matchAccepted },
        { status: 'REJECTED', label: '已拒绝', count: matchRejected },
        { status: 'EXPIRED', label: '已过期', count: matchExpired },
      ],
      // Score distribution
      scoreDistribution: [
        { range: '高 (≥70%)', label: '高匹配', min: 70, max: 100, count: highScoreMatches },
        { range: '中 (40-69%)', label: '中匹配', min: 40, max: 69, count: mediumScoreMatches },
        { range: '低 (<40%)', label: '低匹配', min: 0, max: 39, count: lowScoreMatches },
      ],
      metrics: {
        totalMatches,
        averageScore,
        acceptRate: totalMatches > 0 ? Math.round((matchAccepted / totalMatches) * 100) : 0,
        rejectRate: totalMatches > 0 ? Math.round((matchRejected / totalMatches) * 100) : 0,
      },
    };
  }
}