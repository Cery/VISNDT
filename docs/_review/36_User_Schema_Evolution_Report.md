# User Schema Evolution Report

**日期**: 2026-07-17  
**Phase**: M6.1  
**基线**: Backend Freeze v1.0.1 → v1.1

---

## Change

新增 `User.name` 字段，为 Authentication 模块提供用户显示名称。

```prisma
model User {
  ...
  name String?  // ← 新增
  ...
}
```

## Migration

| # | 名称 | 时间 | 内容 |
|---|------|------|------|
| 1 | `20260716152642_init` | 初始基线 | 全部 18 Model |
| 2 | `20260717042125_add_user_name` | 2026-07-17 | ADD name TEXT |

### Migration SQL

```sql
ALTER TABLE "user" ADD COLUMN "name" TEXT;
```

## Schema Impact

| 维度 | 详情 |
|------|------|
| Model | User |
| 新增字段 | `name String?` |
| 类型 | TEXT, nullable |
| 已有字段 | 未修改 |
| Relation | 未修改 |
| Enum | 未修改 |
| Index | 未修改 |
| 其他 Model | 未修改 |

## Compatibility

### 现有 API 影响

| API | 影响 | 状态 |
|-----|------|:---:|
| `GET /users` | 响应中自动包含 `name` 字段 (可为 null) | PASS |
| `POST /users` | `CreateUserDto` 未包含 `name`，创建时 `name=null` | PASS |
| `PATCH /users/:id` | `UpdateUserDto` 未包含 `name`，不影响更新 | PASS |
| 其他所有 API | 无影响 | PASS |

**向后兼容**: `name` 为 nullable，现有请求不传 `name` 时默认为 `null`，零破坏性。

### DTO 兼容性

| DTO | 包含 `name` | 影响 |
|-----|:---:|------|
| `CreateUserDto` | 否 | 创建时 `name=null` |
| `UpdateUserDto` | 否 | 更新不涉及 `name` |

**注**: `name` 字段将在 M6.2+ 通过 Auth DTO 使用，当前 UsersModule DTO 无需修改。

## Build

```
npm run build → exit code 0
```

| 检查项 | 结果 |
|--------|:---:|
| TypeScript 编译 | 0 errors |
| Prisma Client 类型 | `name?: string \| null` |
| 现有 API 兼容 | 通过 |

## Migration Files

| 文件 | 操作 |
|------|------|
| `database/prisma/schema.prisma` | 修改 (新增 `name String?`) |
| `database/prisma/migrations/20260717042125_add_user_name/migration.sql` | 新增 |
| `database/prisma/migrations/20260716152642_init/migration.sql` | 未修改 |
| `node_modules/@prisma/client` | 重新生成 |

## Final Status

```
User Schema Evolution: PASS
```

| 检查项 | 结果 |
|--------|:---:|
| Schema 新增字段 | `User.name String?` |
| Migration 创建 | migration_002 |
| Prisma Client 更新 | 是 |
| Build | 0 errors |
| 现有 API 兼容 | 是 |
| 未修改已有 migration | 是 |
| 未修改业务 Domain | 是 |

### Freeze Version

```
Backend Freeze v1.0.1 → 结束
Backend Schema Evolution v1.1 → 开始
```

---

## M6.1 Schema Evolution Summary

| 项目 | 内容 |
|------|------|
| **修改文件** | `database/prisma/schema.prisma` |
| **新增文件** | `database/prisma/migrations/20260717042125_add_user_name/migration.sql` |
| **Migration** | `20260717042125_add_user_name` (migration_002) |
| **Build** | exit code 0 |
| **Impact** | 零破坏性 (nullable 字段) |
| **是否可以进入 M6.2** | **是** |