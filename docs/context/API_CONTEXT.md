# API CONTEXT

**Last Updated:** 2026-08-01  
**Phase:** M13.2.9  
**Status:** ✅ ACTIVE — New endpoints allowed with audit

---

## 1. Backend Modules (24)

| # | Module | Path | Description |
|---|---|---|---|
| 1 | `AuthModule` | `auth/` | JWT authentication, guards, roles, invitations |
| 2 | `UsersModule` | `users/` | User CRUD (ADMIN + ORG_ADMIN) |
| 3 | `OrganizationsModule` | `organizations/` | Organization CRUD (ADMIN) |
| 4 | `OrganizationMembersModule` | `organization-members/` | Membership management |
| 5 | `ProductsModule` | `products/` | Product CRUD (Global Catalog) |
| 6 | `ProductCategoriesModule` | `product-categories/` | Category tree management |
| 7 | `ProductMediaModule` | `product-media/` | Product media (images/documents) |
| 8 | `ProductParametersModule` | `product-parameters/` | Product-parameter mapping |
| 9 | `ParameterGroupsModule` | `parameter-groups/` | Parameter grouping |
| 10 | `ParameterDefinitionsModule` | `parameter-definitions/` | Parameter definitions |
| 11 | `OffersModule` | `offers/` | Organization offers |
| 12 | `DemandsModule` | `demands/` | Demands + matching |
| 13 | `RfqsModule` | `rfqs/` | RFQ management |
| 14 | `RfqResponsesModule` | `rfq-responses/` | RFQ responses |
| 15 | `SuppliersModule` | `suppliers/` | Supplier profiles |
| 16 | `NotificationsModule` | `notifications/` | Notification system |
| 17 | `WorkflowEventsModule` | `workflow-events/` | Workflow audit trail |
| 18 | `MatchingModule` | `matching/` | Matching engine (internal, no controller) |
| 19 | `FileAssetModule` | `file-asset/` | File upload, download, orphans |
| 20 | `StorageModule` | `storage/` | S3/MinIO abstraction (@Global) |
| 21 | `AdminModule` | `admin/` | Admin dashboard stats |
| 22 | `HealthModule` | `health/` | Health check endpoint |
| 23 | `PrismaModule` | `prisma/` | Database service (@Global) |
| 24 | `ConfigModule` | (NestJS) | Configuration (@Global, from @nestjs/config) |

---

## 2. API Endpoint Categories

### 2.1 Auth Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public (5 req/min) | User login → JWT token |
| `POST` | `/auth/register` | Public (5 req/min) | User registration (requires invitation token) |
| `POST` | `/auth/invitations` | ADMIN/ORG_ADMIN (20 req/min) | Create invitation token |

### 2.2 FileAsset Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/files/upload` | ADMIN | Upload file (max 10MB, MIME validation) |
| `GET` | `/files/:id/download` | Public | Download via signed URL redirect |
| `DELETE` | `/files/:id` | ADMIN | Delete file (DB + S3) |
| `GET` | `/files/orphans` | ADMIN | List orphan FileAssets | ✨ M13.2.7.4 |
| `POST` | `/files/orphans/cleanup` | ADMIN | Clean up specified orphans (max 100) | ✨ M13.2.7.4 |

### 2.3 ProductMedia Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/products/:productId/media` | Public | List product media |
| `GET` | `/products/:productId/media/:id` | Public | Get media detail |
| `POST` | `/products/:productId/media` | ADMIN | Create media (with entityId update + rollback) |
| `PATCH` | `/products/:productId/media/:id` | ADMIN | Update media |
| `DELETE` | `/products/:productId/media/:id` | ADMIN | Delete media (cascade delete FileAsset) |

### 2.4 Product Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | Public | List products |
| `GET` | `/products/:id` | Public | Get product detail |
| `POST` | `/products` | ADMIN | Create product |
| `PATCH` | `/products/:id` | ADMIN | Update product |
| `DELETE` | `/products/:id` | ADMIN | Delete product |

### 2.5 Admin Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard` | ADMIN | Dashboard statistics |
| `GET` | `/admin/matching/stats` | ADMIN | Matching statistics |

### 2.6 Other Endpoints

| Module | Endpoints | Auth |
|---|---|---|
| Users | CRUD (5 endpoints) | ADMIN, ORG_ADMIN |
| Organizations | CRUD (4 endpoints) | ADMIN |
| Categories | CRUD (3 endpoints) | ADMIN |
| Parameters | CRUD (6 endpoints) | ADMIN |
| Offers | Read (2 endpoints) | ADMIN |
| Demands | Read + Rematch (3 endpoints) | ADMIN |
| RFQs | CRUD (5 endpoints) | ADMIN |
| RFQ Responses | Read (1 endpoint) | ADMIN |
| Suppliers | Read (2 endpoints) | ADMIN |
| Notifications | Read (2 endpoints) | ADMIN |
| WorkflowEvents | POST (1 endpoint) | ADMIN (60 req/min) |

---

## 3. API Conventions

### 3.1 Response Format

All endpoints use the unified response format:

```typescript
{
  status: "ok" | "error",
  message: string,
  data: T | null
}
```

### 3.2 Auth Guards

| Guard | Purpose |
|---|---|
| `JwtAuthGuard` | Validates JWT token |
| `RolesGuard` | Checks user role (ADMIN, ORG_ADMIN, etc.) |
| `ThrottlerGuard` | Rate limiting (global + per-endpoint) |

### 3.3 Rate Limits

| Scope | Limit |
|---|---|
| Global default | 100 req/min |
| `POST /auth/login` | 5 req/min |
| `POST /auth/register` | 5 req/min |
| `POST /auth/invitations` | 20 req/min |
| `POST /demands/:id/rematch` | 10 req/min |
| `POST /workflow-events` | 60 req/min |

### 3.4 Swagger

All authenticated endpoints must include `@ApiBearerAuth()`. All endpoints must include `@ApiOperation()`.

---

## 4. New API Endpoint Rules

| Rule | Description |
|---|---|
| **Route Order** | Literal paths must be defined BEFORE dynamic `:id` paths in controller |
| **Auth** | New endpoints must specify auth requirements (Public, ADMIN, etc.) |
| **Response** | Must use `ApiResponse.ok()` or `ApiResponse.error()` |
| **DTO** | New request bodies must use `class-validator` decorators |
| **Swagger** | Must include `@ApiOperation()` and `@ApiBearerAuth()` (if authenticated) |
| **Freeze** | Cannot modify existing endpoint paths, signatures, or responses |

---

*Generated by M13.2.9 Context Handoff System Design*