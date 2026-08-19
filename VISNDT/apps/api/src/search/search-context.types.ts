/**
 * Search Context Type Definitions — M24.1.3
 *
 * Query-Level Search Context contract.
 * Independent of pagination, based on full matching candidate population.
 *
 * Architecture: ADR-M24-009/010
 *   Search Context ≠ Search Result Page
 *   All = Common Filter Intersection (not Union)
 *   Category-specific filters are independent per category
 */

// ─── Facet Value ───────────────────────────────────────────

/** A single available value for a parameter facet */
export interface FacetValue {
  /** The raw value string */
  value: string;
  /** Display label (from ParameterOption if available, otherwise value) */
  label: string;
  /** Number of candidate products with this value */
  count: number;
}

// ─── Parameter Facet ───────────────────────────────────────

/** Facet metadata for a single parameter definition */
export interface ParameterFacet {
  /** ParameterDefinition ID */
  parameterId: string;
  /** Human-readable name */
  parameterName: string;
  /** Unique code/key */
  parameterKey: string;
  /** Data type (STRING, NUMBER, BOOLEAN, etc.) */
  parameterType: string;
  /** Unit of measurement (if any) */
  unit: string | null;
  /** Display ordering */
  sortOrder: number;
  /** Available values from candidate products */
  availableValues: FacetValue[];
}

// ─── Relevant Category Context ─────────────────────────────

/** A product category relevant to the search query */
export interface RelevantCategoryContext {
  /** ProductCategory ID */
  id: string;
  /** Category name */
  name: string;
  /** Category slug */
  slug: string;
  /** Number of candidate products in this category */
  productCount: number;
}

// ─── Search Context Response ───────────────────────────────

/** Query-level search context response */
export interface SearchContextResponse {
  /** The search query */
  query: string;
  /** Total number of matching candidate products (full population) */
  candidateCount: number;
  /** Product categories relevant to the query */
  relevantCategories: RelevantCategoryContext[];
  /**
   * Common parameter facets — intersection across all relevant categories.
   * Only parameters that appear in ALL relevant categories are included here.
   */
  commonFilters: ParameterFacet[];
  /**
   * Category-specific parameter facets.
   * Keyed by ProductCategory ID.
   * Parameters unique to a specific category.
   */
  categorySpecificFilters: Record<string, ParameterFacet[]>;
}