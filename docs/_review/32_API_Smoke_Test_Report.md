# API Smoke Test Report

**日期**: 2026-07-17  
**范围**: `apps/api/src/` (14 Controller, 25 DTO)  
**最终状态**: **PASS** (1 处可接受例外)

---

## 1. 路由注册检查

### 1.1 按 Controller

| # | Controller | GET | POST | PATCH | 小计 | 状态 |
|---|-----------|-----|------|-------|------|------|
| 1 | HealthController | 1 | — | — | 1 | PASS |
| 2 | UsersController | 2 | 1 | 1 | 4 | PASS |
| 3 | OrganizationsController | 2 | 1 | 1 | 4 | PASS |
| 4 | OrganizationMembersController | 1 | 1 | — | 2 | PASS |
| 5 | ProductCategoriesController | 2 | 1 | 1 | 4 | PASS |
| 6 | ProductsController | 2 | 1 | 1 | 4 | PASS |
| 7 | ProductParametersController | 1 | 1 | — | 2 | PASS |
| 8 | ParameterGroupsController | 2 | 1 | 1 | 4 | PASS |
| 9 | ParameterDefinitionsController | 2 | 1 | 1 | 4 | PASS |
| 10 | OffersController | 2 | 1 | 1 | 4 | PASS |
| 11 | DemandsController | 2 | 1 | 1 | 4 | PASS |
| 12 | RfqsController | 2 | 1 | 1 | 4 | PASS |
| 13 | RfqResponsesController | 2 | 1 | 1 | 4 | PASS |
| 14 | WorkflowEventsController | 2 | 1 | — | 3 | PASS |
| **总计** | | **25** | **13** | **10** | **48** | |

### 1.2 按 HTTP 方法

| 方法 | 端点数 | 占比 |
|------|--------|------|
| GET | 25 | 52.1% |
| POST | 13 | 27.1% |
| PATCH | 10 | 20.8% |
| PUT | 0 | 0% |
| DELETE | 0 | 0% |

### 1.3 路由详情

#### GET 列表 (13)

| Controller | 路由 |
|-----------|------|
| Health | `GET /health` |
| Users | `GET /users` |
| Organizations | `GET /organizations` |
| OrganizationMembers | `GET /organizations/:id/members` |
| ProductCategories | `GET /product-categories` |
| Products | `GET /products` |
| ProductParameters | `GET /products/:id/parameters` |
| ParameterGroups | `GET /parameter-groups` |
| ParameterDefinitions | `GET /parameter-definitions` |
| Offers | `GET /offers` |
| Demands | `GET /demands` |
| RFQs | `GET /rfqs` |
| RFQ Responses | `GET /rfqs/:id/responses` |
| Workflow Events | `GET /workflow-events` |

#### GET 详情 (11)

| Controller | 路由 |
|-----------|------|
| Users | `GET /users/:id` |
| Organizations | `GET /organizations/:id` |
| ProductCategories | `GET /product-categories/:id` |
| Products | `GET /products/:id` |
| ParameterGroups | `GET /parameter-groups/:id` |
| ParameterDefinitions | `GET /parameter-definitions/:id` |
| Offers | `GET /offers/:id` |
| Demands | `GET /demands/:id` |
| RFQs | `GET /rfqs/:id` |
| RFQ Responses | `GET /rfq-responses/:id` |
| Workflow Events | `GET /workflow-events/:id` |

#### POST (13)

| Controller | 路由 |
|-----------|------|
| Users | `POST /users` |
| Organizations | `POST /organizations` |
| OrganizationMembers | `POST /organizations/:id/members` |
| ProductCategories | `POST /product-categories` |
| Products | `POST /products` |
| ProductParameters | `POST /products/:id/parameters` |
| ParameterGroups | `POST /parameter-groups` |
| ParameterDefinitions | `POST /parameter-definitions` |
| Offers | `POST /offers` |
| Demands | `POST /demands` |
| RFQs | `POST /rfqs` |
| RFQ Responses | `POST /rfqs/:id/responses` |
| Workflow Events | `POST /workflow-events` |

#### PATCH (10)

| Controller | 路由 |
|-----------|------|
| Users | `PATCH /users/:id` |
| Organizations | `PATCH /organizations/:id` |
| ProductCategories | `PATCH /product-categories/:id` |
| Products | `PATCH /products/:id` |
| ParameterGroups | `PATCH /parameter-groups/:id` |
| ParameterDefinitions | `PATCH /parameter-definitions/:id` |
| Offers | `PATCH /offers/:id` |
| Demands | `PATCH /demands/:id` |
| RFQs | `PATCH /rfqs/:id` |
| RFQ Responses | `PATCH /rfq-responses/:id` |

---

## 2. ApiResponse\<T\> 返回格式检查

### 2.1 导入状态

| Controller | 导入 ApiResponse | 状态 |
|-----------|-----------------|------|
| UsersController | 是 | PASS |
| OrganizationsController | 是 | PASS |
| OrganizationMembersController | 是 | PASS |
| ProductCategoriesController | 是 | PASS |
| ProductsController | 是 | PASS |
| ProductParametersController | 是 | PASS |
| ParameterGroupsController | 是 | PASS |
| ParameterDefinitionsController | 是 | PASS |
| OffersController | 是 | PASS |
| DemandsController | 是 | PASS |
| RfqsController | 是 | PASS |
| RfqResponsesController | 是 | PASS |
| WorkflowEventsController | 是 | PASS |
| HealthController | **否** | **WARNING** |

