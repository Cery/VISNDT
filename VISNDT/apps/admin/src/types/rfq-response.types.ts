export type RfqResponseStatus = 'SUBMITTED' | 'VIEWED' | 'ACCEPTED' | 'REJECTED';

export interface RfqResponse {
  id: string;
  rfqId: string;
  organizationId: string;
  offerId?: string;
  message?: string;
  status: RfqResponseStatus;
  createdAt: string;
  updatedAt: string;

  rfq?: {
    id: string;
    status: string;
    demandId: string;
  };

  organization?: {
    id: string;
    name: string;
  };

  offer?: {
    id: string;
    product?: {
      id: string;
      name: string;
    };
  };
}

export interface RfqResponseListResponse {
  data: RfqResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}