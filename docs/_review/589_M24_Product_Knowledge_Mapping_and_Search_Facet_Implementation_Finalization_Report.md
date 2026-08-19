# 589 — M24 Product Knowledge Mapping and Search Facet Implementation Finalization Report

## 文档类型

Architecture Refinement / Final Decision / Implementation Contract Finalization

## 审计日期

2026-08-18

## 审计范围

基于 580-588 已完成的架构决策，对 M24.1 / M24.2 实施前最后三个架构契约进行冻结：

1. ProductCategoryKnowledgeMapping Schema 最终冻结
2. Search Context 不依赖分页结果的实现契约
3. Multi-Category "All/Common + Category Specific" 筛选模型最终冻结

---

# 1. Repository Verification

## 1.1 基础信息

| 项目 | 值 |
|-|-|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| Current Commit | `c54ef89` — M23（终止） |
| Working Tree | Modified (588 docs + 581-588 untracked reports) |
| Previous Task | 588_M24 PASS — 3 Architecture Decisions Finalized |

## 1.2 目录结构验证

| 目录 | 状态 |
|-|:-:|
| `apps/api` | ✅ 存在 |
| `apps/web` | ✅ 存在 |
| `apps/admin` | ✅ 存在 |
| `database` | ✅ 存在 |
| `database/prisma` | ✅ 存在 |
| `docs/_review` | ✅ 存在 |
| `docs/_architecture` | ✅ 存在 |
| `docs/project-management` | ✅ 存在 |

**Repository Verification: PASS**

---

# 2. Previous Architecture Verification

## 2.1 前置报告清单

| 前置报告 | 状态 |
|-|:-:|
| 580_M22.4_Search_Discovery_Architecture_Finalization_V2_Report.md | ✅ |
| 581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit_Report.md | ✅ |
| 582_Supplier_Capability_Service_Contact_Distribution_Architecture_Audit_Report.md | ✅ |
| 583_Capability_Discovery_Supplier_Exposure_Governance_Architecture_Audit_Report.md | ✅ |
| 584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture_Audit_Report.md | ✅ |
| 585_Platform_Capability_Governance_Final_Freeze_Audit_Report.md | ✅ |
| 586_M23.1_Platform_Stability_and_Boundary_Verification_Audit_Report.md | ✅ |
| 587_M24_Product_Experience_Optimization_Architecture_Audit_Report.md | ✅ |
| 588_M24_Product_Knowledge_Search_Context_Architecture_Finalization_Report.md | ✅ |

**Previous Architecture Verification: ALL PRESENT — PASS**

---

# 3. Decision Area A — ProductCategoryKnowledgeMapping Schema Final Freeze

## 3.1 Current-State Audit

### ProductCategory (schema.prisma L316-L332)

```prisma
model ProductCategory {
  id       String  @id @default(uuid()) @db.Uuid
  name     String
  slug     String  @unique
  parentId String? @map("parent_id") @db.Uuid
  parent   ProductCategory?  @relation("CategoryTree", fields: [parentId], references: [id])
  children ProductCategory[] @relation("CategoryTree")
  products Product[]
  demands  Demand[]
}
```

**关键字段**: `id`, `name`, `slug`, `parentId`（自引用树形结构）

### KnowledgeDomain (schema.prisma L951-L968)

```prisma
model KnowledgeDomain {
  id          String   @id @default(uuid()) @db.Uuid
  name        String
  slug        String   @unique
  parentId    String?  @map("parent_id") @db.Uuid
  categories  KnowledgeCategory[]
  entries     KnowledgeEntry[]
}
```

### KnowledgeCategory (schema.prisma L970-L987)

```prisma
model KnowledgeCategory {
  id          String   @id @default(uuid()) @db.Uuid
  domainId    String   @map("domain_id") @db.Uuid
  name        String
  slug        String
  domain      KnowledgeDomain @relation(fields: [domainId], references: [id])
  entries     KnowledgeEntry[]
}
```

**关键关系**: `KnowledgeCategory → KnowledgeDomain (FK: domainId)`

### 当前映射状态

| 检查项 | 结果 |
|-|-|
| ProductCategory ↔ KnowledgeCategory 直接映射 | **不存在** |
| ProductCategory 到 Knowledge 的 FK | **不存在** |
| product_category_knowledge_mapping 表 | **不存在** |
| schema.prisma 中 Mapping 模型 | **不存在** |

**结论: 当前 Repository 中 ProductCategory 与 Knowledge 之间 NO MAPPING — 完全独立。**

## 3.2 knowledgeDomainId 是否直接存储

