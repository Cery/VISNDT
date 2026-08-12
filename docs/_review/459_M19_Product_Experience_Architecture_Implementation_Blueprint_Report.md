# 459_M19_Product_Experience_Architecture_Implementation_Blueprint_Report

## 报告元信息

- **Task**: 459_M19_Product_Experience_Architecture_Implementation_Blueprint
- **Task Type**: Architecture Design / Implementation Planning / Product Experience Blueprint
- **Stage**: M19 Preparation
- **Execution Mode**: ONLY READ ANALYSIS + ARCHITECTURE BLUEPRINT GENERATION
- **执行日期**: 2026-08-12
- **设计依据**:
  - `457_M18.3_Platform_Capability_Product_Experience_Reassessment_Audit_Report`
  - `435_M16_Precheck_Search_AI_Discovery_Audit_复核`（实际编号 448）
  - `435_M16_Precheck_Supplier_Product_Lifecycle_Audit_复核`（实际编号 447）
  - `458_M19_Product_Experience_Architecture_Reassessment_And_Blueprint_Audit_Report`
- **审计基准**: 真实代码（apps/api、apps/web、apps/admin、database/prisma）＋ 上述审计证据链

---

## 1. Repository Verification

| 项 | 值 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Git Branch | `main` |
| Workspace | 非 clean（M18.5.3 SEO 面板相关未提交，本任务仅记录，未触碰） |

**当前 modified 文件**：
```
 M VISNDT/apps/admin/src/components/content/index.ts
 M VISNDT/apps/admin/src/pages/content/ContentEdit.tsx
 M VISNDT/apps/admin/tsconfig.tsbuildinfo
 M docs/project-management/BUSINESS_CAPABILITY_MAP.md
 M docs/project-management/CONTENT_MANAGEMENT_PLAN.md
 M docs/project-management/MODULE_COMPLETION_MATRIX.md
 M docs/project-management/PROJECT_ROADMAP.md
 M docs/project-management/PROJECT_STATUS.md
```

**当前 untracked 文件**：
```
?? VISNDT/apps/admin/src/components/content/ContentSeoPanel.tsx
?? VISNDT/apps/admin/src/components/content/ContentSeoPreview.tsx
?? docs/_review/453-457_..._Report.md（453/454/455/456/457 未提交）
```

**未提交 Review 报告**：453/454/455/456/457（其中 457 为本审计链最新）

**M18.5.3 SEO 面板状态**：`ContentSeoPanel.tsx` / `ContentSeoPreview.tsx` 未跟踪，`ContentEdit.tsx` 与 `components/content/index.ts` 已改动，认证为 M18.5.3 SEO 运营面板增强实现，**尚未提交**。

> 本任务仅记录现状，不执行 git commit / reset / checkout，不删除未提交文件。

---

## 2. Scope Control

- 本任务仅执行读取 + 分析 + 蓝图生成。
- 未修改 `*.ts / *.tsx / *.prisma / migration / controller / DTO / service / component / page / route`。
- 未新增数据库字段、Migration、接口；未修改权限模型；未开始 UI 重构。
- **Code Change: None ／ Schema Change: None ／ Migration: None ／ API Change: None**。

---

## 3. Architecture Constraint 确认

### 3.1 Product Architecture Freeze
- **默认采用**：`Product Global Catalog + Offer Supplier Display`。
- **禁止直接引入** `Product.organizationId`。
- **禁止新增** `ProductFamily / ProductModel / SupplierOffering`（仅作为未来评估项，见 §13 Risk / §8 数据库影响）。

### 3.2 Product Center Positioning
- VISNDT 产品中心 **不是商品商城**。
- 定位 = **工业检测设备标准产品目录 + 供应商能力展示入口 + 需求撮合入口 + 知识内容入口 + 未来 AI 选型入口**。

### 3.3 数据能力复用原则
- 复用现有：`Product / ProductParameterValue / ParameterDefinition / ProductMedia / FileAsset / Offer / Organization / Content`。
- 原则：`Backend Capability First，Frontend Experience Consume Existing Capability`。
- **禁止** 为页面效果重新设计数据库。

---

## 4. Current Capability Baseline（真实代码）

| 能力 | 现状 | 证据 |
| --- | --- | --- |
| 产品生命周期 | Admin 主导（创建/编辑/删除/状态），无独立审核流 | products.controller/service |
| 产品归属 | 平台统一库，无 organizationId | schema L311-338 |
| 供应商能力 | 仅 Offer + RFQ 响应，无产品自助维护 | offers.controller / supplier workspace |
| 搜索 | 后端 keyword/category/parameterFilters/排序/分页；参数筛选 Web UI 缺失 | products.service L14-115 |
| 匹配 | weighted_v1 加权，Demand/Product 共享 ParameterDefinition | matching/scoring |
| 内容 | 完整 CMS（类型/生命周期/媒体/修订/定时/审核时间线/SEO） | content 模块 |
| 公开展示供应商 | ❌（ManufacturerInfo 恒 organization=null） | products/[slug]/page.tsx |

