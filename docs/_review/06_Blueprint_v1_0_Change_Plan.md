# 06 Blueprint v1.0 Change Plan

文档定位：  
本文件是 **第三轮执行前的变更清单（Change Plan）**。  
本轮目标不是立即修改全部正式 Blueprint，而是先冻结：

- 改哪些文件
- 不改哪些文件
- 为什么改
- 按什么顺序改
- 哪些事项需要先确认

本文件属于：`Analysis Reference`  
不是正式 Blueprint。

---

## 1. 当前轮执行结论

根据最新执行指令，当前最稳妥的推进方式是：

`先生成 Change Plan -> 人工确认 -> 再执行正式文档收敛`

因此本轮：

1. **不直接修改正式 Blueprint 主文档**
2. **不删除文件**
3. **不移动目录**
4. **不重命名大量文件**
5. **只产出 Blueprint v1.0 收敛执行清单**

---

## 2. 收敛执行总策略

严格按以下顺序推进：

1. Freeze Source
2. Update Index
3. Add Bridge Documents
4. Align Backend
5. Align Frontend
6. Define MVP
7. Freeze Deployment
8. Freeze Tech Stack
9. Validate AI Readiness

本 Change Plan 将逐项映射到具体文件。

---

## 3. 哪些文件不动

## 3.1 作为历史参考保留，不作为开发依据

以下目录本轮 **不删除、不批量改写**，只在导航层标记为 Historical Reference：

1. `docs/VISNDT-Blueprint/200_Product-第一版/`
2. `docs/VISNDT-Blueprint/400_Database/`

原因：

- 它们仍有历史价值
- 但不应继续作为 AI / 工程开发的正式依据
- 当前最小扰动方案是通过根导航与索引层收敛，而不是逐文件重写

## 3.2 暂不直接修改的历史总纲

以下文件本轮建议 **默认不改**，除非你明确要求同步：

1. `VISNDT Repository Documentation Edition 2.0 VISNDT 蓝图设计说明（Blueprint）.docx`

原因：

- DOCX 是历史总纲，不适合作为 v1.0 的唯一入口
- 正式收敛应优先通过 `Readme.md`、`DOCUMENT_INDEX.md` 和桥接文档实现

---

## 4. 哪些文件要改

## 4.1 Phase 1：Freeze Source

### 必改文件

1. `docs/VISNDT-Blueprint/Readme.md`
2. `docs/VISNDT-Blueprint/DOCUMENT_INDEX.md`

### 改动目标

1. 明确声明：
   - `Current Version: VISNDT Blueprint v1.0`
   - `Single Source of Truth`
2. 明确正式来源：
   - Business: `100_Business`
   - Product: `200_Product-第二版(RP-)`
   - Architecture: `300_Architecture-第二版（增加文件）`
   - Database: `400_Database-第二版`
   - Backend: `500_Backend`
   - Frontend: `600_Frontend`
   - Quality: `700_Quality_Assurance`
   - Operations: `800_Operations`
   - Project Management: `900_Project_Management`
3. 明确历史参考：
   - `200_Product-第一版`
   - `400_Database`

### 本阶段不改文件

1. `200_Product-第一版/*`
2. `400_Database/*`

处理方式：

- 仅在根导航层降级为 Historical Reference

---

## 4.2 Phase 2：Update Index

### 必改文件

1. `docs/VISNDT-Blueprint/DOCUMENT_INDEX.md`

### 建议同步修改文件

1. `docs/VISNDT-Blueprint/900_Project_Management/905_Documentation_Management.md`

### 改动目标

1. 让索引与真实目录一致
2. 去掉当前不存在的目标目录幻象
3. 把第二版正式来源、历史来源、桥接文件、技术栈决策文件纳入索引
4. 明确 AI 初次读取顺序

### 现有冲突

当前 `DOCUMENT_INDEX.md` 仍然描述：

- `500_API`
- `700_Frontend`
- `800_AI`
- `900_Deployment`
- `1300_Development`

但这些并不是当前真实目录结构。

---

## 4.3 Phase 3：Add Bridge Documents

## 4.3.1 编号冲突先处理

