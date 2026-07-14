# 610 Supplier Workflow UI

本文档用于补充 `VISNDT Blueprint v1.0` 的供应侧业务闭环 UI 设计基线。

本文档中的页面语义必须统一收敛为：

`Organization + Offer`

而不是旧模型中的：

`Supplier owns Product`

---

## 1. Position

`Supplier / Organization Dashboard` 是供应侧工作台入口。

它用于承接以下业务闭环：

`Organization Profile`

↓

`Offer Management`

↓

`RFQ Inbox`

↓

`Response Management`

↓

`Notification Center`

---

## 2. Core Rule

### 2.1 Unified Model

供应侧页面语义统一为：

`Supplier 页面语义 -> Organization + Offer 模型`

### 2.2 Explicit Prohibition

明确禁止：

`Supplier 自建 Product`

供应侧页面允许管理的是：

1. Organization Profile
2. Offer
3. RFQ Response
4. Notification

不允许管理的是：

1. 标准产品主数据定义
2. Product 分类与参数主模型

---

## 3. Supplier Organization Dashboard

### 3.1 Dashboard Position

Dashboard 是 Organization 用户登录后的主入口。

### 3.2 Dashboard Must Include

必须包含：

- Organization Profile
- Offer Management
- RFQ Inbox
- Response Management
- Notification Center

### 3.3 Dashboard Summary Area

建议聚合展示：

1. Organization 审核状态
2. Offer 数量与状态
3. 待处理 RFQ 数量
4. 待发送或待确认 Response 数量
5. 未读通知数量

---

## 4. Organization Profile

### 4.1 Scope

Organization Profile 负责：

1. 企业基础资料
2. 联系方式
3. 资质与认证信息
4. Logo 与附件
5. Organization 状态

### 4.2 Boundary

Organization Profile 不负责：

1. 标准产品创建
2. 标准产品分类维护
3. 参数主模板维护

---

## 5. Offer Management

### 5.1 Scope

Offer Management 负责：

1. 基于平台标准产品创建 Offer
2. 编辑 Offer 商业属性
3. 查看 Offer 状态
4. 管理 Offer 附件与可见性

### 5.2 Data Rule

Offer 页面必须体现：

1. Offer 引用 `Standard Product`
2. Offer 属于 `Organization`
3. Offer 是供应信息，不是产品主数据

### 5.3 UI Rule

Offer UI 必须区分：

1. 标准产品信息区
2. Organization 供给信息区
3. Offer 商业与交付信息区

---

## 6. RFQ Inbox

### 6.1 Scope

RFQ Inbox 负责：

1. 查看分配给本 Organization 的 RFQ
2. 查看 RFQ 状态
3. 查看关联 Product / Offer / Demand 上下文
4. 进入响应处理页面

### 6.2 RFQ List Must Show

建议至少展示：

1. RFQ ID
2. Demand 摘要
3. 关联 Product
4. 关联 Offer
5. 当前状态
6. 截止时间

---

## 7. Response Management

### 7.1 Scope

Response Management 负责：

1. 创建 Response
2. 编辑报价与说明
3. 上传附件
4. 查看响应历史
5. 查看提交状态

### 7.2 Workflow Relationship

Response Management 必须与：

- RFQ State
- Workflow State
- Notification State

保持一致。

---

## 8. Notification Center

### 8.1 Scope

Notification Center 负责：

1. RFQ 到达通知
2. 状态变更通知
3. 审核与处理通知
4. 组织资料与 Offer 相关通知

### 8.2 Channel

MVP 以以下通知形式为主：

1. 站内通知
2. 邮件通知

---

## 9. Frontend State Rule

供应侧前端状态至少应拆分为：

1. Organization State
2. Offer State
3. RFQ Inbox State
4. Response State
5. Notification State

不得将这些状态混成单一 “Supplier State”。

---

## 10. Responsive Rule

本工作流文档默认遵循 Blueprint v1.0 的响应式 Web 基线。

要求：

1. 单代码库
2. Responsive Web
3. 适配桌面端与移动端工作台场景

移动端优先覆盖：

1. RFQ Inbox 浏览
2. Notification 查看
3. Response 状态跟踪

---

## 11. Final Decision

`VISNDT Blueprint v1.0` 的供应侧 UI 冻结规则如下：

1. 供应侧页面语义统一为 `Organization + Offer`
2. Organization 负责企业资料
3. Offer 负责供给信息
4. RFQ Inbox 负责收件与处理入口
5. Response Management 负责供应响应
6. Notification Center 负责消息闭环
7. 明确禁止 Supplier 自建 Product

如果其他历史文档出现 “Supplier Product” 主模型表达，以本文件为修正依据。
