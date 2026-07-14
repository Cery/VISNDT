# 315 Product Database API UI Mapping

本文档用于建立 `VISNDT Blueprint v1.0` 中：

`Product -> Database -> API -> Frontend`

的唯一映射规则。

如果其他文档在 Product、Offer、Demand、RFQ 的跨层映射上出现冲突，以本文件为桥接基线。

---

## 1. Mapping Principle

### 1.1 Single Source Rule

跨层映射必须遵循以下顺序：

`Business Definition -> Product Model -> Database Entity -> API Resource -> Frontend State/UI`

### 1.2 Core Boundary Rule

必须明确以下边界：

1. `Standard Product` 由平台维护。
2. `Offer` 由 `Organization` 创建。
3. `Organization` 不拥有 `Product` 主数据。
4. `Demand` 与 `RFQ` 是独立业务对象。
5. 前端页面不得把 `Offer` 误建模为 `Supplier Product`。

---

## 2. Standard Product Mapping

### 2.1 Product Definition

`Standard Product` 定义为：

**Platform Managed Standard Product**

它是平台统一维护的标准产品主数据，不属于单个供应商或组织。

### 2.2 Database Mapping

产品主实体映射到：

`standard_product`

相关主数据还包括：

- `product_category`
- `product_sub_category`
- `product_family`
- `product_series`

### 2.3 API Mapping

产品 API 层负责：

1. Category 查询
2. Standard Product 列表查询
3. Standard Product 详情查询
4. Product Compare
5. Product Search 与 Filter 输入适配

推荐资源语义：

- `Product API`
- `Category API`
- `Product Detail API`

### 2.4 Frontend Mapping

前端消费结果必须进入：

`Product Detail UI`

主要包括：

1. Product List
2. Product Detail
3. Product Compare
4. Product Search Result
5. Demand Entry from Product

### 2.5 Fixed Rule

必须明确：

- Product Detail UI 展示的是平台标准产品。
- Organization/Offer 信息是供给层补充，不改变 Product 主数据归属。

---

## 3. Parameter System Mapping

## 3.1 Parameter Definition

参数定义层映射如下：

`Parameter Definition -> parameter_definition`

职责：

1. 定义参数名称
2. 定义参数类型
3. 定义单位
4. 定义筛选能力
5. 定义比较能力
6. 定义前端渲染元数据

## 3.2 Parameter Template

参数模板层映射如下：

`Parameter Template -> parameter_template`

职责：

1. 定义某类产品需要哪些参数
2. 定义参数分组
3. 定义显示顺序
4. 定义是否必填

## 3.3 Product Parameter Value

产品参数值层映射如下：

`Product Parameter Value -> product_parameter_value`

职责：

1. 保存某个标准产品的具体参数值
2. 支持搜索过滤
3. 支持产品对比
4. 支持需求预填充

## 3.4 Frontend Parameter Mapping

前端参数消费必须遵循：

`Parameter Metadata -> Renderer -> Dynamic Parameter Table`

进一步展开为：

`parameter_definition + parameter_template + product_parameter_value`

↓

`Parameter Metadata`

↓

`Frontend Renderer`

↓

`Dynamic Parameter Table / Dynamic Filter / Dynamic Form`

### 3.5 Prohibited Modeling

前端不得将参数系统写死为固定字段集合，例如：

- Diameter
- Length
- Resolution

这些字段只能作为具体产品族样例，不能作为统一产品参数模型。

---

## 4. Offer Mapping

## 4.1 Offer Definition

必须明确：

`Organization creates Offer`

不是：

`Supplier owns Product`

Offer 表示组织围绕平台标准产品提供的供应信息。

### 4.2 Database Mapping

供给主实体映射到：

`offer`

Offer 必须引用：

1. `organization`
2. `standard_product`

### 4.3 API Mapping

Offer API 负责：

1. Offer 创建
2. Offer 更新
3. Offer 查询
4. Offer 状态管理
5. Offer 与 RFQ 的引用关系

### 4.4 Frontend Mapping

前端供给侧必须进入：

`Organization UI`

主要包括：

1. Organization Dashboard
2. Offer Management
3. Offer Detail / Offer Edit
4. RFQ Inbox
5. Response Management

### 4.5 Product vs Offer Boundary

必须冻结以下边界：

#### Product

- 平台主数据
- 标准化信息
- 可搜索、可比较、可复用

#### Offer

- 组织供给
- 商业与交付属性
- 与 RFQ、响应、通知直接关联

结论：

**Product 是平台标准主数据；Offer 是组织围绕标准产品提供的供给。**

---

## 5. Demand RFQ Workflow Notification Frontend State Mapping

## 5.1 Demand Definition

`Demand` 是采购需求对象。

Demand 可以来源于：

1. 用户自主提交
2. 从 Product 详情进入的需求转化
3. 从搜索结果进入的需求转化

### 5.2 RFQ Definition

`RFQ` 是围绕 Demand、Product、Offer 形成的询报价流程对象。

RFQ 不等于 Demand，也不等于 Offer。

### 5.3 Cross Layer Mapping

核心业务映射必须遵循：

`Demand`

↓

`RFQ`

↓

`Workflow`

↓

`Notification`

↓

`Frontend State`

### 5.4 Database Mapping

推荐的数据库职责如下：

- `demand*`：需求主数据与状态
- `rfq*`：询报价主数据与状态
- `workflow*`：流程实例与节点
- `notification*`：通知消息

### 5.5 API Mapping

API 层必须区分：

1. Demand API
2. RFQ API
3. Workflow API
4. Notification API

### 5.6 Frontend State Mapping

前端状态必须分层表达：

1. Demand State
2. RFQ State
3. Workflow State
4. Notification State

前端不得把这些状态混成单一 “询价状态” 或 “需求状态”。

---

## 6. AI Development Rule

AI 在读取 Blueprint 并生成 API、数据库、前端页面时，必须遵循以下映射：

1. `Standard Product` 对应平台标准主数据
2. `Offer` 对应组织供给，不是供应商自有产品
3. 参数前端渲染必须由元数据驱动
4. `Demand -> RFQ -> Workflow -> Notification -> Frontend State` 是唯一业务链路

如果其他历史文档出现：

- Supplier owns Product
- Fixed Parameter Fields
- Requirement 等同 RFQ

均以本文件为修正依据。
