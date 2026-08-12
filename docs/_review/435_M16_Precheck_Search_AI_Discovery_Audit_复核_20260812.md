# 448_M16_Precheck_Search_AI_Discovery_Audit_复核_20260812

## 0. 报告说明

- **任务编号**：M16_Precheck_Search_AI_Discovery_Audit_001
- **任务名称**：Global Search / Product Filtering / AI Discovery Capability Audit
- **执行模式**：ONLY READ ANALYSIS + REPORT GENERATION（未修改任何代码）
- **复核编号说明**：任务指令指定 `426`，但该编号已被 `426_M15.1_WorkflowEvent_Domain_Audit_Report.md` 占用，经确认改用 `448`，报告名加「复核」与日期。
- **审计基准**：全部结论基于真实代码/Schema/API/页面/Admin 功能，禁止基于规划文档猜测。

## 1. 前置校验

| 项目 | 结果 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT` ✅ |
| Code Root | `F:\Desktop\VISNDT\VISNDT` ✅ |
| Branch | `main` ✅ |
| Workspace | 非 clean（78 行变更，含 M18.2/446 相关，未提交，本次审计未触碰） |
| 代码改动 | 无 |

## 2. 产品数据搜索基础

模型均结构化、字段可查询（[schema.prisma](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma)）：

| 维度 | 字段 | 可查询性 |
| --- | --- | --- |
| 产品名称 | `Product.name`（含索引） | ✅ |
| 分类 | `Product.categoryId → ProductCategory`（树形 parent/children） | ✅ |
| 型号 | `Product.model`（含索引） | ✅ |
| 品牌/描述 | `Product.description` | ✅（关键词搜索含 description） |
| 状态 | `Product.status`（含索引） | ✅ |
| 参数 | `ProductParameterValue`（`value`/`valueNumber`，`@@unique([productId, parameterDefinitionId])`，含 `[parameterDefinitionId, value]`、`[parameterDefinitionId, valueNumber]` 索引） | ✅ |
| 参数定义 | `ParameterDefinition`（`name/code/unit/dataType`）+ `ParameterGroup` | ✅ |
| 媒体 | `ProductMedia`（关联 FileAsset） | ✅ |

**Product Search Data Readiness：High**（名称/分类/型号/参数/媒体/描述全部结构化可查询）。

## 3. 现有搜索能力现状

### Web 端（[products/page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/page.tsx)）
- 产品搜索框 ✅（`SearchBar`，关键词）
- 分类过滤 ✅（`ProductFilter` 分类侧栏）
- 排序 ✅（最新/最早/名称/最近更新）
- 分页 ✅（`Pagination`）
- 参数过滤 UI ❌（**无**，虽 API 支持，Web 未暴露）

### API 端（[search-product.dto.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/dto/search-product.dto.ts) + [products.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.service.ts#L14-L115)）
- `GET /products`（公开）产品查询 ✅：`keyword` / `categoryId` / `status` / `parameterFilters` / `sortBy` / `sortOrder` / `page` / `pageSize`
- Search/Query/Filter API ✅ 已具备

### Admin 端（[ProductList.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/ProductList.tsx)）
- 产品查询 ✅（keyword）
- 条件筛选 ✅（status / 排序 / 分页）
- 参数筛选 UI ❌（无）—— 参数配置在独立 `parameter/` 页面，产品列表未按参数筛选

## 4. 产品筛选能力矩阵

| 能力 | 状态 | 证据 |
| --- | --- | --- |
| 分类筛选 | ✅ | API `categoryId` + Web ProductFilter |
| 关键词搜索 | ✅ | API `keyword`（name/model/description OR）+ Web SearchBar |
| 参数筛选 | ⚠️ API 支持 / Web 无 UI | `parameterFilters`（精确 `value` 或数值范围 `valueMin/valueMax`） |
| 多条件组合 | ✅ | API `parameterFilters` AND 逻辑（[products.service.ts L42-L92](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.service.ts#L42-L92)） |
| 范围查询 | ✅ | API `valueMin/valueMax` 数值范围（`valueNumber` gte/lte） |
| 排序 | ✅ | API `sortBy`（createdAt/updatedAt/name 白名单）+ Web |
| 分页 | ✅ | API `page/pageSize` + Web |

**工业参数筛选（管径/像素/镜头方向/视场角/景深/光源/管线长度/探头类型）**：底层机制已具备——任意 `ParameterDefinition`（含 `code/unit/dataType`）内的数值/精确匹配均可通过 `parameterFilters` 表达；**但 Web 端缺少参数筛选 UI，无法由访问者直接勾选**。

## 5. Matching 系统关系审计

机制（[matching.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/matching/matching.service.ts)）：
- **候选**：`Product.status=ACTIVE` 且存在 `Offer.status=ACTIVE`；若 Demand 有 categoryId 则限制同分类（`categoryHelper`）。
- **评分**：`ScoringService weighted_v1`，逐参数对比 Demand 参数（`value/valueMin/valueMax/required/priority`）与产品参数（`ProductParameterValue`），加权求和，低于 `minMatchScore` 过滤。
- **匹配依据**：产品参数 + Demand 参数 + 分类 + 权重。

**Product Search 与 Demand Matching 是否共享参数体系：是。** 两者都挂载 `ParameterDefinition`：`ProductParameterValue.parameterDefinitionId` 与 `DemandParameter.parameterDefinitionId` 均引用同一 `ParameterDefinition`（[schema.prisma L376-397](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L376-L397)）。这意味着产品搜索的参数过滤与需求匹配的评分基于同一套参数语义。

## 6. AI Search 能力评估

**已有基础**：
- 结构化参数体系（`ParameterDefinition/ParameterGroup/ProductParameterValue/DemandParameter`）
- 分类树（`ProductCategory` 父子层级）
- 加权匹配引擎（`weighted_v1`）
- 内容/知识体系（`Content` 模型，M17/M18 已实现，含 Knowledge/Article/Solution/Insight 类型 + SEO 字段）

**缺失**：
- 向量库（pgvector）❌
- Embedding 能力 ❌
- Knowledge 语义模型（结构化知识图谱/文档向量）❌
- 文档模型（可检索工业检测文档语料）❌
- 参数语义层（自然语言 → 参数条件映射）❌

**特征→条件转换**（如"检测直径50mm发动机内部裂纹，需要3米管线"→ 参数条件）：当前无自然语言解析层，但参数体系已结构化，后续可映射到 `parameterFilters`。

## 7. Content / Knowledge 集成审计

- **Content 模型已存在**：`Content`（type/title/slug/summary/content/status/seoTitle/seoDescription/seoKeywords/authorId/coverImageId），含 `ContentType`（KNOWLEDGE/SOLUTION/ARTICLE/INSIGHT）与 `ContentStatus`（[schema.prisma](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma)）。
- **内容体系已落地**：后端 `content` 模块 + Admin 内容管理（M17.3）+ Web 知识中心/解决方案（M17.4）+ Markdown 渲染（M18.1）+ 媒体管理（M18.2，本项目 446 已实现）。
- **未来 AI Search 联合检索**：可联合产品数据（`Product`/参数）+ 知识库（`Content` KNOWLEDGE/ARTICLE）+ 参数说明 + 行业文章。当前数据同库（PostgreSQL），无跨域检索层。

## 8. 架构建议（阶段划分，不扩大当前开发范围）

| 阶段 | 范围 | 说明 |
| --- | --- | --- |
| **M16** 基础搜索 | 已具备 | keyword + 分类 + 排序 + 分页（API/Web 已实现） |
| **M17** 高级筛选 | 待补 UI | Web 端暴露 `parameterFilters` 参数筛选 UI（API 已就绪，仅前端缺失） |
| **M18+** AI Search | 需新基建 | pgvector + Embedding + 参数语义层 + 知识库向量化 + 联合检索 |

`M17`（参数筛选 UI）成本最低、收益直接，因 API 已支持、仅缺前端暴露；`M18+` AI Search 需新增向量库/Embedding/语义层，属独立能力建设。

## 9. 输出结论

**最终状态：PASS WITH RISKS**

基础搜索（keyword/分类/排序/分页）、参数筛选 API（多条件组合 + 数值范围）、Matching（参数+分类+权重，与产品搜索共享参数体系）均已实现且 Search Data Readiness = High。主要缺口：**Web 端参数筛选 UI 缺失**、**AI Search 基础设施（向量库/Embedding/语义层）未建立**。

| 结论项 | 状态 |
| --- | --- |
| 当前搜索能力现状 | keyword + 分类 + 排序 + 分页（API+Web 完整） |
| 产品筛选能力现状 | 分类/关键词/多条件/范围/排序/分页 ✅；参数筛选缺 Web UI |
| 参数体系可搜索性 | High（结构化，Product 与 Demand 共享 ParameterDefinition） |
| Matching 关联分析 | 参数+分类+权重，与产品搜索共享参数体系 |
| AI Search 准备度 | 结构化参数已就绪；向量库/Embedding/语义层缺失 |
| 内容知识体系关联 | Content 体系已落地，可支撑未来联合检索 |
| 后续路线建议 | M16 基础（已具备）→ M17 补参数筛选 UI → M18+ AI Search |

## 10. 执行原则符合性

1. 只读分析，未修改任何代码 ✅
2. 基于真实代码/Schema/API/页面/Admin 功能提供证据 ✅
3. 未依据规划文档猜测当前能力 ✅
4. 报告编号冲突经确认改用 448 ✅