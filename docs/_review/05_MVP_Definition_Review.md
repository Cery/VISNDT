# 05 MVP Definition Review

审查目标：

判断当前 VISNDT Blueprint 是否已经明确 MVP，是否存在过度规划，并给出分阶段产品范围建议。

重点审查文件：

- `100_Business/*`
- `200_Product-第二版(RP-)/*`
- `300_Architecture-第二版（增加文件）/*`
- `400_Database-第二版/*`
- `500_Backend/*`
- `600_Frontend/*`
- `900_Project_Management/*`
- 根目录 `Readme.md`、`DOCUMENT_INDEX.md`、总 Blueprint DOCX

---

## 1. 当前 MVP 状态分析

### 结论

**当前 Blueprint 没有形成真正冻结的 MVP 定义。**

原因有三：

1. `100_Business` 解释了平台业务闭环，但没有把“第一阶段必须交付什么”写成范围边界。
2. `300_Architecture` 和 `400_Database-第二版` 对最终平台能力做了大量预留，甚至进入较深工程级细化。
3. 总 Blueprint DOCX 明确写出“不再区分 MVP 架构”，这与当前需求目标相冲突。

因此，当前状态不是“已有 MVP 但不够详细”，而是：

**存在完整平台蓝图倾向，但缺少 Phase 1 的产品收敛。**

---

## 2. 当前设计是否过度规划

### 2.1 判断

**是，存在明显过度规划。**

### 2.2 过度规划主要体现

#### 过度点 01：数据库与 AI 预留深度高于 MVP 实施需要

第二版数据库已经提前设计：

- Embedding
- Vector Chunk
- Knowledge Graph
- Notification
- Workflow
- Audit
- 复杂 Migration
- Production 级安全与运维细节

这些能力本身没有错，但对于 MVP 来说，不应默认全部首发上线。

#### 过度点 02：架构中心数量过多

当前架构中心包括：

- Identity
- Organization
- Product
- Offer
- Knowledge
- Demand
- RFQ
- Workflow
- Search
- AI
- Platform
- Statistics
- Audit

对于 MVP，至少 `AI / Statistics / Audit / Knowledge Graph` 等能力应区分“预留”与“首发实现”。

#### 过度点 03：前端核心闭环未补齐，但外围规范已经较多

当前 `600_Frontend` 有：

- Public Pages
- Product Center
- Requirement Center

但供应商后台、Offer 管理、RFQ 处理、通知中心等闭环页面不足。  
说明当前不是“能力不够多”，而是“首发闭环没有聚焦”。

---

## 3. MVP 核心业务闭环

### 3.1 建议作为 Phase 1 的最小业务闭环

#### 采购侧

`浏览/搜索标准产品 -> 阅读基础知识 -> 提交需求 -> 平台审核 -> 供应商响应 -> RFQ -> 线下成交`

#### 供应商侧

`组织入驻 -> 完善企业资料 -> 维护 Offer -> 接收需求/询价 -> 提交响应/报价`

### 3.2 这个闭环当前是否可被文档支撑

**部分可支撑，但还不完整。**

已经具备：

1. 业务定位
2. 标准产品模型
3. 参数体系
4. Demand / RFQ 概念
5. Database 主干
6. 通知、Workflow、Quality、Operations 的基础原则

仍不完整的地方：

1. Backend 仍存在 Supplier 自建 Product 的旧模型
2. Frontend 缺供应商后台/RFQ 主闭环页面基线
3. Offer 模块在 Backend/Frontend 没有形成像 Product 那样明确的 UI/API 主线
4. MVP 是否先只覆盖部分设备族，没有正式决议

---

## 4. MVP 功能范围建议

## 4.1 MVP 必须实现

| 模块 | 是否已有设计 | 是否需要调整 | 影响模块 |
| --- | --- | --- | --- |
| Identity / Authentication | 已有 | 小幅调整即可 | Backend / Frontend / Quality |
| Organization 基础资料 | 已有 | 需与 Supplier 术语统一 | Product / Backend / Frontend |
| 标准产品中心 | 已有 | 需明确平台主数据归属 | Database / Backend / Frontend |
| 参数元数据引擎 | 已有 | 需正式确定为 MVP 核心 | Search / Demand / RFQ / Frontend |
| Offer 基础能力 | 部分已有 | 需加强 | Backend / Frontend |
| Demand 发布与状态流转 | 已有 | 需与 Requirement 术语统一 | Backend / Frontend / Workflow |
| RFQ 基础流程 | 已有 | 需补前后端闭环 | Backend / Frontend / Notification |
| 基础搜索 | 已有 | 需与 AI 解耦 | Database / Backend / Frontend |
| 文件附件管理 | 已有 | 小幅补充即可 | Product / Offer / Demand / RFQ |
| Notification 基础通知 | 已有 | 聚焦站内消息+邮件 | Frontend / Operations |

### 说明

MVP 的核心不是“做少”，而是先把采购与供应商闭环打通。

