# 583 — Capability Discovery & Supplier Exposure Governance Architecture Audit Report

## 文档类型

Architecture Feasibility Audit / Design Validation（基于本地 Repository 实际代码）

## 审计日期

2026-08-17

## 审计范围

基于 VISNDT M22.4 完成状态及 580/581/582 架构决策，对以下治理边界进行全量验证：

- Search Discovery 架构扩展性
- Product Capability Model 治理
- Offer 展示逻辑治理
- Supplier Exposure 边界控制
- Contact Routing 预留
- Parameter Filter 可行性
- Future Data Model 兼容性

---

# 1. Repository 状态验证

## 1.1 基础信息

| 项目 | 状态 |
|-|-|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Current Branch | `main` |
| Latest Commit | `c54ef89 M23（终止）` |
| Current M Stage | M23.0（CLOSED）→ M23.1 |
| Build Status | 三端 build 全部 exit 0（M23.0 最终验证） |

## 1.2 前置架构报告验证

| 报告 | 状态 |
|-|-|
| 580_M22.4_Search_Discovery_Architecture_Finalization_V2 | EXISTS, FROZEN |
| 581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit | EXISTS, PASS |
| 582_Supplier_Capability_Service_Contact_Distribution_Architecture | EXISTS, FROZEN |

---

# 2. Product Model 治理审计

## 2.1 Schema 验证

**Product** (`database/prisma/schema.prisma` 行 334-364)：

```
Product
├── id, categoryId, name, model, description, status
├── createdById (FK → User)
├── slug, seoTitle, embedding
├── category → ProductCategory
├── parameterAssociations → ProductParameterDefinition[]
├── parameterValues → ProductParameterValue[]
├── offers → Offer[]
├── demandMatches → DemandMatch[]
└── inquiries → Inquiry[]
```

## 2.2 治理判定

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Product.organizationId | 禁止 | 不存在 | ✅ PASS |
| Product.supplierId | 禁止 | 不存在 | ✅ PASS |
| Product.storeId | 禁止 | 不存在 | ✅ PASS |
| Product 是否作为平台能力资产 | 是 | 是（通过 categoryId 关联分类体系，非供应商） | ✅ PASS |

**判定: Product = Platform Capability Asset — COMPLIANT**

## 2.3 关键证据

- Product 通过 `categoryId` 关联 `ProductCategory`（行 336），非任何供应商维度
- Product 通过 `offers` 反向关联 Offer（行 353），这是间接的能力关联，而非直接所有权
- 无 `organizationId`、`supplierId`、`storeId` 等供应商维度字段

---

# 3. Offer Model 治理审计

## 3.1 Schema 验证

**Offer** (`database/prisma/schema.prisma` 行 481-505)：

```
Offer
├── id, organizationId (FK → Organization), productId (FK → Product)
├── createdBy (FK → User), title, description
├── price, currency, status
├── @@unique([organizationId, productId])
└── organization → Organization, product → Product
```

## 3.2 治理判定

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Offer 作为供应商能力关联 | 是 | 是（organizationId + productId + @@unique） | ✅ PASS |
| Offer 是否作为产品列表入口 | 禁止 | 不存在（Offer 仅在 Product Detail 下展示） | ✅ PASS |
| Offer 是否独立展示 | 禁止 | 不存在（无 /offers 独立路由） | ✅ PASS |
| @@unique([organizationId, productId]) | 存在 | 存在（行 501） | ✅ PASS |

**判定: Offer = Supplier Capability Association — COMPLIANT**

## 3.3 关键证据

- `@@unique([organizationId, productId])` 确保同一供应商对同一产品只有一个 Offer
- Offer 通过 `organization` 和 `product` 关系实现双向关联，不高于也不低于 Product
- 无 Offer 独立路由或独立展示页面

---

# 4. Organization Model 治理审计

## 4.1 Schema 验证

**Organization** (`database/prisma/schema.prisma` 行 251-271)：

