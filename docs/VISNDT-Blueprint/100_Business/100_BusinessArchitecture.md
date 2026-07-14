# Business Architecture

Version

2.0

Status

Frozen

---

# 1. Overview

VISNDT 是一个面向工业检测设备行业的专业数字化平台。

平台采用 Platform（平台）模式，而非 Marketplace（交易市场）模式。

平台负责建立行业统一的数据中心、产品中心、知识中心及供需撮合能力，不直接参与商品买卖、资金结算或物流配送。

---

# 2. Platform Position

VISNDT 提供以下能力：

- 标准产品管理
- 企业管理
- 产品供应展示
- 行业知识管理
- 需求发布
- RFQ 管理
- AI 产品搜索
- AI 参数匹配
- 平台运营管理

平台不提供：

- ERP
- CRM
- 财务管理
- 仓储管理
- 在线支付
- 即时通讯

---

# 3. Business Domains

平台划分为六大业务域：

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

所有业务域共享：

Identity

Workflow

Search

AI

Platform

---

# 4. Business Flow

企业入驻

↓

完善企业资料

↓

申请供应商认证（可选）

↓

发布供应信息

↓

采购方搜索产品

↓

查看产品知识

↓

发布采购需求

↓

供应商响应

↓

RFQ

↓

线下成交

---

# 5. Core Principles

Organization First

Product Driven

Offer Independent

Knowledge Reusable

Demand Open

RFQ Standardized

Workflow Traceable

AI Assisted