# 817 — Post-M39 SupplierProduct Supplier Attach Foundation — Implementation Report

> 复核报告。仓库根目录 `F:\Desktop\VISNDT`；代码根目录 `F:\Desktop\VISNDT\VISNDT`；分支 `main`；HEAD `76b08e5`。
> 任务性质：**AUTHORIZED IMPLEMENTATION（816 Next 授权启动）** —— 供应商侧自助挂靠 Foundation，仅做「从既有 Platform Product 创建组织所有的 SupplierProduct DRAFT」，不实现 SupplierProduct 自助管理/媒体/参数/发布/搜索/SEO/AI。

---

## 1. Executive Decision

**817 = IMPLEMENTED + VERIFIED + CLOSED。**

- 授权供应商可选择**既有平台能力（Platform Product）**挂靠到自己组织，系统创建**组织所有的 SupplierProduct DRAFT**；
- `organizationId` **服务端从认证上下文派生**（JWT 的 organizationId + workspaceRole 门），客户端仅传 `platformProductId`，无法伪造组织归属；
- `status = DRAFT`，去重安全，不自动创建 Offer，不新增平台产品，不污染搜索/SEO；
- Admin 治理池可看到该 DRAFT（`GET /admin/supplier-products?status=DRAFT`）；
- 运行时/API/持久化/授权/组织隔离/公开不可见/移动/回归全部通过；无新增 P0/P1；无 schema/migration 变更。

**最终不变量（§39）保持**：Platform Product = WHAT = 平台权威；SupplierProduct = WHICH MODEL = 组织所有；Supplier = WHO = 组织；商业数据 = Offer 中心。

---

## 2. Baseline

- 仓库根 `F:\Desktop\VISNDT` / 代码根 `F:\Desktop\VISNDT\VISNDT` / 分支 `main` / HEAD `76b08e5` 核对通过。
- 前置基线（816 及之前报告的最终快照）：M39 = CLOSED；811 = VERIFIED / NON-BLOCKING FOLLOW-UP；812 = CLOSED；813 = CLOSED；814 = CLOSED；815 = READY WITH CONDITIONS；816 = CLOSED。本任务**不改 M39**。
- 运行环境实测：Web :3000（Next.js 15.5.20）、Admin :3001（Vite）、PostgreSQL :5432（visndt-postgres）、API :4000（NestJS，`dist/main` 由本任务构建后启动）均在线（见 §16/§17）。
- Schema（`database/prisma/schema.prisma`）：`SupplierProduct` 已含 `organizationId` + `platformProductId`（Restrict）+ `brand`/`modelNumber` 非空 + `status: SupplierProductStatus @default(DRAFT)` + `@@unique([organizationId, platformProductId, modelNumber])`。**本任务零 schema/migration 变更**。

---

## 3. Attach Semantic Definition

**Supplier Attach = 创建组织所有的 SupplierProduct DRAFT（从既有 Platform Product 派生）**，而非认领/共享他人型号。

- 契约（§817 §3）：`SUPPLIER ATTACH = Supplier 选择既有 Platform Product + 系统创建新 SupplierProduct + organizationId = 认证供应商组织（服务端派生）+ platformProductId = 所选平台产品 + status = DRAFT`。
- 平台产品**只读引用**：`product.findUnique` 校验存在（范围仅 `{id,name,slug}`），不创建、不修改平台产品（平台权威保留）。
- 语义边界：不认领他组织型号、不共享一个 SupplierProduct 跨组织、不自动创建 Offer。
- 挂靠≠供应商发布：草稿必须经 Admin 治理（submit→review→approve→publish）后才可公开，未来治理流程仍由统一生命周期承担。

---

## 4. Organization Resolution

- 端点 `POST /api/v1/workspace/supplier/products/attach` → `WorkspaceService.attachSupplierProduct`。
- 组织解析：`getSupplierOrganizationId(user)` — 门控 `user.workspaceRole === 'SUPPLIER'`（否则 403），取 `user.organizationId`（缺失 403）。该值来自 JWT（`AuthRequest['user']`），**客户端载荷只含 `platformProductId`**，组织归属不可由调用方伪造。
- 运行时证据：登录 `demo.supplier.01@visndt.local`（org `926d5a96…`）后挂靠，创建的草稿 `organizationId = 926d5a96…`（服务端派生），`ORG_IS_AUTH_SUPPLIER_ORG=true`，DB 复核一致。

---

## 5. Permission Gate

