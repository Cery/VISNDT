export interface DemandFunnelItem {
  stage: string;
  label: string;
  count: number;
}

export interface PipelineOverview {
  totalInquiries: number;
  totalDemands: number;
  totalRfqs: number;
  totalOffers: number;
  totalMatches: number;
}

export interface ConversionRates {
  inquiryToDemand: number;
  demandToRfq: number;
  rfqToOffer: number;
  offerToMatch: number;
}

export interface BusinessFunnel {
  demandFunnel: DemandFunnelItem[];
  pipeline: PipelineOverview;
  conversionRates: ConversionRates;
}

export interface RfqLifecycleItem {
  stage: string;
  label: string;
  count: number;
}

export interface ResponseDistributionItem {
  stage: string;
  label: string;
  count: number;
}

export interface LifecycleMetrics {
  totalRfqs: number;
  totalResponses: number;
  rfqCompletionRate: number;
  responseAcceptRate: number;
  avgResponsesPerRfq: number;
}

export interface BusinessLifecycle {
  rfqLifecycle: RfqLifecycleItem[];
  responseDistribution: ResponseDistributionItem[];
  metrics: LifecycleMetrics;
}

export interface InquiryStatusItem {
  stage: string;
  label: string;
  count: number;
}

export interface OfferStatusItem {
  stage: string;
  label: string;
  count: number;
}

export interface ConversionPipeline {
  inquiries: number;
  demands: number;
  rfqs: number;
  activeRfqs: number;
  responses: number;
  offers: number;
  acceptedOffers: number;
  matches: number;
  acceptedMatches: number;
}

export interface DetailedConversionRates {
  inquiryToDemand: number;
  demandToRfq: number;
  rfqToResponse: number;
  responseToOffer: number;
  offerToMatch: number;
}

export interface BusinessConversion {
  inquiryStatus: InquiryStatusItem[];
  offerStatus: OfferStatusItem[];
  pipeline: ConversionPipeline;
  conversionRates: DetailedConversionRates;
}

export interface MatchStatusItem {
  status: string;
  label: string;
  count: number;
}

export interface ScoreDistributionItem {
  range: string;
  label: string;
  min: number;
  max: number;
  count: number;
}

export interface MatchingMetrics {
  totalMatches: number;
  averageScore: number;
  acceptRate: number;
  rejectRate: number;
}

export interface BusinessMatching {
  statusDistribution: MatchStatusItem[];
  scoreDistribution: ScoreDistributionItem[];
  metrics: MatchingMetrics;
}