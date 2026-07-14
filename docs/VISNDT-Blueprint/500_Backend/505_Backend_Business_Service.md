# Backend Business Service

Version：V1.0

Status：FINAL

# 1. Purpose

本文档定义 VISNDT 平台 Backend Business Service（业务服务层）设计规范。

Business Service 是连接 API、数据库和业务规则的核心层。

所有业务逻辑统一在 Service 层实现。

------

# 2. Position in Repository

Repository 关系：

```
Client

↓

REST API（502）

↓

Authentication（504）

↓

Business Service（505）

↓

Repository / DAO

↓

Database（400）
```

Business Service 不直接处理 HTTP，也不直接操作数据库连接。

------

# 3. Design Objectives

业务层目标：

```
Business Rules

↓

Reusable

↓

Maintainable

↓

Independent
```

每个 Service 只负责一个业务领域。

------

# 4. Business Modules

VISNDT 当前规划以下业务模块：

| 模块                 | 对应网站功能 |
| -------------------- | ------------ |
| Product Service      | 标准产品中心 |
| Organization Service | 组织中心     |
| Demand Service       | 采购需求     |
| News Service         | 新闻资讯     |
| CMS Service          | 内容管理     |
| Search Service       | 搜索筛选     |
| File Service         | 文件资源     |
| Notification Service | 消息通知     |
| Dashboard Service    | 后台统计     |

所有模块采用统一设计规范。

------

# 5. Service Responsibilities

Business Service 负责：

- 业务规则处理
- 数据校验
- 状态流转
- 权限配合
- 调用 Repository
- 返回统一业务对象

不负责：

- HTTP 请求解析
- JWT 验证
- SQL 编写
- 页面展示

------

# 6. Common Workflow

所有业务统一流程：

```
API

↓

Authentication

↓

Authorization

↓

Business Validation

↓

Business Service

↓

Repository

↓

Database
```

------

# 7. Business Principles

统一遵循：

- 单一职责（Single Responsibility）
- 一个 Service 对应一个业务域
- 禁止跨模块直接操作数据库
- 公共逻辑抽取为 Shared Service
- 所有业务异常使用统一错误码（506）

------

# 8. Module Relationship

主要模块关系：

```
Standard Product

↓

Offer

↓

Demand

↓

RFQ

↓

Notification
```

新闻、CMS、文件资源等模块独立运行，通过关联 ID 与其他模块建立联系。

------

# 8A. Core Business Flow

采购侧统一流程：

```
Search Product

↓

Create Demand

↓

Generate RFQ

↓

Organization Response

↓

Workflow
```

供应侧统一流程：

```
Organization

↓

Create Offer

↓

Receive RFQ

↓

Submit Response
```

必须明确：

`Offer` 是连接 `Product` 与 `Organization` 的业务对象。

------

# 9. Development Standards

每个业务模块至少包含：

- Service
- DTO
- Validator
- Repository
- Event（预留）
- Unit Test（507）

保持统一目录结构。

------

# 10. Document Status

| Item              | Status  |
| ----------------- | ------- |
| Service Position  | Defined |
| Business Modules  | Defined |
| Responsibilities  | Defined |
| Workflow          | Defined |
| Design Principles | Defined |

# Product Service

------

# 11. Purpose

Product Service 负责平台标准产品全生命周期管理。

标准产品是 VISNDT 平台的核心业务对象。

所有产品展示、搜索、筛选及采购撮合均基于平台标准产品数据。

------

# 12. Service Scope

负责：

- 平台标准产品创建
- 平台标准产品编辑
- 标准产品发布
- 标准产品审核
- 标准产品上下架
- 标准产品详情
- 标准产品搜索
- 参数元数据管理

不负责：

- 文件存储（File Service）
- 用户认证（Authentication）
- 消息通知（Notification Service）

------

# 13. Product Lifecycle

统一状态流转：

```
Draft

↓

Pending Review

↓

Published

↓

Offline

↓

Archived
```

说明：

- Draft：平台侧编辑中，仅平台内部可见。
- Pending Review：提交审核。
- Published：审核通过，前台可见。
- Offline：暂停展示，可重新发布。
- Archived：历史归档，不参与搜索。

------

# 14. Create Product

平台管理员维护标准产品。

创建时至少填写：

- 产品名称
- 产品分类
- 所属供应商
- 产品简介

创建后默认状态：

