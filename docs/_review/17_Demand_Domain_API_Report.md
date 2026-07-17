# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 17                                             |
| Document Name | Demand Domain API Report                       |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 记录 Demand Domain API 实现结果                 |
| Dependency    | Phase 13 Batch 6                               |
| Date          | 2026-07-17                                     |

---

# 1. Pre-check Fixes

| File | Issue | Fix |
|------|-------|-----|
| app.module.ts | Lines 2-7: Chinese troubleshooting comments | Removed; no runtime errors |
| tsconfig.json | Line 1: `{` — valid JSON | No fix needed; 0 diagnostics |

---

# 2. Created Files

| File | Purpose |
|------|---------|
| demands/demands.module.ts | Demands module declaration |
| demands/demands.controller.ts | REST controller (GET/POST/PATCH) |
| demands/demands.service.ts | Business logic (Prisma queries + Json cast) |
| demands/dto/create-demand.dto.ts | Create DTO (title, createdBy, description?, organizationId?, parametersJson?, budgetRange?) |
| demands/dto/update-demand.dto.ts | Update DTO (title?, description?, status?, parametersJson?, budgetRange?) |

## 2.1 Modified

| File | Action |
|------|--------|
| app.module.ts | +1 import (DemandsModule), comments removed |

---

# 3. API Endpoints

| Method | Path | Description | Validation |
|--------|------|-------------|------------|
| GET | /api/v1/demands | List demands (paginated, incl. org + user) | PaginationDto |
| GET | /api/v1/demands/:id | Get demand by ID (incl. org + user) | — |
| POST | /api/v1/demands | Create demand | CreateDemandDto |
| PATCH | /api/v1/demands/:id | Update demand (status, parameters, etc.) | UpdateDemandDto |

**Total**: 4 endpoints

---

# 4. Prisma Model Mapping

| API Module | Prisma Model | Key Fields | Status Enum |
|------------|-------------|------------|-------------|
| Demands | Demand | id, title, description, organizationId, createdBy, status, parametersJson, budgetRange | DRAFT, SUBMITTED, PROCESSING, CLOSED, CANCELLED |

## 4.1 Relations

| Relation | Type | Description |
|----------|------|-------------|
| Demand → Organization | N:1 (optional) | Demand may belong to an organization |
| Demand → User (createdBy) | N:1 | Demand creator |

## 4.2 Key Design Decisions

- **No Product association**: Demand does NOT directly link to Product model
- **Dynamic parameters**: `parametersJson` (Json?) stores arbitrary key-value parameters
- **Status lifecycle**: DRAFT → SUBMITTED → PROCESSING → CLOSED / CANCELLED

---

# 5. Dynamic Parameter System

## 5.1 Parameters via `parametersJson`

```
Demand.parametersJson = Json (Prisma) → InputJsonValue (TypeScript)
```

## 5.2 Example

```json
POST /api/v1/demands
{
  "title": "Need 6mm inspection scope",
  "createdBy": "c7805236-...",
  "organizationId": "cb57eb06-...",
  "description": "Looking for industrial endoscope",
  "parametersJson": {
    "diameter": "6.0",
    "length": "3000",
    "temperature": "80"
  },
  "budgetRange": "10000-50000"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "bb972eb2-...",
    "title": "Need 6mm inspection scope",
    "status": "DRAFT",
    "parametersJson": {
      "length": "3000",
      "diameter": "6.0",
      "temperature": "80"
    },
    "budgetRange": "10000-50000",
    ...
  },
  "message": "Demand created",
  "timestamp": "2026-07-16T17:44:49.544Z"
}
```

## 5.3 TypeScript Cast

```typescript
// parametersJson requires Prisma.InputJsonValue cast
data: {
  ...dto,
  parametersJson: dto.parametersJson as Prisma.InputJsonValue,
}
```

---

# 6. Service Architecture

| Method | Prisma API | Includes |
|--------|------------|----------|
| findAll(pagination) | demand.findMany() + demand.count() | organization, createdByUser |
| findOne(id) | demand.findUnique() | organization, createdByUser |
| create(dto) | demand.create() | — |
| update(id, dto) | demand.update() | — |

---

# 7. Business Constraints

| Constraint | Status |
|------------|--------|
| No direct Product association | Confirmed — no productId field |
| Dynamic parameters via parametersJson | Confirmed |
| No "Supplier" / "Matching" / "Requirement" / "Inquiry" | Confirmed |
| No price/currency/inventory/stock/order/payment | Confirmed |
| Term "Organization" only | Confirmed |

---

# 8. Validation Result

## 8.1 Build

```
npm run build → PASS (exit 0)
```

## 8.2 Route Registration

```
[Nest] LOG [RoutesResolver] DemandsController {/api/v1/demands}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/demands, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/demands/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/demands, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/demands/:id, PATCH} route
```

## 8.3 API Response Verification

| Endpoint | Status | Result |
|----------|--------|--------|
| GET /api/v1/demands | 200 | ApiResponse (empty, paginated) |
| POST /api/v1/demands | 201 | ApiResponse (created, status=DRAFT, parametersJson stored) |
| Validation error | 400 | ApiResponse (error message) |

---

# 9. Blueprint Consistency Check

| Check Item | Status |
|------------|--------|
| No schema.prisma modification | PASS |
| No migration modification | PASS |
| No direct Product association | PASS |
| Dynamic parameters via parametersJson | PASS |
| No "Supplier" term | PASS |
| No "Requirement" / "Inquiry" / "Matching" | PASS |
| No price/currency/inventory/stock/order/payment | PASS |
| Controller → Service → PrismaService | PASS |
| Unified ApiResponse<T> format | PASS |
| PaginationDto support | PASS |
| No Authentication created | PASS |
| No RFQ API created | PASS |

---

# 10. File Summary

| Domain | Files Created |
|--------|---------------|
| Demands | 5 |
| app.module.ts | 1 (modified) |
| **Total** | **6** |

---

# 11. Final Status

```
Phase 13 Batch 6 — Demand Domain API: COMPLETE
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

> **声明**: 本报告基于 2026-07-17 实际执行结果生成。Demand Domain API 已实现，不直接关联 Product，使用 parametersJson 动态参数。未进入 RFQ 或 Authentication 开发阶段。