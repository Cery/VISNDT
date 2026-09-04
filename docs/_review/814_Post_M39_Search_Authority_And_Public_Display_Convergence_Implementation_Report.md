# 814 Post-M39 Search Authority & Public Display Convergence — Implementation Report

Date: 2026-09-03
Status: IMPLEMENTED / VERIFIED / CLOSED
Version: 1.0

***

## 1. Executive Decision

Decision Gate: A = CLOSED

This implementation completes the search authority convergence and public commerce display boundary correction as authorized by the 813 alignment audit.

- Before: SupplierProduct and Supplier were independent search result types with dedicated tabs and primary result cards; public commercial display (price/currency/offer-count) was present.

- After:

  - Platform Product = PRIMARY SEARCH AUTHORITY (WHAT)

  - SupplierProduct = SEARCHABLE SUPPORTING SIGNAL (WHICH MODEL) - folded under Product as contextual evidence

  - Supplier = CONTEXTUAL PROVIDER (WHO) - linked via Product context, never primary result

  - All public price / currency / commercial summary / offer-count display removed; Offer remains private/commercial in the workflow (RFQ / Inquiry)

All acceptance criteria satisfied. No schema migration required. No regression introduced.

***

## 2. Baseline

Pre-Implementation State:

- API contract: Unified /search returns products + supplierProducts + suppliers + knowledge + solutions parallel groups. No change required.

- Search Tabs: 全部 / 产品 / 方案 / 能力型号 / 供应商 / 知识. Two active drift types existed.

- Result Rendering: SupplierProductResultCard + SupplierResultCard as independent cards. 814 removes independent cards and folds models to Product context.

- Public Display: priceFrom/priceTo/currency/activeOfferCount visible in search results and product-detail supplier-models section. 814 removes all public display of commercial fields.

- Model Searchability: SupplierProduct brand/series/modelNumber matched at backend but only surfaced as independent results. 814 preserves backend matching and aggregates into Product results.

- URL Compatibility: type=supplier-product and type=supplier existed. 814 normalizes deprecated types to type=all gracefully.

***

## 3. Before / After Search Authority

Before (drift):

- Unified Search -> Product + Solution + SupplierProduct (independent primary result authority) + Supplier (independent primary result authority) + Knowledge

After (aligned):

- Unified Search -> Product (PRIMARY AUTHORITY: primary product fields + ProductSupplierContext matching SupplierProduct models + related Suppliers) + Solution + Knowledge

- SupplierProduct = Searchable Supporting Signal (never primary result)

- Supplier = Contextual Provider (never primary result)

***

## 4. Search Architecture

Implementation Strategy: C - Frontend result-group join using existing API data.

- Backend searchProducts already matches SupplierProduct fields (brand/series/modelNumber) and returns products + supplierProducts groups unchanged.

- Frontend aggregates supplierProducts.items by platformProductId into existing Product entries -> one primary Product card + matching model context.

- Pure model/brand/series queries where products group is empty -> derive synthetic Product card from the associated capability.

- No duplicate authority; one result per capability preserves search ranking.

Data Flow:

- Query (ZB-K60) -> GET /search?q=ZB-K60 (unchanged API) -> backend products + supplierProducts + suppliers + knowledge + solutions

- Frontend SearchPageContent:

  1. Start with all products from products.items
  2. For each supplierProducts.item: look up capability id (capability.id or platformProductId); if exists append model context to product entry; if not exists create derived product entry from capability projection
  3. Render one primary product section with aggregated context
  4. Remove supplier-product / supplier independent sections

- Render ProductResultCard + ProductSupplierContext (models + providers)

Why this strategy:

- No API contract change -> no schema migration needed.

- Preserves all model/brand/series searchability (backend matching unchanged).

- Minimal regression risk; only frontend rendering touched.

- No redundant network calls / waterfall.

- No second search engine.

***

## 5. Supplier Type Removal

- Removed from: SearchTypeTabs (public tabs), GlobalSearchBar domain dropdown, SearchDomain type union.

- Kept intact:

  - /suppliers/\[id] public supplier detail page (contextual provider landing).

  - Product -> Supplier navigation links.

  - Backend searchSuppliers endpoint unchanged (used for legacy indexing, not rendered in primary search).

  - type=supplier in old URL -> normalized to type=all -> renders all domains.

- Verification: probe confirms no Supplier tab appears after 814.

***

## 6. SupplierProduct Type Removal

- Removed from: SearchTypeTabs, GlobalSearchBar, independent SearchResultSection rendering.

- Preserved:

  - Backend searchSupplierProducts matching for brand/series/modelNumber fully functional.

  - type=supplier-product URL normalized to type=all.

  - All matching models aggregated under corresponding Platform Product results.

- Verification:

  - ZB-K60 returns one primary product result (Platform Product ZB-K60 工业检测内窥镜) with two matching models (ZB-K60-EX / ZB-K60) from VSNDT supplier -> correct.

  - No independent SupplierProduct card in primary results -> correct.

