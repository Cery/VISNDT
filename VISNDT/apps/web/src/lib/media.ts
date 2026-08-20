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
 * Dev-only deterministic placeholder image (inline SVG data URI).
 *
 * 610 contract: development needs a placeholder for product/card/banner images;
 * production keeps FileAsset + S3. Instead of a remote provider (which can be
 * network-blocked), we render a local SVG derived from the seed — no external
 * request, no broken-image errors, stable visuals.
 * Returns `null` outside development so callers fall back to empty-state UI.
 */
function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function placeholderImageUrl(seed = 'visndt'): string | null {
  if (process.env.NODE_ENV !== 'development') return null;
  const h = hashSeed(seed);
  const hue1 = h % 360;
  const hue2 = (hue1 + 40) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue1}, 32%, 38%)"/>
      <stop offset="1" stop-color="hsl(${hue2}, 30%, 22%)"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="640" cy="120" r="180" fill="rgba(255,255,255,0.06)"/>
  <circle cx="140" cy="480" r="120" fill="rgba(255,255,255,0.05)"/>
  <text x="400" y="320" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="40" fill="rgba(255,255,255,0.85)" font-weight="600">VISNDT</text>
  <text x="400" y="356" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="18" fill="rgba(255,255,255,0.55)">Industrial Inspection</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}