用户最新指令中的新文件编号与现有目录存在冲突：

1. `300_Architecture` 中已存在 `301~314`
2. `100_Business` 中 `304_MVP_Scope_and_Phase.md` 不符合该目录编号体系

因此建议采用 **最小扰动编号方案**：

### Architecture 新增文件

1. `315_Product_Database_API_UI_Mapping.md`
2. `316_Search_AI_Boundary.md`
3. `317_Deployment_Provider_Abstraction.md`

### Business 新增文件

4. `108_MVP_Scope_and_Phase.md`

### 根目录新增文件

5. `TECH_STACK_DECISION.md`

## 4.3.2 必新增文件与内容

### A. `300_Architecture-第二版（增加文件）/315_Product_Database_API_UI_Mapping.md`

必须包含：

1. `Standard Product -> standard_product -> Product API -> Product Detail UI`
2. `Parameter Definition -> parameter_definition`
3. `Parameter Template -> parameter_template`
4. `Product Parameter Value -> product_parameter_value -> Dynamic UI Rendering`
5. `Offer -> offer -> Offer API -> Supplier UI`
6. `Demand -> RFQ -> Workflow -> Notification -> Frontend State`

### B. `300_Architecture-第二版（增加文件）/316_Search_AI_Boundary.md`

必须冻结：

#### Search

- 产品搜索
- 参数过滤
- 分类搜索
- RFQ 搜索
- 全文检索

MVP 技术：

- PostgreSQL FTS
- `pg_trgm`

#### AI

- 语义理解
- 推荐
- RAG
- 知识问答
- Embedding

Phase 2 技术：

- `pgvector`

明确禁止：

- MVP 引入 Elasticsearch

### C. `300_Architecture-第二版（增加文件）/317_Deployment_Provider_Abstraction.md`

必须定义：

1. Provider Neutral Principle
2. Database: Standard PostgreSQL
3. File Storage: S3 Compatible Storage
4. Deployment: Container Based
5. Configuration: Environment Driven

### D. `100_Business/108_MVP_Scope_and_Phase.md`

必须冻结：

#### Phase 1 MVP

- Product Center
- Organization
- Offer
- Demand
- RFQ
- Search
- Notification

#### Phase 2

- AI Search
- Recommendation
- Knowledge Enhancement
- Advanced Workflow

#### Phase 3

- RAG
- Knowledge Graph
- AI Agent
- Ecosystem API

### E. `docs/VISNDT-Blueprint/TECH_STACK_DECISION.md`

建议作为正式技术栈决策页。

---

## 4.4 Phase 4：Backend 一致性修正

## 4.4.1 必改文件

1. `500_Backend/501_Backend_Architecture.md`
2. `500_Backend/502_API_Design_Specification.md`
3. `500_Backend/503_OpenAPI_Specification.md`
4. `500_Backend/504_Authentication_And_Authorization.md`
5. `500_Backend/505_Backend_Business_Service.md`
6. `500_Backend/506_Error_Code_Specification.md`
7. `500_Backend/507_Backend_Testing.md`
8. `500_Backend/508_Backend_Deployment.md`

## 4.4.2 统一目标

旧术语统一为：

- `Supplier` -> `Organization`
- `Requirement` -> `Demand`
- `Inquiry` -> `RFQ`
- `Product owned by supplier` -> `Standard Product + Offer`

## 4.4.3 关键修正点

### `501_Backend_Architecture.md`

修正：

1. 服务边界
2. 技术栈口径
3. 模块划分
4. 旧 `Supplier/Requirement` 模块命名

最终应统一为：

- Identity Service
- Organization Service
- Product Service
- Offer Service
- Demand Service
- RFQ Service
- Workflow Service
- Search Service
- Notification Service
- File Service

### `502_API_Design_Specification.md`

修正：

1. API 资源命名
2. 路由命名
3. Demand / RFQ / Offer 资源边界
4. Product 与 Offer 的 API 职责划分

### `503_OpenAPI_Specification.md`

修正：

1. `Suppliers` -> `Organizations`
2. `Requirements` -> `Demands`
3. `Inquiry` -> `RFQ`
4. 删除“供应商创建产品”式接口表达
5. 增补标准产品、参数模板、Offer、RFQ 的资源定义