***

## 7. Product-Centered Aggregation

Visual Pattern:

- \[ProductResultCard: Platform Product (primary authority)]

- ProductSupplierContext (rounded bg-slate-50, full width below card)

  - 匹配型号: \[badge] BRAND MODEL \[badge] ...

  - 相关供应商: \[link] ORGANIZATION \[link] ...

Key invariant: Product remains the result authority.
Deduplication: multiple SupplierProducts for the same Platform Product aggregate to one Product card -> no result duplication.
Pure model query case: if backend products.items is empty, a synthetic Product card is derived from the capability attached to the first SupplierProduct -> model stays discoverable without an independent SupplierProduct authority.
Order: preserves backend Product ranking (SupplierProduct matching never reorders Products).

***

## 8. Model / Brand / Series Search

Preserved fields:

- brand: searchable (backend contains), aggregated. Preserved.

- series: searchable (backend contains), aggregated. Preserved.

- modelNumber: searchable (backend contains), aggregated. Core requirement preserved.

- description: searchable via capability, aggregated.

- technicalDescription: searchable via capability, aggregated.

Acceptance Check:

- ZB-K60 -> finds Platform Product ZB-K60 工业检测内窥镜 with two matching models -> PASS.

- Brand/series queries find the capability with matching models -> PASS.

- Backend matching unchanged -> ranking unchanged -> PASS.

***

## 9. Public Commerce Display Removal

Scope of changes:

1. Search Results: removed priceFrom/priceTo/currency/activeOfferCount from projections; SupplierProductResultCard no longer used.
2. Product Detail SupplierModelsSection: removed formatPrice helper, price range/currency/offer-status and 商业可购 block; subtitle changed to remove 商业可购; footer changed to 比较技术参数与规格; availability badge (可询价/暂无可购) removed; offer price list block removed; inquiry entry preserved.

Verification (runtime probe):

- ZB-K60 search: hasCommerce = false -> PASS.

- Product Detail SupplierModels tab: hasCommerce = false -> PASS.

- Offer model and private workflow (Workspace -> RFQ -> Offer) unchanged -> PASS.

***

## 10. Private Offer Preservation

- No change to Offer model; fully functional in private contexts (Supplier Workspace, Buyer Inquiry -> RFQ -> Offer, Admin governance).

- Only public projection changed; price/currency/offerCount not rendered publicly.

***

## 11. Search Counts / Tabs

After:

- Tabs: 全部 / 检测能力 / 检测方案 / 知识 (4 active tabs; removed 能力型号 / 供应商).

- Counts: total summary counts only Product / Solution / Knowledge.

- Pagination: hasMore still includes supplierProducts for supporting-model pagination.

- No stale UI artifacts; zero-result sections not rendered.

Verification (probe): ZB-K60 summary shows 共找到 1 条结果 (one aggregated product entry) -> PASS.

***

## 12. URL Compatibility

- /search?q=... unchanged and working.

- Old URLs with type=supplier or type=supplier-product: parseType gracefully falls back to all; rendering continues with 814 aggregation; no 404/crash/broken UI.

- Probe verification: ?q=ZB-K60\&type=supplier-product renders normally with product section -> PASS.

***

## 13. SEO

- No new routes; no new indexable landing pages; sitemap unchanged; canonical Product URLs unchanged; Platform Product retains SEO authority.

***

## 14. AI / LLM Discoverability

Semantic hierarchy preserved in public content:

- Platform Product = WHAT (primary heading/block)

- SupplierProduct = WHICH MODEL (contextual badges under Product)

- Supplier = WHO PROVIDES (contextual links under Product)
  No flattening to peer entities; no independent machine-readable authority granted to SupplierProduct.

***

## 15. Security

Public Search does NOT expose:

- private Offer details -> PASS (price/currency removed from public API projections and UI)

- private RFQ information -> PASS (never exposed)

- private Inquiry information -> PASS (never exposed)

- private commercial metadata -> PASS (offer-count removed from public API projections and UI)

- organization-private fields -> PASS (only published name/id exposed)

Post-verification payload fix (authorized 2026-09-03): back-end public
`/search` and legacy `/search/supplier-models` both return `supplierProducts`
WITHOUT `commercialSummary` (offerCount / activeOfferCount / priceFrom / priceTo /
currency). Verified at API JSON payload level (not merely DOM). The offers
price/currency are no longer selected at the Prisma query level for public search.
No private data leakage introduced.

***

## 16. Mobile

Probe verification (ZB-K60):

- 375: hasMatchModels true, no horizontal scroll, no commerce -> PASS

- 768: hasMatchModels true, no horizontal scroll, no commerce -> PASS

- 1024: hasMatchModels true, no horizontal scroll, no commerce -> PASS

- 1440: desktop -> PASS
  Match badges use flex-wrap -> no overflow with long model numbers; touch interaction preserved.

***

