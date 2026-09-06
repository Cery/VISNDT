# 824 — POST-M39 FRONTEND PRODUCTIZATION CONTRACT FREEZE REPORT（前端产品化契约冻结报告）

> 版本/标准：《VISNDT Trae Execution Instruction V3.3.3》（FROZEN / Post-M39 Productization WP-1）
> 任务：Productization Contract Freeze（AUDIT + CONTRACT DEFINITION + FREEZE + DOCUMENT，不重构）
> 核心原则：**先冻结产品化契约，再进行大规模前端重构**。
> 报告路径：`F:\Desktop\VISNDT\docs\_review\824_POST_M39_FRONTEND_PRODUCTIZATION_CONTRACT_FREEZE_REPORT.md`
> 状态：CONTRACT → FREEZE → DOCUMENT → **STOP**

***

## 1. Executive Summary

本任务在 `M39 + 820 + 821 + 822 + 823` 基线上，建立 VISNDT Post-M39 前端产品化的**正式契约**。产物为一份统一描述 **Role → Page → Section → Action → Destination → Route → API → Permission → Data → Lifecycle → UI → Responsive → Terminology → Browser Gate** 的冻结文档，使后续前端重构不再依赖临时判断、页面即兴设计或在开发中反向发现核心业务契约。

**核心产出（本报告所冻结）：**

- **Page Contract Registry**：基于真实路由枚举——Web 60 页、Admin 57 路由（含原生路由清单）。

- **Role × Page × Capability Matrix**（PUBLIC / BUYER / SUPPLIER / ADMIN，区分 Visible/Accessible/Operable/Authorized）。

- **Navigation / Action / Destination Registry**：由真实 Header/Sidebar/Breadcrumb + 页面动作登记，冻结 `Action→Destination`、`Action→API`。

- **Frontend ↔ Backend Contract Registry**：核心端点 + `{success,data,message}` 外壳 + CSRF double-submit cookie 契约（`GET /auth/csrf` → `csrf_token` cookie + `X-CSRF-Token` header）。

- **Permission / Lifecycle / Data Contract**：由 `RolesGuard`（organizationId+userId 成员关系）+ Prisma 枚举状态机继承冻结，不重新定义。

- **四端 IA**（Public/Buyer/Supplier/Admin）：Admin 基于真实菜单（工作台/业务/主数据/合作方/内容/数据监控/系统）。

- **Design System / Component / 中文术语 / Responsive / Browser Gate / Accessibility/Batch/Dependency** 契约。

- **Page Reconstruction Batch Plan**（BATCH A–E）与 **WP-2（Frontend Reconstruction Foundation）** 定义，均不实施。

**总体结论：CONDITIONAL PASS —— Productization Contract 冻结基本完成，可供后续实现引用；少量非阻断契约项存在（见 §35 Gap Register），不影响 WP-2。**

> **本任务不产生业务代码变更；已有既有类型错误** **`knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status`** **按 PRE-EXISTING / NON-BLOCKING 记录，不得顺手修复（§44）。**

***

## 2. Repository Verification

| 项               | 结果                                                              | 命令                                                      |
| --------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Repository Root | `F:/Desktop/VISNDT`                                             | `git rev-parse --show-toplevel` ✅                       |
| Code Root       | `F:\Desktop\VISNDT\VISNDT`                                      | 确认存在 `apps/{web,admin,api}` + `database` + `packages` ✅ |
| Branch          | `main`                                                          | `git branch --show-current` ✅                           |
| HEAD            | `8bba999`                                                       | `git rev-parse --short HEAD` ✅                          |
| Working Tree    | 仅报告迁移 + `database/_ux_verify` 受控证物（untracked）；无源码/schema/API 改动 | `git status` ✅                                          |

## 3. Code Root

代码根 `F:\Desktop\VISNDT\VISNDT` 真实结构：

- `apps/web`：Next.js App Router（公共发现 + Buyer/Supplier 工作区）

- `apps/admin`：React+Vite（React Router + Ant Design）

- `apps/api`：NestJS（\~70 controller 文件，含 admin/\*、self-service、public 分层）

- `database/prisma`：`schema.prisma`（枚举 + 模型）

- `packages/design-tokens` + `packages/design-system`：共享设计 token/组件

- `docs/project-management`：治理文档；`docs/_review`：审查/审计报告

## 4. Branch / Working Tree

- Branch `main`，HEAD `8bba999`。

- 工作树非业务改动仅：报告目录迁移（`VISNDT/docs/_review` → 根 `docs/_review`）+ `_ux_verify` 证物。

- 保持 `Code = Runtime = Doc = Arch = Roadmap = Progress` 一致。

## 5. 820–823 Baseline

| 报告  | 结论                                                                                       | 本任务继承点                                                    |
| --- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 820 | Post-Close Full Runtime UX Verification                                                  | 页面/运行 UX 证据基线                                             |
| 821 | Full Experience Functional Graph                                                         | Page Universe / Capability Mapping                        |
| 822 | Functional Graph Audit + Roadmap Revalidation（CONDITIONAL PASS）                          | 运行缺口清单、路线复验                                               |
| 823 | Core Functional Integrity Closure（**CLOSED / PASS / READY FOR FRONTEND PRODUCTIZATION**） | Buyer 纵向 + Supplier 参与 + Admin 治理 + CSRF 契约 + 授权/契约/持久化证据 |

