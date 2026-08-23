import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * Supplier Model Discovery — M28.0 M661.5 Unified Discovery Consolidation.
 *
 * The standalone /supplier-models search entry has been consolidated into the
 * unified /search model. This route is retained ONLY as a backwards-compatible
 * redirect into /search?type=supplier-product (the single primary search entry).
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
  redirect('/search?type=supplier-product');
}
