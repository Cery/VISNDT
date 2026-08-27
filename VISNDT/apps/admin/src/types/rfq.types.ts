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
    organization?: {
      id: string;
      name?: string | null;
    };
    /** Demand technical parameters (M30.4 / M30.5 RFQ context). */
    parameters?: Array<{
      id: string;
      value?: string | null;
      valueNumber?: number | null;
      valueMin?: number | null;
      valueMax?: number | null;
      parameterDefinition?: {
        name: string;
        required?: boolean;
        unit?: string | null;
        dataType?: string;
        options?: Array<{ value: string; label: string }>;
      };
    }>;
  };

  /** Target Capability Provider (RH5). */
  targetOrganization?: {
    id: string;
    name?: string | null;
    type?: string | null;
    status?: string | null;
  } | null;

  /** Source deterministic Match that produced this RFQ (M30.5 context). */
  sourceMatch?: {
    id: string;
    matchScore?: number | null;
    matchStatus?: string | null;
    matchedAt?: string | null;
    product?: { id: string; name?: string | null } | null;
  } | null;

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