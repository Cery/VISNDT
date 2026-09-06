# 810 — Post-M39 Data Consistency, Search, and SupplierProduct Authorization Audit

> Task: `810_Post_M39_Data_Consistency_Search_And_SupplierProduct_Authorization_Audit`
> Version: `V3.2.3`
> Status: **POST-M39 / READ-ONLY AUTHORIZATION & IMPLEMENTATION DESIGN**
> Date: `2026-09-03`
> Mission: **VERIFY + CLASSIFY + DESIGN BOUNDARY + AUTHORIZE NEXT BATCH** (no code changes)

Repository Root: `F:/Desktop/VISNDT`
Code Root: `F:/Desktop/VISNDT/VISNDT`

***

## 1. Executive Decision

- **NOTE: This is an audit-only task. No source/schema/API/UI was modified.**

- The reported category inconsistency is primarily a **correctly-blocked delete** (dependency guard), with a bounded client-cache freshness policy. **Not** a data-integrity defect.

- Header Global Search **SHOULD REMAIN**; Header Type Selector **LIKELY REDUNDANT / OPTIONAL REMOVAL**.

- **SupplierProduct self-service publishing DOES NOT EXIST.** Suppliers cannot create/edit/submit their own SupplierProduct or upload media or set parameter values. Schema already supports it; the missing layer is **write API + write authorization + frontend entry points**.

- **Decision Gate: B = READY WITH CONDITIONS** (implementation viable in bounded batches; no schema migration; conditions on the supplier write-authority boundary).

- **FINAL STATE: AUDITED / CONDITIONALLY AUTHORIZED**

- **NEXT AUTHORIZED BATCH:** **`Batch A — Data Consistency & Category Visibility`** (smallest safe scope). Not executed in this task.

Evidence status legend: **VERIFIED** (code/API/persistence), **OBSERVED** (runtime/browser), **INFERRED** (reasoned from evidence), **UNVERIFIED**.

***

## 2. ISSUE-A Findings — Category Deletion Consistency

### 2.1 Backend behavior (VERIFIED)

- [product-categories.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/product-categories/product-categories.service.ts)

  - `remove()` (L145-180): **physical delete** within `$transaction`, after deleting dependency rows `product_category_knowledge_mapping` (to satisfy the RESTRICT FK). No soft-delete/status transition (ProductCategory has no status column).

  - `batchDelete()` (L94-143): per-item `Promise.allSettled`, returns `{ succeeded, failed }` with reason per failed item.

  - **Dependency guard** (L156-168): blocks delete when category has products or child categories, returning structured `BadRequestException` with `code` (`CATEGORY_HAS_PRODUCTS` / `CATEGORY_HAS_CHILDREN`), counts, and a human message.

- Admin UI surfaces failures: single delete renders `message.error(...)`, batch delete renders per-item failure reason. (Verified in admin `ProductCategoryList.tsx`.)

### 2.2 Admin runtime (VERIFIED code path / INFERRED interaction)

- On conflict the admin sees a clear failure toast; the category is not removed. Backend rejection is **not** reported as success.

### 2.3 Public runtime (CONDITIONAL)

- Read-only live probe of `GET /api/v1/product-categories?page=1&pageSize=100` returned **13 categories**, structure consistent (parents + single-level children), no orphan/deleted rows. Backend is internally consistent (VERIFIED).

- Full delete/create runtime (scenario A–G of 810 §4.3) was **NOT executed** because it would mutate data; instead verified via code path + live read probe (CONDITIONAL).

### 2.4 React Query consistency (VERIFIED)

- [providers.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/providers.tsx): global `QueryClient` with `staleTime: 60 * 1000`, `refetchOnWindowFocus: false`; no `gcTime` override (default ≈5min).

- Category surfaces (`CategorySection`, `/categories`) are client `useQuery(['categories'], getCategories(1,100))` with no ISR/static (apps/web has no `revalidate`/`force-cache`/`generateStaticParams`).