### 分析

```
KnowledgeCategory 已包含 domainId（FK → KnowledgeDomain）
```

如果 Mapping 表同时存储 `knowledgeDomainId`：

```
Mapping.knowledgeDomainId
    ↕ (可能矛盾)
KnowledgeCategory.domainId
```

两个 Domain 引用可能不一致，形成数据完整性风险。

### 最终决策

```
knowledgeDomainId: NOT STORED in Mapping Table

Domain 通过 KnowledgeCategory 间接推导：
  Mapping → KnowledgeCategory → KnowledgeDomain

理由：
  1. KnowledgeCategory.domainId 已是权威 Domain 归属
  2. 避免 Mapping 表与 KnowledgeCategory 的 Domain 不一致
  3. 减少冗余字段，降低维护成本
  4. 查询时通过 JOIN KnowledgeCategory 即可获取 Domain
```

## 3.3 Final Schema

```prisma
model ProductCategoryKnowledgeMapping {
  id                  String            @id @default(uuid()) @db.Uuid
  productCategoryId   String            @map("product_category_id") @db.Uuid
  knowledgeCategoryId String            @map("knowledge_category_id") @db.Uuid
  sortOrder           Int               @default(0) @map("sort_order")
  isActive            Boolean           @default(true) @map("is_active")

  productCategory     ProductCategory   @relation(fields: [productCategoryId], references: [id])
  knowledgeCategory   KnowledgeCategory @relation(fields: [knowledgeCategoryId], references: [id])

  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  @@unique([productCategoryId, knowledgeCategoryId])
  @@index([productCategoryId])
  @@index([knowledgeCategoryId])
  @@map("product_category_knowledge_mapping")
}
```

### Schema 字段说明

| 字段 | 类型 | 说明 |
|-|-|-|
| `id` | UUID | 主键 |
| `productCategoryId` | UUID FK → ProductCategory | 平台产品分类 |
| `knowledgeCategoryId` | UUID FK → KnowledgeCategory | 平台知识分类 |
| `sortOrder` | Int | 排序（同一 ProductCategory 下多个 KnowledgeCategory 的优先级） |
| `isActive` | Boolean | 软开关（可停用特定映射，不删除） |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 约束

| 约束 | 说明 |
|-|-|
| `@@unique([productCategoryId, knowledgeCategoryId])` | 同一 ProductCategory 与 KnowledgeCategory 仅一条映射 |
| `@@index([productCategoryId])` | 按产品分类查询映射 |
| `@@index([knowledgeCategoryId])` | 按知识分类反向查询映射 |

### 关系链路

```
ProductCategory
        ↓
ProductCategoryKnowledgeMapping (M:N)
        ↓
KnowledgeCategory
        ↓ (domainId FK)
KnowledgeDomain
        ↓
KnowledgeEntry
```

## 3.4 Cardinality

```
M:N

ProductCategory "工业内窥镜"
    ↓ (mapping rows)
KnowledgeCategory "内窥镜参数"
KnowledgeCategory "视觉检测"
KnowledgeCategory "管道检测"

KnowledgeCategory "视觉检测"
    ↑ (mapping rows)
ProductCategory "工业内窥镜"
ProductCategory "工业显微镜"
ProductCategory "检测机器人"
```

**支持一对多和多对多双向映射。** 不设计为单一 KnowledgeCategory FK。

## 3.5 Lifecycle / isActive Strategy

```
isActive = true  → 映射生效，Knowledge 关联展示
isActive = false → 映射停用，Knowledge 不展示（软删除）
```

**不物理删除映射行**，保留历史记录，支持审计和恢复。

## 3.6 Industrial Expansion Compatibility

| 设备类型 | ProductCategory | 映射方式 | 是否需代码变更 |
|-|-|-|:-:|
| 工业内窥镜 | 工业内窥镜 | 新增 Mapping Row | 否 |
| 超声探伤仪 | 超声探伤仪 | 新增 Mapping Row | 否 |
| 磁粉探伤仪 | 磁粉探伤仪 | 新增 Mapping Row | 否 |
| 射线检测设备 | 射线检测设备 | 新增 Mapping Row | 否 |
| 涡流检测设备 | 涡流检测设备 | 新增 Mapping Row | 否 |
| 三维扫描仪 | 三维扫描仪 | 新增 Mapping Row | 否 |
| 三坐标测量机 | 三坐标测量机 | 新增 Mapping Row | 否 |
| 工业显微镜 | 工业显微镜 | 新增 Mapping Row | 否 |
| 检测机器人 | 检测机器人 | 新增 Mapping Row | 否 |

