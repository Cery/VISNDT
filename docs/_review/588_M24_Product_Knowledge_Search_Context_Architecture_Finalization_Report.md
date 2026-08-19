# 588 — M24 Product Knowledge Search Context Architecture Finalization Report

## 文档类型

Architecture Refinement / Decision Finalization / Documentation Synchronization

## 审计日期

2026-08-18

## 审计范围

基于 580-587 已完成的架构决策，对 M24 实施前仍存在的三个架构决策点进行最终收敛：

1. Product ↔ Knowledge Deterministic Association
2. Search → Category Context → Relevant Parameter Filter
3. M24 Roadmap / Documentation Final Synchronization

---

# 1. Repository Verification

## 1.1 基础信息

| 项目 | 值 |
|-|-|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| Current Commit | `c54ef8954899e88706a0140a32874958e4c47dc7` |
| Working Tree | Clean (no uncommitted changes) |
| Previous Task | 587_M24 PASS — M24 Buyer Experience Enhancement Defined |

## 1.2 目录结构验证

| 目录 | 状态 |
|-|:-:|
| `apps/api` | ✅ 存在 |
| `apps/web` | ✅ 存在 |
| `apps/admin` | ✅ 存在 |
| `database` | ✅ 存在 |
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

**Previous Architecture Verification: ALL PRESENT — PASS**

---

# 3. Decision Area A — Product ↔ Knowledge Current-State Audit

## 3.1 Database Schema Audit

### Product 模型 (`schema.prisma` L334-L364)

```prisma
model Product {
  id          String  @id
  categoryId  String  @map("category_id") @db.Uuid
  name        String
  // ...
  category    ProductCategory  @relation(fields: [categoryId], references: [id])
}
```

**Product 关联链路**: `Product → ProductCategory (FK: categoryId)`

### KnowledgeEntry 模型 (`schema.prisma` L1014-L1044)

```prisma
model KnowledgeEntry {
  id          String  @id
  domainId    String  @map("domain_id") @db.Uuid
  categoryId  String  @map("category_id") @db.Uuid
  // ...
  domain      KnowledgeDomain    @relation(fields: [domainId], references: [id])
  category    KnowledgeCategory  @relation(fields: [categoryId], references: [id])
}
```

**KnowledgeEntry 关联链路**: `KnowledgeEntry → KnowledgeDomain (FK: domainId)` + `KnowledgeEntry → KnowledgeCategory (FK: categoryId)`

### 关键发现

| 检查项 | 结果 |
|-|-|
| Product ↔ KnowledgeEntry Direct FK | **不存在** |
| Product ↔ KnowledgeEntry Indirect via Category | **不存在** — ProductCategory 与 KnowledgeCategory 是独立实体，无任何映射 |
| Product ↔ KnowledgeEntry via Content Reference | **不存在** — KnowledgeContentRef 仅关联 Content，不关联 Product |
| Product ↔ KnowledgeEntry via API Join | **不存在** — 无任何 API endpoint 同时返回 Product 和关联 Knowledge |
| Product ↔ KnowledgeEntry Frontend Association | **不存在** — ProductDetailContent 不展示 Knowledge，KnowledgeEntry detail 不展示 Product |
| ProductCategory ↔ KnowledgeCategory Mapping | **不存在** — 无映射表、无配置、无约定 |

**结论: 当前 Product 与 Knowledge 之间 NO ASSOCIATION — 完全独立。**

## 3.2 API Audit

### Product Detail API (`products.service.ts` L120-L138)

```typescript
async findOne(idOrSlug: string) {
  const product = await this.prisma.product.findUnique({
    where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
    include: {
      category: true,
      parameterValues: { include: { parameterDefinition: true } },
      media: true,
      createdBy: { include: { organization: true } },
      offers: { include: { organization: true } },
      // ❌ 无 Knowledge 关联
    },
  });
}
```

### Public Knowledge API (`knowledge-public.controller.ts`)

- `GET /knowledge/public/entries` — 支持 domainId/categoryId/domainSlug/search 过滤
- `GET /knowledge/public/entries/:slug` — 按 slug 获取
- **无 Product 关联参数**

