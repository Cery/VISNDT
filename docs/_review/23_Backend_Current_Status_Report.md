# VISNDT V2 Backend 当前状态报告

**日期**: 2026-07-17  
**扫描范围**: `apps/api/src` + `database/prisma/`  
**扫描方式**: 代码实际扫描，非文档推测

---

## 1. 当前完成模块

### 1.1 基础设施模块

| 模块 | 路径 | 文件 | 状态 |
|------|------|------|------|
| PrismaModule | `src/prisma/` | prisma.module.ts, prisma.service.ts | 完成 |
| HealthModule | `src/health/` | health.module.ts, health.controller.ts | 完成 |
| ConfigModule | NestJS 内置 | — | 完成 (全局) |
| HttpExceptionFilter | `src/common/filters/` | http-exception.filter.ts | 完成 |
| LoggingInterceptor | `src/common/interceptors/` | logging.interceptor.ts | 完成 |
| PaginationDto | `src/common/dto/` | pagination.dto.ts | 完成 |
| ApiResponse | `src/common/dto/` | api-response.dto.ts | 完成 |
| Swagger | `src/main.ts` | DocumentBuilder 配置 | 完成 |

### 1.2 业务模块

| 模块 | 路径 | Controller | Service | DTO | 端点 |
|------|------|-----------|---------|-----|------|
| Users | `src/users/` | users.controller.ts | users.service.ts | create-user.dto.ts, update-user.dto.ts | 4 |
| Organizations | `src/organizations/` | organizations.controller.ts | organizations.service.ts | create-organization.dto.ts, update-organization.dto.ts | 4 |
| Organization Members | `src/organization-members/` | organization-members.controller.ts | organization-members.service.ts | add-member.dto.ts | 2 |
| Product Categories | `src/product-categories/` | product-categories.controller.ts | product-categories.service.ts | create-product-category.dto.ts, update-product-category.dto.ts | 4 |
| Products | `src/products/` | products.controller.ts | products.service.ts | create-product.dto.ts, update-product.dto.ts | 4 |
| Parameter Groups | `src/parameter-groups/` | parameter-groups.controller.ts | parameter-groups.service.ts | create-parameter-group.dto.ts, update-parameter-group.dto.ts | 4 |
| Parameter Definitions | `src/parameter-definitions/` | parameter-definitions.controller.ts | parameter-definitions.service.ts | create-parameter-definition.dto.ts, update-parameter-definition.dto.ts | 4 |
| Product Parameters | `src/product-parameters/` | product-parameters.controller.ts | product-parameters.service.ts | set-product-parameter.dto.ts | 2 |
| Offers | `src/offers/` | offers.controller.ts | offers.service.ts | create-offer.dto.ts, update-offer.dto.ts | 4 |
| Demands | `src/demands/` | demands.controller.ts | demands.service.ts | create-demand.dto.ts, update-demand.dto.ts | 4 |

**总计**: 11 个 Controller, 10 个 Service, 20 个 DTO, 37 个 API 端点

---

## 2. API 端点清单 (37)