```
Draft
```

------

# 15. Edit Product

允许修改：

- 基本信息
- 产品参数
- 产品图片
- 产品资料
- SEO 信息

若产品已发布，修改后建议重新进入：

```
Pending Review
```

确保前台展示内容经过审核。

------

# 16. Product Review

平台管理员负责审核。

审核结果：

| 状态     | 处理     |
| -------- | -------- |
| Approved | 发布     |
| Rejected | 退回修改 |

审核意见应保存，供应商可查看。

------

# 17. Product Publish

审核通过后：

- 前台产品列表可见
- 加入搜索索引
- 可参与推荐
- 可被采购需求匹配

发布时间自动记录。

------

# 18. Product Offline

以下情况可下架：

- 供应商主动下架
- 平台管理员下架
- 企业认证失效
- 产品违规

下架产品：

- 前台不可见
- 保留历史数据
- 不删除关联资料

------

# 19. Product Detail

产品详情页统一展示：

- 产品图片
- 基本参数
- 产品描述
- 应用行业
- 所属供应商
- 下载资料
- 推荐产品

详情内容由多个 Service 组合返回。

------

# 20. Product Search Support

Product Service 提供搜索能力：

支持：

- 产品名称
- 分类
- 品牌
- 参数筛选
- 关键词

搜索逻辑由 Search Service 调用。

------

# 21. Product Recommendation

支持推荐位：

- 首页推荐
- 分类推荐
- 最新产品
- 热门产品

推荐规则由平台后台维护。

------

# 22. Product Association

产品统一关联：

| 关联对象    | 用途             |
| ----------- | ---------------- |
| Organization / Offer | 供应侧引用关系 |
| Category    | 产品分类         |
| Parameter   | 技术参数         |
| File        | 图片、PDF        |
| News        | 产品新闻（可选） |
| Application | 应用案例（可选） |

保持关联清晰，不存储重复数据。

------

# 23. Business Rules

统一规则：

- 一个产品仅属于一个供应商
- 一个产品属于一个主分类
- 产品编码唯一
- 发布前必须通过审核
- 删除产品采用逻辑删除

------

# 24. Service Status

| Item                   | Status  |
| ---------------------- | ------- |
| Product Lifecycle      | Defined |
| Product Review         | Defined |
| Product Publish        | Defined |
| Product Search         | Defined |
| Product Recommendation | Defined |
| Product Association    | Defined |
| Business Rules         | Defined |

# Organization Service

------

# 25. Purpose

Organization Service 负责平台组织主体全生命周期管理。

Organization 提供企业身份和业务能力，并作为 Offer 与 RFQ 响应的承载主体。

------

# 26. Service Scope

负责：

- 企业注册
- 企业资料维护
- 企业认证
- 企业展示
- Organization 状态管理
- 与 Offer、RFQ 的业务身份关联

不负责：

- 用户登录（Authentication）
- 产品业务（Product Service）
- 文件存储（File Service）

------

# 27. Organization Lifecycle

统一状态：

```
Pending

↓

Verified

↓

Active

↓

Suspended

↓

Archived
```

说明：

- Pending：注册待完善资料
- Verified：完成企业认证
- Active：正常展示
- Suspended：暂停展示
- Archived：历史归档

------

# 28. Organization Registration

企业首次入驻需填写：

- 企业名称
- 企业简称
- 联系人
- 联系电话
- 联系邮箱
- 所属地区

注册完成后：

状态默认为：

```
Pending
```

------

# 29. Enterprise Profile

企业主页统一展示：

- 企业 Logo
- 企业简介
- 主营产品
- 联系方式（按平台策略展示）
- 企业官网（可选）
- 企业资质（可选）
- 入驻时间

统一保持展示风格。

------

# 30. Enterprise Verification

平台支持企业认证。

建议审核内容：

| 项目      | 是否必须 |
| --------- | -------- |
| 企业名称  | ✔        |
| 营业执照  | ✔        |
| 联系方式  | ✔        |
| 企业地址  | ✔        |
| 企业 Logo | ○        |

认证通过后：

企业状态变更为：

```
Verified
```

------

# 31. Platform Standard Product Management + Organization Offer Management

必须明确：

1. `Platform Standard Product Management` 由 `Product Service` 负责
2. `Organization Offer Management` 由 `Organization Service` 与 `Offer` 相关逻辑协同负责

Organization 可：

