export type OrganizationStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export interface OrganizationFormData {
  name: string;
  type: string;
  status?: OrganizationStatus;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  status: OrganizationStatus;
  /** 819 Permission Foundation — Admin-controlled opt-in for SupplierProduct self-service. */
  supplierProductManagementEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  members?: OrganizationMember[];
  _count?: { members: number };
}

export interface OrganizationListResponse {
  data: Organization[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchOrganizationParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}