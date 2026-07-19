# 70_M8 Precheck: Supplier Domain Architecture Report

**Date:** 2026-07-19  
**Phase:** M8 — Supplier Domain 开始前架构检查  
**Status:** ✅ 分析完成，禁止修改代码

---

## 1. Phase Overview

**目标：** 在 M8 Supplier Domain 正式开发前，对当前项目 Supplier 相关基础能力进行全面架构分析，评估现有模型是否可以支撑 Supplier Profile API，确定是否需要 Schema 变更。

**原则：**
- ✅ 不修改任何代码
- ✅ 不创建 Migration
- ✅ 不运行数据库变更
- ✅ 不影响现有模块

---

## 2. 现有模型关系分析

### 2.1 核心模型关系图

```
User ──belongs to──→ Organization
                        │
                        ├── type: "supplier" | "buyer" | "enterprise"
                        │
                        ├── offers[] ──→ Offer ──→ Product ──→ ProductCategory
                        │                                  │
                        ├── demands[] ──→ Demand            │
                        │                   │               │
                        └── rfqResponses[]  └── matches[] ──┘
                                           (DemandMatch)
```

### 2.2 Organization 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `name` | String | 组织名称 |
| `type` | String (free-form) | 组织类型，如 `supplier`、`buyer`、`enterprise` |
| `status` | OrganizationStatus | ACTIVE / INACTIVE / SUSPENDED |

**现有关系：**
- `users[]` — 组织下所有用户
- `members[]` — 组织成员（含角色）
- `offers[]` — 组织提供的 Offer（**关键：Supplier ↔ Product 桥梁**）
- `demands[]` — 组织发布的需求
- `rfqResponses[]` — 组织对 RFQ 的响应

**Supplier 识别方式：** `Organization.type = 'supplier'`

### 2.3 User 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `email` | String | 邮箱（唯一） |
| `name` | String? | 用户名称 |
| `organizationId` | UUID? | 所属组织 |

**关键约束：** 每个 User 只能属于一个 Organization（`organizationId` 是单值，非数组）。

### 2.4 Product 模型（Global Catalog）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `categoryId` | UUID | 所属分类 |
| `name` | String | 产品名称 |
| `model` | String? | 产品型号 |
| `description` | String? | 产品描述 |
| `status` | String | DRAFT / ACTIVE 等 |

**关键发现：**
- ❌ Product **没有** `organizationId` 字段
- ❌ Product **没有** `supplierId` 字段
- ❌ Product **没有** `createdBy` 字段
- ✅ Product 是 **Global Catalog**，不隶属于任何组织

### 2.5 Offer 模型（Organization ↔ Product 桥梁）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `organizationId` | UUID | 提供方组织 |
| `productId` | UUID | 关联产品 |
| `title` | String | Offer 标题 |
| `description` | String? | Offer 描述 |
| `status` | OfferStatus | DRAFT / ACTIVE / INACTIVE |

**关键约束：** `@@unique([organizationId, productId])` — 每个组织对每个产品只能有一个 Offer。

**Supplier 视角：** Offer 是 Organization（作为 Supplier）提供 Product 的载体。查询 Supplier 的产品列表 = 查询该 Organization 的 Offers。

### 2.6 DemandMatch 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `demandId` | UUID | 关联需求 |
| `productId` | UUID | 匹配的产品 |
| `matchScore` | Float | 匹配得分 |
| `matchStatus` | DemandMatchStatus | PENDING→MATCHED→REVIEWED→ACCEPTED/REJECTED |
| `offerId` | UUID? | 关联的 Offer |

**Supplier 视角：** 通过 `DemandMatch.productId → Offer.productId → Offer.organizationId` 可追溯 Supplier 的匹配历史。

---

## 3. Product 绑定检查

| 绑定字段 | 是否存在 | 当前值 |
|----------|---------|--------|
| `organizationId` | ❌ 不存在 | N/A |
| `supplierId` | ❌ 不存在 | N/A |
| `createdBy` | ❌ 不存在 | N/A |

**结论：** Product 是纯粹的 Global Catalog 实体，与组织的关联完全通过 Offer 模型间接实现。这与项目记忆中的约束一致：
> "Product is a Global Catalog and不属于 Organization"

---

## 4. Supplier / Profile 模型检查

### 4.1 是否存在 Supplier 模型？

**❌ 不存在。** 搜索结果：
- `database/prisma/schema.prisma` — 无 `Supplier` 模型
- `apps/api/src/` — 无 `supplier` 相关代码（仅 `create-organization.dto.ts` 注释中出现 `'supplier'` 示例字符串）
- 文件系统 — 无 `*supplier*` 文件

