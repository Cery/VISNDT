'use client';

import type { ProductCategory } from '@/types/category';

interface ProductFilterProps {
  categories: ProductCategory[];
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export default function ProductFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
}: ProductFilterProps) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !selectedCategoryId
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCategoryId === cat.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Sort By</h3>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(':');
            onSortChange(field, order);
          }}
          className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="name:asc">Name (A-Z)</option>
          <option value="name:desc">Name (Z-A)</option>
          <option value="updatedAt:desc">Recently Updated</option>
        </select>
      </div>
    </div>
  );
}