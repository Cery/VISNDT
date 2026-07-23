export type DemandStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'CLOSED'
  | 'CANCELLED';

export interface DemandParameter {
  id: string;
  demandId: string;
  parameterDefinitionId: string;
  value?: string;
  valueMin?: number;
  valueMax?: number;
  required: boolean;
  priority: number;
  parameterDefinition: {
    id: string;
    name: string;
    code: string;
    dataType: string;
    unit?: string;
  };
}

export interface Demand {
  id: string;
  title: string;
  description?: string;
  status: DemandStatus;
  budgetRange?: string;
  quantity?: number;
  quantityUnit?: string;
  expectedDeliveryDate?: string;
  categoryId?: string;
  publishedAt?: string;
  closedAt?: string;
  closeReason?: string;
  createdAt: string;
  updatedAt: string;

  organization?: {
    id: string;
    name: string;
  };

  category?: {
    id: string;
    name: string;
    slug?: string;
  };

  parameters?: DemandParameter[];
}

export interface DemandListResponse {
  data: Demand[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchDemandParams {
  keyword?: string;
  status?: DemandStatus;
  sort?: 'latest' | 'updated' | 'published';
  page?: number;
  pageSize?: number;
}