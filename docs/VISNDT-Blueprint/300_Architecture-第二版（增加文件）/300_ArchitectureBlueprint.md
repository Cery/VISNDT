# Architecture Blueprint

Version

2.0

Status

Frozen

---

# 1. Architecture Goal

VISNDT 采用领域驱动设计（Domain Driven Design，DDD）作为整体架构原则。

系统划分为多个独立业务域，每个业务域拥有自己的：

- 数据模型（Data Model）
- Service
- API
- Workflow
- UI
- 权限模型

业务域之间通过明确的数据引用和 API 协作，不允许跨域直接修改数据。

---

# 2. Architecture Layers

┌────────────────────────────────────┐

Presentation Layer

(Web / Admin)

└────────────────────────────────────┘

↓

┌────────────────────────────────────┐

Application Layer

(API / Workflow)

└────────────────────────────────────┘

↓

┌────────────────────────────────────┐

Domain Layer

(Product / Offer / Knowledge ...)

└────────────────────────────────────┘

↓

┌────────────────────────────────────┐

Infrastructure Layer

(PostgreSQL / Redis / R2)

└────────────────────────────────────┘

---

# 3. Business Domains

Identity

Organization

Product

Offer

Knowledge

Demand

RFQ

Workflow

Search

AI

Platform

Statistics

Audit

---

# 4. Core Dependency

Identity

↓

Organization

↓

Product

↓

Offer

↓

Knowledge

↓

Demand

↓

RFQ

↓

Workflow

↓

Statistics

任何模块不得反向依赖上游业务。

例如：

Offer 可以引用 Product。

Product 不允许引用 Offer。

---

# 5. Single Source of Truth

Identity

唯一身份数据源

Organization

唯一企业数据源

Product

唯一标准产品数据源

Knowledge

唯一知识数据源

Demand

唯一需求数据源

任何业务不得复制上述核心数据。