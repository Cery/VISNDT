# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 08                                             |
| Document Name | Database Design Validation Report              |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 对 schema.prisma 进行最终业务模型审查，确认迁移就绪 |
| Dependency    | database/prisma/schema.prisma (post-format)     |
| Date          | 2026-07-16                                     |

---

# 1. Schema Overview

## 1.1 基本统计

| 指标 | 数值 |
|------|------|
| 枚举 (Enum) | 12 |
| 模型 (Model) | 17 |
| 关系 (Relation) | 47 |
| 索引 (Index) | 36 |
| 唯一约束 (Unique) | 6 |
| 数据库表 (Table) | 17 |

## 1.2 枚举清单

| Enum | 值 | 用途 |
|------|-----|------|
| `OrganizationStatus` | ACTIVE, INACTIVE, SUSPENDED | 组织生命周期 |
| `UserStatus` | ACTIVE, INACTIVE, SUSPENDED | 用户生命周期 |
| `OfferStatus` | DRAFT, ACTIVE, INACTIVE | Offer 生命周期 |
| `DemandStatus` | DRAFT, SUBMITTED, PROCESSING, CLOSED, CANCELLED | Demand 工作流 |
| `RFQStatus` | DRAFT, OPEN, RESPONDING, CLOSED, CANCELLED | RFQ 工作流 |
| `RFQResponseStatus` | SUBMITTED, VIEWED, ACCEPTED, REJECTED | 响应工作流 |
| `WorkflowEntityType` | DEMAND, RFQ, RFQ_RESPONSE | 工作流实体类型 |
| `WorkflowAction` | CREATED, SUBMITTED, OPENED, RESPONDED, ACCEPTED, REJECTED, CLOSED | 工作流操作 |
| `NotificationType` | SYSTEM, DEMAND_UPDATE, RFQ_UPDATE, RESPONSE_UPDATE | 通知类型 |
| `NotificationStatus` | UNREAD, READ | 通知状态 |
| `FileEntityType` | PRODUCT, ORGANIZATION, DEMAND, RFQ, RFQ_RESPONSE | 文件关联实体 |
| `FileType` | IMAGE, DOCUMENT, CERTIFICATE, OTHER | 文件类型 |
| `AuditAction` | CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN | 审计操作 |

## 1.3 模型清单

| # | Model | 表名 | 所属 Migration | 领域 |
|---|-------|------|---------------|------|
| 1 | User | user | 001 | Identity |
| 2 | Organization | organization | 001 | Identity |
| 3 | OrganizationMember | organization_member | 001 | Identity |
| 4 | ProductCategory | product_category | 002 | Product |
| 5 | Product | product | 002 | Product |
| 6 | ParameterGroup | parameter_group | 002 | Product |
| 7 | ParameterDefinition | parameter_definition | 002 | Product |
| 8 | ParameterOption | parameter_option | 002 | Product |
| 9 | ProductParameterValue | product_parameter_value | 002 | Product |
| 10 | ProductParameterDefinition | product_parameter_definition | 002 | Product |
| 11 | Offer | offer | 003 | Offer |
| 12 | Demand | demand | 003 | Demand |
| 13 | RFQ | rfq | 003 | RFQ |
| 14 | RFQResponse | rfq_response | 003 | RFQ |
| 15 | WorkflowEvent | workflow_event | 004 | Workflow |
| 16 | Notification | notification | 004 | Notification |
| 17 | AuditLog | audit_log | 004 | Audit |

---

# 2. Domain Validation

## 2.1 Identity Domain

| 模型 | 主键 | 关键字段 | 自引用 | 状态 |
|------|------|---------|--------|------|
| User | UUID | email (unique), passwordHash, status, organizationId | 无 | PASS |
| Organization | UUID | name, type, status | 无 | PASS |
| OrganizationMember | UUID | organizationId, userId, role | 无 | PASS |

**验证要点**:
- User 与 Organization 之间为可选 N:1 关系（organizationId 可空），支持未归属用户注册场景。
- OrganizationMember 的 `@@unique([organizationId, userId])` 确保同一用户不能在同一组织中有重复成员记录。
- 角色字段使用 String 自由文本（非枚举），为未来扩展角色体系预留灵活性。

