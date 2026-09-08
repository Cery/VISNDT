import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * Supplier Model Discovery — M28.0 M661.5 Unified Discovery Consolidation.
 *
 * The standalone /supplier-models search entry has been consolidated into the
 * unified /search model. This route is retained ONLY as a backwards-compatible
 * redirect into /search (the single primary search entry).
 *
 * 835 §5 Nav Dead Point Repair: 移除 `?type=supplier-product`——统一检索 VALID_TYPES
 * 仅为 all/product/knowledge/solution，该 type 会被静默忽略而回落到通用检索，
 * 承诺（供应商型号）与落地（通用检索）不符。现重指向统一检索权威 /search，
 * 使 promise = landing。未改搜索算法 / Search Contract，未新增 supplier-product 类型。
 *
 * Decision (M661.5 §3.2):
 *   - /supplier-models = NOT a primary search entry.
 *   - It is NOT a separate search system — it shares the same unified search
 *     contract (/search + /search/context + /search/supplier-models facets).
 *   - No SEO / navigation / search fragmentation: deep links resolve to the
 *     supplier-product tab of the unified search page.
 */
export const metadata: Metadata = {
  title: '供应商型号搜索',
  robots: { index: false, follow: true },
};

export default function SupplierModelsRedirectPage() {
  redirect('/search');
}
