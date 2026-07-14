# 1. 文档目标

本文档定义 **VISNDT 全平台 PostgreSQL 逻辑实体关系模型（Logical ER Model）**。

它不是 DDL，不包含字段类型，而是定义：

- 实体（Entity）
- 主键（Primary Key）
- 外键（Foreign Key）
- 基数（Cardinality）
- 聚合关系（Aggregation）
- 组合关系（Composition）
- 中间实体（Mapping Entity）

后续：

- `402_PostgreSQL_Table_Specification.md`
- `403_PostgreSQL_DDL.sql`
- `405_prisma.schema`

全部以本文件为唯一依据。

------

# 2. 数据库总体架构

建议采用按**业务域（Domain）**组织，而不是按技术模块组织。

```
Database
│
├── Product Domain
├── Organization Domain
├── Offer Domain
├── Knowledge Domain
├── Demand Domain
├── RFQ Domain
├── Workflow Domain
├── Dictionary Domain
├── User & Permission Domain
├── File Domain
├── AI Domain
├── Search Domain
└── System Domain
```

每个 Domain 内部保持高内聚，对外通过主键关联。

------

# 3. Product Domain

核心实体：

```
ProductCategory
        │
        ▼
ProductSubCategory
        │
        ▼
ProductFamily
        │
        ▼
ProductSeries
        │
        ▼
StandardProduct
```

扩展实体：

```
StandardProduct
├── ProductParameterValue
├── ProductCapability
├── ProductFeature
├── ProductAttachment
├── ProductImage
├── ProductVersion
├── ProductWorkflow
└── ProductAudit
```

------

# 4. Organization Domain

```
Organization
│
├── OrganizationMember
├── OrganizationAddress
├── OrganizationContact
├── OrganizationCertification
└── OrganizationAttachment
```

说明：

- Organization 不直接拥有 Product。
- 组织通过 Offer 引用 Product。

------

# 5. Offer Domain

```
Organization
        │
        ▼
Offer
        │
        ├── OfferPrice
        ├── OfferAttachment
        ├── OfferRegion
        ├── OfferInventory
        └── OfferService
```

关系：

```
Organization 1 —— N Offer

StandardProduct 1 —— N Offer
```

Offer 是连接企业与标准产品的核心桥梁。

------

# 6. Knowledge Domain

```
Knowledge
│
├── KnowledgeCategory
├── KnowledgeAttachment
└── ProductKnowledgeMapping
```

说明：

- 一个知识可关联多个产品；
- 一个产品可关联多个知识；
- 使用中间表维护。

------

# 7. Demand Domain

```
Demand
│
├── DemandItem
├── DemandAttachment
└── DemandRecommendation
```

其中：

- `DemandRecommendation` 保存 AI 推荐结果；
- 不直接复制产品数据。

------

# 8. RFQ Domain

```
RFQ
│
├── RFQItem
├── RFQQuotation
├── RFQAttachment
└── RFQWorkflow
```

关系：

```
RFQ
   │
   ▼
RFQItem
   │
   ▼
StandardProduct
```

这样一个 RFQ 可以包含多个产品。

------

# 9. Dictionary Domain

统一维护基础数据：

```
Dictionary
        │
        ▼
DictionaryItem
```

建议覆盖：

- 国家
- 地区
- 行业
- 材料
- 检测方法
- 标准
- 单位
- 币种
- 语言

所有业务域统一引用，不重复建表。

------

# 10. File Domain

统一文件中心：

```
FileObject
│
├── FileVersion
├── FileTag
└── FilePermission
```

各业务实体通过 Mapping 表关联文件，不保存实际路径。

------

# 11. AI Domain

```
Embedding
│
├── KnowledgeGraphNode
├── KnowledgeGraphEdge
├── SearchIndex
└── VectorChunk
```

说明：

- AI 数据与业务数据分离；
- AI 仅引用业务主键，不复制业务字段。

------

# 12. Workflow Domain

统一工作流：

```
WorkflowDefinition
│
├── WorkflowInstance
├── WorkflowTask
├── WorkflowHistory
└── WorkflowComment
```

产品、Offer、Knowledge 等均可复用同一工作流框架。

------

# 13. User & Permission Domain

```
User
│
├── UserProfile
├── UserCredential
├── Role
├── Permission
├── UserRole
└── RolePermission
```

第一阶段采用 **RBAC**。

------

# 14. 系统公共实体

建议统一维护：

```
AuditLog
OperationLog
Notification
SystemSetting
Sequence
Job
```

避免各业务域重复实现日志和配置。

------

# 15. 跨域关系总览

```
Organization
        │
        ▼
      Offer
        │
        ▼
StandardProduct
   │    │    │
   │    │    ├────────► Capability
   │    ├─────────────► Feature
   ├──────────────────► ParameterValue
   │
   ├────────► Knowledge (M:N)
   ├────────► Demand (AI Match)
   ├────────► RFQItem
   ├────────► Attachment
   ├────────► Workflow
   └────────► AI Metadata
```

------

# 16. 第一阶段预计数据库实体规模

| Domain            | 预计实体数 |
| ----------------- | ---------- |
| Product           | 20～25     |
| Organization      | 8～10      |
| Offer             | 8～12      |
| Knowledge         | 6～8       |
| Demand            | 5～8       |
| RFQ               | 6～10      |
| Dictionary        | 2～4       |
| Workflow          | 6～8       |
| User & Permission | 6～10      |
| File              | 4～6       |
| AI                | 5～8       |
| System            | 5～8       |

**预计总实体数量：约 90～110 张表。**