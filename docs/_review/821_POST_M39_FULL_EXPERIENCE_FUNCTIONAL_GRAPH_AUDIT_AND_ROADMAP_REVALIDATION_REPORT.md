# 821 — POST-M39 FULL EXPERIENCE / FUNCTIONAL GRAPH AUDIT AND ROADMAP REVALIDATION REPORT

> 依据：《VISNDT Trae Execution Instruction V3.3.1》（POST-M39 PRE-DEVELOPMENT AUDIT STANDARD）
> 任务类型：Existing Evidence Reconciliation + Full Experience/Functional Graph Audit + Frontend↔Backend Capability Mapping + Coverage Gap Analysis + Productization Roadmap Revalidation
> 报告路径：`F:\Desktop\VISNDT\docs\_review\821_POST_M39_FULL_EXPERIENCE_FUNCTIONAL_GRAPH_AUDIT_AND_ROADMAP_REVALIDATION_REPORT.md`
> 状态：AUDITED / NON-DEVELOPMENT / REPORT ONLY（未实施任何开发）

---

## 1. Executive Summary

本报告在 M39 已关闭、817–821 复线已关闭、P2 已关闭的既有基线上，对 VISNDT 平台做了**全体验/功能图谱审计**：

- **既有证据核对**：复用 820 真实浏览器 UX 报告（BUYER/SUPPLIER/ADMIN 三角色核心流程、10 个 Admin 域、375px 移动端），作为 EVIDENCE AVAILABLE 基线；
- **全页面 Universe**：提取 Web 公共 / Buyer / Supplier、Admin 运营域全部真实路由与导航入口；
- **前后端能力映射**：以 API 41 个模块 / 48 个控制器为后端能力面，对照前端路由/页面动作；
- **覆盖/缺口分类**：区分 VERIFIED / PARTIALLY VERIFIED / UNVERIFIED / FAILED / N/A；
- **路线图再验证**：对原 STEP 0–9/FINAL 逐项给出 KEEP/MOVE/MERGE/SPLIT/GATE/DEFER 决策，并给出推荐路线图与 First Authorized Work Package（仅规划，不实施）。

**总体结论：PASS（AUDITED）。** 既有核心闭环证据可信，未发现 P0/P1 阻断性缺陷；存在若干覆盖缺口与 UX-1/UX-3 待人工复核项（P3 / UNVERIFIED）。本任务不做任何开发。

---

## 2. Repository Verification

| 项 | 结果 |
| --- | --- |
| Repository Root | `F:/Desktop/VISNDT`（`git rev-parse --show-toplevel`）✅ |
| Code Root | `F:/Desktop/VISNDT/VISNDT`（apps/{web,admin,api} + database + packages）✅ |
| Branch | `main` ✅ |
| Working Tree | 存在 `VISNDT/docs/_review` → 根 `docs/_review` 的报告迁移（git D/?? 成对）；`database/_ux_verify` 受控证据 untracked。**此迁移为新近状态，须纳入治理文档同步。** |

---

## 3. Code Root 确认

代码根 `F:\Desktop\VISNDT\VISNDT` 真实结构：

- `apps/web`：Next.js App Router（前端 `src/app` 含 21 个顶级页面域）
- `apps/admin`：React+Vite+React Router（后台运营）
- `apps/api`：NestJS（41 个模块目录，48 个 controller）
- `database`：Prisma + fixtures + `_ux_verify` 受控证据
- `packages`：共享包
- `docs/project-management`：PROJECT_STATUS / ROADMAP / MODULE_COMPLETION_MATRIX

---

## 4. Branch / Working Tree 状态

详见 §2。工作树含报告迁移与受控证据目录，均非业务代码改动。**无源码/schema/API 变更。** 保持 `Code = Runtime = Doc = Arch = Roadmap = Progress` 一致原则。

---

## 5. M39 / 817–821 / P2 Baseline

| 项 | 已关闭基线 |
| --- | --- |
| M39 | CLOSED |
| 811/812/813/814/816/817/818 | CLOSED / VERIFIED 各任务状态（见既有快照） |
| 819 / 820 / 821 + P2 | FUNCTIONALLY COMPLETE + VERIFIED + DOCUMENTED + CLOSED（820=UX 验证报告） |

