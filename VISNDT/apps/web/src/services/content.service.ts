/**
 * Content Service Layer
 *
 * Encapsulates public Content API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/content.ts.
 */
import {
  getPublicContents as fetchPublicContents,
  getPublicContentBySlug as fetchPublicContentBySlug,
} from '@/lib/api/content';
import type { PaginatedResponse } from '@/types/api';
import type { Content, ContentListParams } from '@/types/content';

/**
 * List published content by type (KNOWLEDGE / SOLUTION).
 * GET /content/public
 */
export async function getContentList(
  params: ContentListParams = {},
): Promise<PaginatedResponse<Content>> {
  return fetchPublicContents(params);
}

/**
 * Get a single published content by slug.
 * GET /content/public/:slug
 */
export async function getContentBySlug(slug: string): Promise<Content> {
  return fetchPublicContentBySlug(slug);
}