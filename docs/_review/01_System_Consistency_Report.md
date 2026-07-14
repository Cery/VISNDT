# 01 System Consistency Report

审查阶段：Blueprint Architecture Review Phase  
输出目标：VISNDT Blueprint v1.0 分析基线  
审查原则：只分析，不修改正式 Blueprint 文档

---

## 0. 审查范围与方法

本次审查覆盖 `docs/VISNDT-Blueprint` 下全部 `.md`、`.txt`、`.docx` 文件，共 **115** 个文件，未跳过任何正式文档或补充说明。

按目录统计如下：

| 目录 | 文件数 |
| --- | ---: |
| `100_Business` | 8 |
| `200_Product-第二版(RP-)` | 9 |
| `200_Product-第一版` | 12 |
| `300_Architecture-第二版（增加文件）` | 17 |
| `400_Database` | 15 |
| `400_Database-第二版` | 13 |
| `500_Backend` | 8 |
| `600_Frontend` | 9 |
| `700_Quality_Assurance` | 7 |
| `800_Operations` | 6 |
| `900_Project_Management` | 5 |
| Blueprint 根目录与数据库附属说明 | 6 |

审查结论采用“系统闭环优先”标准，而不是按单篇文档自洽程度判断。

---

## 1. VISNDT 整体业务理解

从 `100_Business`、`200_Product-第二版(RP-)`、总 Blueprint DOCX、`300_Architecture-第二版（增加文件）` 的交叉信息看，VISNDT 的业务定位已经比较清晰：

1. VISNDT 不是传统电商，不直接承担支付、物流、合同履约。
2. VISNDT 也不是单一企业官网，而是面向工业检测/NDT 行业的专业信息与撮合平台。
3. 平台核心业务闭环是：

`标准产品/知识资产 -> 搜索与筛选 -> 需求发布 -> 供应商响应 -> RFQ -> 线下成交`

4. 平台的核心资产不是“SKU 商品”，而是：
   - 标准产品主数据
   - 参数体系
   - 知识内容
   - 需求与 RFQ 过程数据
5. 平台未来希望覆盖多类 NDT 设备，而不只局限于工业内窥镜。

这一层的业务目标总体成立，但“首发范围”和“分阶段交付策略”尚未冻结。

---

## 2. 当前模块划分

### 2.1 现状

当前文档实际上存在四种并行结构：

1. **总纲结构**
   - 根目录 `Readme.md`
   - `DOCUMENT_INDEX.md`
   - `VISNDT Repository Documentation Edition 2.0 VISNDT 蓝图设计说明（Blueprint）.docx`

2. **正式业务链路文档**
   - `100_Business`
   - `500_Backend`
   - `600_Frontend`
   - `700_Quality_Assurance`
   - `800_Operations`
   - `900_Project_Management`

3. **产品/架构/数据库第二版替代文档**
   - `200_Product-第二版(RP-)`
   - `300_Architecture-第二版（增加文件）`
   - `400_Database-第二版`

4. **历史版或实现说明**
   - `200_Product-第一版`
   - `400_Database`
   - `400_Database/database/*`

### 2.2 结构问题

当前模块划分最大的问题不是“内容太少”，而是“版本太多、来源不唯一”：

1. `DOCUMENT_INDEX.md` 描述的是一套更大的目标目录，但与当前真实目录不一致。
2. `200_Product-第一版` 与 `200_Product-第二版(RP-)` 同时存在，且都带有冻结语义。
3. `400_Database` 与 `400_Database-第二版` 同时存在，且第二版又内部存在 `In Progress`、`Final`、`增补版` 混用。
4. `500_Backend` 与 `600_Frontend` 的模块命名和业务术语并未完全跟随 Product/Architecture/Database 第二版统一。

结论：**当前文档库具备足够多的设计内容，但尚不具备唯一版本、唯一设计来源的基线能力。**

---

## 3. 模块依赖关系

按业务正确方向，VISNDT 应采用如下依赖链：

`Business -> Product -> Architecture -> Database -> Backend/API -> Frontend -> Quality -> Operations -> Project`

结合现有文档，推荐把依赖关系固化为：

1. `100_Business`  
   定义平台定位、角色、业务流、Demand/RFQ 闭环。

2. `200_Product-第二版(RP-)`  
   定义标准产品、参数模板、能力/功能、关系模型、工作流。

3. `300_Architecture-第二版（增加文件）`  
   定义中心划分、DDD、依赖方向、命名规范。

4. `400_Database-第二版`  
   定义 ER、表规范、DDL 规范、Prisma、迁移、安全。

5. `500_Backend`  
   应消费上游规范，形成统一 API、认证、服务、部署规则。

6. `600_Frontend`  
   应消费 Product/API/Workflow，而不是自行重新发明业务对象。

7. `700_Quality_Assurance`  
   应覆盖前后端与数据库闭环验证。

8. `800_Operations`  
   应承接环境、部署、监控、备份、恢复。

9. `900_Project_Management`  
   应作为治理和变更控制层，而不是业务设计来源。

