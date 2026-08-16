import { apiClient } from './client';
import type { AuditIntelligenceOverview } from '../types/audit-intelligence.types';

interface AuditIntelligenceResponse {
  success: boolean;
  data: AuditIntelligenceOverview;
  message: string;
  timestamp: string;
}

export const auditIntelligenceService = {
  async getOverview(days: number = 7): Promise<AuditIntelligenceOverview> {
    const response = (await apiClient.get(
      `/admin/audit-intelligence/overview?days=${days}`,
    )) as unknown as AuditIntelligenceResponse;
    return response.data;
  },
};