---

## 6. Existing Browser Evidence Reconciliation（与 820 对齐）

820 报告声明且本次核对一致的已验证浏览器范围：

- BUYER：Login→Workspace；Search→Result；Product Detail→Supplier Context；Knowledge→Solution；Demand Create→Save；Demand Publish→Demand ID（VIS-DEM-20260904-3928937643）
- SUPPLIER：Login→Supplier Dashboard；Dashboard→Overview；My Products→Create→Save Draft→Submit Review；Edit→Save；Second SupplierProduct→Create
- ADMIN：Login→Operations Center；Dashboard→Stats/Todo；Product List→Load；≥9 个运营域→Load；Product Detail→Open
- Mobile：375px（SupplierProduct List / Supplier Dashboard / Admin Product List）PASS

---

## 7. Evidence Coverage Matrix

| 维度 | Existing (820) | New (821) | 覆盖 |
| --- | --- | --- | --- |
| Buyer 核心流 | Login/Search/Product/Knowledge/Solution/Demand Create+Publish | — | PARTIAL（需求后续匹配/RFQ/Offer 未走通） |
| Supplier 核心流 | Login/Dashboard/Product CRUD/Submit/Edit | — | PARTIAL（Review→Publish 由 Admin，R/Offer 提交未走通） |
| Admin 列表 | ≥9 域 Load + Product Detail | — | PARTIAL（各域 Create/Edit/Delete/Status 未逐项点走） |
| Mobile | 375（3 页面） | —（768/1024/1440 未测，环境受限） | PARTIAL |
| API Contract 前后端映射 | 未系统化 | 41 模块静态对账 | FULL（静态）/ 运行未复验 |
| Lifecycle | SupplierProduct 局部 | SupplierProduct 全状态机静态 | PARTIAL |
| Permission/RBAC 边界 | 沿用 M39 既有 | 静态核对 | PARTIAL |

---

## 8. Full Page Universe

来源：`apps/web/src/app`（App Router）、`PublicHeader`(PLATFORM_LAYERS)、`WorkspaceSidebar`(NAV_CONFIG)、`apps/admin/router/index.tsx`、AdminLayout 菜单。

### 9. Public Pages（游客可见）
`/`、`/search`、`/categories`、`/products`、`/products/compare`、`/products/[id]`、`/solutions`、`/knowledge-base`、`/knowledge/[slug]`（知识中心）、`/suppliers`、`/supplier-models`、`/tags`、`/articles`、`/about`、`/business`、`/insights`、`/register`、`/login`

### 10. Buyer Pages（workspaceRole=BUYER）
`/dashboard/buyer`、`/workspace`、`/workspace/demands`(+`/create`、`/[id]`、`/[id]/edit`)、`/workspace/rfqs`、`/workspace/matches`、`/workspace/evaluations`、`/workspace/notifications`、`/workspace/settings`

### 11. Supplier Pages（workspaceRole=SUPPLIER）
`/dashboard/supplier`、`/workspace/supplier`（重定向 dash）、`/workspace/supplier/rfqs`、`/responses`、`/offers`、`/inquiries`、`/opportunities`、`/runtime`、`/products`、`/profile`、`/members`、`/display`、`/workspace/notifications`

### 12. Admin Pages
`/home`、`/operation-center`、`/analytics`、`/business-analytics`、`/monitoring`、`/audit-intelligence`、`/products`(+create/edit/detail/media)、`/demands`(+detail/edit/matches)、`/matching`、`/users`(+create/edit/detail)、`/organizations`(+create/edit/detail)、`/notifications`(+detail)、`/rfqs`(+create/detail)、`/rfq-responses/[id]`、`/offers`(+detail)、`/supplier-products`(+create/detail)、`/inquiries`(+detail)、`/parameter-groups`(+create/edit/detail)、`/parameter-definitions`(+create/edit/detail)、`/product-categories`(+create/edit)、`/files/orphans`、`/audit-logs`、`/content`(+create/detail/tags)、`/content/tags`，及 router 扩展的 AI 数据准备/知识库/媒体/知识映射等域路由。侧栏分组：工作台/业务中心/能力主数据/合作方管理/内容与知识库/数据与监控/系统管理。