### 4.2 是否存在 Profile 模型？

**❌ 不存在。** 无任何 Profile 相关模型。

### 4.3 当前如何表示 Supplier？

| 方式 | 说明 |
|------|------|
| `Organization.type = 'supplier'` | 通过 `type` 字段（自由格式字符串）标识供应商组织 |
| `Offer` 模型 | 组织通过 Offer 关联其提供的产品 |
| `OrganizationMember` | 组织成员（含角色 `MEMBER` / `ADMIN`） |

**当前 `Organization.type` 的局限性：**
- 是自由格式 `String`，非枚举类型，无类型安全
- 无 supplier-specific 字段（如资质证书、产能、评级、服务区域等）
- 无 Profile 详情（简介、Logo、联系方式、官网等）

---

## 5. M8 Supplier Profile API 方案分析

### 5.1 方案 A：新建 Supplier 模型（需 Schema 变更）

**描述：** 创建独立的 `Supplier` 模型，包含 Profile 字段，关联 Organization。

**Schema 变更：**
```prisma
model Supplier {
  id             String @id @default(uuid())
  organizationId String @unique  // 1:1 with Organization
  profile        Json?           // 灵活 Profile (简介、资质、产能等)
  rating         Float?
  serviceArea    String?
  verifiedAt     DateTime?
  
  organization Organization @relation(...)
}
```

| 优点 | 缺点 |
|------|------|
| 清晰的 Supplier 领域模型 | **需要 Schema 变更 + Migration** |
| 支持丰富的 Profile 字段 | 违反 M8 阶段不修改 Schema 原则 |
| 1:1 关联 Organization，复用现有认证 | 增加模型复杂度 |
| 可独立扩展（资质、评级等） | Organization.type 字段冗余 |

### 5.2 方案 B：复用 Organization + JSON 扩展字段（需 Schema 变更）

**描述：** 在 Organization 上新增 `profile` JSON 字段。

**Schema 变更：**
```prisma
model Organization {
  // ... existing fields ...
  profile Json?  // 新增：supplier profile (logo, description, certifications, etc.)
}
```

| 优点 | 缺点 |
|------|------|
| 最小 Schema 变更 | **仍需 Schema 变更 + Migration** |
| 复用现有 Organization CRUD | JSON 字段无类型安全 |
| 无需新建模块 | 所有类型组织共享同一 schema |

### 5.3 方案 C：零 Schema 变更 — 复用现有模型（推荐）

**描述：** 不修改 Schema，通过现有模型组合实现 Supplier Profile API。

**核心思路：**

```
Supplier Profile API 数据来源：
├── GET /suppliers
│   └── 查询 Organization.where({ type: 'supplier' })
│       ├── name, type, status          ← Organization 字段
│       ├── productsCount               ← Offer.count({ organizationId })
│       ├── matchStats                  ← DemandMatch 聚合
│       └── memberCount                 ← OrganizationMember.count()
│
├── GET /suppliers/:id
│   └── 查询 Organization + 关联数据
│       ├── 基本信息                     ← Organization
│       ├── 产品列表                     ← Offer[] → Product[] → ProductCategory
│       ├── 匹配历史                     ← DemandMatch[] (via Offer.productId)
│       ├── 成员列表                     ← OrganizationMember[] → User[]
│       └── RFQ 响应历史                 ← RFQResponse[]
│
└── GET /suppliers/:id/products
    └── 查询 Offer + Product + ParameterValue
```

**实现方式：**

| API 端点 | 数据来源 | 说明 |
|----------|---------|------|
| `GET /suppliers` | `Organization.where({ type: 'supplier' })` | Supplier 列表（分页、搜索） |
| `GET /suppliers/:id` | `Organization` + `Offer` + `Product` | Supplier 详情 |
| `GET /suppliers/:id/products` | `Offer` + `Product` + `ProductCategory` | Supplier 产品目录 |
| `GET /suppliers/:id/matches` | `DemandMatch` (via Offer) | Supplier 匹配历史 |
| `GET /suppliers/:id/stats` | 聚合查询 | 统计数据（产品数、匹配数、成交率） |

**不需要创建的新模块：** 仅需在 `organizations/` 模块中新增 `SupplierController` / `SupplierService`（或新建 `suppliers/` 模块但仅查询现有模型）。

| 优点 | 缺点 |
|------|------|
| ✅ **零 Schema 变更** | Profile 字段受限于 Organization 现有字段 |
| ✅ **零 Migration** | 无 supplier-specific 字段（如资质证书） |
| ✅ 复用现有认证/授权体系 | 需要约定 `type = 'supplier'` 的语义 |
| ✅ 立即可用，无需数据迁移 | 无法存储结构化 Profile 数据 |
| ✅ 不破坏现有模块 | |

