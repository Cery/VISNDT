# M7.0 Business Architecture Preflight Report

**Date**: 2026-07-18  
**Phase**: M7.0 — Business Architecture Preflight Review  
**Status**: PASS WITH OBSERVATIONS (3 Observations, 0 Blockers)

---

## 1. Executive Summary

M7 Business Feature Development 前的架构预审完成。审查覆盖 7 个领域：M6 Freeze 兼容性、Organization 业务所有权、Product/RFQ/Demand/Supplier 领域架构、多组织能力、认证集成标准、数据所有权矩阵、Schema 影响评估。

**核心结论**: 当前架构具备进入 M7 的基础。发现 3 项需要关注的观察点，但均不阻塞 M7.1 启动。

---

## 2. M6 Freeze Compatibility Check

### 2.1 M6 Freeze Artifacts

| Artifact | Frozen At | M7 Impact Assessment |
|----------|-----------|---------------------|
| Auth Module Architecture | M6.4 | ✅ No change needed |
| JWT Contract (JwtPayload) | M6.4 | ✅ Stable for M7 |
| Auth API (3 endpoints) | M6.3 | ✅ No change needed |
| RBAC Architecture | M6.5 | ✅ Ready for M7 use |
| User Model | M6.1 | ✅ No change needed |
| OrganizationMember Model | M1 | ✅ No change needed |

### 2.2 Dependency Direction Check

```
M6 (Authentication)  ←  M7 (Business) depends on M6
       ↑                         ↑
       └─── Provides ────────────┘
       JwtAuthGuard, RolesGuard, @CurrentUser(), @Roles()
```

✅ Correct: M7 Business Modules depend on M6 Auth, never the reverse.

### 2.3 Current Module Architecture

```
AppModule (16 imports)
├── ConfigModule (global)
├── PrismaModule
├── HealthModule
├── UsersModule
├── OrganizationsModule
├── OrganizationMembersModule  ← imports AuthModule (M6.5)
├── ProductCategoriesModule
├── ProductsModule
├── ParameterGroupsModule
├── ParameterDefinitionsModule
├── ProductParametersModule
├── OffersModule
├── DemandsModule
├── RfqsModule
├── RfqResponsesModule
├── WorkflowEventsModule
└── AuthModule                 ← M6 complete
```

**Observation**: 仅 OrganizationMembersModule 导入了 AuthModule。其余 10 个业务模块均未导入 AuthModule，也未使用任何 Guard。

---

## 3. Organization Business Ownership Review

### 3.1 Current Data Ownership Reality

```
Organization (type: supplier/buyer)
├── users[]              ← User.organizationId (direct FK, nullable)
├── members[]            ← OrganizationMember (many-to-many with role)
├── offers[]             ← Offer.organizationId (supplier's offer)
├── demands[]            ← Demand.organizationId (buyer's demand, nullable)
└── rfqResponses[]       ← RFQResponse.organizationId (supplier's response)
```

### 3.2 Product Ownership Gap

| Model | Has organizationId? | Has createdBy? | Owner |
|-------|---------------------|---------------|-------|
| Product | ❌ NO | ❌ NO | **Global catalog** |
| ProductCategory | ❌ NO | ❌ NO | **Global catalog** |
| Offer | ✅ YES (organizationId) | ❌ NO | Organization |
| Demand | ✅ YES (organizationId?) | ✅ YES (createdBy) | Organization + User |
| RFQ | ❌ NO (via Demand) | ✅ YES (createdBy) | Via Demand |
| RFQResponse | ✅ YES (organizationId) | ❌ NO | Organization |

### 3.3 Key Finding: Product is NOT Organization-Owned

**Current Design**:
```
Product (no owner) → Offer (organizationId) → Organization
```

**Recommended Direction** (M7 consideration):
```
Organization → Product (add organizationId)
Organization → Offer (organizationId exists)
```

**Analysis**: Product currently exists as a global catalog without organizational ownership. The Offer model bridges Product to Organization. This is a valid design for a marketplace model where:
- Products are defined globally (catalog)
- Organizations create Offers against Products (supplier-specific pricing/availability)

**Verdict**: The current design is acceptable for MVP. If M7 requires organization-scoped products, a `Product.organizationId` field would be needed as a future migration.

