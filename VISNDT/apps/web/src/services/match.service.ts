/**
 * Match Service Layer
 */
import {
  getDemandMatches,
  getDemandMatchDetail as getDemandMatchDetailApi,
  rematchDemand as rematchDemandApi,
  updateMatchStatus as updateMatchStatusApi,
} from '@/lib/api/demands';
import { getDemands } from '@/services/demand.service';
import type { PaginatedResponse } from '@/types/api';

/** 参数级匹配得分（与后端 matchDetails.parameterScores 对齐） */
export interface MatchParameterScore {
  parameterDefinitionId: string;
  parameterName: string;
  parameterCode: string;
  dataType: string;
  demandValue: string | null;
  demandRange: { min: number; max: number } | null;
  productValue: string | null;
  productValueNumber: number | null;
  score: number;
  weight: number;
  required: boolean;
  type: 'exact' | 'range' | 'enum';
  unit: string | null;
}

/** 匹配解释因子（与后端 matchDetails.explanation.factors 对齐） */
export interface MatchDetailFactor {
  name: string;
  code: string;
  matched: boolean;
  weight: number;
  score: number;
  required: boolean;
  type: string;
}

/** 后端真实 matchDetails JSON 结构 */
export interface MatchDetails {
  algorithm?: string;
  explanation?: {
    score?: number;
    factors?: MatchDetailFactor[];
  };
  totalParameters?: number;
  matchedParameters?: number;
  matchRate?: number;
  hardFail?: boolean;
  failReason?: string | null;
  parameterScores?: MatchParameterScore[];
}

export interface MatchItem {
  id: string;
  demandId: string;
  demandTitle?: string;
  productId?: string | null;
  organizationId?: string | null;
  /** 后端标量字段（非 status/score） */
  matchStatus: string;
  matchScore?: number | null;
  matchDetails?: MatchDetails | null;
  createdAt: string;
  updatedAt: string;
}

/** 匹配能力（能力信息） */
export interface MatchCapabilityInfo {
  id: string;
  name: string;
  category?: { id: string; name: string; slug?: string } | null;
}

/** 单条匹配详情（detail API 返回，含完整 matchDetails 与关联实体） */
export interface MatchDetail {
  id: string;
  demandId: string;
  productId: string;
  matchScore: number;
  matchStatus: string;
  matchDetails?: MatchDetails | null;
  offerId?: string | null;
  matchedAt?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  product?: MatchCapabilityInfo | null;
  demand?: {
    id: string;
    title?: string;
    description?: string | null;
    parameters?: Array<{
      id: string;
      required: boolean;
      priority: number;
      value?: string | null;
      valueMin?: number | null;
      valueMax?: number | null;
      parameterDefinition?: {
        id: string;
        name: string;
        code: string;
        dataType: string;
        unit?: string | null;
      } | null;
    }>;
  } | null;
}

/**
 * Fetch a single match detail (full matchDetails + related entities).
 * GET /demands/:id/matches/:matchId
 */
export async function getMatchDetail(
  demandId: string,
  matchId: string,
): Promise<MatchDetail> {
  return getDemandMatchDetailApi(demandId, matchId) as Promise<MatchDetail>;
}

export async function getMatches(
  demandId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<MatchItem>> {
  return getDemandMatches(demandId, page, pageSize) as Promise<PaginatedResponse<MatchItem>>;
}

export async function updateMatchStatus(
  demandId: string,
  matchId: string,
  status: string,
) {
  return updateMatchStatusApi(demandId, matchId, status);
}

export async function rematchDemand(demandId: string) {
  return rematchDemandApi(demandId);
}

/**
 * Aggregate matches across all current user demands.
 * Fetches demands → fetches matches for each → flattens.
 */
export async function getAllMatches(): Promise<MatchItem[]> {
  const demandsRes = await getDemands(1, 50);
  const demands = demandsRes.data || [];

  const matchResults = await Promise.allSettled(
    demands.map((d) => getDemandMatches(d.id, 1, 50)),
  );

  const allMatches: MatchItem[] = [];
  matchResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const data = (result.value.data || []) as MatchItem[];
      data.forEach((m) => {
        allMatches.push({ ...m, demandTitle: demands[index].title });
      });
    }
  });

  return allMatches.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