**所有设备类型扩展均通过 Admin 新增 Mapping Row 完成，无需代码变更、无需新增设备专属模型、无需新增设备专属表。**

## 3.7 Mapping 职责边界

```
ProductCategoryKnowledgeMapping
只负责：
  Platform Product Category
      ↕
  Platform Knowledge Category

不承担：
  Product 直接关联
  Supplier 关联
  Offer 关联
  Contact 关联
  Matching 关联
  ParameterValue 关联
```

---

# 4. Decision Area B — Search Context Must Not Depend on Pagination

## 4.1 Current-State Audit

### 当前搜索 API (`GET /search?q=`)

**Controller** (`search.controller.ts` L39-L40):
```typescript
async search(@Query() dto: UnifiedSearchDto) {
  const result = await this.searchService.search(dto.q, dto.page, dto.pageSize);
}
```

**Service** (`search.service.ts` L91-L107):
```typescript
async search(query: string, page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [products, knowledge, content, solutions, suppliers] = await Promise.all([
    this.searchProducts(query, skip, pageSize),    // ← skip, take 分页
    this.searchKnowledgeEntries(query, skip, pageSize),
    this.searchContent(query, [ARTICLE, INSIGHT], skip, pageSize),
    this.searchContent(query, [SOLUTION], skip, pageSize),
    this.searchSuppliers(query, skip, pageSize),
  ]);
  return { query, products, knowledge, content, solutions, suppliers };
}
```

**Product Search** (`search.service.ts` L112-L145):
```typescript
private async searchProducts(keyword, skip, take) {
  const [items, total] = await Promise.all([
    this.prisma.product.findMany({ where, skip, take, ... }),  // ← 分页查询
    this.prisma.product.count({ where }),
  ]);
  return { items, total };
}
```

### 当前状态分析

| 检查项 | 结果 |
|-|-|
| 搜索是否有独立 Context 计算 | **否** — 只有分页结果 |
| 搜索结果是否含 Category Aggregation | **否** — 仅返回 items + total |
| 搜索结果是否含 Parameter Facet | **否** — 无任何 Facet 信息 |
| 搜索是否 page-dependent | **是** — items 仅含当前页数据 |
| 是否 pageSize-dependent | **是** — take = pageSize 直接影响返回 |
| 是否有 SearchContext DTO | **否** |

**结论: 当前搜索完全分页耦合。Search Context = 分页结果，无独立 Context 层。**

## 4.2 Final Architectural Principle

```
Search Result Pagination
    ≠
Search Context Calculation

Context = Query-level computation（基于全量候选集）
Results = Page-level computation（基于 skip/take）
```

### 正式架构

```
                         ┌── Paginated Results (items + total)
                         │
Search Query ──→ Search Context Resolver
                         │
                         ├── Category Facets (category breakdown)
                         │
                         ├── Relevant Parameter Definitions
                         │
                         └── Parameter Facets (value ranges/distributions)
```

## 4.3 Search Context Contract

### 请求

```
GET /search/context?q={keyword}
```

**不依赖 page / pageSize 参数。**

### 响应

```typescript
interface SearchContext {
  query: string;

  // Category aggregation from FULL candidate population
  categoryContext: {
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    productCount: number;       // How many products in this category match
  }[];

  // Relevant parameter definitions from FULL candidate population
  relevantParameters: {
    parameterDefinitionId: string;
    parameterName: string;
    parameterCode: string;
    dataType: 'NUMBER' | 'ENUM' | 'BOOLEAN' | 'STRING';
    unit: string | null;
    groupName: string;
    groupCode: string;

    // Facet data for filter UI
    valueRange?: { min: number; max: number };  // NUMBER type
    distinctValues?: string[];                    // ENUM type
    resultCoverage: number;                       // 0.0-1.0, how many candidates have this param
  }[];

  totalCandidates: number;  // Total matching products (not just page 1)
}
```

### 计算契约

```
Search Context 计算流程：

1. Query → Candidate Product Set (全量，不 skip/take)
   - WHERE status = 'ACTIVE'
   - WHERE (name ILIKE q OR model ILIKE q OR description ILIKE q)

2. Candidate Set → Category Aggregation
   - GROUP BY categoryId
   - COUNT per category

3. Candidate Set → Parameter Definition Aggregation
   - SELECT DISTINCT ppd.parameterDefinitionId
   - FROM ProductParameterDefinition ppd
   - WHERE ppd.productId IN (candidate product IDs)
   - JOIN ParameterDefinition, ParameterGroup

4. Per Parameter → Facet Computation
   - NUMBER type: MIN(valueNumber), MAX(valueNumber) FROM ProductParameterValue
   - ENUM type: SELECT DISTINCT value FROM ProductParameterValue
   - Coverage: COUNT(products with this param) / totalCandidates
```