---

## 4. Business -> Product -> Architecture -> Database -> Frontend/Backend 链路检查

| 链路 | 状态 | 结论 |
| --- | --- | --- |
| Business -> Product | 部分一致 | 平台定位、需求/RFQ 逻辑基本一致，但 MVP 边界未定义。 |
| Product -> Architecture | 基本一致 | Product Center/Offer Center/Workflow/Search/AI 的大框架成立。 |
| Product -> Database | 基本一致 | 第二版参数模型、标准产品模型、文件域、AI/搜索域已有较强映射。 |
| Database -> Backend | 明显不一致 | Backend 术语、技术栈、模块归属与第二版 Product/DB 存在多处冲突。 |
| Backend -> Frontend | 部分一致 | 页面结构与产品/需求链路大致吻合，但供应商后台、RFQ、Offer 管理前端闭环不足。 |
| Frontend -> Quality | 基本一致 | 响应式、功能测试、UAT、发布检查已覆盖。 |
| Quality -> Operations | 基本一致 | 发布、备份、监控、恢复链路具备基础框架。 |

### 总体判断

**Business -> Product -> Architecture -> Database** 已接近形成主干。  
**Backend/Frontend** 还没有完全服从这条主干，因此目前尚不能作为 AI 开发的唯一设计基线。

---

## 5. 当前设计冲突

### 冲突 01：唯一设计来源冲突

- `200_Product-第一版` 与 `200_Product-第二版(RP-)` 并存
- `400_Database` 与 `400_Database-第二版` 并存
- `DOCUMENT_INDEX.md` 与真实目录不一致
- 根 DOCX 声称“最高优先级”，但很多第二版细化内容没有在总纲中同步

影响：AI 工具无法判断应优先读取哪一组文档。

### 冲突 02：技术栈冲突

当前至少出现三套技术栈口径：

1. 总纲 DOCX：`Next.js + NestJS + PostgreSQL + Redis + Prisma`
2. `200_Product-第二版(RP-)/207_ProductEngineeringSpecification.md`：`PostgreSQL + Prisma + NestJS + OpenAPI + Vue3 + 微信小程序 + AI`
3. `500_Backend/501_Backend_Architecture.md`：后端框架写成 `Hono`

影响：Architecture / Database / Backend / Frontend 无法形成唯一实现约束。

### 冲突 03：产品归属冲突

第二版 Product 与 Database 已明确：

- `Standard Product` 属于平台
- 供应商通过 `Offer` 引用标准产品

但 `500_Backend/505_Backend_Business_Service.md` 仍存在：

- `Supplier 1 -> N Product`
- 供应商创建产品、编辑产品、发布产品的叙述

影响：这是当前最关键的业务一致性冲突之一，会直接冲击 DB、API、权限、前端页面设计。

### 冲突 04：术语冲突

同一业务对象存在并行命名：

- `Demand` / `Requirement`
- `RFQ` / `Inquiry`
- `Organization` / `Supplier`
- `Knowledge` / `News & CMS`
- `Offer` / `Product for supplier`

影响：命名规范 399 已存在，但 Backend/Frontend 尚未全面服从。

### 冲突 05：Search 与 AI 边界冲突

当前文档中出现如下交叉：

- `310_SearchCenter.md` 把 “AI 语义搜索” 放入 Search
- `311_AICenter.md` 把 Embedding/RAG/推荐放入 AI
- `400_Database/409_SearchSchema.md` 又包含 `AI Embedding`、`Vector Index`
- `400_Database/410_AISchema.md` 继续定义向量/推荐/Agent 相关对象

影响：Search 索引层与 AI 推理层边界不清，容易导致重复建模和重复实现。

### 冲突 06：版本状态冲突

同一层文档混用：

- `Frozen`
- `Final`
- `In Progress`
- `Validated`
- `Draft`

影响：无法判断哪些文档可以作为冻结基线，哪些只是过程文稿。

### 冲突 07：环境模型冲突

文档里同时存在：

- `Development / Testing / Production`
- `Development / Testing / Staging / Production`
- 以及总纲层面绑定 `Cloudflare / Coolify / Hetzner`

影响：部署目标和环境抽象层尚未统一。

### 冲突 08：MVP 策略冲突

总 Blueprint DOCX 写明：

- “本 Repository 不再区分 MVP 架构”
- “数据库与架构一次设计完成”

这与当前审查目标要求的 MVP 阶段定义直接冲突。

---

## 6. 重复设计

### 6.1 明显重复

1. 产品体系：
   - `200_Product-第一版/*`
   - `200_Product-第二版(RP-)/*`

2. 数据库体系：
   - `400_Database/*`
   - `400_Database-第二版/*`

3. 命名桥接文档：
   - `399_CanonicalNamingSpecification-第二版（增加）.md`
   - `399_CanonicalNamingSpecification-第二版（增加-说明）.md`

4. 部署/环境设计：
   - `500_Backend/508_Backend_Deployment.md`
   - `600_Frontend/609_Frontend_Deployment_UI.md`
   - `800_Operations/801_Deployment_Operation.md`
   - `700_Quality_Assurance/707_Release_Checklist.md`

