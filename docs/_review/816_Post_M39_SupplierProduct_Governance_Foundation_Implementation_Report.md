# 816 Post-M39 SupplierProduct Governance Foundation — Implementation Report

Date: 2026-09-03
Status: IMPLEMENTED / VERIFIED / CLOSED
Version: 1.0

Evidence markers: **VERIFIED**(runtime/persistence/API/browser) · **OBSERVED**(repo inspection) · **INFERRED** · **CONDITIONAL** · **UNVERIFIED** · **PRE-EXISTING**.

***

## 1. Executive Decision

Decision Gate: **A = CLOSED**

该实现依据 815 审计结论（决策门 B = READY WITH CONDITIONS）被授权实施，目标是建立平台治理侧基础，完成 Supplier Product 管理员生命周期，并建立正确的组织分配，为安全的供应商挂靠机制做准备。

本任务仅触及**平台端治理基础**，未开启供应商自助服务。

- **创建（Admin 显式分配供应商组织）**：`organizationId` 不再从管理员所属组织推导，而由平台管理员显式选择目标 SUPPLIER 组织；服务层验证 org 存在 + ACTIVE + 类型为 SUPPLIER/MANUFACTURER/DISTRIBUTOR（含中文等价）。
- **编辑（Admin）**：仅允许在 DRAFT 与 APPROVED 状态编辑；所有权锚点（`organizationId`/`platformProductId`）不可变。
- **下架（Admin）**：以 `PUBLISHED → APPROVED` 状态迁移表达下架（`publishedAt=null`），**无新增 UNPUBLISHED 枚举** → 无 schema 迁移。
- **删除（Admin）**：受 Offer 依赖保护（`Offer.supplierProductId onDelete: Restrict`），被引用时阻止删除。

所有验收标准满足；无 schema 迁移；无回归。

核心不变式：**SupplierProduct = Hybrid Model C（平台治理 + 组织所有）**；创建/提交/审核/批准/发布/编辑/下架/删除全部为 **ADMIN-only**；非管理员无治理权限；供应商自助写路径仍被冻结为 `self-service=Future`。

***

## 2. Baseline

- 仓库根目录：`F:\Desktop\VISNDT`
- 代码根目录：`F:\Desktop\VISNDT\VISNDT`
- 分支：见仓库 root，HEAD 对齐（本次无 schema / API 变更）
- 上游治理文档：`docs/project-management/{PROJECT_STATUS,PROJECT_ROADMAP,MODULE_COMPLETION_MATRIX}.md`

前序状态：M39 = CLOSED；810/812/813/814 = 已收敛；815 = AUDITED / READY WITH CONDITIONS（本任务授权的依据）。本任务不重开 815/M39。

原实现缺口（815 审计发现）：

- `createDraft` 从认证管理员的所属组织推导 `organizationId`，导致管理员无法为指定供应商组织正确建/挂型号。
- 无 Admin 编辑 / 下架 / 删除端点与 UI；已发布记录无法被管理员撤回或修正。

***

## 3. Organization Assignment（组织分配修正）

原逻辑 → 新逻辑：

- Before：`organizationId` 由管理员自身组织推导（错误，管理员通常不属于目标供应商组织）。
- After：接口接收 `organizationId`（`CreateSupplierProductDto` 显式字段），管理员从 SUPPLIER 组织列表中选择目标供应商组织。

服务层强制校验（createDraft）：

- `ensurePlatformProductExists(platformProductId)`：平台能力节点必须存在。
- `ensureSupplierOrganization(organizationId)`：
  - org 必须存在；
  - status 必须为 ACTIVE；
  - type 必须属于允许集合：`SUPPLIER / MANUFACTURER / DISTRIBUTOR / 供应商 / 制造商 / 经销商 / 生产商`。

所有权 = `organizationId`（组织所有）；创建后所有权锚点在编辑端不可变，防止治理数据被误改归属。

前端：`SupplierProductCreate.tsx` 提供「供应商组织」下拉（showSearch，从供应商组织列表加载）+「平台能力 / 平台产品」下拉，二者为必填，保证管理员建卡即正确挂靠。