## 4.4 Category Resolution Contract

```
Category Context 数据来源：
  全量候选产品集（Full Matching Candidate Population）

不得仅从：
  当前分页结果（Current Page Result）

实现方式（Future Implementation）：
  - 选项 A: 独立 COUNT + GROUP BY 查询（推荐）
  - 选项 B: 先查全量 candidate IDs，再聚合
  - 禁止: 仅从 page items 提取 category
```

## 4.5 Parameter Context Contract

```
Relevant Parameter 数据来源：
  全量候选产品集（Search Candidate Population）

不得仅从：
  当前分页结果（Current Result Page）

正式数据流：
  Query
   ↓
  Candidate Products (全量 ID 集合)
   ↓
  Category Context (GROUP BY categoryId)
   ↓
  Candidate Products' Parameter Definitions (DISTINCT parameterDefinitionId)
   ↓
  Facet Aggregation (MIN/MAX for NUMBER, DISTINCT for ENUM)
```

## 4.6 Pagination Invariance Test

### Test A (page=1, pageSize=10)

```
GET /search/context?q=内窥镜
GET /search?q=内窥镜&page=1&pageSize=10
```

### Test B (page=2, pageSize=10)

```
GET /search/context?q=内窥镜
GET /search?q=内窥镜&page=2&pageSize=10
```

### Test C (page=1, pageSize=50)

```
GET /search/context?q=内窥镜
GET /search?q=内窥镜&page=1&pageSize=50
```

### 预期结果

| 属性 | Test A | Test B | Test C | 一致性 |
|-|:-:|:-:|:-:|:-:|
| Category Context | 相同 | 相同 | 相同 | ✅ |
| Relevant Parameter Set | 相同 | 相同 | 相同 | ✅ |
| Parameter Facet Definition | 相同 | 相同 | 相同 | ✅ |
| Result Items | page 1 items | page 2 items | 50 items | ⚠️ 允许变化 |
| Pagination Metadata | page=1, total | page=2, total | page=1, total | ⚠️ 允许变化 |

**Search Context 必须完全一致，无论 page/pageSize 如何变化。**

---

# 5. Decision Area C — Multi-Category "All/Common + Category Specific"

## 5.1 Single Category Mode

当搜索命中单一 ProductCategory 时：

```
Search Query "内窥镜"
    ↓
Category Context: 工业内窥镜（唯一）
    ↓
界面: 直接展示该 Category 专属参数
    ↓
不需要 Category Tabs
```

**单分类时简化 UI，不强制展示 Tabs。**

## 5.2 Multi-Category Mode

当搜索命中多个 ProductCategory 时：

```
Search Query "工业检测设备"
    ↓
Category Context:
  - 工业内窥镜 (15 products)
  - 超声探伤仪 (12 products)
  - 三维扫描仪 (8 products)

界面:
  All | 工业内窥镜 | 超声探伤仪 | 三维扫描仪

  All Tab:
    └── Common Filters（跨分类共有的参数）

  工业内窥镜 Tab:
    └── Common Filters + 内窥镜专属参数

  超声探伤仪 Tab:
    └── Common Filters + 探伤仪专属参数

  三维扫描仪 Tab:
    └── Common Filters + 扫描仪专属参数
```

## 5.3 "All" Semantics — Final Freeze

```
All = Common Discovery Filters

NOT: 所有参数并集（Union of all parameters）

Common Filters 包含：
  - 跨分类具有稳定业务意义的参数
  - 所有分类共有的 ParameterDefinition（交集）
  - 例如：品牌、价格范围、防护等级（如果多分类共享）

Common Filters 不包含：
  - 某一设备独有参数
  - 内窥镜的视场角
  - 探伤仪的探头频率
  - 扫描仪的扫描精度
```

### 示例

```
搜索: "内窥镜 探伤仪"

All Tab:
  Common Filters:
    - 防护等级（如果两个分类都有）
    - 重量（如果两个分类都有）
  
  不展示:
    - 视场角（仅内窥镜有）
    - 探头频率（仅探伤仪有）

内窥镜 Tab:
  Common Filters + 视场角 / 景深 / 管径 / 工作长度 / 导向方式 / 光源类型

探伤仪 Tab:
  Common Filters + 频率 / 探头类型 / 检测方式 / 检波方式
```