### `504_Authentication_And_Authorization.md`

修正：

1. 角色命名：`Supplier Manager/Staff` 向 `Organization Manager/Staff` 收敛
2. 权限对象：`Supplier.*` / `Requirement.*` / `Inquiry.*` 改为新命名体系

### `505_Backend_Business_Service.md`

这是 Backend 收敛的核心文件，必须重点修正：

1. `Supplier Service` -> `Organization Service`
2. `Requirement Service` -> `Demand Service`
3. `Inquiry & Matching Service` -> `RFQ Service + Matching Logic`
4. 删除“Supplier Product Management”作为主模型的表述
5. 改为：
   - Platform manages Standard Product
   - Organization creates Offer

### `506_Error_Code_Specification.md`

修正：

1. 模块代码前缀
2. 错误码归属
3. `SUPPLIER_* / REQUIREMENT_* / INQUIRY_*` 收敛为新命名体系

### `507_Backend_Testing.md`

修正：

1. 测试对象命名
2. 集成流转从 `Supplier + Product + Requirement` 改为：
   - Organization + Offer
   - Demand + RFQ
   - Notification + Workflow

### `508_Backend_Deployment.md`

修正：

1. Deployment Unit
2. 环境定义
3. Demand / RFQ / Organization 新命名
4. Provider-neutral 部署原则引用

---

## 4.5 Phase 5：Frontend 一致性修正

## 4.5.1 必改文件

1. `600_Frontend/601_Frontend_Architecture.md`
2. `600_Frontend/602_Page_Information_Architecture.md`
3. `600_Frontend/603_Component_Design_System.md`
4. `600_Frontend/604_State_Management.md`
5. `600_Frontend/605_API_Integration.md`
6. `600_Frontend/606_Product_Center_UI.md`
7. `600_Frontend/607_Requirement_Center_UI.md`
8. `600_Frontend/608_Public_Page_UI.md`
9. `600_Frontend/609_Frontend_Deployment_UI.md`

## 4.5.2 建议新增文件

1. `600_Frontend/610_Supplier_Workflow_UI.md`

用途：

- Supplier Dashboard
- Offer Management
- RFQ Inbox
- Response Management
- Notification Center
- 响应式移动端策略

## 4.5.3 关键修正点

### 统一术语

- `Requirement` -> `Demand`
- `Supplier` 页面语义与数据对象收敛到 `Organization` / `Offer`

### 统一前端业务闭环

Public Side 必须明确：

- Home
- Product Center
- Knowledge
- Search
- Demand Entry

Supplier Side 必须补齐：

- Supplier Dashboard
- Offer Management
- RFQ Inbox
- Response Management
- Notification Center

### Dynamic Parameter UI

当前多个前端文档仍写死：

- Diameter
- Length
- Resolution

必须改为：

`Parameter Template -> Frontend Renderer -> Dynamic Form / Dynamic Parameter Table / Dynamic Filter`

### Mobile Strategy

必须冻结：

- 单代码库
- Responsive Web

禁止：

- 独立 PC 项目
- 独立 Mobile 项目
- 双维护

## 4.5.4 文件级处理建议

### `601_Frontend_Architecture.md`

补齐：

- Public Side / Supplier Side 总体结构
- Dynamic Parameter UI 总体策略
- 响应式单代码库策略

### `602_Page_Information_Architecture.md`

重排页面信息架构：

- Public Pages
- Supplier Pages
- Demand / RFQ / Notification 状态页

### `603_Component_Design_System.md`

将固定字段组件改为：

- ParameterRenderer
- ParameterGroupBlock
- DynamicFilterPanel
- DynamicDemandForm

### `604_State_Management.md`

增加：

- Organization / Offer / RFQ / Notification 状态切片
- Dynamic Parameter Meta + Value 状态模型

### `605_API_Integration.md`

对齐：

- Product API
- Parameter Metadata API
- Offer API
- Demand API
- RFQ API
- Notification API

### `606_Product_Center_UI.md`

改动重点：