- 基于平台标准产品创建 Offer
- 编辑 Offer 商业与交付信息
- 查看 Offer 状态
- 下架自身 Offer

Organization 不得：

- 创建标准产品
- 修改平台标准产品主数据
- 修改其他 Organization 的 Offer

------

# 32. Organization Display

前台企业详情页统一展示：

- 企业介绍
- Offer 列表
- 应用行业
- 最新资讯
- 联系方式
- 企业所在地

展示内容由多个 Service 聚合返回。

------

# 33. Organization Status Control

平台管理员可：

- 暂停企业展示
- 恢复展示
- 取消认证
- 归档企业

暂停展示后：

该 Organization 关联 Offer 同步停止前台展示。

------

# 34. Organization Offer Product Relationship

统一关系：

```
Organization

1

↓

N

Offer

N

↓

1

Standard Product
```

必须明确：

- Standard Product 由平台统一维护
- Offer 是连接 Product 与 Organization 的业务对象
- Organization 不拥有 Product 主数据

------

# 35. Procurement Collaboration

Organization 可接收：

- 产品咨询
- Demand 匹配
- 平台通知

后续由 Demand Service、RFQ Service 与 Notification Service 协同完成。

------

# 36. Business Rules

统一规则：

- 一个企业对应一个 Organization 实体
- 企业资料修改保留历史记录（预留）
- 企业认证失效后停止公开展示
- 企业状态变化同步影响 Offer 展示状态

------

# 37. Service Status

| Item                      | Status  |
| ------------------------- | ------- |
| Organization Lifecycle    | Defined |
| Enterprise Registration   | Defined |
| Enterprise Verification   | Defined |
| Organization Display      | Defined |
| Offer Relationship        | Defined |
| Procurement Collaboration | Defined |
| Business Rules            | Defined |

# Demand Service

------

# 38. Purpose

Demand Service 负责采购需求的全生命周期管理。

平台通过 Demand 连接采购侧需求与 Organization 供给，提高产品匹配效率。

------

# 39. Service Scope

负责：

- 发布采购需求
- 编辑采购需求
- 审核需求
- 智能匹配产品
- 智能匹配 Organization / Offer
- 需求关闭
- 需求归档

不负责：

- 在线交易
- 在线支付
- 合同管理

------

# 40. Demand Lifecycle

统一状态：

```
Draft

↓

Pending Review

↓

Published

↓

Matching

↓

Closed

↓

Archived
```

说明：

- Draft：采购方编辑中
- Pending Review：提交平台审核
- Published：公开展示
- Matching：供应商响应中
- Closed：采购结束
- Archived：历史归档

------

# 41. Publish Requirement

采购用户可发布需求。

建议填写：

- 需求标题
- 产品分类
- 应用行业
- 检测对象
- 关键技术参数
- 预算范围（可选）
- 交付地区
- 截止日期

提交后进入审核。

------

# 42. Demand Review

平台管理员审核：

审核内容：

- 是否属于检测设备相关需求
- 是否存在违规内容
- 信息是否完整

审核通过后：

进入：

```
Published
```

------

# 43. Matching Strategy

需求发布后：

系统根据以下条件匹配：

- 产品分类
- 技术参数
- 应用行业
- 所在地区（可选）
- Organization 认证状态

匹配结果供采购方参考。

------

# 44. Organization Response

符合条件的 Organization 可：

- 查看 Demand
- 生成 RFQ 响应
- 留言沟通
- 提交 Offer 方案

平台记录响应时间与响应状态。

------

# 45. Contact Protection

为保护双方信息：

默认规则：

- 采购方联系方式默认隐藏
- Organization 联系方式默认展示企业公开信息
- 平台可根据运营策略开放联系方式

避免平台外直接绕过撮合流程。

------

# 46. Demand Detail

前台详情页统一展示：

- 需求描述
- 应用行业
- 发布时间
- 截止日期
- 匹配产品（可选）
- 推荐 Organization / Offer（可选）

敏感信息按权限控制展示。

------

# 47. Demand Closure

采购完成后：

采购方可主动关闭需求。

平台管理员也可关闭：

- 长期无效需求
- 已过截止日期需求
- 违规需求

关闭后不再参与匹配。

------

# 48. Association

采购需求统一关联：