> **Pre-Development Readiness = READY FOR FRONTEND PRODUCTIZATION**（由 823 已正式判定）。本任务不得重新定义核心实体语义（§2 指令）。

## 6. Productization Readiness

- **Readiness（继承 823）**：READY FOR FRONTEND PRODUCTIZATION。

- **本契约冻结判定**：CONDITIONAL PASS（契约基本完整可用；少许可在 WP-2/后续批次中收敛的非阻断项）。

- 依据指令 §46：无核心语义 / 权限 / API / 页面契约矛盾 ⇒ 非 BLOCKED；存在少量非阻断契约项 ⇒ CONDITIONAL PASS。

***

## 7. Page Contract Registry

**Web（Next.js App Router，真实枚举）：** 共 **60** 页面路由。分段列示（`Route` · `Type` · `Primary Entity`）：

| Route                                                                                                                                                                                                                                                       | Page Type                         | 主实体                                      | 角色             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------- | -------------- |
| `/` `/about` `/business` `/articles(/[slug])` `/insights(/[slug])` `/categories` `/products(/[slug])` `/products/compare` `/supplier-models` `/suppliers/[id]` `/tags/[slug]` `/search` `/solutions(/[slug])` `/knowledge(-base)(/[slug], /domains/[slug])` | Content/Home/Search/List/Detail   | Product / Content / Knowledge / Supplier | PUBLIC         |
| `/login` `/register` `/offline`                                                                                                                                                                                                                             | Auth                              | Auth                                     | PUBLIC         |
| `/dashboard` `/dashboard/buyer` `/dashboard/supplier`                                                                                                                                                                                                       | Dashboard                         | Workspace                                | BUYER/SUPPLIER |
| `/workspace` `/workspace/dashboard`                                                                                                                                                                                                                         | Workspace/Dashboard               | Workspace                                | BUYER/SUPPLIER |
| `/workspace/demands` `/create` `/[id]` `/[id]/edit`                                                                                                                                                                                                         | List/Create/Detail/Edit           | Demand                                   | BUYER          |
| `/workspace/evaluations` `/workspace/matches(/[matchId])`                                                                                                                                                                                                   | List/Detail                       | Evaluation / DemandMatch                 | BUYER          |
| `/workspace/rfqs` `/create` `/[id]`                                                                                                                                                                                                                         | List/Create/Detail                | RFQ                                      | BUYER          |
| `/workspace/notifications` `/workspace/settings`                                                                                                                                                                                                            | List/Settings                     | Notification / Settings                  | BUYER/SUPPLIER |
| `/workspace/supplier` `/display` `/opportunities` `/rfqs(/[id])` `/responses` `/offers(/new, /[id]/edit)`                                                                                                                                                   | Workspace/List/Detail/Create/Edit | RFQ Opportunity / Response / Offer       | SUPPLIER       |
| `/workspace/supplier/products` `/workspace/supplier/runtime(/products/[id]/inquiry-context)`                                                                                                                                                                | List/Workspace                    | SupplierProduct / Runtime                | SUPPLIER       |
| `/workspace/supplier/inquiries(/[id])` `/members` `/profile`                                                                                                                                                                                                | List/Detail/Settings              | Inquiry / Member / Profile               | SUPPLIER       |

**Admin（React Router，真实枚举）：** 共 **57** 路由（不含 `/login`、`/`、`*`）。分组：

- 工作台：`/home`（=OperationCenter，兼容 `/operation-center` 跳转）

- 业务中心：`/demands(/[id], /[id]/edit, /:demandId/matches/:matchId)`、`/rfqs(/create, /[id])`、`/inquiries(/[id])`、`/offers(/[id])`、`/matching`、`/rfq-responses/[id]`

- 能力主数据：`/products(/create, /[id], /[id]/edit, /:productId/media(list/create/edit))`、`/supplier-products(/create, /[id])`、`/product-categories(…)`、`/parameter-groups|definitions(…)`、`/files/orphans`

- 合作方管理：`/users(…)`、`/organizations(…)`

- 内容与知识库：`/content(…)`、`/content/tags(…)`、`/knowledge/domains|categories|entries(…)`、`/product-category-knowledge-mappings(…)`、`/media`

- 数据与监控：`/analytics`、`/business-analytics`、`/monitoring`、`/audit-intelligence`、`/embedding`

- 系统管理：`/notifications(/[id])`、`/audit-logs`

每页均定义了 **Canonical Route / Primary Purpose / Primary Entity / Allowed Role / Primary Entry / Primary Exit**（结构在契约文档中成表，本报告以 §7 路由清单 + §9/§10 注册表为代表体现）。

## 8. Role × Page Matrix

