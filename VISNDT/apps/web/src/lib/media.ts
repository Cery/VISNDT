import { API_BASE_URL } from './constants';

/**
 * Build the public download URL for a FileAsset-backed media item.
 * GET /files/:id/download redirects to a signed URL (production: S3 Compatible Storage).
 */
export function fileAssetUrl(fileAssetId?: string | null): string | null {
  if (!fileAssetId) return null;
  return `${API_BASE_URL}/files/${fileAssetId}/download`;
}

/**
 * Dev-only placeholder image provider (picsum.photos).
 *
 * 610 contract: development may use `https://picsum.photos/` as a placeholder
 * provider for product/card/banner images; production keeps FileAsset + S3.
 * Returns `null` outside development so callers fall back to empty-state UI.
 */
export function placeholderImageUrl(seed = 'visndt'): string | null {
  if (process.env.NODE_ENV !== 'development') return null;
  const safeSeed = seed ? encodeURIComponent(seed) : 'visndt';
  return `https://picsum.photos/seed/${safeSeed}/800/600`;
}