| 对象       | 用途             |
| ---------- | ---------------- |
| Category   | 产品分类         |
| Product    | 匹配产品         |
| Organization / Offer | 响应主体与供给 |
| User       | 发布人           |
| Attachment | 技术附件（可选） |

------

# 49. Business Rules

统一规则：

- 一个需求仅属于一个采购用户
- 一个需求可对应多个 Organization 响应
- 响应记录长期保留
- 已归档需求不可再次发布
- 删除采用逻辑删除

------

# 50. Service Status

| Item                  | Status  |
| --------------------- | ------- |
| Demand Lifecycle      | Defined |
| Demand Review         | Defined |
| Matching Strategy     | Defined |
| Organization Response | Defined |
| Contact Protection    | Defined |
| Business Rules        | Defined |

# RFQ Service

------

# 51. Purpose

RFQ Service 负责平台询价流程、需求转化与响应协同。

Matching Service 保留为 RFQ 的辅助逻辑，不再作为独立主业务对象。

------

# 52. Module Mapping

## 对应前台页面

- 产品详情（我要询价）
- 采购需求详情
- 我的询价
- 我的响应

## 对应后台页面

- 询价管理
- 撮合管理
- 响应记录

## 主要数据表

- rfq
- rfq_message
- rfq_response
- demand

## 关联 Service

- Product Service
- Organization Service
- Demand Service
- Notification Service

------

# 53. Service Scope

负责：

- RFQ 创建
- RFQ 会话管理
- Organization 响应
- Matching 辅助逻辑
- RFQ 状态管理

不负责：

- 在线支付
- 合同签订
- 售后管理

------

# 54. RFQ Lifecycle

统一状态：

```
Created

↓

Submitted

↓

Organization Responded

↓

Communicating

↓

Completed

↓

Closed
```

------

# 55. Create RFQ

采购用户可从：

- 产品详情
- Demand
- Offer

发起 RFQ。

建议填写：

- 联系方式（按平台规则）
- 需求说明
- 数量（可选）
- 预算（可选）
- 附件（可选）

------

# 56. Organization Response

Organization 收到 RFQ 后可：

- 回复咨询
- 推荐 Offer
- 上传产品资料
- 提供报价说明（文字）

所有回复保留历史记录。

------

# 57. Matching Record

平台记录：

- 匹配来源
- 匹配时间
- 响应时间
- 响应次数
- 当前状态

用于统计撮合效果。

------

# 58. Communication Rules

平台内沟通统一采用消息记录。

每条消息记录：

- 发送方
- 接收方
- 发送时间
- 内容
- 附件（可选）

消息不可修改，仅允许撤回（可选）。

------

# 59. Closing Rules

以下情况可关闭：

- 双方确认完成沟通
- 采购方主动关闭
- 超过有效期无响应
- 管理员关闭违规记录

关闭后：

仅允许查看历史记录。

------

# 60. Business Rules

统一规则：

- 一个询价对应一个产品或一个采购需求
- 一个询价可产生多个消息记录
- 一个供应商可多次回复
- 所有沟通记录长期保存
- 删除采用逻辑删除

------

# 61. Service Status

| Item                | Status  |
| ------------------- | ------- |
| RFQ Lifecycle       | Defined |
| Organization Response | Defined |
| Matching Record     | Defined |
| Communication Rules | Defined |
| Closing Rules       | Defined |
| Business Rules      | Defined |

# News & CMS Service

------

# 62. Purpose

News & CMS Service 负责平台内容全生命周期管理。

统一管理新闻资讯、技术文章、应用案例、展会信息及网站静态内容，为平台 SEO 与品牌运营提供内容支撑。

------

# 63. Module Mapping

## 对应前台页面

- 新闻资讯
- 技术中心
- 应用案例
- 展会活动
- 首页 Banner
- 关于我们
- 联系我们

## 对应后台页面

- 内容管理
- 新闻管理
- 应用案例管理
- Banner 管理
- 页面管理

## 主要数据表

- news
- article
- application_case
- banner
- page_content
- category

## 关联 Service

- File Service
- Search Service
- Notification Service
- Product Service（关联产品）
- Organization Service（关联企业）

------

# 64. Content Types

统一支持：

| 内容类型         | 用途                 |
| ---------------- | -------------------- |
| News             | 行业新闻             |
| Article          | 技术文章             |
| Application Case | 应用案例             |
| Exhibition       | 展会资讯             |
| Banner           | 首页轮播             |
| Static Page      | 关于我们、联系我们等 |