### Search API (`search.service.ts`)

- `GET /search?q=` — 并行查询 Product + KnowledgeEntry + Content + Solution + Supplier
- 搜索结果中 Product 包含 `category` 信息，KnowledgeEntry 包含 `domain` 和 `category` 信息
- **搜索结果中 Product 和 Knowledge 之间无关联**

## 3.3 Frontend Audit

### Product Detail Page (`apps/web/src/app/products/[slug]/page.tsx`)

- 4 Tab 结构: overview / specifications / suppliers / documents
- **无 Knowledge 相关 Tab 或 Section**
- 无 API 调用获取关联 Knowledge

### Knowledge Entry Detail Page (`apps/web/src/app/knowledge-base/[slug]/page.tsx`)

- structuredBody 渲染 + Content References + Knowledge Relations
- **无 Related Products Section**

### Search Page (`apps/web/src/app/search/SearchPageContent.tsx`)

- 5 实体 Tab（全部/产品/知识/解决方案/供应商）
- 各实体结果独立展示，**无跨实体关联**

---

# 4. Decision Area A — Product ↔ Knowledge Final Decision

## 4.1 方案评估

### Option A: ProductCategory ↔ KnowledgeCategory (Name-Based)

```
ProductCategory.name
    ↕ (模糊匹配 / 约定命名)
KnowledgeCategory.name
```

| 维度 | 评估 |
|-|-|
| 准确性 | **LOW** — 分类命名可能不一致，需人工维护约定 |
| 可维护性 | **LOW** — 分类重命名即断裂 |
| 多设备扩展 | **LOW** — 每新增设备类型需同步两边分类命名 |
| 分类重命名风险 | **HIGH** — 任一侧重命名均导致关联断裂 |
| 多语言风险 | **HIGH** — 中文命名约定不可靠 |
| 一对多/多对多 | **不支持** |
| SEO 影响 | **LOW** |
| 搜索影响 | **LOW** |
| 数据库复杂度 | **LOW** — 无新增表 |
| API 复杂度 | **LOW** |
| 未来扩展 | **LOW** |

### Option B: ProductCategory → Deterministic Knowledge Mapping (Mapping Table)

```
ProductCategory
    ↓
ProductCategoryKnowledgeMapping (新表)
    ↓
KnowledgeDomain / KnowledgeCategory
```

| 维度 | 评估 |
|-|-|
| 准确性 | **HIGH** — 显式映射，确定性关系 |
| 可维护性 | **HIGH** — Admin 可配置，不依赖命名约定 |
| 多设备扩展 | **HIGH** — 新增设备类型只需新增映射行 |
| 分类重命名风险 | **NONE** — 映射基于 ID，非名称 |
| 多语言风险 | **NONE** — 映射与语言无关 |
| 一对多/多对多 | **支持** — 一个 ProductCategory 可映射多个 KnowledgeCategory |
| SEO 影响 | **HIGH** — 结构化关联数据可用于 SEO |
| 搜索影响 | **HIGH** — 精确关联提升搜索发现 |
| 数据库复杂度 | **MEDIUM** — 1 个新表 + 1 个 Migration |
| API 复杂度 | **MEDIUM** — 1-2 个新 API endpoint |
| 未来扩展 | **HIGH** — 支持多领域、多分类映射 |

### Option C: Explicit ProductKnowledgeAssociation (Direct FK)

```prisma
model ProductKnowledgeAssociation {
  productId     String
  knowledgeId   String
  associationType String
}
```

| 维度 | 评估 |
|-|-|
| 准确性 | **HIGH** — 直接关联 |
| 可维护性 | **MEDIUM** — 需要为每个 Product 手动关联 Knowledge |
| 多设备扩展 | **LOW** — 产品级关联，扩展需逐产品配置 |
| 分类重命名风险 | **NONE** |
| 多语言风险 | **NONE** |
| 一对多/多对多 | **支持** |
| SEO 影响 | **HIGH** |
| 搜索影响 | **HIGH** |
| 数据库复杂度 | **HIGH** — 新表 + 大量维护成本 |
| API 复杂度 | **MEDIUM** |
| 未来扩展 | **MEDIUM** — 维护成本随产品数量增长 |