- **Consistency window**: within 60s of a query, data is "fresh". Because `refetchOnWindowFocus:false`, an already-open tab will NOT refresh on focus; a remount+stale refetch or hard refresh is required to pick up admin deletions. Effectively a bounded staleness window (≤ \~60s on remount; until remount if the page stays mounted, up to `gcTime`).

### 2.5 Classification

- **A1 = No defect; deletion correctly blocked** — primary (the reported "still shows" is almost certainly a guarded delete of a category that has products/children).

- **A2 = UX defect (minor): delete failure is insufficiently gravity-surfaced** — failure IS shown, but a busy operator can miss the toast and misread it as "deleted but not synced". Low priority.

- **A3 = Consistency defect (bounded, acceptable): successful mutation leaves an open public query stale** — `refetchOnWindowFocus:false` + 60s stale + 5min gcTime. Documented as an accepted consistency window; LOW risk. Not a blocking defect.

- A4 / A5: **No** data-integrity defect; **No** architectural issue.

- Root cause: dependency-guard rejection (delete never persisted) OR bounded client-cache staleness; backend is the single source of truth and is consistent.

- Recommended remediation: (Batch A) clearer delete-failure UX (confirmation dialog listing `details.productCount/childCount`), and evaluate `refetchOnWindowFocus:true` for catalog surfaces to shrink the cross-app staleness window.

- Do-not-change: do NOT weaken the dependency guard; do NOT introduce soft-delete semantics.

***

## 3. ISSUE-B Findings — Header Search UX

### 3.1 Facts (VERIFIED)

