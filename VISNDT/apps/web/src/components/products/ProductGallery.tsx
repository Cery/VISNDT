'use client';

import { useState } from 'react';
import type { ProductMedia } from '@/types/product';
import MediaImage from '@/components/common/MediaImage';

interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = media.filter((m) => m.mediaType === 'IMAGE');

  // Sort: primary first, then by displayOrder
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  // No image asset: render stable-ratio neutral fallback (846 §28: large, stable ratio).
  if (sortedImages.length === 0) {
    return (
      <MediaImage
        fileAssetId={null}
        alt={productName}
        seed={productName}
        className="aspect-[4/3] w-full object-contain rounded-lg border border-slate-200/80 bg-white"
      />
    );
  }

  const currentImage = sortedImages[selectedIndex] ?? sortedImages[0];

  return (
    <div className="space-y-3">
      {/* Main Image — 846 §28: aspect-ratio ≈ 4:3, object contain */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200/80 bg-white">
        <MediaImage
          fileAssetId={currentImage.fileAssetId}
          alt={currentImage.title || productName}
          seed={currentImage.id}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden transition-colors ${
                idx === selectedIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
              aria-label={`查看图片 ${idx + 1}`}
            >
              <MediaImage
                fileAssetId={img.fileAssetId}
                alt={img.title || `${productName} ${idx + 1}`}
                seed={img.id}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}