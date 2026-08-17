import { apiClient } from './client';
import type {
  DemandMatch,
  MatchListResponse,
  MatchDetail,
  UpdateMatchStatusParams,
  MatchingStats,
  KnowledgeContext,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const matchService = {
  async getDemandMatches(
    demandId: string,
    page = 1,
    pageSize = 20,
  ): Promise<MatchListResponse> {
    const response = (await apiClient.get(`/demands/${demandId}/matches`, {
      params: { page, pageSize },
    })) as unknown as ApiResponseWrapper<MatchListResponse>;

    return response.data;
  },

  async getMatchDetail(
    demandId: string,
    matchId: string,
  ): Promise<MatchDetail> {
    const response = (await apiClient.get(
      `/demands/${demandId}/matches/${matchId}`,
    )) as unknown as ApiResponseWrapper<MatchDetail>;

    return response.data;
  },

  async updateMatchStatus(
    demandId: string,
    matchId: string,
    params: UpdateMatchStatusParams,
  ): Promise<DemandMatch> {
    const response = (await apiClient.patch(
      `/demands/${demandId}/matches/${matchId}`,
      params,
    )) as unknown as ApiResponseWrapper<DemandMatch>;

    return response.data;
  },

  async review(
    demandId: string,
    matchId: string,
  ): Promise<DemandMatch> {
    const response = (await apiClient.patch(
      `/demands/${demandId}/matches/${matchId}`,
      { status: 'REVIEWED' },
    )) as unknown as ApiResponseWrapper<DemandMatch>;

    return response.data;
  },

  async rematch(demandId: string): Promise<{ message: string }> {
    const response = (await apiClient.post(
      `/demands/${demandId}/rematch`,
    )) as unknown as ApiResponseWrapper<{ message: string }>;

    return response.data;
  },

  async getMatchingStats(): Promise<MatchingStats> {
    const response = (await apiClient.get(
      '/admin/matching/stats',
    )) as unknown as ApiResponseWrapper<MatchingStats>;

    return response.data;
  },

  /**
   * Get Knowledge Context for a DemandMatch (M23.0).
   * GET /matches/:id/knowledge-context
   * Knowledge ≠ Score Input — read-side only.
   */
  async getKnowledgeContext(matchId: string): Promise<KnowledgeContext> {
    const response = (await apiClient.get(
      `/matches/${matchId}/knowledge-context`,
    )) as unknown as ApiResponseWrapper<KnowledgeContext>;

    return response.data;
  },
};