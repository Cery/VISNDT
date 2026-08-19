'use client';

import { useState, useCallback } from 'react';

/**
 * M24.1.4 — Facet Filter State Hook
 *
 * Manages filter state with isolation:
 *   Global: selectedCategoryTab
 *   Common: commonFilterValues (shared across all categories)
 *   Category Specific: categorySpecificFilterValues[categoryId]
 *
 * State isolation guarantees:
 *   1. Common filters persist across category tab switches
 *   2. Category-specific filters are isolated per category
 *   3. Switching back to a category restores its specific filters
 */

/** Selected filter values: parameterId → selected values set */
export type FilterValues = Record<string, Set<string>>;

export interface FacetFilterState {
  /** Currently selected category tab (undefined = 'all') */
  selectedCategoryTab: string | undefined;
  /** Common filter values (shared across all categories) */
  commonFilterValues: FilterValues;
  /** Category-specific filter values, keyed by categoryId */
  categorySpecificFilterValues: Record<string, FilterValues>;
}

/** Initial empty state */
function emptyState(): FacetFilterState {
  return {
    selectedCategoryTab: undefined,
    commonFilterValues: {},
    categorySpecificFilterValues: {},
  };
}

export function useFacetFilterState(initialState?: FacetFilterState) {
  const [state, setState] = useState<FacetFilterState>(initialState ?? emptyState);

  /** Get active filter values for the current tab */
  const getActiveFilters = useCallback((s: FacetFilterState): FilterValues => {
    if (!s.selectedCategoryTab) {
      return s.commonFilterValues;
    }
    // Category tab: common + category-specific
    const categoryFilters = s.categorySpecificFilterValues[s.selectedCategoryTab] ?? {};
    return { ...s.commonFilterValues, ...categoryFilters };
  }, []);

  /** Check if any filter is active */
  const hasActiveFilters = useCallback((s: FacetFilterState): boolean => {
    const hasCommon = Object.keys(s.commonFilterValues).length > 0;
    const hasSpecific = s.selectedCategoryTab
      ? Object.keys(s.categorySpecificFilterValues[s.selectedCategoryTab] ?? {}).length > 0
      : false;
    return hasCommon || hasSpecific;
  }, []);

  /** Select a category tab */
  const selectCategoryTab = useCallback((categoryId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      selectedCategoryTab: categoryId,
    }));
  }, []);

  /**
   * Toggle a parameter value filter.
   *
   * `isCommon` scopes the write target:
   *   - common parameter → commonFilterValues (persistent across categories)
   *   - category-specific parameter → categorySpecificFilterValues[selectedCategoryTab]
   */
  const toggleFilter = useCallback(
    (parameterId: string, value: string, isCommon: boolean = true) => {
      setState((prev) => {
        if (!isCommon) {
          // Category-specific filter — only valid within a category tab
          const categoryId = prev.selectedCategoryTab;
          if (!categoryId) return prev;

          const currentCategoryFilters = { ...(prev.categorySpecificFilterValues[categoryId] ?? {}) };
          const currentValues = new Set(currentCategoryFilters[parameterId] ?? []);

          if (currentValues.has(value)) {
            currentValues.delete(value);
          } else {
            currentValues.add(value);
          }

          if (currentValues.size === 0) {
            delete currentCategoryFilters[parameterId];
          } else {
            currentCategoryFilters[parameterId] = currentValues;
          }

          return {
            ...prev,
            categorySpecificFilterValues: {
              ...prev.categorySpecificFilterValues,
              [categoryId]: currentCategoryFilters,
            },
          };
        }

        // Common filter — shared across all categories
        const currentCommon = { ...prev.commonFilterValues };
        const currentValues = new Set(currentCommon[parameterId] ?? []);

        if (currentValues.has(value)) {
          currentValues.delete(value);
        } else {
          currentValues.add(value);
        }

        if (currentValues.size === 0) {
          delete currentCommon[parameterId];
        } else {
          currentCommon[parameterId] = currentValues;
        }

        return {
          ...prev,
          commonFilterValues: currentCommon,
        };
      });
    },
    [],
  );

  /** Clear all common filters */
  const clearCommonFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      commonFilterValues: {},
    }));
  }, []);

  /** Clear category-specific filters for current tab */
  const clearCategorySpecificFilters = useCallback(() => {
    setState((prev) => {
      if (!prev.selectedCategoryTab) return prev;
      const newCategorySpecific = { ...prev.categorySpecificFilterValues };
      delete newCategorySpecific[prev.selectedCategoryTab];
      return {
        ...prev,
        categorySpecificFilterValues: newCategorySpecific,
      };
    });
  }, []);

  /** Clear all filters */
  const clearAllFilters = useCallback(() => {
    setState((prev) => ({
      selectedCategoryTab: prev.selectedCategoryTab,
      commonFilterValues: {},
      categorySpecificFilterValues: {},
    }));
  }, []);

  /** Reset everything (e.g., on new query) */
  const resetAll = useCallback(() => {
    setState(emptyState());
  }, []);

  return {
    state,
    getActiveFilters,
    hasActiveFilters,
    selectCategoryTab,
    toggleFilter,
    clearCommonFilters,
    clearCategorySpecificFilters,
    clearAllFilters,
    resetAll,
  };
}