统一采用相同的发布流程。

------

# 65. Content Lifecycle

统一状态：

```
Draft

↓

Pending Review

↓

Published

↓

Offline

↓

Archived
```

所有内容均采用统一状态管理。

------

# 66. Content Creation

内容编辑可创建：

- 新闻
- 技术文章
- 应用案例
- 展会资讯

支持：

- 富文本编辑
- 封面图片
- SEO 信息
- 标签
- 分类

创建后默认状态：

```
Draft
```

------

# 67. Content Review & Publish

发布流程：

```
Draft

↓

Pending Review

↓

Published
```

平台管理员审核后：

自动记录：

- 发布时间
- 发布人
- 更新时间

------

# 68. Banner Management

首页 Banner 支持：

- 新增
- 编辑
- 排序
- 上下线
- 跳转链接

支持关联：

- 产品
- 新闻
- 应用案例
- 外部链接（可选）

------

# 69. Application Case

应用案例统一展示：

- 行业分类
- 检测对象
- 检测难点
- 解决方案
- 推荐产品
- 关联供应商

帮助采购用户快速了解产品应用场景。

------

# 70. SEO Management

所有内容支持维护：

- SEO Title
- SEO Description
- SEO Keywords
- 自定义 URL（Slug）

发布后同步提供给 Search Service 建立索引。

------

# 71. Content Association

内容可关联：

| 对象     | 用途       |
| -------- | ---------- |
| Product  | 推荐产品   |
| Organization | 企业介绍 |
| Category | 内容分类   |
| File     | 图片、附件 |
| Tag      | 内容标签   |

通过关联关系减少重复录入。

------

# 72. Homepage Content

首页内容由 CMS 统一配置：

包括：

- Banner
- 推荐产品
- 热门资讯
- 最新案例
- 推荐 Organization
- 行业分类入口

支持后台动态调整，无需修改代码。

------

# 73. Business Rules

统一规则：

- 发布内容必须完成审核
- 已发布内容可下线，不直接删除
- Banner 必须设置有效期（可选）
- 应用案例至少关联一个产品
- 所有内容支持逻辑删除

------

# 74. Service Status

| Item              | Status  |
| ----------------- | ------- |
| Content Lifecycle | Defined |
| News Management   | Defined |
| Banner Management | Defined |
| Application Case  | Defined |
| SEO Management    | Defined |
| Homepage Content  | Defined |
| Business Rules    | Defined |

# Search Service

------

# 75. Purpose

Search Service 提供平台统一的搜索、筛选和检索能力。

支持产品、供应商、新闻、应用案例等内容的统一搜索，并为产品中心提供参数筛选能力。

------

# 76. Module Mapping

## 对应前台页面

- 全站搜索
- 产品列表
- 产品筛选
- 供应商列表
- 新闻搜索

## 对应后台页面

- 搜索配置
- 热门搜索管理（可选）
- 搜索统计

## 主要数据表

- product
- supplier
- news
- application_case
- category
- parameter_value

## 关联 Service

- Product Service
- Organization Service
- News & CMS Service

------

# 77. Search Scope

统一支持：

| 搜索对象         | 说明     |
| ---------------- | -------- |
| Product          | 标准产品 |
| Organization     | 企业组织 |
| News             | 新闻资讯 |
| Application Case | 应用案例 |

后续可扩展至下载资料、视频等内容。

------

# 78. Product Search

产品搜索支持：

- 产品名称
- 产品型号
- 产品简介
- 品牌
- 分类

默认按照相关性排序，可结合发布时间进行优化。

------

# 79. Parameter Filtering

产品中心支持按参数筛选。

筛选条件来源于 Schema 2.0，例如：

- 产品类别
- 探头直径
- 工作长度
- 导向方式
- 图像分辨率
- 光源类型
- 防护等级

筛选项根据产品分类动态显示。

------

# 80. Category Navigation

分类导航统一采用：

```
一级分类

↓

二级分类

↓

产品列表
```

分类调整后：

搜索结果自动同步。

------

# 81. Keyword Search

关键词支持匹配：

- 标题
- 简介
- 标签
- 产品参数（可配置）

忽略大小写，支持中文连续匹配。

------

# 82. Search Suggestion

输入关键字时可返回：

- 产品名称
- 品牌
- 分类名称

建议最多返回：

```
10 条
```

用于提升检索效率。

