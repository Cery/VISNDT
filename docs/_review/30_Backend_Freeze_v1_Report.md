# Backend Freeze v1.0 Baseline Report

**日期**: 2026-07-17  
**版本**: v1.0 Baseline  
**状态**: **FROZEN**

---

## 1. 总览

| 指标 | 数值 |
|------|------|
| Domain Module | 13 |
| Controller | 14 (含 Health) |
| Service | 14 (含 Prisma) |
| DTO | 25 (23 Domain + 2 Common) |
| API Endpoint | 47 (Domain) + 1 (Health) = 48 |
| Prisma Model | 18 |
| Prisma Enum | 13 |
| Migration | 1 (`20260716152642_init`) |

---

## 2. Domain Module 清单

### 2.1 Identity & Organization

| # | Module | Controller | Service | DTO | API |
|---|--------|-----------|---------|-----|-----|
| 1 | `users` | users.controller.ts | users.service.ts | create-user.dto.ts, update-user.dto.ts | 4 |
| 2 | `organizations` | organizations.controller.ts | organizations.service.ts | create-organization.dto.ts, update-organization.dto.ts | 4 |
| 3 | `organization-members` | organization-members.controller.ts | organization-members.service.ts | add-member.dto.ts | 2 |

**用户认证**: 未实现 (无 AuthModule, 无 JWT/Passport)

### 2.2 Standard Product Center

| # | Module | Controller | Service | DTO | API |
|---|--------|-----------|---------|-----|-----|
| 4 | `product-categories` | product-categories.controller.ts | product-categories.service.ts | create-product-category.dto.ts, update-product-category.dto.ts | 4 |
| 5 | `products` | products.controller.ts | products.service.ts | create-product.dto.ts, update-product.dto.ts | 4 |
| 6 | `parameter-groups` | parameter-groups.controller.ts | parameter-groups.service.ts | create-parameter-group.dto.ts, update-parameter-group.dto.ts | 4 |
| 7 | `parameter-definitions` | parameter-definitions.controller.ts | parameter-definitions.service.ts | create-parameter-definition.dto.ts, update-parameter-definition.dto.ts | 4 |
| 8 | `product-parameters` | product-parameters.controller.ts | product-parameters.service.ts | set-product-parameter.dto.ts | 2 |

### 2.3 Offer Center

| # | Module | Controller | Service | DTO | API |
|---|--------|-----------|---------|-----|-----|
| 9 | `offers` | offers.controller.ts | offers.service.ts | create-offer.dto.ts, update-offer.dto.ts | 4 |

### 2.4 Demand Center

| # | Module | Controller | Service | DTO | API |
|---|--------|-----------|---------|-----|-----|
| 10 | `demands` | demands.controller.ts | demands.service.ts | create-demand.dto.ts, update-demand.dto.ts | 4 |

### 2.5 RFQ Workflow

| # | Module | Controller | Service | DTO | API |
|---|--------|-----------|---------|-----|-----|
| 11 | `rfqs` | rfqs.controller.ts | rfqs.service.ts | create-rfq.dto.ts, update-rfq.dto.ts | 4 |
| 12 | `rfq-responses` | rfq-responses.controller.ts | rfq-responses.service.ts | create-rfq-response.dto.ts, update-rfq-response.dto.ts | 4 |
| 13 | `workflow-events` | workflow-events.controller.ts | workflow-events.service.ts | create-workflow-event.dto.ts | 3 |

### 2.6 Infrastructure

| Module | Controller | Service | API |
|--------|-----------|---------|-----|
| `health` | health.controller.ts | — | 1 |
| `prisma` | — | prisma.service.ts | — |

---

## 3. API 统计

### 3.1 按 Controller

