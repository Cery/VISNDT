# 458_M19_Product_Experience_Architecture_Reassessment_And_Blueprint_Audit_Report

## 报告元信息

- **Task**: 458_M19_Product_Experience_Architecture_Reassessment_And_Blueprint_Audit
- **Task Type**: Architecture Planning / Capability Reassessment / Product Experience Blueprint
- **Stage**: M19_Preparation
- **Execution Mode**: ONLY READ ANALYSIS + ARCHITECTURE REPORT GENERATION
- **执行日期**: 2026-08-12
- **前置**: 基于 M18.5 Content Operation Stabilization 完成后的真实代码状态
- **审计基线依据**: 真实代码（apps/api、apps/web、apps/admin、database/prisma）＋ 457 审计结论

---

## 1. Task Overview

本任务在 M18.5 Content Operation Stabilization 收尾后，对 VISNDT 产品体验体系进行整体再评估，并输出 **M19 Product Experience Architecture Blueprint**。

目标：
- 为后续 **Product Center V2、Frontend Platform Design、Admin Platform Optimization** 提供冻结设计依据。
- 保持 **Code State = Documentation State**，仅基于真实代码分析。
- **不开发、不修改代码、不修改数据库、不新增 Migration、不改 API Contract、不改权限、不改 UI**。

---

## 2. Repository Verification

### 2.1 仓库与代码根目录

| 项 | 路径 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Database Schema | `F:\Desktop\VISNDT\VISNDT\database\prisma\schema.prisma` |
| Backend | `F:\Desktop\VISNDT\VISNDT\apps\api` |
| Web Frontend | `F:\Desktop\VISNDT\VISNDT\apps\web` |
| Admin Frontend | `F:\Desktop\VISNDT\VISNDT\apps\admin` |

### 2.2 Git 状态

- **当前分支**: `main`
- **未提交修改**:

```
 M VISNDT/apps/admin/src/components/content/index.ts
 M VISNDT/apps/admin/src/pages/content/ContentEdit.tsx
 M VISNDT/apps/admin/tsconfig.tsbuildinfo
 M docs/project-management/BUSINESS_CAPABILITY_MAP.md
 M docs/project-management/CONTENT_MANAGEMENT_PLAN.md
 M docs/project-management/MODULE_COMPLETION_MATRIX.md
 M docs/project-management/PROJECT_ROADMAP.md
 M docs/project-management/PROJECT_STATUS.md
?? VISNDT/apps/admin/src/components/content/ContentSeoPanel.tsx
?? VISNDT/apps/admin/src/components/content/ContentSeoPreview.tsx
?? docs/_review/453_M18.5.1_..._report.md
?? docs/_review/454_M18.5.2_..._report.md
?? docs/_review/455_M18.5.3_..._report.md
?? docs/_review/456_M18.5.4_..._report.md
?? docs/_review/457_M18.3_Platform_Capability_Product_Experience_Reassessment_Audit_Report.md
```

### 2.3 代码状态结论

- 工作区处于 **M18.5.3 Content SEO 运营面板实现后、尚未提交** 状态（`ContentSeoPanel.tsx` / `ContentSeoPreview.tsx` 未跟踪，`ContentEdit.tsx` 与 `components/content/index.ts` 已改动）。
- 最新 review 报告：`457_M18.3_..._Audit_Report.md`（本任务为 457 的承接蓝图审计）。
- 审计仅以代码存在性为证据，不评估/不修改未提交改动。

---

## 3. Scope Control

- 本任务仅执行 **Architecture Audit + Capability Analysis + Data Relationship Analysis + Frontend/Admin Architecture Planning + Report Generation**。
- 未修改 TypeScript / React / NestJS / Prisma Schema / Migration / API Contract / 权限逻辑 / UI 文件。
- **Code Change: None ／ Schema Change: None ／ Migration: None ／ API Change: None**。

---

## 4. Domain Audit

### 4.1 Product Domain Audit

**Schema 模型**：`Product`、`ProductCategory`、`ProductMedia`、`ProductParameterValue`、`ParameterDefinition`、`ParameterGroup`、`ParameterOption`。

**产品中心数据能力**：
- Product 为平台全局目录（无 organizationId），含 `categoryId / name / model / description / status / createdById`。
- 参数体系：`ParameterGroup` → `ParameterDefinition`（dataType: STRING/NUMBER/BOOLEAN/ENUM，unit，required）→ `ProductParameterDefinition`（产品-参数关联+排序）→ `ProductParameterValue`（value/valueNumber，唯一 `[productId, parameterDefinitionId]`）。`ParameterOption` 承载枚举选项。
- 媒体：`ProductMedia`（mediaType=FileType，isPrimary，displayOrder，fileAssetId）。

**参数体系能力**：结构化完整，支持精确值 + 数值（valueNumber）双重存储，为范围筛选与匹配提供数值基础。

**产品展示能力**：Web 产品列表（关键词+分类+排序+分页）、产品详情（相册/参数/文档证书/询价）。但详情页 `ManufacturerInfo` 恒传 `organization={null}`，**不展示供应商/Offer**。

