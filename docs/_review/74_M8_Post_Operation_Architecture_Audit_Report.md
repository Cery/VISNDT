# 74_M8 Post-Operation Architecture Audit Report

**Date:** 2026-07-20  
**Phase:** M8 后运营架构审查 — Admin System Compatibility Check  
**Status:** ✅ 分析完成（仅分析，零代码变更）

---

## 1. 当前架构状态

### 1.1 总体统计

| 指标 | 数量 |
|------|------|
| **API 端点总数** | 70 |
| **Module 数量** | 19 |
| **Prisma Model 数量** | 21 |
| **Migration 数量** | 9 |
| **业务 Domain 数量** | 10 |

### 1.2 模块清单

| # | 模块 | 控制器 | 端点 | 说明 |
|---|------|--------|------|------|
| 1 | `auth` | `auth.controller.ts` | 3 | 注册、登录、获取当前用户 |
| 2 | `users` | `users.controller.ts` | 4 | 用户 CRUD |
| 3 | `organizations` | `organizations.controller.ts` | 4 | 组织 CRUD |
| 4 | `organization-members` | `organization-members.controller.ts` | 2 | 组织成员管理 |
| 5 | `products` | `products.controller.ts` | 4 | 产品 CRUD + 搜索 |
| 6 | `product-categories` | `product-categories.controller.ts` | 4 | 分类 CRUD |
| 7 | `product-media` | `product-media.controller.ts` | 5 | 产品媒体管理 |
| 8 | `product-parameters` | `product-parameters.controller.ts` | 2 | 产品参数关联 |
| 9 | `parameter-groups` | `parameter-groups.controller.ts` | 4 | 参数组 CRUD |
| 10 | `parameter-definitions` | `parameter-definitions.controller.ts` | 4 | 参数定义 CRUD |
| 11 | `offers` | `offers.controller.ts` | 4 | Offer CRUD |
| 12 | `demands` | `demands.controller.ts` | 14 | Demand CRUD + 参数 + 匹配 |
| 13 | `rfqs` | `rfqs.controller.ts` | 4 | RFQ CRUD |
| 14 | `rfq-responses` | `rfq-responses.controller.ts` | 4 | RFQ 响应管理 |
| 15 | `suppliers` | `suppliers.controller.ts` | 4 | Supplier 查询 |
| 16 | `workflow-events` | `workflow-events.controller.ts` | 3 | 工作流事件查询 |
| 17 | `health` | `health.controller.ts` | 1 | 健康检查 |
| 18 | `prisma` | — | — | 数据库服务（全局） |
| 19 | `common` | — | — | 通用 DTO / 工具 |

### 1.3 Prisma 模型清单

| # | 模型 | 状态 | 说明 |
|---|------|------|------|
| 1 | `User` | 已使用 | 用户 |
| 2 | `Organization` | 已使用 | 组织 |
| 3 | `OrganizationMember` | 已使用 | 组织成员（含角色） |
| 4 | `Product` | 已使用 | 产品 |
| 5 | `ProductCategory` | 已使用 | 产品分类 |
| 6 | `ProductMedia` | 已使用 | 产品媒体 |
| 7 | `ProductParameterValue` | 已使用 | 产品参数值 |
| 8 | `ProductParameterDefinition` | 已使用 | 产品参数关联 |
| 9 | `ParameterGroup` | 已使用 | 参数组 |
| 10 | `ParameterDefinition` | 已使用 | 参数定义 |
| 11 | `ParameterOption` | 已使用 | 参数选项 |
| 12 | `Offer` | 已使用 | 供应商 Offer |
| 13 | `Demand` | 已使用 | 需求 |
| 14 | `DemandParameter` | 已使用 | 需求参数 |
| 15 | `DemandMatch` | 已使用 | 需求匹配 |
| 16 | `RFQ` | 已使用 | 询价 |
| 17 | `RFQResponse` | 已使用 | 询价响应 |
| 18 | `WorkflowEvent` | 已使用 | 工作流事件 |
| 19 | `Notification` | **未使用** | 通知（Model 存在，无 API） |
| 20 | `FileAsset` | 已使用 | 文件资产 |
| 21 | `AuditLog` | **未使用** | 审计日志（Model 存在，无 API） |

