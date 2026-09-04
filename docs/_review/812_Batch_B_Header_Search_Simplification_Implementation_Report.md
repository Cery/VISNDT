# 812 — Batch B: Header Search Simplification — Implementation Report

> Task: `812_Batch_B_Header_Search_Simplification`
> Version: `V3.2.3`
> Stage: **POST-M39 / AUTHORIZED IMPLEMENTATION**
> Date: `2026-09-03`
> Branch: `main`
> Repository Root: `f:\Desktop\VISNDT` · Code Root: `f:\Desktop\VISNDT\VISNDT`

***

## 1. Executive Decision

**A = CLOSED**

812 implemented 810's UX decision (D3 / Batch B):

- Global Header Search **kept** as the single entry point.

- Redundant **Header Type Selector removed** (desktop + mobile drawer).

- `/search` preserved as the **single unified search authority**.

- No search API / backend / ranking / facet / query-contract change.

- No new search authority, no parallel search endpoint, no mobile search redesign.

All runtime (4 viewports + 5 functional cases), static (typecheck/build), and authority-preservation
criteria pass. The pre-existing 802/M39 TypeScript error in `knowledge-base/[slug]/page.tsx` remains
unchanged and is **NOT** a 812 regression (per 13 it does not block closure).

***

## 2. Baseline

```text
M35 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M36 = CLOSED
M37 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M38 = CLOSED
M39 = CLOSED
810 = AUDITED / CONDITIONALLY AUTHORIZED
811 = VERIFIED / NON-BLOCKING FOLLOW-UP
```

811 status snapshot pre-condition **verified** (PROJECT\_STATUS 811 = `IMPLEMENTED + VERIFIED`,
D1/D2 recorded). 811 is **not reopened**. M39 is **not reopened**.

812 implements only 810's stated UX decision:

```text
Global Search          -> KEEP
Header Type Selector   -> REDUNDANT -> REMOVE
/search                -> SINGLE UNIFIED SEARCH AUTHORITY
```

***

## 3. Files Changed

| File                                                 | Change                                                                                                                    | Type           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `apps/web/src/components/layout/PublicHeader.tsx`    | Desktop search + mobile drawer `GlobalSearchBar` invocation changed to `showTypeSelector={false}`                         | Implementation |
| `apps/web/src/components/search/GlobalSearchBar.tsx` | `handleSubmit`: inject `type` param **only when** a type selector is shown (`showTypeSelector`); dependency array updated | Implementation |

Change surface = the preferred `GlobalSearchBar invocation / PublicHeader` (plus the contained
`GlobalSearchBar` selector-state cleanup). 7-line intent, 2 files.

No changes to:

```text
search.service.ts / search.controller.ts / UnifiedSearchDto / search API / search ranking /
search facet backend / ProductCategory / SupplierProduct / Supplier / Knowledge / Solution /
Offer / RFQ / Inquiry
```

***

## 4. Header Search Before / After

### Before

```text
PublicHeader
  -- GlobalSearchBar (with type selector: 全部 / 产品 / 能力型号 / 供应商 / 知识 / 方案)
       -- submit -> /search?q=...&type=...
```

### After

```text
PublicHeader
  -- GlobalSearchBar (pure keyword entry, no type selector)
       -- submit -> /search?q=...
```

- No empty select container left behind.

- No replacement filter, no second menu.

- `GlobalSearchBar` itself **not removed**; keyword entry, submit behavior, suggestions, keyboard
  interaction, and route push all preserved.

- Result page: tabs/facets live on `/search` (the unified authority). The header no longer
  pre-selects `product / supplier-product / supplier / knowledge / solution`.

***

## 5. Search Route Behavior

Normal header search now emits **`/search?q=keyword`** — verified at runtime:

```text
工业内窥镜  ->  /search?q=工业内窥镜   (no type param)
超声检测方案供应商  ->  /search?q=超声检测方案供应商   (no type param)
```