---

## 6. 方案推荐

### 推荐：方案 C — 零 Schema 变更，复用 Organization + Offer

**理由：**

1. **符合 M8 阶段约束：** M8 作为 Supplier Domain 起始阶段，应优先验证业务模型而非引入 Schema 变更。如果后续需要 rich Profile，可在 M8.x 子阶段通过 Migration 补充。

2. **现有模型已具备 Supplier 核心能力：**
   - `Organization.type = 'supplier'` → Supplier 身份标识
   - `Offer` → Supplier 产品目录
   - `DemandMatch` → Supplier 匹配历史
   - `OrganizationMember` → Supplier 团队

3. **业务闭环完整：**
   - Supplier 注册 → `POST /organizations` (type: 'supplier')
   - Supplier 上架产品 → `POST /offers` (organizationId + productId)
   - Supplier 接收匹配 → `DemandMatch` (via offerId)
   - Supplier 响应 RFQ → `RFQResponse`

4. **渐进式架构：** 如果 M8 后续子阶段需要 rich Profile（资质、评级、认证），可届时通过 `方案 A` 或 `方案 B` 补充 Schema。

---

## 7. M8 实施建议

### 7.1 M8.1 — Supplier Profile API（零 Schema 变更）

**新增模块：** `apps/api/src/suppliers/`

```
suppliers/
├── suppliers.module.ts
├── suppliers.controller.ts
├── suppliers.service.ts
└── dto/
    ├── query-supplier.dto.ts      # 搜索/筛选 Supplier
    └── supplier-profile.dto.ts    # Profile 响应格式
```

**API 端点：**

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/suppliers` | Supplier 列表（筛选 type='supplier' 的 Organization） |
| `GET` | `/suppliers/:id` | Supplier 详情（含产品数、匹配统计） |
| `GET` | `/suppliers/:id/products` | Supplier 产品目录（通过 Offer 查询） |
| `GET` | `/suppliers/:id/matches` | Supplier 匹配历史 |

### 7.2 M8.2 — Supplier Profile 增强（可选 Schema 变更）

如果业务需要 rich Profile，后续可考虑：
- 在 Organization 上添加 `profile` JSON 字段（方案 B）
- 或创建独立 `Supplier` 模型（方案 A）

---

## 8. 风险与注意事项

| 风险 | 等级 | 说明 |
|------|------|------|
| `Organization.type` 非枚举 | 🟡 中 | 依赖字符串约定，建议在应用层做类型校验 |
| Organization 缺少 Profile 字段 | 🟡 中 | 无法存储 Logo、资质等 Supplier 特有信息 |
| Product 无 supplierId | 🟢 低 | 通过 Offer 间接关联，符合 Global Catalog 设计 |
| 无法区分 Supplier 特有字段 | 🟡 中 | 所有 Organization 类型共享同一 schema |

---

## 9. Freeze Compatibility Check

| 冻结项 | 状态 |
|--------|------|
| Prisma Schema | ✅ NO CHANGE（方案 C） |
| Migration | ✅ NO CHANGE（方案 C） |
| Auth Module | ✅ NO CHANGE |
| JWT Payload | ✅ NO CHANGE |
| User Schema | ✅ NO CHANGE |
| Product Module | ✅ NO CHANGE |
| Offer Module | ✅ NO CHANGE（仅查询） |
| Demand Module | ✅ NO CHANGE（仅查询） |

---

## 10. Final Status

**Overall: ✅ 分析完成，推荐方案 C（零 Schema 变更）进入 M8.1**

核心发现：
1. ✅ Product 是 Global Catalog，无组织绑定 — 正确
2. ✅ Organization.type = 'supplier' 可标识供应商
3. ✅ Offer 模型是 Organization ↔ Product 的桥梁
4. ✅ DemandMatch 已关联 Offer，可追溯 Supplier 匹配
5. ❌ 无 Supplier/Profile 模型 — 但不需要立即创建
6. ✅ 方案 C 可在零 Schema 变更下实现 Supplier Profile API

---

## 11. Next Step Recommendation

**推荐进入 M8.1 — Supplier Profile API（零 Schema 变更方案）**

具体任务：
1. 创建 `suppliers/` 模块 (module, controller, service, DTO)
2. 实现 `GET /suppliers` — 查询 `Organization.type = 'supplier'` 的组织
3. 实现 `GET /suppliers/:id` — Supplier 详情（含产品数、匹配统计）
4. 实现 `GET /suppliers/:id/products` — 通过 `Offer` 查询产品目录
5. 添加认证守卫（supplier 详情可能需要认证）
6. 生成 M8.1 实施报告