# 409 Implementation Priority

本文档用于为 `400_Database-第二版` 增加实施优先级说明。

目标是：

1. 不修改 Database v2 的完整设计
2. 保留数据库第二版全部能力
3. 按 Blueprint v1.0 的阶段目标分批启用

---

## 1. Principle

`Database v2 Schema` 保留完整能力。  
实施按阶段启用。

这意味着：

1. 数据库第二版设计仍然是完整平台能力基线
2. Phase 1 不需要一次启用全部数据库能力
3. 未在 MVP 启用的部分属于延后实施或预留能力
4. 分阶段启用不等于删除设计

---

## 2. MVP Enable

Phase 1 MVP 直接启用以下数据库能力：

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

### 2.1 Explanation

这些能力对应 Blueprint v1.0 的核心业务闭环：

1. 组织入驻与身份管理
2. 平台标准产品主数据
3. 参数体系
4. Offer 供给
5. Demand 需求
6. RFQ 询报价
7. 基础流程状态
8. 文件资产
9. 通知能力

---

## 3. Phase 2 Deferred

Phase 2 延后启用以下数据库能力：

- Embedding
- Vector
- Recommendation
- Advanced Statistics

### 3.1 Explanation

这些能力用于增强平台搜索、推荐和数据分析能力，  
但不是 Phase 1 MVP 成立的前提。

---

## 4. Phase 3 Reserved

Phase 3 预留以下数据库能力：

- Knowledge Graph
- AI Agent

### 4.1 Explanation

这些能力属于长期平台扩展能力，保留设计即可，  
不进入 Blueprint v1.0 的 MVP 实施范围。

---

## 5. Final Rule

最终实施规则如下：

1. `400_Database-第二版` 继续作为正式数据库设计基线
2. 数据库 Schema 不因 MVP 分层而被重写
3. 实施优先级按 `MVP Enable -> Phase 2 Deferred -> Phase 3 Reserved` 执行
4. 后续工程实施必须优先启用 MVP 所需数据库域

如果后续实施顺序与本文件冲突，以本文件为准。
