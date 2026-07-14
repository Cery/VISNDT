# Domain Driven Design

整个系统按照业务领域划分。

每个领域均拥有独立模块。

Identity

负责身份。

Organization

负责企业。

Product

负责标准产品。

Offer

负责供应信息。

Knowledge

负责知识。

Demand

负责需求。

RFQ

负责询报价。

Workflow

负责审批。

Search

负责全文搜索。

AI

负责智能能力。

Platform

负责运营管理。

领域之间禁止直接共享数据库表。

统一通过 Service 或 Repository 引用。