### 推荐方案分析

| 维度 | Option A | Option B | Option C |
|-|:-:|:-:|:-:|
| 准确性 | C | **A** | A |
| 可维护性 | D | **A** | C |
| 多设备扩展 | D | **A** | C |
| 分类重命名风险 | F | **A** | A |
| 多语言风险 | F | **A** | A |
| 数据库复杂度 | A | **B** | C |
| 整体推荐 | ❌ | **✅** | ❌ |

## 4.2 Final Decision

```
Product ↔ Knowledge Association:
[FINAL DECISION]

Option B — ProductCategory → Deterministic Knowledge Mapping

ProductCategory
    ↓
ProductCategoryKnowledgeMapping (mapping table)
    ↓
KnowledgeCategory / KnowledgeDomain
    ↓
KnowledgeEntry
```

### 映射表设计 (Future Implementation)

```prisma
model ProductCategoryKnowledgeMapping {
  id                  String            @id @default(uuid()) @db.Uuid
  productCategoryId   String            @map("product_category_id") @db.Uuid
  knowledgeDomainId   String            @map("knowledge_domain_id") @db.Uuid
  knowledgeCategoryId String?           @map("knowledge_category_id") @db.Uuid
  sortOrder           Int               @default(0) @map("sort_order")

  productCategory     ProductCategory   @relation(fields: [productCategoryId], references: [id])
  knowledgeDomain     KnowledgeDomain   @relation(fields: [knowledgeDomainId], references: [id])
  knowledgeCategory   KnowledgeCategory? @relation(fields: [knowledgeCategoryId], references: [id])

  @@unique([productCategoryId, knowledgeCategoryId])
  @@map("product_category_knowledge_mapping")
}
```

### 关联类型

```
Association Type:
Deterministic / Explicit Mapping

通过 ProductCategory 作为桥梁，建立确定性映射。
Product 不直接关联 KnowledgeEntry，而是通过 Category 间接关联。
```

### 实施归属

```
本任务（588）: 架构决策冻结 — NO CODE CHANGE
M24.1 实施: 创建 ProductCategoryKnowledgeMapping 表 + Migration + Admin 配置 + API + Frontend
```

## 4.3 Industrial Expansion Compatibility

未来产品从工业内窥镜扩展到其他设备类型时：

| 设备类型 | ProductCategory | KnowledgeDomain | 映射方式 |
|-|-|-|-|
| 工业内窥镜 | 工业内窥镜 | Inspection Technology | 新增映射行 |
| 超声探伤仪 | 超声探伤仪 | Inspection Technology | 新增映射行 |
| 磁粉探伤仪 | 磁粉探伤仪 | Inspection Technology | 新增映射行 |
| 射线检测设备 | 射线检测设备 | Inspection Technology | 新增映射行 |
| 涡流检测设备 | 涡流检测设备 | Inspection Technology | 新增映射行 |
| 三维扫描仪 | 三维扫描仪 | Inspection Technology | 新增映射行 |
| 三坐标测量机 | 三坐标测量机 | Inspection Technology | 新增映射行 |
| 工业显微镜 | 工业显微镜 | Inspection Technology | 新增映射行 |
| 检测机器人 | 检测机器人 | Inspection Technology | 新增映射行 |

**所有设备类型扩展均通过新增 ProductCategory → KnowledgeCategory 映射行完成，无需代码变更。**

## 4.4 Parameter Knowledge Boundary Confirmation

### 边界确认

| 内容 | 所属 | 状态 |
|-|-|:-:|
| 景深概念解释 | KnowledgeEntry (INSIGHT/ARTICLE) | ✅ 已支持 |
| 视场角概念解释 | KnowledgeEntry (INSIGHT/ARTICLE) | ✅ 已支持 |
| IP67 防护等级解释 | KnowledgeEntry (INSIGHT/ARTICLE) | ✅ 已支持 |
| 产品参数值（如 "管径=6mm"） | ProductParameterValue | ✅ 已支持 |
| Content(INSIGHT) 参数百科 | Content (INSIGHT type) | ✅ 已支持 |
| **Parameter Knowledge Runtime** | **不实现** | **FROZEN** |