### 1.4 RBAC 现状

| 组件 | 状态 | 说明 |
|------|------|------|
| `Role` 枚举 | ✅ 存在 | `ADMIN`、`MEMBER` |
| `RolesGuard` | ✅ 存在 | 查询 `OrganizationMember.role` 验证 |
| `@Roles()` 装饰器 | ✅ 存在 | 声明所需角色 |
| 使用范围 | ⚠️ 仅 1 处 | `organization-members.controller.ts` POST 端点 |
| 系统级 Admin | ❌ 不存在 | ADMIN 是组织级，非系统级 |

**关键发现：** `RolesGuard` 已实现但几乎未使用。当前 RBAC 是**组织级**（per-organization），不是**系统级**（system-wide）。`OrganizationMember.role = 'ADMIN'` 意味着该用户是某个组织的管理员，而非平台管理员。

---

## 2. Admin 后台需求分析

### 2.1 Dashboard

**需求：** 平台级数据统计面板

| 指标 | 数据来源 | 是否可查询 |
|------|----------|-----------|
| 用户总数 | `User.count()` | ✅ |
| 企业总数 | `Organization.count()` | ✅ |
| 产品总数 | `Product.count()` | ✅ |
| Demand 总数 | `Demand.count()` | ✅ |
| Match 总数 | `DemandMatch.count()` | ✅ |
| 活跃 Offer 数 | `Offer.count({ status: 'ACTIVE' })` | ✅ |
| 待审核产品数 | `Product.count({ status: 'DRAFT' })` | ✅ |
| 本周新增用户 | `User.count({ createdAt >= ... })` | ✅ |

**兼容性：** ✅ 完全可查询，无需 Schema 变更。仅需新增 Dashboard Controller。

### 2.2 Organization 管理

| 功能 | 现有能力 | 差距 |
|------|----------|------|
| 查看企业列表 | `GET /organizations` ✅ | 无分页/搜索 |
| 查看企业详情 | `GET /organizations/:id` ✅ | — |
| 修改企业状态 | `PATCH /organizations` ✅ (需 ADMIN) | 无 `reviewStatus` 字段 |
| Supplier 审核 | ❌ | 无审核状态、审核人、审核时间 |
| 企业认证 | ❌ | 无 `verifiedAt`、`verifiedBy` 字段 |

**兼容性：** ⚠️ 部分兼容。Organization 缺少审核相关字段。

### 2.3 Product 管理

| 功能 | 现有能力 | 差距 |
|------|----------|------|
| 查看产品列表 | `GET /products` ✅ | 正常 |
| 查看产品详情 | `GET /products/:id` ✅ | 正常 |
| 产品审核 | `PATCH /products/:id` ✅ | 无 `reviewStatus` 字段 |
| 上下架 | `PATCH /products/:id` (status) ✅ | 正常 |
| 参数检查 | `GET /products/:id` (include params) ✅ | 正常 |
| SEO 字段 | ❌ | 无 `metaTitle`、`metaDescription` 字段 |

**兼容性：** ⚠️ 部分兼容。Product 缺少审核/SEO 字段。

### 2.4 Demand 管理

| 功能 | 现有能力 | 差距 |
|------|----------|------|
| 查看需求列表 | `GET /demands` ✅ | 正常 |
| 查看需求详情 | `GET /demands/:id` ✅ | 正常 |
| 审核需求 | ❌ | 无审核流程 |
| 查看匹配结果 | `GET /demands/:id/matches` ✅ | 正常 |
| 强制关闭需求 | `POST /demands/:id/close` ✅ | 正常 |

**兼容性：** ✅ 基本兼容。审核是可选功能。

### 2.5 User 管理