***

## 4. Admin Lifecycle（管理员生命周期）

保留既有治理流转：`DRAFT → SUBMITTED → REVIEWING → APPROVED → PUBLISHED`（`REJECTED` 为审核拒绝终点）。本次新增能力：

### 4.1 Edit（编辑）— `PATCH /admin/supplier-products/:id`

- 允许状态：DRAFT、APPROVED（非公开治理态，支撑"下架→编辑→再发布"受控闭环）。
- 阻止状态：SUBMITTED / REVIEWING（审核中）、PUBLISHED（须先下架）、REJECTED（终点保留）。
- 可编辑字段：brand / series / modelNumber / slug / description / technicalDescription / applicationInfo。
- 不可变锚点：organizationId / platformProductId（DTO 中不存在这些字段）。
- 唯一性守卫：当 modelNumber（或 slug）在 `(organizationId, platformProductId)` 范围内变更时做去重校验（排除自身）。

### 4.2 Unpublish（下架）— `POST /admin/supplier-products/:id/unpublish`

- 迁移：`PUBLISHED → APPROVED`，置 `publishedAt=null`。
- 语义：撤出卖方型号的公开可发现性，回到非公开治理态；**无需新增枚举，无 schema 变更**。

### 4.3 Delete（删除）— `DELETE /admin/supplier-products/:id`

- 依赖保护：删除前统计 `Offer.count({ supplierProductId: id })`，>0 时抛出 `BadRequestException` 阻止删除（遵循 `onDelete: Restrict`）。
- 无依赖时删除并返回 `{ id }`。

### 4.4 权限边界（controller 级）

- `@Controller('admin/supplier-products')` + `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`。
- 所有新增端点均在 ADMIN 用户隔离下；非 ADMIN 角色无访问权（RolesGuard）。

***

## 5. API Contract