------

# 83. Search Result Sorting

默认排序：

1. 相关性
2. 推荐产品
3. 发布时间

支持用户切换：

- 最新发布
- 名称排序

后续可扩展更多排序方式。

------

# 84. Search Statistics

记录：

- 搜索关键词
- 搜索次数
- 无结果关键词（可选）

统计数据用于优化内容建设，不影响用户搜索体验。

------

# 85. SEO Friendly URL

建议采用统一 URL 规则：

```
/products

/products/electronic-endoscope

/products?diameter=2.8

/news

/suppliers
```

保持 URL 简洁、稳定，便于搜索引擎收录。

------

# 86. Business Rules

统一规则：

- 已发布内容才参与搜索
- 下架内容自动移除索引
- 参数筛选统一来源于参数体系
- 分类变化后自动更新索引
- 搜索结果分页返回

------

# 87. Service Status

| Item                | Status  |
| ------------------- | ------- |
| Search Scope        | Defined |
| Product Search      | Defined |
| Parameter Filtering | Defined |
| Category Navigation | Defined |
| Search Suggestion   | Defined |
| Search Statistics   | Defined |
| SEO URL             | Defined |
| Business Rules      | Defined |

# File & Media Service

------

# 88. Purpose

File & Media Service 负责平台所有文件与媒体资源的统一管理。

所有图片、文档及附件均通过本服务管理，不由业务模块直接保存。

------

# 89. Module Mapping

## 对应前台页面

- 产品详情图片
- 产品资料下载
- 企业 Logo
- 新闻封面
- Banner
- 应用案例图片

## 对应后台页面

- 文件管理
- 媒体资源库
- 上传中心

## 主要数据表

- file
- media_folder（可选）
- file_reference

## 关联 Service

- Product Service
- Organization Service
- News & CMS Service
- Demand Service

------

# 90. Supported File Types

统一支持：

| 类型             | 用途             |
| ---------------- | ---------------- |
| JPG / PNG / WebP | 产品、新闻、Logo |
| PDF              | 产品说明书、资料 |
| XLSX             | 数据导入         |
| CSV              | 数据导出         |
| ZIP              | 批量资料（可选） |

默认禁止上传可执行文件。

------

# 91. Upload Process

统一流程：

```
Upload

↓

Validation

↓

Virus Scan（预留）

↓

Storage

↓

Generate Metadata

↓

Return File ID
```

业务模块仅保存 File ID。

------

# 92. File Metadata

统一维护：

- 文件名称
- 文件类型
- 文件大小
- MIME Type
- 上传时间
- 上传用户
- Storage Path
- 引用次数

不保存业务信息。

------

# 93. File Reference

文件与业务对象通过引用关系关联。

例如：

| 业务对象    | 文件用途         |
| ----------- | ---------------- |
| Product     | 产品图片、说明书 |
| Organization | Logo、资质图片  |
| News        | 封面图           |
| Banner      | 首页轮播图       |
| Demand      | 技术附件         |

支持一个文件被多个业务对象引用。

------

# 94. Image Processing

图片上传后建议自动生成：

- 原图
- 缩略图
- 列表图（可选）

前台根据页面自动选择合适尺寸，减少加载时间。

------

# 95. Download Rules

PDF 等资料支持：

- 公开下载
- 登录后下载
- 指定角色下载

下载策略由业务模块决定。

------

# 96. File Deletion

删除前检查：

- 是否仍被引用
- 是否存在关联业务

仍被引用时：

禁止物理删除。

建议采用：

逻辑删除 + 定期清理。

------

# 97. Storage Strategy

存储接口统一抽象。

支持：

- 本地存储（开发）
- Cloudflare R2
- Amazon S3
- 其他兼容对象存储

业务模块无需感知存储实现。

------

# 98. Business Rules

统一规则：

- 文件上传后生成唯一 File ID
- 所有业务模块通过 File ID 引用
- 禁止重复上传相同资源（可选去重）
- 文件删除需校验引用关系
- 下载记录可统计（可选）

------

# 99. Service Status

| Item             | Status  |
| ---------------- | ------- |
| Upload Process   | Defined |
| File Metadata    | Defined |
| File Reference   | Defined |
| Image Processing | Defined |
| Download Rules   | Defined |
| Storage Strategy | Defined |
| Business Rules   | Defined |

# Notification Service

------

# 100. Purpose

