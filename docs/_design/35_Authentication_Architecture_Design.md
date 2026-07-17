# Authentication Architecture Design

**日期**: 2026-07-17  
**Phase**: M6 Preparation  
**基线**: Backend Freeze v1.0.1  
**状态**: **READY — 可进入 M6 Batch 1**

---

## 1. Current User Domain Analysis

### 1.1 User Model (schema.prisma:126-148)

| 字段 | 类型 | 约束 | 认证支持 |
|------|------|------|:---:|
| `id` | UUID | PK | 作为 JWT sub |
| `email` | String | @unique | 登录凭据 |
| `passwordHash` | String | NOT NULL | 密码存储 |
| `status` | UserStatus | default ACTIVE | 账户状态 |
| `organizationId` | UUID? | FK | 默认组织 |
| `createdAt` | DateTime | auto | 注册时间 |
| `updatedAt` | DateTime | auto | 最后修改 |

**关键发现**: `passwordHash` 字段已存在于 Schema 中，无需新增。

### 1.2 缺失字段分析

| 字段 | 必要性 | 影响 |
|------|:---:|------|
| `name` | **高** | 用户无显示名称，JWT payload 无法携带可读标识 |
| `refreshToken` | 低 | MVP 阶段可省略 |
| `lastLoginAt` | 低 | 可延期至 M7 |

**结论**: Schema 已具备认证基础，仅需新增 `User.name` 字段。

### 1.3 OrganizationMember 授权基础

| 字段 | 类型 | 说明 |
|------|------|------|
| `role` | String | default "MEMBER"，支持自定义角色 |

`OrganizationMember.role` 已为授权设计预留，当前使用字符串类型。

### 1.4 AuditLog 支持

```prisma
enum AuditAction {
  ...
  LOGIN  // ← 已存在，可用于登录审计
}
```

---

## 2. Authentication Strategy

### 2.1 整体架构

```
Client → AuthController → AuthService → PrismaService
                ↓
          JwtStrategy (Passport)
                ↓
          JwtAuthGuard (保护路由)
```

### 2.2 模块结构

```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── jwt.strategy.ts
├── jwt-auth.guard.ts
├── roles.guard.ts
└── dto/
    ├── register.dto.ts
    ├── login.dto.ts
    └── auth-response.dto.ts
```

### 2.3 认证流程

```
注册: POST /auth/register → bcrypt(password) → User.create({...passwordHash})
登录: POST /auth/login   → verify email + bcrypt.compare → sign JWT → return token
鉴权: 任何保护路由       → JwtAuthGuard → JwtStrategy.validate → req.user
```

---

## 3. JWT Design

### 3.1 Access Token

| 属性 | 值 | 说明 |
|------|-----|------|
| 算法 | HS256 | 对称签名，适合单体/简单部署 |
| 有效期 | 24h (`86400s`) | MVP 阶段每日重新登录 |
| 签发者 | `visndt-api` | 标识 |
| 存储位置 | Authorization Header | `Bearer <token>` |

### 3.2 Payload 结构

```json
{
  "sub": "uuid (user.id)",
  "email": "user@example.com",
  "name": "User Name",
  "organizationId": "uuid | null",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### 3.3 Refresh Token

**决策: MVP 阶段不需要。**

| 理由 | 说明 |
|------|------|
| MVP 简化 | 减少复杂度 |
| 24h 有效期 | 足够日常使用 |
| 无敏感操作 | 当前无支付/交易 |

**延期至 M7+**: 当需要长时间会话时引入。

---

## 4. Password Security

### 4.1 方案

| 属性 | 值 |
|------|-----|
| 算法 | bcrypt |
| Salt Rounds | 10 (MVP) / 12 (生产) |
| 存储字段 | `User.passwordHash` (已有) |
| 明文禁止 | 是 — 仅存储 hash |

### 4.2 实现

```typescript
// 注册时
const passwordHash = await bcrypt.hash(password, 10);

// 登录时
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### 4.3 密码强度要求

