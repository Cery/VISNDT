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

export interface DashboardDemandStats {
  total: number;
  published: number;
}

export interface DashboardMatchingStats {
  totalMatches: number;
}

export interface DashboardStats {
  users: DashboardUserStats;
  organizations: DashboardOrganizationStats;
  products: DashboardProductStats;
  demands: DashboardDemandStats;
  matching: DashboardMatchingStats;
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