| 功能 | 现有能力 | 差距 |
|------|----------|------|
| 用户列表 | `GET /users` ✅ (已认证) | 无平台级用户搜索 |
| 查看用户详情 | `GET /users/:id` ✅ | 正常 |
| 用户状态管理 | `PATCH /users/:id` ✅ | 正常 |
| 权限管理 | ❌ | 仅组织级 `OrganizationMember.role` |

**兼容性：** ⚠️ 部分兼容。无系统级权限模型。

### 2.6 System 管理

| 功能 | 现有能力 | 差距 |
|------|----------|------|
| 操作日志 | `AuditLog` Model ✅ (未使用) | 无 API、无自动写入 |
| 审计追踪 | `WorkflowEvent` ✅ | 覆盖部分业务事件 |
| 系统参数配置 | ❌ | 无系统配置表 |
| 通知管理 | `Notification` Model ✅ (未使用) | 无 API、无触发逻辑 |

**兼容性：** ⚠️ 部分兼容。AuditLog 和 Notification 模型存在但无实现。

---

## 3. 当前架构兼容性检查

### 3.1 权限系统

| 角色 | 是否支持 | 实现方式 | 差距 |
|------|----------|----------|------|
| **Admin (系统级)** | ❌ 不支持 | — | 需要新角色或新模型 |
| **Admin (组织级)** | ✅ 支持 | `OrganizationMember.role = 'ADMIN'` | 仅 `organization-members` 使用 |
| **Supplier** | ✅ 支持 | `Organization.type = 'supplier'` | 通过 View Layer |
| **Buyer** | ✅ 支持 | `Organization.type = 'buyer'` | 通过 View Layer |
| **MEMBER** | ✅ 支持 | `OrganizationMember.role = 'MEMBER'` | 默认角色 |

**关键发现：** 当前 RBAC 是**组织级**的。系统级 Admin（平台管理员）需要新概念：
- 方案 A：新增 `Role.SUPER_ADMIN` 枚举值，通过 `User.isSystemAdmin` 字段区分
- 方案 B：新增 `AdminUser` 模型，独立于 `OrganizationMember`

### 3.2 Organization 模型

| 字段 | 当前状态 | Admin 需求 |
|------|----------|-----------|
| 基本信息 (name, type, status) | ✅ | ✅ |
| 审核状态 (reviewStatus) | ❌ | 需要 |
| 审核人 (reviewedBy) | ❌ | 需要 |
| 审核时间 (reviewedAt) | ❌ | 需要 |
| 认证时间 (verifiedAt) | ❌ | 需要 |
| Logo / 简介 | ❌ | 可选 |

**兼容性：** ⚠️ 缺少审核/认证字段，但 `status` 字段可部分替代（ACTIVE = 已审核通过）。

### 3.3 Product 模型

| 字段 | 当前状态 | Admin 需求 |
|------|----------|-----------|
| 基本信息 (name, model, description) | ✅ | ✅ |
| 状态 (status: DRAFT/ACTIVE) | ✅ | ✅ |
| 审核状态 (reviewStatus) | ❌ | 需要 |
| 审核人 (reviewedBy) | ❌ | 需要 |
| 审核时间 (reviewedAt) | ❌ | 需要 |
| SEO 字段 (metaTitle, metaDescription) | ❌ | 可选 |
| 上架/下架 (status) | ✅ | ✅ 可用 status 替代 |

**兼容性：** ⚠️ 缺少审核/SEO 字段，但核心管理功能可用现有 `status` 字段实现。

### 3.4 Demand 模型

| 字段 | 当前状态 | Admin 需求 |
|------|----------|-----------|
| 基本信息 (title, description, status) | ✅ | ✅ |
| 状态流转 (DRAFT→PUBLISHED→CLOSED) | ✅ | ✅ |
| 审核流程 | ❌ | 可选 |
| 强制关闭 | ✅ | ✅ close() 端点 |

**兼容性：** ✅ 基本兼容。Demand 的管理功能已较完善。

### 3.5 WorkflowEvent / AuditLog