| 规则 | 值 |
|------|-----|
| 最小长度 | 8 字符 |
| 复杂度 | 至少 1 字母 + 1 数字 |
| 验证 | class-validator: @MinLength(8), @Matches(...) |

---

## 5. Authorization Model

### 5.1 方案对比

| 维度 | 方案A: User.role | 方案B: Role表+Permission | 方案C: OrganizationMember.role |
|------|:---:|:---:|:---:|
| 复杂度 | 低 | 高 | 中 |
| 扩展性 | 差 | 优 | 良 |
| 多组织支持 | 否 | 是 | 是 |
| 适合 VISNDT | 否 | 否 (过度设计) | **是** |

### 5.2 推荐: 方案C — OrganizationMember.role (已有)

**Decision: 使用现有 `OrganizationMember.role` 字段，无需新增表。**

| 角色 | 值 | 权限范围 |
|------|-----|------|
| `ADMIN` | 组织管理员 | 管理组织、成员、全部业务 |
| `MEMBER` | 组织成员 | 基本业务操作 |

**平台级角色 (无组织关联)**:

| 角色 | 说明 |
|------|------|
| 平台管理员 | 未来扩展，MVP 不需要 |

### 5.3 授权流程

```
JWT Payload → 解析 userId + organizationId
                ↓
         查询 OrganizationMember.role
                ↓
         RolesGuard 检查权限
```

```typescript
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('organizations/:id/members')
```

### 5.4 角色定义

```typescript
// 建议新增枚举 (非 schema 变更，仅代码常量)
export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}
```

---

## 6. Schema Evolution Proposal

### 6.1 必须新增

| 变更 | 类型 | 原因 |
|------|------|------|
| `User.name` | 新增字段 | 用户显示名称，JWT payload 必需 |

```prisma
model User {
  ...
  name           String?    @map("name")  // ← 新增
  ...
}
```

### 6.2 可选延期

| 变更 | 理由 |
|------|------|
| `User.lastLoginAt` | 登录审计，可延期 |
| `User.refreshToken` | MVP 不需要 |
| `RefreshToken` 表 | MVP 不需要 |
| `Permission` 表 | 过度设计，当前角色足够 |
| `Role` 枚举 | 字符串类型已足够灵活 |

### 6.3 不需要变更

| 现有 | 说明 |
|------|------|
| `User.passwordHash` | 已存在，直接使用 |
| `OrganizationMember.role` | 已存在，直接使用 |
| `AuditAction.LOGIN` | 已存在，直接使用 |

---

## 7. API Design

### 7.1 M6 实现

| 方法 | 路径 | 认证 | 说明 |
|------|------|:---:|------|
| POST | `/api/v1/auth/register` | 否 | 用户注册 |
| POST | `/api/v1/auth/login` | 否 | 用户登录 |
| GET | `/api/v1/auth/me` | 是 | 获取当前用户信息 |

### 7.2 请求/响应设计

#### POST /auth/register

```typescript
// Request
{
  "email": "user@example.com",
  "password": "plaintext_password",  // 传输层 TLS 保护
  "name": "User Name"                // 可选
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "accessToken": "jwt..."
  },
  "message": "Registration successful",
  "timestamp": "2026-07-17T..."
}
```

#### POST /auth/login

```typescript
// Request
{
  "email": "user@example.com",
  "password": "plaintext_password"
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "organizationId": "uuid | null"
    }
  },
  "message": "Login successful",
  "timestamp": "2026-07-17T..."
}
```

#### GET /auth/me

```typescript
// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "status": "ACTIVE",
    "organizationId": "uuid | null",
    "memberships": [...]
  },
  "message": "OK",
  "timestamp": "2026-07-17T..."
}
```

### 7.3 延期 API

| 方法 | 路径 | 原因 |
|------|------|------|
| POST | `/auth/logout` | 无 refresh token 无需服务端注销 |
| POST | `/auth/refresh` | 无 refresh token |

---

## 8. Security Checklist

### 8.1 环境变量

| 变量 | 用途 | .env.example |
|------|------|:---:|
| `JWT_SECRET` | JWT 签名密钥 | 需新增 |
| `JWT_EXPIRES_IN` | Token 有效期 | 需新增 |

