# 828 — POST-M39 · WP-3A.2 · Search + Categories + Product List Reconstruction 报告

> 执行指令：V3.3.6（FROZEN / POST-M39 PRODUCTIZATION）
> 工作包：WP-3A.2 · PUBLIC SEARCH + CATEGORIES + PRODUCT LIST RECONSTRUCTION
> 前置：WP-3A.1（827 · PASS · CLOSED）
> 仓库根目录：`F:\Desktop\VISNDT` ｜ 代码根目录：`F:\Desktop\VISNDT\VISNDT`
> 分支：`main` ｜ HEAD：`8bba999`
> 报告版本：828（`CURRENT_MAX_REVIEW_ID + 1`）

---

## 1. Executive Summary

WP-3A.2 目标为对 `/search`、`/categories`、`/products` 三个公共发现页面做**表现层产品化**（导航/检索/筛选/排序/分页/卡片/加载/空/错误/响应式/可访问性），不修改后端、Schema、API 契约、检索 Authority 与排序算法。

完成情况：

- `/search`：既有 **Unified Search** 表现层即符合 824/826/827 契约（Product = Primary Authority、`/search?q=` URL、SupplierProduct 仅作 supporting model context），无需重构（遵守「现有成果保护 / 不得重复已成形工作」）；本轮以真实有头浏览器完成交互闭环验证。
- `/categories`：Category → `/products?categoryId=` 导航闭环验证；修复 375 视口下分类卡技术路径文本横向溢出（`truncate`）。
- `/products`：列表/筛选/排序/分页/卡片/加载/空/错误全部基于现有 API 验证；移动端筛选抽屉收敛为复用 Foundation `Drawer`（消除自建重复抽屉）；补齐筛选排序 select/input 的 a11y `aria-label`。
- 真实有头 Chrome（可见）跨 1440/1024/768/375 四断点 **Browser + Mobile Gate = 25/25 PASS**，无横向溢出、无新增 console error。
- 回归：Web `tsc --noEmit` **exit 0**；`next build` 被环境网络阻断（`next/font` 无法访问 Google Fonts，ETIMEDOUT）——**非本轮代码回归**，详见 §25/§26。

关键判断（Final Decision）：

> **CONDITIONAL PASS**（非 PASS）。全部 WP-3A.2 前端功能/浏览器/移动/可访问性门槛通过，无后端/Schema/API 变更；但存在 **1 项 NEW P0 安全发现**（运行中 API 容器在公共 `GET /products` 返回 `createdBy.passwordHash`，属**部署陈旧**——源码头已通过 `PUBLIC_USER_SELECT` 正确剔除）与本机 `next build` 字体网络阻断两项非本轮引入的收尾依赖，见 §27 与 §32。

---

## 2. Repository Verification

| 项 | 结果 |
| --- | --- |
| `git rev-parse --show-toplevel` | `F:/Desktop/VISNDT` ✅ |
| `git branch --show-current` | `main` ✅ |
| `git rev-parse --short HEAD` | `8bba999` ✅ |
| 代码根 | `F:\Desktop\VISNDT\VISNDT` 存在 ✅ |
| Review 目录 | `F:\Desktop\VISNDT\docs\_review`（非代码子目录）✅ |

`git status --short`：受控工作区变化，无冲突；本轮相关文件集中在 `apps/web`。

---

## 3. Baseline 827 / 826 / 824

- **824 / WP-1 Productization Contract**：Page Contract、Navigation Contract、Action Contract、Search Contract、Product Authority、Design System、Component Registry、Responsive Contract、Browser Gate 均已冻结。
- **826 / WP-2 Frontend Reconstruction Foundation**：Design Tokens + Foundation primitives（含 `Drawer`）就绪（CONDITIONAL PASS）。
- **827 / WP-3A.1 Public Shell / Home / Navigation**：**PASS / CLOSED**（`PublicHeader` 四层平台分组 mega + Home Section + Header 统一检索 + Browser Gate 30/30）——本轮**不重复** 827 已完成的 Header/Home 重构。

---

## 4. Scope Verification

- **Included**：仅 `apps/web` 中 `/search`、`/categories`、`/products` 及直接相关的公共发现组件、检索结果/分类/产品列表/卡片/筛选/排序/分页/加载/空/错误/响应式/可访问性表现层。
- **Excluded（未触碰）**：Product Detail、Knowledge、Solution、Supplier、Buyer、SupplierProduct、Admin、Demand、Matching、RFQ、RFQResponse、Offer、Inquiry、Search Backend/Algorithm/Ranking/Authority、SEO、Schema、API Contract、Business Logic。
- **无新增**：无 NOTE 检索系统/检索 Authority/产品 Authority/SupplierProduct 检索 Authority。
- 未改动 `apps/api`、`database/prisma`、`packages/*`（仅消费）。