Notification Service 提供平台统一的业务通知能力。

所有系统通知、审核通知、采购响应通知、询价通知均通过本服务发送。

本服务定位为**事件通知中心**，不替代即时通讯软件。

------

# 101. Module Mapping

## 对应前台页面

- 消息中心
- 我的通知
- 系统公告（可选）

## 对应后台页面

- 消息管理
- 通知模板
- 系统公告

## 主要数据表

- notification
- notification_template
- notification_receiver
- announcement（可选）

## 关联 Service

- Product Service
- Organization Service
- Demand Service
- RFQ Service
- Authentication Service

------

# 102. Notification Types

统一支持：

| 类型        | 用途         |
| ----------- | ------------ |
| System      | 系统通知     |
| Review      | 审核通知     |
| Demand      | 采购需求通知 |
| RFQ         | 询价通知     |
| Organization | 企业通知    |
| Product     | 产品通知     |

后续可扩展更多类型。

------

# 103. Trigger Events

建议触发事件包括：

- 产品审核通过
- 产品审核退回
- 企业认证通过
- 企业认证退回
- 收到新的采购需求响应
- 收到新的询价
- 收到供应商回复
- 管理员公告发布

所有事件采用统一事件模型。

------

# 104. Delivery Strategy

默认通知方式：

```
站内消息
```

预留扩展：

- 邮件通知
- 企业微信
- 短信（按需）
- Webhook（开放平台）

扩展不影响现有业务逻辑。

------

# 105. Message Lifecycle

统一状态：

```
Created

↓

Delivered

↓

Read

↓

Archived
```

用户可标记已读。

历史消息默认保留。

------

# 106. Notification Content

统一包含：

- 标题
- 内容摘要
- 跳转链接（可选）
- 来源模块
- 创建时间
- 已读状态

避免存储冗余业务数据。

------

# 107. Announcement

平台公告用于：

- 系统维护通知
- 功能更新
- 展会活动
- 平台运营信息

支持：

- 发布时间
- 生效时间
- 失效时间（可选）

------

# 108. Business Rules

统一规则：

- 消息不可修改
- 已发送消息不可撤回（后台公告除外）
- 删除采用逻辑删除
- 同一事件避免重复推送
- 用户仅能查看自己的通知

------

# 109. Service Status

| Item               | Status  |
| ------------------ | ------- |
| Notification Types | Defined |
| Trigger Events     | Defined |
| Delivery Strategy  | Defined |
| Message Lifecycle  | Defined |
| Announcement       | Defined |
| Business Rules     | Defined |

# Dashboard Service

------

# 110. Purpose

Dashboard Service 提供后台首页统一数据概览。

根据不同角色展示对应的统计信息、待办事项和快捷入口。

Dashboard 不直接维护业务数据，仅聚合各业务 Service 的统计结果。

------

# 111. Module Mapping

## 对应前台页面

无

## 对应后台页面

- Dashboard 首页
- 数据概览
- 待办中心

## 主要数据来源

- product
- supplier
- requirement
- news
- notification
- user

## 关联 Service

- Product Service
- Organization Service
- Demand Service
- News & CMS Service
- Notification Service

------

# 112. Dashboard Layout

后台首页建议分为：

```
顶部统计卡片

↓

待办事项

↓

业务统计图表

↓

快捷入口

↓

最近动态
```

布局保持响应式设计。

------

# 113. Statistics Cards

默认统计：

| 指标       | 来源        |
| ---------- | ----------- |
| 产品总数   | Product     |
| 组织总数   | Organization |
| 已发布需求 | Demand      |
| 新闻数量   | CMS         |
| 待审核内容 | 各业务模块  |

统计结果采用缓存，提高加载速度。

------

# 114. Pending Tasks

根据角色展示：

平台管理员：

- 待审核产品
- 待审核企业
- 待审核采购需求
- 待发布内容

Organization 用户：

- 待完善产品
- 被退回产品
- 最新询价
- 新通知

采购用户：

- 我的采购需求
- 最新响应
- 未读通知

------

# 115. Business Charts

建议提供：

- 产品增长趋势
- 企业入驻趋势
- 采购需求趋势
- 新闻发布趋势

图表数据默认按：

- 7 天
- 30 天
- 90 天

进行统计。

------

# 116. Quick Actions

根据角色显示快捷入口。

平台管理员：

