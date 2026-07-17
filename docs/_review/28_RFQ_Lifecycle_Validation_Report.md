# RFQ Lifecycle Validation Audit Report

**日期**: 2026-07-17  
**Phase**: M5 Batch 4 — RFQ Lifecycle Validation Audit  
**最终状态**: **PASS**

---

## 1. 修改文件

| # | 文件 | 操作 | 说明 |
|---|------|------|------|
| 1 | `src/rfqs/rfqs.service.ts` | 修改 | 增加 RFQ 状态流转验证 |
| 2 | `src/rfq-responses/rfq-responses.service.ts` | 修改 | 增加 RFQResponse 状态流转验证 |

无新增文件，无新增 API，无 schema 修改。

---

## 2. RFQ 状态流转

### 2.1 状态转移表

| 当前状态 | 允许转移 | 禁止转移 |
|---------|---------|---------|
| DRAFT | OPEN | RESPONDING, CLOSED, CANCELLED |
| OPEN | RESPONDING, CLOSED, CANCELLED | DRAFT |
| RESPONDING | CLOSED, CANCELLED | DRAFT, OPEN |
| CLOSED | — | 全部 |
| CANCELLED | — | 全部 |

### 2.2 流转图

```
DRAFT → OPEN → RESPONDING → CLOSED
          ↘ CLOSED     ↘ CANCELLED
          ↘ CANCELLED
```

### 2.3 实现

```typescript
const RFQ_TRANSITIONS: Record<RFQStatus, RFQStatus[]> = {
  DRAFT:      [RFQStatus.OPEN],
  OPEN:       [RFQStatus.RESPONDING, RFQStatus.CLOSED, RFQStatus.CANCELLED],
  RESPONDING: [RFQStatus.CLOSED, RFQStatus.CANCELLED],
  CLOSED:     [],
  CANCELLED:  [],
};
```

非法转移时抛出 `BadRequestException("Cannot transition RFQ from {from} to {to}")`

---

## 3. RFQResponse 状态流转

### 3.1 状态转移表

| 当前状态 | 允许转移 | 禁止转移 |
|---------|---------|---------|
| SUBMITTED | VIEWED | ACCEPTED, REJECTED |
| VIEWED | ACCEPTED, REJECTED | SUBMITTED |
| ACCEPTED | — | 全部 |
| REJECTED | — | 全部 |

### 3.2 流转图

```
SUBMITTED → VIEWED → ACCEPTED
                 ↘ REJECTED
```

### 3.3 实现

```typescript
const RESPONSE_TRANSITIONS: Record<RFQResponseStatus, RFQResponseStatus[]> = {
  SUBMITTED: [RFQResponseStatus.VIEWED],
  VIEWED:    [RFQResponseStatus.ACCEPTED, RFQResponseStatus.REJECTED],
  ACCEPTED:  [],
  REJECTED:  [],
};
```

非法转移时抛出 `BadRequestException("Cannot transition RFQ Response from {from} to {to}")`

---

## 4. 验证机制

### 4.1 触发条件

仅在 `dto.status` 存在时触发验证。如果更新请求不包含 status 字段，不进行状态流转检查。

### 4.2 错误响应示例

```json
{
  "success": false,
  "data": null,
  "message": "Cannot transition RFQ from CLOSED to OPEN",
  "timestamp": "2026-07-17T..."
}
```

### 4.3 验证覆盖

| 操作 | 无 status 字段 | 合法转移 | 非法转移 |
|------|---------------|---------|---------|
| PATCH /rfqs/:id | 通过 | 通过 | 400 Bad Request |
| PATCH /rfq-responses/:id | 通过 | 通过 | 400 Bad Request |

---

## 5. Build 结果

```
npm run build → exit code 0
```

零编译错误，零类型错误。

---

## 6. 合规性检查

| 检查项 | 状态 |
|--------|------|
| 未修改 schema.prisma | PASS |
| 未修改 migration | PASS |
| 未新增 Model | PASS |
| 未新增字段 | PASS |
| 未新增 API | PASS |
| 未新增 Module | PASS |
| Controller → Service → Prisma | PASS |
| ApiResponse\<T\> | PASS |
| Swagger 无变化 | PASS |
| 已有 API 无影响 | PASS |

---

## 7. 受影响的 API

| API | 影响 |
|-----|------|
| PATCH `/api/v1/rfqs/:id` | 增加状态流转限制 |
| PATCH `/api/v1/rfq-responses/:id` | 增加状态流转限制 |
| 其他所有 API | 无影响 |

---

## 8. 文件统计

| 类别 | 新增 | 修改 |
|------|------|------|
| Service | 0 | 2 |
| Module | 0 | 0 |
| Controller | 0 | 0 |
| DTO | 0 | 0 |
| **总计** | **0** | **2** |