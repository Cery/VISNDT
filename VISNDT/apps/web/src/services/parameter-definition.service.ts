/**
 * Parameter Definition Service Layer
 *
 * Encapsulates parameter-definition API calls for page-level consumption.
 * The filter panel needs ENUM options, which are only returned by the detail
 * endpoint, so this service merges options into a filter-ready definition list
 * (frontend-only; backend contract unchanged).
 */
import {
  getParameterDefinitions as fetchDefinitions,
  getParameterDefinition as fetchDefinition,
  getCategoryParameters as fetchCategoryParameters,
} from '@/lib/api/parameter-definitions';
import type { ParameterDefinition, ParameterOption } from '@/types/product';

/** Filter-ready parameter definition (includes ENUM options) */
export interface FilterParameterDefinition extends ParameterDefinition {
  options?: ParameterOption[];
}

/**
 * Load all parameter definitions with ENUM options merged, for the dynamic
 * parameter filter panel. Frontend consumes existing backend capabilities.
 */
export async function getFilterParameterDefinitions(): Promise<FilterParameterDefinition[]> {
  const res = await fetchDefinitions(1, 100);
  const defs = res.data ?? [];

  // ENUM options are only present on the detail endpoint; fetch them in parallel.
  const enumIds = defs.filter((d) => d.dataType === 'ENUM').map((d) => d.id);
  const details = await Promise.all(
    enumIds.map((id) => fetchDefinition(id).catch(() => null)),
  );

  const optionsMap = new Map<string, ParameterOption[]>();
  for (const d of details) {
    if (d) optionsMap.set(d.id, d.options ?? []);
  }

  return defs.map((d) => ({ ...d, options: optionsMap.get(d.id) ?? [] }));
}

/**
 * Load the parameters actually used by ACTIVE products in a specific category,
 * for the category-context parameter filter panel. The category endpoint already
 * returns ENUM options inline (with sortOrder applied), so no extra detail calls
 * are needed.
 */
export async function getCategoryFilterParameterDefinitions(
  categoryId: string,
): Promise<FilterParameterDefinition[]> {
  const defs = await fetchCategoryParameters(categoryId);
  return defs.map((d) => ({ ...d, options: d.options ?? [] }));
}