## 5.4 Category-Specific Filters

```
Category Tab 必须：
  only show filters whose parameter usage belongs to that category context

禁止：
  在 Category A Tab 下显示 Category B 参数
  在 内窥镜 Tab 下显示 探头频率
  在 探伤仪 Tab 下显示 视场角
```

## 5.5 Filter State Management — Final Freeze

```
Filter State 模型：

Global State:
  - selectedCategoryTab: 'all' | categoryId
  - commonFilters: { [parameterDefinitionId]: value }
  - categorySpecificFilters: { [categoryId]: { [parameterDefinitionId]: value } }

Tab 切换行为：
  All → Category A:
    commonFilters: PRESERVED
    categorySpecificFilters['all']: CLEARED
    categorySpecificFilters['categoryA']: RESTORED (if previously set)

  Category A → Category B:
    commonFilters: PRESERVED
    categorySpecificFilters['categoryA']: SAVED (not cleared)
    categorySpecificFilters['categoryB']: RESTORED (if previously set)

  Category B → All:
    commonFilters: PRESERVED
    categorySpecificFilters['categoryB']: SAVED
    commonFilters only: APPLIED
```

### 隔离规则

```
在内窥镜 Tab 选择 "管径=6mm"
    ↓
切换至 探伤仪 Tab
    ↓
"管径=6mm" 不进入探伤仪筛选条件  ← MUST NOT POLLUTE
Common Filters 保留
探伤仪专属筛选独立
```

## 5.6 Desktop / Mobile Consistency

### Desktop

```
Search Result Page
 ├── Side Filter Panel
 │    ├── Category Tabs (multi-category only)
 │    ├── Common Filters
 │    └── Category-Specific Filters
 └── Result List
```

### Mobile

```
Search Result Page
 ├── Filter Button (含激活筛选计数 badge)
 └── Result List

Filter Button 点击 →
 Bottom Sheet / Drawer
  ├── Category Tabs (multi-category only)
  ├── Common Filters
  └── Category-Specific Filters
```

### 一致性契约

```
Same Context:         GET /search/context?q= 同一 API
Same Filter Contract: 同一 ParameterFilterDto
Same State Semantics: 同一 Common/Category-Specific 隔离模型
Same Result Query:    GET /search?q=&parameterFilters= 同一 API
```

**不得因 Mobile 形成第二套搜索逻辑。**

---

# 6. ADR Summary

## ADR-M24-008: ProductCategoryKnowledgeMapping Schema

| 属性 | 值 |
|-|-|
| **Decision** | 创建 ProductCategoryKnowledgeMapping 表，ProductCategory ↔ KnowledgeCategory M:N 映射 |
| **Schema** | id, productCategoryId (FK), knowledgeCategoryId (FK), sortOrder, isActive, timestamps |
| **knowledgeDomainId** | NOT STORED — 通过 KnowledgeCategory.domainId 推导 |
| **Cardinality** | M:N — 一个 ProductCategory 可映射多个 KnowledgeCategory，反之亦然 |
| **Unique** | @@unique([productCategoryId, knowledgeCategoryId]) |
| **Indexes** | productCategoryId, knowledgeCategoryId |
| **Lifecycle** | isActive 软开关，不物理删除 |
| **Alternatives Rejected** | Option A (Name-Based): 分类重命名即断裂，不可靠；Option C (Explicit ProductKnowledge): 逐产品维护，成本高 |
| **Impact** | M24.1: 1 新表 + 1 Migration + Admin CRUD + API + Frontend |
| **Implementation Boundary** | 仅映射 ProductCategory ↔ KnowledgeCategory，不涉及 Product/Supplier/Offer/Matching |
| **Future Extension** | 新增设备类型仅需新增映射行，零代码变更 |

## ADR-M24-009: Query-Level Search Context Contract

| 属性 | 值 |
|-|-|
| **Decision** | Search Context 基于全量候选集计算，不依赖分页结果 |
| **API** | `GET /search/context?q={keyword}` — 独立 Context API，无 page/pageSize |
| **Context 计算** | 全量 Candidate Products → Category Aggregation → Parameter Definition Aggregation → Facet Computation |
| **Category Context** | 基于全量候选产品 GROUP BY categoryId，非当前页提取 |
| **Parameter Context** | 基于全量候选产品 DISTINCT parameterDefinitionId，非当前页提取 |
| **Pagination Invariance** | page=1/2/N, pageSize=10/50，Context 完全一致 |
| **Alternatives Rejected** | Page-dependent Context: 切换分页导致筛选参数变化，用户困惑 |
| **Impact** | M24.2: 1 新 API endpoint + 1 Service method + Frontend integration |
| **Implementation Boundary** | Context 仅用于筛选 UI 渲染，不修改 Matching/Scoring/Ranking |