---

## 4. Product Domain Architecture

### 4.1 Current State

```
Product
├── categoryId → ProductCategory (self-referencing tree)
├── name, model, description
├── status: DRAFT (string)
├── parameterAssociations[] → ProductParameterDefinition
├── parameterValues[] → ProductParameterValue
└── offers[] → Offer
```

### 4.2 Product-Parameter System

```
ParameterGroup → ParameterDefinition → ParameterOption
       ↓                                      ↓
ProductParameterDefinition              ProductParameterValue
       ↓                                      ↓
    Product ←─────────────────────────────────┘
```

### 4.3 M7 Integration Pattern

```typescript
// Recommended: Product Controller with auth
@Controller('products')
export class ProductsController {
  // Public: anyone can browse products
  @Get()
  async findAll() { ... }

  // Authenticated: only logged-in users can create
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: CreateProductDto, @CurrentUser() user) { ... }

  // Admin-only: only organization admins can manage
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) { ... }
}
```

### 4.4 Product Ownership Decision

| Aspect | Current | M7 Recommendation |
|--------|---------|-------------------|
| Who creates products? | Anyone (no auth) | Authenticated users |
| Who owns products? | No owner | Organization (if org-scoped) or global catalog |
| Who manages products? | Anyone (no auth) | Organization ADMIN |
| Product catalog visibility | Public | Public (marketplace) |

---

## 5. RFQ / Demand Domain Architecture

### 5.1 Current Design

```
Demand (buyer's request)
├── organizationId → Organization (nullable, buyer org)
├── createdBy → User (creator)
├── title, description, parametersJson, budgetRange
├── status: DRAFT → SUBMITTED → PROCESSING → CLOSED → CANCELLED
└── rfq → RFQ (1:1)

RFQ (published request for quotation)
├── demandId → Demand (1:1, @unique)
├── createdBy → User (publisher)
├── status: DRAFT → OPEN → RESPONDING → CLOSED → CANCELLED
├── publishedAt, closedAt
└── responses[] → RFQResponse

RFQResponse (supplier's response)
├── rfqId → RFQ
├── organizationId → Organization (supplier responding)
├── offerId → Offer (optional, supplier's offer)
├── message
├── status: SUBMITTED → VIEWED → ACCEPTED → REJECTED
└── @@unique([rfqId, organizationId]) (one response per org)
```

### 5.2 Business Flow Analysis

```
Buyer Organization          Marketplace          Supplier Organization
     │                                               │
     ├─ Demand (createdBy, orgId)                    │
     │      │                                        │
     │      └─ RFQ (1:1, published)                  │
     │             │                                 │
     │             ├─ RFQResponse (orgId=supplier)  ─┤
     │             │      │                          │
     │             │      └─ Offer (optional)       ─┤
     │             │                                 │
     │             └─ Status: ACCEPTED               │
     │                                               │
     └────────────────── Deal ───────────────────────┘
```

### 5.3 Ownership Assessment

| Question | Answer | Detail |
|----------|--------|--------|
| Demand belongs to whom? | Buyer Organization + Creator | `organizationId` + `createdBy` |
| RFQ belongs to whom? | Created by user (via Demand) | `createdBy` on RFQ, demandId links to org |
| Who can create Demand? | Any authenticated user | Currently no auth; M7 should add |
| Who can publish RFQ? | Organization ADMIN | Proposed; `@Roles(Role.ADMIN)` |
| Who can respond? | Supplier Organization | `organizationId` on RFQResponse |
| Multi-person collaboration? | ✅ Supported | Multiple members per org via OrganizationMember |

---

## 6. Supplier Architecture

### 6.1 Current Supplier Identity Model

```
Organization (type: "supplier")
├── users[] → User (via User.organizationId)
├── members[] → OrganizationMember
│     ├── role: ADMIN
│     └── role: MEMBER
├── offers[] → Offer
└── rfqResponses[] → RFQResponse
```

### 6.2 Assessment

| Check | Result |
|-------|--------|
| Supplier as Organization? | ✅ Yes — `Organization.type` field |
| ADMIN + MEMBER roles? | ✅ Yes — `OrganizationMember.role` |
| SupplierUser separate model? | ❌ No — and shouldn't be; use OrganizationMember |
| Supplier can have offers? | ✅ Yes — `Offer.organizationId` |
| Supplier can respond to RFQ? | ✅ Yes — `RFQResponse.organizationId` |