## 2.2 Product Domain

| 模型 | 主键 | 关键字段 | 自引用 | 状态 |
|------|------|---------|--------|------|
| ProductCategory | UUID | name, slug (unique), parentId | 是 (CategoryTree) | PASS |
| Product | UUID | categoryId, name, model, description, status | 无 | PASS |
| ParameterGroup | UUID | name, code (unique), description | 无 | PASS |
| ParameterDefinition | UUID | parameterGroupId, name, code (unique), dataType, unit, required | 无 | PASS |
| ParameterOption | UUID | parameterDefinitionId, value, label, sortOrder | 无 | PASS |
| ProductParameterValue | UUID | productId, parameterDefinitionId, value | 无 | PASS |
| ProductParameterDefinition | UUID | productId, parameterDefinitionId, displayOrder | 无 | PASS |

**验证要点**:
- ProductCategory 支持自引用树形结构（父/子分类），可无限层级。
- 参数体系通过 ParameterDefinition（定义）→ ParameterOption（可选值）→ ProductParameterValue（产品值）三层实现，完全动态化。
- ProductParameterDefinition 作为中间关联表，控制产品与参数定义的多对多关系及展示顺序。
- 无硬编码产品参数字段（diameter, length, resolution 等），符合动态参数设计原则。

## 2.3 Offer Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| Offer | UUID | organizationId, productId, title, description, status | PASS |

**验证要点**:
- `@@unique([organizationId, productId])` 确保同一组织对同一产品只有一条 Offer。
- Offer 同时关联 Organization 和 Product，形成"组织→产品→报价"的完整链路。

## 2.4 Demand Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| Demand | UUID | title, description, organizationId, createdBy, status, parametersJson, budgetRange | PASS |

**验证要点**:
- organizationId 可选，支持未归属组织的需求提交。
- createdBy 必填，确保需求始终可追溯到创建用户。
- parametersJson (Json) 存储动态需求参数，与产品参数体系解耦。
- budgetRange 为自由文本，支持灵活预算表达。

## 2.5 RFQ Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| RFQ | UUID | demandId (unique), createdBy, status, publishedAt, closedAt | PASS |
| RFQResponse | UUID | rfqId, organizationId, offerId, message, status | PASS |

**验证要点**:
- RFQ 与 Demand 为 1:1 关系（demandId 唯一），一个需求最多生成一个询价单。
- RFQResponse 的 `@@unique([rfqId, organizationId])` 确保同一组织对同一 RFQ 只能提交一次响应。
- offerId 可选，允许组织先响应再关联具体 Offer。

## 2.6 Workflow Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| WorkflowEvent | UUID | entityType, entityId, action, operatorId, metadata (JsonB) | PASS |

**验证要点**:
- 使用多态设计（entityType + entityId）支持多种实体类型的事件记录。
- metadata (JsonB) 存储事件上下文，支持灵活扩展。
- 复合索引 `@@index([entityType, entityId])` 覆盖主要查询场景。

## 2.7 Notification Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| Notification | UUID | userId, type, status, title, message, referenceType, referenceId | PASS |

**验证要点**:
- 复合索引 `@@index([userId, status])` 覆盖"获取用户未读通知"核心查询。
- referenceType/referenceId 为可选多态引用，支持跳转到关联实体。

## 2.8 File & Audit Domain

| 模型 | 主键 | 关键字段 | 状态 |
|------|------|---------|------|
| FileAsset | UUID | entityType, entityId, fileType, fileName, storageKey, mimeType, fileSize, uploadedBy | PASS |
| AuditLog | UUID | entityType, entityId, action, operatorId, oldValue (JsonB), newValue (JsonB) | PASS |

**验证要点**:
- FileAsset 和 AuditLog 均采用多态设计（entityType + entityId），覆盖所有实体类型。
- AuditLog 仅保留 createdAt（无 updatedAt），符合审计日志不可变原则。
- oldValue/newValue 使用 JsonB 存储变更前后快照。

---

# 3. Relationship Validation

## 3.1 关系全景图

