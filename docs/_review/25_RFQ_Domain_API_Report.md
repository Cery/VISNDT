# RFQ Domain API Report

**日期**: 2026-07-17  
**Phase**: M5 Batch 1 — RFQ Workflow Foundation  
**最终状态**: **PASS**

---

## 1. 创建文件

| # | 文件 | 用途 |
|---|------|------|
| 1 | `src/rfqs/rfqs.module.ts` | RFQs 模块声明 |
| 2 | `src/rfqs/rfqs.controller.ts` | REST Controller (GET/POST/PATCH) |
| 3 | `src/rfqs/rfqs.service.ts` | 业务逻辑 (Prisma 查询) |
| 4 | `src/rfqs/dto/create-rfq.dto.ts` | Create DTO (demandId, createdBy) |
| 5 | `src/rfqs/dto/update-rfq.dto.ts` | Update DTO (status) |

### 1.1 修改文件

| 文件 | 操作 |
|------|------|
| `src/app.module.ts` | +1 import (RfqsModule), +1 注册 |

---

## 2. API 列表

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/api/v1/rfqs` | 分页查询所有 RFQ | Query: page, pageSize |
| GET | `/api/v1/rfqs/:id` | 按 ID 查询 RFQ | Param: id |
| POST | `/api/v1/rfqs` | 创建 RFQ | Body: CreateRfqDto |
| PATCH | `/api/v1/rfqs/:id` | 更新 RFQ (状态变更) | Param: id, Body: UpdateRfqDto |

---

## 3. Prisma 映射

### 3.1 RFQ Model

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | UUID | 自动生成 | 主键 |
| demandId | UUID | 是 | 关联 Demand |
| createdBy | UUID | 是 | 创建者 User ID |
| status | RFQStatus | 默认 DRAFT | 状态 |
| publishedAt | DateTime? | 否 | 发布时间 |
| closedAt | DateTime? | 否 | 关闭时间 |
| createdAt | DateTime | 自动 | 创建时间 |
| updatedAt | DateTime | 自动 | 更新时间 |

### 3.2 Relations (include)

| 关系 | 方式 |
|------|------|
| demand | `include: { demand: true }` |
| createdByUser | `include: { createdByUser: true }` |

### 3.3 Indexes

| Index | 类型 |
|-------|------|
| `demandId` | Unique |
| `createdBy` | Non-Unique |
| `status` | Non-Unique |

---

## 4. 状态流转

```
RFQStatus:
  DRAFT → OPEN → RESPONDING → CLOSED
                     ↘ CANCELLED
```

| 状态 | 说明 |
|------|------|
| DRAFT | 草稿 (创建默认) |
| OPEN | 已发布，等待响应 |
| RESPONDING | 响应中 |
| CLOSED | 已关闭 |
| CANCELLED | 已取消 |

---

## 5. Swagger 验证

| 装饰器 | 覆盖 |
|--------|------|
| @ApiTags('RFQs') | Controller 级别 |
| @ApiOperation | 4/4 端点 |
| @ApiParam | 2/2 含 :id 的端点 |
| @ApiProperty | 2/2 DTO 字段 (create-rfq) |
| @ApiPropertyOptional | 1/1 DTO 字段 (update-rfq) |

---

## 6. Build 结果

```
npm run build → exit code 0
```

零编译错误，零类型错误。

---

## 7. Blueprint 一致性检查

| 检查项 | Blueprint | 实现 | 状态 |
|--------|-----------|------|------|
| API 路径 | `/rfqs` | `/rfqs` | PASS |
| RFQStatus | DRAFT, OPEN, RESPONDING, CLOSED, CANCELLED | 完全一致 | PASS |
| 命名规范 | RFQ (非 Requisition) | RFQ | PASS |
| 资源边界 | RFQ API 用于询价流程 | 独立 Controller | PASS |
| 分层架构 | Controller → Service → Prisma | 遵循 | PASS |
| 响应格式 | ApiResponse<T> | 遵循 | PASS |
| DTO 验证 | class-validator | 遵循 | PASS |
| Swagger | 完整文档 | 已添加 | PASS |

---

## 8. 架构合规性

| 检查项 | 状态 |
|--------|------|
| 未修改 schema.prisma | PASS |
| 未修改 migration | PASS |
| 未修改已有 Domain API | PASS |
| kebab-case 文件命名 | PASS |
| 仅新增 `src/rfqs/` 目录 | PASS |

---

## 9. 文件统计

| 类别 | 新增 | 修改 |
|------|------|------|
| Module | 1 | 1 (app.module.ts) |
| Controller | 1 | 0 |
| Service | 1 | 0 |
| DTO | 2 | 0 |
| **总计** | **5** | **1** |