### 6.3 Recommendation

保持现有设计：
```
Organization (type: supplier)
├── ADMIN  → manages offers, responds to RFQs
└── MEMBER → views offers, views RFQs
```

不引入 `SupplierUser` 独立模型。当前 `Organization + OrganizationMember` 已完整支持供应商身份。

---

## 7. Multi-Organization Capability

### 7.1 Current Design

```
User A
├── organizationId: Org-A (primary org, nullable)
└── memberships[]:
      ├── OrganizationMember(orgId=Org-A, role=ADMIN)
      └── OrganizationMember(orgId=Org-B, role=MEMBER)
```

### 7.2 JWT OrganizationId Analysis

| Aspect | Current | Limitation |
|--------|---------|------------|
| JWT carries | `User.organizationId` (primary org) | Only ONE organization |
| OrganizationMember | Multiple records, multiple roles | Not in JWT |
| RolesGuard query | `organizationId_userId` from JWT | Only checks primary org |

### 7.3 Impact Assessment

**Scenario**: User A is ADMIN in Org-A, MEMBER in Org-B.

| Action | JWT orgId | RolesGuard | Result |
|--------|-----------|------------|--------|
| Access Org-A resource | Org-A | ADMIN | ✅ 200 |
| Access Org-B resource | Org-A (primary) | Lookup Org-A | ⚠️ Wrong org context |

**Risk**: JWT carries only the primary organization. When a user needs to act in a different organization context, the current JWT payload cannot represent that.

### 7.4 Recommendation

| Option | Effort | Impact |
|--------|--------|--------|
| A: Keep current (primary org only) | None | MVP acceptable; users switch primary org via API |
| B: Add `X-Organization-Id` header | Medium | Frontend sends active org context |
| C: JWT carries all memberships | High | Large JWT; breaks M6 freeze |

**Recommendation for M7**: Start with Option A (MVP). Add Option B in M7.x if needed. Option C is not recommended as it breaks M6 freeze.

---

## 8. Authentication Integration Standard

### 8.1 M7 Controller Integration Patterns

#### Pattern 1: Public Endpoint (No Auth)

```typescript
@Get()
@ApiOperation({ summary: 'List all items' })
async findAll(@Query() pagination: PaginationDto) {
  return ApiResponse.ok(await this.service.findAll(pagination));
}
```

#### Pattern 2: Authenticated Endpoint

```typescript
@Post()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create a new item' })
async create(
  @Body() dto: CreateDto,
  @CurrentUser() user: AuthRequest['user'],
) {
  // user.id, user.email, user.name, user.organizationId available
  return ApiResponse.ok(await this.service.create(dto, user), 'Created');
}
```

#### Pattern 3: Admin-Only Endpoint

```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update item (ADMIN only)' })
async update(
  @Param('id') id: string,
  @Body() dto: UpdateDto,
  @CurrentUser() user: AuthRequest['user'],
) {
  return ApiResponse.ok(await this.service.update(id, dto, user), 'Updated');
}
```

### 8.2 Module Integration

```typescript
// M7 business module MUST import AuthModule
@Module({
  imports: [AuthModule],
  controllers: [SomeBusinessController],
  providers: [SomeBusinessService],
})
export class SomeBusinessModule {}
```

### 8.3 M7 Integration Checklist

| # | Step | Required? |
|---|------|-----------|
| 1 | `imports: [AuthModule]` in business module | ✅ YES |
| 2 | `@UseGuards(JwtAuthGuard)` on protected routes | ✅ YES |
| 3 | `@CurrentUser()` for user context | ✅ YES |
| 4 | `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` | For admin routes |
| 5 | `@ApiBearerAuth()` on protected endpoints | ✅ YES |
| 6 | `ApiResponse<T>` format | ✅ YES (existing standard) |

---

## 9. Business Data Ownership Matrix

### 9.1 Current State + M7 Recommendation

