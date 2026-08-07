# VISNDT Admin 全面审查修复方案

> 报告日期：2026-08-06
> 审查范围：数据库字段展示完整性 + 批量操作功能 + Admin 页面 + Web 前端页面
> 文档编号：295_M13.9_Admin_Comprehensive_Review_Fix_Plan

---

## 一、审查发现总结

### 1.1 字段展示缺失（Admin 列表页）

| 模块 | 当前列 | 缺失字段 | 建议 |
|------|--------|---------|------|
| ProductList | name, model, category, status, createdAt | description | 建议在详情中展示，列表可加简短描述截断 |
| OfferList | product, organization, status, createdAt | **title, description** | 缺少标题和描述列，影响识别 |
| RfqList | id(截断), status, demand, creator, createdAt | **publishedAt, closedAt** | 缺少发布时间和关闭时间 |
| DemandList | title, organization, category, status, publishedAt, createdAt | **budgetRange, quantity** | 预算范围和数量有业务价值 |
| OrganizationList | name, type, status, createdAt | — | 基本完整 |
| UserList | name, email, organization, role, status, **lastLogin** | **createdAt** | lastLogin 字段在 DB 中不存在，应替换为 createdAt |
| NotificationList | title, type, status, createdAt | — | 基本完整 |
| ParameterGroupList | name, description, createdAt | **code** | code 是唯一标识符，应展示 |
| ParameterDefinitionList | name, dataType, unit, createdAt | **code, required** | 缺少 code 和必填标记 |
| ProductCategoryList | name, description, status, createdAt | **slug, parent** | 缺少 slug 和父分类 |
| AuditLogList | operator, action, entityType, createdAt | **entityId** | 缺少实体 ID，无法定位具体记录 |
| FileAssetOrphanList | fileName, fileSize, createdAt, fileType | **storageKey, mimeType** | 存储键和 MIME 类型有运维价值 |

### 1.2 字段展示缺失（Detail 详情页）

| 模块 | 缺失字段 | 影响 |
|------|---------|------|
| ProductDetail | 基本完整 | — |
| InquiryDetail | 基本完整 | — |
| OfferDetail | 基本完整 | — |
| RfqDetail | 基本完整 | — |
| DemandDetail | 基本完整 | — |
| UserDetail | 基本完整 | — |
| OrganizationDetail | 缺少 `description` | DB 中 Organization 无此字段，非缺失 |
| NotificationDetail | 缺少 `referenceType, referenceId` 中文显示 | 字段存在但可能未翻译 |
| ParameterGroupDetail | code 字段 | 未单独展示 |
| ParameterDefinitionDetail | code, required | 未单独展示 |
| ProductCategoryDetail | slug, parent | 未单独展示 |

### 1.3 批量操作功能缺失（全部模块）

当前所有 Admin 列表页均无批量操作功能，包括：

| 功能 | 状态 | 说明 |
|------|------|------|
| 行选择（Checkbox） | ❌ 全部缺失 | 13 个列表页均无 rowSelection |
| 批量删除 | ❌ 全部缺失 | 后端无 batch DELETE 端点，前端无批量删除 UI |
| 批量状态变更 | ❌ 全部缺失 | 后端无 batch PATCH 端点，前端无批量状态变更 UI |
| 批量操作栏 | ❌ 全部缺失 | 无选中后出现的操作工具栏 |

### 1.4 Web 前端页面字段检查

| 页面 | 字段展示情况 |
|------|-------------|
| 产品列表页 | 通过 ProductCard 展示 name, model, category, description 截断 — 基本完整 |
| 产品详情页 | 展示 name, model, category, description, parameters — 基本完整 |
| 需求列表页 | 展示 title, status, createdAt — 缺少 description, budgetRange, quantity |
| 需求详情页 | 展示 title, description, status, parameters, matchCount — 基本完整 |
| RFQ 列表页 | 展示 title, status, createdAt — 缺少 publishedAt, closedAt |
| RFQ 详情页 | 展示 detail info, responses — 基本完整 |

---

## 二、修复方案

### Phase A: 后端批量操作 API

#### A.1 通用批量删除端点

在每个模块的 Controller 中添加 `POST :id/batch-delete` 或 `DELETE batch` 端点：