```
Organization
├── id, name, type, status
├── members → OrganizationMember[]
├── users → User[]
├── offers → Offer[]
├── demands → Demand[]
├── targetedRfqs → RFQ[]
├── rfqResponses → RFQResponse[]
├── invitations → UserInvitation[]
└── inquiries → Inquiry[]
```

## 4.2 治理判定

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Organization 作为能力提供者 | 是 | 是（通过 offers 关联能力） | ✅ PASS |
| Supplier Store 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Shop 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Ranking 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Follow 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Rating 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Page 作为独立商城入口 | 禁止 | 不存在（/suppliers/[id] 仅展示 Profile + Offer 列表） | ✅ PASS |

**判定: Organization = Capability Provider — COMPLIANT**

## 4.3 关键证据

- Organization 的 `type` 字段值为 `SUPPLIER` 等枚举值，但字段本身是通用类型字段，非供应商专属
- `/suppliers/[id]` 页面（`apps/web/src/app/suppliers/[id]/page.tsx`）展示的是 `SupplierPublicProfile`（组织基本信息） + `SupplierOfferList`（该供应商的能力列表），而非供应商店铺
- 无 Supplier Store、Supplier Shop、Supplier Mall、Supplier Ranking 等词汇出现在任何路由/组件中

---

# 5. Search Discovery 架构扩展性审计

## 5.1 当前架构

**SearchService** (`apps/api/src/search/search.service.ts` 行 1-286)：

```
UnifiedSearchService.search(query)
├── searchProducts()      → ProductDiscoveryItem (name, model, description + category)
├── searchKnowledgeEntries() → KnowledgeDiscoveryItem (title, summary + domain/category)
├── searchContent()       → ContentDiscoveryItem (ARTICLE, INSIGHT, SOLUTION)
├── searchSolutions()     → ContentDiscoveryItem (SOLUTION)
└── searchSuppliers()     → SupplierDiscoveryItem (organizationId, organizationName, offerCount, offerTitles, productNames)
```

**SearchController** (`apps/api/src/search/search.controller.ts` 行 1-112)：

```
GET /search?q={keyword}&page={page}&pageSize={pageSize}
```

**SearchPageContent** (`apps/web/src/app/search/SearchPageContent.tsx`)：

- 5 实体 Tab（Product / Knowledge / Content / Solution / Supplier）
- 当前无 ParameterFilterPanel 集成

## 5.2 扩展性评估

### 5.2.1 Keyword → Category Resolver 扩展

| 扩展点 | 可行性 | 说明 |
|-|-|-|
| 在 SearchService 中增加 category 解析 | ✅ 可行 | 当前 searchProducts() 已经返回 `category: { id, name, slug }`，可直接扩展为 category 过滤 |
| 搜索时自动解析 category | ✅ 可行 | 可通过 keyword 匹配 category name 或 ProductCategory.name 反向查找 |

### 5.2.2 Parameter Filter Context 扩展

| 扩展点 | 可行性 | 说明 |
|-|-|-|
| 在 UnifiedSearchDto 中增加 parameterFilters | ✅ 可行 | 当前 DTO 仅含 q/page/pageSize，可扩展 parameterFilters 字段 |
| 搜索时按 category 加载对应 ParameterGroup | ⚠️ 需要设计 | 当前 ParameterGroup 与 ProductCategory 无直接关联（通过 ParameterDefinition → ProductParameterDefinition → Product 间接关联），需通过 Product → Category 路径反向推导 |
| 动态加载对应参数组（非全库参数） | ⚠️ 需要设计 | 当前 `getFilterParameterDefinitions()` 加载全部参数定义，未按 category 筛选 |

**当前参数链路**：

```
ParameterGroup → ParameterDefinition → ProductParameterDefinition → Product → ProductCategory
```

**缺失环节**：ParameterGroup 与 ProductCategory 之间无直接关联，需要走 Product 中间表反向推导。

**不影响当前功能**：产品列表页（`GET /products?categoryId=xxx&parameterFilters=...`）已通过 categoryId 隔离参数上下文，但搜索页暂未集成参数筛选。

### 5.2.3 Capability Result 扩展