### 6.2 隐性重复

1. Search、AI、Notification、File Storage 在 Architecture / Database / Backend / Operations 多处重复描述。
2. 响应式设计在 Frontend / Quality 中多次出现，但缺少统一“单代码库响应式策略”总决议。
3. 配置管理在 Backend / Deployment / Operations / Security 多次出现，但没有统一 Provider-neutral 标准页。

---

## 7. 缺失设计

### 缺失 01：唯一基线选择规则

当前缺少一个明确声明：

- 哪些目录是当前 Blueprint v1.0 的正式来源
- 哪些目录只是历史参考
- 哪些“第二版说明”“增补版”“验证报告”只是工程辅助文档

### 缺失 02：Product -> Database -> API -> Frontend 映射基线

虽然 Product v2 和 Database v2 已经很接近，但缺少一份跨层映射总表，导致 Backend/Frontend 仍然按旧术语写作。

### 缺失 03：Search 与 AI 的统一边界决议

当前没有一页明确声明：

- Search 负责什么
- AI 负责什么
- 全文索引、向量检索、推荐、问答如何分层

### 缺失 04：云厂商解耦总决议

当前已有 `Storage Provider`、`Adapter`、`S3 Compatible Storage` 等能力，但缺少顶层部署决议页，无法把“当前免费测试环境”与“未来国内商用云”串成一条迁移路径。

### 缺失 05：MVP 目标、范围、延后清单

目前最重要的缺项之一。  
没有 MVP，就无法判断哪些中心现在必须做，哪些只需要保留接口。

### 缺失 06：供应商后台与 RFQ 前端闭环

`600_Frontend` 目前重点覆盖：

- Public Pages
- Product Center
- Requirement Center

但供应商后台、Offer 管理、RFQ 处理、通知中心、移动端后台流程没有形成完整 UI 基线。

---

## 8. 需要优化的位置

### 优先级 P0：先解决“唯一来源”问题

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 选择 Blueprint v1.0 正式基线目录 | 部分已有 | 不完整 | `900_Project_Management` + 根目录说明 | 全部模块 | `Readme.md`、`DOCUMENT_INDEX.md`、全部版本说明 |

### 优先级 P1：统一业务对象和技术栈

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 统一 `Standard Product / Offer / Organization / Demand / RFQ` 术语 | 已有 | 不完整 | `300_Architecture` | `400_Database`、`500_Backend`、`600_Frontend` | 399、505、502、606、607 |
| 统一最终技术栈口径 | 已有 | 冲突 | 根 Blueprint + `300_Architecture` | `500_Backend`、`600_Frontend`、`1300_Development`（规划层） | 总 DOCX、207、501、相关说明文档 |

### 优先级 P1：补齐跨层映射

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 建立 Product -> Database -> API -> Frontend 映射总表 | 部分已有 | 不完整 | `300_Architecture` / `200_Product` 与 `400_Database` 桥接 | `500_Backend`、`600_Frontend` | Product v2、Database v2、API 设计、UI 文档 |

### 优先级 P1：明确 Search/AI 边界

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 将 Search 与 AI 责任边界写成单独决议 | 部分已有 | 不完整 | `300_Architecture` | `400_Database`、`500_Backend`、`600_Frontend` | 310、311、409、410、505 |

### 优先级 P1：定义 MVP

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 明确 Phase 1 MVP / Phase 2 / Phase 3 | 当前基本缺失，且总纲有反向表述 | 不完整 | `100_Business` + `200_Product` + `300_Architecture` + `900_Project_Management` | 全部模块 | 总 DOCX、项目治理、产品蓝图、架构蓝图 |

### 优先级 P2：统一部署迁移策略

| 建议 | 当前是否已有设计 | 是否完整 | 建议归属模块 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- | --- |
| 建立 Provider-neutral Deployment Baseline | 部分已有 | 不完整 | `300_Architecture` + `500_Backend` + `800_Operations` | `400_Database`、`600_Frontend` | 501、508、609、801、407、总 DOCX |

---

## 9. 总结

当前 VISNDT 文档库已经具备形成 Blueprint v1.0 的材料基础，尤其是：

- 业务定位明确
- Product v2 与 Database v2 质量较高
- Quality 与 Operations 覆盖较完整

但还没有形成一个真正可供 Trae / ChatGPT 直接消费的“唯一版本、唯一来源、跨层一致”的系统基线。

当前最关键的结论不是“缺文档”，而是：

1. **缺唯一基线选择**
2. **缺 MVP 决议**
3. **缺 Product/Database/API/Frontend 一致性桥接**
4. **Backend/Frontend 仍受旧术语和旧归属模型影响**
5. **Search/AI、部署/迁移、移动端策略仍未上升为统一决策**

因此，VISNDT Blueprint v1.0 的下一步不应继续无约束增写，而应先完成：

- 基线收敛
- 冲突消解
- 分层闭环确认
- 再进入文档合并与正式优化阶段
