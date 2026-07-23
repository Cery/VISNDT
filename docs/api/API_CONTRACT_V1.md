# API_CONTRACT_V1 — Architecture Freeze

> Generated: 2026-07-21 | Phase: M8.7 Architecture Freeze
> Status: FROZEN — 74 endpoints

---

## 1. API Overview

| Category | Count |
|----------|:---:|
| Public (no auth) | 31 |
| JWT (authenticated) | 24 |
| ADMIN (JWT + ADMIN role) | 19 |
| **Total** | **74** |

**Base URL**: `/api/v1`

---

## 2. Authentication

### 2.1 POST /auth/register

| Property | Value |
|----------|-------|
| Auth | Public |
| Rate Limit | 5 req/min |
| Request DTO | `RegisterDto` { email, passwordHash, name?, inviteToken } |
| Response | `{ data: { id, email, name, organizationId } }` |
| Errors | 400 (validation), 401 (no invite token), 409 (email exists) |

### 2.2 POST /auth/login

| Property | Value |
|----------|-------|
| Auth | Public |
| Rate Limit | 5 req/min |
| Request DTO | `LoginDto` { email, passwordHash } |
| Response | `{ data: { accessToken, user: { id, email, name, organizationId } } }` |
| Errors | 400 (validation), 401 (invalid credentials) |

### 2.3 GET /auth/me

| Property | Value |
|----------|-------|
| Auth | JWT |
| Response | `{ data: { id, email, name, organizationId, status } }` |
| Errors | 401 (no token) |

### 2.4 POST /auth/invitations

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Rate Limit | 20 req/min |
| Request DTO | `CreateInvitationDto` { email, organizationId, role } |
| Response | `{ data: { id, email, token, expiresAt } }` |
| Errors | 400 (validation), 401 (no token), 403 (not ADMIN) |

---

## 3. Users

### 3.1 GET /users

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Query | `PaginationDto` { page, pageSize } |
| Response | `{ data: { data: User[], total, page, pageSize, totalPages } }` |
| Errors | 401, 403 |

### 3.2 GET /users/:id

| Property | Value |
|----------|-------|
| Auth | JWT (own or ADMIN) |
| Response | `{ data: User }` |
| Errors | 401, 403, 404 |

### 3.3 PATCH /users/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateUserDto` { email?, passwordHash?, status?, organizationId? } |
| Response | `{ data: User }` |
| Errors | 400, 401, 403, 404 |

---

## 4. Organizations

### 4.1 GET /organizations

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Query | `PaginationDto` { page, pageSize } |
| Response | `{ data: { data: Organization[], total, page, pageSize, totalPages } }` |
| Errors | 401, 403 |

### 4.2 GET /organizations/:id

| Property | Value |
|----------|-------|
| Auth | JWT (own org or ADMIN) |
| Response | `{ data: Organization (with members) }` |
| Errors | 401, 403, 404 |

### 4.3 POST /organizations

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateOrganizationDto` { name, type } |
| Response | `{ data: Organization }` |
| Errors | 400, 401, 403 |

### 4.4 PATCH /organizations/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateOrganizationDto` { name?, type?, status? } |
| Response | `{ data: Organization }` |
| Errors | 400, 401, 403, 404 |

### 4.5 GET /organizations/:id/members

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: OrganizationMember[] }` |
| Errors | 404 |

### 4.6 POST /organizations/:id/members

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateOrganizationMemberDto` { userId, role } |
| Response | `{ data: OrganizationMember }` |
| Errors | 400, 401, 403 |

---

## 5. Products

### 5.1 GET /products

| Property | Value |
|----------|-------|
| Auth | Public |
| Query | `SearchProductDto` { keyword?, categoryId?, status?, sortBy?, sortOrder?, page?, pageSize?, parameterFilters? } |
| Response | `{ data: { data: Product[], total, page, pageSize, totalPages } }` |
| Errors | 400 |

### 5.2 GET /products/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Product }` |
| Errors | 404 |

### 5.3 POST /products

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateProductDto` { categoryId, name, model?, description? } |
| Response | `{ data: Product }` |
| Errors | 400, 401, 403 |

### 5.4 PATCH /products/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateProductDto` { categoryId?, name?, model?, description?, status? } |
| Response | `{ data: Product }` |
| Errors | 400, 401, 403, 404 |

---

## 6. Product Categories

### 6.1 GET /product-categories

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ProductCategory[] }` |

### 6.2 GET /product-categories/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ProductCategory }` |
| Errors | 404 |

### 6.3 POST /product-categories

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateProductCategoryDto` { name, slug, parentId? } |
| Response | `{ data: ProductCategory }` |
| Errors | 400, 401, 403 |

### 6.4 PATCH /product-categories/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateProductCategoryDto` { name?, slug?, parentId? } |
| Response | `{ data: ProductCategory }` |
| Errors | 400, 401, 403, 404 |

---

## 7. Product Media