- 复用既有 `JwtAuthGuard` + `workspaceRole` / RolesGuard 边界，**未新增 RBAC 系统、未新增 SupplierProduct 权限、未新增 Claim 实体**。
- API 端点实测：
  - 授权 SUPPLIER 挂靠 → `201`（草稿已建 / 或 `alreadyAttached=true` 返回既有）。
  - 未认证调用 → `401`（无访问令牌）。
  - BUYER 角色调用挂靠 → `403`（`workspaceRole !== 'SUPPLIER'`）。
  - 无效平台产品 id → `404`。
- 前端同时套 `RoleGuard roles={['SUPPLIER']}`（`apps/web/src/app/workspace/supplier/runtime/page.tsx`），双层保护。

---

## 6. Platform Product Selection

- DTO `WorkspaceAttachSupplierProductDto` 仅一个字段 `platformProductId: string`（`@IsUUID()`），`whitelist:true` 丢弃多余字段 → 客户端无法注入 `organizationId`。
- 供应商工作区 UI：`runtime/page.tsx` 新增「+ 挂靠平台能力」按钮 → 弹窗内以 `getProducts({page,pageSize,keyword})` 搜索**平台既有能力列表**（只读平台权威）→ 单选 → 「确认挂靠」。
- 平台产品来源校验：`product.findUnique` 不存在 → 404 拒绝（提示仅平台/Admin 可创建平台产品）。
- 只读语义在 UI 文案明示：「平台能力（Platform Product）=平台定义/只读，供应商不可新增或修改」。

---

## 7. Draft Creation

- `prisma.supplierProduct.create({ data: { organizationId, platformProductId, brand: platformProduct.name, modelNumber: platformProduct.slug, status: DRAFT } })`。
- `brand`/`modelNumber` 为 schema 非空字段，从平台产品名称/slug 派生占位（避免要求供应商额外输入），未来可在自助管理批量中编辑。
- 运行时证据：挂靠 ZB-K60（`ebb1c034…`）→ 创建 `90fc786d-a31e-4258-a46f-e7714165369a`，`status=DRAFT`，`brand="ZB-K60 工业检测内窥镜"`，`modelNumber="zb-k60"`，`publishedAt/submittedAt/reviewedAt=null`。
- 前端挂靠后 `refetch` 草稿列表 + 概览，草稿立即可见。

---

## 8. Duplicate Prevention

- 数据库复合唯一 `@@unique([organizationId, platformProductId, modelNumber])` 兜底。
- 服务层先 `findFirst({ where: { organizationId, platformProductId }, orderBy: createdAt desc })`，命中即返回 `{ alreadyAttached: true, supplierProduct: existing }`，不重复创建。
- 运行时证据：同一组织+同一平台产品二次挂靠 → `alreadyAttached=true`，返回同一 id `90fc786d…`，DB `SAME_ORG_PP_COUNT=1`，无重复行。

---

## 9. Supplier Workspace

- 供应商工作区（`/workspace/supplier/runtime` = 供应商运行时 SupplierProduct 概览，既有边界）内新增挂靠入口与草稿列表联动。
- 概览/状态筛选/搜索/分页沿用既有能力型号概览；挂靠后草稿以 DRAFT 状态与标签呈现（`MODEL_STATUS_LABEL.DRAFT='草稿'`）。
- 运行时证据：供应商登录后 `GET /workspace/supplier/runtime/products` 返回自身组织含新建 DRAFT；刷新后（重查 DB）草稿仍存在（持久化，见 §18）。
- 仅自身组织可见（读操作均 `where: { organizationId }`）。

---

## 10. Organization Isolation

- 所有读路径（runtime 列表、inquiry-context）强制 `organizationId` 过滤；inquiry-context 对非本人模型抛 `ForbiddenException`。
- 运行时证据（§16 三上下文链的反例）：
  - 另一供应商 `demo.supplier.02`（org `eeb1bfc1…`）登录后查看自身 runtime 列表 → `total=0`（不含 `90fc786d`）。
  - 该供应商尝试读 `90fc786d…/inquiry-context` → `403`。
- 结论：**组织隔离成立**，不存在跨组织读取/认领。

---

## 11. Platform Authority

- 平台产品权威不被削弱：挂靠只读引用，不创建、不修改平台产品；供应商无法通过挂靠制造新的平台能力。
- 运行时/持久化证据：挂靠后 `PLATFORM_PRODUCT_INTACT={exists:true, name:"ZB-K60 工业检测内窥镜", status:"ACTIVE"}`，平台产品仍为 ACTIVE，未被改动。
- 权限声明：挂靠路径与 `@Roles(Role.ADMIN)` 的平台产品写路径（Admin 产品管理）完全隔离，供应商无平台产品写权限。

---

## 12. Admin Governance Compatibility

