import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Content, ContentListParams } from '@/types/content';

/**
 * Public Content API wrapper.
 * Only consumes the public read endpoints (GET /content/public, /content/public/:slug),
 * which return PUBLISHED content only.
 */

/**
 * List published content.
 * GET /content/public
 */
export async function getPublicContents(
  params: ContentListParams = {},
): Promise<PaginatedResponse<Content>> {
  const queryParams: Record<string, string | number | undefined> = {
    page: params.page,
    pageSize: params.pageSize,
    type: params.type,
    keyword: params.keyword,
    tag: params.tag,
  };

  const res = await apiClient<ApiResponse<PaginatedResponse<Content>>>(
    '/content/public',
    { params: queryParams },
  );

  return res.data;
}

/**
 * Get a single published content by slug.
 * GET /content/public/:slug
 */
export async function getPublicContentBySlug(slug: string): Promise<Content> {
  const res = await apiClient<ApiResponse<Content>>(`/content/public/${slug}`);
  return res.data;
}