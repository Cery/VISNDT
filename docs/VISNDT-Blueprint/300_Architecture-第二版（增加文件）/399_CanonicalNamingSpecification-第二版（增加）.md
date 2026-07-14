# 1. 文档定位

本规范是整个 VISNDT Repository 的**唯一命名标准（Canonical Naming Standard）**。

作用：

- 统一业务术语
- 统一数据库命名
- 统一 Prisma Model
- 统一 NestJS Module
- 统一 REST API
- 统一 TypeScript 类型
- 统一前端组件命名
- 统一 AI 知识图谱节点

**任何新增模块必须遵循本规范。**

------

# 2. 命名原则

## Principle 1：One Object, One Canonical Name

每一个业务对象只有一个正式名称。

例如：

| 正确             | 错误                                  |
| ---------------- | ------------------------------------- |
| Standard Product | Product、Goods、Item 混用             |
| Organization     | Company、Enterprise 混用              |
| Offer            | Product Offer、Quotation Product 混用 |

------

## Principle 2：Business First

业务名称优先。

数据库、代码、API 均围绕业务名称派生。

例如：

```
Business
Standard Product

↓

Database
standard_product

↓

Prisma
StandardProduct

↓

NestJS
ProductModule

↓

API
/products

↓

Frontend
Product
```

------

## Principle 3：统一风格

| 层                   | 命名规则            |
| -------------------- | ------------------- |
| 数据库               | snake_case          |
| Prisma               | PascalCase          |
| NestJS Class         | PascalCase          |
| TypeScript Interface | PascalCase          |
| JSON                 | camelCase           |
| REST                 | kebab-case + plural |
| DTO                  | PascalCase          |
| Enum                 | PascalCase          |
| 常量                 | UPPER_SNAKE_CASE    |

------

# 3. Product Domain 映射

| Canonical           | PostgreSQL           | Prisma             | Module        | API                     |
| ------------------- | -------------------- | ------------------ | ------------- | ----------------------- |
| Standard Product    | standard_product     | StandardProduct    | ProductModule | /products               |
| Product Category    | product_category     | ProductCategory    | ProductModule | /product-categories     |
| Product SubCategory | product_sub_category | ProductSubCategory | ProductModule | /product-sub-categories |
| Product Family      | product_family       | ProductFamily      | ProductModule | /product-families       |
| Product Series      | product_series       | ProductSeries      | ProductModule | /product-series         |

------

# 4. Parameter Domain

| Canonical               | PostgreSQL              | Prisma                | API                       |
| ----------------------- | ----------------------- | --------------------- | ------------------------- |
| Parameter Group         | parameter_group         | ParameterGroup        | /parameter-groups         |
| Parameter Definition    | parameter_definition    | ParameterDefinition   | /parameter-definitions    |
| Parameter Template      | parameter_template      | ParameterTemplate     | /parameter-templates      |
| Parameter Template Item | parameter_template_item | ParameterTemplateItem | /parameter-template-items |
| Product Parameter Value | product_parameter_value | ProductParameterValue | /product-parameter-values |

------

# 5. Capability Domain

| Canonical             | PostgreSQL            | Prisma               | API                   |
| --------------------- | --------------------- | -------------------- | --------------------- |
| Capability Definition | capability_definition | CapabilityDefinition | /capabilities         |
| Product Capability    | product_capability    | ProductCapability    | /product-capabilities |
| Feature Definition    | feature_definition    | FeatureDefinition    | /features             |
| Product Feature       | product_feature       | ProductFeature       | /product-features     |

------

# 6. Organization Domain

| Canonical            | PostgreSQL           | Prisma              | API                     |
| -------------------- | -------------------- | ------------------- | ----------------------- |
| Organization         | organization         | Organization        | /organizations          |
| Organization Member  | organization_member  | OrganizationMember  | /organization-members   |
| Organization Address | organization_address | OrganizationAddress | /organization-addresses |

------

# 7. Offer Domain

| Canonical        | PostgreSQL       | Prisma          | API                |
| ---------------- | ---------------- | --------------- | ------------------ |
| Offer            | offer            | Offer           | /offers            |
| Offer Price      | offer_price      | OfferPrice      | /offer-prices      |
| Offer Attachment | offer_attachment | OfferAttachment | /offer-attachments |

------

# 8. Knowledge Domain

| Canonical          | PostgreSQL         | Prisma            | API                   |
| ------------------ | ------------------ | ----------------- | --------------------- |
| Knowledge          | knowledge          | Knowledge         | /knowledge            |
| Knowledge Category | knowledge_category | KnowledgeCategory | /knowledge-categories |

------

# 9. Demand & RFQ Domain

| Canonical | PostgreSQL | Prisma  | API        |
| --------- | ---------- | ------- | ---------- |
| Demand    | demand     | Demand  | /demands   |
| RFQ       | rfq        | RFQ     | /rfqs      |
| RFQ Item  | rfq_item   | RFQItem | /rfq-items |

------

# 10. Dictionary Domain

| Canonical       | PostgreSQL      | Prisma         | API               |
| --------------- | --------------- | -------------- | ----------------- |
| Dictionary      | dictionary      | Dictionary     | /dictionaries     |
| Dictionary Item | dictionary_item | DictionaryItem | /dictionary-items |

------

# 11. Workflow Domain

| Canonical         | PostgreSQL        | Prisma           | API                 |
| ----------------- | ----------------- | ---------------- | ------------------- |
| Workflow          | workflow          | Workflow         | /workflows          |
| Workflow Instance | workflow_instance | WorkflowInstance | /workflow-instances |
| Audit Log         | audit_log         | AuditLog         | /audit-logs         |

------

# 12. AI Domain

| Canonical    | PostgreSQL   | Prisma      | API             |
| ------------ | ------------ | ----------- | --------------- |
| AI Metadata  | ai_metadata  | AiMetadata  | /ai-metadata    |
| Embedding    | embedding    | Embedding   | /embeddings     |
| Search Index | search_index | SearchIndex | /search-indexes |

------

# 13. 前端命名规范

统一采用：

| 类型     | 示例                  |
| -------- | --------------------- |
| 页面     | ProductListPage       |
| 页面     | ProductDetailPage     |
| 组件     | ProductCard           |
| 组件     | ProductParameterTable |
| Hook     | useProducts           |
| Store    | useProductStore       |
| Type     | Product               |
| API 文件 | product.api.ts        |
| Service  | product.service.ts    |

------

# 14. DTO 命名规范

统一采用：

```
CreateProductDto
UpdateProductDto
ProductResponseDto
ProductQueryDto
ProductFilterDto
```

禁止出现：

- ProductCreateDTO
- Update_Product
- ProductReq

保持全项目一致。

------

# 15. 最终开发纪律（冻结）

自本文件起，整个 Repository 执行以下规则：

1. **业务模型冻结**：不得随意新增或删除核心实体。
2. **命名冻结**：所有开发均遵循 Canonical Naming Specification。
3. **数据库优先**：数据库表名不得脱离业务模型。
4. **代码一致**：Prisma、NestJS、API、前端统一使用映射名称。
5. **向后兼容**：后续新增实体不得破坏既有命名和关系。