| Model | Creator | Owner | Viewer | Editor | Deleter |
|-------|---------|-------|--------|--------|---------|
| **User** | Self (register) | Self | Self, Admin | Self, Admin | Admin |
| **Organization** | Any auth user | Organization | Members | ADMIN | ADMIN |
| **OrganizationMember** | ADMIN | Organization | Members | ADMIN | ADMIN |
| **Product** | Auth user | Global/Org* | Public | Org ADMIN | Org ADMIN |
| **ProductCategory** | Admin | Global | Public | Admin | Admin |
| **ParameterGroup** | Admin | Global | Public | Admin | Admin |
| **ParameterDefinition** | Admin | Global | Public | Admin | Admin |
| **Offer** | Org ADMIN | Organization | Public | Org ADMIN | Org ADMIN |
| **Demand** | Org member | Buyer Org | Org members | Creator, ADMIN | ADMIN |
| **RFQ** | Org ADMIN | Buyer Org | Public (open) | Org ADMIN | Org ADMIN |
| **RFQResponse** | Supplier Org | Supplier Org | RFQ creator, Supplier | Supplier | Supplier |
| **WorkflowEvent** | System | System | Org members | System | System |
| **Notification** | System | User (recipient) | User | System | User |
| **FileAsset** | Auth user | Uploader/Org | Entity viewers | Uploader | Uploader, Admin |
| **AuditLog** | System | System | Admin | System | System |

\* Product ownership depends on M7 decision: global catalog vs organization-scoped.

### 9.2 Key Principle

> **Business data belongs to Organization, not User.**
> User acts on behalf of Organization via OrganizationMember.role.

---

## 10. Module Boundary Recommendation

### 10.1 Recommended M7 Module Structure

```
src/
├── auth/                          # M6 — FROZEN
│   ├── ...
│   └── (no changes allowed)
│
├── organizations/                 # M1 — Existing
├── organization-members/          # M6.5 — Auth-integrated
│
├── products/                      # M7.2 — Add auth guards
├── product-categories/            # M7.2 — Add auth guards
├── parameter-groups/              # M7.3 — Add auth guards
├── parameter-definitions/         # M7.3 — Add auth guards
├── product-parameters/            # M7.3 — Add auth guards
│
├── offers/                        # M7.2 — Add auth guards
├── demands/                       # M7.4 — Add auth guards
├── rfqs/                          # M7.4 — Add auth guards
├── rfq-responses/                 # M7.5 — Add auth guards
│
├── workflow-events/               # M7.6 — Add auth guards
├── notifications/                 # M7.6 — Add auth guards
├── files/                         # M7.7 — New module
├── audit/                         # M7.7 — New module
│
├── common/                        # Shared DTOs, filters, interceptors
├── prisma/                        # Database access
└── health/                        # Health check
```

### 10.2 Boundary Rules

| Rule | Description |
|------|-------------|
| R1 | Business Module MUST NOT modify AuthModule |
| R2 | Business Module MUST NOT modify JWT Contract |
| R3 | Business Module MUST NOT add User.role |
| R4 | Business Module MUST NOT add Permission table |
| R5 | Business Module MUST import AuthModule for auth guards |
| R6 | Business Module MUST use `@CurrentUser()` (not `req.user`) |

---

## 11. Prisma Schema Impact Assessment

### 11.1 Current Schema State

| Metric | Value |
|--------|-------|
| Models | 18 |
| Enums | 13 |
| Relations | 24 |
| Indexes | 10 unique, 32 non-unique |
| Migrations | 2 (init + add_user_name) |

### 11.2 M7 Schema Impact Forecast

| Change | Category | Migration | Priority |
|--------|----------|-----------|----------|
| Product + organizationId | **Architecture Risk** | New migration | M7.2 (if org-scoped) |
| Product + createdBy | **Architecture Risk** | New migration | M7.2 (tracking) |
| ProductCategory + isSystem | **No Change** | — | — |
| FileAsset table | Already exists | No migration | M7.7 (use existing) |
| AuditLog table | Already exists | No migration | M7.7 (use existing) |
| Notification table | Already exists | No migration | M7.6 (use existing) |
| WorkflowEvent table | Already exists | No migration | M7.6 (use existing) |
| New Role enum values | **No Change** | No migration | M7.x (app-level only) |

### 11.3 Impact Categories