---

## 5. Files Changed

本轮实际代码改动（相对 `8bba999` 的工作区增量，均为**前端表现层**，最小化）：

| File | Change | Reason | Layer |
| --- | --- | --- | --- |
| `apps/web/src/components/products/MobileFilterDrawer.tsx` | 自建 CSS 左抽屉 → 复用 Foundation `Drawer`（`placement="bottom"`），移除约 90 行重复实现 | §21 消除重复 Drawer；一致性 | Frontend/Web |
| `apps/web/src/components/products/ProductFilter.tsx` | 排序 `<select>` 增加 `aria-label="排序方式"` | §22 a11y Accessible Name | Frontend/Web |
| `apps/web/src/components/products/SearchBar.tsx` | 搜索 `<input>` 增加 `aria-label` | §22 a11y Search input semantics | Frontend/Web |
| `apps/web/src/app/categories/page.tsx` | 分类卡 mono 技术路径文本 `shrink-0` → `min-w-0 truncate`；目录查询 `staleTime:0` | §20 修复 375 横向溢出；目录焦点回归刷新 | Frontend/Web |
| `apps/web/src/app/products/page.tsx` | 目录查询 `staleTime:0` | 公共目录焦点回归自动刷新 | Frontend/Web |
| `apps/web/src/app/providers.tsx` | catalog invalidate 改 `refetchType:'all'` | 删除分类残留防御性刷新 | Frontend/Web |

确认：
- **Business Backend Changed？** **NO**
- **Schema Changed？** **NO**
- **API Contract Changed？** **NO**

`/search` 页面（`src/app/search/page.tsx` + `SearchPageContent.tsx`）为既有产品化 Unified Search 表现层，**本轮未改动**（符合 §32 现有成果保护 + §3 不得重复 827 工作）。

---

## 6. Search Reconstruction

`/search` 复用既有 `GlobalSearchBar` + Foundation 原语，Product = Primary Public Discovery Authority、SupplierProduct 折叠为 Product 下 supporting model context（`ProductSupplierContext`），`/search?q=` URL 语义保持。
- 结果区含：Search Result Summary（`共找到 N 条结果`）、Product/Solution/Knowledge 分组、参数 Facet、Engineering Discovery framing、加载更多。
- 无 `/client-search`、`/new-search`、`/search-v2` 等新路由。

---

## 7. Search Interaction

真实浏览器（桌面 1440）：

- 打开 `/search` → 提交搜索 `内窥镜` → URL `?q=内窥镜` + 结果摘要渲染 ✅
- 结果 → 点击 `/products/:id` → 详情（poll 到 pathname `/products/…`）✅
- `history.back()` → 返回 `/search` ✅

---

## 8. Search State

状态机明确区分，无「空白页」表达状态：

- **Initial**：无关键字时渲染 `SearchHero`（首屏能力发现入口），非白屏 ✅
- **Loading**：顶部「正在搜索 …」+ spinner ✅
- **Results**：结果摘要 + 分组结果 ✅
- **Empty**：`SearchEmptyState`（no-results / no-results-type）✅
- **Error**：`ErrorState` + Retry ✅
- 验证：`Loading ≠ Empty ≠ Error` 均有独立 UI。

---

## 9. Categories Reconstruction

`/categories` 为产品索引入口：

- 每个分类卡 → `/products?categoryId=<id>`（保持现有 URL/API 契约）✅
- 分类页面显示 13 个 `categoryId` 链接（设备当前真实分类数据）。
- 语义保持 `Category → Product / Capability`，**无** `Category → SupplierProduct` 独立公共权威。
- 类别描述/技术路径（`<slug> · CAPABILITY`）基于既有 slug 派生，无 mock。

---

## 10. Category → Product Navigation

- 1440：点击分类卡 → `/products?categoryId=05bc4980…` ✅
- 375：点击分类卡 → `/products` + `categoryId=` 参数 ✅
- `history.back()` 可返回分类页 ✅

---

## 11. Product List Reconstruction

`/products` 保持 Product = Primary Object；列表能力均基于现有 API（`GET /products` status=ACTIVE、pageSize=12）：