| # | 分组 | 方法 | 路径 | 说明 |
|---|------|------|------|------|
| 1 | Health | GET | `/api/v1/health` | 健康检查 + 数据库连接 |
| 2 | Users | GET | `/api/v1/users` | 分页列表 |
| 3 | Users | GET | `/api/v1/users/:id` | 按 ID 查询 |
| 4 | Users | POST | `/api/v1/users` | 创建用户 |
| 5 | Users | PATCH | `/api/v1/users/:id` | 更新用户 |
| 6 | Organizations | GET | `/api/v1/organizations` | 分页列表 |
| 7 | Organizations | GET | `/api/v1/organizations/:id` | 按 ID 查询 |
| 8 | Organizations | POST | `/api/v1/organizations` | 创建组织 |
| 9 | Organizations | PATCH | `/api/v1/organizations/:id` | 更新组织 |
| 10 | Organization Members | GET | `/api/v1/organizations/:id/members` | 列出成员 |
| 11 | Organization Members | POST | `/api/v1/organizations/:id/members` | 添加成员 |
| 12 | Product Categories | GET | `/api/v1/product-categories` | 分页列表 |
| 13 | Product Categories | GET | `/api/v1/product-categories/:id` | 按 ID 查询 |
| 14 | Product Categories | POST | `/api/v1/product-categories` | 创建分类 |
| 15 | Product Categories | PATCH | `/api/v1/product-categories/:id` | 更新分类 |
| 16 | Products | GET | `/api/v1/products` | 分页列表 |
| 17 | Products | GET | `/api/v1/products/:id` | 按 ID 查询 |
| 18 | Products | POST | `/api/v1/products` | 创建产品 |
| 19 | Products | PATCH | `/api/v1/products/:id` | 更新产品 |
| 20 | Parameter Groups | GET | `/api/v1/parameter-groups` | 分页列表 |
| 21 | Parameter Groups | GET | `/api/v1/parameter-groups/:id` | 按 ID 查询 |
| 22 | Parameter Groups | POST | `/api/v1/parameter-groups` | 创建参数组 |
| 23 | Parameter Groups | PATCH | `/api/v1/parameter-groups/:id` | 更新参数组 |
| 24 | Parameter Definitions | GET | `/api/v1/parameter-definitions` | 分页列表 |
| 25 | Parameter Definitions | GET | `/api/v1/parameter-definitions/:id` | 按 ID 查询 |
| 26 | Parameter Definitions | POST | `/api/v1/parameter-definitions` | 创建参数定义 |
| 27 | Parameter Definitions | PATCH | `/api/v1/parameter-definitions/:id` | 更新参数定义 |
| 28 | Product Parameters | GET | `/api/v1/products/:id/parameters` | 列出产品参数值 |
| 29 | Product Parameters | POST | `/api/v1/products/:id/parameters` | 设置产品参数值 |
| 30 | Offers | GET | `/api/v1/offers` | 分页列表 |
| 31 | Offers | GET | `/api/v1/offers/:id` | 按 ID 查询 |
| 32 | Offers | POST | `/api/v1/offers` | 创建 Offer |
| 33 | Offers | PATCH | `/api/v1/offers/:id` | 更新 Offer |
| 34 | Demands | GET | `/api/v1/demands` | 分页列表 |
| 35 | Demands | GET | `/api/v1/demands/:id` | 按 ID 查询 |
| 36 | Demands | POST | `/api/v1/demands` | 创建需求 |
| 37 | Demands | PATCH | `/api/v1/demands/:id` | 更新需求 |

---

## 3. 数据库状态

### 3.1 迁移

| 迁移 | 名称 | 状态 |
|------|------|------|
| 初始迁移 | `20260716152642_init` | 已执行 (单次全量) |

注: 实际采用单次 init 迁移，而非计划中的 4 次分步迁移。

### 3.2 Schema 统计

| 类别 | 数量 |
|------|------|
| Model | 18 |
| Enum | 13 |
| Relation (FK) | 24 |
| Unique Index | 10 |
| Non-Unique Index | 32 |
| 总字段数 | 137 |

### 3.3 Model 清单

| # | Model | 表名 | 所在 Migration | 状态 |
|---|-------|------|---------------|------|
| 1 | User | `user` | Migration 001 | 已实现 API |
| 2 | Organization | `organization` | Migration 001 | 已实现 API |
| 3 | OrganizationMember | `organization_member` | Migration 001 | 已实现 API |
| 4 | ProductCategory | `product_category` | Migration 002 | 已实现 API |
| 5 | Product | `product` | Migration 002 | 已实现 API |
| 6 | ParameterGroup | `parameter_group` | Migration 002 | 已实现 API |
| 7 | ParameterDefinition | `parameter_definition` | Migration 002 | 已实现 API |
| 8 | ParameterOption | `parameter_option` | Migration 002 | 已实现 API |
| 9 | ProductParameterValue | `product_parameter_value` | Migration 002 | 已实现 API |
| 10 | ProductParameterDefinition | `product_parameter_definition` | Migration 002 | 已实现 API |
| 11 | Offer | `offer` | Migration 003 | 已实现 API |
| 12 | Demand | `demand` | Migration 003 | 已实现 API |
| 13 | RFQ | `rfq` | Migration 003 | **数据库存在，API 未实现** |
| 14 | RFQResponse | `rfq_response` | Migration 003 | **数据库存在，API 未实现** |
| 15 | WorkflowEvent | `workflow_event` | Migration 004 | **数据库存在，API 未实现** |
| 16 | Notification | `notification` | Migration 004 | **数据库存在，API 未实现** |
| 17 | FileAsset | `file_asset` | Migration 004 | **数据库存在，API 未实现** |
| 18 | AuditLog | `audit_log` | Migration 004 | **数据库存在，API 未实现** |

---

## 4. Phase 完成情况