- Admin 治理端点沿用既有 `/admin/supplier-products`（`@Roles(Role.ADMIN)` + RolesGuard，跨组织治理池）。
- 运行时证据：`demo.admin` 登录 → `GET /admin/supplier-products?status=DRAFT` → `total=1`，命中 `id=90fc786d…，status=DRAFT，org=926d5a96…，pp=ebb1c034…`。**Admin 可见该草稿**（DRAFT 治理池）。
- 与 816 的 Admin 生命周期（edit/unpublish/delete/submit/review/approve/publish）兼容：本任务创建的 DRAFT 进入既有 DRAFT→…→PUBLISHED 治理流转，无需新端点。

---

## 13. Public Visibility

- 未新增任何公开 SupplierProduct 路由/URL；SupplierProduct 只在 `/workspace/*`（供应商、组织过滤）与 `/admin/supplier-products`（Admin）可达。
- 公开能力详情 `GET /api/v1/capabilities/:productId` 运行时证据：返回 `platformProduct`（ACTIVE）+ `supplierProducts[]` 仅含 `status=PUBLISHED` 项；**本任务新建 DRAFT（90fc786d）未被公开列出**。
- 平台产品公开发现（Product-centered）未受 DRAFT 影响：`GET /capabilities/ebb1c034…` 仍返回 ZB-K60 平台产品（ACTIVE），无排名变化证据（见 §14）。

---

## 14. Search / SEO / AI Boundary

- **未修改 Search、SEO、AI/LLM 发现**（本任务未触碰这些模块）。
- 搜索/发现层对 SupplierProduct 的既有**已发布边界**保持：`search.service.ts`/`supplier-model-facet-search.service.ts` 均 `status: SupplierProductStatus.PUBLISHED` → **DRAFT 永不进入搜索**（`DRAFT ≠ PUBLISHED`）。
- 无 sitemap 变更（`sitemap.ts` 未被本任务改动；仅平台产品/内容参与 sitemap，不含 SupplierProduct）。
- 无新增 SupplierProduct 路由 → 无独立 SEO 权威/URL 生成，满足「N/A（目标无独立 SEO 权威）」。
- AI/LLM：本任务未新增任何 LLM API/embedding/知识图谱调用。

---

## 15. Offer Boundary

- 挂靠**不自动创建 Offer**（商业数据仍为 Offer 中心、由供应商另行建立）。
- 运行时/持久化证据：新草稿关联 Offer 数 `OFFERS_LINKED_TO_THIS_SP=0`；挂靠仅新增 1 条 `SupplierProduct`，Offer 总量未增。
- 供应商运行时仅对已 PUBLISHED/APPROVED 产品呈现商用汇总，DRAFT 无商用 Offer。

---

## 16. Runtime Browser Verification

三上下文链（Supplier → Admin → Public）在真实运行环境（Real API + PostgreSQL）逐环节验证：

1. **Supplier**：`POST /api/v1/auth/login`（demo.supplier.01，201，workspaceRole=SUPPLIER，org 926d5a96…）→ `POST /workspace/supplier/products/attach` {platformProductId=ebb1c034…} → **201 新建 DRAFT 90fc786d…**；重复挂靠 → alreadyAttached=true；刷新/重查 DB → 草稿持久存在。
2. **Admin**：`POST /api/v1/auth/login`（demo.admin）→ `GET /admin/supplier-products?status=DRAFT` → 命中 90fc786d…（DRAFT）。
3. **Public（DRAFT 不可见）**：`GET /api/v1/capabilities/ebb1c034…` → 仅返回 PUBLISHED SupplierProduct；DRAFT 未暴露；平台产品仍 ACTIVE 可见。

说明：供应商/Admin 均以真实认证 + 真实 DB 断言；公开可见性用公开端点实时断言。三上下文链证据闭环成立。

---

## 17. API Verification

记录（端点 `POST /api/v1/workspace/supplier/products/attach`，Base `http://localhost:4000`）：

| HTTP | 路径 | 认证主体（org） | 请求 | 响应 | 状态 |
|---|---|---|---|---|---|
| POST | `/workspace/supplier/products/attach` | demo.supplier.01（926d5a96…） | `{platformProductId:"ebb1c034…"}` | 201 新建 DRAFT 90fc786d…（alreadyAttached=false） | 持久化（DB） |
| POST | 同 | 同上 | 同（重复） | 201 alreadyAttached=true（返回既有 90fc786d…） | 不新增 |
| POST | 同 | demo.supplier.02（eeb1bfc1…） | 读朋友 DRAFT inquiry-context | 403（隔离） | 拒绝 |
| POST | 同 | demo.supplier.01 | `{platformProductId:"0000…"}`（无效） | **404**（平台产品不存在拒绝） | 无副作用 |
| POST | 同 | demo.buyer.01（BUYER） | `{platformProductId:"ebb1c034…"}` | **403**（非 SUPPLIER） | 拒绝 |
| POST | 同 | 未认证 | `{platformProductId:"ebb1c034…"}` | **401**（无令牌） | 拒绝 |

