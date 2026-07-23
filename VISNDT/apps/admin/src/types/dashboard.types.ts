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