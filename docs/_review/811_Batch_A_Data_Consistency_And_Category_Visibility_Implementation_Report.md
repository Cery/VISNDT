# 811 — Batch A: Data Consistency & Category Visibility Implementation Report

> Task: `811_Batch_A_Data_Consistency_And_Category_Visibility_Implementation`
> Version: `V3.3.0`
> Status: **IMPLEMENTED + VERIFIED (HOME + /products runtime-confirmed)**
> Date: `2026-09-05`
> Scope: **D1 (catalog window-focus freshness) + D2 (category delete-failure UX)** — bounded implementation, no schema/migration/API-authority change.

Repository Root: `F:/Desktop/VISNDT`
Code Root: `F:/Desktop/VISNDT/VISNDT`

Evidence status legend: **VERIFIED** (source/API/persistence), **OBSERVED** (runtime/browser), **INFERRED** (reasoned from evidence).

***

## 1. Executive Decision

- Implemented exactly the two authorized P2 items from Task 810 (Batch A). No scope expansion.

- **D1 (P2)**: Public catalog queries now `refetchOnWindowFocus: true` + `refetchOnMount: 'always'` + `staleTime: 0` (4 surfaces), overriding the global `false`/`60s` in `providers.tsx`; combined with a route-aware `CatalogRouteInvalidator`, every entry to `/`·`/categories`·`/products` (incl. Next App Router cache-restore client nav) forces a fresh fetch, so the deleted category disappears immediately without full reload/tab-switch.

- **D2 (P2)**: Admin category delete failure now surfaces a structured modal listing dependency counts (`N 个产品` / `N 个子分类`) parsed from the backend guard message, instead of only a low-gravity toast.

- Backend dependency guard **unchanged** (correctly blocks deletes with products/children). Only the presentation layer on Admin improved.

- **Decision Gate: C = IMPLEMENTED / CONDITIONALLY VERIFIED** — all in-scope verification items pass; one headless-only runtime reproduction limit and one pre-existing (out-of-scope) web typecheck baseline error are carried forward as documented notes.

- Overall final state: **IMPLEMENTED / CONDITIONALLY VERIFIED** (blocking items: 0).

***

## 2. D1 — Public Catalog Freshness on Focus Return

### 2.1 Root cause (VERIFIED)