The `type` parameter is **no longer injected** when the selector is hidden; `type=all` is also
omitted (default, since `/search` page's `parseType` returns `'all'` for absent/unknown values).
This prevents stale/default type state from being unintentionally injected. **No new query contract
invented** — the existing canonical `/search?q=` representation is used, untouched.

***

## 6. Search Suggestion Verification

`SearchSuggestionDropdown.tsx` behavior **unchanged** (product-oriented). Task scope did **not**
redesign suggestion architecture, expand providers, or turn suggestions into multi-domain search.

Runtime (Case D):

```text
input "内窥"  -> dropdown shown, suggestion count = 2
click first suggestion  -> input fills "ZB-K60 工业检测内窥镜"
submit  -> /search?q=ZB-K60 工业检测内窥镜   (suggestion route preserved)
```

Recorded known limitation (not new scope): suggestions remain **Product-focused** — consistent with
810 baseline; header search remains a domain-neutral entry point while suggestions surface names.

***

## 7. Desktop Verification

Verified with headless Chrome via CDP at `1440 / 1280 / 1024`:

| Viewport | No overflow | Header search present | Type selector btn | header width |
| -------- | ----------- | --------------------- | ----------------- | ------------ |
| 1440     | yes         | yes                   | **absent**        | 1425         |
| 1280     | yes         | yes                   | **absent**        | 1265         |
| 1024     | yes         | yes                   | **absent**        | 1009         |

- No horizontal overflow (`scrollWidth == clientWidth`).

- No empty selector gap, no visual regression, no accidental nav collapse.

- Search remains clearly discoverable as a primary platform CTA.

***

## 8. Mobile / Tablet Verification

Verified at `768 / 375` (top header state + opened drawer state):

| Viewport | No overflow | top search exists    | drawer search exists | type selector btn |
| -------- | ----------- | -------------------- | -------------------- | ----------------- |
| 768      | yes         | (hidden desktop bar) | yes                  | **absent**        |
| 375      | yes         | (hidden desktop bar) | yes                  | **absent**        |

Notes:

- Consistent with the 810 baseline (`mobile header does not render the desktop search box`): the
  desktop search bar is `hidden lg:flex` (display:none below `lg`) — present in DOM but not visually
  rendered, so it does **not** introduce a mobile search box.

- The opened **drawer** exposes the existing mobile search mechanism (already present pre-812); 812
  only removed its type selector, it did **not** redesign the mobile header.

- No horizontal overflow, no header collision, no broken menu, no layout jump.

***

## 9. Functional Verification

| Case                        | Input                               | Result                                                                                            | Pass |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| **A — empty submit**        | `"   "` (spaces)                    | Stays on `/search`; no `q` params injected (existing repository-defined empty behavior preserved) | yes  |
| **B — product keyword**     | `工业内窥镜`                             | `/search?q=工业内窥镜`; `type` absent; results mounted (`条结果` present)                                 | yes  |
| **C — non-product keyword** | `超声检测方案供应商`                         | Enters unified `/search?q=...`; section labels include 能力型号 / 供应商 / 知识 (header not Product-only)  | yes  |
| **D — suggestion click**    | `内窥` then click suggestion          | Input filled `ZB-K60 工业检测内窥镜`; submit -> `/search?q=...`                                          | yes  |
| **E — back / forward**      | `/` -> `/search` -> back -> forward | back=`/`, forward=`/search?q=工业内窥镜`, no route corruption                                          | yes  |

***

## 10. Regression Verification

Web TypeScript (`npx tsc --noEmit`):

```text
exit 1
src/app/knowledge-base/[slug]/page.tsx(322,22): error TS2339: Property 'status' does
  not exist on type 'RelatedProductItem'.
```

Web Build (`npx next build`):

```text
Compiled successfully (44s)
Type error: knowledge-base/[slug]/page.tsx:322:22  ->  Property 'status' does not exist
  on type 'RelatedProductItem'.  (Next.js build worker exited with code 1)
```

**Both report exactly the one pre-existing 802/M39 baseline error.** No NEW typecheck/build error
introduced by 812.

```text
STATE = PRE-EXISTING / NON-BLOCKING
```

This pre-existing baseline issue is **NOT** misclassified as a 812 regression, and 812 does **not**
patch unrelated 802 debt (out of scope).

***

## 11. Authority Preservation

Confirmed there remains exactly **one** public search authority: **`/search`**.

- No `/header-search`, `/global-search`, `/product-search`, or `/supplier-search` created.

- No parallel search endpoint.

- The header is a **pure entry point**; domain filtering/faceting is the responsibility of the
  `/search` page (already provides it).

```text
Header Search = Entry Point
/search        = Unified Search Authority
```

***

## 12. Non-Changes

Per 4 / 14 / 21, the following were **NOT** modified:

```text
search.service.ts · search.controller.ts · UnifiedSearchDto · search API · search ranking ·
search facet backend · ProductCategory · SupplierProduct · Supplier · Knowledge · Solution ·
Offer · RFQ · Inquiry · schema · migrations · SearchSuggestionDropdown (behavior)
```

Also **not** done (explicit non-goals): rebuild Search, change authority/ranking, add AI/semantic
search, add a new search API, redesign mobile search, build SupplierProduct, Supplier Workspace
product management, Product/Capability/Specification authority change, reopen M39, create M39.1,
parallel search system.

***

## 13. Known Carry-Forward Issues

- **802/M39 baseline type error** — `apps/web/src/app/knowledge-base/[slug]/page.tsx(322,22)`
  `RelatedProductItem.status` property error. Pre-existing, non-blocking for 812, out of scope.

- **Suggestion provider is Product-focused** — recorded known limitation (810 baseline), unchanged;
  812 does not expand it (scope guard).

- **`type=all`** **omitted on header submit** — intentional UI-only cleanup, default resolved on the
  `/search` page; consistent with existing query contract.

- **Mobile top search presence** — DOM-present but `hidden lg:flex` (not visually rendered below
  `lg`), consistent with 810 baseline; no new mobile search box.

***

## 14. Final Decision

```text
Decision: A = CLOSED
```

Criteria met: implementation complete + runtime evidence (desktop/mobile + functional) complete +
documentation synchronized. The unchanged 802 baseline type error is **not** a 812 regression and
does **not** block closure.

```text
M39 = CLOSED

811 = VERIFIED / NON-BLOCKING FOLLOW-UP

812 = IMPLEMENTED / VERIFIED / CLOSED

NEXT CANDIDATE = Batch C — SupplierProduct Self-Service
```

***

## Scope-Expansion Gate (20)

No expansion triggered. Removing the Header Type Selector required **no** search API change, no
domain redesign, no query-contract redesign, no suggestion-architecture redesign, and no new
discovery authority. Status therefore remains **CLOSED**, not BLOCKED/SCOPE-CONFLICT.

## Final Stop (22)

812 complete. **STOP.** No automatic continuation to Batch C — SupplierProduct Self-Service.
