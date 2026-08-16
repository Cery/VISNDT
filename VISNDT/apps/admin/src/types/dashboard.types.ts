export interface DashboardUserStats {
  total: number;
  active: number;
}

export interface DashboardOrganizationStats {
  total: number;
}

export interface DashboardProductStats {
  total: number;
}

export interface DashboardContentStats {
  total: number;
}

export interface DashboardDemandStats {
  total: number;
  published: number;
}

export interface DashboardInquiryStats {
  total: number;
}

export interface DashboardRfqStats {
  total: number;
}

export interface DashboardOfferStats {
  total: number;
}

export interface DashboardMatchingStats {
  totalMatches: number;
}

export interface DashboardStats {
  users: DashboardUserStats;
  organizations: DashboardOrganizationStats;
  products: DashboardProductStats;
  content: DashboardContentStats;
  demands: DashboardDemandStats;
  inquiries: DashboardInquiryStats;
  rfqs: DashboardRfqStats;
  offers: DashboardOfferStats;
  matching: DashboardMatchingStats;
}

export interface DashboardTrendItem {
  date: string;
  pageViews: number;
  productViews: number;
  contentViews: number;
  searches: number;
  inquiries: number;
  ctaClicks: number;
}

export interface RecentUser {
  id: string;
  email: string;
  name?: string;
  status: string;
  createdAt: string;
}

export interface RecentDemand {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface RecentMatch {
  id: string;
  matchScore: number;
  matchStatus: string;
  createdAt: string;
}

export interface RecentNotification {
  id: string;
  type: string;
  title: string;
  createdAt: string;
}

export interface DashboardActivities {
  users: RecentUser[];
  demands: RecentDemand[];
  matches: RecentMatch[];
  notifications: RecentNotification[];
}

export interface DashboardPending {
  usersPending: number;
  demandsPending: number;
  inquiriesPending: number;
  rfqPending: number;
  unreadNotifications: number;
}

export interface DashboardStatus {
  database: string;
  api: string;
  lastUpdated: string;
  entityCounts: {
    users: number;
    organizations: number;
    products: number;
    demands: number;
    matches: number;
  };
}