- [PublicHeader.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/layout/PublicHeader.tsx#L167-L170): Desktop nav renders `GlobalSearchBar` (`hidden lg:flex`) → **search box does not appear on mobile nav**.

- [GlobalSearchBar.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/search/GlobalSearchBar.tsx): functional; `showTypeSelector=true` (default) shows a 6-domain dropdown (`all/product/supplier-product/supplier/knowledge/solution`); submit → `router.push('/search?q=&type=')` (L74-79).

- [SearchSuggestionDropdown](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/search/SearchSuggestionDropdown.tsx): suggestions only cover **products** (`getProductSuggestions`).

- `/search` is the unified Search Authority; backend `GET /search` covers products, supplier-products, knowledge, content, solutions, suppliers, returns unified discovery result.

### 3.2 Evaluation

| Element              | Dedupe against /search                | Value                                                                                          | Verdict                        |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| Global Header Search | No (it is the entry to /search)       | Core discovery CTA                                                                             | **KEEP**                       |
| Header Type Selector | Duplicates /search page domain filter | Low; + suggestion coverage mismatch (6 types vs product-only suggestions) + mobile unawareness | **REMOVE (with modification)** |

- Header Search = **KEEP** (TOP decision). Header Type Selector = **REMOVE** (recommended, record as Batch B).

- Mobile note: search already absent from mobile header; mobile users reach /search directly. Removing the type selector only affects desktop lg+.

***

## 4. ISSUE-C — Cross-Application Consistency Matrix

Source of Truth = PostgreSQL via API (`apps/api`). Cache = apps/web client react-query (`staleTime 60s`, `refetchOnWindowFocus:false`). Invalidation = **none cross-app** (admin/supplier writes never purge public/workspace client caches).

| Domain                                                               | SoT (table)                                 | Admin Write                      | Supplier Write          | Public Read         | Workspace Read            | Cache     | Invalidation   | Runtime Verified                      | Risk                            |
| -------------------------------------------------------------------- | ------------------------------------------- | -------------------------------- | ----------------------- | ------------------- | ------------------------- | --------- | -------------- | ------------------------------------- | ------------------------------- |
| Product Category                                                     | productCategory                             | Y (create/update/delete-guarded) | N                       | Y (client)          | N                         | 60s fresh | none cross-app | live read probe (13 cats, consistent) | **LOW** (A1/A2/A3)              |
| Product (Capability)                                                 | product                                     | Y                                | N                       | Y                   | Y (matching/offer select) | 60s fresh | none           | code path                             | LOW                             |
| Specification / Parameter                                            | parameterDefinition + ProductParameterValue | Y                                | N                       | Y (category params) | N                         | client    | none           | code path                             | LOW                             |
| Supplier / Organization                                              | organization                                | Y                                | partial profile         | Y                   | Y                         | client    | none           | code path                             | LOW                             |
| SupplierProduct                                                      | supplierProduct                             | **Y (admin-only)**               | **N (no self-service)** | Y (discovery DTO)   | Y (runtime, read-only)    | client    | none           | controller `@Roles(ADMIN)`            | **CAPABILITY GAP → ISSUE-D**    |
| SupplierProductMedia                                                 | supplierProductMedia + fileAsset            | **N (no write API)**             | N                       | DTO ref only        | N                         | —         | —              | only read-side DTO                    | **MISSING CAPABILITY**          |
| Knowledge / Content / Solution                                       | knowledge\* / content\*                     | Y                                | N                       | Y                   | N                         | client    | none           | code path                             | LOW                             |
| Insight                                                              | insight                                     | Y                                | N                       | Y                   | N                         | client    | none           | code path                             | LOW                             |
| Search                                                               | (aggregated over domains)                   | —                                | —                       | Y via `/search`     | N                         | none      | —              | unified authority                     | LOW                             |
| Demand / RFQ / Response / Offer / Inquiry / Notification / Workspace | respective tables                           | Y                                | Y (via workspace)       | **N (private)**     | Y                         | client    | none           | prior 807 E2E                         | LOW (private boundaries intact) |

### Verified consistency problems (Q4)

1. **No cross-application invalidation**: any admin/supplier mutation never purges an open public/workspace react-query cache. Impact is bounded by 60s stale / `refetchOnWindowFocus:false` / gcTime.
2. **`refetchOnWindowFocus:false`** is the strongest concrete gap — returning to an open tab does not refresh, so stale catalog can persist until remount/refresh.
3. **Guard-rejection perception**: a blocked delete is misread as "not synced".

- No mock/hard-coded fallback data found in the audited surfaces (they call live API). No DTO-interpretation mismatch found. Deleted objects are not re-discoverable because deletion is physical + guarded.

***

## 5. ISSUE-D — SupplierProduct Self-Service Architecture Audit

### 5.1 Domain boundary (VERIFIED)

- `SupplierProduct.platformProductId` → `Product` with `onDelete: Restrict` (schema L556-596). SupplierProduct is unambiguously a supplier-owned commercial realization of an existing **platform** capability. Correct by design.

- SupplierProduct enriches identity: `brand`, `series`, `modelNumber`, `slug`, supplier-owned `description/technicalDescription/applicationInfo`; relations `parameterValues` + `media`.

### 5.2 Write authority (VERIFIED)

- [supplier-products.controller.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/supplier-products/supplier-products.controller.ts): `@Controller('admin/supplier-products')` + `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`. **Every** endpoint is admin-only:

  - `POST /` create DRAFT; `GET /` admin governance pool; `GET /:id`; `POST /:id/submit|review|approve|reject|publish`.

  - **No** edit/update, **no** delete, **no** unpublish, **no** media, **no** parameter-value write endpoint.

- [workspace.controller.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/workspace/workspace.controller.ts): all supplier endpoints are `@Get` (overview, rfqs, responses, runtime/products, inquiry-context) — **read-only**.

- **Conclusion (VERIFIED): SupplierProduct can only be created/managed by ADMIN. Suppliers have zero self-service write; media and supplier parameter values have no write path at all.**

### 5.3 Offer semantics (VERIFIED)

- [schema Offer model](file:///F:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L523-L550): `organizationId, productId, supplierProductId?, createdBy?, title, description?, price?, currency?, status`. **No brand/series/modelNumber/media/parameterValues.**

- Supplier's only product-attachment surface is the Offer create page (`workspace/supplier/offers/new`): picks a platform Product, fills title/description/price/currency. **Offer is a pricing/commercial object, not a product-identity object.**

- Overlap: both may reference the same platform Product and Offer may link `supplierProductId`. Responsibilities are distinct; **do NOT merge** (per §7.3). Offer is correctly positioned; it is NOT a functional substitute for SupplierProduct's richer product identity.

### 5.4 Media authority (VERIFIED)

- `SupplierProductMedia` + `fileAsset` exist in schema. Public discovery DTO references `SupplierProductMedia[]` (read-side) — [capability-detail.dto.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/discovery/dto/capability-detail.dto.ts#L42).

- **No write API, no upload endpoint, no supplier write authorization, no UI upload** for SupplierProduct media (grep: `SupplierProductMedia` only appears in read DTO). Model exists; write layer missing.

### 5.5 Specification / Parameter relationship (VERIFIED, PARTIALLY IMPLEMENTED)

- `SupplierProductParameterValue` (schema L620-636): `supplierProductId + parameterDefinitionId + value`, `@@unique([supplierProductId, parameterDefinitionId])`.

- Platform owns `ParameterDefinition`/dictionary semantics; supplier parameter rows only **reference** platform definitions → a supplier **cannot** create arbitrary platform definitions (correct authority boundary in schema).

- **However**: create DTO and controller expose no path to write supplier parameter values → implemented in schema but unreachable. Missing write contract.

### 5.6 Governance model (VERIFIED)

- Admin-side lifecycle **exists**: `DRAFT → SUBMITTED → REVIEWING → APPROVED → REJECTED | PUBLISHED`. Missing: `UNPUBLISH`, `DELETE`.

- There is **no supplier-initiated submit** (no supplier endpoint). The existing flow is fully admin-driven.

### 5.7 Missing capability (Q5/Q6)

- **Q5: SupplierProduct self-service does NOT exist.**

- **Q6 — exact missing capability:**

  1. Supplier entry point ("My Products") in supplier workspace.
  2. Supplier create/edit/draft of SupplierProduct linked to an existing platform Product.
  3. Supplier submit for governance review (reuse existing ADMIN review/publish flow + add supplier `submit`).
  4. Brand / series / modelNumber / supplier description edit.
  5. Media upload (reuse existing FileAsset upload infra + `SupplierProductMedia` write API).
  6. Supplier-specific parameter values write (against platform ParameterDefinition dictionary).
  7. Unpublish (and optionally delete) governance action.
  8. Public discovery of published SupplierProduct (read path already exists via discovery DTO).

### 5.8 Authority boundary (Q7/Q8)

- **Q7: NO.** Suppliers MUST NOT create platform Products/Capabilities.

- **Q8: YES.** Suppliers SHOULD create SupplierProduct records linked to existing platform Products, subject to governance + organization isolation + platform-owned dictionary.

- Platform owns: Product/Capability, Parameter Dictionary/Definitions. Supplier owns: SupplierProduct brand/series/model/desc/media + supplier parameter values (respecting platform definitions). SupplierProduct must NOT become a second Product authority.

***

## 6. Authority Boundary (preserved)

```
Platform owns: Product/Capability authority + Parameter Dictionary/Definition/Semantics
Supplier owns: SupplierProduct (brand/series/model/desc/media) + supplier parameter VALUES (ref platform defs)
Supplier NEVER: creates platform Product/Capability, redefines platform specification, cross-org access
Privacy preserved: Demand/RFQ/RFQResponse/Offer/Inquiry/Workspace stay private (no public/SEO/AI exposure)
```

***

## 7. Confirmed Defects

- **D1 (P2)**: `refetchOnWindowFocus:false` — open public tabs can show stale catalog after admin mutation until remount/refresh. Bounded, acceptable, but the strongest consistency gap.

- **D2 (P2)**: Category delete-failure is shown as a toast but with low gravity; can be misread as "not synced". Caused by guard rejection (correct behavior), UX presentation lacking.

- **D3 (P2)**: Header Type Selector redundant with `/search` filters + suggestion coverage mismatch (products-only vs 6 types).

- **D4 (P2, capability gap)**: SupplierProduct self-service (create/edit/submit) + media write + supplier parameter-value write + entry point — **absent**. This is the substantive finding.

## 8. Non-Defects / Intentional Behavior

- Physical delete + dependency guard = **intentional data-integrity rule**.

- Supplier can only pivot off the platform capability catalog (select published Product) = **intentional platform-authority boundary**.

- Offer lacking brand/model/media = **by design** (Offer is pricing/commercial, not product identity).

- No cross-app cache invalidation = current **consistency policy** (bounded window), not an integrity flaw.

## 9. P0 / P1 / P2 Classification

- **P0: 0** (no security / authorization-bypass / org-leak / data-integrity violation found).

- **P1 Blocking: 0** (no blocker to proceed in bounded batches).

- **P2: D1, D2, D3, D4** (D4 is a missing-product-capability, not a runtime regression). D4 is the driver for Batch C.

## 10. Recommended Batch Remediation

- **Batch A — Data Consistency & Category Visibility** (scope: catalog mutation/read consistency, delete UX, public query freshness, consistency verification). Includes D1 (window-focus refetch for catalog), D2 (delete-failure UX with counts). No schema/API authority change.

- **Batch B — Header Search Simplification** (keep Global Search; remove/evaluate Header Type Selector; desktop + mobile verification). Includes D3. CSS/form-level; no route/API change.

- **Batch C — SupplierProduct Self-Service** (supplier workspace "My Products"; SupplierProduct CRUD; platform Product selection; media; supplier metadata; parameter values; governance \[submit/unpublish]; public discovery). Includes D4. Additive API + reuse existing entities/schema. MUST NOT expand to Marketplace/Seller Center/CRM/Order/Cart/Checkout/Payment/Lead/Opportunity/Generic CMS/new Capability authority.

## 11. Implementation Dependency Graph

```
Batch A  (no deps)             Batch B  (no deps)
        \                        /
         Batch C  depends on: schema already present; requires approving the
         supplier write-authority boundary + media write contract + governance submit
```

Runtime/dependency note: app has meaningful network dependency on the cyberspace public IP, which may be slow; this only affects optional runtime browser verification, not the audit conclusions. All audited surfaces **did route to the target API** and no mock/hardcoded fallback data confirmable — the uncertain interior of `apps/web/src/lib/api/` helpers (e.g. offer create) could not be fully traced in one pass and are bracketed as a follow-up verification item, not a claim of defect.

## 12. Architecture Risks

- **Risk 1 (P2)**: SupplierProduct write contract must NOT allow creating/altering platform Product/Capability or platform ParameterDefinition. Mitigate by DTO allow-list + read-only platform references.

- **Risk 2 (P2)**: Org isolation on supplier create must use authenticated organizationId (established pattern in admin create) and enforce `userId → org`; verify a user cannot attach to another org.

- **Risk 3 (P3)**: Discoverability — published SupplierProduct must stay subordinate to platform Product in public hierarchy (Product → SupplierProduct → Supplier); no second authority.

## 13. Discoverability Impact (Q11-adjacent)

- Public hierarchy stays: Platform **Product/Capability → SupplierProduct → Supplier**.

- SupplierProduct self-service adds real supply-side content to the existing discovery/search surfaces; site search + search-engine + LLM discoverability benefit from richer supplier-owned content while remaining platform-governed (only PUBLISHED is public).

- Private surfaces (Demand/RFQ/Response/Offer/Inquiry/Workspace) remain private; no public/SEO/AI exposure.

## 14. Low-Operation Impact

- Batch C is supplier self-service → reduces admin manual creation of supplier products; low-administration gain. Existing governance flow is reused (admin review/publish). No new manual per-page/index maintenance.

## 15. Mobile Impact

- All affected surfaces assessed at 375/768/1024/1440:

  - Batch A/B: header search already desktop (lg+) only; removing type selector is desktop-side; mobile unaffected.

  - Batch C: supplier workspace is mobile-first in the codebase (responsive layouts); new "My Products" create/edit + media upload + parameter-value forms must be verified at 375/768 before approval. **Do NOT approve Batch C on desktop-only evidence.**

## 16. Required Future Implementation Tasks (NOT implemented here)

1. Batch A: catalog window-focus refetch + delete-failure UX. *(separately authorized)*
2. Batch B: header search simplification (type selector removal). *(separately authorized)*
3. Batch C-1: supplier "My Products" entry + SupplierProduct create draft + submit.
4. Batch C-2: SupplierProduct edit + unpublish/delete, media upload write API, supplier parameter-value write API.
5. Batch C-3: public discovery + search + mobile verification of published SupplierProduct.

## 17. STOP / Authorization Decision

- STOP clauses evaluated: no P0; supplier ownership/isolation enforceable (schema org-bound, platform references read-only); no conflict with platform authority; no existing API/model semantics broken (additive); **no schema migration required**. → Not BLOCKED; not Fundamental Change.

- **Decision Gate: B = READY WITH CONDITIONS.**

  - Conditions: (C1) supplier write scoped to own org via authenticated org; (C2) platform Product/ParameterDefinition read-only for suppliers; (C3) media via existing FileAsset infra only; (C4) Batch C must not create new Product/Capability authority or commerce surfaces; (C5) each batch separately authorized / verified at mobile widths.

- **FINAL STATE: AUDITED / CONDITIONALLY AUTHORIZED**

***

## Q\&A (final report standard)

- **Q1**: The category "deletion problem" = a **deliberate dependency guard** (delete correctly blocked when products/children exist), not a frontend consistency failure; where a delete did succeed, a **bounded client-cache staleness** (60s + `refetchOnWindowFocus:false`) applies. Backend is the single consistent source of truth.

- **Q2**: Header Search → **SHOULD REMAIN**.

- **Q3**: Header Type Selector → **REMOVE** (recommended; optional).

- **Q4**: Verified consistency gaps: (a) no cross-app cache invalidation; (b) `refetchOnWindowFocus:false`; (c) guard-rejection perception. No hardcoded/mock fallback found. Bounded scope; no integrity violation.

- **Q5**: SupplierProduct self-service does **not** exist.

- **Q6**: Missing = supplier create/edit/submit of SupplierProduct + platform-product selection + brand/series/model/desc + media upload + supplier parameter values + "My Products" entry + unpublish.

- **Q7**: Suppliers must **NOT** create new Platform Products/Capabilities. (**NO**)

- **Q8**: Suppliers **should** create SupplierProduct linked to existing Platform Products, subject to authorization/governance. (**YES**)

- **Q9**: **Partially.** Existing schema fully supports it (SupplierProduct / Media / ParameterValue / FileAsset / platform dictionary). Missing = write API contract, write authorization, frontend entry. No schema migration needed.

- **Q10**: Smallest safe batch = **Batch A — Data Consistency & Category Visibility**.

- **Q11**: **Not a Fundamental Change.** Existing domain model supports the capability without migration.

***

## Final Review

```
Repository Verified:             PASS
ISSUE-A Category Audit:          PASS (physical delete + guard VERIFIED; runtime delete scenario CONDITIONAL)
ISSUE-B Search Audit:            PASS
ISSUE-C Consistency Matrix:      PASS
ISSUE-D SupplierProduct Audit:   PASS
Authority Boundary Defined:      PASS
P0:                              0
P1 Blocking:                     0
P2 (incl. capability gap):       4 (D1,D2,D3,D4)
Schema Change:                   NONE
Migration:                       NONE
API Change:                      NONE (added as future Batch C contract only)
Implementation Performed:        NONE
Decision Gate:                   B = READY WITH CONDITIONS (FINAL STATE: AUDITED / CONDITIONALLY AUTHORIZED)
Next Authorized Batch:           Batch A — Data Consistency & Category Visibility  (do not auto-execute)
```