## ADR-M24-010: Multi-Category Common + Specific Filter Model

| 属性 | 值 |
|-|-|
| **Decision** | All/Common + Category-Specific 双层筛选模型 |
| **All Tab** | Common Filters = 跨分类共有参数（交集），非全参数并集 |
| **Category Tab** | Common Filters + 该分类专属参数 |
| **Filter State** | Common Filters 跨 Tab 持久，Category-Specific 按 Tab 隔离 |
| **Tab 切换** | Common 保留，Category-Specific 独立保存/恢复，不污染其他 Tab |
| **Single Category** | 简化 UI，不展示 Tabs |
| **Alternatives Rejected** | Flat Union: 全参数并集导致内窥镜搜索出现探伤仪参数，用户体验差 |
| **Impact** | M24.2: Frontend Filter Panel 实现，API 支持 categoryId 参数 |
| **Implementation Boundary** | 筛选 UI 逻辑，不修改数据库/API 核心 |

---

# 7. Test Scenario Design

## Scenario 1 — Single Category

```
Query: 内窥镜

预期:
  Category Context: 工业内窥镜（唯一）
  Filters: 管径 / 工作长度 / 视场角 / 景深 / 防护等级 / 镜头视向 / 导向方式 / 光源类型
  UI: 无 Category Tabs（单分类简化）

禁止:
  探伤仪频率 / 探头类型 / 三坐标测量范围 / 三维扫描精度
```

## Scenario 2 — Parameter Query

```
Query: 6mm 内窥镜

预期:
  Category Context: 工业内窥镜
  Filter Context: 管径 = 6mm

明确:
  6mm 不是新的 ProductCategory
  6mm 不是 Supplier Model
  6mm 不是固定 Product Model
  6mm 属于 Filter Context（参数筛选值）
```

## Scenario 3 — Multi-Category

```
Query: 工业检测设备

预期:
  Category Context: 工业内窥镜 / 超声探伤仪 / 三维扫描仪 / ...

  All Tab: Common Filters（跨分类交集参数）

  工业内窥镜 Tab: Common + 内窥镜专属参数
  超声探伤仪 Tab: Common + 探伤仪专属参数
  三维扫描仪 Tab: Common + 扫描仪专属参数

禁止:
  All Tab 中出现视场角（仅内窥镜）
  All Tab 中出现探头频率（仅探伤仪）
```

## Scenario 4 — Pagination Invariance

```
Test A: GET /search/context?q=内窥镜  +  GET /search?q=内窥镜&page=1&pageSize=10
Test B: GET /search/context?q=内窥镜  +  GET /search?q=内窥镜&page=2&pageSize=10
Test C: GET /search/context?q=内窥镜  +  GET /search?q=内窥镜&page=1&pageSize=50

预期:
  Category Context: 三种测试完全一致
  Relevant Parameter Set: 三种测试完全一致
  Parameter Facet: 三种测试完全一致
  Result Items: 允许不同（分页差异）
```

## Scenario 5 — Filter Isolation

```
初始: All Tab, Common Filters = {防护等级: IP67}

Step 1: 切换到 内窥镜 Tab
  → Common Filters 保留: {防护等级: IP67}
  → 内窥镜专属: 空

Step 2: 在内窥镜 Tab 选择 "管径=6mm"
  → Common Filters: {防护等级: IP67}
  → 内窥镜专属: {管径: 6mm}

Step 3: 切换到 探伤仪 Tab
  → Common Filters 保留: {防护等级: IP67}
  → 内窥镜专属 SAVED: {管径: 6mm}
  → 探伤仪专属: 空
  → "管径=6mm" 不进入探伤仪筛选条件 ← MUST VERIFY

Step 4: 切回 内窥镜 Tab
  → Common Filters: {防护等级: IP67}
  → 内窥镜专属 RESTORED: {管径: 6mm}
```

## Scenario 6 — Mobile

```
Mobile: 搜索 "内窥镜"

预期:
  Desktop Context = Mobile Context
  Desktop: Side Filter Panel
  Mobile:  Filter Button → Bottom Sheet

验证:
  Same API: GET /search/context?q=内窥镜
  Same Filter Contract: ParameterFilterDto
  Same State Semantics: Common/Category-Specific 隔离
  Same Result Query: GET /search?q=内窥镜&parameterFilters=[...]
```

## Scenario 7 — Knowledge Association

