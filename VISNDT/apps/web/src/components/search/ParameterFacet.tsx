'use client';

import { useState, useMemo } from 'react';
import type { SearchContextResponse, ParameterFacet as ParameterFacetType } from '@/lib/api/search';
import type { FacetFilterState } from '@/hooks/useFacetFilterState';

// ============================================
// ParameterFacet — M24.1.4
//
// Relevant Parameter Facet UI based on 591 Search Context API.
//
// Multi-category contract:
//   All = Common Filter Intersection
//   Category tab = Common + Category-Specific
//
// Architecture: ADR-M24-009/010
// ============================================

interface ParameterFacetProps {
  context: SearchContextResponse | null;
  loading: boolean;
  filterState: FacetFilterState;
  onSelectCategoryTab: (categoryId: string | undefined) => void;
  onToggleFilter: (parameterId: string, value: string, isCommon: boolean) => void;
  onClearCategorySpecific: () => void;
  onClearAll: () => void;
}

export default function ParameterFacet({
  context,
  loading,
  filterState,
  onSelectCategoryTab,
  onToggleFilter,
  onClearCategorySpecific,
  onClearAll,
}: ParameterFacetProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const { selectedCategoryTab, commonFilterValues, categorySpecificFilterValues } = filterState;

  // Determine active filters
  const hasAnyFilters = useMemo(() => {
    const hasCommon = Object.keys(commonFilterValues).length > 0;
    const hasSpecific = selectedCategoryTab
      ? Object.keys(categorySpecificFilterValues[selectedCategoryTab] ?? {}).length > 0
      : false;
    return hasCommon || hasSpecific;
  }, [commonFilterValues, categorySpecificFilterValues, selectedCategoryTab]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = Object.keys(commonFilterValues).length;
    if (selectedCategoryTab) {
      count += Object.keys(categorySpecificFilterValues[selectedCategoryTab] ?? {}).length;
    }
    return count;
  }, [commonFilterValues, categorySpecificFilterValues, selectedCategoryTab]);

  // Get parameters for current tab
  const currentParams = useMemo((): ParameterFacetType[] => {
    if (!context) return [];
    if (!selectedCategoryTab) {
      return context.commonFilters;
    }
    const categorySpecific = context.categorySpecificFilters[selectedCategoryTab] ?? [];
    return [...context.commonFilters, ...categorySpecific];
  }, [context, selectedCategoryTab]);

  // Check if a specific parameter is in common or category-specific
  const isCommonParam = (paramId: string): boolean => {
    return context?.commonFilters.some((p) => p.parameterId === paramId) ?? false;
  };

  // Check if a value is selected
  const isValueSelected = (paramId: string, value: string): boolean => {
    if (isCommonParam(paramId)) {
      return commonFilterValues[paramId]?.has(value) ?? false;
    }
    if (selectedCategoryTab) {
      return categorySpecificFilterValues[selectedCategoryTab]?.[paramId]?.has(value) ?? false;
    }
    return false;
  };

  // No context
  if (!context && !loading) return null;

  const hasCategories = context && context.relevantCategories.length > 1;

  const filterContent = (
    <>
      {/* Category Tabs */}
      {context && context.relevantCategories.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {hasCategories && (
              <button
                type="button"
                onClick={() => onSelectCategoryTab(undefined)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  !selectedCategoryTab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                全部
              </button>
            )}
            {context.relevantCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategoryTab(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategoryTab === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat.name}
                <span className="ml-1 opacity-70">({cat.productCount})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3.5 w-16 bg-slate-200 rounded mb-2" />
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-6 w-16 bg-slate-100 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Parameter Facets */}
      {!loading && currentParams.length > 0 && (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {currentParams.map((param) => (
            <ParameterFacetGroup
              key={param.parameterId}
              param={param}
              isCommon={isCommonParam(param.parameterId)}
              onToggle={(value) => onToggleFilter(param.parameterId, value, isCommonParam(param.parameterId))}
              isValueSelected={(value) => isValueSelected(param.parameterId, value)}
            />
          ))}
        </div>
      )}

      {/* No params for current tab */}
      {!loading && currentParams.length === 0 && context && (
        <p className="text-xs text-slate-400 py-2">当前分类无可用筛选参数</p>
      )}

      {/* Clear / Actions */}
      {hasAnyFilters && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            清除全部 ({activeFilterCount})
          </button>
          {selectedCategoryTab && (
            <button
              type="button"
              onClick={onClearCategorySpecific}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              清除分类筛选
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: sidebar-like filter panel */}
      <div className="hidden lg:block">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">筛选参数</h3>
          {filterContent}
        </div>
      </div>

      {/* Mobile: collapsible filter button + panel */}
      <div className="lg:hidden">
        {!mobileExpanded && (
          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border transition-colors ${
              hasAnyFilters
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-slate-200 text-slate-500'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            筛选参数{hasAnyFilters ? ` (${activeFilterCount})` : ''}
          </button>
        )}

        {mobileExpanded && (
          <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">筛选参数</span>
              <button
                type="button"
                onClick={() => setMobileExpanded(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterContent}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMobileExpanded(false)}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// ParameterFacetGroup — single parameter group
// ============================================

interface ParameterFacetGroupProps {
  param: ParameterFacetType;
  isCommon: boolean;
  onToggle: (value: string) => void;
  isValueSelected: (value: string) => boolean;
}

function ParameterFacetGroup({
  param,
  isCommon,
  onToggle,
  isValueSelected,
}: ParameterFacetGroupProps) {
  const { parameterName, unit, availableValues } = param;

  // No values to show
  if (availableValues.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs font-medium text-slate-600">{parameterName}</span>
        {unit && <span className="text-[10px] text-slate-400">({unit})</span>}
        {!isCommon && (
          <span className="text-[10px] px-1 py-0.5 bg-amber-50 text-amber-600 rounded">
            分类专属
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {availableValues.map((fv) => {
          const selected = isValueSelected(fv.value);
          return (
            <button
              key={fv.value}
              type="button"
              onClick={() => onToggle(fv.value)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                selected
                  ? 'bg-primary text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {fv.label}
              <span className={`ml-1 ${selected ? 'opacity-80' : 'text-slate-400'}`}>
                ({fv.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}