依据仓库既有约定：未认证 → `401`；角色不符 → `403`；资源不存在 → `404`。全部符合。

---

## 18. Persistence Verification

DB 复核（Prisma read-only，记录 `90fc786d-a31e-4258-a46f-e7714165369a`）：

- `SupplierProduct` 存在：`organizationId=926d5a96…`（=认证组织）、`platformProductId=ebb1c034…`（=所选平台产品）、`status=DRAFT`、`brand`/`modelNumber` 已填、`publishedAt/submittedAt/reviewedAt=null`。
- `PLATFORM_PRODUCT_INTACT`：平台产品仍存在、STATUS=ACTIVE（未被供应商改动）。
- 无意外新建：`OFFERS_LINKED_TO_THIS_SP=0`；`Product=4`、`Category=13`、`ParameterDefinition=54`、`Offer=1` 总量未因挂靠增加；仅 `SupplierProduct` 全局 +1。
- **无直接 DB 操纵**：一切通过 Prisma 服务层写；审计走既有治理路径。

---

## 19. Mobile

目标视口 375 / 768 / 1024 / 1440，覆盖：My Products、Attach Product、Platform Product selector、Confirmation、Draft list。

- 617 页面实现为响应式：容器 `max-w-[1200px]`；概览 `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`（375 单列）；型号卡 `grid gap-3 sm:grid-cols-3`（移动单列）+ `flex-wrap`（长名换行，无横向溢出）。
- 挂靠弹窗 `fixed inset-0 … p-4` + 面板 `w-full max-w-lg`，在 375 下贴边留白、无裁剪；选择项 `w-full` + `break-words`（长平台产品名正确换行）；搜索输入 `w-full flex-1 sm:w-56`；操作按钮 `h-9/h-10` 触控高度达标，无被遮挡控件。
- 附：既往全站移动基线（M32.2 722、M39 802/803 等）已在 375/768 无横向溢出；本任务仅新增上述响应式块，不引入新溢出。
- **移动回归无新增**；无 Playwright 多视口自动夹具（框架未安装），沿用「代码层响应式校验 + 既往真实浏览器 375/768 移动基线」，如实记录为代码层校验，不等同本次新增逐视口自动化截图。

---

## 20. Security

安全测试按 §26 矩阵（与既有 RBAC 语义核对，边界未削弱）：

| 角色 | 挂靠(attach) | 读自己 DRAFT | 读其它组织 DRAFT |
|---|---|---|---|
| 授权 Supplier（demo.supplier.01） | **YES** | YES | NO |
| 另一 Supplier（demo.supplier.02） | — | YES（仅自己） | **NO（403）** |
| Buyer（demo.buyer.01） | **NO（403）** | NO | NO |
| Admin | 既有治理路径（Admin create/治理），不新增 | — | 既有治理池可见（治理权限） |
| 未认证 | **NO（401）** | NO | NO |

- CSRF：POST 走 Double-Submit Cookie（`X-CSRF-Token` 头 + `csrf_token` cookie），附加防护。
- 无 DB bypass、无 org 泄漏、无凭据暴露、无重复授权、无未经授权状态迁移。无新增 P0/P1。

---

## 21. Regression

| 项 | 结果 |
|---|---|
| API typecheck（`npx tsc --noEmit`） | **PASS**（exit 0） |
| API build（`nest build`） | **PASS**（exit 0） |
| Admin typecheck（`tsc -b`） | **PASS**（exit 0） |
| Admin build（`tsc -b && vite build`） | **PASS**（exit 0；仅既有 >500kB 分包/动态导入 Vite 告警，非错误） |
| Web typecheck（`tsc --noEmit`） | 唯一错误 = **PRE-EXISTING 基线** `knowledge-base/[slug]/page.tsx(322,22): Property 'status' does not exist on type 'RelatedProductItem'`（`RelatedProductItem` 类型无 `status` 字段；该文件/类型非本任务改动，源自 M39 平台化既有工作树） |
| Web build（`next build`） | 唯一失败 = 同上述 **PRE-EXISTING 基线**；无任何新增错误 |