```
ProductCategory: 工业内窥镜
  ↓ (Mapping)
KnowledgeCategory: 内窥镜参数 / 视觉检测 / 管道检测
  ↓
KnowledgeEntry: 景深 / 视场角 / 防护等级

预期:
  Product Detail 页展示 Related Knowledge Section
  Knowledge 通过 ProductCategory → Mapping → KnowledgeCategory → KnowledgeEntry 获取

不得:
  Direct ProductKnowledge hardcode
  AI association
  Parameter Knowledge Runtime
```

---

# 8. Architecture Boundary Verification

## 8.1 核心边界

| 边界 | 状态 | 验证 |
|-|:-:|-|
| Product = Platform Capability Asset | ✅ CONFIRMED | Product 无 organizationId/supplierId/storeId |
| Offer = Supplier Capability Association | ✅ CONFIRMED | Offer 关联 Product + Organization |
| Organization = Capability Provider | ✅ CONFIRMED | 无 Supplier Store/Shop/Mall 模型 |
| Knowledge = Platform Knowledge Asset | ✅ CONFIRMED | Knowledge 不替代 Product，不成为 AI Runtime |
| Search = Unified Industrial Discovery | ✅ CONFIRMED | 保持工业检测能力发现定位 |
| Matching = Deterministic Parameter Matching | ✅ CONFIRMED | weighted_v1 确定性评分 |
| AI = FROZEN | ✅ CONFIRMED | AI 接口只读，无运行时激活 |
| Marketplace = 永久禁止 | ✅ CONFIRMED | 无 Supplier Store/Shop/Ranking/Rating/Follow |

## 8.2 M24 实施边界

| 允许 | 禁止 |
|-|-|
| ProductCategoryKnowledgeMapping 表 | Product 模型修改 |
| ProductCategory ↔ KnowledgeCategory 映射 | Product ↔ Knowledge 直接 FK |
| GET /search/context 独立 API | Search 结果中嵌入 Context |
| Context 基于全量候选集计算 | Context 基于当前页计算 |
| All/Common + Category-Specific 筛选 | 全参数并集展示 |
| Category Tab 筛选隔离 | 筛选条件跨分类污染 |
| Mobile Bottom Sheet | Mobile 独立筛选逻辑 |
| Knowledge 关联展示 | Parameter Knowledge Runtime |
| 参数筛选 Facet | AI 推荐/排序/语义理解 |

---

# 9. Impact Assessment

## 9.1 本任务变更

```
Code Change:
NONE

Database Change:
NONE

API Change:
NONE

Frontend Change:
NONE

Admin Change:
NONE

Migration:
NONE

AI Change:
NONE
```

## 9.2 M24 实施预估影响

| 阶段 | Database | API | Web | Admin | SEO | Analytics |
|-|:-:|:-:|:-:|:-:|:-:|:-:|
| M24.1 | 1 新表 + 1 Migration | 2-3 新 endpoints | 4-6 files | 1-2 pages | + (Product↔Knowledge) | + (关联点击) |
| M24.2 | NONE | 1 新 endpoint (context) | 6-8 files | NONE | + (Search Filter) | + (筛选事件) |
| M24.3 | TBD | TBD | TBD | TBD | TBD | TBD |

## 9.3 M24.1 Entry Gate

```
M24.1 Entry Gate: OPEN

Entry Conditions:
  ✅ ProductCategoryKnowledgeMapping Schema = FINALIZED (ADR-M24-008)
  ✅ Search Context Contract = FINALIZED (ADR-M24-009, Query-Level, Pagination-Independent)
  ✅ Multi-Category Filter Model = FINALIZED (ADR-M24-010, All/Common + Category-Specific)
  ✅ Filter State Isolation = FINALIZED (Common Persistent + Category Isolated)
  ✅ Mobile Consistency = FINALIZED (Same Semantics, Different Presentation)
  ✅ Parameter Knowledge Boundary = FROZEN/DEFERRED
  ✅ Architecture Boundaries = ALL PASS
  ✅ Documentation Sync = COMPLETED
```

---

# 10. M24 Roadmap Impact

基于 589 最终决策，M24 路线图无需调整，确认如下：

### M24.1: Product Experience Foundation