```
参数值 (ProductParameterValue)
    ≠
参数专业知识解释 (KnowledgeEntry)

Content(INSIGHT)
    ≠
KnowledgeEntry

Content(INSIGHT) = 编辑器内容，非结构化知识
KnowledgeEntry = 结构化知识体，有 domain/category 分类体系
```

### 边界冻结

```
Parameter Knowledge Boundary:
FROZEN

本任务不实现 Parameter Knowledge Runtime。
M24 阶段不实现 Parameter Knowledge Runtime。
M24 仅实现 Product ↔ Knowledge 分类级关联展示。
```

---

# 5. Decision Area B — Search Context Current-State Audit

## 5.1 Search Architecture Audit

### Unified Search API (`search.service.ts`)

```typescript
async search(query: string, page: number = 1, pageSize: number = 10) {
  const [products, knowledge, content, solutions, suppliers] = await Promise.all([
    this.searchProducts(query, skip, pageSize),    // ✅ 返回 category
    this.searchKnowledgeEntries(query, skip, pageSize), // ✅ 返回 domain + category
    this.searchContent(query, [ARTICLE, INSIGHT], skip, pageSize),
    this.searchContent(query, [SOLUTION], skip, pageSize),
    this.searchSuppliers(query, skip, pageSize),
  ]);
  return { query, products, knowledge, content, solutions, suppliers };
}
```

**搜索结果中 Product 包含 category 信息 (id, name, slug)** ✅

### Product Search API (`products.service.ts`)

```typescript
async findAll(query: SearchProductDto) {
  // 支持 keyword, categoryId, status, parameterFilters, sortBy, sortOrder
  // parameterFilters: AND 逻辑，支持 exact match 和 numeric range
}
```

**产品搜索支持参数筛选，但筛选参数由调用方提供，非搜索上下文自动推导** ❌

### Parameter Model Chain

```
ProductCategory
    ↓ (Product.categoryId)
Product
    ↓ (ProductParameterDefinition.productId)
ProductParameterDefinition
    ↓ (ProductParameterDefinition.parameterDefinitionId)
ParameterDefinition
    ↓ (ParameterDefinition.parameterGroupId)
ParameterGroup
```

**参数定义链路完整，但无 "根据搜索结果获取相关参数" API** ❌

## 5.2 Frontend Search Filter Audit

### SearchFilter Component (`SearchFilter.tsx`)

当前仅支持 ContentType 筛选（ARTICLE/INSIGHT/SOLUTION），**不支持参数筛选**。

### ParameterFilterPanel Component (`ParameterFilterPanel.tsx`)

支持 NUMBER/ENUM/BOOLEAN/STRING 类型参数筛选，但**未集成到搜索页面**。

### SearchPageContent (`SearchPageContent.tsx`)

搜索页面仅展示搜索结果，**无参数筛选面板**。

## 5.3 Current Capability Summary

| 能力 | 状态 |
|-|:-:|
| 搜索返回产品分类信息 | ✅ 已有 |
| 产品搜索支持参数筛选 | ✅ 已有（调用方提供） |
| 搜索页面参数筛选 UI | ❌ 无 |
| 根据搜索结果获取相关参数 | ❌ 无 |
| Multi-Category 搜索处理 | ❌ 无 |
| Mobile 参数筛选 | ❌ 无 |

---

# 6. Decision Area B — Relevant Parameter Filter Final Decision

## 6.1 Context-Aware Filter Architecture

### 正式数据流