---

## 5. Product Experience Architecture

### 5.1 Product Center V2 — 产品列表页

| 项 | 设计 |
| --- | --- |
| 页面目标 | 让用户按分类 + 参数精确锁定工业检测设备，并感知供应能力 |
| 数据来源 | `GET /products`（keyword/categoryId/parameterFilters/sortBy/sortOrder/page/pageSize，status=ACTIVE） |
| 展示字段 | 主图（ProductMedia isPrimary）、名称、型号（model）、分类、关键参数摘要 |
| 筛选能力 | 分类树（categoryId）＋ **动态参数筛选面板**（ParameterDefinition 驱动，见 §6） |
| 排序能力 | createdAt/updatedAt/name（复用白名单） |
| 分页能力 | page/pageSize（复用） |

涉及模型：`Product / ProductCategory / ParameterDefinition / ProductParameterValue / ProductMedia / Offer`。

### 5.2 Product Center V2 — 产品详情页

完整信息架构：

- **Product Overview**：产品名称、型号、分类、描述、主图相册（ProductMedia isPrimary/displayOrder）。
- **Technical Specification**：基于 `ParameterGroup → ParameterDefinition → ProductParameterValue` 动态渲染参数表（含单位/枚举标签）。
- **Media Center**：基于 `ProductMedia + FileAsset`，支持图片、技术资料、认证附件（非 IMAGE 分「文档/证书」）。
- **Supplier Capability**：基于 `Offer + Organization` 展示供应商、供应能力、服务描述。**禁止商城化、禁止公开价格体系**（Offer.price 不公开展示）。
- **Inquiry Flow**：`Product → 选择供应商 Offer → 询价`。**禁止自动取第一个 Offer**（当前 `inquirateOffer` 逻辑需改为用户选择）。

---

## 6. Search Experience Blueprint（动态参数搜索）

- **硬性要求**：不能写死「管径 / 像素 / 长度」等参数，必须基于 `ParameterDefinition` 动态生成。
- **链路**：`Category（分类）→ 可用参数定义（ParameterDefinition）→ 筛选组件（动态渲染）→ parameterFilters API`。
- **实现要点**（仅设计）：
  - 按分类查询该分类产品所关联的 `ParameterDefinition` 集合作为可用筛选维度。
  - 依据 dataType 渲染控件：ENUM→多选题（ParameterOption）、NUMBER→范围滑块（valueMin/valueMax）、STRING/BOOLEAN→选项。
  - 组合多参数 → `parameterFilters` AND → 复用现有 API。
  - 已选条件以参数标签（filter chips）展示，支持移除。
- **复用**：后端 `parameterFilters` 已实现，仅前端消费。

---

## 7. Admin Product Operation Center Blueprint

### 7.1 从「功能页面集合」升级为「产品运营中心」

设计模块：
```
Product Management        （产品 CRUD + 查询 + 批量）
Parameter Management      （ParameterGroup / ParameterDefinition / ParameterOption）
Media Management          （ProductMedia 图片）
Attachment Management     （文档 / 证书，FileType.CERTIFICATE）
Supplier Offer Management （供应商 Offer 视图 + 审核）
Product Quality Control   （重复/缺失参数/质量校验）
Workflow Future Extension （预留产品审核工作流）
```

### 7.2 产品审核流程评估（仅设计，不实现）
- 当前仅 `status`（DRAFT/ACTIVE/INACTIVE）+ `batch-status`，无独立审核。
- **评估结论**：M19 建议引入轻量产品审核状态机（如 `DRAFT → SUBMITTED → REVIEWED → ACTIVE`），复用现有 `WorkflowEvent` + `AuditLog`，**不新增 WorkflowAction 枚举值**（沿用 CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED）。
- 仅在报告中作为设计建议，本任务不实现。

---

## 8. Data Consumption Architecture

- **统一参数底座**：`ParameterDefinition` 同时被 `ProductParameterValue`（产品）、`DemandParameter`（需求）引用 → 搜索、筛选、匹配、展示共享同一参数语义。
- **Supplier 关联**：`Offer.organizationId + productId`（唯一 `[organizationId, productId]`）承载「哪家供应商供应哪款产品」。产品详情「供应商能力」从 `findOne` 已返回的 `offers.organization` 消费，无需新增表。
- **媒体复用**：`FileAsset` 统一承载 ProductMedia / ContentMedia / Content 封面。
- **内容融合（未来）**：Product 与 Content 暂无直接关联模型，共享 `FileAsset` 媒体 + `ParameterDefinition` 锚点，为 AI Discovery 预留融合面。

---

## 9. API Impact Assessment

- **现有 API 已足**：`GET /products`（含 parameterFilters）、`GET /products/:id`（含 offers.organization）、`GET /products/public`（内容公开读）均已存在。
- **M19 前端改动为主**：产品列表/详情主要改造前端消费，不新增产品 API。
- **评估是否需要新增接口**：
  - 「按分类获取可用参数定义」：需要一个小型只读端点（如 `GET /products/filter-options?categoryId=`）或复用现有参数查询。**M19 需评估**，属新增端点（本蓝图不实现）。
  - 「询价选供应商」：复用现有 `Inquiry` 链路（offerId/organizationId 已支持），无需新增。
