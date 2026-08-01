'use client';

import { useState } from 'react';
import type { ProductMedia } from '@/types/product';

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

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No Image Available</span>
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex] ?? sortedImages[0];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <div className="text-muted-foreground text-sm">
          {currentImage.title || productName}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden transition-colors ${
                idx === selectedIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {idx + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}