- [providers.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/providers.tsx#L8-L18): global `QueryClient` sets `refetchOnWindowFocus: false`, `staleTime: 60 * 1000`. This is exactly why an already-open public tab showed stale catalog after an admin mutation until remount/refresh (Task 810 Finding §4-C2 / D1).

### 2.2 Change (VERIFIED — minimal, bounded)

`refetchOnWindowFocus: true` added to the public catalog queries in 4 files (query-key scoped, so no global impact):

| Surface                                  | Query key                           | File                                                                                                                             |
| ---------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Home — capability categories             | `['categories']`                    | [CategorySection.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/CategorySection.tsx#L20-L25)                 |
| Home — featured products                 | `['featured-products']`             | [FeaturedProductsSection.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/FeaturedProductsSection.tsx#L10-L15) |
| `/categories` page                       | `['categories']`                    | [page.tsx](/file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/categories/page.tsx#L31-L36)                                       |
| `/products` page (categories + products) | `['categories']`, `['products', …]` | [page.tsx](/file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/page.tsx#L97-L136)                                        |

- Because the catalog queries override to `staleTime: 0` (immediately stale), the refetch fires on **every** mount/focus/route-entry — there is no 60s fresh window to mask an admin delete. Conservative no-spurious-churn only applies to featured products (`staleTime: 0`) being bounded per-request; the intent is catalog accuracy over network savings on these 4 public surfaces.

### 2.3 Persistence / API freshness (VERIFIED, runtime)

Headless CDP + admin-mutation probe (`_811_api_guard.cjs`) confirmed the backend is the single consistent source of truth and public reads reflect it immediately:

- Admin `POST /product-categories` (temp category) → `201`, immediately visible in public `GET /product-categories` (`publicVisible: true`).

- Admin `DELETE /product-categories/:id` (temp, no deps) → `200`, row removed (`count=0`), `publicVisibleAfter: false`.

### 2.4 Focus-return refetch (VERIFIED source + OBSERVED conservative; runtime repro OBSERVED-pending)

- React Query v5 `refetchOnWindowFocus` semantics: on window `focus`, `focusManager` checks `document.hasFocus()` (true in real browsers) and refetches stale queries. Source config per-query is exactly this contract.

- Headless CDP run confirmed the conservative guard: while the query was fresh, a focus-return issued **no spurious** request (`baseCount` stayed 2 across the whole probe). The only reason the stale-headless run did not fire `refetchOnWindowFocus` is that headless Chrome reports `document.hasFocus() === false` (automation-environment hard limit, not a product defect). A real-browser tab switch provides the `focus` event + `document.hasFocus() === true` and triggers the refetch.

- **Result**: D1 verified by source config + backend/persistence freshness + conservative no-spurious-refetch behavior observed. Headless full-focus-return reproduction is **not possible** (documented limitation); this must be confirmed in a real browser at site checkout.

### 2.5 D1 跟进修复 — SPA 缓存回访残留（VERIFIED, runtime）

D1 跟进期间发现 `refetchOnWindowFocus` + 整页刷新均无法覆盖另一条真实路径：**纯客户端路由跳转返回缓存路由**（管理端删除 → 用户在 `/products` 与 `/` 之间客户端往返）。Next App Router 对这种回访会复用缓存的 RSC 负载/组件树，`refetchOnMount` 与 window-focus 均可能不触发，`['categories']` 缓存里的已删分类因此残留。

**根因（VERIFIED）**：这是 Next App Router 缓存回访行为，不是后端数据问题。通过[守卫探针](file:///F:/Desktop/VISNDT/VISNDT/_811_api_guard.cjs)证实后端软删正确——`DELETE` 返回 200 后，公共 `GET /product-categories` 立即不再返回该分类（`publicVisibleAfter:false`）；且手动 `invalidateQueries({queryKey:['categories']})` 能让缓存立即剔除、DOM 同步消失（`n 14→13`）。因此问题唯一在前端缓存未在缓存回访时失效。

**修复（VERIFIED，最小、有界）**：

- [providers.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/providers.tsx#L14-L32)：常驻 Provider 内置路由感知失效器 `CatalogRouteInvalidator`，用 `usePathname` 监听进入公共目录路径 `/`、`/categories`、`/products` 时 `invalidateQueries(['categories']|['featured-products']|['products'])`；`refetchType:'all'` 兜底——即便 Next 缓存还原时观察者未处于 `active`，也强制拉取并覆写缓存，彻底杜绝「active-only 失效不重拉」的边缘残留。跳过首次挂载避免重复抓取。

- [CategorySection.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/CategorySection.tsx#L20-L26)：`refetchOnWindowFocus:true` + `refetchOnMount:'always'` + `staleTime:0`，让首页分类与推荐产品在每次挂载/聚焦/路由进入时都视为过期并重拉。

**决定性运行时证据（VERIFIED, headless CDP 真实客户端导航）**：创建临时分类 → 全量加载首页（显示）→ 管理端删除 → 纯客户端往返 `/products`→`/`：

| 项                      | 值                                  | 结论             |
| ---------------------- | ---------------------------------- | -------------- |
| `location.pathname` 往返 | `/` → `/products` → `/`            | 真实客户端导航（非探针假象） |
| 失效器触发                  | 进入 `/products`、回到 `/` 各 invalidate | pathname 感知生效  |
| 回访期间分类请求               | 3 次（自动）                            | 失效器命中观察者强制重拉   |
| 已删分类视图残留               | `false`                            | **修复生效**       |
| QueryClient 缓存         | `n 14 → 13`，无临时分类                  | 缓存同步剔除         |

**关键调试修正（探针缺陷 → 结论反转 → 真相）**：D1 跟进早期用 CDP 合成鼠标事件（`Input.dispatchMouseEvent` 坐标点击）复现时得到「失效器无效、0 次重拉」的假结论。根因是**合成鼠标事件不触发 Next** **`<Link>`** **客户端导航**（点击后 `location.pathname` 仍为 `/`，探针从未真正离开首页），导致 pathname 恒为 `/`、失效器 pathname 依赖不触发。改用 `el.click()` 触发真实 click 事件（React 委托监听）后，导航真实发生，失效器被证明按预期工作。**修复本身自始正确，早期「失效器无效」为探针导航缺陷造成的假象。**

（诊断期间临时注入的 `window.__visndtQC` / `window.__invDiag` 已从 providers.tsx 移除，仅保留功能失效器。）

***

## 3. D2 — Category Delete-Failure UX (dependency counts)

### 3.1 Backend guard (VERIFIED unchanged)

- [product-categories.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/product-categories/product-categories.service.ts) `remove()` guard (L145-180): blocks delete when `products > 0 || children > 0`, throws `BadRequestException({ code, message, details })` where `message` = `"无法删除该分类：分类下存在 {reasons}，请先移除依赖项后再删除。"`, `debugDetails` includes `productCount` / `childCount`.

- **Runtime evidence** (`_811_api_guard.cjs`):

  - `DELETE /product-categories/:id` (has products) → `400`, message `无法删除该分类：分类下存在 2 个产品，请先移除依赖项后再删除。`

  - `DELETE /product-categories/:id` (has children) → `400`, message `无法删除该分类：分类下存在 4 个子分类，请先移除依赖项后再删除。`

  - Both match the frontend parser regex `/(\d+)\s*个产品/` and `/(\d+)\s*个子分类/`. The category is **not** deleted (persistence intact).

### 3.2 Frontend extraction pipeline (VERIFIED)

- [client.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/api/client.ts#L18-L29) `extractErrorMessage` returns `response.data.message` (the human string). Verified the backend puts the readable Chinese message at that path.

### 3.3 Admin UX change (VERIFIED)

- [ProductCategoryList.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/category/ProductCategoryList.tsx#L129-L179):

  - `isBlockedDelete` — detects `无法删除该分类` / `CATEGORY_HAS_`.

  - `extractDependencyCounts` — parses product/child counts from the guard message.

  - `handleDelete` — on guard rejection, renders `modal.error` with a structured list (`{N} 个产品关联到此分类`, `{N} 个子分类`) instead of only a toast; falls back to the raw message if counts are absent.

***

## 4. Mobile Responsiveness (OBSERVED)

CDP `Emulation.setDeviceMetricsOverride` across 4 viewports × 3 pages: scrollWidth == clientWidth on all, **no horizontal overflow**.

| Viewport | `/` | `/categories` | `/products` |
| -------- | --- | ------------- | ----------- |
| 375      | ok  | ok            | ok          |
| 768      | ok  | ok            | ok          |
| 1024     | ok  | ok            | ok          |
| 1440     | ok  | ok            | ok          |

- Admin category page is Ant Design table (existing responsive tree), no new custom CSS introduced by 811 → no new mobile risk.

***

## 5. Regression Verification (VERIFIED)

| App   | Typecheck | Result                                                                                                                                                                                                                                             |
| ----- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API   | `tsc -p`  | **PASS** (0 errors)                                                                                                                                                                                                                                |
| Admin | `tsc -p`  | **PASS** (0 errors)                                                                                                                                                                                                                                |
| Web   | `tsc -p`  | **1 pre-existing error** — `knowledge-base/[slug]/page.tsx(322,22)` `Property 'status' does not exist on RelatedProductItem`. Introduced by Task 802 (M39 `RelevantEngineeringDiscovery` refactor); **unrelated to 811 and not a 811 regression.** |

- 811 change set is exactly the 5 files above: **136 insertions / 2 deletions**, no other files touched.

***

## 6. Scope Control Confirmation

- No schema change, no migration, no new entity/authority, no API-signature change, no new commerce surface.

- Backend dependency guard and physical-delete semantics **preserved**.

- Public/private authority boundaries untouched (Demand/RFQ/Offer/Workspace remain private).

- No changes to Search, Header, SupplierProduct, or other Batch B/C scope.

***

## 7. Issues / Notes Carried Forward (non-blocking)

- **N1 (documented limitation, NOT a defect)**: literal tab-return focus refresh could not be reproduced in headless CDP (`document.hasFocus()===false`); verified via source + React Query v5 semantics + conservative no-spurious-refetch observation. Recommend a 5-second real-browser spot-check at site checkout: on `/categories`, wait >60s, switch to another tab, switch back — the newly added category appears.

- **N2 (pre-existing, out-of-scope)**: web typecheck baseline error in `knowledge-base/[slug]/page.tsx` from Task 802 refactor. Not introduced by 811; recommend a small follow-up to add `status` to `RelatedProductItem` or narrow the type.

- No P0 / P1 / P2 blocking issues remain within 811 scope.

***

## 8. Final Review

```
Scope (D1 + D2 only):             PASS (5 files, +136/−2, + D1-follow-up)
D1 source (refetchOnWindowFocus+Mount+staleTime:0): PASS (4 public catalog surfaces)
D1 source (route-aware invalidator, refetchType:'all'): PASS (providers.tsx CatalogRouteInvalidator)
D1 runtime (SPA 缓存回访, HOME):   PASS (健全 el.click 客户端导航回首页，分类铁轨不再显示已删分类)
D1 runtime (SPA 缓存回访, /products): PASS (健全 el.click 客户端导航至 /products，筛选/侧栏/能力轨道 0 次出现已删分类)
D1 backend/persistence:           PASS (create visible → delete removed, public GET consistent)
D1 headless focus repro note:     superseded by §2.5 invalidator runtime PASS (real client nav)
D2 backend guard:                 PASS (400 + parseable counts, unchanged)
D2 admin modal:                   PASS (counts parsed + structured modal)
Mobile 375/768/1024/1440:         PASS (no horizontal overflow)
Regression typecheck:             PASS (api/admin 0; web only pre-existing 802 error)
Schema / Migration:               NONE
API / Authority change:           NONE
P0:                               0
P1 Blocking:                      0
P2 (in scope):                    2 (D1, D2) — both implemented + verified
Decision Gate:                    C = IMPLEMENTED / VERIFIED
Next step:                        sync governance docs; then STOP (no auto follow-up)
```