| 需求 | 当前状态 | 说明 |
|------|----------|------|
| 业务事件记录 | ✅ `WorkflowEvent` | 覆盖 Demand、RFQ、RFQResponse |
| 通用审计日志 | ⚠️ `AuditLog` Model 存在 | 无 API、无自动写入、无任何代码使用 |
| 操作审计 | ⚠️ 部分 | 仅 `WorkflowEvent` 覆盖事件 |

**兼容性：** ⚠️ `AuditLog` 模型存在但完全未实现（无 controller、无 service、无自动写入）。

---

## 4. 缺失能力分析

### 4.1 必须新增（Blocking for Admin V1）

| 缺失 | 严重度 | 说明 | 方案 |
|------|--------|------|------|
| 系统级 Admin 角色 | 🔴 高 | 无平台管理员概念 | 方案 A：`Role.SUPER_ADMIN` + `User.isSystemAdmin` |
| Admin 认证守卫 | 🔴 高 | 无系统级权限验证 | 新建 `SystemAdminGuard` 或扩展 `RolesGuard` |
| Organization 审核 | 🟡 中 | 无审核流程 | 可暂用 `status` 字段替代 |
| 平台级 API 端点 | 🟡 中 | 无 `/admin/*` 端点 | 新建 `admin/` 模块 |

### 4.2 应该新增（Important for Admin V1）

| 缺失 | 严重度 | 说明 |
|------|--------|------|
| `AuditLog` API 实现 | 🟡 中 | Model 已存在，需实现 controller/service |
| Dashboard 统计 API | 🟡 中 | 需新建 `admin/dashboard` 端点 |
| Product 审核状态 | 🟡 中 | 需新增 `reviewStatus` 字段（或复用 `status`） |
| `Notification` API 实现 | 🟡 中 | Model 已存在，需实现 controller/service |

### 4.3 可以延后（Nice to Have）

| 缺失 | 严重度 | 说明 |
|------|--------|------|
| SEO 字段 | 🟢 低 | 可延后至 M9+ |
| 系统参数配置表 | 🟢 低 | 可延后至 M9+ |
| 批量操作 | 🟢 低 | 可延后至 M9+ |
| 数据导出 | 🟢 低 | 可延后至 M9+ |
| 角色权限矩阵 | 🟢 低 | 可延后至 M9+ |

### 4.4 特别检查

| 检查项 | 是否存在 | 是否需要 |
|--------|----------|----------|
| `AdminRole` 模型 | ❌ 不存在 | ✅ 需要（或复用 `Role` 枚举） |
| `Permission` 模型 | ❌ 不存在 | 🟡 可延后（V1 用角色即可） |
| `AuditLog` 模型 | ✅ 存在 | ✅ 需要实现 API |
| `Notification` 模型 | ✅ 存在 | 🟡 可延后 |

---

## 5. Schema 影响评估

### 5.1 判断：是否需要修改 Schema？

**推荐：Admin V1 零 Schema 变更。**

### 5.2 如何通过现有模型实现

| Admin 需求 | 现有实现 | 说明 |
|------------|----------|------|
| 系统级 Admin | `Role.SUPER_ADMIN` 枚举值（无 Schema 变更） | 仅新增枚举值，roles.guard 已支持 |
| Organization 审核 | `Organization.status` 字段 | ACTIVE = 已审核，INACTIVE/SUSPENDED = 未审核/已禁用 |
| Product 审核 | `Product.status` 字段 | ACTIVE = 已审核/已上架，DRAFT = 待审核 |
| 操作审计 | `AuditLog` 模型（已存在） | 仅需实现 service 自动写入 |
| Dashboard | 聚合查询现有模型 | 纯查询，无 Schema 影响 |
| 通知 | `Notification` 模型（已存在） | 仅需实现 API |

### 5.3 如果未来需要 Schema 变更（Admin V2+）