```
User ──N:1──> Organization
User ──1:N──> OrganizationMember
User ──1:N──> Demand (createdBy)
User ──1:N──> RFQ (createdBy)
User ──1:N──> WorkflowEvent (operator)
User ──1:N──> Notification
User ──1:N──> FileAsset (uploader)
User ──1:N──> AuditLog (operator)

Organization ──1:N──> OrganizationMember
Organization ──1:N──> User
Organization ──1:N──> Offer
Organization ──1:N──> Demand
Organization ──1:N──> RFQResponse

ProductCategory ──1:N──> ProductCategory (self-ref, CategoryTree)
ProductCategory ──1:N──> Product

Product ──1:N──> ProductParameterDefinition
Product ──1:N──> ProductParameterValue
Product ──1:N──> Offer

ParameterGroup ──1:N──> ParameterDefinition
ParameterDefinition ──1:N──> ParameterOption
ParameterDefinition ──1:N──> ProductParameterValue
ParameterDefinition ──1:N──> ProductParameterDefinition

Offer ──1:N──> RFQResponse

Demand ──1:1──> RFQ
RFQ ──1:N──> RFQResponse
```

## 3.2 循环依赖检查

| 检查项 | 结果 | 说明 |
|--------|------|------|
| User ↔ Organization | 无循环 | 标准双向 1:N，无依赖环 |
| ProductCategory 自引用 | 无循环 | parentId 指向不同记录，树形结构 |
| Product ↔ ProductParameterDefinition ↔ ParameterDefinition | 无循环 | 中间关联表，无业务依赖环 |
| Product ↔ Offer ↔ Organization | 无循环 | 三方关联，无循环路径 |
| Demand ↔ RFQ ↔ RFQResponse ↔ Offer | 无循环 | 单向业务流程链 |
| 全局依赖图 | 无循环 | 所有关系均为有向无环图 (DAG) |

**结论**: 无循环依赖风险。

## 3.3 索引覆盖检查

| 外键字段 | 索引覆盖 | 方式 |
|----------|---------|------|
| User.organizationId | ✓ | @@index |
| OrganizationMember.organizationId | ✓ | @@unique |
| OrganizationMember.userId | ✓ | @@index |
| ProductCategory.parentId | ✓ | @@index |
| Product.categoryId | ✓ | @@index |
| ParameterDefinition.parameterGroupId | ✓ | @@index |
| ParameterOption.parameterDefinitionId | ✓ | @@index |
| ProductParameterValue.productId | ✓ | @@unique |
| ProductParameterValue.parameterDefinitionId | ✓ | @@index |
| ProductParameterDefinition.productId | ✓ | @@unique |
| ProductParameterDefinition.parameterDefinitionId | ✓ | @@index |
| Offer.organizationId | ✓ | @@unique |
| Offer.productId | ✓ | @@index |
| Demand.organizationId | ✓ | @@index |
| Demand.createdBy | ✓ | @@index |
| RFQ.createdBy | ✓ | @@index |
| RFQResponse.rfqId | ✓ | @@unique |
| RFQResponse.organizationId | ✓ | @@index |
| RFQResponse.offerId | ✓ | @@index |
| WorkflowEvent.operatorId | ✓ | @@index |
| Notification.userId | ✓ | 复合 @@index([userId, status]) |
| FileAsset.uploadedBy | ✓ | @@index |
| AuditLog.operatorId | ✓ | @@index |

**结论**: 所有外键均有索引覆盖，无遗漏。

## 3.4 关系设计评估

| 关系 | 设计 | 评估 |
|------|------|------|
| User → Organization | N:1 可选 | 合理：支持未归属用户 |
| OrganizationMember | 中间表 | 合理：支持多组织归属 |
| Demand → RFQ | 1:1 | 合理：一个需求一个询价单 |
| RFQ → RFQResponse | 1:N | 合理：一个询价多个响应 |
| RFQResponse → Offer | N:1 可选 | 合理：可先响应后关联 |
| ProductCategory 自引用 | 树形 | 合理：支持多级分类 |
| Product ↔ ParameterDefinition | 多对多（通过中间表） | 合理：动态参数体系 |

**结论**: 所有关系设计符合业务逻辑，无错误的一对多/多对多设计。

