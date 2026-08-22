export type RfqStatus = 'DRAFT' | 'OPEN' | 'RESPONDING' | 'CLOSED' | 'CANCELLED';

export interface Rfq {
  id: string;
  demandId: string;
  createdBy: string;
  status: RfqStatus;
  targetOrganizationId?: string | null;
  publishedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;

  demand?: {
    id: string;
    title: string;
    status?: string;
    organizationId?: string;
  };

  createdByUser?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RfqListResponse {
  data: Rfq[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateRfqParams {
  demandId: string;
}

export interface UpdateRfqParams {
  status?: RfqStatus;
}