```
# --- Authentication ---
JWT_SECRET=CHANGE_ME_TO_RANDOM_64_CHAR_STRING
JWT_EXPIRES_IN=86400
```

### 8.2 依赖

| 包 | 用途 | 安装命令 |
|-----|------|------|
| `@nestjs/jwt` | JWT 模块 | `pnpm add @nestjs/jwt` |
| `@nestjs/passport` | Passport 集成 | `pnpm add @nestjs/passport` |
| `passport` | 认证中间件 | `pnpm add passport` |
| `passport-jwt` | JWT 策略 | `pnpm add passport-jwt` |
| `bcrypt` | 密码哈希 | `pnpm add bcrypt` |
| `@types/bcrypt` | 类型定义 | `pnpm add -D @types/bcrypt` |
| `@types/passport-jwt` | 类型定义 | `pnpm add -D @types/passport-jwt` |

### 8.3 安全措施

| 措施 | 状态 |
|------|:---:|
| 密码 bcrypt 哈希 | 设计 |
| JWT HS256 签名 | 设计 |
| Authorization Header 传输 | 设计 |
| 密码强度验证 | 设计 |
| 登录失败审计 | 设计 (AuditLog.LOGIN 已存在) |
| CORS 限制 | 已完成 (#34) |
| Rate Limiting | 延期 (MVP 不需要) |
| TLS/HTTPS | 部署层配置 |

---

## 9. Migration Plan

### 9.1 Phase M6 批次划分

| Batch | 内容 | 依赖 |
|-------|------|------|
| M6.1 | Schema: `User.name` 字段 + Migration | — |
| M6.2 | 安装依赖 + AuthModule 骨架 | M6.1 |
| M6.3 | Register + Login API | M6.2 |
| M6.4 | JWT Guard + `/auth/me` | M6.3 |
| M6.5 | RolesGuard + 保护现有 API | M6.4 |
| M6.6 | Auth Audit Report | M6.5 |

### 9.2 Schema 变更影响

| 变更 | 影响范围 |
|------|------|
| `User.name` (新增) | UsersService, DTOs, AuthController |
| Migration | 新增 `migration_002` |

---

## 10. Risks

| 风险 | 级别 | 缓解 |
|------|:---:|------|
| Schema 新增字段影响现有 API | 低 | `name` 为可选字段，向后兼容 |
| JWT secret 泄漏 | 中 | 环境变量管理，不提交代码 |
| 密码明文传输 | 中 | 生产环境强制 HTTPS |
| 无 token 刷新机制 | 低 | 24h 有效期 + MVP 阶段可接受 |
| 现有 User API 无认证 | 中 | M6.5 逐步添加 Guard |

---

## 11. Recommendation

### 决策

```
M6 Authentication: 可以进入 Batch 1
```

### 理由

1. **Schema 基础完善**: `passwordHash` + `OrganizationMember.role` + `AuditAction.LOGIN` 均已存在
2. **变更最小化**: 仅需新增 `User.name` 字段
3. **架构兼容**: AuthModule 独立模块，不影响现有 Domain
4. **分步实施**: 6 个 Batch 逐步推进，每步可验证

### 实施路径

```
M6.1 → 新增 User.name (Schema + Migration)
M6.2 → 安装依赖 + AuthModule 骨架
M6.3 → Register + Login API
M6.4 → JWT Guard + /auth/me
M6.5 → RolesGuard + 保护路由
M6.6 → 审计报告
```

---

## M6 Architecture Audit Summary

| 维度 | 结论 |
|------|------|
| **Current User Model** | 已具备 `passwordHash`，仅缺 `name` 字段 |
| **Authentication Strategy** | JWT (HS256) + bcrypt，Header Bearer Token |
| **Schema Changes Required** | 1 个字段 (`User.name`，可选) |
| **API Design** | 3 个端点: register / login / me |
| **Risk Level** | **低** — Schema 基础完善，变更最小 |
| **是否可以进入 M6 Batch 1** | **是** |