| ID | 任务 | 优先级 | 依赖 ADR |
|-|-|:-:|-|
| M24.1.1 | ProductCategoryKnowledgeMapping 表 + Migration | **P0** | ADR-M24-008 |
| M24.1.2 | Mapping Admin 配置 | **P0** | ADR-M24-008 |
| M24.1.3 | Product Detail Related Knowledge | **P0** | ADR-M24-008 |
| M24.1.4 | Related Products 推荐 | **P0** | — |
| M24.1.5 | Overview CTA | **P0** | — |
| M24.1.6 | Knowledge Detail Related Products | **P0** | ADR-M24-008 |
| M24.1.7 | Product Compare Entry | **P1** | — |

### M24.2: Discovery & Conversion Enhancement

| ID | 任务 | 优先级 | 依赖 ADR |
|-|-|:-:|-|
| M24.2.1 | GET /search/context API | **P0** | ADR-M24-009 |
| M24.2.2 | Search Filter UI (Context-Aware) | **P0** | ADR-M24-009, ADR-M24-010 |
| M24.2.3 | Mobile Filter Drawer | **P0** | ADR-M24-009, ADR-M24-010 |
| M24.2.4 | Search Suggestions API | **P0** | — |
| M24.2.5 | Search Result Sorting | **P1** | — |
| M24.2.6 | Inquiry Template Pre-fill | **P1** | — |
| M24.2.7 | Mobile Knowledge Reading | **P1** | — |
| M24.2.8 | Mobile Product Detail Quick Actions | **P1** | — |

### M24.3: Advanced Experience (DEFERRED)

| ID | 任务 | 优先级 |
|-|-|:-:|
| M24.3.1 | Parameter Knowledge Runtime | **P2** |
| M24.3.2 | Multi-Supplier Inquiry | **P2** |
| M24.3.3 | Did You Mean Suggestions | **P2** |
| M24.3.4 | Anonymous Inquiry History | **P2** |

---

# 11. Final Execution Output

```
Task:
589_M24_Product_Knowledge_Mapping_and_Search_Facet_Implementation_Finalization

Status:
PASS

Code Change:
NONE

Database Change:
NONE

API Change:
NONE

Frontend Change:
NONE

Admin Change:
NONE

AI Change:
NONE

ADR-M24-008:
ProductCategoryKnowledgeMapping Schema — FINALIZED
  - M:N ProductCategory ↔ KnowledgeCategory
  - knowledgeDomainId NOT STORED (derived from KnowledgeCategory)
  - isActive soft toggle, no physical delete
  - @@unique([productCategoryId, knowledgeCategoryId])

ADR-M24-009:
Query-Level Search Context Contract — FINALIZED
  - GET /search/context?q= (no page/pageSize)
  - Context from FULL candidate population, NOT current page
  - Pagination Invariant: same context for page=1/2/N, pageSize=10/50

ADR-M24-010:
Multi-Category Common + Specific Filter Model — FINALIZED
  - All = Common Filters (intersection, not union)
  - Category Tab = Common + Category-Specific
  - Common Persistent, Category-Specific Isolated
  - Single Category = simplified UI, no Tabs

ProductCategoryKnowledgeMapping:
FINALIZED

Search Context:
QUERY-LEVEL / PAGINATION-INDEPENDENT

Relevant Parameter Facet:
CANDIDATE-POPULATION BASED

Multi-Category Filter:
ALL/COMMON + CATEGORY-SPECIFIC

Filter State:
COMMON PERSISTENT + CATEGORY ISOLATED

Mobile Filter:
SAME SEMANTICS / BOTTOM SHEET

Parameter Knowledge:
FROZEN / DEFERRED to M24.3

M24 Roadmap:
SYNCHRONIZED

M24.1 Entry Gate:
OPEN

Review Report:
docs/_review/589_M24_Product_Knowledge_Mapping_and_Search_Facet_Implementation_Finalization_Report.md

Next Task:
M24.1.1 ProductCategoryKnowledgeMapping Implementation
```

---

# 12. 文档同步

| 文件 | 操作 | 状态 |
|-|-|:-:|
| `docs/_review/589_M24_Product_Knowledge_Mapping_and_Search_Facet_Implementation_Finalization_Report.md` | 新增 | ✅ |
| `docs/project-management/PROJECT_ROADMAP.md` | 更新（纳入 589） | 待更新 |
| `docs/project-management/PROJECT_STATUS.md` | 更新（纳入 589） | 待更新 |
| `docs/project-management/MODULE_COMPLETION_MATRIX.md` | 更新（589 状态） | 待更新 |
| `docs/project-management/BUSINESS_CAPABILITY_MAP.md` | 不适用（无 M24 相关内容） | ⏭️ 跳过 |

---

**三个架构契约全部冻结。M24.1 / M24.2 实施前所有架构决策点已收敛完毕。M24.1 Entry Gate OPEN。零代码变更。**