1. Product Detail 消费标准产品模型
2. Offer 作为供应侧展示
3. 参数渲染改为元数据驱动
4. Demand 转化入口保留，但不再依赖写死参数字段

### `607_Requirement_Center_UI.md`

改动重点：

1. 文档名称与内容向 Demand 语义收敛
2. 表单改为动态参数驱动
3. 增加 RFQ 状态与通知视图

### `608_Public_Page_UI.md`

调整：

1. Requirement CTA 改为 Demand Entry 语义
2. 保留转化逻辑，但统一命名

### `609_Frontend_Deployment_UI.md`

对齐：

1. 环境模型
2. Provider-neutral 部署原则
3. 响应式 Web 的发布策略

---

## 4.6 Phase 6：Database MVP 分层

用户要求：

- 不推翻 `400_Database-第二版`
- 但要增加 Implementation Priority

### 建议做法

不改 ER、表结构主设计，不重构 DB v2；  
新增一个分层实现优先级文档。

### 建议新增文件

1. `400_Database-第二版/409_Implementation_Priority.md`

### 必须包含

#### MVP 直接实现

- Identity
- Organization
- Product
- Parameter
- Offer
- Demand
- RFQ
- Workflow Basic
- File
- Notification

#### Phase 2 延后

- Embedding
- Vector
- Recommendation
- Advanced Statistics

#### Phase 3 预留

- Knowledge Graph
- Agent
- Advanced AI

### 建议同步修改文件

1. `400_Database-第二版/406_Seed_Data_Specification.md`
2. `400_Database-第二版/407_Migration_Strategy.md`

同步目的：

- 让实现优先级与 Seed / Migration 的执行顺序一致

### 本阶段不改文件

1. `401_PostgreSQL_ER_Model.md`
2. `402_PostgreSQL_Table_Specification*.md`
3. `403_PostgreSQL_DDL_Specification*.md`
4. `404_Prisma_Schema*.md`
5. `405_prisma.schema-第二版全新.md`

原因：

- 当前目标是分层实施，而不是重新设计数据库

---

## 4.7 Phase 7：Deployment 基线

### 必改文件

1. `300_Architecture-第二版（增加文件）/317_Deployment_Provider_Abstraction.md`（新增）
2. `500_Backend/508_Backend_Deployment.md`
3. `600_Frontend/609_Frontend_Deployment_UI.md`
4. `800_Operations/801_Deployment_Operation.md`

### 建议同步修改文件

1. `800_Operations/802_Monitoring_Operation.md`
2. `800_Operations/803_Backup_Recovery.md`

### 必须冻结的结论

#### Environment

- Development
- Testing
- Production
- Staging：Optional

#### Deployment Unit

- Frontend
- Backend API
- Worker
- PostgreSQL
- Object Storage

#### Migration Requirement

Testing 允许：

- Render
- Supabase PostgreSQL

Production 允许：

- 国内云服务器
- PostgreSQL
- OSS / COS / S3 Compatible Storage

要求：

- 代码无需重构

---

## 4.8 Phase 8：技术栈冻结

这是正式执行前唯一必须先锁定的关键决策之一。

### 必新增文件

1. `docs/VISNDT-Blueprint/TECH_STACK_DECISION.md`

### 建议在该文件中冻结的唯一组合

#### Frontend

- `Next.js`

#### Backend

- `NestJS`

#### Database

- `PostgreSQL`

#### ORM

- `Prisma`

#### Deployment

- `Container Based`

#### Storage

- `S3 Compatible Storage`

#### Search

- MVP：`PostgreSQL FTS + pg_trgm`

#### AI

- Phase 2：`pgvector`

### 选择理由

1. `399_CanonicalNamingSpecification` 已明确面向 `NestJS`
2. Product/Database 第二版大量围绕 `PostgreSQL + Prisma + NestJS`
3. 总 Blueprint 与 Development 索引历史上也更偏 `Next.js + NestJS`
4. `Hono` 仅出现在 `501_Backend_Architecture.md`，属于局部冲突而非主链共识
5. `Vue3` 主要出现在产品工程说明，不足以推翻现有跨层主干

### 需要同步修改的文件