- **API Change（本任务）: None**。

---

## 10. Database Impact Assessment

- **M19 默认零 Schema 变更**：现有 `Product / ParameterDefinition / ProductParameterValue / ProductMedia / Offer / Organization` 足以支撑产品中心 V2 与供应商展示。
- **禁止新增**：`Product.organizationId`、`ProductFamily`、`ProductModel`、`SupplierOffering`（除非未来规模驱动，见 Risk）。
- **未来评估（不实施）**：
  - 商品「供应能力」若需粒度化（库存/交期/服务条款），可评估在 `Offer` 上扩展字段或新增 `SupplierOffering`。
  - 产品族/型号若 Volume 增长，可评估从 `Product.model` 拆分独立模型。
- **Database Change（本任务）: None ／ Migration: None**。

---

## 11. M19 Implementation Phases

### M19.0 — Architecture Freeze
- 冻结本蓝图（459）为唯一设计依据；提交 M18.5.3 未提交基线；确认零 Schema 变更。

### M19.1 — Product Center V2
- 产品列表：动态参数筛选面板 + 参数标签 + 复用 parameterFilters。
- 产品详情：Overview / Technical Specification / Media Center 完善；询价改「选择供应商 Offer」。

### M19.2 — Supplier Display
- 产品详情渲染 `offers.organization` 为「供应商能力」区块（供应商、供应能力、服务描述）。
- 询价链路：`Product → 选择 Offer → Inquiry`（禁止自动取第一个 Offer）。

### M19.3 — Search Experience
- 动态参数搜索（Category → ParameterDefinition → 筛选组件 → parameterFilters）。
- 「按分类获取可用参数定义」端点评估与实现。

### M19.4 — Admin Product Operation Center
- 产品运营中心改造（模块化 + 供应商 Offer 管理视图 + 质量控制）。
- 产品审核工作流评估与设计（复用 WorkflowEvent/AuditLog，不新增枚举）。

---

## 12. M20 Platformization Boundary

| 领域 | M19（业务体验冻结） | M20（平台化建设） |
| --- | --- | --- |
| Web 组件 | 临时实现（含参数筛选、供应商块） | **Design System 统一**（通用 ProductCard/Filter/Tabs 等） |
| Admin 组件 | 业务页面集合 | Admin Design System + 运营中心统一布局 |
| 数据层 | 消费现有 API | 统一 API 网关 / 缓存 / 查询层沉淀 |
| AI | 不引入 | Embedding + Vector + RAG + 选型助手 |
| 产品族/供应商 | 现状（Category+model+Offer） | 按规模评估独立模型 |

**临时 vs 统一**：M19 中「参数筛选面板」「供应商能力块」「产品卡片」为临时实现；M20 提炼为 Design System 通用组件。

---

## 13. Risk Assessment

1. **供应商展示断层（高）**：详情页不展示 Offer/供应商，制约转化；M19 最高优先级。
2. **搜索能力闲置（中）**：后端 parameterFilters 已实现，前端未消费；M19.1/M19.3 补齐。
3. **产品无审核工作流（中）**：质量控制薄弱；M19.4 评估设计。
4. **询价自动取第一个 Offer（中）**：需改为用户选择供应商。
5. **未提交基线（低）**：M18.5.3 SEO 改动未提交，建议 M19.0 前提交。
6. **产品族/供应商模型缺失（中低）**：规模扩大后需再评估，当前不新增。
7. **「按分类获取参数定义」端点缺失（低）**：动态参数筛选前置依赖，M19.3 评估新增。

---

## 14. Final Recommendation

- M19 严格按「M19.0 冻结 → M19.1 产品中心 V2 → M19.2 供应商展示 → M19.3 搜索体验 → M19.4 Admin 运营中心」推进。
- **前端消费现有后端能力，零 Schema 变更**；仅在 M19.3 评估「按分类获取参数定义」这一新增只读端点。
- 先冻结本蓝图，再进入 `M19.1 Product Center V2 Implementation Planning`，**架构先行、禁止直接开发**。

---

## 15. Final Execution Output

- **Task**: 459_M19_Product_Experience_Architecture_Implementation_Blueprint
- **Status**: **Completed**
- **Modified Files**: None
- **Code Change**: None
- **Schema Change**: None
- **Migration**: None
- **API Change**: None
- **Review Report**: `docs/_review/459_M19_Product_Experience_Architecture_Implementation_Blueprint_Report.md`
- **Next**: M19.1 Product Center V2 Implementation Planning

---

## 执行原则

**Architecture Before Development. No Feature Expansion. No Database Change Before Model Freeze. Reuse Existing Capability. Frontend Should Consume Backend Capability. Code State = Documentation State.**

本报告仅建立 M19 产品体验架构实施蓝图，不实施任何开发/Schema/API/权限/UI 变更。