```
Search Query "内窥镜"
    ↓
Unified Search API (GET /search?q=内窥镜)
    ↓
Search Result Set (Products with categories)
    ↓
Category Context Resolution
    - Extract unique categoryIds from search results
    - e.g., ["cat-industrial-endoscope"]
    ↓
Relevant Product Set
    - All ACTIVE products in those categories
    ↓
Parameter Definition Aggregation
    - Get all ProductParameterDefinitions for relevant products
    - Join ParameterDefinition + ParameterGroup
    - Deduplicate by parameterDefinitionId
    ↓
Relevant Filter Definitions
    - Return unique ParameterDefinitions with:
      - id, name, code, dataType, unit
      - ParameterGroup name/code
      - Value distribution (min/max for NUMBER, distinct values for ENUM)
    ↓
Filter UI
    - Render only relevant filters
    - Ordered by: ParameterGroup.sortOrder → ParameterDefinition sort → Coverage
    ↓
Filtered Product Results
    - Apply selected filters via GET /search?q=内窥镜&parameterFilters=[...]
```

### API 设计 (Future Implementation)

```
GET /search/parameter-filters?q={keyword}&categoryIds={ids}

Response:
{
  "filters": [
    {
      "parameterDefinition": {
        "id": "uuid",
        "name": "管径",
        "code": "pipe_diameter",
        "dataType": "NUMBER",
        "unit": "mm",
        "group": { "name": "基本参数", "code": "basic" }
      },
      "valueRange": { "min": 2.8, "max": 8.0 },
      "resultCoverage": 0.85  // 85% of results have this parameter
    },
    // ...
  ]
}
```

## 6.2 Multi-Category Search Decision

### 场景分析

| 搜索词 | 可能命中分类 | 策略 |
|-|-|-|
| "内窥镜" | 工业内窥镜（单一分类） | Single Category Context |
| "内窥镜 探伤" | 工业内窥镜 + 超声探伤仪 | Multi Category Context |
| "检测设备" | 多分类 | Multi Category Context |

### 最终决策

```
Multi-Category Search Architecture:
[FINAL DECISION]

Progressive Filter Disclosure with Category Tabs

当搜索命中多个 ProductCategory 时：

1. 展示 Category Tabs（每个 Tab 为该分类相关的参数）
2. "全部" Tab 展示交集参数（所有分类共有的 ParameterDefinition）
3. 用户选择 Category Tab 后，展示该分类专属参数

Single Category: 直接展示该分类相关参数
Multi Category:  Category Tabs + 交集参数优先
```

**禁止: 全库 ParameterDefinition 全部展示。**

## 6.3 Mobile Filter Decision

```
Mobile Filter Architecture:
[FINAL DECISION]

Filter Drawer / Bottom Sheet

流程：
1. 搜索结果页底部显示 "筛选" 按钮（含激活筛选计数）
2. 点击 → Bottom Sheet / Drawer 打开
3. Drawer 内展示 Relevant Filter Definitions
4. 参数筛选交互与 Desktop 一致（NUMBER 范围 / ENUM 选择 / BOOLEAN 切换）
5. 应用筛选 → Drawer 关闭 → 搜索结果更新

Desktop: Left / Side Filter Panel
Mobile:  Filter Button → Bottom Sheet / Drawer

Same Search Context + Same Filter Semantics
不能因 Mobile 形成第二套筛选逻辑。
```

## 6.4 Filter Priority Decision

```
Filter Priority:
[FINAL DECISION]

1. ParameterGroup.sortOrder (asc) — 参数组排序
2. ParameterDefinition 在结果中的覆盖率 (desc) — 常用参数优先
3. Industry Importance — 行业关键参数置顶

示例（内窥镜搜索）：
  管径 (覆盖率 100%) → 置顶
  工作长度 (覆盖率 95%) → 置顶
  视场角 (覆盖率 90%)
  景深 (覆盖率 85%)
  防护等级 (覆盖率 80%)
  镜头视向 (覆盖率 70%)
  导向方式 (覆盖率 60%)
  光源类型 (覆盖率 50%)
  ...

禁止：把几十个参数一次性全部展示。
默认展示 Top 8-10 参数，其余通过 "更多筛选" 展开。
```

## 6.5 Final Decision Summary

