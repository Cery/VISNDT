export interface DashboardSummary {
  totalPageViews: number;
  totalProductViews: number;
  totalContentViews: number;
  totalSearches: number;
  totalInquiries: number;
}

export interface TrendPoint {
  date: string;
  pageViews: number;
  productViews: number;
  contentViews: number;
  searches: number;
  inquiries: number;
  ctaClicks: number;
}

export interface TopEntity {
  id: string;
  name: string;
  views: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  trend: TrendPoint[];
  topProducts: TopEntity[];
  topContent: TopEntity[];
}

export interface StatisticsResponse {
  event: string;
  data: { label: string; value: number }[];
}

export interface EventListItem {
  id: string;
  event: string;
  entityType: string | null;
  entityId: string | null;
  source: string | null;
  createdAt: string;
}

export interface EventsListResponse {
  items: EventListItem[];
  total: number;
  page: number;
  pageSize: number;
}