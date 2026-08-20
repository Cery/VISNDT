'use client';

import { useState } from 'react';
import { fileAssetUrl, placeholderImageUrl } from '@/lib/media';

interface MediaImageProps {
  /** FileAsset backing the image (production: S3 Compatible Storage). */
  fileAssetId?: string | null;
  alt: string;
  /** Stable seed used to dertermine a deterministic dev placeholder image. */
  seed: string;
  className?: string;
}

/**
 * Product/media image with layered fallback:
 *   1. FileAsset download URL (production).
 *   2. Dev placeholder (`picsum.photos`) when no asset is present or load fails.
 *   3. Empty-state box (production, no asset).
 *
 * 610 contract: development uses placeholder provider; production keeps FileAsset + S3.
 */
export default function MediaImage({ fileAssetId, alt, seed, className = '' }: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  const src = !failed ? fileAssetUrl(fileAssetId) : null;
  const fallback = placeholderImageUrl(seed);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  if (fallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fallback} alt={alt} className={className} loading="lazy" />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-muted`}>
      <span className="text-muted-foreground text-sm">暂无图片</span>
    </div>
  );
}