```
Search Context Architecture:
[FINAL DECISION]

Search Query → Unified Search → Extract CategoryIds → Aggregate Relevant Parameters → Filter UI

Parameter Filter Architecture:
[FINAL DECISION]

Context-Aware: Only parameters used by products in search results
Category Tabs: Multi-category → Category Tabs + Intersection first
Filter Priority: Group.sortOrder → Coverage → Industry Importance
Top N Default: 8-10 parameters, rest via "More"

Mobile Filter Architecture:
[FINAL DECISION]

Filter Button → Bottom Sheet / Drawer with Relevant Filters
Same Semantics as Desktop → Same API → Same Filter State
```

---

# 7. Test Scenario Design

## Scenario 1: 单一分类搜索

```
搜索: "内窥镜"

预期:
  Product Category: 工业内窥镜
  Relevant Filters: 仅工业内窥镜相关参数
    - 管径
    - 工作长度
    - 视场角
    - 景深
    - 防护等级
    - 镜头视向
    - 导向方式
    - 光源类型

禁止出现:
  - 探伤仪频率
  - 探头类型
  - 检波方式
  - 三坐标测量范围
  - 三维扫描精度
```

## Scenario 2: 参数值搜索

```
搜索: "6mm 内窥镜"

预期:
  Search Query: "内窥镜"
  Parameter Filter: 管径 = 6mm

说明:
  "6mm" 属于 Filter Context（参数筛选值）
  不属于 Product Category 变更
  不属于 Search Query 主体
```

## Scenario 3: 不同设备类型搜索

```
搜索: "探伤仪"

预期:
  Relevant Filters:
    - 频率
    - 探头类型
    - 检测方式
    - 检波方式

禁止出现:
  - 内窥镜管径
  - 视场角
  - 景深
```

## Scenario 4: 三维扫描仪搜索

```
搜索: "三维扫描仪"

预期:
  Relevant Filters:
    - 扫描精度
    - 扫描范围
    - 扫描速度
```

## Scenario 5: 多分类搜索

```
搜索: "工业检测设备"

预期:
  Multi Category Context
  命中多个 ProductCategory
  
  架构决策:
  - Category Tabs 展示各分类
  - "全部" Tab 展示交集参数
  - 用户选择具体分类 Tab 后展示专属参数
```

## Scenario 6: Mobile 筛选

```
Mobile: 搜索 "内窥镜"

预期:
  Filter Button 显示在搜索结果上方
  点击 → Bottom Sheet 打开
  Sheet 内展示 Relevant Filters Only
  参数交互与 Desktop 一致
  Same Semantics as Desktop
```

## Scenario 7: 知识关联

```
Product: 工业内窥镜

Knowledge:
  - 景深 (KnowledgeEntry)
  - 视场角 (KnowledgeEntry)
  - 防护等级 (KnowledgeEntry)

验证:
  Product Detail 页展示 Related Knowledge Section
  Knowledge 通过 ProductCategory → KnowledgeCategory 映射获取

禁止:
  启动 Parameter Knowledge Runtime
  参数值自动生成知识解释
  AI 自动生成知识内容
```

---

# 8. M24 Roadmap Finalization

## 8.1 基于 587 + 588 的路线校准

### M24.1: Product Experience Foundation

| ID | 任务 | 类型 | 优先级 | 说明 |
|-|-|:-:|:-:|-|
| M24.1.1 | ProductCategoryKnowledgeMapping 表 + Migration | Backend + DB | **P0** | 新增映射表，ProductCategory ↔ KnowledgeCategory |
| M24.1.2 | ProductCategoryKnowledgeMapping Admin 配置 | Admin | **P0** | Admin 页面配置分类映射 |
| M24.1.3 | Product Detail — Related Knowledge Section | Frontend | **P0** | Product → Category → Knowledge 关联展示 |
| M24.1.4 | Product Detail — Related Products 推荐 | Frontend | **P0** | 同 Category 产品推荐 |
| M24.1.5 | Product Detail — Overview Tab CTA | Frontend | **P0** | 概览 Tab 快捷咨询入口 |
| M24.1.6 | Knowledge Detail — Related Products Section | Frontend | **P0** | Knowledge → Category → Product 关联展示 |
| M24.1.7 | Product Detail — Compare 快捷入口 | Frontend | **P1** | 添加产品到 Compare |

