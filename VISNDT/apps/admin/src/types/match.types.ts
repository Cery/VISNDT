export type MatchStatus = 'PENDING' | 'MATCHED' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface DemandMatch {
  id: string;
  demandId: string;
  productId: string;
  matchScore: number;
  matchStatus: MatchStatus;
  matchDetails?: Record<string, unknown>;
  offerId?: string;
  matchedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;

  product?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };

  offer?: {
    id: string;
    productId?: string;
    organizationId?: string;
    price?: number;
    status?: string;
  };

  demand?: {
    id: string;
    title: string;
    parameters?: Array<{
      id: string;
      parameterDefinition?: {
        id: string;
        name: string;
        code: string;
        unit?: string;
      };
      value?: string;
      valueMin?: number;
      valueMax?: number;
    }>;
  };
}

export interface MatchListResponse {
  data: DemandMatch[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MatchDetail extends DemandMatch {
  demand: NonNullable<DemandMatch['demand']>;
}

export interface UpdateMatchStatusParams {
  status: 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
}

export interface MatchingStats {
  totalMatches: number;
  averageScore: number;
  hardFailCount: number;
  rematchCount: number;
}

// ===== Knowledge Context (M23.0) =====

export interface KnowledgeEntryRef {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
}

export interface KnowledgeDomainRef {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeContext {
  domain: KnowledgeDomainRef | null;
  category: KnowledgeCategoryRef | null;
  relevantEntries: KnowledgeEntryRef[];
  prerequisiteKnowledge: KnowledgeEntryRef[];
  relatedKnowledge: KnowledgeEntryRef[];
  followupKnowledge: KnowledgeEntryRef[];
}