### 4.2 Supplier Domain Audit

**Schema 模型**：`Organization`、`OrganizationMember`、`Offer`、`User`、`RFQResponse`。

- `Offer`：`organizationId + productId + title + description + price + currency + status`，唯一 `[organizationId, productId]`。供应商在全局 Product 上挂 Offer。
- 供应商可提交/编辑/accept/reject/withdraw Offer（authenticated，org-scoped），可响应 RFQ；**不能创建/编辑产品**（仅 ADMIN）。
- **产品公开展示边界**：当前产品详情页不展示 Offer/供应商 → 供应商信息在公开站点近乎不可见。

**架构判断**：**继续保持 Product Global Catalog 模式**（方案A），不默认引入 `Product.organizationId`。

### 4.3 Search Domain Audit

**后端**（`ProductsService.findAll` + `SearchProductDto`）：
- 支持 `keyword`（name/model/description contains）、`categoryId`、`status`、`parameterFilters`（精确 `value` + 数值范围 `valueMin/valueMax`，互斥校验）、`sortBy`（白名单 createdAt/updatedAt/name）、`sortOrder`、`page/pageSize`。
- 范围筛选基于 `ProductParameterValue.valueNumber`（gte/lte）。

**Web 消费缺口**：产品列表仅暴露关键词 + 分类 + 排序 + 分页；**参数筛选与范围筛选 UI 未接入**（后端能力闲置）。

**参数筛选体验方案**（蓝图层，不实施）：
- 按分类动态加载候选 `ParameterDefinition`，渲染参数筛选面板（枚举多选题 / 数值范围滑块）。
- 组合筛选 → 多参数 AND → `parameterFilters`。
- 参数标签（filter chips）可视化已选条件。

### 4.4 Matching Domain Audit

**链路**：`Demand` → `MatchingService.match` → `Product`（ACTIVE + 有 ACTIVE Offer）→ `ScoringService.calculateScore` → `DemandMatch`。

**评分算法**（`ScoringService`）：
- 加权（priority/defaultPriority），`dataType` 分派：NUMBER→rangeMatch（含偏离度部分得分）、ENUM/STRING/BOOLEAN→exactMatch。
- 硬约束：required 参数未达即 hardFail。
- 参数共享：`DemandParameter` 与 `ProductParameterValue` 引用同一 `ParameterDefinition` ✅。

**关系结论**：产品搜索、需求匹配、参数体系共享同一参数定义主数据，形成「结构化参数 = 搜索/匹配/展示统一底座」。

### 4.5 Content Domain Audit

**Schema 模型**：`Content`、`ContentRevision`、`ContentMedia`、`WorkflowEvent`、`AuditLog`、`FileAsset`。

- Content 单表统一实体（ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT），完整生命周期 + SEO + 定时发布 + 修订 + 审核时间线。
- `ContentMedia` + `FileAsset` 统一媒体链路。

**数据融合基础**：
- Product（结构化参数）与 Content（知识/方案/洞察）目前**无直接关联模型**，但共享 `FileAsset` 媒体体系、共享 `ParameterDefinition` 可作为未来「产品 → 知识/参数百科」融合的锚点。
- WorkflowEvent/AuditLog 为后续 AI Discovery 提供事件溯源基础。

---

## 5. Impact Verification（架构判断）

### 5.1 Product Center Architecture

- **定位**：产品中心 = 平台标准产品目录（Global Catalog）的展示与消费前端，作为「产品 → 供应商(Offer) → 知识内容 → AI选型」的统一入口。
- **产品列表信息结构**：分类树（侧栏）+ 参数筛选面板 + 关键词 + 排序 + 分页 + 产品卡片（图/名/型号/关键参数摘要/供应方数量）。
- **产品详情信息结构**：相册 + 概要（名/型号/分类/描述）+ 技术参数（分组展示）+ 文档证书 + **供应方列表（Offer + 组织）** + 询价入口。
- **产品参数展示方式**：按 `ParameterGroup` 分组，`ProductParameterValue` 渲染参数表（含单位/枚举标签）。
- **产品媒体展示方式**：`ProductMedia` isPrimary 相册 + displayOrder 排序。
- **产品附件/证书展示方式**：`ProductMedia` 非 IMAGE 类型分「文档/证书」区块。

### 5.2 Supplier Display Architecture

- **推荐方案：方案A —— Product Global Catalog + Offer Supplier Display**
- 原因：
  1. 现行 Schema 即以此为模型（Product 无 organizationId，Offer 挂载供应商），改动最小、无 Migration。
  2. 保持目录质量标准（仅 Admin 建产品），避免供应商质量参差污染全局目录。
  3. 供应差异（报价/认证/服务）天然收敛到 Offer 层，产品详情页渲染 Offer 列表即可表达「多供应商同款产品」。
- 方案B（Supplier Product Ownership / `Product.organizationId`）仅作为**未来方案评估项**，本蓝图不默认引入。

### 5.3 Product Family / Model Architecture

- **评估结论**：当前由 `ProductCategory` 层级 + `Product.model` 号承载「族/型号」维度，**暂不新增 `ProductFamily` / `ProductModel` / `SupplierOffering` 独立模型**。
- 理由：`Product.model` 已能表达型号；供应商版本语义由 Offer 承载。是否拆分独立模型应在 Volume/数据规模驱动后再评估。
- **禁止立即实现**。

### 5.4 Frontend Platform Evolution

**Web（M19-M20 演进）**：
- M19：产品中心 V2（参数筛选 UI、详情供应方列表、信息架构统一、静态页动态化）。
- M20：设计系统（Design System）化、组件库沉淀、AI 入口（选型助手/语义搜索）接入层。

**Admin（M19-M20 演进）**：
- M19：产品运营中心优化（产品审核工作流、参数辅助录入、供应商 Offer 管理视图）。
- M20：运营中心（Dashboard 深化 + 内容/产品/供应商统一运营视图 + AI 辅助）。

### 5.5 AI Readiness Architecture

- **所需基础能力**（评估，不实现）：
  - Embedding 生成管道（产品参数/描述/内容 → 向量）。
  - Vector Search（pgvector 或独立向量库）。
  - RAG（知识库 + 产品参数检索增强生成）。
  - AI Selection Assistant（参数 → 选型：基于结构化参数 + 向量语义）。
- **数据基础**已经具备：结构化参数、内容、分类、Offer、Demand。缺基础模型与向量设施。

---

## 6. Architecture Decision Records（ADR 摘要）

| ADR | 决策 | 结论 |
| --- | --- | --- |
| ADR-P1 | 产品中心定位 | 平台标准目录 + 统一消费入口 | 采纳 |
| ADR-P2 | 供应商展示 | 方案A：Global Catalog + Offer Supplier Display | 采纳（推荐） |
| ADR-P3 | Product.organizationId | 不默认引入，作为未来评估项 | 暂缓 |
| ADR-P4 | ProductFamily/Model/Offering | 暂不新增独立模型，用 Category + model + Offer 表达 | 暂缓 |
| ADR-S1 | 参数筛选 | 前端消费后端 parameterFilters，动态参数面板 | M19 规划 |
| ADR-C1 | 内容融合 | 基于共享媒体/参数锚点，暂不建关联模型 | 观望 |
| ADR-A1 | AI | 先建 Embedding/Vector/RAG 底座，再演进选型助手 | M20 规划 |

---

## 7. Risk Assessment

1. **供应商展示断层（高）**：详情页不展示 Offer/供应商，制约转化，是 M19 最高优先级。
2. **搜索能力闲置（中）**：后端参数/范围筛选已实现，前端未消费，形成能力浪费。
3. **产品无审核工作流（中）**：`status` 直接改动，缺提交/审核/发布审计，质量控制薄弱。
4. **产品族/型号缺失（中低）**：多供应商同款产品无法对比，依赖 Category + model + Offer 表达，规模扩大后需再评估。
5. **未提交状态（低）**：M18.5.3 SEO 面板改动未提交，存在遗漏风险，建议 M19 开工前先提交基线。
6. **AI 零设施（中）**：AI 需从零搭建 Embedding/Vector 底座。

---

## 8. M19 Recommendation

> 基于审计，M19 聚焦「产品体验重构 + 供应商展示 + 搜索体验」，**架构先行，禁止直接开发**。

### M19 阶段建议

- **M19.0**：M19 Product Experience Architecture Implementation Planning（冻结蓝图 → 拆解任务）。
- **M19.1**：Product Center V2 前端（列表参数筛选 UI + 详情供应方列表 + 询价选供应商 + 信息架构统一）。
- **M19.2**：Supplier Display 增强（Offer 列表渲染 + 供应商信息展示 + 对比能力）。
- **M19.3**：Search Experience 升级（参数标签 / 范围筛选 / 组合筛选 / 相关性排序）。
- **M19.4**：Admin 产品运营优化（产品审核工作流 + 参数辅助录入 + Offer 管理视图）。
- **M19.x**：AI 底座评估（P0：资料整理 / SEO 生成 / 参数补全；M20 再引入搜索/选型）。

---

## 9. Final Execution Output

- **Task**: 458_M19_Product_Experience_Architecture_Reassessment_And_Blueprint_Audit
- **Status**: **Completed**
- **Modified Files**: None
- **Code Change**: None
- **Schema Change**: None
- **Migration**: None
- **API Impact**: None
- **Build**: Not Required
- **Next Recommendation**: M19 Product Experience Architecture Implementation Planning

---

## 执行原则

**Audit First. Architecture Before Development. No Feature Expansion. No Architecture Drift. No Database Change Before Model Freeze. Code State = Documentation State.**

本报告仅基于真实代码与 Schema 建立 M19 产品体验架构蓝图，不实施 Supplier 扩展 / AI Search / 产品模型重构 / CMS 扩展 / UI 重构。