| 角色       | Read(只看)                              | Accessible(可达)           | Operable(可操作)                                | Authorized(授权动作)   |
| -------- | ------------------------------------- | ------------------------ | -------------------------------------------- | ------------------ |
| PUBLIC   | Public 内容页全部可见                        | `/`+Public 路由            | 不操作业务数据                                      | 注册/登录/发起咨询(表单→需登录) |
| BUYER    | 自身 Demand/Match/RFQ/Response/Offer    | `/workspace/**` buyer 侧  | Demand CRUD / Decision(接受匹配) / RFQ / 评审      | 状态动作 + 发起沟通        |
| SUPPLIER | 自身 Opportunity/Response/Offer/Product | `/workspace/supplier/**` | Response/Submit / Offer / SupplierProduct 自助 | 提交/报价/产品提交         |
| ADMIN    | 全部运营/主数据/内容/监控                        | `/admin/*`（=Admin 根）     | 全量增删改 + 治理(审批/发布/下架/驳回)                      | 治理 + 主数据 + 媒体      |

> 区分：PUBLIC 对业务页**可见不可达**（被 RoleGuard/中间件拦截）；BUYER/SUPPLIER 通过 `/workspace/**` 路径隔离；ADMIN 为独立应用（`apps/admin`）根路由，与 Web 分离。

## 9. Navigation Contract

**信息源（真实实现）：** `apps/web/src/components/layout/PublicHeader.tsx`、`WorkspaceSidebar.tsx`、`Apps/admin/src/layouts/AdminLayout.tsx`。

- **PublicHeader**：`discover / evaluate / content / connect` 分组 → `/search` `/categories` `/products` `/solutions` `/register?role=BUYER` 等；认证后显示 `/dashboard` 与用户菜单，未登录显示 `/login` `/register`。

- **WorkspaceSidebar**：按 BUYER/SUPPLIER 枚举菜单（`/workspace/demands`、`/workspace/supplier/rfqs`、`/workspace/supplier/products` 等），按 pathname active 高亮（精配+子路径）。

- **AdminLayout（侧栏）**：7 组 —— 工作台/业务中心/能力主数据/合作方管理/内容与知识库/数据与监控/系统管理；含 breadcrumb 中文映射、子菜单（参数体系、知识库）自动展开。

**Navigation 校验结论：** No Dead Navigation（菜单 href 均有对应路由）、No Unowned Route（每个菜单目标可达）、No Unauthorized Entry（Admin 菜单均在 Admin Layout 内、受 RequireAuth 保护）——除 §35 Gap Register 中个别需复核项外，代表性核验通过。

## 10. Action Contract

**Action Type 分类应用**：Navigation / CRUD / Workflow / Search / Filter / Sort / Pagination / Upload / Download / Association / Status / Business Action。

代表性行动注册表（Role · Page · Action → API）：