| Category | Count | Description |
|----------|-------|-------------|
| **No Change Needed** | 6 | FileAsset, AuditLog, Notification, WorkflowEvent, existing enums |
| **Future Migration Required** | 2 | Product.organizationId, Product.createdBy (if needed) |
| **Architecture Risk** | 2 | Product ownership model decision |

---

## 12. M7 Development Roadmap

### 12.1 Recommended Execution Order

| Phase | Domain | Rationale | Depends On |
|-------|--------|-----------|------------|
| **M7.1** | Organization Context | Foundation: org-scoped auth context | M6 |
| **M7.2** | Product Domain | Core catalog: products + categories + offers | M7.1 |
| **M7.3** | Product Parameter System | Product metadata: params + groups + definitions | M7.2 |
| **M7.4** | RFQ / Demand Domain | Procurement flow: demand → RFQ | M7.1 |
| **M7.5** | Supplier Response | RFQ responses from suppliers | M7.4 |
| **M7.6** | Workflow + Notification | State transitions + alerts | M7.4, M7.5 |
| **M7.7** | File + Audit | File uploads + audit trail | M7.2-M7.6 |

### 12.2 Dependency Graph

```
M7.1 Organization Context
  ├── M7.2 Product Domain ── M7.3 Parameter System
  │                              │
  └── M7.4 RFQ/Demand ──── M7.5 Supplier Response
         │                         │
         └── M7.6 Workflow/Notification
                  │
                  └── M7.7 File/Audit
```

### 12.3 Rationale

1. **M7.1 first**: Organization context is the foundation all business modules depend on
2. **Product before RFQ**: Products/categories/offers are the catalog; RFQ references them
3. **Parameter after Product**: Parameters are metadata on products
4. **RFQ before Response**: Responses depend on published RFQs
5. **Workflow after core flow**: State transitions depend on Demand/RFQ/Response being functional
6. **File/Audit last**: Cross-cutting concerns that depend on all business entities

---

## 13. Risk Assessment

| # | Risk | Severity | Domain | Mitigation |
|---|------|----------|--------|------------|
| R1 | Product has no owner | **Medium** | Product | M7.2: add organizationId or accept global catalog |
| R2 | JWT carries only one organizationId | **Medium** | Multi-org | M7.1: add org-switch mechanism or accept MVP limitation |
| R3 | All business controllers unprotected | **High** | Security | M7.1-M7.7: add guards to all write endpoints |
| R4 | Product.organizationId requires migration | **Low** | Schema | M7.2: if needed, new migration |
| R5 | Demand.organizationId is nullable | **Low** | Demand | M7.4: enforce non-null for org-scoped demands |
| R6 | No organization context in API path | **Low** | API Design | Accept for MVP; add scoping rules in service layer |

---

## 14. Final Decision

### 14.1 Preflight Result

| Domain | Result |
|--------|--------|
| M6 Freeze Compatibility | ✅ PASS |
| Organization Business Ownership | ✅ PASS |
| Product Domain Architecture | ⚠️ OBSERVATION (no owner) |
| RFQ / Demand Domain Architecture | ✅ PASS |
| Supplier Architecture | ✅ PASS |
| Multi-Organization Capability | ⚠️ OBSERVATION (single org in JWT) |
| Authentication Integration Standard | ✅ PASS |
| Business Data Ownership Matrix | ✅ PASS |
| Module Boundary | ✅ PASS |
| Prisma Schema Impact | ⚠️ OBSERVATION (product owner migration) |
| M7 Development Roadmap | ✅ PASS |

### 14.2 Observations (Non-Blocking)

| # | Observation | M7 Phase | Resolution |
|---|-------------|----------|------------|
| O1 | Product has no `organizationId` — global catalog | M7.2 | Decide: global catalog OR add orgId + migration |
| O2 | JWT carries only one organization (primary) | M7.1 | Accept MVP; add org-switch later |
| O3 | 10 business modules have no auth guards | M7.1-M7.7 | Add guards progressively |

### 14.3 Build Result

```
npm run build → nest build → Exit Code 0
```

No TypeScript errors. No schema changes. No migrations created.

### 14.4 Final Verdict

**M7.0 Business Architecture Preflight Review: PASS WITH OBSERVATIONS**

M7.1 Organization Context can proceed. The 3 observations are non-blocking and can be resolved during M7 business implementation.

**Ready for M7.1.**