| Controller | GET | POST | PATCH | 小计 |
|-----------|-----|------|-------|------|
| HealthController | 1 | — | — | 1 |
| UsersController | 2 | 1 | 1 | 4 |
| OrganizationsController | 2 | 1 | 1 | 4 |
| OrganizationMembersController | 1 | 1 | — | 2 |
| ProductCategoriesController | 2 | 1 | 1 | 4 |
| ProductsController | 2 | 1 | 1 | 4 |
| ProductParametersController | 1 | 1 | — | 2 |
| ParameterGroupsController | 2 | 1 | 1 | 4 |
| ParameterDefinitionsController | 2 | 1 | 1 | 4 |
| OffersController | 2 | 1 | 1 | 4 |
| DemandsController | 2 | 1 | 1 | 4 |
| RfqsController | 2 | 1 | 1 | 4 |
| RfqResponsesController | 2 | 1 | 1 | 4 |
| WorkflowEventsController | 2 | 1 | — | 3 |
| **总计** | **25** | **13** | **10** | **48** |

### 3.2 按 HTTP 方法

| 方法 | 端点数 |
|------|--------|
| GET | 25 |
| POST | 13 |
| PATCH | 10 |
| PUT | 0 |
| DELETE | 0 |

---

## 4. 数据库一致性

| 检查项 | 基线 | 当前 | 状态 |
|--------|------|------|------|
| Model 数量 | 18 | 18 | 一致 |
| Enum 数量 | 13 | 13 | 一致 |
| Migration | 1 (`20260716152642_init`) | 1 | 一致 |
| schema.prisma 修改 | — | 无 | 冻结 |

### 4.1 Prisma Model 清单

| # | Model | 表名 | 业务域 |
|---|-------|------|--------|
| 1 | User | `user` | Identity |
| 2 | Organization | `organization` | Organization |
| 3 | OrganizationMember | `organization_member` | Organization |
| 4 | ProductCategory | `product_category` | Product Center |
| 5 | Product | `product` | Product Center |
| 6 | ParameterGroup | `parameter_group` | Product Center |
| 7 | ParameterDefinition | `parameter_definition` | Product Center |
| 8 | ParameterOption | `parameter_option` | Product Center |
| 9 | ProductParameterValue | `product_parameter_value` | Product Center |
| 10 | ProductParameterDefinition | `product_parameter_definition` | Product Center |
| 11 | Offer | `offer` | Offer Center |
| 12 | Demand | `demand` | Demand Center |
| 13 | RFQ | `rfq` | RFQ Workflow |
| 14 | RFQResponse | `rfq_response` | RFQ Workflow |
| 15 | WorkflowEvent | `workflow_event` | RFQ Workflow |
| 16 | Notification | `notification` | Notification |
| 17 | FileAsset | `file_asset` | File Management |
| 18 | AuditLog | `audit_log` | Audit |

### 4.2 Prisma Enum 清单

| # | Enum | 值 |
|---|------|-----|
| 1 | OrganizationStatus | ACTIVE, SUSPENDED |
| 2 | UserStatus | ACTIVE, INACTIVE |
| 3 | OfferStatus | DRAFT, ACTIVE, INACTIVE, ARCHIVED |
| 4 | DemandStatus | DRAFT, OPEN, IN_PROGRESS, CLOSED, CANCELLED |
| 5 | RFQStatus | DRAFT, OPEN, RESPONDING, CLOSED, CANCELLED |
| 6 | RFQResponseStatus | SUBMITTED, VIEWED, ACCEPTED, REJECTED |
| 7 | WorkflowEntityType | DEMAND, RFQ, RFQ_RESPONSE |
| 8 | WorkflowAction | CREATED, SUBMITTED, OPENED, RESPONDED, ACCEPTED, REJECTED, CLOSED |
| 9 | NotificationType | SYSTEM, RFQ_UPDATE, RESPONSE_UPDATE, DEMAND_UPDATE |
| 10 | NotificationStatus | UNREAD, READ |
| 11 | FileEntityType | USER_AVATAR, ORGANIZATION_LOGO, PRODUCT_IMAGE, DEMAND_ATTACHMENT |
| 12 | FileType | IMAGE, DOCUMENT, OTHER |
| 13 | AuditAction | CREATE, UPDATE, DELETE, STATUS_CHANGE |

---

## 5. 架构检查

### 5.1 分层架构

```
Controller → Service → PrismaService
```