- 列表：`ProductGrid` 渲染产品卡 ✅
- 筛选：顶栏分类 rail + 侧栏 `ProductFilter`（分类树/参数/排序）+ 移动端抽屉 ✅
- 排序：`sortBy`/`sortOrder`（`createdAt`/`updatedAt`/`name` × asc/desc）✅
- 分页：`Pagination`（`aria-label="分页"`、上一页/下一页）✅
- 卡片 → `/products/:id` ✅
- 加载/空/错误齐备（`isLoading` / `未找到匹配能力` / `ErrorState`）✅

---

## 12. Filter

只使用现有后端支持的筛选能力（分类 `categoryId` + 参数 `pf`），未新增后端 Facet/维度：

- 1440 点击分类 rail → URL 出现 `categoryId=` → 列表刷新 ✅
- 375 / 768 移动端抽屉内选分类 → 「查看结果」→ URL 出现 `categoryId=` → 列表刷新 ✅（§15 Filter→Query→Request→Result 闭环，规避 M24 类「UI 变但结果不刷」问题）。
- 未发现「UI 期望筛选但后端缺契约」的 CONTRACT GAP。

---

## 13. Sort

仅使用现有真实排序能力（字段白名单：`createdAt`/`updatedAt`/`name`）：

- 1440：UI 排序下拉（React 受控 select，原生 value setter + change/input）→ URL `sortBy=name&sortOrder=asc` → 列表刷新 ✅
- 关系：`UI State → URL State → Backend Query State` 闭环成立。

---

## 14. Pagination

- 组件语义：`Pagination` 带 `aria-label="分页"` + `上一页/下一页/页码/页指示`（code 核查）✅
- 运行时：当前 **ACTIVE 目录仅 4 条**（API `total=4`，单页）→ 分页导航**正确地不渲染**（无误分页）✅
- 说明：多页真实路径因目录数据为单页而**无法以真实数据触发**（受控测试数据不可伪造，且不应注入 >12 条 ONLY 用于触发分页）。组件在多页时渲染 `nav[aria-label="分页"]` 与翻页逻辑经代码核查成立。此列为数据限制性说明（Known Note），**非缺陷**。
- 未发现「UI 分页但后端未支持」的 CONTRACT GAP。

---

## 15. Product Card

- 优先 Reuse → Consolidate：列表使用既有 `ProductGrid`，检索使用既有 `ProductResultCard`，首页/分类入口沿用 827 产物；**未新增重复 `ProductCard`/`HomeProductCard`/`SearchProductCard`/`CategoryProductCard`**。
- 卡片含：图（`primaryMedia`，fileAssetId → 公开下载 URL）、标题（Product Identity/Name）、支撑元数据、状态、Primary CTA（→ `/products/:id`）。
- 未制造 SupplierProduct = 独立主卡。

---

## 16. Loading / Empty / Error

| 页面 | 无数据 | 失败 |
| --- | --- | --- |
| `/search` | `SearchEmptyState` | `ErrorState` + Retry |
| `/products` | `未找到匹配能力` Empty | `ErrorState` |
| `/categories` | 目录空态 | 失败态（ErrorState/回退） |

均非白屏。

---

## 17. Design Token Usage

- 全程使用 826 `packages/design-tokens` 令牌与 Foundation 原语；本轮改动（Drawer、标签、select/input）复用既有 token 类名（`bg-primary`、`text-foreground`、`border-primary`、`shadow-industrial-sm` 等）。
- 未引入大段硬编码 color/spacing/radius/shadow。

---

## 18. Foundation Reuse

- 移动端筛选抽屉复用 Foundation `Drawer`（`MobileFilterDrawer`），由 `Drawer` 统一承载 Dialog 语义 + Escape + 焦点返回 + body 滚动锁定 + Accessible Name。
- 排序下拉、搜索框复用既有组件，仅补 a11y 属性。

---

## 19. Chinese Localization

用户可见内容均为中文：搜索/筛选/排序/结果计数（共找到 N 条）/分页（上一页/下一页）/空（未找到匹配能力）/错误/加载/分类/产品/按钮。内部 API/DTO/Model/Enum/Code 保持英文。

---

## 20. Responsive

真实断点验证，无水平溢出（`hasOverflow=false`）：

- `1440`：search ✅ · products ✅
- `1024`：products ✅
- `768`：products ✅（含移动筛选 Drawer 正常透出 ≥640 抽屉/Dialog）
- `375`：search ✅ · categories ✅（经 `truncate` 修复）· products ✅
- 动作可达性：筛选按钮（`<lg` 显示）、Drawer、卡片可点击均正常。