- 新建新闻
- 审核产品
- 审核企业
- 发布公告

供应商：

- 发布产品
- 编辑企业资料
- 查看询价

采购用户：

- 发布采购需求
- 查看响应
- 浏览产品

------

# 117. Recent Activities

统一展示：

- 最新产品发布
- 最新企业入驻
- 最新采购需求
- 最新新闻
- 最近通知

按时间倒序排列。

------

# 118. Performance Requirements

Dashboard 首页建议：

- 首屏响应时间 ≤ 2 秒
- 图表异步加载
- 统计结果支持缓存
- 不阻塞后台其他操作

------

# 119. Business Rules

统一规则：

- 不直接写入业务数据
- 统计数据来源于各业务模块
- 权限控制与角色一致
- 图表仅展示有权限的数据
- 支持后续增加更多统计组件

------

# 120. Service Status

| Item                     | Status  |
| ------------------------ | ------- |
| Dashboard Layout         | Defined |
| Statistics Cards         | Defined |
| Pending Tasks            | Defined |
| Business Charts          | Defined |
| Quick Actions            | Defined |
| Recent Activities        | Defined |
| Performance Requirements | Defined |
| Business Rules           | Defined |

# Business Service Integration & Repository Delivery

------

# 121. Purpose

本章节定义 Business Service 的统一集成规范。

确保所有业务模块遵循一致的调用方式、目录结构和交付标准，为后续开发、测试和部署提供统一依据。

------

# 122. Service Dependency

Business Service 推荐依赖关系：

```
API Layer（502）

↓

Authentication（504）

↓

Business Service（505）

↓

Repository

↓

Database（400）
```

业务模块之间允许调用公开 Service，不允许直接访问其他模块的数据表。

------

# 123. Cross-Service Collaboration

推荐协作关系：

| 来源 Service | 调用目标     | 用途           |
| ------------ | ------------ | -------------- |
| Demand       | Product      | 匹配标准产品   |
| Demand       | Organization | 匹配供给组织   |
| Product      | File         | 产品图片、资料 |
| News & CMS   | File         | 封面图、Banner |
| Product      | Notification | 审核通知       |
| Organization | Notification | 企业认证通知   |

避免形成循环依赖。

------

# 124. Business Event Flow

典型业务流程：

```
平台维护标准产品

↓

Product Service

↓

审核通过

↓

Notification Service

↓

Search Service 更新索引

↓

前台可搜索、可展示
```

各模块通过统一业务事件协同，不共享内部实现。

------

# 125. Repository Directory

建议业务目录：

```
backend/

├── product/
├── organization/
├── demand/
├── rfq/
├── cms/
├── search/
├── file/
├── notification/
├── dashboard/
└── shared/
```

公共能力统一放入 `shared/`。

------

# 126. Coding Convention

统一要求：

- 一个 Service 对应一个业务域
- DTO 与 Entity 分离
- Repository 不包含业务逻辑
- Validator 独立维护
- Service 返回统一业务对象

------

# 127. Transaction Principle

涉及多个业务模块时：

- 优先保证单模块事务完整
- 跨模块通过业务事件协调
- 避免长事务
- 失败时记录日志并支持重试（预留）

------

# 128. Integration Checklist

所有业务模块上线前确认：

□ API 已定义（502）

□ 权限已配置（504）

□ 数据表已完成（400）

□ 错误码已注册（506）

□ 测试已通过（507）

------

# 129. Repository Deliverables

505 最终交付：

- Product Service
- Organization Service
- Demand Service
- RFQ Service
- News & CMS Service
- Search Service
- File & Media Service
- Notification Service
- Dashboard Service
- Integration Specification

------

# 130. Acceptance Criteria

完成后应满足：

- 所有业务功能均有对应 Service
- 所有页面均可映射到 Service
- Service 与 API、数据库关系明确
- 权限控制统一
- 模块可独立维护与扩展

------

# 131. Final Status

| Item                 | Status  |
| -------------------- | ------- |
| Service Architecture | Defined |
| Module Integration   | Defined |
| Event Flow           | Defined |
| Directory Convention | Defined |
| Coding Convention    | Defined |
| Acceptance Criteria  | Defined |
| Repository Delivery  | Defined |

------

# 132. 505 Document Completion

Document：

```
505_Backend_Business_Service
```

Version：

```
V1.0
```

Status：

```
FINAL
```

Completion：

```
100%
```