| 扩展点 | 可行性 | 说明 |
|-|-|-|
| 搜索结果中展示供应商能力入口 | ✅ 可行 | 当前 SupplierDiscoveryItem 已包含 organizationName + offerCount + productNames |
| 搜索结果中提供 Contact 入口 | ✅ 可行 | 需在 UnifiedDiscoveryResponse 中扩展 SupplierDiscoveryItem 增加 contact 信息 |
| 搜索结果中展示多供应商对比 | ✅ 可行 | 当前 5 实体并行搜索，suppliers 结果已聚合 organizationId |

## 5.3 搜索扩展性总体判定

**判定: Search Service 架构兼容扩展 — PASS**

```
Keyword → Category Resolver → Parameter Filter Context → Capability Result
```

三个环节均可在当前架构上扩展，无需修改核心搜索逻辑。唯一需要设计的是 ParameterGroup ←→ ProductCategory 的直接关联（当前走间接路径）。

---

# 6. 参数筛选可行性审计

## 6.1 当前架构

**ParameterGroup** (`database/prisma/schema.prisma` 行 387-400)：

```
ParameterGroup
├── id, name, code, description
└── definitions → ParameterDefinition[]
```

**ParameterDefinition** (行 402-414)：

```
ParameterDefinition
├── id, parameterGroupId (FK → ParameterGroup), name, code, dataType, unit
└── group → ParameterGroup
```

**ProductParameterDefinition** (行 461-474)：

```
ProductParameterDefinition (M2M)
├── productId, parameterDefinitionId, displayOrder
└── @@unique([productId, parameterDefinitionId])
```

**ProductParameterValue** (行 441-458)：

```
ProductParameterValue
├── productId, parameterDefinitionId, value, valueNumber
└── @@unique([productId, parameterDefinitionId])
```

## 6.2 参数筛选数据流

**产品列表页**（已实现）：

```
GET /products?categoryId=工业内窥镜&parameterFilters=[{parameterDefinitionId: xxx, valueMin: 6, valueMax: 8}]
```

1. `categoryId` 过滤产品范围
2. `parameterFilters` 在已过滤产品中按参数值进一步筛选
3. 前端 `ParameterFilterPanel` 加载全部参数定义（`getFilterParameterDefinitions()`），但实际只展示已关联到当前 category 产品的参数

**搜索页**（未实现参数筛选）：

```
GET /search?q=内窥镜
```

- 当前为纯关键词搜索，无参数筛选能力
- 搜索结果中 Product DiscoveryItem 不含参数信息

## 6.3 可行性判定

| 需求 | 当前状态 | 可行性 |
|-|-|-|
| 搜索"内窥镜"后动态加载"工业内窥镜参数"组 | 未实现 | ✅ 可行 |
| 非全库参数（探伤/三坐标/扫描） | 当前产品列表页已隔离 | ✅ 已支持 |
| ParameterGroup 与 ProductCategory 直接关联 | 不存在 | ⚠️ 需设计 |
| 搜索页集成参数筛选 | 未实现 | ✅ 可行 |

**判定: 参数筛选架构兼容 — CONDITIONAL PASS**

**设计建议**（非本次实施）：

```
方案 A（推荐）：利用现有间接链路
  Search → Product → ProductCategory → ProductParameterDefinition → ParameterDefinition → ParameterGroup
  通过 categoryId 聚合去重，得出该 category 下所有关联的 ParameterGroup

方案 B（可选）：在搜索 DTO 中增加 categoryId
  GET /search?q=内窥镜&categoryId=xxx
  → 搜索 Product 时自动过滤 categoryId + 返回关联的 ParameterGroup 列表
```

---

# 7. 供应商展示边界审计

## 7.1 当前展示路径

### 允许路径

