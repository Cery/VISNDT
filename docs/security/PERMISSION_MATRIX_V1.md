# PERMISSION_MATRIX_V1 — Architecture Freeze

> Generated: 2026-07-21 | Phase: M8.7 Architecture Freeze
> Status: FROZEN — RBAC permission model

---

## 1. Role Definitions

| Role | Description | Source |
|------|-------------|--------|
| **Public** | No authentication required | — |
| **MEMBER** | Authenticated user belonging to an organization | `Role.MEMBER` |
| **ADMIN** | Authenticated user with ADMIN role in any organization | `Role.ADMIN` |

---

## 2. Users Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List all users | `GET /users` | 401 | 403 | **200** |
| Get user detail | `GET /users/:id` | 401 | **200** (own) | **200** |
| Update user | `PATCH /users/:id` | 401 | 403 | **200** |

---

## 3. Organizations Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List all organizations | `GET /organizations` | 401 | 403 | **200** |
| Get organization detail | `GET /organizations/:id` | 401 | **200** (own) | **200** |
| Create organization | `POST /organizations` | 401 | 403 | **201** |
| Update organization | `PATCH /organizations/:id` | 401 | 403 | **200** |
| List members | `GET /organizations/:id/members` | **200** | **200** | **200** |
| Add member | `POST /organizations/:id/members` | 401 | 403 | **201** |

---

## 4. Products Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List products | `GET /products` | **200** | **200** | **200** |
| Get product detail | `GET /products/:id` | **200** | **200** | **200** |
| Create product | `POST /products` | 401 | 403 | **201** |
| Update product | `PATCH /products/:id` | 401 | 403 | **200** |

---

## 5. Product Categories Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List categories | `GET /product-categories` | **200** | **200** | **200** |
| Get category | `GET /product-categories/:id` | **200** | **200** | **200** |
| Create category | `POST /product-categories` | 401 | 403 | **201** |
| Update category | `PATCH /product-categories/:id` | 401 | 403 | **200** |

---

## 6. Product Media Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List media | `GET /products/:productId/media` | **200** | **200** | **200** |
| Get media | `GET /products/:productId/media/:id` | **200** | **200** | **200** |
| Create media | `POST /products/:productId/media` | 401 | 403 | **201** |
| Update media | `PATCH /products/:productId/media/:id` | 401 | 403 | **200** |
| Delete media | `DELETE /products/:productId/media/:id` | 401 | 403 | **200** |

---

## 7. Product Parameters Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List parameters | `GET /products/:id/parameters` | **200** | **200** | **200** |
| Set parameter | `POST /products/:id/parameters` | 401 | 403 | **201** |

---

## 8. Parameter Groups Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List groups | `GET /parameter-groups` | **200** | **200** | **200** |
| Get group | `GET /parameter-groups/:id` | **200** | **200** | **200** |
| Create group | `POST /parameter-groups` | 401 | 403 | **201** |
| Update group | `PATCH /parameter-groups/:id` | 401 | 403 | **200** |

---

## 9. Parameter Definitions Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List definitions | `GET /parameter-definitions` | **200** | **200** | **200** |
| Get definition | `GET /parameter-definitions/:id` | **200** | **200** | **200** |
| Create definition | `POST /parameter-definitions` | 401 | 403 | **201** |
| Update definition | `PATCH /parameter-definitions/:id` | 401 | 403 | **200** |

---

## 10. Offers Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List offers | `GET /offers` | **200** | **200** | **200** |
| Get offer | `GET /offers/:id` | **200** | **200** | **200** |
| Create offer | `POST /offers` | 401 | **201** (own org) | **201** |
| Update offer | `PATCH /offers/:id` | 401 | **200** (own org) | **200** (own org) |

---

## 11. Demands Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List demands | `GET /demands` | **200** | **200** | **200** |
| My demands | `GET /demands/my` | 401 | **200** | **200** |
| Get demand | `GET /demands/:id` | **200** | **200** | **200** |
| Create demand | `POST /demands` | 401 | **201** | **201** |
| Update demand | `PATCH /demands/:id` | 401 | **200** (owner) | **200** (owner) |
| Publish demand | `POST /demands/:id/publish` | 401 | **200** (owner) | **200** (owner) |
| Close demand | `POST /demands/:id/close` | 401 | **200** (owner) | **200** (owner) |
| Rematch demand | `POST /demands/:id/rematch` | 401 | **200** (owner) | **200** (owner) |
| Demand parameters | `POST/GET/PATCH/DELETE` | 401 | **200** (owner) | **200** (owner) |
| Demand matches | `GET/PATCH` | 401 | **200** (org-scoped) | **200** (org-scoped) |

---

## 12. RFQs Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List RFQs | `GET /rfqs` | **200** | **200** | **200** |
| Get RFQ | `GET /rfqs/:id` | **200** | **200** | **200** |
| Create RFQ | `POST /rfqs` | 401 | **201** | **201** |
| Update RFQ | `PATCH /rfqs/:id` | 401 | **200** (owner) | **200** (owner) |

---

## 13. RFQ Responses Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List responses | `GET /rfqs/:id/responses` | **200** | **200** | **200** |
| Create response | `POST /rfqs/:id/responses` | 401 | **201** | **201** |
| Get response | `GET /rfq-responses/:id` | **200** | **200** | **200** |
| Update response | `PATCH /rfq-responses/:id` | 401 | **200** (org-scoped) | **200** (org-scoped) |

---

## 14. Suppliers Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List suppliers | `GET /suppliers` | **200** | **200** | **200** |
| Get supplier | `GET /suppliers/:id` | **200** | **200** | **200** |
| Supplier products | `GET /suppliers/:id/products` | **200** | **200** | **200** |
| Supplier matches | `GET /suppliers/:id/matches` | 401 | **200** (org-scoped) | **200** (org-scoped) |

---

## 15. Workflow Events Module

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| List events | `GET /workflow-events` | **200** | **200** | **200** |
| Get event | `GET /workflow-events/:id` | **200** | **200** | **200** |
| Create event | `POST /workflow-events` | 401 | **201** (org-scoped) | **201** (org-scoped) |

---

## 16. Admin APIs

| Operation | Endpoint | Public | MEMBER | ADMIN |
|-----------|----------|:---:|:---:|:---:|
| Dashboard stats | `GET /admin/dashboard/stats` | 401 | 403 | **200** |
| Admin demand override | `PATCH /admin/demands/:id` | 401 | 403 | **200** |
| Matching stats | `GET /admin/matching/stats` | 401 | 403 | **200** |

---

## 17. Permissions Summary

| Role | Read (Public) | Write (Own) | Write (Any) | Admin |
|------|:---:|:---:|:---:|:---:|
| **Public** | Yes (31 endpoints) | No | No | No |
| **MEMBER** | Yes | Yes (own org resources) | No | No |
| **ADMIN** | Yes | Yes | Yes (19 endpoints) | Yes |

### Key Rules

1. **Public endpoints** are read-only list/detail operations
2. **MEMBER** can create resources in their own organization, cannot modify other organizations
3. **ADMIN** can manage users, organizations, products, categories, parameters, and has dashboard access
4. **Ownership isolation** is enforced in service layer for Offers, Demands, RFQs, RFQ Responses
5. **Organization isolation** uses `organizationId` from JWT, not from client input
6. **Rate limiting** protects auth endpoints (5 req/min) and rematch (10 req/min)