---

## 21. Accessibility

- Visible Labels / Accessible Name：搜索框 `aria-label`、排序 select `aria-label="排序方式"`（本轮补齐）✅
- Semantic Heading：`<h1>` 产品页「工业检测能力注册表」等存在 ✅
- Keyboard Focus：排序 select 原生可用 ✅
- Drawer Dialog：`role="dialog" aria-modal="true"` + Escape 关闭（768 验证 `Escape 关闭筛选 = true`）✅
- Pagination semantics：`nav[aria-label="分页"]` ✅
- Card link semantics：`<a href="/products/:id">` ✅

---

## 22. Browser Verification

Real headed Chrome（`_ux_browser_helper.mjs` CDP），**Browser + Mobile Gate = 25/25 PASS**：

- `/search`：1440 搜索框存在 ✅；提交→`?q=内窥镜`+结果 ✅；结果→详情→返回 ✅；Search 375 结果刷新 ✅
- `/categories`：1440 分类卡（13 links）✅；选择分类→`/products?categoryId=` ✅；375 分类→产品 ✅
- `/products`：1440 列表渲染与卡片入口 ✅；排序→URL+刷新 ✅；分类筛选→结果刷新 ✅；1024 卡片→详情 ✅；768 分页单页正确隐藏 ✅；768/375 移动 Drawer 打开/底栏/Escape/筛选→结果刷新 ✅
- Console：无新增 console error ✅

---

## 23. Mobile Verification

- 375：search/categories/products 均无横向溢出，分类→产品、筛选→结果刷新（抽屉）通过 ✅
- 768：products 无溢出，移动筛选 Drawer（Foundation bottom sheet）+ Escape + 抽屉内筛选刷新通过 ✅
- Action Reachability / Card Clickability 通过。

---

## 24. API / Runtime Integrity

- 仅使用现有 API 与现有 Product/Category 数据（真实 `total=4` ACTIVE、`13` 分类链接），**无 mock 业务数据**冒充正式结果。
- 后端/Schema/API 契约未变更。
- **⚠️ NEW Security 发现（P0 · 运行期）**：公共 `GET /api/v1/products` 当前运行响应在 `createdBy` 内包含 **`passwordHash`**；而**源码头** `PUBLIC_USER_SELECT`（`apps/api/src/common/projection/user.projection.ts`）已明确只允许 `id,email,name,status,organizationId,createdAt,updatedAt`。结论：**运行中的 API 容器为陈旧部署**，未加载已含安全投影的当前源码。详见 §27。此为本轮验证过程中经「运行时证据 > 代码」发现，非本轮引入，且不改动后端（见 §29）。

---

## 25. Regression

- **Web `tsc --noEmit`**：**exit 0** ✅（代码级类型无回归）
- **Web `next build`**：**环境阻断（非代码回归）**——`layout.tsx` 的 `next/font` 需联网拉取 Google Fonts，本机当前无到 `fonts.googleapis.com` 的网络（Retrying 3/3 → ETIMEDOUT），属此前修复 dev 服务器 `MODULE_NOT_FOUND` 时清空 `.next`（连带清掉字体缓存）所致外部条件，与本轮代码改动无关。开发模式四页面已实测 `200`（gate 期间全部编译通过）。**收尾建议**：恢复网络（或还原字体缓存）后重跑 `pnpm build` 复核（见 §32 条件 2）。
- 共享 package：本轮未改 `packages/*`，无需额外 validation。
- `g-console`：维持 **PRE-EXISTING / NON-BLOCKING / FUTURE CANDIDATE**（826），无证据由本轮引入。

---

## 26. Known Issues

| Issue | 级别 | 状态 |
| --- | --- | --- |
| `g-console`（826 已知） | P2 / Non-blocking | PRE-EXISTING / FUTURE CANDIDATE（维持） |
| 分页多页真实路径因 ACTIVE 目录单页（4 条）无法以真实数据触发 | Note（数据限制） | 非缺陷；组件契约经代码核查成立，多页验证待有 >12 条真实数据时补充 |
| `next build` 字体网络阻断 | Environment | 非代码回归；需网络/缓存后复核 |

---

## 27. New Issues