### 7.1 GET /products/:productId/media

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ProductMedia[] }` |
| Errors | 404 |

### 7.2 GET /products/:productId/media/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ProductMedia }` |
| Errors | 404 |

### 7.3 POST /products/:productId/media

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateProductMediaDto` { mediaType, title?, description?, isPrimary?, displayOrder? } |
| Response | `{ data: ProductMedia }` |
| Errors | 400, 401, 403 |

### 7.4 PATCH /products/:productId/media/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateProductMediaDto` { mediaType?, title?, description?, isPrimary?, displayOrder? } |
| Response | `{ data: ProductMedia }` |
| Errors | 400, 401, 403, 404 |

### 7.5 DELETE /products/:productId/media/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Response | `{ data: { message: "Deleted" } }` |
| Errors | 401, 403, 404 |

---

## 8. Product Parameters

### 8.1 GET /products/:id/parameters

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ProductParameterValue[] }` |
| Errors | 404 |

### 8.2 POST /products/:id/parameters

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateProductParameterDto` { parameterDefinitionId, value, valueNumber? } |
| Response | `{ data: ProductParameterValue }` |
| Errors | 400, 401, 403 |

---

## 9. Parameter Groups

### 9.1 GET /parameter-groups

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ParameterGroup[] }` |

### 9.2 GET /parameter-groups/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ParameterGroup }` |
| Errors | 404 |

### 9.3 POST /parameter-groups

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateParameterGroupDto` { name, code, description? } |
| Response | `{ data: ParameterGroup }` |
| Errors | 400, 401, 403 |

### 9.4 PATCH /parameter-groups/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateParameterGroupDto` { name?, code?, description? } |
| Response | `{ data: ParameterGroup }` |
| Errors | 400, 401, 403, 404 |

---

## 10. Parameter Definitions

### 10.1 GET /parameter-definitions

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ParameterDefinition[] }` |

### 10.2 GET /parameter-definitions/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: ParameterDefinition }` |
| Errors | 404 |

### 10.3 POST /parameter-definitions

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `CreateParameterDefinitionDto` { name, code, dataType, parameterGroupId?, unit?, required? } |
| Response | `{ data: ParameterDefinition }` |
| Errors | 400, 401, 403 |

### 10.4 PATCH /parameter-definitions/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateParameterDefinitionDto` { name?, code?, dataType?, parameterGroupId?, unit?, required? } |
| Response | `{ data: ParameterDefinition }` |
| Errors | 400, 401, 403, 404 |

---

## 11. Offers

### 11.1 GET /offers

| Property | Value |
|----------|-------|
| Auth | Public |
| Query | `PaginationDto` { page, pageSize } |
| Response | `{ data: { data: Offer[], total, page, pageSize, totalPages } }` |

### 11.2 GET /offers/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Offer }` |
| Errors | 404 |

### 11.3 POST /offers

| Property | Value |
|----------|-------|
| Auth | JWT |
| Request DTO | `CreateOfferDto` { productId, title, description? } |
| Response | `{ data: Offer }` |
| Errors | 400, 401 |

### 11.4 PATCH /offers/:id

| Property | Value |
|----------|-------|
| Auth | JWT (org-scoped) |
| Request DTO | `UpdateOfferDto` { title?, description?, status? } |
| Response | `{ data: Offer }` |
| Errors | 400, 401, 404 |

---

## 12. Demands

### 12.1 GET /demands

| Property | Value |
|----------|-------|
| Auth | Public |
| Query | `SearchDemandDto` { keyword?, status?, page?, pageSize? } |
| Response | `{ data: { data: Demand[], total, page, pageSize, totalPages } }` |

### 12.2 GET /demands/my

