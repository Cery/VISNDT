# 108 MVP Scope and Phase

本文档用于冻结 `VISNDT Blueprint v1.0` 的 MVP 范围。

目标是确保：

1. Blueprint v1.0 可以直接指导 Phase 1 实施
2. Phase 2 / Phase 3 的能力保留设计，但不进入 MVP 实施
3. 采购侧与供应侧都具备完整业务闭环

---

## 1. MVP Definition Principle

MVP 的目标不是一次实现完整平台全部能力。  
MVP 的目标是先形成最小可运行业务闭环，并为后续平台增强保留扩展能力。

因此：

1. Phase 1 只实现核心业务闭环
2. Phase 2 / Phase 3 允许保留设计
3. Phase 2 / Phase 3 不进入 MVP 实施范围

---

## 2. Phase 1 MVP

Phase 1 MVP 必须实现以下能力：

- Organization
- Standard Product
- Product Parameter
- Offer
- Demand
- RFQ
- Search
- Notification
- Basic Workflow

### 2.1 Organization

MVP 必须支持：

1. Organization 基础资料
2. Organization 身份与角色
3. Organization 工作台入口

### 2.2 Standard Product

MVP 必须支持：

1. 平台标准产品主数据
2. 分类结构
3. 产品详情
4. 与 Offer 的引用关系

### 2.3 Product Parameter

MVP 必须支持：

1. 参数定义
2. 参数模板
3. 产品参数值
4. 参数搜索和过滤基础能力

### 2.4 Offer

MVP 必须支持：

1. Organization 创建 Offer
2. Offer 引用 Standard Product
3. Offer 的基础管理与状态维护

### 2.5 Demand

MVP 必须支持：

1. 采购需求提交
2. 需求状态流转
3. 需求与 Product / Offer 的关联入口

### 2.6 RFQ

MVP 必须支持：

1. RFQ 创建
2. RFQ 状态管理
3. 组织响应入口

### 2.7 Search

MVP 必须支持：

1. Product Search
2. Category Search
3. Parameter Filter
4. Demand Search
5. RFQ Search

### 2.8 Notification

MVP 必须支持：

1. Internal Notification
2. Email Notification

### 2.9 Basic Workflow

MVP 必须支持：

1. Demand 状态流转
2. RFQ 状态流转
3. 基础审批和处理节点

---

## 3. Phase 1 Business Loop

### 3.1 Buyer Loop

采购方业务闭环：

`搜索产品`

↓

`提交 Demand`

↓

`平台匹配`

↓

`RFQ`

↓

`供应商响应`

### 3.2 Organization Loop

供应方业务闭环：

`Organization`

↓

`Offer`

↓

`RFQ Inbox`

↓

`Response`

### 3.3 MVP Completion Rule

只要上述双边闭环不能成立，就不能视为 MVP 完成。

---

## 4. Phase 2

Phase 2 包括：

- AI Search
- Recommendation
- Knowledge Enhancement
- Advanced Workflow

### 4.1 Phase 2 Position

Phase 2 属于平台增强阶段。  
这些能力可以在 Blueprint 中保留设计，但不进入 Phase 1 MVP 实施。

---

## 5. Phase 3

Phase 3 包括：

- RAG
- Knowledge Graph
- AI Agent
- Ecosystem API

### 5.1 Phase 3 Position

Phase 3 属于长期平台能力扩展。  
这些能力可以保留规划，但不进入 MVP 实施。

---

## 6. Final Scope Rule

最终范围冻结如下：

1. Phase 1 只实现核心业务闭环
2. Phase 2 / Phase 3 允许设计，不进入 MVP 实施
3. MVP 的核心对象是：
   - Organization
   - Standard Product
   - Product Parameter
   - Offer
   - Demand
   - RFQ
   - Search
   - Notification
   - Basic Workflow

如果后续文档出现“AI、RAG、Knowledge Graph 必须进入 MVP”的表述，以本文件为准。