---

## 13. Role × Page Matrix

| Page | Public | Buyer | Supplier | Admin | Existing Evidence | New Verification | Coverage |
| --- | ---: | ----: | -------: | ----: | ----------------- | ---------------- | -------- |
| /search | ✔ | – | – | – | ✔(820) | – | FULL |
| /products 列表 | ✔ | – | – | – | ✔(820) | – | FULL |
| /products/[id] 详情 | ✔ | – | – | – | ✔(820) | – | FULL |
| /solutions, /knowledge-base | ✔ | – | – | – | ✔(820) | – | FULL |
| /demands 创建/发布 | – | ✔ | – | – | ✔(820) | – | FULL |
| /workspace/supplier/products | – | – | ✔ | – | ✔(820) | – | FULL |
| Admin /products 列表+详情 | – | – | – | ✔ | ✔(820) | – | FULL |
| Admin 其余运营域列表 | – | – | – | ✔ | ✔(820) | – | FULL(Load) |
| Admin 各域 Create/Edit/Delete/Status | – | – | – | ✔ | 未逐项 | – | PARTIAL |
| Buyer 匹配/RFQ/Offer 串联 | – | ✔ | – | – | 未走通 | – | UNVERIFIED |
| Supplier Review→Publish 闭环 | – | – | ✔ | ✔ | 未走通 | – | UNVERIFIED |
| 移动端 768/1024/1440 | ✔ | ✔ | ✔ | ✔ | 仅375 | – | UNVERIFIED |

---

## 14. Navigation Graph

- PublicHeader 平台四层：发现(统一检索/能力分类/能力型号·供应商) → 评估(检测产品/产品对比) → 技术内容(解决方案/知识中心) → 连接(发布检测需求/商务合作)；桌面 mega-panel + 移动抽屉。
- Buyer Sidebar：仪表盘/我的需求/询价请求/匹配结果/我的评估/通知中心/设置。
- Supplier Sidebar：仪表盘/RFQ机会/我的响应/我的报价/收到的询价/商机/运行时能力/我的产品/企业资料/组织成员/通知中心/能力展示。
- Admin Sidebar：见 §12 分组与叶子路由 key 映射（含深层链接自动展开）。
- 导航完整性：所有 Header/Sidebar 目标路由均已解析到真实页面（除未来域路由 UI 未逐一渲染，见 §31–§34）。

---

## 15. Action Inventory（真实存在的动作）

逐页扫描（Create/View/Edit/Delete/Search/Filter/Sort/Pagination/Save/Cancel/Submit/Approve/Reject/Publish/Unpublish/Match/Inquiry/Connect/Request/Respond/Upload/Download/Export/Association/Status/Link）：

- Buyer 需求：创建需求、编辑、发布（Draft→Published）、查看详情、返回列表。
- Supplier 型号：新增型号、挂靠平台能力、搜索/状态筛选、编辑、提交审核（Draft→Submitted）。
- Admin 域：Search / Filter / Status 筛选、新建、详情、编辑、删除（受引用保护，如 SupplierProduct 受 Offer 保护）、Publish/Approve/Reject（SupplierProduct 生命周期）。
- 未验证动作：Upload/Download/Export、各域 Approve/Reject/Status 逐项、匹配 May be purchase（主要配置类操作）→ 见 §32 Missing Actions。

---

## 16. Action → Destination Map（抽样）