---

## 4.2 MVP 后续版本

建议进入 Phase 2 的能力：

1. 语义搜索增强
2. Embedding 批处理与向量检索
3. 高级推荐
4. 知识问答
5. 复杂工作流编排
6. 高级统计分析
7. 多通知通道（Webhook / SMS / Push）
8. 更完整的 CMS/SEO 运营能力

---

## 4.3 长期平台能力

建议进入 Phase 3 的能力：

1. AI 智能助手
2. 行业知识图谱
3. 自动匹配引擎优化
4. 自动报价辅助
5. 更复杂的多角色协同工作流
6. 生态开放平台与第三方集成

---

## 5. 暂缓功能列表

以下能力不建议作为 MVP 首发交付目标：

1. 完整 RAG 问答体系
2. 知识图谱
3. Agent Task / 多智能体能力
4. 高级统计中心
5. 复杂 BI 报表
6. 完整多通道通知矩阵
7. 所有 NDT 设备族的全量标准产品库
8. 大规模搜索引擎外置化（如 Elasticsearch）

### 注意

“暂缓”不等于“删除设计”，而是：

- 允许保留接口
- 保留数据库扩展位
- 保留文档规划
- 不作为 Phase 1 必交付物

---

## 6. 对数据库影响分析

### 6.1 当前数据库是否过度设计

**有一定过度设计，但可控。**

### 6.2 哪些部分适合直接保留

1. Identity / Organization
2. Product / Parameter / Capability / Feature
3. Offer
4. Demand
5. RFQ
6. File Domain
7. Workflow 基础实例层

### 6.3 哪些部分应降为“预留”

1. Embedding 深度链路
2. Knowledge Graph
3. 高级推荐细分表
4. 复杂统计表
5. 长周期大规模审计/分区策略

### 6.4 建议

数据库第二版不必推倒重来。  
建议做的是“交付分层”：

- **结构可保留**
- **实现分阶段**
- **Seed 与接口按 MVP 收敛**

---

## 7. 对技术架构影响分析

### 建议的架构分期

#### Phase 1: MVP

必须激活：

- Identity
- Organization
- Product
- Offer
- Demand
- RFQ
- Workflow（基础）
- Search（基础）
- File
- Notification（基础）

可预留但不强制实现：

- AI Center
- Statistics Center
- 高级 Platform 运营能力

#### Phase 2: Platform Enhancement

增强：

- 高级 Search
- 更完整 Supplier/Operator 工作台
- 更多通知通道
- 更完整知识中心
- 更强工作流与审核能力

#### Phase 3: AI and Ecosystem Expansion

增强：

- AI Center 深度能力
- 向量搜索
- RAG
- 推荐引擎
- 开放平台

---

## 8. 对目录和文档调整建议

| 建议 | 当前是否已有设计 | 是否需要调整 | 影响模块 | 需同步修改文件 |
| --- | --- | --- | --- | --- |
| 新增 MVP 范围与阶段文档 | 当前缺失 | 需要新增 | Business / Product / Architecture / Project | 总 DOCX、100、200、300、900 |
| 在 Product/Architecture 中标注 MVP 设备族样板 | 部分已有 | 需要补充 | Product / Frontend / Search | 201、203、202、606、607 |
| Backend 文档按 MVP 闭环重排服务优先级 | 部分已有 | 需要调整 | Backend / Frontend | 505、502、503 |
| Frontend 增加 Supplier/RFQ 响应式闭环文档 | 当前不足 | 需要补充 | Frontend / Quality | 600_*、702、706 |
| Database 在实施策略上标注“首发启用/后续启用” | 部分已有 | 需要补充 | Database / Backend / Ops | 402、406、407 |

---

## 9. MVP 开发优先级建议

### Priority P0

1. 统一术语与技术栈
2. 冻结 MVP 范围
3. 冻结标准产品与 Offer 边界

### Priority P1

1. 标准产品中心
2. 参数元数据引擎
3. Demand 发布
4. Offer 管理
5. RFQ 基础流程
6. 基础搜索
7. 附件与通知

### Priority P2

1. 知识中心增强
2. 响应式供应商后台完善
3. 发布/监控/恢复自动化增强

### Priority P3

1. 向量检索
2. RAG
3. AI 推荐
4. 知识图谱

---

## 10. 最终结论

当前 VISNDT Blueprint 的问题，不是缺少“宏大平台能力”，而是：

**缺少明确的第一阶段交付边界。**

因此本次审查建议非常明确：

1. **必须补一个正式 MVP 定义**
2. **必须把首发闭环限定在 Product + Offer + Demand + RFQ + Search + Notification**
3. **AI、向量搜索、知识图谱等能力应保留规划，但不应默认进入 MVP 首发**

换句话说，VISNDT Blueprint v1.0 若想真正指导开发，  
就必须从“全平台蓝图”收敛为“有阶段边界的平台蓝图”。