| ID | Severity | Type | Description | 触发位置/证据 | 影响 | 处置 |
| --- | --- | --- | --- | --- | --- | --- |
| **SEC-828-P0-01** | **P0** | Security / Runtime（部署陈旧） | 运行中 API 容器在**公共** `GET /api/v1/products` 返回 `createdBy.passwordHash`（bcrypt 凭据）。源码头 `PUBLIC_USER_SELECT` 已正确剔除，运行与代码状态不一致（Code State ≠ Runtime State） | `http://localhost:4000/api/v1/products?status=ACTIVE`；`createdBy` keys 含 `passwordHash`；对照 `apps/api/src/common/projection/user.projection.ts` | 公共端点向浏览器透传凭据哈希，违反「Public API 不得含敏感字段 / 安全最终认证」硬约束 | **不改动后端（WP-3A.2 只允许前端）**；结论为**依赖项**：重建/重部署 API 容器以加载已含安全投影的当前源码后复测，需独立授权（后端部署动作）。在容器重部署前，安全认证不得判 PASS |
| ENV-828-E1 | N/A（环境） | Build / Network | `next build` 因 `next/font` 无法访问 Google Fonts（ETIMEDOUT）失败 | `pnpm build`，`layout.tsx` font error | 生产构建在当前环境不可重复 | 恢复网络/字体缓存后重跑复核（收尾条件 2） |

---

## 28. Contract Gaps

- 未发现「UI 期望筛选/排序/分页但后端缺契约」的 CONTRACT GAP。
- 唯一限制为数据侧单页（见 §14），非契约缺失。

---

## 29. Future Candidates

- 无新增未来候选。
- 维持路线外闭包：`g-console`（826）、分页多页补充验证（待真实多页数据）。

---

## 30. WP-3A.2 Completion Criteria

| 项 | 结果 |
| --- | --- |
| `/search` | ✅ |
| `/categories` | ✅ |
| `/products` | ✅ |
| Search Interaction | ✅ |
| Category Navigation | ✅ |
| Product Navigation | ✅ |
| Filter | ✅ |
| Pagination | ✅（单页正确不渲染 + 组件契约） |
| Loading / Empty / Error | ✅ |
| Responsive | ✅（375/768/1024/1440 无溢出） |
| Accessibility | ✅ |
| Real Browser | ✅（headed Chrome） |
| Mobile | ✅ |
| Regression | ✅（typecheck exit 0；build 环境阻断见 §26/§27） |
| Documentation | ✅（本报告 828 + governance 同步） |
| No Backend / Schema / API Contract Change | ✅ |

前端产品化门槛**全部满足**；但「No P0」与「生产构建可重复」两项收尾依赖未完全闭合（§27），故判 **CONDITIONAL PASS**。

---

## 31. WP-3A.3 Readiness

**READY FOR WP-3A.3（Product Detail + Related Discovery Reconstruction：`/products/[id]` + Supplier Model Context + Knowledge + Solution + Related Discovery + Connection Entry）**。**DO NOT START**（须独立授权）。

---

## 32. Final Decision

> **CONDITIONAL PASS**
>
> 依据：Search / Categories / Product List 已产品化，真实有头浏览器跨 1440/1024/768/375 **25/25 PASS**，移动验证全过，无新增前端阻塞问题；后端/Schema/API 契约零变更。但存在两项非本轮引入的收尾依赖，必须在正式关闭前闭合：
>
> 1. **SEC-828-P0-01（Security / 部署陈旧）**：运行中 API 容器在公共 `GET /products` 泄漏 `createdBy.passwordHash`。源码已用 `PUBLIC_USER_SELECT` 剔除，仅需**重建/重部署 API 容器**（后端部署动作，须独立授权）后复测通过，方可判安全认证通过。
> 2. **ENV-828-E1（Build / 网络）**：`next build` 被 `next/font` → Google Fonts 网络 ETIMEDOUT 阻断（非代码回归）；恢复网络/字体缓存后重跑 `pnpm build` 复核。
>
> 若两项闭合且复测通过，即可升级为 **PASS / WP-3A.2 CLOSED**。

---

## 33. STOP

WP-3A.2 执行结束，显式 **STOP**。不自动进入 WP-3A.3 / WP-3B / WP-4 / WP-5A / WP-5B / WP-5C / WP-6 / WP-7 / WP-8。

> 主路线保持：M39 → 824/ WP-1 → 826/ WP-2 → 827/ WP-3A.1 ✅ CLOSED → **828/ WP-3A.2（Search+Categories+Product List，CONDITIONAL PASS）** → WP-3A.3（待独立授权）。