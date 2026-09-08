# Capability / Product / SupplierProduct Semantic Closure Audit

- **Status**: AUTHORIZED / READ-ONLY AUDIT — **AUDIT COMPLETE**
- **Task Type**: Architecture Verification + Business Semantic Audit + Data Model Audit + Admin IA Audit
- **原则**: READ-ONLY。零代码/零Schema/零API/零UI 修改。
- **执行日期**: 2026-09-07
- **仓库根**: `F:\Desktop\VISNDT`
- **代码根**: `F:\Desktop\VISNDT\VISNDT`
- **Branch/HEAD**: `main`
- **证据基线**: `database/prisma/schema.prisma`、API Search/Match 源码、Admin Sidebar、Web 页面、PostgreSQL 容器 `visndt-postgres` 实时数据。

---

## 1. Executive Decision

核查 **10 个核心问题** 的最终结论：

| # | 问题 | 结论 |
| --- | --- | --- |
| 1 | Capability 现在到底是什么？ | **UI / 展示 / 检索语义标签**，其真实数据落地对象是 **Platform Product**（代码显式注释 `Product = Capability Authority`，见 Search service）。**无独立 Capability 实体**。 |
| 2 | Capability 是否应成为独立实体？ | **否**（非阻断）。当前 Product 已承担 "WHAT / Capability Authority" 角色且全链路一致；新增 Capability 实体将引入冗余 authority 与重构风险。列为 Future Candidate，不强制。 |
| 3 | Product 现在到底是什么？ | **Platform Product（WHAT / 能力 Authority）**。在 Search/Match 中被当作 "Capability" 的唯一数据锚点与查询对象。 |
| 4 | SupplierProduct 现在到底是什么？ | **具体供应商型号（WHICH MODEL）**，FK 锚定 `platformProductId`。非 Product/SKU/Marketplace Listing。边界稳定。 |
| 5 | 参数/功能/应用/检测对象如何区分？ | 参数=ParameterDefinition（实体，完善）；功能=参数或描述文本（**无实体**）；应用=SupplierProduct.applicationInfo 自由文本 + ContentTag(APPLICATION)（**无实体**）；检测对象=**仅自由文本，无实体无字段**。 |
| 6 | Admin 应不应该有"能力管理"？ | **不新增独立"能力管理"**。现"/能力产品治理"已管理 Product；"能力分类"管理 ProductCategory；"能力型号审核"管理 SupplierProduct。语义正确但**命名易误导**。 |
| 7 | VS-NDT6030 当前能否被正确表达？ | **数据中不存在 VS-NDT6030**（REFERENCE DATA NOT PRESENT）。系统 Schema 可承载多数内窥镜规格，但需以真实数据填充；部分规格（拍照/报告/黑匣子/WiFi4G 等）无对应参数定义。 |
| 8 | 最合理的数据语义结构？ | Product=WHAT 锚点 + SupplierProduct=WHICH MODEL(锚附 platformProductId) + ParameterDefinition 全局参数体系 + 补充 Feature 与 Detection Object 为可选实体。当前结构底座合理。 |
| 9 | 哪些问题真实存在？ | 见 §15 Conflict Matrix：命名漂移（Product↔能力）、Feature/DetectionObject 无实体、SP 参数值=0、VS-NDT6030 无数据、Admin "能力" 命名误导。 |
| 10 | 哪些只是未来候选？ | 独立 Capability 实体、Application 独立实体、Image 专用 Feature 实体、全量参数定义覆盖。 |
| 11 | 是否允许进入下一阶段？ | **是（有前提）**。核心语义稳定；进入下一产品化前须记录上述非阻断 GAP，无需架构级重建。 |

---

## 2. Baseline

冻结基线（本次审计不重释、不重开）：
- Platform Product = WHAT
- SupplierProduct = WHICH MODEL
- Organization = OWNER
- Supplier = OPERATIONAL USER
- Admin = PLATFORM GOVERNANCE
- Offer = COMMERCIAL
- Public Discovery = Product-centered

已关闭且不得重开：M39 / 817 / 818 / 819 / 820 / 821 / P2。

---

## 3. Capability Entity Audit（CORE QUESTION A）