**M24.1 Entry Gate: OPEN** ✅

### M24.2: Discovery & Conversion Enhancement

| ID | 任务 | 类型 | 优先级 | 说明 |
|-|-|:-:|:-:|-|
| M24.2.1 | GET /search/parameter-filters API | Backend | **P0** | 搜索上下文相关参数筛选 API |
| M24.2.2 | Search Page — Relevant Parameter Filter UI | Frontend | **P0** | 搜索结果页参数筛选面板 |
| M24.2.3 | Mobile Filter Drawer | Frontend | **P0** | 移动端筛选 Bottom Sheet |
| M24.2.4 | Search Suggestions API | Backend | **P0** | 搜索建议 prefix match |
| M24.2.5 | Search Result Sorting | Frontend | **P1** | 客户端 Relevance/Newest/Name 排序 |
| M24.2.6 | Inquiry Template Pre-fill | Frontend | **P1** | 咨询表单产品参数预填 |
| M24.2.7 | Mobile Knowledge Reading Enhancement | Frontend | **P1** | Mobile 端 structuredBody 优化 |
| M24.2.8 | Mobile Product Detail Quick Actions | Frontend | **P1** | 底部固定 CTA 按钮 |

### M24.3: Advanced Experience (Future Candidate)

| ID | 任务 | 类型 | 优先级 | 说明 |
|-|-|:-:|:-:|-|
| M24.3.1 | Parameter Knowledge Runtime | Backend + Frontend | **P2 (DEFERRED)** | 参数专业知识自动展示 |
| M24.3.2 | Multi-Supplier Inquiry | Frontend | **P2** | 多供应商同时咨询 |
| M24.3.3 | Did You Mean Suggestions | Backend | **P2** | 搜索纠错 |
| M24.3.4 | Anonymous Inquiry History | Backend + Frontend | **P2** | 匿名咨询历史 |

**触发条件**: M24.2 完成 + 基础设施就绪

## 8.2 M24.1 Entry Gate

```
M24.1 Entry Gate: OPEN

Entry Conditions:
  ✅ Product ↔ Knowledge Association = FINALIZED (Option B - Mapping Table)
  ✅ Search Context = FINALIZED (Category Context → Relevant Parameters)
  ✅ Relevant Parameter Filter = FINALIZED (Context-Aware, Category Tabs, Priority)
  ✅ Mobile Filter Architecture = FINALIZED (Bottom Sheet, Same Semantics)
  ✅ Experience Boundaries = CONFIRMED (No Marketplace / No AI / No Store)
  ✅ Documentation Sync = COMPLETED (588 Report + Roadmap + Status)
```

---

# 9. Architecture Boundary Verification

## 9.1 核心边界锁定

| 边界 | 状态 | 验证 |
|-|:-:|-|
| Product = Platform Capability Asset | ✅ CONFIRMED | Product 无 organizationId/supplierId/storeId |
| Knowledge = Platform Knowledge Asset | ✅ CONFIRMED | Knowledge 不替代 Product，不成为 AI Runtime |
| Supplier = Capability Provider | ✅ CONFIRMED | 无 Supplier Store/Shop/Mall 模型 |
| Search = Unified Industrial Discovery | ✅ CONFIRMED | 搜索保持工业检测能力发现定位 |
| Matching = Deterministic Parameter Matching | ✅ CONFIRMED | weighted_v1 确定性评分，无 AI/Knowledge 参与 |
| AI = FROZEN | ✅ CONFIRMED | AI 接口只读，无运行时激活 |
| Marketplace = 永久禁止 | ✅ CONFIRMED | 无 Supplier Store/Shop/Ranking/Rating/Follow |

## 9.2 M24 体验边界

| 允许 | 禁止 |
|-|-|
| ProductCategoryKnowledgeMapping 表 | Product 模型修改 |
| Product ↔ Knowledge 分类级关联展示 | AI 推荐引擎 |
| Search Context 相关参数筛选 | 全库参数全部展示 |
| Mobile Filter Drawer | Mobile 独立筛选逻辑 |
| Category Tabs 多分类处理 | 参数专业知识自动生成 |
| 客户端排序 | 服务端 Ranking 修改 |
| Overview CTA 快捷入口 | Inquiry 流程修改 |