| Domain | Controller | Service | Prisma 访问 | 合规 |
|--------|-----------|---------|-----------|------|
| Health | HealthController | — | 直接 (健康检查) | 例外 |
| Users | UsersController | UsersService | UsersService | 是 |
| Organizations | OrganizationsController | OrganizationsService | OrganizationsService | 是 |
| Org Members | OrganizationMembersController | OrganizationMembersService | OrganizationMembersService | 是 |
| Product Categories | ProductCategoriesController | ProductCategoriesService | ProductCategoriesService | 是 |
| Products | ProductsController | ProductsService | ProductsService | 是 |
| Product Parameters | ProductParametersController | ProductParametersService | ProductParametersService | 是 |
| Parameter Groups | ParameterGroupsController | ParameterGroupsController | ParameterGroupsService | 是 |
| Parameter Defs | ParameterDefinitionsController | ParameterDefinitionsService | ParameterDefinitionsService | 是 |
| Offers | OffersController | OffersService | OffersService | 是 |
| Demands | DemandsController | DemandsService | DemandsService | 是 |
| RFQs | RfqsController | RfqsService | RfqsService | 是 |
| RFQ Responses | RfqResponsesController | RfqResponsesService | RfqResponsesService | 是 |
| Workflow Events | WorkflowEventsController | WorkflowEventsService | WorkflowEventsService | 是 |

**结论**: 分层架构合规，仅 HealthController 例外（健康检查设计）。

### 5.2 统一响应格式

所有 Controller 使用 `ApiResponse<T>` 包装响应。

### 5.3 DTO 验证

所有 Domain DTO 使用 `class-validator` 装饰器，`main.ts` 配置 `ValidationPipe({ whitelist: true, transform: true })`。

### 5.4 Swagger

所有 Controller 具备 `@ApiTags`，所有端点具备 `@ApiOperation`，所有 DTO 字段具备 `@ApiProperty` / `@ApiPropertyOptional`。

---

## 6. 已完成业务链

| 业务链 | Phase | 状态 |
|--------|-------|------|
| Product Center | M2 | 完成 |
| Offer Center | M3 | 完成 |
| Demand Center | M4 | 完成 |
| RFQ Workflow | M5 | 完成 |

### 6.1 业务闭环

```
Organization → Product (参数化) → Offer → Demand → RFQ → RFQResponse → WorkflowEvent
```

---

## 7. 未完成模块

| 模块 | 原因 | 依赖 |
|------|------|------|
| Authentication | 未实现 AuthModule | JWT/Passport |
| Search | 未实现 SearchModule | — |
| Notification | 未实现 NotificationModule | Notification Model 已存在 |
| FileAsset | 未实现 FileModule | FileAsset Model 已存在 |
| AuditLog | 未实现 AuditModule | AuditLog Model 已存在 |
| Frontend | 未启动 | Backend API |

---

## 8. 基础设施清单

| 组件 | 文件 | 状态 |
|------|------|------|
| 入口 | `main.ts` | 已配置 |
| 全局前缀 | `api/v1` | 已配置 |
| CORS | `enableCors()` | 已启用 |
| ValidationPipe | `whitelist: true, transform: true` | 已配置 |
| HttpExceptionFilter | `common/filters/http-exception.filter.ts` | 已配置 |
| LoggingInterceptor | `common/interceptors/logging.interceptor.ts` | 已配置 |
| Swagger | `DocumentBuilder` + `/api/docs` | 已配置 |
| ConfigModule | `@nestjs/config` (isGlobal) | 已配置 |
| PrismaService | `prisma/prisma.service.ts` | 全局可用 |

---

## 9. 文件统计

| 类别 | 数量 |
|------|------|
| Module | 15 |
| Controller | 14 |
| Service | 14 |
| Domain DTO | 23 |
| Common DTO | 2 |
| Filter | 1 |
| Interceptor | 1 |
| **总计** | **70** |

---

## 10. 冻结声明

```
Backend Freeze v1.0: FROZEN
```

本报告记录了当前 Backend 的完整基线状态。以下内容已冻结:

- `schema.prisma` (18 Model, 13 Enum)
- `migration/20260716152642_init/`
- 所有 13 个 Domain Module
- 所有 48 个 API 端点
- 分层架构 (Controller → Service → PrismaService)
- 统一响应格式 (ApiResponse\<T\>)
- Swagger 文档

**评审依据**: Report #21 (Schema Freeze), #24 (Stabilization Audit), #29 (RFQ Final Audit)