| Property | Value |
|----------|-------|
| Auth | JWT |
| Response | `{ data: Demand[] }` (user's own demands) |

### 12.3 GET /demands/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Demand }` |
| Errors | 404 |

### 12.4 POST /demands

| Property | Value |
|----------|-------|
| Auth | JWT |
| Request DTO | `CreateDemandDto` { title, description?, categoryId?, budgetRange?, quantity?, quantityUnit?, expectedDeliveryDate?, contactName?, contactPhone?, contactEmail?, contactVisible? } |
| Response | `{ data: Demand }` |
| Errors | 400, 401 |

### 12.5 PATCH /demands/:id

| Property | Value |
|----------|-------|
| Auth | JWT (owner) |
| Request DTO | `UpdateDemandDto` { title?, description?, status?, budgetRange?, quantity?, quantityUnit?, expectedDeliveryDate?, contactName?, contactPhone?, contactEmail?, contactVisible? } |
| Response | `{ data: Demand }` |
| Errors | 400, 401, 403, 404 |

### 12.6 POST /demands/:id/publish

| Property | Value |
|----------|-------|
| Auth | JWT (owner) |
| Response | `{ data: Demand }` |
| Errors | 400, 401, 403, 404 |

### 12.7 POST /demands/:id/close

| Property | Value |
|----------|-------|
| Auth | JWT (owner) |
| Response | `{ data: Demand }` |
| Errors | 400, 401, 403, 404 |

### 12.8 POST /demands/:id/rematch

| Property | Value |
|----------|-------|
| Auth | JWT (owner) |
| Rate Limit | 10 req/min |
| Response | `{ data: MatchResultDto }` |
| Errors | 400, 401, 403, 404 |

### 12.9 Demand Parameters

| Method | Path | Auth | DTO |
|--------|------|------|-----|
| POST | `/demands/:id/parameters` | JWT (owner) | `CreateDemandParameterDto` |
| GET | `/demands/:id/parameters` | JWT (owner) | — |
| PATCH | `/demands/:id/parameters/:paramId` | JWT (owner) | `UpdateDemandParameterDto` |
| DELETE | `/demands/:id/parameters/:paramId` | JWT (owner) | — |

### 12.10 Demand Matches

| Method | Path | Auth | DTO |
|--------|------|------|-----|
| GET | `/demands/:id/matches` | JWT (org-scoped) | `QueryMatchDto` |
| GET | `/demands/:id/matches/:matchId` | JWT (org-scoped) | — |
| PATCH | `/demands/:id/matches/:matchId` | JWT (org-scoped) | `UpdateMatchStatusDto` |

---

## 13. RFQs

### 13.1 GET /rfqs

| Property | Value |
|----------|-------|
| Auth | Public |
| Query | `PaginationDto` { page, pageSize } |
| Response | `{ data: { data: RFQ[], total, page, pageSize, totalPages } }` |

### 13.2 GET /rfqs/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: RFQ }` |
| Errors | 404 |

### 13.3 POST /rfqs

| Property | Value |
|----------|-------|
| Auth | JWT |
| Request DTO | `CreateRfqDto` { demandId } |
| Response | `{ data: RFQ }` |
| Errors | 400, 401 |

### 13.4 PATCH /rfqs/:id

| Property | Value |
|----------|-------|
| Auth | JWT (owner) |
| Request DTO | `UpdateRfqDto` { status } |
| Response | `{ data: RFQ }` |
| Errors | 400, 401, 403, 404 |

---

## 14. RFQ Responses

### 14.1 GET /rfqs/:id/responses

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: RFQResponse[] }` |

### 14.2 POST /rfqs/:id/responses

| Property | Value |
|----------|-------|
| Auth | JWT |
| Request DTO | `CreateRfqResponseDto` { offerId?, message? } |
| Response | `{ data: RFQResponse }` |
| Errors | 400, 401 |

### 14.3 GET /rfq-responses/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: RFQResponse }` |
| Errors | 404 |

### 14.4 PATCH /rfq-responses/:id

| Property | Value |
|----------|-------|
| Auth | JWT (org-scoped) |
| Request DTO | `UpdateRfqResponseDto` { status?, message? } |
| Response | `{ data: RFQResponse }` |
| Errors | 400, 401, 403, 404 |

---

## 15. Suppliers

### 15.1 GET /suppliers

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Organization[] }` (supplier type) |

### 15.2 GET /suppliers/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Organization }` |
| Errors | 404 |

### 15.3 GET /suppliers/:id/products

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: Product[] }` |
| Errors | 404 |

### 15.4 GET /suppliers/:id/matches

| Property | Value |
|----------|-------|
| Auth | JWT (org-scoped) |
| Response | `{ data: DemandMatch[] }` |
| Errors | 401, 403, 404 |

---

## 16. Workflow Events

### 16.1 GET /workflow-events

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: WorkflowEvent[] }` |

### 16.2 GET /workflow-events/:id

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ data: WorkflowEvent }` |
| Errors | 404 |

### 16.3 POST /workflow-events

| Property | Value |
|----------|-------|
| Auth | JWT |
| Rate Limit | 60 req/min |
| Request DTO | `CreateWorkflowEventDto` { entityType, entityId, action, metadata? } |
| Response | `{ data: WorkflowEvent }` |
| Errors | 400, 401, 403 |

---

## 17. Admin APIs

### 17.1 GET /admin/dashboard/stats

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Response | `{ data: { users: { total, active }, organizations: { total }, products: { total }, demands: { total, published }, matching: { totalMatches } } }` |
| Errors | 401, 403 |

### 17.2 PATCH /admin/demands/:id

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Request DTO | `UpdateDemandDto` (bypasses owner check) |
| Response | `{ data: Demand }` |
| Errors | 400, 401, 403, 404 |

### 17.3 GET /admin/matching/stats

| Property | Value |
|----------|-------|
| Auth | JWT + ADMIN |
| Response | `{ data: { totalMatches, averageScore, hardFailCount, rematchCount } }` |
| Errors | 401, 403 |

---

## 18. Health

### 18.1 GET /health

| Property | Value |
|----------|-------|
| Auth | Public |
| Response | `{ status: "ok", timestamp }` |

---

## 19. Common Response Format

### Success

```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Pagination

```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

## 20. HTTP Status Codes

| Code | Meaning |
|:---:|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation / State transition |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (wrong role) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |