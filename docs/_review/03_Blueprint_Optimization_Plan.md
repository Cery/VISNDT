# 03 Blueprint Optimization Plan

文档定位：  
本文件只给出 Blueprint 优化方案，不执行文件合并、迁移、删除、改名或正式文档修改。

目标：  
把现有文档库收敛为 **VISNDT Blueprint v1.0**，形成：

- 唯一版本
- 唯一设计来源
- AI 可理解
- 可指导代码开发

---

## 1. 当前问题

### 1.1 版本来源不唯一

当前同时存在：

1. Product 第一版与第二版
2. Database 原版与第二版
3. Blueprint 总 DOCX 与多份细化文档并存
4. `DOCUMENT_INDEX.md` 与真实目录不一致

### 1.2 分层闭环没有完全打通

当前已经形成主干：

`Business -> Product -> Architecture -> Database`

但在以下环节仍有断点：

1. Backend 未完全服从第二版 Product/Database
2. Frontend 尚未完整消费动态参数模型
3. Search/AI 边界没有冻结
4. MVP 范围没有定义

### 1.3 命名与术语漂移

主要表现为：

- `Demand` / `Requirement`
- `RFQ` / `Inquiry`
- `Organization` / `Supplier`
- `Knowledge` / `News & CMS`
- `Offer` / 供应商产品

### 1.4 技术栈口径不一致

当前至少存在：

- `Next.js + NestJS`
- `NestJS + Vue3 + 微信小程序`
- `Hono`

这会直接影响后续 AI 开发行为。

### 1.5 设计深度不平衡

数据库第二版非常深，但 MVP、供应商后台前端、RFQ 前端、部署拓扑等关键“交付面”反而不够统一。

---

## 2. 优化原则

### 原则 01：先收敛，再扩写

Blueprint v1.0 的目标不是继续增加文档数量，而是先确定正式基线。

### 原则 02：Single Source of Truth

每个层级只允许一个正式来源：

- Business 一套
- Product 一套
- Architecture 一套
- Database 一套
- Backend 一套
- Frontend 一套

### 原则 03：分层闭环优先

优化顺序必须服从：

`Business -> Product -> Architecture -> Database -> Backend -> Frontend -> Quality -> Operations`

### 原则 04：MVP 与最终平台分层表达

最终平台能力可以保留，但必须明确：

- 哪些是 MVP
- 哪些是 Phase 2
- 哪些是长期能力

### 原则 05：禁止孤立新增设计

任何新增或优化建议，都必须回答：

1. 当前文档是否已有设计
2. 是否完整
3. 应放在哪个模块
4. 会影响哪些模块
5. 需要同步哪些设计文件

### 原则 06：工程可迁移性优先

部署、存储、数据库迁移、通知、AI 集成都应以 Provider-neutral 为原则，而不是写死某家云。

---

## 3. 最终目录建议

本阶段不执行调整，只给出 v1.0 建议目录逻辑。

### 3.1 建议保留为正式 Blueprint 主链

| 层级 | 建议作为 v1.0 基线的来源 |
| --- | --- |
| Business | `100_Business/*` |
| Product | `200_Product-第二版(RP-)/*` |
| Architecture | `300_Architecture-第二版（增加文件）/*` |
| Database | `400_Database-第二版/*` |
| Backend | `500_Backend/*`，但需先完成术语与模型校正 |
| Frontend | `600_Frontend/*`，但需补供应商/RFQ/动态参数契约 |
| Quality | `700_Quality_Assurance/*` |
| Operations | `800_Operations/*` |
| Project | `900_Project_Management/*` |

### 3.2 建议转为“参考/归档”的来源

| 目录 | 建议定位 |
| --- | --- |
| `200_Product-第一版` | 历史参考，不再作为正式设计源 |
| `400_Database` | 历史参考与实现附件，不再作为正式数据库基线 |
| `400_Database/database/*` | 实现附录或工程样例，不作为 Blueprint 主来源 |
| `399_CanonicalNamingSpecification-第二版（增加-说明）.md` | 解释性桥接文档，可转附录 |

### 3.3 根目录文档建议定位

| 文件 | 建议定位 |
| --- | --- |
| `Readme.md` | Blueprint 根导航与说明 |
| `DOCUMENT_INDEX.md` | v1.0 正式索引，需要与真实目录同步 |
| 总 Blueprint DOCX | 顶层设计宣言；保留，但不应继续独占最高优先级而不与细化文档同步 |

---

## 4. 文件合并建议

### 合并建议 01：Product 以第二版为主

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 将 Product 正式基线收敛到 `200_Product-第二版(RP-)` | 已有 | 基本完整 | `200_Product` | Architecture / Database / Backend / Frontend | 200 全套、205、206、203、相关引用文档 |

### 合并建议 02：Database 以第二版为主

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 将 Database 正式基线收敛到 `400_Database-第二版` | 已有 | 基本完整 | `400_Database` | Backend / Operations / Quality | 401~408 第二版、500、700、800 |

### 合并建议 03：399 保留规范正文，说明页转附录

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 保留 Canonical Naming Specification 正文，说明页转附录 | 已有 | 可收敛 | `300_Architecture` | Database / Backend / Frontend | 399 正文、399 说明、所有命名引用页 |

### 合并建议 04：部署设计保留多文档，但增加总决议页

部署不是单页能承接的主题，不建议强行把 508/609/801 合并成一个大文件。  
建议保留多文档分层，但新增“部署与迁移总决议页”作为唯一顶层原则来源。

---

## 5. 第二版文件处理建议

### 5.1 Product 第二版

建议处理为：

1. `200_Product-第二版(RP-)` 作为正式主源
2. `200_Product-第一版` 转历史参考
3. 在正式索引中明确“不再作为 Blueprint 主来源”

### 5.2 Architecture 第二版

建议处理为：

1. `300_Architecture-第二版（增加文件）` 作为正式主源
2. 399 作为跨层桥接文档保留
3. 后续把 Search/AI 边界、Product-DB-API-UI 映射一并纳入该层

### 5.3 Database 第二版

建议处理为：

1. 401/402/403/404/405/406/407/408 保留为正式数据库链
2. 同号多版本文件需要在 v1.0 阶段选出唯一正式文件名
3. 原版 `400_Database` 仅留作历史和实现补充

### 5.4 Backend / Frontend

这两层不是“版本过多”，而是“未与第二版上游完全对齐”。  
第二阶段应优先做一致性修正，而不是继续扩页。

---

## 6. 需要新增设计文件

本阶段不创建正式 Blueprint 文件，只提出新增建议。

### 新增建议 01：Product/Database/API/UI 映射页

建议文件：

`300_Architecture/315_Product_Database_API_UI_Mapping.md`

用途：

- 把第二版 Product 主对象逐项映射到 DB、API、Frontend
- 成为 AI 开发读取入口之一

### 新增建议 02：Search 与 AI 边界页

建议文件：

`300_Architecture/316_Search_AI_Boundary.md`

用途：

- 明确 Search 和 AI 各自职责
- 明确 PostgreSQL FTS / pg_trgm / pgvector 的使用分层

### 新增建议 03：部署与云迁移基线页

建议文件：

`300_Architecture/317_Deployment_Provider_Abstraction.md`

用途：

- 明确 Provider-neutral 原则
- 连接 Backend / Database / Operations

### 新增建议 04：MVP 范围与阶段页

建议文件：

`100_Business/108_MVP_Scope_and_Phases.md`

或

`900_Project_Management/906_MVP_Execution_Baseline.md`

用途：

- 定义 Phase 1 / Phase 2 / Phase 3
- 决定哪些能力先做、哪些预留

### 新增建议 05：Supplier/RFQ 前端闭环页

建议文件：

`600_Frontend/610_Supplier_RFQ_Responsive_Strategy.md`

用途：

- 补足供应商后台、RFQ、通知、移动端状态页的统一策略

---

## 7. Product / Database / Backend / Frontend 一致性调整方案

### 7.1 Product

需要进一步冻结的关键原则：

1. `Standard Product` 归平台
2. `Offer` 归组织
3. 所有业务通过 Product ID 引用标准产品
4. 参数体系采用模板化元数据引擎

### 7.2 Database

建议保留第二版数据库主干，并强化以下原则：

1. 强结构主数据 + 受控动态参数
2. File / Workflow / Dictionary / Search / AI 作为跨域基础设施
3. Search 与 AI 表结构边界明确
4. 迁移策略优先标准 PostgreSQL

### 7.3 Backend

Backend 第二阶段必须完成以下对齐：

1. 术语从 `Supplier/Requirement/Inquiry` 收敛到 `Organization/Demand/RFQ`
2. `Product Service` 改为标准产品服务，而不是供应商自建产品服务
3. `Offer Service`、`RFQ Service`、`Notification Service` 需要显式进入主链
4. 技术栈口径与 Blueprint 总基线统一

### 7.4 Frontend

Frontend 第二阶段必须完成以下对齐：

1. 单代码库响应式策略正式化
2. 动态参数元数据驱动 UI 正式化
3. 供应商后台 / Offer / RFQ / 通知流程补齐
4. 移动端状态页、消息、RFQ 响应路径补齐

---

## 8. 推荐处理顺序

### Phase A：基线收敛

1. 选定正式 Blueprint v1.0 来源
2. 更新 `DOCUMENT_INDEX.md`
3. 明确历史参考目录

### Phase B：冲突消解

1. 统一术语
2. 统一技术栈
3. 统一 Product 归属与 Offer 边界
4. 统一 Search / AI 边界

### Phase C：跨层桥接

1. 建立 Product -> DB -> API -> UI 映射
2. 建立部署迁移总决议
3. 建立 MVP 范围与阶段定义

### Phase D：执行性增强

1. 调整 Backend 文档
2. 调整 Frontend 文档
3. 更新 README 与索引

---

## 9. 最终建议

VISNDT Blueprint v1.0 的优化方向，不应理解为“再写更多文档”，而应理解为：

1. 把已经成熟的第二版 Product / Architecture / Database 固化为正式主干
2. 用少量关键桥接文档消解 Backend / Frontend / Deployment / MVP 的断点
3. 让 AI 在读取 Blueprint 时，不再面对多套并行答案

因此本优化计划的核心不是“重构目录”，而是：

**先建立唯一基线，再做有限合并，再做一致性修正。**
