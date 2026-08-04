'use client';

import type { ProductCategory } from '@/types/category';
import { translateCategoryName } from '@/lib/translate';

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
        <h3 className="font-semibold text-sm mb-3">分类</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !selectedCategoryId
                ? 'bg-primary/5 text-primary border-l-2 border-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            全部分类
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategoryId === cat.id
                  ? 'bg-primary/5 text-primary border-l-2 border-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {translateCategoryName(cat.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold text-sm mb-3">排序方式</h3>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(':');
            onSortChange(field, order);
          }}
          className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="createdAt:desc">最新优先</option>
          <option value="createdAt:asc">最早优先</option>
          <option value="name:asc">名称 (A-Z)</option>
          <option value="name:desc">名称 (Z-A)</option>
          <option value="updatedAt:desc">最近更新</option>
        </select>
      </div>
    </div>
  );
}