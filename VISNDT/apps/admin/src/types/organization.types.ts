export type OrganizationStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
  members?: OrganizationMember[];
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
}