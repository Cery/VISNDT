import { apiClient } from './client';
import type {
  BusinessFunnel,
  BusinessLifecycle,
  BusinessConversion,
  BusinessMatching,
} from '../types/business-analytics.types';

interface BusinessFunnelResponse {
  success: boolean;
  data: BusinessFunnel;
  message: string;
  timestamp: string;
}

interface BusinessLifecycleResponse {
  success: boolean;
  data: BusinessLifecycle;
  message: string;
  timestamp: string;
}

interface BusinessConversionResponse {
  success: boolean;
  data: BusinessConversion;
  message: string;
  timestamp: string;
}

interface BusinessMatchingResponse {
  success: boolean;
  data: BusinessMatching;
  message: string;
  timestamp: string;
}

export const businessAnalyticsService = {
  async getFunnel(): Promise<BusinessFunnel> {
    const response = (await apiClient.get(
      '/admin/analytics/business/funnel',
    )) as unknown as BusinessFunnelResponse;
    return response.data;
  },

  async getLifecycle(): Promise<BusinessLifecycle> {
    const response = (await apiClient.get(
      '/admin/analytics/business/lifecycle',
    )) as unknown as BusinessLifecycleResponse;
    return response.data;
  },

  async getConversion(): Promise<BusinessConversion> {
    const response = (await apiClient.get(
      '/admin/analytics/business/conversion',
    )) as unknown as BusinessConversionResponse;
    return response.data;
  },

  async getMatching(): Promise<BusinessMatching> {
    const response = (await apiClient.get(
      '/admin/analytics/business/matching',
    )) as unknown as BusinessMatchingResponse;
    return response.data;
  },
};