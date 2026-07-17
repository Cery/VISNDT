# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 13                                             |
| Document Name | Backend Core Infrastructure Report             |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 记录 NestJS 后端通用基础设施搭建结果            |
| Dependency    | Phase 13 Batch 2                               |
| Date          | 2026-07-17                                     |

---

# 1. Created Files

| # | File | Module | Purpose |
|---|------|--------|---------|
| 1 | src/common/dto/api-response.dto.ts | Common | 统一 API Response 格式 |
| 2 | src/common/dto/pagination.dto.ts | Common | 分页参数 DTO |
| 3 | src/common/filters/http-exception.filter.ts | Common | 全局异常过滤器（含 Prisma 错误映射） |
| 4 | src/common/interceptors/logging.interceptor.ts | Common | HTTP 请求日志拦截器 |
| 5 | src/main.ts | Bootstrap | 更新: api/v1 prefix + 注册 filter/interceptor |

## 1.1 Directory Structure

```
apps/api/src/common/
├── dto/
│   ├── api-response.dto.ts
│   └── pagination.dto.ts
├── filters/
│   └── http-exception.filter.ts
├── interceptors/
│   └── logging.interceptor.ts
├── decorators/    (reserved)
└── constants/     (reserved)
```

---

# 2. Architecture

## 2.1 Request Flow

```
Request
  → Global Prefix (/api/v1)
  → CORS
  → LoggingInterceptor (logs method, url, status, duration)
  → ValidationPipe (whitelist, transform)
  → Controller/Handler
  → HttpExceptionFilter (catches all exceptions)
    ├── HttpException → mapped status
    ├── Prisma.PrismaClientKnownRequestError
    │   ├── P2002 → 409 Conflict
    │   ├── P2025 → 404 Not Found
    │   ├── P2003 → 400 Bad Request
    │   └── P2014 → 400 Bad Request
    └── Unknown → 500 Internal Server Error
  → Response
```

## 2.2 ApiResponse Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "OK",
  "timestamp": "2026-07-17T00:58:33.000Z"
}
```

Error:
```json
{
  "success": false,
  "data": null,
  "message": "Unique constraint violation on: email",
  "timestamp": "2026-07-17T00:58:33.000Z"
}
```

---

# 3. API Version

## 3.1 Change

| Before | After |
|--------|-------|
| `/api/health` | `/api/v1/health` |
| `/api/docs` | `/api/docs` (unchanged, Swagger UI) |

## 3.2 Rationale

- `/api/v1` prefix provides versioning namespace for future API evolution
- Swagger docs remain at `/api/docs` for developer convenience

---

# 4. Exception Handling

## 4.1 Prisma Error Mapping

| Prisma Code | HTTP Status | Description |
|-------------|-------------|-------------|
| P2002 | 409 Conflict | Unique constraint violation |
| P2025 | 404 Not Found | Record not found |
| P2003 | 400 Bad Request | Foreign key constraint failed |
| P2014 | 400 Bad Request | Relation violation |
| Other | 500 Internal | Database error |

## 4.2 Exception Coverage

| Exception Type | Handled |
|----------------|---------|
| HttpException | YES |
| Prisma.PrismaClientKnownRequestError | YES |
| Prisma.PrismaClientValidationError | YES |
| Unknown (Error) | YES |

---

# 5. Logging Interceptor

## 5.1 Output Format

```
[Nest] PID - LOG [HTTP] METHOD /api/v1/path STATUS_CODE DURATIONms
```

## 5.2 Verified Output

```
[Nest] 23380 - LOG [HTTP] GET /api/v1/health 200 13ms
```

---

# 6. Pagination DTO

| Field | Type | Default | Validation |
|-------|------|---------|------------|
| page | number | 1 | @Min(1) |
| pageSize | number | 20 | @Min(1), @Max(100) |

---

# 7. Validation Result

| Check | Result |
|-------|--------|
| `npm run build` | PASS (exit 0) |
| Server startup | PASS |
| GET /api/v1/health | `{"status":"ok","database":"connected"}` |
| LoggingInterceptor | GET /api/v1/health 200 13ms |
| Global prefix `/api/v1` | PASS |
| Swagger /api/docs | PASS |

---

# 8. Blueprint Consistency Check

| Check Item | Status |
|------------|--------|
| No schema.prisma modification | PASS |
| No migration modification | PASS |
| No business Model created | PASS |
| No Product API | PASS |
| No Organization API | PASS |
| No Offer API | PASS |
| No Demand API | PASS |
| No RFQ API | PASS |
| No Authentication | PASS |
| Tech stack: NestJS + TypeScript | PASS |

---

# 9. Modified Files Summary

| File | Action | Lines |
|------|--------|-------|
| src/common/dto/api-response.dto.ts | Created | +24 |
| src/common/dto/pagination.dto.ts | Created | +17 |
| src/common/filters/http-exception.filter.ts | Created | +74 |
| src/common/interceptors/logging.interceptor.ts | Created | +29 |
| src/main.ts | Modified | +3 (imports), +2 (filters/interceptors), ~1 (prefix) |

---

# 10. Final Status

```
Phase 13 Batch 2 — Backend Core Infrastructure: COMPLETE
```

| Metric | Value |
|--------|-------|
| API Prefix | /api/v1 |
| Global Filters | 1 (HttpExceptionFilter) |
| Global Interceptors | 1 (LoggingInterceptor) |
| Prisma Error Codes Mapped | 4 (P2002, P2025, P2003, P2014) |
| Common DTOs | 2 (ApiResponse, Pagination) |
| Build | PASS |
| Database Connection | Connected |

---

> **声明**: 本报告基于 2026-07-17 实际执行结果生成。Backend 通用基础设施已建立，Global Exception Filter、Logging Interceptor、API Versioning 均已就绪。未进入业务 API 开发阶段。