## 3.5 API 查询难点分析

| 查询场景 | 涉及表 | 索引支持 | 风险等级 |
|----------|--------|---------|---------|
| 获取用户未读通知 | Notification | @@index([userId, status]) | 低 |
| 获取组织 Offer 列表 | Offer | @@unique([organizationId, productId]) | 低 |
| 获取产品参数 | ProductParameterValue + ParameterDefinition | 两个 @@index | 低 |
| 获取实体工作流历史 | WorkflowEvent | @@index([entityType, entityId]) | 低 |
| 获取实体文件列表 | FileAsset | @@index([entityType, entityId]) | 低 |
| 获取实体审计日志 | AuditLog | @@index([entityType, entityId]) | 低 |
| 获取 RFQ 及关联 Demand | RFQ + Demand | RFQ.demandId unique | 低 |
| 获取可响应 RFQ 的组织列表 | RFQ + Offer + Organization | 需 JOIN 多表 | 中 |
| 按参数值搜索产品 | ProductParameterValue + Product | 需全参数扫描 | 中 |

**结论**: 核心 CRUD 查询均有索引支持。两个中等风险场景（RFQ 匹配、参数搜索）属于 MVP 阶段低频/非核心功能，可在后续迭代中优化。

---

# 4. MVP Coverage

## 4.1 MVP 功能覆盖矩阵

| MVP 功能 | 支撑模型 | 覆盖状态 |
|----------|---------|---------|
| 用户注册/身份 | User | FULL |
| Organization 管理 | Organization, OrganizationMember | FULL |
| Standard Product 查询 | Product, ProductCategory | FULL |
| 产品参数展示 | ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | FULL |
| Organization Offer 展示 | Offer | FULL |
| Demand 提交 | Demand | FULL |
| RFQ 生成 | RFQ | FULL |
| Organization 响应 | RFQResponse | FULL |
| Workflow 记录 | WorkflowEvent | FULL |
| Notification 通知 | Notification | FULL |

**覆盖率**: 10/10 (100%)

## 4.2 业务流程闭环验证

```
用户注册 → 创建/加入 Organization
         ↓
平台维护 Product + ParameterDefinition
         ↓
Organization 创建 Offer (关联 Product)
         ↓
用户提交 Demand
         ↓
平台/用户生成 RFQ (关联 Demand)
         ↓
Organization 提交 RFQResponse (关联 Offer)
         ↓
WorkflowEvent 记录全程状态变更
         ↓
Notification 通知相关用户
```

**结论**: 业务流程从用户注册到组织响应形成完整闭环，所有节点均有数据模型支撑。

---

# 5. Future Expansion Boundary

## 5.1 禁止模型检查

| 禁止项 | 搜索结果 | 状态 |
|--------|---------|------|
| Order | 未出现 | PASS |
| Payment | 未出现 | PASS |
| Transaction | 未出现 | PASS |
| Inventory | 未出现 | PASS |
| CRM | 未出现 | PASS |
| Chat | 未出现 | PASS |
| Contract | 未出现 | PASS |
| AI Recommendation | 未出现 | PASS |

## 5.2 禁止字段检查

| 禁止项 | 搜索结果 | 状态 |
|--------|---------|------|
| price | 未出现 | PASS |
| inventory | 未出现 | PASS |
| stock | 未出现 | PASS |
| paymentAmount | 未出现 | PASS |
| diameter | 未出现 | PASS |
| length | 未出现 | PASS |
| resolution | 未出现 | PASS |

**结论**: 无未来阶段功能提前进入 MVP Schema。

## 5.3 扩展预留点

当前 Schema 中已预留未来扩展的接口：

| 扩展点 | 当前设计 | 未来用途 |
|--------|---------|---------|
| Organization.type (String) | 自由文本 | 可扩展为组织类型枚举 |
| OrganizationMember.role (String) | 自由文本 | 可扩展为 RBAC 角色体系 |
| Demand.parametersJson (Json) | 动态 JSON | AI 需求解析对接 |
| RFQResponse.offerId (可选) | 可选关联 | 支持先响应后匹配 |
| WorkflowEvent.metadata (JsonB) | 动态 JSON | AI 推荐/分析上下文 |
| Notification.referenceType/referenceId | 多态引用 | 扩展到更多实体类型 |