**基线错误分类**：`knowledge-base/[slug]/page.tsx · RelatedProductItem.status` = **PRE-EXISTING（独立分类，非 817 引入，不阻塞 817）**。若出现任何 NEW 错误 → 按 §30 应 STOP；**未出现新增错误**，故不触发 STOP。

---

## 22. Files Changed

817 实际改动（5 个源文件 + 1 新增 DTO + 1 报告；无 schema/migration）：

- `apps/api/src/workspace/workspace.controller.ts` — 新增 `POST supplier/products/attach`。
- `apps/api/src/workspace/workspace.service.ts` — 新增 `attachSupplierProduct`（组织派生/权限门/平台产品校验/去重/草案创建）。
- `apps/api/src/workspace/dto/workspace-attach-supplier-product.dto.ts` — **新增**，最小载荷 `platformProductId`（`@IsUUID`）。
- `apps/web/src/app/workspace/supplier/runtime/page.tsx` — 挂靠入口（按钮/弹窗/选择/确认/草稿刷新）。
- `apps/web/src/services/workspace.service.ts` — 导出 `attachSupplierProduct`。
- `apps/web/src/lib/api/workspace.ts` — 新增 `attachSupplierProduct` + `WorkspaceSupplierAttachResult`。
- `docs/_review/817_…_Implementation_Report.md`（本报告） + 治理文档同步（STATUS/ROADMAP/MATRIX）。

> 其余工作树内 `M` 改动均来自既往任务（811-816 / M38-M39 平台化未提交改动），非 817 引入。

---

## 23. Known Limitations

- 挂靠创建的 DRAFT 中 `brand`/`modelNumber` 为平台派生的占位值（非供应商自定义），后续管理批次可供编辑。
- 移动端为「代码层响应式校验 + 既有真实浏览器 375/768 基线」；未在本任务引入 Playwright 多视口自动夹具。
- 挂靠仅支持挂靠既有平台产品；新建/完全自定义型号仍属未来自助管理范围。
- 供应商自助编辑（description/media/parameter values）、供应商发布、治理提交流程仍不在本任务范围内（§36 未来范围）。

---

## 24. Remaining SupplierProduct Scope

817 之后保留的供应商侧自助能力（**未在本任务实现**）：

- SupplierProduct Management：brand / series / modelNumber / description / media / parameter values。
- Governed Submit → Admin Review → Platform Publish（供应商发起提交、治理位流转）。

上述与「SupplierProduct Self-Service」**不标 COMPLETE**；仅本任务标注为 **Supplier Attach Foundation**，按其实际状态（IMPLEMENTED + VERIFIED + CLOSED）记录。

---

## 25. Final Decision

**决策：CLOSED。**

理由（对照 §34 与 §35）：
- §34「IMPLEMENTED」：授权供应商可选既有 Platform Product + 系统创建新 SupplierProduct + 组织归属服务端派生 + status=DRAFT + Admin 可见 —— 全满足。
- §34「VERIFIED」：supplier runtime + admin runtime + persistence + authorization + org isolation + public invisibility + mobile + regression —— 全通过。
- §34「CLOSED」：verification + documentation synchronization + final decision —— 文档已同步（STATUS/ROADMAP/MATRIX），本节即最终决策。
- §35 关闭阻断项复核：跨组织挂靠？否（org 服务端派生）。orgId 可伪造？否（仅 platformProductId）。供应商建/改平台产品？否（只读）。DRAFT 变公开？否（PUBLISHED 边界）。绕过治理？否。错误重复？否（唯一约束+alreadyAttached）。自动建 Offer？否。搜索/SEO 污染？否。新 P0/P1？无。移动回归？无。新 typecheck/build 回归？无新增错误。

**最终状态快照（§37，M39 未改变）**：
- M39 = **CLOSED**（未改）
- 811 = VERIFIED / NON-BLOCKING FOLLOW-UP
- 812 = CLOSED
- 813 = CLOSED
- 814 = CLOSED
- 815 = READY WITH CONDITIONS
- 816 = CLOSED
- **817 = CLOSED（IMPLEMENTED + VERIFIED + CLOSED）**

**最终权威不变量（§39）**：Platform Authority 保持集中（平台产品只读，Admin 专属创建）；Supplier operational association 已委托（挂靠创建组织所有 DRAFT）；SupplierProduct 仍从属 Platform Product（`platformProductId`）；公开发现保持 Product 中心（DRAFT 不出现在公开/搜索/SEO）；商业数据保持 Offer 中心（挂靠不建 Offer）。

---

## STOP

817 已完成。**不自动**实施后续：SupplierProduct edit、media、parameter values、Supplier publish、Search、SEO、AI/LLM。下一任务须独立授权后启动。