### 2.2 返回格式检查

| Controller | 端点数 | ApiResponse.ok() | 其他格式 | 合规率 |
|-----------|--------|-----------------|---------|--------|
| UsersController | 4 | 4 | 0 | 100% |
| OrganizationsController | 4 | 4 | 0 | 100% |
| OrganizationMembersController | 2 | 2 | 0 | 100% |
| ProductCategoriesController | 4 | 4 | 0 | 100% |
| ProductsController | 4 | 4 | 0 | 100% |
| ProductParametersController | 2 | 2 | 0 | 100% |
| ParameterGroupsController | 4 | 4 | 0 | 100% |
| ParameterDefinitionsController | 4 | 4 | 0 | 100% |
| OffersController | 4 | 4 | 0 | 100% |
| DemandsController | 4 | 4 | 0 | 100% |
| RfqsController | 4 | 4 | 0 | 100% |
| RfqResponsesController | 4 | 4 | 0 | 100% |
| WorkflowEventsController | 3 | 3 | 0 | 100% |
| HealthController | 1 | 0 | 1 (plain object) | 0% |

**WARNING**: `HealthController.check()` 返回 `{ status, database }` 而非 `ApiResponse`。健康检查使用自定义格式是合理的设计选择，不影响业务 API 一致性。

---

## 3. DTO Validation 检查

### 3.1 DTO 清单

| # | DTO 文件 | 模块 | class-validator | 字段 | 状态 |
|---|---------|------|:---:|------|:---:|
| 1 | create-user.dto.ts | users | 有 | 4 | PASS |
| 2 | update-user.dto.ts | users | 有 | 4 | PASS |
| 3 | create-organization.dto.ts | organizations | 有 | 2 | PASS |
| 4 | update-organization.dto.ts | organizations | 有 | 3 | PASS |
| 5 | add-member.dto.ts | organization-members | 有 | 2 | PASS |
| 6 | create-product-category.dto.ts | product-categories | 有 | 3 | PASS |
| 7 | update-product-category.dto.ts | product-categories | 有 | 3 | PASS |
| 8 | create-product.dto.ts | products | 有 | 4 | PASS |
| 9 | update-product.dto.ts | products | 有 | 5 | PASS |
| 10 | set-product-parameter.dto.ts | product-parameters | 有 | 2 | PASS |
| 11 | create-parameter-group.dto.ts | parameter-groups | 有 | 3 | PASS |
| 12 | update-parameter-group.dto.ts | parameter-groups | 有 | 3 | PASS |
| 13 | create-parameter-definition.dto.ts | parameter-definitions | 有 | 6 | PASS |
| 14 | update-parameter-definition.dto.ts | parameter-definitions | 有 | 6 | PASS |
| 15 | create-offer.dto.ts | offers | 有 | 4 | PASS |
| 16 | update-offer.dto.ts | offers | 有 | 3 | PASS |
| 17 | create-demand.dto.ts | demands | 有 | 6 | PASS |
| 18 | update-demand.dto.ts | demands | 有 | 5 | PASS |
| 19 | create-rfq.dto.ts | rfqs | 有 | 2 | PASS |
| 20 | update-rfq.dto.ts | rfqs | 有 | 1 | PASS |
| 21 | create-rfq-response.dto.ts | rfq-responses | 有 | 3 | PASS |
| 22 | update-rfq-response.dto.ts | rfq-responses | 有 | 1 | PASS |
| 23 | create-workflow-event.dto.ts | workflow-events | 有 | 5 | PASS |
| 24 | pagination.dto.ts | common | 有 | 2 | PASS |
| 25 | api-response.dto.ts | common | **无** | — | 例外 |

**总计**: 24/25 DTO 有 class-validator 装饰器。

### 3.2 例外说明

| DTO | 原因 | 风险 |
|-----|------|------|
| `api-response.dto.ts` | 响应包装器，非请求体，无需验证 | 无 |

### 3.3 ValidationPipe 配置

`main.ts:13`: `new ValidationPipe({ whitelist: true, transform: true })`

| 配置 | 值 | 说明 |
|------|-----|------|
| whitelist | true | 自动剥离未装饰字段 |
| transform | true | 自动类型转换 |

---

## 4. 最终判定

```
API Smoke Test: PASS
```

| 检查维度 | 结果 | 状态 |
|---------|------|:---:|
| GET 路由注册 | 25/25 | PASS |
| POST 路由注册 | 13/13 | PASS |
| PATCH 路由注册 | 10/10 | PASS |
| ApiResponse\<T\> 格式 | 47/48 (Health 例外) | PASS |
| DTO validation | 24/24 Domain DTO | PASS |
| ValidationPipe 配置 | 已启用 | PASS |

### 发现的问题

| 级别 | 描述 | 建议 |
|------|------|------|
| WARNING | HealthController 不使用 ApiResponse\<T\> | 可接受。健康检查返回自定义格式是常见实践 |

### 总结

- 48 个 API 端点全部正确注册
- 13 个 Domain Controller 100% 使用 ApiResponse\<T\> 格式
- 24 个 Domain DTO 100% 使用 class-validator 装饰器
- ValidationPipe 已正确配置 (whitelist + transform)
- 数据库操作通过 Service 层隔离，无 Controller 直接访问 Prisma