1. `Readme.md`
2. `DOCUMENT_INDEX.md`
3. `500_Backend/501_Backend_Architecture.md`
4. `200_Product-第二版(RP-)/207_ProductEngineeringSpecification.md`

### 说明

如果你不接受这组技术栈，正式执行前应先单独确认。  
因为这不是普通措辞调整，而是 Blueprint v1.0 的冻结决策。

---

## 4.9 Phase 9：Validate AI Readiness

### 最终新增结果文件

1. `docs/_review/06_Blueprint_v1_0_Consolidation_Result.md`

### 用途

在正式收敛执行完成后，用它验证：

1. AI 是否还能读到多个 Product 模型
2. AI 是否已能区分 `Standard Product` 与 `Offer`
3. AI 是否知道 MVP 做什么、不做什么
4. AI 是否知道数据库唯一来源
5. AI 是否知道 Frontend 如何消费参数模型
6. AI 是否知道 Testing -> Production 的迁移路径

---

## 5. 变更矩阵

| 类型 | 文件/目录 | 处理方式 |
| --- | --- | --- |
| 正式基线声明 | `Readme.md` | 修改 |
| 正式索引 | `DOCUMENT_INDEX.md` | 修改 |
| 历史产品目录 | `200_Product-第一版` | 不改内容，仅在导航层降级 |
| 历史数据库目录 | `400_Database` | 不改内容，仅在导航层降级 |
| 架构桥接文档 | `315/316/317` | 新增 |
| MVP 文档 | `100_Business/108_MVP_Scope_and_Phase.md` | 新增 |
| 技术栈决策 | `TECH_STACK_DECISION.md` | 新增 |
| Backend 体系 | `500_Backend/*` | 全量一致性修正 |
| Frontend 体系 | `600_Frontend/*` | 全量一致性修正 |
| Supplier Workflow UI | `600_Frontend/610_Supplier_Workflow_UI.md` | 新增 |
| Database 分层实施 | `400_Database-第二版/409_Implementation_Priority.md` | 新增 |
| Operations 部署基线 | `801` 为主，`802/803` 同步 | 修改 |
| 历史总纲 DOCX | 根目录 DOCX | 默认不改 |

---

## 6. 推荐执行批次

### Batch 1：低风险、先收敛入口

1. `Readme.md`
2. `DOCUMENT_INDEX.md`
3. `TECH_STACK_DECISION.md`

### Batch 2：新增桥接文档

1. `315_Product_Database_API_UI_Mapping.md`
2. `316_Search_AI_Boundary.md`
3. `317_Deployment_Provider_Abstraction.md`
4. `108_MVP_Scope_and_Phase.md`
5. `409_Implementation_Priority.md`
6. `610_Supplier_Workflow_UI.md`

### Batch 3：Backend 对齐

1. `501~508`

### Batch 4：Frontend 对齐

1. `601~609`

### Batch 5：Operations / Validation

1. `801~803`
2. `06_Blueprint_v1_0_Consolidation_Result.md`

---

## 7. 当前建议的执行边界

为了控制风险，下一轮正式执行建议只做：

1. `Readme.md`
2. `DOCUMENT_INDEX.md`
3. `TECH_STACK_DECISION.md`
4. 新增 5~6 个桥接/冻结文档

先不要在同一轮里把 `500_Backend` 与 `600_Frontend` 全部重写完。  
更稳妥的方式是：

- 先建立唯一来源
- 再补桥接文档
- 再按 Backend / Frontend 两大批次逐步对齐

---

## 8. 最终建议

这份 Change Plan 的核心结论是：

1. 现在已经可以开始收敛 Blueprint v1.0
2. 但最好的顺序不是“一次改完全部文档”
3. 而是先做：
   - Source Freeze
   - Index Update
   - Bridge Documents
   - Tech Stack Freeze
4. 然后再进入：
   - Backend Alignment
   - Frontend Alignment
   - Deployment Baseline
   - AI Readiness Validation

换句话说，下一轮如果你确认，我们最适合执行的正式动作是：

**先完成 Batch 1 + Batch 2，再进入大规模正文对齐。**