| 变更 | 原因 | 优先级 |
|------|------|--------|
| `Organization.reviewStatus` | 独立审核状态 | P2 |
| `Organization.reviewedBy` | 审核人追溯 | P2 |
| `Product.reviewStatus` | 独立审核状态 | P2 |
| `User.isSystemAdmin` | 系统管理员标记 | P1 |
| `SystemConfig` 模型 | 系统参数配置 | P3 |

---

## 6. 对 M8.2.2 的影响

### 6.1 判断

**M8.2.2 Matching Engine 可以继续开发，无需等待或调整。**

### 6.2 理由

| 因素 | 分析 |
|------|------|
| Schema 冻结 | Matching Engine 不修改 Schema，Admin 也不要求立即修改 |
| 模块独立性 | `matching/` 模块与 `admin/` 模块完全不相关 |
| 权限系统 | Matching Engine 在 publish() 内部触发，不涉及 Admin 权限 |
| 数据模型 | 匹配使用 `DemandParameter` + `ProductParameterValue`，不受 Admin 影响 |
| 构建影响 | 零交叉，无冲突 |

### 6.3 建议

```
M8.2.2 Matching Engine 实现
     ↓
M8.3 匹配优化与测试
     ↓
M9 Admin System V1（零 Schema 变更）
     ↓
M9.x Admin System V2（可选 Schema 变更）
```

---

## 7. 推荐路线

### 推荐路线图

```
当前: M8.2.1 架构设计 ✅
  ↓
M8.2.2: Matching Engine 实现（核心匹配逻辑）
  ↓
M8.2.3: Matching Engine 测试与优化
  ↓
M8.3: 匹配结果通知 / 手动重新匹配
  ↓
M9.1: Admin System V1 — 零 Schema 变更
  │     ├── admin/ 模块
  │     ├── Dashboard API
  │     ├── 系统级 Admin 角色（Role.SUPER_ADMIN）
  │     ├── Organization 审核（复用 status）
  │     ├── Product 审核（复用 status）
  │     └── AuditLog 实现
  ↓
M9.2: Admin System V2 — 可选 Schema 变更
       ├── SystemConfig 模型
       ├── Organization.reviewStatus
       ├── Product.reviewStatus
       └── SEO 字段
```

### 关键原则

1. **M8.x 期间不新增 Admin 功能** — 专注于 Matching Engine
2. **M9 Admin V1 优先零 Schema 变更** — 复用现有字段
3. **M9 Admin V2 按需 Schema 变更** — 审核/SEO 字段

---

## 8. Build Verification

**命令：** `npx nest build`

**结果：** Exit Code 0 ✅

**说明：** 本阶段零代码变更，构建不受影响。

---

## 9. Final Status

**Overall: ✅ 审查完成，M8.2.2 可继续**

| 检查项 | 结果 |
|--------|------|
| 架构统计 | ✅ 70 端点 / 19 模块 / 21 模型 / 9 迁移 |
| 权限系统兼容 | ⚠️ 组织级 ADMIN 存在，缺少系统级 Admin |
| Organization 模型兼容 | ⚠️ 缺少审核字段，可用 status 替代 |
| Product 模型兼容 | ⚠️ 缺少审核/SEO 字段，可用 status 替代 |
| Demand 模型兼容 | ✅ 基本兼容 |
| AuditLog 兼容 | ⚠️ 模型存在但未实现 |
| Schema 影响 | ✅ Admin V1 可零 Schema 变更 |
| M8.2.2 影响 | ✅ 无影响，可继续 |
| Build | ✅ Exit 0 |

---

## 10. Next Step Recommendation

**M8.2.2 — Matching Engine Implementation**

基于 [73_M8.2.1_Matching_Engine_Architecture_Report.md](73_M8.2.1_Matching_Engine_Architecture_Report.md) 的设计，实现匹配引擎核心代码。

**Admin 系统延后至 M9**，当前架构已具备基础兼容性，无需在 M8 期间修改。

---

**报告结束。** Schema: NO CHANGE · Migration: NO CHANGE · Code: NO CHANGE