| Phase | 名称 | 计划 Migration | 数据库 | API | 状态 |
|-------|------|---------------|--------|-----|------|
| M0 | Foundation | — | PostgreSQL + Prisma | NestJS + Swagger | **完成** |
| M1 | Identity & Organization | 001 | User, Organization, OrganizationMember | /users, /organizations, /organizations/:id/members | **完成** |
| M2 | Standard Product Center | 002 | ProductCategory, Product, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | /product-categories, /products, /parameter-groups, /parameter-definitions, /products/:id/parameters | **完成** |
| M3 | Offer Center | 003 | Offer | /offers | **完成** |
| M4 | Demand Center | 003 | Demand | /demands | **完成** |
| M5 | RFQ Workflow | 003 | RFQ, RFQResponse | **未实现** | **待开发** |
| M6 | Search | — | — | **未实现** | **待开发** |
| M7 | Notification | 004 | Notification, WorkflowEvent, FileAsset, AuditLog | **未实现** | **待开发** |
| — | Frontend | — | — | **未开始** | **待开发** |

---

## 5. 未实现功能

### 5.1 RFQ 模块 (Phase M5)

数据库已有 `rfq` 和 `rfq_response` 两个 Model，但缺少:

- `rfqs/rfqs.module.ts`
- `rfqs/rfqs.controller.ts` (GET/POST/PATCH)
- `rfqs/rfqs.service.ts`
- `rfqs/dto/create-rfq.dto.ts`
- `rfqs/dto/update-rfq.dto.ts`
- 在 `app.module.ts` 中注册

### 5.2 Notification 模块 (Phase M7)

数据库已有 `notification`、`workflow_event`、`file_asset`、`audit_log` 四个 Model，但缺少:

- `notifications/notifications.module.ts`
- `notifications/notifications.controller.ts`
- `notifications/notifications.service.ts`
- 对应的 DTO 文件
- 在 `app.module.ts` 中注册

### 5.3 Search 模块 (Phase M6)

- 无搜索实现
- 数据库层面需添加 PostgreSQL Full Text Search 索引和 pg_trgm 扩展

### 5.4 Auth 模块

- 无 `/auth` API 端点
- 无认证中间件 (AuthGuard)
- 无 JWT/Session 实现

### 5.5 Frontend

- `apps/web` 未初始化 (Next.js 项目尚未创建)

---

## 6. 代码质量摘要

来源于最近一次代码质量检查 (Report #22):

| 指标 | 结果 |
|------|------|
| TypeScript 编译 | 0 errors |
| Unused Import | 0 (已修复 1 处) |
| Unused Variable | 0 |
| `any` 类型 | 1 处 (低风险) |
| ESLint | 未配置 |
| Swagger 覆盖 | 11/11 Controller, 20/20 DTO |

---

## 7. 下一阶段建议

### 7.1 优先级排序

基于业务闭环顺序:

```
1. Phase M5: RFQ Workflow (rfq + rfq_response API)
2. Phase M7: Notification (notification + workflow_event API)
3. Phase M6: Search (PostgreSQL FTS + pg_trgm)
4. Auth Module (/auth + JWT Guard)
5. Phase 8: Frontend (apps/web Next.js)
```

### 7.2 RFQ 模块 (Phase M5) — 建议下一批

数据库已就绪，需新增:

- `rfqs/rfqs.module.ts` — 模块声明
- `rfqs/rfqs.controller.ts` — Controller (GET/POST/PATCH rfqs, GET/POST rfq responses)
- `rfqs/rfqs.service.ts` — Service (Prisma 查询)
- `rfqs/dto/` — create-rfq.dto.ts, update-rfq.dto.ts, create-rfq-response.dto.ts
- 在 `app.module.ts` 中注册 RFQsModule

预估端点: 6-7 个 (RFQ CRUD + RFQResponse CRUD)

### 7.3 Notification 模块 (Phase M7) — 建议后续

- `notifications/notifications.module.ts`
- `notifications/notifications.controller.ts`
- `notifications/notifications.service.ts`
- 对应 DTOs
- 在 `app.module.ts` 中注册

---

## 8. 文件统计

| 类别 | 文件数 |
|------|--------|
| Module | 13 (含 app.module.ts 和 prisma.module.ts) |
| Controller | 11 |
| Service | 11 (含 prisma.service.ts) |
| DTO | 20 |
| Filter | 1 |
| Interceptor | 1 |
| 其他 (main.ts) | 1 |
| **总计** | **58** |

---

## 9. 总结

```
VISNDT V2 Backend 当前状态:
  ─ 已完成: Phase M0-M4 (5/8 后端 Phase)
  ─ API 端点: 37 个
  ─ 数据库: 18 个 Model (含 6 个待 API 化)
  ─ 下一阶段: Phase M5 RFQ Workflow
  ─ 编译状态: 0 errors
  ─ Swagger: 完整覆盖
```