| 路径 | 页面/组件 | 说明 |
|-|-|-|
| Product Detail → Supplier Offer | SupplierCapabilityList + SupplierInquirySection | 产品详情页内展示供应商能力列表，用户需主动选择供应商 |
| Supplier Offer → Inquiry | InquiryForm | 选择供应商后发起咨询（offerId + organizationId） |
| Supplier Profile | /suppliers/[id] | 供应商公开资料页（Profile + Offer 列表） |
| Workspace Supplier | /workspace/supplier/* | 供应商自己的工作区（Dashboard/Offers/Opportunities/RFQs/Profile/Display） |

### 禁止路径验证

| 路径 | 是否存在 | 判定 |
|-|-|-|
| Supplier List（供应商列表页） | 不存在 | ✅ PASS |
| Supplier Ranking（供应商排名） | 不存在 | ✅ PASS |
| Supplier Store（供应商店铺） | 不存在 | ✅ PASS |
| Supplier Page（供应商独立主页作为商城入口） | 不存在 | ✅ PASS |
| Supplier Marketplace（供应商商城） | 不存在 | ✅ PASS |
| Supplier Follow（供应商关注） | 不存在 | ✅ PASS |
| Supplier Rating（供应商评分） | 不存在 | ✅ PASS |

## 7.2 前端组件审计

**SupplierCapabilityList** (`apps/web/src/components/products/SupplierCapabilityList.tsx`)：

- 展示关联到当前产品的 Offer 列表
- 每个 Offer 卡片显示：organization name + type + offer title + status + 供应商主页链接
- 用户需主动点击选择供应商，无自动选中
- 无供应商对比、无供应商排序、无供应商推荐

**SupplierInquirySection** (`apps/web/src/components/inquiry/SupplierInquirySection.tsx`)：

- 管理 Offer 选择和 Inquiry 流程
- 流程：SupplierCapabilityList（选择Offer）→ Selected Supplier Banner（确认）→ InquiryForm（提交咨询）
- 传递 offerId + organizationId + organizationName 到 InquiryForm
- 无 Contact Routing（当前为单点联系）

**SupplierPublicProfile** (`/suppliers/[id]`)：

- 展示组织基本信息（名称、类型、状态）
- 展示该供应商的 Offer 列表
- 面包屑：首页 → 产品列表 → 供应商名称
- 非独立商城入口，只是供应商能力展示页

## 7.3 判定

**判定: 供应商展示边界 — COMPLIANT**

当前代码严格遵循：

```
Product Detail → Supplier Offer → Contact Routing（当前为 InquiryForm）
```

无任何 Supplier List / Ranking / Store / Page / Marketplace 路径。

---

# 8. 测试数据设计验证

## 8.1 582 测试场景回顾

| 场景 | 描述 | 覆盖目标 |
|-|-|-|
| 场景 1 | 单供应商单联系人 | 基础能力验证 |
| 场景 2 | 单供应商多联系人（同公司同部门） | 多联系人公平分配 |
| 场景 3 | 多供应商相同能力 | 多 Offer 展示 |
| 场景 4 | 区域路由 | 华南/华东匹配 |
| 场景 5 | 行业路由 | 航空/汽车匹配 |
| 场景 6 | 轮询分配 | 无明确区域/行业时 |
| 场景 7 | 能力主题匹配 | 技术方向匹配 |

## 8.2 治理审计验证

| 验证项 | 场景覆盖 | 判定 |
|-|-|-|
| 同一能力入口不重复 | 场景 3（多供应商相同能力） | ✅ |
| 不含供应商店铺 | 全部场景（无 Store/Shop/Mall） | ✅ |
| 不含供应商排名 | 全部场景（无 Ranking） | ✅ |
| 同公司多业务员公平分配 | 场景 2 | ✅ |
| 轮询验证 5:5 | 场景 6 | ✅ |

**判定: 测试数据设计覆盖治理边界 — PASS**

---

# 9. 综合架构治理判定

## 9.1 四大架构锁

| 架构锁 | 定义 | 当前状态 | 判定 |
|-|-|-|-|
| Product-Centric Strategy | Product = Platform Capability Asset | 无 organizationId/supplierId | ✅ PASS |
| Supplier Experience Boundary | Supplier = Capability Provider | 无 Store/Shop/Mall/Ranking | ✅ PASS |
| No Marketplace Drift | 不建设供应商聚合商城 | 无 Supplier List/Page/Marketplace | ✅ PASS |
| AI Foundation FROZEN | AI 不参与搜索/匹配 | 确认 | ✅ PASS |

## 9.2 六大治理边界

| 边界 | 当前状态 | 扩展兼容性 | 判定 |
|-|-|-|-|
| 1. Search Discovery | UnifiedSearchService，5 适配器 | ✅ 可扩展 Keyword → Category → Parameter → Capability | PASS |
| 2. Product Capability Model | Product 无供应商字段 | ✅ 无需修改 | PASS |
| 3. Offer 展示逻辑 | Product Detail 下 SupplierCapabilityList | ✅ 无独立展示 | PASS |
| 4. Supplier Exposure | /suppliers/[id] 仅 Profile + Offers | ✅ 无越界 | PASS |
| 5. Contact Routing | 当前为 InquiryForm（单点），582 已设计多 Contact 路由 | ✅ 预留 | PASS |
| 6. Parameter Filter | 产品列表页已实现 category 隔离，搜索页未集成 | ⚠️ 搜索页需扩展 | CONDITIONAL PASS |

## 9.3 发现的问题

| ID | 问题 | 严重度 | 建议 |
|-|-|-|-|
| GAP-01 | ParameterGroup 与 ProductCategory 无直接关联 | P2 | 未来实施 ParameterGroup-Category 映射表，或利用现有间接链路推导 |
| GAP-02 | 搜索页未集成 ParameterFilterPanel | P2 | M23 后续阶段扩展搜索 DTO 支持 parameterFilters |
| GAP-03 | 搜索 API 的 Product DiscoveryItem 不含 parameter 信息 | P2 | 未来扩展返回关联的 ParameterGroup 列表 |
| GAP-04 | SupplierDiscoveryItem 不含 contact 信息 | P2 | 582 已设计 SupplierCapabilityContact，未来实施后扩展 |

---

# 10. 最终结论

## 10.1 总体判定

```
583_Capability_Discovery_Supplier_Exposure_Governance_Architecture

STATUS: PASS

Architecture Compatible: YES
No Immediate Development Required: YES
Building Supplier Marketplace: NO
Drifting from Product-Centric: NO
```

## 10.2 详细判定

| 维度 | 判定 |
|-|-|
| Product = Platform Capability | ✅ PASS |
| Offer = Supplier Capability Association | ✅ PASS |
| Organization = Capability Provider | ✅ PASS |
| Search Discovery 扩展性 | ✅ PASS |
| 参数筛选可行性 | ✅ CONDITIONAL PASS（搜索页未集成，非阻塞） |
| 供应商展示边界 | ✅ PASS |
| 测试数据设计 | ✅ PASS |
| 无 Supplier Store/Shop/Mall/Ranking | ✅ PASS |
| 无代码变更需要 | ✅ PASS |

## 10.3 零变更确认

| 维度 | 变更 |
|-|-|
| Prisma Schema | NONE |
| Migration | NONE |
| API | NONE |
| Frontend | NONE |
| Search | NONE |
| Matching | NONE |
| AI | NONE |

## 10.4 路线确认

```
580 Search Discovery Finalization    ✅ COMPLETED
        ↓
581 Product / Supplier Capability Audit  ✅ COMPLETED
        ↓
582 Contact Distribution Architecture    ✅ COMPLETED
        ↓
583 Capability Discovery & Exposure Governance  ← 当前 PASS
        ↓
未来条件满足
        ↓
实施阶段:
  SupplierCapabilityContact
  Routing Engine
  Dynamic Filter
  Exposure Control
```

---

# 11. 文档同步

| 文件 | 操作 |
|-|-|
| `docs/_review/583_Capability_Discovery_Supplier_Exposure_Governance_Architecture_Audit_Report.md` | 新增 |
| `docs/project-management/PROJECT_ROADMAP.md` | 待更新（纳入 583） |
| `docs/project-management/PROJECT_STATUS.md` | 待更新（纳入 583） |

---

**审计完成。架构兼容，治理边界清晰，无需立即开发。**