import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';

// ============================================
// Unified Search API Types — M22.4.1
// ============================================

/** Product discovery item from backend */
export interface ProductDiscoveryItem {
  id: string;
  name: string;
  model: string | null;
  slug: string | null;
  description: string | null;
  category: { id: string; name: string; slug: string } | null;
}

/** Knowledge entry discovery item from backend */
export interface KnowledgeDiscoveryItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  domain: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  publishedAt: string | null;
}

/** Content discovery item from backend */
export interface ContentDiscoveryItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: string | null;
  estimatedReadTime: number | null;
  coverImage: { id: string; fileName: string; mimeType: string } | null;
  author: { id: string; name: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string; type: string } }>;
}

/** Supplier discovery item from backend */
export interface SupplierDiscoveryItem {
  organizationId: string;
  organizationName: string;
  offerCount: number;
  offerTitles: string[];
  productNames: string[];
}

/** Per-entity search group */
export interface EntitySearchGroup<T> {
  items: T[];
  total: number;
}

/** Unified discovery response from backend */
export interface UnifiedDiscoveryResponse {
  query: string;
  products: EntitySearchGroup<ProductDiscoveryItem>;
  knowledge: EntitySearchGroup<KnowledgeDiscoveryItem>;
  content: EntitySearchGroup<ContentDiscoveryItem>;
  solutions: EntitySearchGroup<ContentDiscoveryItem>;
  suppliers: EntitySearchGroup<SupplierDiscoveryItem>;
}

// ============================================
// API Client
// ============================================

/**
 * Execute unified search via GET /search.
 * Single endpoint replaces client-side fan-out across 4 separate APIs.
 */
export async function searchUnified(params: {
  q: string;
  page?: number;
  pageSize?: number;
}): Promise<UnifiedDiscoveryResponse> {
  const queryParams: Record<string, string | number | undefined> = {
    q: params.q,
    page: params.page,
    pageSize: params.pageSize,
  };

  const res = await apiClient<ApiResponse<UnifiedDiscoveryResponse>>('/search', {
    params: queryParams,
  });

  return res.data;
}