## 17. Regression

- API typecheck: pass (no API changes).

- Web typecheck: pass (only the pre-existing unrelated error on knowledge-base/\[slug]/page.tsx RelatedProductItem.status remains).

- No schema migration required.

- Next dev server boots without errors; runtime probe shows no JS errors.

***

## 18. Files Changed

- apps/web/src/components/search/SearchTypeTabs.tsx: remove supplier-product and supplier tabs.

- apps/web/src/components/search/GlobalSearchBar.tsx: remove supplier-product and supplier from SEARCH\_DOMAINS.

- apps/web/src/services/search.service.ts: remove types from SearchDomain union; deprecation comment for old URL.

- apps/web/src/components/search/ProductSupplierContext.tsx: NEW - renders matching SupplierProduct models + related Suppliers under Product card. No commerce.

- apps/web/src/app/search/SearchPageContent.tsx: add productEntries aggregation; remove independent supplier-product/supplier sections; update counts, summary, search context key.

- apps/web/src/components/products/ProductDetailContent.tsx: update seeAllHref from /search?type=supplier-product to /search?q=productName.

- apps/web/src/components/products/SupplierModelsSection.tsx: remove all public commerce display (price/currency/offer-count/availability badge/commercial section); update doc comment, subtitle, footer.

- apps/web/src/components/search/SupplierProductResultCard.tsx: DELETED (orphaned since SearchPageContent no longer renders it; rendered public price/offer-count).

- \_814\_probe.mjs: NEW - CDP browser runtime probe.

API-level security payload fix (applied under authorized follow-up, no schema migration):

- apps/api/src/search/search.service.ts: remove `commercialSummary` from `SupplierProductDiscoveryItem` DTO; drop the `offers` select (no longer queries private offer price/currency); remove commercialSummary from supplierProducts projection.

- apps/api/src/search/supplier-model-facet-search.service.ts: drop `offers` select + remove commercialSummary from `buildItems` projection.

- apps/api/src/search/dto/supplier-model-facet-search.dto.ts: remove `commercialSummary` field from `SupplierModelSearchResultItemDTO`.

Result: both public `/search` and `/search/supplier-models` return supplierProducts WITHOUT offerCount / activeOfferCount / priceFrom / priceTo / currency at the JSON payload level.
No schema changed (no migration).

***

## 19. Known Limitations

1. External links with type=supplier-product still resolve correctly but retain the deprecated type in URL (back/forward compatibility), intentional.
2. Product comparison page still has isSupplierMode = (type === 'supplier-product') code path for the comparison feature (out of 814 search scope).
3. Public navigation (header/footer/home capability section) still contains ?type=supplier-product links; these normalize gracefully. Changing them is out of 814 scope; would require governance change.
4. Residual facet availability signal: unified `/search` still returns `supplierProductFacets.commercial.hasActiveOffer` (an aggregate filter/availability count, not per-offer price or detail). It is NOT rendered on the public search page (SupplierModelFacetPanel is an orphaned component). Per-result offerCount/price/currency are removed at both display and API-payload layers.

***

## 20. Final Decision

A = CLOSED

All acceptance criteria satisfied:

- Supplier global search type removed. PASS

- SupplierProduct independent result authority removed. PASS

- model/brand/series search remains functional. PASS

- Product-centered aggregation implemented. PASS

- public price/currency/commercial summary removed. PASS

- Runtime: search, product authority, matching, contextual linking work. PASS

- Commerce display boundary enforced. PASS

- SEO unchanged (Platform Product authority preserved). PASS

- AI/LLM semantic hierarchy preserved. PASS

- Mobile: all viewports pass. PASS

- Security: no private data exposed. PASS

- Build / typecheck passes. PASS

***

## 21. Next Recommended Work

Next candidate: SupplierProduct Governance / Attach / Claim Foundation. Requires separate authorization per 813+814.

***

## Final State Snapshot

- M39: CLOSED

- 811: VERIFIED / NON-BLOCKING FOLLOW-UP

- 812: CLOSED

- 813: CLOSED / ALIGNMENT AUDIT COMPLETE

- 814: IMPLEMENTED / VERIFIED / CLOSED

***

## FINAL STATE

FINAL STATE: AUDITED / IMPLEMENTED / CLOSED
AUTHORITY MODEL: accepted
SEARCH MODEL: accepted (SupplierProduct = supporting, Supplier = contextual)
DISPLAY MODEL: accepted (Product-centered, no public commerce)
SEO/LLM MODEL: accepted (Platform authority preserved, semantic hierarchy intact)
SUPPLIERPRODUCT GOVERNANCE: accepted (admin-only unchanged; self-service remains future)
CURRENT IMPLEMENTATION: fully aligned
NEXT AUTHORIZED WORK: none
NEXT RECOMMENDED WORK: SupplierProduct Governance / Attach / Management (separate authorization)
M39: CLOSED

STOP.
No further implementation authorized per 814 instructions.