| Role | Page | Action | Destination | Route/API | 判定 |
| --- | --- | --- | --- | --- | --- |
| Buyer | works/demands | 创建需求 | /workspace/demands/create | `router.push` | VALID |
| Buyer | demand/[id] | 编辑 | /workspace/demands/[id]/edit | `router.push` | VALID |
| Buyer | Header | 检索 | /search?q=.. | GlobalSearchBar(无类型) | VALID |
| Supplier | products | 新增型号 | 打开面板→保存 | `POST supplier-products`(self-service) | VALID |
| Supplier | products | 提交审核 | 状态 Submitted | `POST .../:id/submit` | VALID |
| Admin | products | 查看 | /products/[id] | `GET /admin/products/:id` | VALID |
| Admin | supplier-product | 生命周期 | Submit/Review/Approve/Reject/Publish | `POST .../:id/{..}` | VALID |

---

## 17. Frontend ↔ Backend Capability Matrix（静态对账）

| Role | Page | Action | Route | API(Controller) | 判定 |
| --- | --- | --- | --- | --- | --- |
| Buyer | works/demands | 创建/发布 | /workspace/demands/* | demands.controller | ALIGNED |
| Buyer | /search | 检索 | /search?q= | search.controller / capabilities.controller | ALIGNED |
| Supplier | /supplier/products | 型号 CRUD/submit | /workspace/supplier/products | supplier-products-self-service.controller | ALIGNED |
| Admin | /supplier-products | 治理生命周期 | /editingSupplierProduct | supplier-products.controller(admin) | ALIGNED |
| Public | /products | 浏览 | /products | products.controller | ALIGNED |
| Public/知识 | /knowledge-base | 浏览 | /knowledge-base | knowledge-public/ knowledge.controller | ALIGNED |
| Public | /solutions | 浏览 | /solutions | conclusions（既有） | ALIGNED |
| Admin | /users,/organizations | 管理 | /users /organizations | users/organizations.controller | ALIGNED |
| 角色 | Inquiry/Offer/RFQ 串联 | 前端动作→API | /workspace/* | rfqs/offers/inquiries.controller | PARTIAL（前端→API 大多对齐；全串接未运行复验） |

> 后端 41 模块/48 控制器构成能力面；逐端点的 Guard 权限（JwtAuthGuard/RolesGuard/OrgScoped/SelfServiceGuard）抽取代表性子集（auth、supplier-products、self-service、产品/需求/知识），其余标「静态命名对账，权限未逐点复验」。以 M39/既有关闭证据填充，不做运行复验。

---

## 18. API → Controller → Service → Model Mapping（代表性子集）

| 域 | Controller | Service | Prisma Model | 状态字段 |
| --- | --- | --- | --- | --- |
| SupplierProduct | supplier-products(.self-service).controller | supplier-products.service | SupplierProduct | status: DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED; organizationId 服务端派生 |
| Demand | demands/admin-demand | demands.service | Demand | status（既有 M39 证据，未复验） |
| RFQ | rfqs/admin-* | rfqs.service | RFQ / RFQResponse | status（既有，未复验） |
| Offer | offers | offers.service | Offer | status（既有，未复验） |
| Inquiry/Contact | inquiries/contact-routing/supplier-contacts | — | Inquiry/Connection | received-/status（既有，未复验） |

---

## 19. Permission / Ownership Mapping

- SupplierProduct：**服务端**由认证用户 `organizationId` 派生归属（`supplier-products.service.createDraft`），并受 `SupplierSelfServiceGuard`（认证+属于当前组织+组织角色 SUPPLIER+`Organization.supplierProductManagementEnabled`）约束。Admin 治理走 `JwtAuthGuard+RolesGuard(Role.ADMIN)`。→ **不依赖客户端传入 ownerId/organizationId/supplierId 作为最终依据** ✅
- Demand：Buyer 组织范围（既有 M39 组织隔离证据）。
- 其他域权限 Guard 类别：以静态名义对账（RolesGuard/OrgScoped），**逐点未在本会话复验**（run-time 环境受限），归 PARTIAL。

---

## 20. Lifecycle Matrix

| Entity | 状态流 | 动作→API | 判定 |
| --- | --- | --- | --- |
| SupplierProduct | DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED | create→submit→review→approve→reject→publish | ALIGNED（静态+820 局部验证） |
| Demand | Draft→Published（→Match/RFQ/…) | create→publish（既有） | PARTIAL（后续串联未走通） |
| RFQ/RFQResponse | 既有 M39 状态机 | 既有端点 | PARTIAL |
| Offer | 既有 M39 状态机 | 既有端点 | PARTIAL |
| Inquiry/Connection | 既有 M39 状态机 | 既有端点 | PARTIAL |

> UI State = API State = DB State 的一致性：本次仅能确认 SupplierProduct（820 + 静态状态机）；其余以既有 M39 关闭证据为准，标记 PARTIAL/UNVERIFIED，不虚构。

---

## 21. Business Flow Graph

- Public：Search→Product→Detail→Knowledge/Solution→Connection ✅（820）
- Buyer：Demand→Matching→Product→RFQ→Response→Offer/Decision→Workspace ⚠️ 前段 OK，**RFQ→Offer 串联未走通（UNVERIFIED）**
- Supplier：SupplierProduct Create→Edit→Submit→**Review→Publish（Admin 环节未走通）** ⚠️
- Admin：Management→List→Detail→**Review→Approve/Reject→Publish** ⚠️ 未逐项点走

---

## 22. Public Discovery Authority Audit

- 主发现权威 = Product（Platform Product = WHAT）✅；SupplierProduct 为 WHICH MODEL 支持信号，不作独立 Product/SEO/Marketplace/Catalog 权威 ✅（架构约束保持）。
- /search 为统一发现权威，Header 仅入口，无类型二次权威 ✅。

---

## 23. Search Reachability

- Header → /search?q=（无类型参数）→ Result → Product Detail → Related（SupplierContext）
- 已覆盖：keyword→/search→product detail（820）。未覆盖：suggestion 点击/Enter/back-forward 全场景（820 未测全）。

---

## 24. SEO Reachability（静态）

- 目标：Product 为主公开发现对象；Route→Canonical→Metadata→Breadcrumb→Structured Data→Internal Link→Sitemap。
- 审计：仅静态识别基础设施存在（Next metadata/App Router）；**详细 SEO 全套未逐一审计（UNVERIFIED）**。供路线图 STEP 8 使用。

---

## 25. Chinese Localization Audit

- 现状：Web 公共/工作区界面为中文（Header/Sidebar/表单/按钮/状态均中文）✅；Admin AntD 菜单为中文分组✅。
- 发现（P3，非阻断）：SUPPLIER 新增/编辑型号表单 6 个必填文本框**无可见中文 label**（仅占位）——可访问性与中文术语一致性改进项。
- 其余扫描（Toast/Error/Validation/Empty/Confirm/Tooltip/Pagination）未全量逐页面复核，归 PARTIAL。

---

## 26. UI Design System Audit（Audit Only）

- Web 与 Admin 使用不同组件体系：Web=Tailwind 自定义（工业发现主题，primary→industrial-cyan），Admin=AntD。色彩/字号/间距/按钮/表单/表格/弹窗/Tabs 两套并存，**未统一**——此为架构约束允许的双端设计（非缺陷），但作为重建需求输入。
- 本阶段不实施重构。

---

## 27. Browser Evidence

- Existing：820 报告真实浏览器证据（BUYER/SUPPLIER/ADMIN 核心流程），磁盘证据存于 `database/_ux_verify/{buyer,supplier,admin}`（含 PNG 截图）。
- New（本会话）：启动真实浏览器、BUYER 登录成功（`/dashboard`）、导航 create 页后因宿主内存耗尽 Web dev server OOM，无法完成 UX-1/UX-3 复核与移动端补齐。→ **见 §0.5 PRE-EXISTING ENVIRONMENTAL EVENT 处理，New Evidence 受限。**

---

## 28. Mobile Evidence

- Existing：375px → Supplier 我的产品 / Supplier Dashboard / Admin 产品列表，PASS。
- **768 / 1024 / 1440：未测（环境受限）→ UNVERIFIED。** 不应据此推断 Responsive FULL PASS。

---

## 29. UX-1 / UX-2 / UX-3 Recheck

| ID | 项 | 类型 | 本次复核 | 状态 |
| --- | --- | --- | --- | --- |
| UX-1 | Demand 分类/预算详情未持久化显示 | 待人工复核 | 环境受限未能人工重做 | UNVERIFIED / P3 |
| UX-2 | SupplierProduct 表单缺 Label | 可访问性 | 静态确认仍存在 | VERIFIED(P3) / 待修 |
| UX-3 | Admin Product Search 未见过滤 | 待人工复核 | 环境受限未能人工重做 | UNVERIFIED / P3 |

> 仍不得升级为系统缺陷，除非新的人工/运行证据排除「自动化注入未触发受控组件 onChange」假设。

---

## 30. Regression

- 依据既有 819/820/821(P2)+M39 关闭时阶段构建/typecheck 证据（API/Web/Admin）通过。
- **本会话因宿主内存耗尽（OOM）未重跑 typecheck/build**，诚实标注为「基于既有已完成构建证据 / 本次环境受限未重跑」。已知 pre-existing `knowledge-base/[slug]` RelatedProductItem.status 类型项为 NON-BLOCKING，未证实为本任务回归。

---

## 31. Missing Pages

- Buyer：匹配结果详情/RFQ 下发→响应查看等串联页（依赖未走通的流程）。
- Supplier：Review→Publish 全屏审核页体验；Offer 提交闭环页。
- Admin：各域 Create/Edit/Delete 全表单页（存在路由，未逐项运行渲染）。
- Mobile：全角色 768/1024/1440 视口代表性页。

## 32. Missing Actions

- Upload / Download / Export 类动作（媒体/文件域）未运行验证。
- Admin 各域 Approve/Reject/Publish/Status 切换动作未逐项点走。
- Search suggestion 点击、Enter、back/forward 场景未全测。

## 33. Dead Actions
- 未发现明确指向不存在目标/无 API 的「死动作」。

## 34. Broken Navigation
- 未发现 Header/Sidebar 指向无页面路由的断链（静态对账一致）。运行级待移动端/重启后复核。

## 35. Orphan Pages
- 未发现无入口的可达孤儿页面；存在「future 域」路由，但页面可达性正常。

## 36. Orphan APIs
- 后端 41 模块均有前端对应域或平台面；批量/分析/AI 类（ai/analytics/embedding/semantic 等）待独立核对其前端消费面（部分可能为预留/内部）。

## 37. Contract Gaps
- 前端页面动作与后端端点静态大面积对齐；**逐端点响应 DTO 与前端的形状契约未逐点复验**（依赖运行层，环境受限）→ PARTIAL。

## 38. Data Model Gaps
- SupplierProduct 归属（organizationId 服务端派生）已确认一致；其余域 Model 映射为静态命名对账，未做持久化实例核验 → PARTIAL。

## 39. Lifecycle Gaps
- Demand→Match→RFQ→Response→Offer 与 Supplier Review→Publish 两个纵向闭环的**真实运行未走通**是本次最大生命周期覆盖缺口。

## 40. Permission / Security Gaps
- 授权边界沿用 M39 关闭证据；role=workspace 门户隔离在 820 观察到一致。逐端点 Guard 复验依赖运行层，未在本会话完成 → PARTIAL（非 FAILED）。

## 41. Localization Gaps
- SupplierProduct 表单 Label（UX-2）为明确中文术语/可访问性缺口；其余页面中文覆盖良好。

## 42. UI / Design System Gaps
- Web(Tailwind) 与 Admin(AntD) 设计系统双轨并存，需统一属重建阶段输入（现有约束内）。

## 43. Mobile Gaps
- 768/1024/1440 全角色代表性页未测（UNVERIFIED）。

---

## 44. Dependency Graph（重建路线依赖）

```
Capability Mapping → UI Contract → Design/Terminology Freeze → Frontend Foundation
Backend Readiness → Frontend Contract → Page Reconstruction
Information Architecture → Internal Linking → SEO
SupplierProduct Media/Parameter Capability → SupplierProduct Productization
```
- 结论：路线 1、2、3 依赖成立；SupplierProduct 产品化依赖 Media/Parameter 能力前置（STEP 5/6 先于产品化）。

---

## 45. P0 / P1 / P2 / P3

- P0：无 ✅（无主动/已证数据暴露、越权、未授权状态迁移）
- P1：无（未发现阻断性功能缺陷；回归基于既有证据）
- P2：Mobile 768/1024/1440 覆盖缺失；Admin 各域 Status 动作、纵向流程串联未走通 — 属覆盖缺口（进入 Work Package）
- P3：UX-1(NON-BLOCKING/UNVERIFIED-wait-manual)、UX-2(VERIFIED, await remediation)、UX-3(UNVERIFIED-wait-manual)

## 46. PRE-EXISTING / NEW

- PRE-EXISTING：UX-1/UX-2/UX-3（继承 820）；`knowledge-base/[slug]` type 项；宿主内存 OOM（复发仅本次会话复现于 Web：3000，故记为环境事件 + 重建阶段需规避大 dev-server 并行）
- NEW：Admin/Web 报告迁移（docs/_review 从代码目录迁至仓库根）为治理层新增状态。

## 47. BLOCKING / NON-BLOCKING

- BLOCKING：无（不影响 M39 关闭保留状态）。
- NON-BLOCKING：全部识别项均为 NON-BLOCKING（P2/P3）。

---

## 48. Current Post-M39 State

- M39=CLOSED；811–821/P2 状态保留；无开发被触发。
- 能力/页面/权限/生命周期静态 State 与关闭基线上大体一致；运行层受环境限制未重跑。

## 49. Original Roadmap Review（候选路线逐项决策）

原路线：STEP0 基线→1 能力映射→2 UI/Design/术语冻结→3 前端重建基础→4 Web+Admin 逐页重建→5 Media→6 参数自助→7 Search 增强→8 SEO 增强→9 全真实浏览器验证→FINAL。

| STEP | 决策 | 理由 |
| --- | --- | --- |
| 0 | KEEP | 本次审计即 Baseline+Evidence Reconciliation，有效 |
| 1 | KEEP→GATE | 能力映射需在重建前产出 UI Contract 冻结（§44 依赖） |
| 2 | KEEP | Design System/Terminology Freeze 为重建前置门 |
| 3 | KEEP | 重建基础仍需要 |
| 4 | SPLIT | 应拆为依赖感知的分批（页面重建 Batch），避免一次性 |
| 5 | KEEP | SupplierProduct Media 能力在页面重建后 |
| 6 | KEEP | 参数自助在 Media 后 |
| 7 | DEFER | Search 增强仅当前端重建稳定后；且不得破坏 /search 单一权威 |
| 8 | DEFER | SEO 增强依赖 IA/内部链接固化（§44 依赖） |
| 9 | GATE→SPLIT | 全量验证改为 Progressive Browser Gates + Final Full-Role Audit |

## 50. KEEP / MOVE / MERGE / SPLIT / GATE / DEFER 决策

- KEEP：STEP0, STEP2, STEP3, STEP5, STEP6
- SPLIT：STEP4（页面重建分批）, STEP9（渐进 Browser Gate）
- GATE：STEP1（映射→UI Contract 门）, STEP2 视为门级
- DEFER：STEP7（Search）, STEP8（SEO）
- MOVE/MERGE：STEP2 冻结与 STEP1 契约件 MERGE 为同一前置门；无纯 MOVE

## 51. Recommended Post-M39 Roadmap（候选——不经本次审计不可直接执行每一实施步）

```
STEP 0  Post-M39 Baseline + Evidence Reconciliation（本次已执行=V3.3.1）
   ↓
STEP 1  Full Experience Graph + Frontend/Backend Capability Mapping → UI Contract
   ↓
STEP 2  Gap Closure Planning + Contract/IA/Design/Terminology Freeze（Gate）
   ↓
STEP 3  Frontend Reconstruction Foundation
   ↓
STEP 4  Dependency-Aware Page-by-Page Reconstruction（分批 + 每批 Browser Gate）
   ↓
STEP 5  SupplierProduct Media
   ↓
STEP 6  SupplierProduct Parameter Self-Service
   ↓
STEP 7  Search Enhancement（DEFER 至前端稳定）
   ↓
STEP 8  SEO Enhancement（DEFER 至 IA 固化）
   ↓
STEP 9  Progressive Browser Gates + Final Full-Role Browser Audit
   ↓
FINAL CLOSE
```
- 候选，未经独立授权不得启动实施。

## 52. Progressive Browser Gate Plan

- Foundation→Browser Gate；Page-Reconstruction Batch→Browser Gate；Media→Gate；Parameters→Gate；Search→Gate；SEO→Gate；Final Full-Role→Final Gate。
- 各 Gate 必要性可由对应 STEP 的审计证据论证（无必要处可免除并记录）。

## 53. First Authorized Work Package（仅规划，不实施；经授权后方可执行）

- Work Package ID：WP-0（Post-M39 Gap Closure Planning / Contract Freeze）
- Why First：作为重建的契约前置门，产出 UI Contract + Full Page Inventory + Capability Mapping 固化件，供 STEP3/4 依存。
- Blocking Findings：无（本阶段非功能缺陷为 Blocking）。
- Dependencies：Capability Mapping（START with code）
- Included：Page Universe × Role × Action 固化、Frontend↔Backend Contract 登记、Design/Terminology Freeze 基线、Progressive Browser Gate 定义。
- Excluded：任何 UI 重建、后端重构、API/SEO/Search 增强、中文化实施、schema 变更。
- Expected API：无新增（只契约化既有）；Expected Data：复用既有能力/受控数据。
- Expected Browser Gate：WP-0 完成即过「契约 Gate」；Expected Mobile Gate：契约含 375/768/1024/1440 验收基线。
- Regression：无代码变更；Documentation：同步 STATUS/ROADMAP/MATRIX。
- Completion Criteria：契约冻结文档 + 能力矩阵 + Gate 定义签署。
- Expansion Gate：发现超出契约范围即 STOP 并回归记录，不扩实现。
- STOP：本 Work Package 仅 Planning Gate，不实施，冻结为止。

## 54. Future Candidates
SupplierProduct Media；参数自助；Search 增强；SEO 增强；移动端全视口补齐；UX-1/UX-3 人工复核（专用任务）；中文术语一致性修正；Web/Admin 设计系统统一。AI/LLM、Marketplace、Commerce 仍属 OUT-OF-SCOPE（约束冻结）。

---

## 55. Final Decision

**PASS（AUDITED / CONDITIONAL PASS）**

- 判定：既有核心流程/Browser/Mobile 证据可信（820）；静态图谱与前后端映射总体对齐；无 P0/P1 阻断。
- 条件（CONDITION PASS 之因）：若干运行层补强（UX-1/UX-3 人工复核、移动端 768/1024/1440、全生命周期纵向串联、Admin 逐动作）因宿主内存 OOM（既有环境事件复发）未在本会话完成，记为 UNVERIFIED 而非 FAILED，纳入 First Authorized Work Package 与其他候选。
- **PASS ≠ FULL COVERAGE；Existing UX PASS ≠ Full Experience Audit PASS。**

## 56. STOP

本任务为 **AUDIT ONLY**，未做任何实现/重构/后端/API/SEO/中文化/schema 改动；未自动触发后续任务。是否发起 WP-0 或补强验证任务需独立授权。

---

## Appendix — Evidence Index

- Existing runtime evidence：`F:\Desktop\VISNDT\VISNDT\database\_ux_verify\{buyer,supplier,admin}`（820 截图）
- Existing report：`F:\Desktop\VISNDT\docs\_review\820_Post_Close_Full_Runtime_UX_Verification_Report.md`
- This report：`F:\Desktop\VISNDT\docs\_review\821_POST_M39_FULL_EXPERIENCE_FUNCTIONAL_GRAPH_AUDIT_AND_ROADMAP_REVALIDATION_REPORT.md`

## Sync Note

治理文档同步项（仅状态/说明性同步，非实现）：docs 报告迁移状态、821 审计状态、UX-1/UX-3 待复核项。待 820/821 状态纳入 PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX。