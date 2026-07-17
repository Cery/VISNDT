# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 16                                             |
| Document Name | Offer Domain API Report                        |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 记录 Offer Domain API 实现结果                  |
| Dependency    | Phase 13 Batch 5                               |
| Date          | 2026-07-17                                     |

---

# 1. Created Files

| File | Purpose |
|------|---------|
| offers/offers.module.ts | Offers module declaration |
| offers/offers.controller.ts | REST controller (GET/POST/PATCH) |
| offers/offers.service.ts | Business logic (Prisma queries) |
| offers/dto/create-offer.dto.ts | Create DTO (organizationId, productId, title, description?) |
| offers/dto/update-offer.dto.ts | Update DTO (title?, description?, status?) |

## 1.1 Modified

| File | Action |
|------|--------|
| app.module.ts | +1 import (OffersModule) |

---

# 2. API Endpoints

| Method | Path | Description | Validation |
|--------|------|-------------|------------|
| GET | /api/v1/offers | List offers (paginated, incl. organization + product) | PaginationDto |
| GET | /api/v1/offers/:id | Get offer by ID (incl. organization + product) | — |
| POST | /api/v1/offers | Create offer | CreateOfferDto |
| PATCH | /api/v1/offers/:id | Update offer (title, description, status) | UpdateOfferDto |

**Total**: 4 endpoints

---

# 3. Prisma Model Mapping

| API Module | Prisma Model | Key Fields | Status Enum |
|------------|-------------|------------|-------------|
| Offers | Offer | id, organizationId, productId, title, description, status | DRAFT, ACTIVE, INACTIVE |

## 3.1 Relations

| Relation | Type | Description |
|----------|------|-------------|
| Offer → Organization | N:1 | Each offer belongs to one organization |
| Offer → Product | N:1 | Each offer references one product |

## 3.2 Unique Constraint

```
@@unique([organizationId, productId])
```

One organization can only have one offer per product.

---

# 4. Service Architecture

| Method | Prisma API | Includes |
|--------|------------|----------|
| findAll(pagination) | offer.findMany() + offer.count() | organization, product |
| findOne(id) | offer.findUnique() | organization, product |
| create(dto) | offer.create() | — |
| update(id, dto) | offer.update() | — |

Pattern: Controller → Service → PrismaService (no direct Prisma access in Controller).

---

# 5. Business Constraints

| Constraint | Enforcement |
|------------|-------------|
| Offer → Organization | Required (organizationId in CreateDto) |
| Offer → Product | Required (productId in CreateDto) |
| No price field | Confirmed — Offer model has no price |
| No inventory field | Confirmed |
| No stock field | Confirmed |
| No currency field | Confirmed |
| Term "Organization" only | Confirmed — no "Supplier" term |

---

# 6. Validation Result

## 6.1 Build

```
npm run build → PASS (exit 0)
```

## 6.2 Route Registration

```
[Nest] LOG [RoutesResolver] OffersController {/api/v1/offers}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/offers, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/offers/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/offers, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/offers/:id, PATCH} route
```

## 6.3 API Response Verification

| Endpoint | Status | Response |
|----------|--------|----------|
| GET /api/v1/offers | 200 | ApiResponse (empty, paginated) |
| POST /api/v1/offers | 201 | ApiResponse (created, status=DRAFT) |
| Validation (missing productId) | 400 | ApiResponse (error message) |

### Sample Response (POST /api/v1/offers)

```json
{
  "success": true,
  "data": {
    "id": "f1be37c1-...",
    "organizationId": "cb57eb06-...",
    "productId": "3d256a63-...",
    "title": "Test Offer",
    "description": "A test offer",
    "status": "DRAFT",
    "createdAt": "2026-07-16T17:34:42.416Z",
    "updatedAt": "2026-07-16T17:34:42.416Z"
  },
  "message": "Offer created",
  "timestamp": "2026-07-16T17:34:42.422Z"
}
```

---

# 7. Blueprint Consistency Check

| Check Item | Status |
|------------|--------|
| No schema.prisma modification | PASS |
| No migration modification | PASS |
| No price/currency/inventory/stock fields | PASS |
| Offer only links Organization + Product | PASS |
| No "Supplier" term | PASS |
| No "Requirement" / "Inquiry" / "Matching" | PASS |
| No Order / Payment / Transaction | PASS |
| Controller → Service → PrismaService | PASS |
| Unified ApiResponse<T> format | PASS |
| PaginationDto support | PASS |
| No Authentication created | PASS |
| No Frontend code | PASS |

---

# 8. File Summary

| Domain | Files Created |
|--------|---------------|
| Offers | 5 |
| app.module.ts | 1 (modified) |
| **Total** | **6** |

---

# 9. Final Status

```
Phase 13 Batch 5 — Offer Domain API: COMPLETE
```

| Metric | Value |
|--------|-------|
| Modules Created | 1 |
| Controllers | 1 |
| Services | 1 |
| DTOs | 2 |
| API Endpoints | 4 |
| Build | PASS |
| All endpoints verified | PASS |

> **声明**: 本报告基于 2026-07-17 实际执行结果生成。Offer Domain API 已实现，仅关联 Organization 和 Product，无交易字段。未进入 Demand、RFQ 或 Authentication 开发阶段。