| Role     | Page            | Action                                         | Type                | API                                               | <br /> | <br />  | <br /> | <br />  | <br />      |
| -------- | --------------- | ---------------------------------------------- | ------------------- | ------------------------------------------------- | :----- | :------ | :----- | :------ | :---------- |
| BUYER    | Matches         | 接受匹配                                           | Status/Workflow     | `PATCH /demands/{id}/matches/{matchId}`（Decision） | <br /> | <br />  | <br /> | <br />  | <br />      |
| BUYER    | Matches         | 拒绝匹配 / 重新匹配                                    | Status/Workflow     | 同上（reject / rematch）                              | <br /> | <br />  | <br /> | <br />  | <br />      |
| BUYER    | RFQ             | 从匹配创建 RFQ                                      | Workflow            | `POST /rfqs/from-match`                           | <br /> | <br />  | <br /> | <br />  | <br />      |
| BUYER    | RFQ Detail      | 评审 / 状态                                        | Workflow            | `PATCH /rfqs/{id}`、`POST /rfqs/{id}/…`            | <br /> | <br />  | <br /> | <br />  | <br />      |
| SUPPLIER | Opportunity     | 响应 RFQ                                         | Workflow            | `POST /rfq-responses`                             | <br /> | <br />  | <br /> | <br />  | <br />      |
| SUPPLIER | Response        | 提交报价(Offer)                                    | Workflow            | `POST /offers`                                    | <br /> | <br />  | <br /> | <br />  | <br />      |
| SUPPLIER | Product         | 提交/编辑 SupplierProduct 自助                       | Workflow/CRUD       | `POST/PATCH /supplier-products/self-service`（域）   | <br /> | <br />  | <br /> | <br />  | <br />      |
| ADMIN    | SupplierProduct | submit/review/approve/reject/publish/unpublish | Governance/Workflow | \`POST /admin/supplier-products/{id}/submit       | review | approve | reject | publish | unpublish\` |
| ADMIN    | Product         | CRUD + 媒体                                      | CRUD                | `POST/PATCH/DELETE /products…`、`/product-media…`  | <br /> | <br />  | <br /> | <br />  | <br />      |

## 11. Action → Destination Contract

**每条 Action 必须有合法 Destination（Route/Modal/Drawer/API/Download/External）之一；禁止** **`Action→No Destination`，除非显式** **`UI-local state operation`** **并记录结果。**

- 匹配接受 → 结果页/刷新 Match 状态（UI-local + API 成功回执）。

- 「从匹配创建 RFQ」 → 创建成功后导航至 `/workspace/rfqs/{id}`（Destination=Route）。

- 上传/下载（媒体、文件） → Destination=Upload/Download API（`/file-asset`、`/product-media`）。

- Admin 审批动作 → Destination=API + 列表刷新 + 状态徽标变更。

**结论：代表性核验 Action 均落到有效 Destination/API；个别 P2 项见 §35（UI-local 状态回执需前端态规范化）。**

## 12. Frontend ↔ Backend Contract Registry

统一契约外壳（继承 823 验证）：`ApiResponse { success: boolean; data?: T; message?: string }`；错误经全局 ExceptionFilter。CSRF `GET /auth/csrf` → 下发 `csrf_token` cookie；所有变更请求须 `X-CSRF-Token` header 与 `csrf_token` cookie 一致（double-submit）。Authentication=JWT Bearer；Authorization=JwtAuthGuard + RolesGuard（`organizationId`+`userId` 成员关系）。

| 域                        | API                                                                                             | Method                      | Contract Status       | <br />     | <br />                | <br />        |
| ------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------- | --------------------- | :--------- | :-------------------- | :------------ |
| Auth                     | `/auth/register /login /refresh /logout /me /csrf`                                              | POST/POST/POST/POST/GET/GET | FROZEN                | <br />     | <br />                | <br />        |
| Demand                   | `/demands`（+`/:id`、`/mine`、\`/:id/publish                                                       | close                       | rematch               | matches\`） | GET/POST/PATCH/DELETE | FROZEN(KNOWN) |
| DemandMatch              | `/demands/{demandId}/matches(/[matchId])` 决策                                                    | GET/PATCH                   | FROZEN                | <br />     | <br />                | <br />        |
| RFQ                      | `/rfqs`、`/:id`、`/available`、`/mine`、`/from-match`、\`/:id/publish                                | close\`                     | GET/POST/PATCH/DELETE | FROZEN     | <br />                | <br />        |
| RFQResponse              | `/rfqs/{id}/responses`、`/mine`、\`accept                                                         | reject\`                    | GET/POST/PATCH        | FROZEN     | <br />                | <br />        |
| Offer                    | `/offers`、`/:id`、\`submit                                                                       | accept                      | reject                | withdraw\` | GET/POST/PATCH/DELETE | FROZEN        |
| Inquiry                  | `/inquiries`、`/:id`（admin `POST/PATCH/DELETE`）                                                  | GET/POST/PATCH              | KNOWN                 | <br />     | <br />                | <br />        |
| SupplierProduct          | `/supplier-products/self-service`（自助）+ `/admin/supplier-products/*`（治理）                         | POST/GET/PATCH + POST 状态    | FROZEN                | <br />     | <br />                | <br />        |
| Workspace                | `/workspace/**`（buyer/supplier overview、demands、pending、rfq/responses、products、inquiry-context） | GET/POST                    | KNOWN                 | <br />     | <br />                | <br />        |
| Product                  | `/products`、`/:id`、`/:id/media`、参数/分类                                                           | GET/POST/PATCH/DELETE       | FROZEN(KNOWN)         | <br />     | <br />                | <br />        |
| Knowledge/Content/Search | `/knowledge/**`(public/admin)、`/content/**`、`/search`、`/discovery/capabilities`                 | GET/POST/PATCH/DELETE       | KNOWN                 | <br />     | <br />                | <br />        |
| Media/File               | `/file-asset/**`、`/product-media/**`、`/content-media/**`                                        | GET/POST/PATCH/DELETE       | KNOWN                 | <br />     | <br />                | <br />        |

**Contract Status 标注诚实：** `FROZEN`=核心纵向链(823 运行验证)；`KNOWN`=契约明确但非本轮全量运行；`PARTIAL/UNVERIFIED`=（若存在，见 §35）不虚标 FULL VERIFIED。

## 13. API Contract（核心冻结）

代表性冻结（Path/Method/Request//Response/Success·Error Envelope/Auth/CSRF/Permission/Org Scope/Lifecycle Effect）：

| 项                | 值                                                                      | <br /> | <br />                             |
| ---------------- | ---------------------------------------------------------------------- | :----- | :--------------------------------- |
| Envelope         | `{success, data, message}`；错误统一 `{success:false, message, statusCode}` | <br /> | <br />                             |
| Auth             | `Authorization: Bearer <access_token>`（JwtAuthGuard）                   | <br /> | <br />                             |
| CSRF             | 变更请求必带 `X-CSRF-Token` == `csrf_token` cookie（`GET /auth/csrf` 签发）      | <br /> | <br />                             |
| Permission       | RolesGuard（\`@Roles(Role.ADMIN                                         | BUYER  | SUPPLIER)`；`organizationId\`+成员关系） |
| Org Scope        | `organizationId` 由服务端可信上下文注入；对象归属校验（ownership isolation）               | <br /> | <br />                             |
| Lifecycle Effect | 见 §16 Lifecycle Contract                                               | <br /> | <br />                             |

## 14. Data Contract

前端不得创造后端以外的业务实体语义。继承 Prisma 模型绑定：
`Product`（WHAT，平台能力）· `SupplierProduct`（WHICH MODEL，归属 `organizationId`+绑定 `platformProductId`+`modelNumber`）· `Organization/OrganizationMember`（OWNER）· `Offer`（COMMERCIAL）· `Demand` / `DemandMatch` / `RFQ` / `RFQResponse` / `Inquiry`（撮合链）· `Workspace` / `WorkflowEvent` / `Notification` · `Knowledge` / `Solution` / `Category` · `ParameterDefinition` / `SupplierProductParameterValue` / `FileAsset` / `SupplierProductMedia`。

UI Data → DTO → API → Domain Model 逐页映射在本契约文档成表；核心对象（Product/SupplierProduct/Demand/Match/RFQ/Response/Offer/Inquiry）已冻结字段语义（§5 指令不得重定义）。

## 15. Permission Contract

- **后端为准**：JwtAuthGuard + RolesGuard（`organizationId_userId` 成员关系 → role 命中）。`Role` enum 含 ADMIN / BUYER / SUPPLIER（Admin 另含 SUPER\_ADMIN/OPERATOR/VIEWER 前端角色细分）。

- **公开边界**：Public 路由（`/products`、`/search`、`/knowledge` 等）走 Public decorator/匿名；写操作一律鉴权+CSRF。

- **角色→能力**：Read/Create/Edit/Delete/Submit/Review/Approve/Reject/Publish/Unpublish/Respond/Decision 映射到各角色（§8）。

- **不可前端自行绕过**：任何状态/治理动作最终经 `Authenticated + Authorized + CSRF Valid`（823 已运行验证 3 条越权 DENIED）。

## 16. Lifecycle Contract

继承已冻结状态机（Prisma 枚举），`Every Action → legal lifecycle transition`：

| Entity            | 状态（枚举）                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| Demand            | DemandStatus（DRAFT/PENDING/OPEN/…）                                             |
| DemandMatch       | DemandMatchStatus（PENDING→MATCHED→REVIEWED→ACCEPTED/REJECTED…）                 |
| RFQ               | RFQStatus（DRAFT→OPEN→RESPONDING→CLOSED…）                                       |
| RFQResponse       | RFQResponseStatus                                                              |
| Offer             | OfferStatus（DRAFT→SUBMITTED→ACCEPTED/REJECTED…）                                |
| Inquiry           | InquiryStatus                                                                  |
| SupplierProduct   | SupplierProductStatus（DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED→/REJECTED…） |
| Organization/User | OrganizationStatus / UserStatus                                                |
| FileAsset         | FileAssetStatus                                                                |

（823 §18 Lifecycle Matrix 已运行证明这些跃迁 + DB 持久化一致。）

## 17. Public IA

Discovery 必须 **Product-centered**：`Discovery → Product / Capability → Product Detail → Supplier Model Context`。SupplierProduct 只能作为 Supporting Model / Supplier Context，**不是独立全局 authority**（§5/§17 指令）。实际站点 Public 导航 `discover/evaluate/content/connect` 覆盖 `/search /categories /products /solutions /knowledge /about /business /suppliers`，符合该结构。

## 18. Buyer IA

`Dashboard → Demands → Demand Detail → Matches → RFQ → Responses → Offers → Decision → Workspace / Notifications`。实际路由已具备（`/dashboard/[buyer]`、`/workspace/demands|matches|rfqs|notifications`、`/workspace/evaluations`）。保证每级进入/返回/下一步（§18 指令）。

## 19. Supplier IA

`Dashboard → RFQ Opportunities → RFQ Detail → Response → Submit`；另 `Products → SupplierProduct → Create/Edit → Media → Parameters → Submit → Status`；组织管理 `Organization / Members / Profile`。实际路由已具备（`/workspace/supplier/opportunities|rfqs|responses|offers|products|runtime|inquiries|members|profile|display`）。

## 20. Admin IA

`Operations Center → Business Center → Master Data → Partner Mgmt → Content/Knowledge → Data/Monitoring → System`。**基于真实菜单冻结**（`AdminLayout.menuGroups`），不虚构模块：工作台(`/home`) · 业务中心(demands/rfqs/inquiries/offers/matching) · 能力主数据(products/supplier-products/product-categories/parameters) · 合作方管理(users/organizations) · 内容与知识库(content/knowledge/tags/media/mappings/files) · 数据与监控(analytics/business-analytics/monitoring/audit-intelligence/embedding) · 系统管理(notifications/audit-logs)。

## 21. Design System Contract

- **Token 事实源**：`packages/design-tokens/src/index.ts`（品牌主色、工业辅助色、中性色阶、语义状态色、表面色；`STATUS_TONE`/`TONE_TO_HEX`/`TONE_TO_ANTD_COLOR` 将业务状态 DRAFT/SUBMITTED/PENDING/REJECTED 等映射统一视觉语义）。

- **Web 实现**：`apps/web/tailwind.config.ts`（主色、工业色、字体、阴影、圆角、背景）。

- **Admin 实现**：Ant Design（ConfigProvider/theme token）。

- **冻结范围**：Visual Language / Token Semantics / Status Semantics / Spacing Principles / Interaction Principles；**不强制统一组件库技术**（§23 允许 Web=Tailwind、Admin=AntD 双体系）。

## 22. Component Contract

定义（Purpose/Variants/States/Behavior/Responsive/Accessibility）至少覆盖：Button、Input、Select、Search、Table、Card、Modal、Drawer、Tabs、Pagination、Badge、Status、Empty、Error、Loading、Form。契约成表登记，供 WP-2 实现与后续批次引用。

## 23. Chinese Terminology Contract

- **核心词表（冻结）**：modelNumber=型号；Demand=需求；Match=匹配；RFQ=询价单；Response=响应；Offer=报价；Inquiry=能力询价/询盘；Product(Platform)=能力/平台能力；SupplierProduct=能力型号；Workspace=工作区；Knowledge=知识库。

- **内部技术标识保持**：`modelNumber`、`organizationId`、`platformProductId`、枚举名、DTO、DB、API、React/TS 标识不因中文化重命名（§24 指令）。

- Admin 菜单/面包屑中文已登记（`AdminLayout.breadcrumbMap`）；Web 公共导航/字段中文按现状登记，后续批次统一。

## 24. Responsive Contract

- **基线视口**：375 / 768 / 1024 / 1440。

- 约束除 **No Horizontal Overflow** 外，还须保证 **Action Discoverability / Interaction Reachability / Content Priority**（§25 指令）。

- 各页定义 Navigation/Table/Form/Modal-Drawer/Sidebar/Action-Group/Typography/Spacing 策略；Tab/抽屉在移动端行为、侧边栏→抽屉折叠等由后续批次实现并由 Browser & Mobile Gate 验收。

## 25. Browser Gate Contract

渐进式 **7 级 Gate**（§26 指令）：

```
Foundation Gate → Page Batch Gate → SupplierProduct Media Gate
→ SupplierProduct Parameter Gate → Search Gate → SEO Gate → Final Full Role Gate
```

每条 Gate 记录 `Role/Page/Action/Expected/Actual/Screenshot/State/Regression`。BATCH A–E 各配对相应 Gate（见 §30）。

## 26. Product Page Contract

`Product List → Product Detail → Supplier Context → Related Knowledge → Related Solution → Connection/Inquiry`。**Product Authority 保持**；SupplierProduct 不得取代 Product（§28）。公共 Product 页（`/products[slug]` + `/supplier-models` + `/suppliers/[id]`）符合该结构；`inquiry / connection` 依赖 Buyout 表单（鉴权后可用）。

## 27. SupplierProduct Page Contract

冻结（未来正式产品化）：List / Detail / Create / Edit / Media / Parameter / Submit / Status。**Media=FileAsset+SupplierProductMedia（统一一套，禁止第二 Media System）；Parameter=ParameterDefinition+SupplierProductParameterValue（禁止重复参数 authority）**（§29 指令）。SUPPLIER 侧已有 `self-service` 域 + `/workspace/supplier/products` + `runtime`；ADMIN 侧 `/admin/supplier-products/*`。

## 28. Search Contract

- **Unified Search = Existing Search Authority**（`/search` + `/discovery/capabilities`）。

- **Product = Primary Authority**；SupplierProduct = Supporting Signal。

- 本任务不实现 Search Enhancement（仅冻结现有契约）。

## 29. SEO Contract

- 只定义未来约束：Canonical / Metadata / Breadcrumb / Structured Data / Internal Linking / Entity Relationship / Sitemap。

- SupplierProduct 不自动成为独立 SEO Authority；Product 为 SEO authority。

- 本任务不实施 SEO。

## 30. Page Reconstruction Batch Plan

不一次性重构，按依赖分批：

| Batch | 范围                                                                            | 关键依赖                                     | Browser Gate                      | 完成判据                             |
| ----- | ----------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------- | -------------------------------- |
| A     | Public Discovery（首页/搜索/Product/Knowledge/Content/Solution）                    | WP-2 UI/Tokens；§26 Product Page Contract | Foundation→Page Batch             | 公开页 375/768/1024/1440 无溢出、可达、无越权 |
| B     | Buyer Workspace（Demand→Match→RFQ→Response→Offer→Decision→Workspace/Notify）    | Batch A；§18 Buyer IA                     | Page Batch                        | 纵向链全页可操作、775 无溢出                 |
| C     | Supplier Workspace（Opportunity→Response→Offer→Product 自助）                     | Batch A/B；§19 Supplier IA                | Page Batch + Media/Parameter Gate | Supplier 自助可提交、Media/Param 页就绪   |
| D     | Admin Core Operations（Demand/RFQ/Inquiry/Offer/Match 运营）                      | Batch A/B                                | Page Batch                        | 运营动作 + 治理动作可跑通                   |
| E     | Admin Master Data / Content / Monitoring（Product/SupplierProduct/参数/知识/媒体/监控） | Batch D；§20 Admin IA                     | Page/Media/Parameter Gate         | 主数据+内容+监控页全可达                    |

> 若实现审计显示更合理分组可调整；本报告按实际依赖给出建议分组。

## 31. SupplierProduct Capability Dependencies

依赖顺序（§33 指令，禁止先完成最终页再反向定义 Media/Parameter）：
`Backend Capability Contract → Frontend Contract → Page Reconstruction`。
本契约已冻结 Media/Parameter 的实体与 API（§27）；WP-2 不实现 Media/Parameter，但 Batch C/E 必须在页面重构前以「Capability Readiness」门控。

## 32. Search / SEO Dependencies

- Search 依赖：Page Contract / Product Authority / SupplierProduct Signal / Parameter Model / IA。

- SEO 依赖：Routes / IA / Internal Linking / Entity Relationships / Canonical Strategy。
  因此 Search Gate 与 SEO Gate 位于 Media/Parameter + Batch A–E 之后（§34 指令），且仅在相应 IA/契约就绪后实施。

***

## 33. Gap Register

本任务发现分类（禁止仅用 "Needs Improvement"）：

| ID  | 分类                | 描述                                                                             | 影响                        | 处置                                        |
| --- | ----------------- | ------------------------------------------------------------------------------ | ------------------------- | ----------------------------------------- |
| G-1 | UI GAP            | `knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status` 类型错误（既有）        | Web build 类型检查失败（编译过、类型错） | PRE-EXISTING / NON-BLOCKING，不顺手修复，转未来修复候选 |
| G-2 | PAGE GAP          | Web 部分页面 `error.tsx/not-found.tsx` 不完整                                         | 错误承接体验不一致                 | 已列为未来 Batch 增强/候选                         |
| G-3 | DOCUMENTATION GAP | 部分既有页面与契约登记尚未逐页运行复核（本轮以 823 核心链为主）                                             | 契约完整性                     | KNOWN，纳入 Batch 各页 Browser Gate            |
| G-4 | API GAP(PARTIAL)  | 非核心域（Content/Knowledge/Search/Media/Embedding/Admin 监控）契约多数为 KNOWN 而非全量 FROZEN | 需后续 Gate 核验               | 纳入 Batch C/E 与 Search/SEO Gate            |
| G-5 | LOCALIZATION GAP  | 中文术语个别页面未完全统一（如部分字段英文残留）                                                       | 一致性                       | 在 Batch A 前以 Terminology 差异清单收敛           |
| G-6 | RESPONSIVE GAP    | 375 深度验证明细（action reachability/content priority）未逐页完成（823 已验核心页）               | 覆盖度                       | 各 Batch Mobile Gate                       |
| G-7 | FUTURE CANDIDATE  | SupplierProduct Media/Parameter 自助、Search/SEO 增强                               | —                         | DEFERRED（§41）                             |

> 无核心语义 / 权限 / API / 页面契约 **矛盾**（故非 BLOCKED）。

## 34. P0 / P1 / P2 / P3

- **P0 = 0**、**P1 = 0**。

- **P2（新增）**：暂无新增阻断业务项；上述 G-2..6 多数为覆盖/体验项，归 Batch 处理。

- **P3**：G-1（PRE-EXISTING/NON-BLOCKING）、G-2..6（体验/覆盖类，future candidate 或 Batch 内）。

## 35. PRE-EXISTING / NEW

- **PRE-EXISTING**：`knowledge-base/[slug]` 类型错误（G-1，与 816/822/823 一致）；部分页面 error/not-found 不完整。

- **NEW**：全部契约冻结产物（Page Registry / Role Matrix / Nav/Action/Destination / F-B Contract Registry / four IA / Design System / Terminology / Responsive / Browser Gate / Batch Plan）；Admin 真实菜单 IA 首度完整登记。

## 36. BLOCKING / NON-BLOCKING

- **BLOCKING = 无**（无核心语义/权限/API/页面矛盾，无 P0/P1）。

- **NON-BLOCKING**：G-1（P3/pre-existing）、G-2..6（Batch/Gate 内收敛）、以及契约覆盖完整度（不影响 WP-2 启动）。

## 37. Frozen Decisions

- **FROZEN BUSINESS SEMANTICS**：Product=WHAT / SupplierProduct=WHICH MODEL（organizationId+platformProductId+modelNumber 三约束，非独立 authority）/ Organization=OWNER / Supplier=OPERATIONAL USER / Admin=PLATFORM GOVERNANCE / Offer=COMMERCIAL / Public Discovery=Product-centered（§5）。

- **FROZEN PRODUCT AUTHORITY**：Product 为唯一平台能力/SEO/发现主权；SupplierProduct 为受归属的 Supporting Context。

- **FROZEN SUPPLIERPRODUCT OWNERSHIP**：`organizationId`=ownership authority，`platformProductId`=platform authority，`modelNumber`=real identity。

- **FROZEN ROLE MODEL**：PUBLIC/BUYER/SUPPLIER/ADMIN（Admin 细分 SUPER\_ADMIN/OPERATOR/VIEWER），役权以 RolesGuard 成员关系为准。

- **FROZEN LIFECYCLE**：Prisma 状态机（§16），Every Action→legal transition。

- **FROZEN API SEMANTICS**：`{success,data,message}` 外壳；JWT+CSRF double-submit；组织隔离。

- **FROZEN PERMISSION PRINCIPLES**：后端权威、`Authenticated+Authorized+CSRF Valid`、前端不可绕过。

- **FROZEN PAGE CONTRACT**：§7 真实路由清单（Web 60 / Admin 57）。

- **FROZEN IA**：§17–20 四端 IA。

- **FROZEN DESIGN PRINCIPLES**：行为标准化、不强制技术统一（§21）。

- **FROZEN TERMINOLOGY**：§23 中文词表 + 内部标识不重命名。

- **FROZEN RESPONSIVE BASELINE**：375/768/1024/1440。

- **FROZEN BROWSER GATES**：§25 七级 Gate。

## 38. Deferred Decisions

以下为 **DEFERRED / SCHEDULED**（非 CLOSED）：Search Enhancement · SEO Enhancement · SupplierProduct Media Implementation · SupplierProduct Parameter Implementation · Detailed Page Reconstruction（BATCH A–E 待独立授权）· 既有 P2/G 件。

## 39. Future Candidates

- SupplierProduct 自助 Media/Parameter 生产能力补全（Batch C/E + Media/Parameter Gate）。

- 页级 error/not-found 承接统一（G-2）。

- 全站点中文术语差异清扫（G-5）。

- 逐页四视口覆盖（G-6，Batch Mobile Gate）。

- `knowledge-base/[slug]` 类型错误修复（G-1，未来修复候选，不在本轮）。

## 40. First Implementation Work Package

- **WP-2：FRONTEND RECONSTRUCTION FOUNDATION**（仅提出，不实施）。

- 范围：Shared UI Foundation / Design Tokens / Shared Interaction Primitives / Responsive Primitives / Form · Table · Modal · Drawer · Search · Pagination · Status · Empty · Error · Loading。

- 不含：大量业务页面重构、SupplierProduct Media、Parameters、Search、SEO（除非本契约明确某 Foundation prerequisite）。

## 41. Completion Criteria（WP-2 判定）

Component Registry · Token Registry · Responsive Primitive · Form/Table/Modal/Drawer/Search/Status/Loading-Empty-Error Primitive · Accessibility Baseline · Browser Foundation Gate；要求 `npm/package tests` + Typecheck + Build + Representative Browser Verification + Mobile Verification + Documentation（§43）。

## 42. Regression

- 本任务无业务代码变更 ⇒ 无业务回归预期。

- 需确认：API typecheck ✅（build 通过）· Admin typecheck ✅（build 通过）· Web typecheck ⛔（既有 `knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status`）。

- 该既有类型错误按 **PRE-EXISTING / NON-BLOCKING** 记录，不顺手修复（§44 指令）。本轮回归未触碰源码。

## 43. STOP

本任务为 **AUDIT + CONTRACT DEFINITION + FREEZE + DOCUMENT**：未做任何页面重构 / UIRedesign / 组件重构 / API / DB / 业务逻辑 / Search / SEO / Media / Parameter 开发。未自动触发 WP-2 或任何 Batch。是否发起 WP-2（或后续 Batch）需独立授权。

***

## 44. Final Decision

**CONDITIONAL PASS**

- **PASS** 条件（Productization Contract 完全形成并可供后续实现引用）基本满足；存在少量非阻断契约项（§33 G-1..6，均为覆盖/体验/未来候选类，**无核心语义/权限/API/页面矛盾**），不影响 WP-2。

- 依据 §46 判定：非 BLOCKED（无矛盾）；存在少数非阻断项 ⇒ **CONDITIONAL PASS**，契约可作后续实现引用基线，WP-2 可据此启动（独立授权后）。

***

## Appendix — Frozen Contract Artifacts（产物清单）

| 产物                                         | 位置                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| 本契约冻结报告                                    | `docs/_review/824_..._FRONTEND_PRODUCTIZATION_CONTRACT_FREEZE_REPORT.md` |
| Page Contract Registry                     | 本报告 §7 + 成表登记（后续可落 `docs/contracts/page-contract-registry.md`）           |
| Role × Page Matrix                         | §8                                                                       |
| Navigation / Action / Destination Registry | §9–11                                                                    |
| Frontend ↔ Backend Capability Matrix       | §12–13                                                                   |
| Chinese Terminology Dictionary             | §23（可落 `docs/contracts/chinese-terminology.md`）                          |
| Design Token Registry                      | §21 + `packages/design-tokens`（事实源）                                      |
| Component Contract                         | §22（可落 `docs/contracts/component-contract.md`）                           |
| Responsive / Browser Gate Contract         | §24–25                                                                   |
| Page Reconstruction Batch Plan             | §30–32                                                                   |

> 依据 §37，建议将上表「可落」项在独立授权后落地为 `docs/contracts/**` 的标准契约文档；本报告本身即为更新基准。

## Sync Note

治理文档同步（`PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md`）：824 = POST-M39 **Frontend Productization Contract Freeze（WP-1）CONDITIONAL PASS**，契约冻结完成、可供后续实现引用；STEP 1（Full Experience Graph + Frontend↔Backend Contract Freeze）→ COMPLETED；WP-2（Frontend Reconstruction Foundation，仅规划）→ NEXT / 待独立授权；STEP 2–9 不提前标记 IMPLEMENTED/VERIFIED/CLOSED。