---

# 10. Impact Assessment

## 10.1 本任务变更

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

AI Change:
NONE

Migration:
NONE
```

## 10.2 M24 实施预估影响

| 阶段 | Database | API | Web | Admin | SEO | Analytics |
|-|:-:|:-:|:-:|:-:|:-:|:-:|
| M24.1 | 1 新表 + 1 Migration | 2-3 新 endpoints | 4-6 files | 1-2 pages | + (Product↔Knowledge) | + (关联点击) |
| M24.2 | NONE | 1-2 新 endpoints | 6-8 files | NONE | + (Search Filter) | + (筛选事件) |
| M24.3 | TBD | TBD | TBD | TBD | TBD | TBD |

---

# 11. ADR Summary

| ADR | 主题 | 决策 | 实施阶段 |
|-|-|-|:-:|
| ADR-M24-001 | Product ↔ Knowledge Association | Option B — Mapping Table (ProductCategory → KnowledgeCategory) | M24.1 |
| ADR-M24-002 | Search Context Resolution | Category Context → Relevant Parameter Aggregation | M24.2 |
| ADR-M24-003 | Relevant Parameter Filter | Context-Aware + Category Tabs + Priority (Coverage) | M24.2 |
| ADR-M24-004 | Multi-Category Search | Progressive Filter Disclosure + Category Tabs | M24.2 |
| ADR-M24-005 | Mobile Filter Architecture | Filter Button → Bottom Sheet, Same Semantics as Desktop | M24.2 |
| ADR-M24-006 | Parameter Knowledge Boundary | FROZEN — M24 不实现 Parameter Knowledge Runtime | M24.3 DEFERRED |
| ADR-M24-007 | M24 Roadmap | M24.1 Foundation / M24.2 Discovery / M24.3 Advanced | M24 |

---

# 12. Final Execution Output

```
Task:
588_M24_Product_Knowledge_Search_Context_Architecture_Finalization

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

Product ↔ Knowledge Decision:
FINALIZED — Option B: ProductCategory → KnowledgeCategory Mapping Table

Search Context Decision:
FINALIZED — Search Query → Category Context → Relevant Parameter Aggregation

Relevant Parameter Filter Decision:
FINALIZED — Context-Aware + Category Tabs + Coverage Priority + Top N Default

Mobile Filter Decision:
FINALIZED — Bottom Sheet / Drawer, Same Semantics as Desktop

Parameter Knowledge Boundary:
FROZEN / DEFERRED to M24.3

M24 Roadmap:
SYNCHRONIZED — M24.1 (P0: 6 tasks) / M24.2 (P0: 4 tasks, P1: 4 tasks) / M24.3 (P2: 4 tasks DEFERRED)

M24.1 Entry Gate:
OPEN

Review Report:
docs/_review/588_M24_Product_Knowledge_Search_Context_Architecture_Finalization_Report.md

Next Task:
M24.1.1 ProductCategoryKnowledgeMapping Implementation
```

---

# 13. 文档同步

| 文件 | 操作 | 状态 |
|-|-|:-:|
| `docs/_review/588_M24_Product_Knowledge_Search_Context_Architecture_Finalization_Report.md` | 新增 | ✅ |
| `docs/project-management/PROJECT_ROADMAP.md` | 更新（纳入 588 + M24 路线） | ✅ 已完成 |
| `docs/project-management/PROJECT_STATUS.md` | 更新（纳入 588） | ✅ 已完成 |
| `docs/project-management/MODULE_COMPLETION_MATRIX.md` | 更新（M24 Planning 状态） | ✅ 已完成 |
| `docs/project-management/BUSINESS_CAPABILITY_MAP.md` | 不适用（无 M24 相关内容） | ⏭️ 跳过 |

---

**架构收敛完成。三个架构决策点全部 FINALIZED。M24 路线图同步完成。M24.1 Entry Gate OPEN。零代码变更。**