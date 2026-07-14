# 316 Search AI Boundary

本文档用于冻结 `VISNDT Blueprint v1.0` 中 Search 与 AI 的职责边界。

目标是确保：

1. MVP 先建立稳定的核心搜索能力
2. AI 作为增强层接入
3. AI 不改变核心业务模型
4. Search 与 AI 不重复建模

---

## 1. Boundary Principle

### 1.1 Search Is Core Infrastructure

Search 是核心业务基础设施，直接服务：

- Product
- Offer
- Demand
- RFQ
- Knowledge 的检索入口

### 1.2 AI Is Enhancement Layer

AI 是增强层，不是 Phase 1 的核心业务依赖。

AI 可以提升理解、推荐、问答和召回效果，但不能改变以下核心对象：

- Organization
- Standard Product
- Offer
- Demand
- RFQ
- Workflow
- Notification

### 1.3 Core Model Stability

无论 AI 是否启用，核心业务模型保持不变。  
AI 输出只能作为建议、排序增强或理解增强，不得替代核心结构化业务链路。

---

## 2. MVP Search

## 2.1 Scope

MVP Search 必须包括：

- Product Search
- Parameter Filter
- Category Search
- Demand Search
- RFQ Search
- Full Text Search

### 2.2 Responsibilities

Search 负责：

1. 基于标准产品的结构化搜索
2. 基于参数元数据的过滤
3. 基于分类树的导航搜索
4. 基于 Demand / RFQ 的基础检索
5. 关键词召回
6. 排序与筛选

### 2.3 Technology Baseline

MVP 搜索技术冻结为：

- `PostgreSQL Full Text Search`
- `pg_trgm`

### 2.4 Explicit Prohibition

明确禁止：

**MVP 引入 Elasticsearch**

原因：

1. 当前 MVP 阶段优先保证架构收敛与实现闭环
2. PostgreSQL 原生搜索已足以覆盖 Phase 1 基础检索需求
3. 过早引入外置搜索引擎会增加部署、同步、维护与迁移复杂度

---

## 3. Search Responsibility Boundary

Search 只负责检索与过滤，不负责：

1. 语义理解推理
2. Embedding 生成
3. RAG 问答
4. 智能推荐
5. 知识图谱推理
6. Agent 决策

Search 的典型输入是：

- 分类
- 关键词
- 参数过滤条件
- 状态条件

Search 的典型输出是：

- 结果列表
- 排序结果
- 过滤结果
- 搜索建议

---

## 4. AI Boundary

## 4.1 Phase 1

Phase 1 中：

**AI 不作为核心业务依赖。**

这意味着：

1. 产品检索不能依赖 AI 才能工作
2. Demand / RFQ / Workflow 不能依赖 AI 才能成立
3. 平台业务闭环必须在没有 AI 的情况下完整运行

## 4.2 Phase 2

Phase 2 允许引入以下 AI 增强能力：

- Semantic Search
- Recommendation
- Embedding
- `pgvector`

### 4.2.1 Phase 2 Role

Phase 2 的 AI 负责：

1. 语义理解
2. 相似产品召回增强
3. 推荐排序增强
4. 需求与产品的语义匹配增强

但即使在 Phase 2，AI 仍然属于增强层，不替代基础 Search。

## 4.3 Phase 3

Phase 3 允许引入：

- RAG
- Knowledge Graph
- AI Agent

这些能力属于长期平台增强，不进入 MVP 实施范围。

---

## 5. Search and AI Collaboration Rule

Search 与 AI 的协作规则如下：

### 5.1 Search First

基础查询、参数过滤、分类导航、状态检索必须由 Search 先完成。

### 5.2 AI Enhances

AI 可以在 Search 结果之上进行：

1. 语义扩展
2. 推荐排序
3. 相似度增强
4. 问答式辅助理解

### 5.3 No Model Rewrite

AI 不允许：

1. 重写 Product / Offer / Demand / RFQ 的业务定义
2. 替代 Workflow 状态机
3. 直接修改业务主数据
4. 绕开标准 API 和状态流转

---

## 6. Phase Mapping

### Phase 1

- Search：核心能力
- AI：非核心依赖

### Phase 2

- Search：保持核心检索与过滤能力
- AI：增加语义搜索、推荐、Embedding、`pgvector`

### Phase 3

- Search：继续作为基础检索层
- AI：增加 RAG、Knowledge Graph、AI Agent

---

## 7. Final Decision

`VISNDT Blueprint v1.0` 最终边界冻结如下：

1. Search 是核心检索基础设施
2. AI 是增强层
3. MVP Search 使用 `PostgreSQL Full Text Search + pg_trgm`
4. MVP 不引入 Elasticsearch
5. Phase 2 才允许 `pgvector`
6. AI 不改变核心业务模型

如果其他文档出现：

- AI 语义搜索替代基础搜索
- MVP 默认依赖向量检索
- 提前引入 Elasticsearch

均以本文件为准。
