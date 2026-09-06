'use client';

import { useMemo, useState } from 'react';
import type { ProductCategory } from '@/types/category';
import type { ProductParameterFilter } from '@/types/product';
import type { FilterParameterDefinition } from '@/services/parameter-definition.service';
import { translateCategoryName } from '@/lib/translate';
import ParameterFilterPanel from './ParameterFilterPanel';

interface ProductFilterProps {
  categories: ProductCategory[];
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  parameterDefinitions: FilterParameterDefinition[];
  parameterFilters: ProductParameterFilter[];
  onParameterFilterChange: (filters: ProductParameterFilter[]) => void;
  /** 是否有任何激活的筛选条件 */
  hasActiveFilters?: boolean;
  /** 清除所有筛选条件 */
  onClearAll?: () => void;
}

/**
 * 从扁平分类列表构建树形结构（按 parentId 重建 children，支持任意深度）。
 * 后端 GET /product-categories 返回分页扁平列表，此处按 parentId 归组，
 * parentId 为 null（或父节点不在当前列表）的节点视为根节点。
 */
function buildCategoryTree(categories: ProductCategory[]): ProductCategory[] {
  const map = new Map<string, ProductCategory>();
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  const roots: ProductCategory[] = [];
  for (const node of map.values()) {
    const parent = node.parentId ? map.get(node.parentId) : undefined;
    if (parent) {
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** 收集指定分类的全部祖先分类 id（用于选中时自动展开路径） */
function collectAncestorIds(categories: ProductCategory[], targetId: string): string[] {
  const map = new Map(categories.map((cat) => [cat.id, cat]));
  const ancestors: string[] = [];
  let current = map.get(targetId);
  while (current?.parentId) {
    const parent = map.get(current.parentId);
    if (!parent) break;
    ancestors.push(parent.id);
    current = parent;
  }
  return ancestors;
}

export default function ProductFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
  parameterDefinitions,
  parameterFilters,
  onParameterFilterChange,
  hasActiveFilters,
  onClearAll,
}: ProductFilterProps) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  // 默认展开一级分类（根节点）；更深的节点默认收起
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(tree.map((c) => c.id)),
  );

  // 选中分类时自动展开其祖先路径（含 URL 刷新恢复场景）
  const ancestorIds = useMemo(
    () => (selectedCategoryId ? collectAncestorIds(categories, selectedCategoryId) : []),
    [categories, selectedCategoryId],
  );

  const effectiveExpanded = useMemo(() => {
    const set = new Set(expandedIds);
    for (const id of ancestorIds) set.add(id);
    return set;
  }, [expandedIds, ancestorIds]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectCategory = (id: string) => {
    onCategoryChange(id);
    // 选中后展开该节点及其祖先路径，便于继续下钻
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const ancestor of collectAncestorIds(categories, id)) {
        next.add(ancestor);
      }
      next.add(id);
      return next;
    });
  };

  const renderNode = (cat: ProductCategory, depth: number) => {
    const children = cat.children ?? [];
    const hasChildren = children.length > 0;
    const isSelected = selectedCategoryId === cat.id;
    const isExpanded = effectiveExpanded.has(cat.id);

    return (
      <div key={cat.id}>
        <div
          className="flex items-center rounded-lg"
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(cat.id)}
              aria-label={`${isExpanded ? '收起' : '展开'} ${translateCategoryName(cat.name)}`}
              aria-expanded={isExpanded}
              className="flex-shrink-0 w-4 h-4 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              >
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <span className="flex-shrink-0 w-4" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={() => selectCategory(cat.id)}
            className={`flex-1 text-left px-2 py-1.5 text-sm rounded-lg transition-colors ${
              isSelected
                ? 'bg-primary/5 text-primary border-l-2 border-primary font-medium'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {translateCategoryName(cat.name)}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Filters Header */}
      {hasActiveFilters && onClearAll && (
        <div className="flex items-center justify-between pb-3 border-b">
          <span className="text-xs font-medium text-foreground">已筛选</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-primary hover:underline"
          >
            清除全部筛选
          </button>
        </div>
      )}
      {/* Category Tree Filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">分类</h3>
        <div className="space-y-1">
          {/* Root Node：全部能力 */}
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !selectedCategoryId
                ? 'bg-primary/5 text-primary border-l-2 border-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            全部能力
          </button>
          {tree.map((cat) => renderNode(cat, 0))}
        </div>
      </div>

      {/* Dynamic Parameter Filter */}
      <ParameterFilterPanel
        definitions={parameterDefinitions}
        filters={parameterFilters}
        onChange={onParameterFilterChange}
      />

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold text-sm mb-3">排序方式</h3>
        <select
          aria-label="排序方式"
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