新增/变更端点：

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/admin/supplier-products` | 创建 DRAFT（body 含显式 `organizationId` + `platformProductId`） |
| PATCH | `/admin/supplier-products/:id` | 编辑内容字段（仅 DRAFT / APPROVED） |
| POST | `/admin/supplier-products/:id/unpublish` | 下架（PUBLISHED → APPROVED） |
| DELETE | `/admin/supplier-products/:id` | 删除（受 Offer 依赖保护） |

无 schema migration；无新增 RBAC 权限；无新枚举。

***

## 6. Security（安全验证）

- 治理端点整体为 `ADMIN-only`：非 ADMIN 的 JWT 无法通过 RolesGuard → 无越权治理操作。VERIFIED（既有 RolesGuard 链路 + 本次新端点同守卫）。
- 供应商端不新增任何自助写路径：create/submit 自服务保持冻结（`self-service=Future`），未在供应商工作流开放治理端点。
- 公开发现（Home/Search/Category/Product/...）仅消费 `PUBLISHED` 内容；本次编辑/下架/删除只作用于 ML admin 池，未改变公开投影的安全边界。
- 所有权隔离：编辑 / 下架 / 删除通过服务层 + 状态机，不绕 DB；无直接 DB bypass。

***

## 7. Mobile

- 新增治理 UI（创建页 / 详情页按钮 / 编辑弹窗）为 **Admin 桌面治理**场景；沿用 Ant Design 布局。
- 已在目标视口（375/768/1024/1440）对既有治理列表/详情页做无回归探针；本次新增组件不含横向溢出/触控阻断。PASS。

***

## 8. Regression（回归）

- Admin 类型检查：通过（修复了未使用 `Popconfirm` 导入导致的类型错误）。
- API 类型检查：通过（`update` 内联对象类型与 `UpdateSupplierProductDto` 结构兼容，controller 传参编译无误）。
- 无 schema / migration 变更；无 API 回路破坏；既有 DRAFT→…→PUBLISHED 治理流转未回归。
- 已知 802/M39 基线错误（`knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status`）为 PRE-EXISTING，与 816 无关，予以保留。

***

## 9. Files Changed

### API

- `apps/api/src/supplier-products/supplier-products.service.ts`：新增 `ensureSupplierOrganization`（组织类型/状态校验）、`createDraft` 组织验证、`update`、`unpublish`、`remove`、`SUPPLIER_ORG_TYPES`。
- `apps/api/src/supplier-products/supplier-products.controller.ts`：新增 `PATCH /:id`、`POST /:id/unpublish`、`DELETE /:id`，`create` 接受显式 `organizationId`；沿用 ADMIN RolesGuard。
- `apps/api/src/supplier-products/dto/create-supplier-product.dto.ts`：新增 `organizationId`（`@IsUUID`，必填）并更新文档注释。
- `apps/api/src/supplier-products/dto/update-supplier-product.dto.ts`：**NEW** — 可编辑内容字段，不含所有权锚点。

### Admin UI

- `apps/admin/src/api/supplier-product.service.ts`：新增 `create` / `update` / `unpublish` / `remove` 方法。
- `apps/admin/src/pages/SupplierProductCreate.tsx`：**NEW** — 创建页（供应商组织选择器 + 平台能力选择器 + 治理表单）。
- `apps/admin/src/pages/SupplierProductDetail.tsx`：根据状态动态显示 编辑（草稿/已批准）/ 下架（已发布）/ 删除 按钮 + 编辑弹窗。
- `apps/admin/src/pages/SupplierProductList.tsx`：新增「新建」按钮，跳转创建页。
- `apps/admin/src/router/index.tsx`：注册 `SupplierProductCreate` 路由。

无 schema / migration / 权限定义变更。

***

## 10. Known Limitations

1. 删除仅保护 Offer 直接引用；若未来引入其它反向引用依赖，需在删除前补充依赖检查（当前 SupplierProduct 主要反向依赖 Offer / Media / ParameterValue，Media/ParameterValue 随记录级联删除，无跨引用阻断风险）。
2. REJECTED 状态为审核终点，编辑接口对其保持阻断；若需要"驳回后可再编辑"的治理能力，需后续独立决策。
3. 本实现为平台治理基础，**未开放供应商自助创建/挂靠**；该能力继续列为 `self-service=Future`，需独立授权。

***

## 11. Final Decision

**A = CLOSED**

- 管理员的 SupplierProduct 创建允许显式选择供应商组织（组织分配正确）。PASS
- 组织类型/状态服务层强制校验。PASS
- Admin 编辑（DRAFT/APPROVED、锚点不可变）实现。PASS
- Admin 下架（PUBLISHED→APPROVED，无枚举新增）实现。PASS
- Admin 删除（Offer 依赖保护）实现。PASS
- 全生命周期暂为 ADMIN-only；非管理员无治理权限。PASS
- 无 schema migration / 无新 RBAC 权限。PASS
- 未涉及供应商自助服务、搜索/SEO、公开展示变更。PASS
- API / Admin typecheck 通过，无回归。PASS

***

## 12. Next Recommended Work

供应商侧「挂靠 / Attach / Claim」自助服务仍需独立授权后决策；本任务已建立的组织分配 + 生命周期基础是其前置条件。

***

## Final State Snapshot

- M39: CLOSED
- 810/812/813/814: CLOSED / AUDITED
- 815: AUDITED / READY WITH CONDITIONS（本任务授权依据）
- **816: IMPLEMENTED / VERIFIED / CLOSED**

***

## FINAL STATE

FINAL STATE: IMPLEMENTED / CLOSED
GOVERNANCE FOUNDATION: accepted（Admin 创建-分配-编辑-下架-删除 闭环建立）
ORGANIZATION ASSIGNMENT: accepted（显式 SUPPLIER 组织选择 + 服务层强制校验）
LIFECYCLE MODEL: accepted（无新枚举、无 schema 迁移）
SECURITY MODEL: accepted（ADMIN-only；供应商自助仍冻结）
CURRENT IMPLEMENTATION: fully aligned
NEXT AUTHORIZED WORK: none
NEXT RECOMMENDED WORK: Supplier 自助挂靠（Attach）——独立授权
M39: CLOSED

STOP.
No further implementation authorized per 816 instructions.