| 模块 | 端点 | 请求体 | 说明 |
|------|------|--------|------|
| Products | `POST /api/v1/products/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| Users | `POST /api/v1/users/batch-delete` | `{ ids: string[] }` | 批量删除，排除自己 |
| Organizations | `POST /api/v1/organizations/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| Offers | `POST /api/v1/offers/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| RFQs | `POST /api/v1/rfqs/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| Demands | `POST /api/v1/demands/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| Inquiries | `POST /api/v1/admin/inquiries/batch-delete` | `{ ids: string[] }` | 批量删除 |
| ParameterGroups | `POST /api/v1/parameter-groups/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| ParameterDefinitions | `POST /api/v1/parameter-definitions/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| ProductCategories | `POST /api/v1/product-categories/batch-delete` | `{ ids: string[] }` | 批量删除，含依赖检查 |
| Notifications | `POST /api/v1/notifications/batch-delete` | `{ ids: string[] }` | 批量删除 |
| FileAssets | `POST /api/v1/file-assets/batch-delete` | `{ ids: string[] }` | 批量删除 |

#### A.2 通用批量状态变更端点

| 模块 | 端点 | 请求体 | 说明 |
|------|------|--------|------|
| Products | `PATCH /api/v1/products/batch-status` | `{ ids: string[], status: string }` | 批量上架/下架 |
| Users | `PATCH /api/v1/users/batch-status` | `{ ids: string[], status: string }` | 批量启用/禁用 |
| Organizations | `PATCH /api/v1/organizations/batch-status` | `{ ids: string[], status: string }` | 批量启用/禁用 |
| Offers | `PATCH /api/v1/offers/batch-status` | `{ ids: string[], status: string }` | 批量状态变更 |
| RFQs | `PATCH /api/v1/rfqs/batch-status` | `{ ids: string[], status: string }` | 批量发布/关闭 |
| Demands | `PATCH /api/v1/demands/batch-status` | `{ ids: string[], status: string }` | 批量状态变更 |
| Inquiries | `PATCH /api/v1/admin/inquiries/batch-status` | `{ ids: string[], status: string }` | 批量标记处理/关闭 |

#### A.3 通用批量操作 DTO

在 `apps/api/src/common/dto/` 中创建：
- `batch-delete.dto.ts` — `{ ids: string[] }`
- `batch-status.dto.ts` — `{ ids: string[], status: string }`

### Phase B: 前端批量操作 UI

#### B.1 通用批量操作组件

创建 `apps/admin/src/components/BatchOperations.tsx`，包含：
- 选中计数显示："已选择 N 项"
- 批量删除按钮（带确认弹窗）
- 批量状态变更下拉选择（带确认弹窗）

#### B.2 各列表页增加 rowSelection

在 13 个列表页的 Table 组件中增加 `rowSelection` 配置，并集成 BatchOperations 组件：

| 页面 | 批量删除 | 批量状态变更 | 可选状态值 |
|------|---------|-------------|-----------|
| ProductList | ✅ | ✅ | ACTIVE, DRAFT, INACTIVE |
| UserList | ✅ | ✅ | ACTIVE, INACTIVE, SUSPENDED |
| OrganizationList | ✅ | ✅ | ACTIVE, INACTIVE, SUSPENDED |
| OfferList | ✅ | ✅ | DRAFT, ACTIVE, INACTIVE |
| RfqList | ✅ | ✅ | DRAFT, OPEN, CLOSED |
| DemandList | ✅ | ✅ | DRAFT, PUBLISHED, CLOSED |
| InquiryList | ✅ | ✅ | NEW, PROCESSING, REPLIED, CLOSED |
| ParameterGroupList | ✅ | ❌ | 无状态字段 |
| ParameterDefinitionList | ✅ | ❌ | 无状态字段 |
| ProductCategoryList | ✅ | ❌ | 无状态字段 |
| NotificationList | ✅ | ❌ | 通知不可手动变更状态 |
| AuditLogList | ❌ | ❌ | 审计日志不可删除/变更 |
| FileAssetOrphanList | ✅ | ❌ | 无状态字段 |

### Phase C: Admin 字段展示完善

#### C.1 列表页字段补充

| 页面 | 新增列 | 说明 |
|------|--------|------|
| OfferList | title | 报价标题，优先展示 |
| RfqList | publishedAt, closedAt | 发布时间和关闭时间 |
| DemandList | budgetRange, quantity | 预算范围和数量 |
| UserList | createdAt | 替换不存在 lastLogin 为 createdAt |
| ParameterGroupList | code | 唯一标识符 |
| ParameterDefinitionList | code, required | 增加 code 和必填标记 |
| ProductCategoryList | slug, parent | 增加 slug 和父分类 |
| AuditLogList | entityId | 增加实体 ID 列 |
| FileAssetOrphanList | storageKey, mimeType | 增加存储键和 MIME 类型 |

#### C.2 详情页字段补充

| 页面 | 补充内容 | 说明 |
|------|---------|------|
| OfferDetail | 无缺失 | 当前完整 |
| RfqDetail | 无缺失 | 当前完整 |
| DemandDetail | 无缺失 | 当前完整 |
| OrganizationDetail | 无缺失 | 当前完整 |
| NotificationDetail | referenceType/referenceId 中文标签 | 如已展示则无需修改 |
| ParameterGroupDetail | 增加 code 展示 | 补充唯一标识符 |
| ParameterDefinitionDetail | 增加 code, required 展示 | 补充标识和必填标记 |
| ProductCategoryDetail | 增加 slug, parent 展示 | 补充标识和层级 |

### Phase D: Web 前端字段补充

| 页面 | 补充内容 |
|------|---------|
| 需求列表页 | 补充 budgetRange, quantity 展示 |
| RFQ 列表页 | 补充 publishedAt, closedAt 展示 |

---

## 三、实施顺序

### 第 1 步：通用 DTO 和批量操作组件
1. 创建 `batch-delete.dto.ts` 和 `batch-status.dto.ts`
2. 创建 `BatchOperations.tsx` 组件

### 第 2 步：后端批量操作 API（10 个模块）
3. ProductsController/Service — batchDelete + batchStatus
4. UsersController/Service — batchDelete + batchStatus
5. OrganizationsController/Service — batchDelete + batchStatus
6. OffersController/Service — batchDelete + batchStatus
7. RFQsController/Service — batchDelete + batchStatus
8. DemandsController/Service — batchDelete + batchStatus
9. AdminInquiryController/Service — batchDelete + batchStatus
10. ParameterGroupsController/Service — batchDelete
11. ParameterDefinitionsController/Service — batchDelete
12. ProductCategoriesController/Service — batchDelete
13. NotificationsController/Service — batchDelete
14. FileAssetsController/Service — batchDelete

### 第 3 步：前端列表页批量操作 UI（13 个页面）
15-27. 在每个列表页增加 rowSelection 和 BatchOperations 集成

### 第 4 步：字段展示完善
28. OfferList — 增加 title 列
29. RfqList — 增加 publishedAt, closedAt 列
30. DemandList — 增加 budgetRange, quantity 列
31. UserList — 替换 lastLogin 为 createdAt
32. ParameterGroupList — 增加 code 列
33. ParameterDefinitionList — 增加 code, required 列
34. ProductCategoryList — 增加 slug, parent 列
35. AuditLogList — 增加 entityId 列
36. FileAssetOrphanList — 增加 storageKey, mimeType 列
37. Detail 页补充字段（ParameterGroup, ParameterDefinition, ProductCategory）

### 第 5 步：Web 前端字段补充
38. 需求列表页 — 补充 budgetRange, quantity
39. RFQ 列表页 — 补充 publishedAt, closedAt

### 第 6 步：编译验证 + 运行时验证
40. pnpm build 验证
41. API 端点测试
42. 前端页面测试

---

## 四、影响范围

| 目录 | 文件数 | 说明 |
|------|--------|------|
| apps/api/src/common/dto | 2 个新增 | batch-delete.dto.ts, batch-status.dto.ts |
| apps/api/src/*/controllers | 10-14 个修改 | 新增 batch 端点 |
| apps/api/src/*/services | 10-14 个修改 | 新增 batch 方法实现 |
| apps/admin/src/components | 1 个新增 | BatchOperations.tsx |
| apps/admin/src/pages | 13 个修改 | 增加 rowSelection 和批量操作 |
| apps/admin/src/api | 13 个修改 | 增加 batch 方法 |
| apps/web/src | 2 个修改 | 补充字段展示 |

---

*文档由 Trae AI 自动生成*