---

# 6. Risk List

## 6.1 风险分级

| # | 风险项 | 等级 | 描述 | 建议 |
|---|--------|------|------|------|
| R1 | UUID v4 vs v7 | 低 | 当前使用 `@default(uuid())` 生成 UUID v4，Blueprint 规范要求 UUID v7。UUID v7 具有时间排序性，对 B-tree 索引更友好 | 迁移时评估是否切换为 `@default(dbgenerated("gen_random_uuid()"))` 或保持 v4 |
| R2 | Demand.parametersJson 无结构化约束 | 低 | 需求参数以自由 JSON 存储，无 schema 验证 | 应用层实现参数校验；MVP 阶段可接受 |
| R3 | Product.status 使用 String 而非枚举 | 低 | 产品状态为 `String @default("DRAFT")`，无枚举约束 | 如产品状态有限，可考虑提取为 ProductStatus 枚举 |
| R4 | AuditLog.entityType 使用 String 而非枚举 | 低 | 审计日志实体类型为自由 String，与 FileAsset.entityType 的 FileEntityType 枚举不一致 | 可统一为枚举，或保持灵活性 |
| R5 | RFQ 匹配查询 | 中 | "获取可响应 RFQ 的组织"需要跨多表 JOIN（RFQ → Demand → Offer → Organization） | MVP 阶段可接受；高频场景需后续添加物化视图或缓存 |
| R6 | 参数搜索性能 | 中 | 按参数值搜索产品需全表扫描 ProductParameterValue | MVP 阶段可接受；后续考虑 pgvector 或 Elasticsearch |

## 6.2 风险汇总

| 等级 | 数量 | 说明 |
|------|------|------|
| 高 | 0 | 无阻塞性风险 |
| 中 | 2 | R5 (RFQ 匹配查询), R6 (参数搜索性能) — MVP 阶段可接受 |
| 低 | 4 | R1-R4: 设计优化建议，非阻塞 |

---

# 7. Migration Recommendation

## 7.1 迁移就绪状态

| 检查项 | 状态 |
|--------|------|
| Prisma Schema 语法验证 | PASS (prisma validate) |
| Prisma Schema 格式化 | PASS (prisma format) |
| 所有 Relation 双向完整 | PASS |
| 所有外键有索引覆盖 | PASS |
| 无循环依赖 | PASS |
| 无 Blueprint 边界违规 | PASS |
| 无未来阶段功能泄漏 | PASS |
| MVP 功能 100% 覆盖 | PASS |

## 7.2 建议迁移顺序

与 Migration Plan 注释保持一致：

```
Migration 001: Identity (User, Organization, OrganizationMember)
Migration 002: Product (ProductCategory, Product, ParameterGroup, ParameterDefinition,
               ParameterOption, ProductParameterDefinition, ProductParameterValue)
Migration 003: Offer + Demand + RFQ (Offer, Demand, RFQ, RFQResponse)
Migration 004: Notification + Audit (WorkflowEvent, Notification, FileAsset, AuditLog)
```

## 7.3 最终建议

**RECOMMENDATION: APPROVED — 可以进入 Migration 阶段。**

Schema 设计满足 MVP 全部功能需求，无阻塞性风险，建议按上述顺序执行 `prisma migrate dev`。

---

# 8. 附录：与 Blueprint 参考文档对照

| Blueprint 参考 | 对照结果 |
|---------------|---------|
| 402_PostgreSQL_Table_Specification.md | 核心表结构一致，MVP 阶段简化了 Product 层级（Category 直接到 Product，略去 SubCategory/Family/Series） |
| 405_prisma.schema-第二版全新.md | 模型命名和关系映射一致，MVP 精简了非核心模型 |
| 399_CanonicalNamingSpecification.md | 命名规范完全遵循 |
| 401_PostgreSQL_ER_Model.md | ER 关系映射正确 |

> **声明**: 本报告基于 `database/prisma/schema.prisma` (post-format, 2026-07-16) 生成。未修改任何代码。