**核查对象**: `database/prisma/schema.prisma`（全 42 张表）。

| 目标实体 | 是否存在 | 证据 |
| --- | --- | --- |
| Capability | **NO** | Schema 无 `Capability` model |
| CapabilityCategory | **NO** | 无 |
| CapabilityParameter | **NO** | 无 |
| CapabilityValue | **NO** | 无 |
| CapabilityProfile | **NO** | 无 |
| CapabilityRelation | **NO** | 无 |

**结论**: **NO INDEPENDENT CAPABILITY ENTITY**。`Capability` 不是数据实体。最接近的 taxonomy 锚点是 `ProductCategory`（如"工业内窥镜" = `industrial-endoscope`）。

---

## 4. Capability Usage Audit（CORE QUESTION B）

全仓语义出现归类（"能力 / capability / 能力分类 / 能力管理"）：

| 层 | 出现处 | 归类 |
| --- | --- | --- |
| Schema | 无 | — |
| Migration | 无 capability 表 | — |
| API (Search) | [`search.service.ts`](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/search.service.ts#L76) `Product = Capability Authority`；`capability: sp.platformProduct` | **C（Search/Match 语义概念 = Product 别称）** |
| API (Match) | [`matching.service.ts`](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/matching/matching.service.ts#L71) 直接 `prisma.product.findMany` | A→实际查询 Product，无 capability |
| Admin | `AdminLayout`: "/products 能力产品治理 / supplier-products 能力型号审核 / product-categories 能力分类" | **B（UI/治理命名）+ 对象=Product** |
| Web | 产品详情 `能力概览 / 能力详情 / 相关检测能力` | **B（UI 文案）→ 底层=Product** |
| 文档 | M34.x 报告 | D |

**关键判定**: 当前项目中"能力"
- **不是独立数据实体**（Schema=NO）
- **是 Search/Discovery 中 Product 的语义/派生标签**（代码注释与 DTO 字段显式 `capability: sp.platformProduct`）
- **是 UI / Admin 的展示命名**（能力产品/能力分类/能力概览）

> 归类结论：**B（UI/展示名词）+ C（Search 语义锚点）**，其值为 Product；**纯 D（Documentation-only）不成立**。

---

## 5. Product Semantic Audit（CORE QUESTION C）

| 检查点 | 证据 |
| --- | --- |
| Prisma Product | `Product` model：categoryId/name/model/description/slug + parameterAssociations/parameterValues/supplierProducts/offers |
| Product Service | 管理平台级产品（能力产品治理） |
| Product Controller / Public API | 产品详情/列表/搜索 |
| Search | DTO `capability` = `sp.platformProduct`（Search service.ts:377） |
| Match | `prisma.product.findMany`（matching.service.ts:71） |
| Admin Product Mgmt | `/products` = "能力产品治理"（ProductList） |
| Web Detail | 页面标题 `能力详情`，正文 `能力概览` |

**判定**: **A = Platform Product authority（WHAT）**，并同时作为 Search/Match 的 **"Capability Authority"**。

**是否存在多重语义?** 存在**命名重叠**但**单一数据承载**：同一 `Product` 对象在代码字段名中叫 `capability`、在 Admin 菜单叫"能力产品"、在 Web 叫"能力"。技术上单一 authority（Product），语义上被"能力"一词覆盖。这不是数据冲突，而是**术语命名漂移（B/C 类）**。

---

## 6. SupplierProduct Boundary（CORE QUESTION D）

- `SupplierProduct.organizationId` → OWNER ✓
- `SupplierProduct.platformProductId` → 锚定 WHAT（Product）✓
- `@@unique([organizationId, platformProductId, modelNumber])` ✓（同一供应商同能力下型号唯一）
- `brand / series / modelNumber / slug` 属"具体型号"身份 ✓
- **Semantic Drift 检查**：**未发现** `SupplierProduct = Product / Capability / SKU / Marketplace Listing`。
  - 非 Product：有 `platformProductId` FK，且有独立主键/品牌/型号。
  - 非 SKU/Marketplace：`SupplierProduct` 无 `price`；商业属性在 `Offer`（COMMERCIAL）中，符合冻结基线。

**结论**: SupplierProduct 即 **WHICH MODEL**，跨 Schema / API / Workspace / Admin / Search 保持一致。**Boundary STABLE**。

---

## 7. Application Audit（CORE QUESTION E）

| 问题 | 回答 |
| --- | --- |
| 是否有 Application 模型？ | **NO**。Schema 无 `Application` |
| Application 回答什么？ | **Where / Why / Use Case** 语义，当前由 `SupplierProduct.applicationInfo`（自由文本）与 `ContentTag(type=APPLICATION)` 承载 |
| 与 Product/SP 关系？ | 仅 SP.description/applicationInfo 自由文本；无结构化关系 |

## 8. Detection Object Audit（CORE QUESTION E 续）

| 问题 | 回答 |
| --- | --- |
| 是否有 Detection Object 模型？ | **NO**。Schema 无 DetectionObject / DetectionTarget |
| Detection Object 回答什么？ | "被检测对象是什么（What is being inspected）" 语义 |
| 现状 | **仅存在于自由文本**（描述/应用文本）。**无独立字段、无实体、无关系** |

> 结论：Application / Detection Object **均未建模为实体**，当前靠自由文本表达。

---

## 9. Feature Audit（CORE QUESTION F）

目标：拍照 / 录像 / 测量 / 报告生成。

| 证据 | 当前形态 |
| --- | --- |
| Schema 无 Feature / ProductFeature / ProductFunction model | **无独立 Feature 实体** |
| 参数定义中存在 `measurement_function`（测量功能）、`image_processing`（图像处理）、`image_sensor`、`video_resolution`、`image_resolution` | **作为 ParameterDefinition（STRING）** |
| 拍照/录像/报告生成 | ZB-K60 产品仅 8 个参数，无 photo/video/report param；此类描述存在于 description/applicationInfo 文本 | **描述文本 / 未建模** |

**判定**: 功能当前 =
- **B（Parameter）** 部分：测量/图像处理以 STRING 参数表达；
- **D（产品描述文本）** 部分：拍照/录像/报告未参数化；
- 非 A（无独立 Feature 对象）、非 C。

---

## 10. Parameter Architecture Audit（CORE QUESTION G）

当前真实参数体系：

| 对象 | 角色 | 证据 |
| --- | --- | --- |
| ParameterDefinition | 全局参数定义（code 唯一），**被谁拥有 = 平台级独立定义** | `ParameterDefinition` |
| ParameterGroup | **仅组织结构**（分组 name/code），无业务约束 | `ParameterGroup` |
| ProductParameterDefinition | **Platform Product 决定适用哪些参数** | join 表 |
| ProductParameterValue | **Platform Product 的实际默认/权威值** | 当前 ZB-K60 有 8 项 |
| SupplierProductParameterValue | **SupplierProduct 的实际型号值** | **当前=0 行**（见 §11） |
| DemandParameter | 需求参数（value/valueMin/valueMax） | 范围支持 |

**问题回答**:
- 参数定义由 **平台/ParameterDefinition 层**拥有；Platform Product 通过关联决定适用参数（能否承载）；SupplierProduct 只填实际型号值。
- 参数组 = **纯组织结构**。
- 支持类型：`ParameterDataType` = **STRING / NUMBER / BOOLEAN / ENUM**。
  - Number ✓（valueNumber）
  - Enum ✓（ParameterOption）
  - Boolean ✓
  - Range：**仅 Demand（valueMin/valueMax）；Product/SP 值无 min/max**（PARTIAL）
  - Unit ✓（value_unit）
  - **Multi-value ✗**（单行单一 value 字符串）

> 结论：参数架构完整、清晰，满足 PlatformProduct→决定参数 / SupplierProduct→填值 的职责分离。**Range 与 Multi-value 为局部缺口（非阻断）**。

---

## 11. VS-NDT6030 Reference Audit

- 仓库/DB 中 **无 VS-NDT6030** 产品（JD 查询 product 表无此名）。
- **REFERENCE DATA NOT PRESENT**（禁止自建测试数据）。

**当前最接近的真实内窥镜产品（ZB-K60，`ebb1c034`，属 [category 电子视频内窥镜]）**，其已承载参数（8 项）：
`articulation_angle(≥180) / ie_ip_rating(IP67) / ie_operating_temp(-20~70) / insertion_tube_material / probe_diameter(8) / probe_type / steering_mode(360°摆头) / working_length(2.0)`。

**VS-NDT6030 规格可承载性（以现有 ParameterDefinition 全集评估）**：

| 规格 | 系统表达能力 |
| --- | --- |
| 探头尺寸 / 工作长度 / 弯曲角度 / 探头直径 / 景深 / 视场角 / 照明方式(光源) / 工作温度 / 防护等级 / 显示屏 / 存储 / 电池 / 续航 | **可表达**（有对应 parameter_code；部分在定义集，但数据未填充） |
| 有效像素 / 图像分辨率 / 图像处理 / 测量功能 / 数据接口 | **可表达**（有 parameter_code；数据未填充） |
| 视向 / 探头亮度调节 / 画中画 / 黑匣子 / WiFi / 4G / 报告生成 / 拍照·录像(明确) | **NOT SUPPORTED**（无对应 ParameterDefinition） |
| 全部规格的实际业务值 — VS-NDT6030 | **NOT PRESENT IN DATA**（无该产品记录） |

> 结论：能够表达的规格取决于 **实际数据是否填充**；VD-NDT6030 本身数据缺失，且少数规格无参数定义可承载。

---

## 12. Admin Information Architecture Audit

Admin Sidebar（AdminLayout）真实菜单 → 数据库对象映射：

| 菜单 Label | Route | 页面组件 | 数据库对象 | 语义 |
| --- | --- | --- | --- | --- |
| 能力产品治理（breadcrumb 显示"能力管理"） | /products | ProductList | **product** | Product 治理 |
| 能力型号审核 | /supplier-products | SupplierProductList | **supplier_product** | SupplierProduct 治理 |
| 能力分类 | /product-categories | （Category） | **product_category** | ProductCategory 治理 |
| 参数组 | /parameter-groups | — | **parameter_group** | 参数体系 |
| 参数定义 | /parameter-definitions | — | **parameter_definition** | 参数体系 |
| 能力询价 | /inquiries | InquiryList | **inquiry** | Inquiry |

**关键回答**:
> **Admin 并无独立"能力管理"菜单管理一个 Capability 对象。** 它用"能力"作为**Product 域的展示前缀**（能力产品治理=管理 `product`；能力分类=管理 `product_category`；能力型号审核=管理 `supplier_product`）。
> 若用户戳"能力管理"→ 实际进入的是 **Product 治理**。**命名需澄清，但对象唯一**。

---

## 13. Frontend Semantic Audit（CORE QUESTION 12）

| 中文词 | 出现页/组件 | 底层数据 | 规范含义 | 潜在冲突 |
| --- | --- | --- | --- | --- |
| 能力 | 搜索/详情(`能力概览/能力详情/相关检测能力`)/Admin/列表 | **Product（platform）** | WHAT | 是否被误解为独立实体 |
| 能力分类 | Home(已收敛到 /categories)/Admin | **ProductCategory** | taxonomy | 词"分类能力" |
| 能力型号 | 搜索结果「该能力下已发布 2 个能力型号」 | **SupplierProduct** | WHICH MODEL | — |
| 产品 | 列表/Admin | **Product(platform) 或 SupplierProduct 视上下文** | 混合 | ⚠️ `产品` 既指 platform 也指型号 |
| 型号 / 供应商产品 | 搜索结果"查看匹配型号"、供应商型号对比 | **SupplierProduct** | WHICH MODEL | — |
| 参数 / 技术参数 | 产品详情 | **ParameterDefinition/Value** | 规格 | — |
| 应用 / 检测对象 | 详情文本、方案 | 自由文本（无实体） | Where/What-inspected | 无结构化 |

**重点回答**:
- "能力" 在 Web 是否指 Product？→ **是**（能力概览/相关检测能力 → `product.name`/`product.category`）。
- "产品" 是否有时指 SupplierProduct？→ **是**（上下文混用，P3）。
- "供应商产品"/"型号" → **SupplierProduct**（一致）。
- "能力分类" → **ProductCategory**。

---

## 14. Search / Matching Compatibility（CORE QUESTION 13）

| 检查 | 结果 |
| --- | --- |
| Capability query / index / facet / entity join? | **无独立 Capability 实体、无 capability query/index/join**。Search 的 `capability` 字段 = **`sp.platformProduct`**（Product）。Facet = **product.categoryId**。 |
| Matching 依赖？ | **matching.service.ts 直接 `prisma.product.findMany`**，锚定 Product（+ProductParameterValue），非 Capability 实体。 |
| 证据 | Search service.ts:76「Product = Capability Authority」:377 `capability: sp.platformProduct`；matching.service.ts:71 |

**结论**: **Search / Matching 均不依赖独立 Capability 实体；它们依赖 Product（作为唯一 WHAT/能力权威）。**

---

## 15. Semantic Conflict Matrix

| ID | Object A | Object B | Current Meaning | Conflict | Evidence | Severity |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | Capability（词） | Product（对象） | 名称对单一数据对象 | **同一对象两个称谓**；"能力"易被误作独立实体 | search.service.ts:76/377; 能力详情 | **P2（命名漂移，非数据错）** |
| S2 | Product（词） | SupplierProduct / Product | "产品"混指 platform 与型号 | 上下文混用 | 列表/搜索 | **P3** |
| S3 | 能力分类 | ProductCategory | taxonomy | 词"分类能力" | Admin /products | **P3（命名）** |
| S4 | 应用(Application 词) | 无实体 | 用 applicationInfo 文本表达 | 无独立模型 | schema | **P2（建模缺口）** |
| S5 | 检测对象(Detection Object) | 无实体无字段 | 自由文本 | **无结构化承载** | schema | **P2（建模缺口）** |
| S6 | 功能(Feature 词) | ParameterDefinition | 用参数表达 | 拍照/录像/报告未参数化 | ZB-K60 参数集 | **P2（局部）** |
| S7 | capability(代码字段名) | Product(Entity) | 代码命名 = 产品 | 代码可读性 | search.service.ts | **P2（代码命名，CURRENT）** |

**Cause（成因分类）**：S1/S3 = **DESIGN CHOICE**（刻意用"能力"作为 Product 的发现/展示名词）；S4/S5/S6 = **PRE-EXISTING / LEGACY**（未建模）；S7 = **CURRENT ISSUE**（代码命名 vs 实体）。

> 未发现 `Capability = Parameter`、`Capability = Feature`、`Application = Capability`、`DetectionObject = Capability`、`SupplierProduct = Product/SKU/Marketplace` 等结构级冲突。核心对象边界（Product=EACH WHAT、SupplierProduct=WHICH MODEL、Organization=OWNER）**无漂移**。

---

## 16. Final Architecture Judgment

- **Core architecture**: Product(WHAT) ↔ SupplierProduct(WHICH MODEL) ↔ ParameterDefinition(global spec) ↔ Organization(OWNER) 关系**清晰且稳定**。
- **"Capability"** 是 Product 的 **语义/展示派生概念**，非独立建模层。
- **真实缺口（非阻断）**：
  1. Feature 与 Detection Object 无实体（靠参数/自由文本）；
  2. SupplierProduct 参数值当前为 **0**（数据未填充，非 schema 缺陷）；
  3. Admin 与 Web 的"能力/产品/型号"命名存在**一词多义**（P2/P3 命名）；
  4. VS-NDT6030 类真实工业产品数据不在库中（REFERENCE DATA NOT PRESENT）。

---

## 17. Recommended Canonical Semantics

| 词项 | 规范语义 |
| --- | --- |
| Product | **Platform Product = WHAT（能力 Authority / 核心锚点）** |
| SupplierProduct | **具体供应商型号 = WHICH MODEL**（platformProductId 锚定 WHAT） |
| Parameter | **规格/参数定义**（ParameterDefinition，平台级；Product 决定适用；SP 填值） |
| Feature | **功能**（建议未来独立 Feature 实体或参数化承载（拍照/录像/测量/报告）） |
| Application | **应用场景 / Use Case**（WHERE/WHY；建议未来结构化） |
| Detection Object | **被检测对象**（WHAT-is-inspected；建议未来结构化） |
| Capability | **= Product 的展示/发现语义别名（保留为 UX 名词，不作独立实体）** |

---

## 18. Future Candidates（等待独立授权，本任务不实施）

1. `Feature`（Function）可选独立实体，承载"拍照/录像/测量/报告生成"。
2. `Detection Object` / `Application` 结构化实体（若产品化需要）。
3. "能力" 命名的规范化（如统一至 Product/能力 Authority 术语表），消除 P3 混用。
4. 全量参数定义下沉至真实工业设备（需真实产品数据，遵守数据治理门槛）。
5. 独立 Capability 实体 —— **不推荐**，除非未来出现非 Product 的独立"能力"需要。

---

## 19. Final Decision

**FINAL DECISION = B = STABLE WITH NON-BLOCKING GAPS**

- **A（SEMANTICALLY STABLE）**：未完全满足——存在 Feature/DetectionObject 建模缺口与命名混用。
- **B（STABLE WITH NON-BLOCKING GAPS）** ✅：核心语义（Product=WHAT / SupplierProduct=WHICH MODEL / Organization=OWNER / Offer=COMMERCIAL）稳定一致，无 P0/P1 架构冲突，无数据/安全阻断。可进入后续产品化。
- C（RECONSTRUCTION REQUIRED）不成立。
- D（ARCHITECTURE BLOCKED）不成立。

**非阻断 GAP 清单**（P2/P3，均记录，不阻塞进入下一阶段）：Feature 无实体、DetectionObject/Application 自由文本、SP 参数值=0、VS-NDT6030 数据缺失、Admin/Web"能力/产品/型号"命名混用（P3 文案）。

---

## 20. STOP

本任务仅执行 **Inspect / Audit / Classify / Map / Conclude**。

未执行以下任何一项：
- ✅ 未新增 Capability Model
- ✅ 未重构 Product / SupplierProduct
- ✅ 未开发 Capability Management / Parameter Management
- ✅ 未重构 Admin / Frontend
- ✅ 未执行中文化 / Search / SEO 重构
- ✅ 未修改任何 Schema / Migration / 数据 / 代码 / UI

所有实施建议已置于 §18 Future Candidates，**等待独立授权**。

---

## FINAL OUTPUT（11 问题一览）

1. **Capability 现在到底是什么？** → Platform Product 的语义/展示别名；无独立实体。
2. **Capability 是否应成为独立实体？** → **否（非阻断）**；内置但列 Future Candidate。
3. **Product 现在到底是什么？** → Platform Product = WHAT（能力 Authority / Search+Match 唯一锚点）。
4. **SupplierProduct 现在到底是什么？** → 具体供应商型号 WHICH MODEL，锚定 platformProductId，边界稳定。
5. **参数/功能/应用/检测对象如何区分？** → 参数=实体；功能=参数/文本；应用=free-text+tag；检测对象=仅文本。Feature/Application/DetectionObject 未建模。
6. **Admin 应不应该有"能力管理"？** → **不新增独立"能力管理"**；现"能力产品治理"已管 Product，把命名对齐即可。
7. **VS-NDT6030 当前能否被正确表达？** → 数据不存在（REFERENCE DATA NOT PRESENT）；Schema 可承载多数规格，少数字段（报告/黑匣子/拍照/直播等）无定义。
8. **当前最合理的数据语义结构？** → Product(WHAT) ←→(platformProductId) SupplierProduct(WHICH MODEL) + 平台级 ParameterDefinition 体系；Feature/DetectionObject 可视产品化需要后续补充。
9. **哪些问题真实存在？** → 命名漂移（能力↔产品，P2/P3）；Feature/DetectionObject 无实体（P2）；SP 参数值为 0（数据，P3）；VS-NDT6030 缺数据。
10. **哪些只是未来候选？** → 独立 Capability 实体、Application/DetectionObject/Feature 结构实体、全量参数下沉（均 Future Candidate）。
11. **是否允许进入下一阶段？** → **是（有前提）**。核心语义稳定（Final=B）；进入后续产品化前，将上述 GAP 如实记录并在独立授权后按优先级处理。

**AUDIT COMPLETE — READ-ONLY — STOP。**