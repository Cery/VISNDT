# Product Workflow & Permission

Document ID

206

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Workflow 用于管理 Product 全生命周期。

Permission 用于控制不同角色可执行的操作。

Workflow 决定：

产品当前处于什么状态。

Permission 决定：

谁可以执行什么操作。

二者职责独立。

---

# 2. Workflow Principles

所有 Product：

必须经过 Workflow。

禁止：

直接发布。

禁止：

直接修改 Published Product。

所有变更：

必须保留：

审批。

日志。

版本。

操作人。

时间。

---

# 3. Product Lifecycle

Planning

↓

Draft

↓

Pending Review

↓

Approved

↓

Published

↓

Revision

↓

Deprecated

↓

Archived

任何状态转换：

均记录 Workflow History。

---

# 4. State Description

Planning

产品规划。

Draft

产品编辑。

Pending Review

等待审核。

Approved

审核通过。

Published

正式发布。

Revision

新版本修订。

Deprecated

停止推荐。

Archived

历史归档。

禁止：

物理删除。

---

# 5. Workflow Action

支持：

Create

Edit

Submit

Approve

Reject

Publish

Revise

Rollback

Deprecate

Archive

Restore

Clone

Export

Import

Compare

Preview

每个 Action：

均记录：

Operator

Time

Comment

Version

---

# 6. Workflow Node

Draft

↓

Product Manager Review

↓

Technical Review

↓

QA Review

↓

Publish Review

↓

Published

平台可根据业务：

启用或关闭节点。

---

# 7. Version Policy

Published Product：

不可直接编辑。

修改流程：

Published

↓

Create Revision

↓

Review

↓

Publish New Version

旧版本：

自动保留。

支持：

回滚。

比较。

审计。

---

# 8. Permission Principles

权限采用：

RBAC（Role-Based Access Control）。

角色控制：

菜单。

页面。

接口。

按钮。

数据。

所有接口：

必须校验权限。

---

# 9. Platform Roles

第一阶段冻结：

Super Administrator

Platform Administrator

Product Administrator

Product Editor

Reviewer

Auditor

AI Administrator

Statistics Administrator

Readonly User

---

# 10. Organization Roles

Supplier Administrator

Supplier Editor

Supplier Sales

Supplier Viewer

Organization 角色：

不能修改 Product。

只能：

引用。

申请新增。

提交纠错。

维护 Offer。

---

# 11. Permission Matrix

Super Administrator：

全部权限。

Platform Administrator：

平台管理。

Product Administrator：

产品维护。

Product Editor：

编辑。

Reviewer：

审核。

Auditor：

审计。

Supplier：

Offer。

Readonly：

浏览。

---

# 12. Product Permission

Create Product

Platform Only

Edit Product

Platform Only

Delete Product

Forbidden

Publish Product

Reviewer

Approve Product

Reviewer

Archive Product

Administrator

Restore Product

Administrator

Clone Product

Administrator

Export Product

Authorized

Import Product

Administrator

---

# 13. Offer Permission

Supplier：

Create Offer

Edit Offer

Disable Offer

Delete Own Draft Offer

Upload Image

Upload Attachment

不能：

修改：

Product。

Category。

Parameter Definition。

Capability Definition。

Feature Definition。

---

# 14. Knowledge Permission

Organization：

可创建：

Knowledge。

必须：

关联：

Product。

审核通过：

公开。

否则：

组织内部可见。

---

# 15. Dictionary Permission

Dictionary：

平台维护。

Organization：

只读。

禁止：

修改：

单位。

行业。

材料。

检测方法。

缺陷。

分类。

---

# 16. Workflow Audit

记录：

Before

After

Operator

Role

IP

Device

Browser

Comment

Approval Opinion

Timestamp

Audit：

永久保留。

---

# 17. Notification

Workflow 支持：

站内消息。

邮件。

Webhook（预留）。

未来预留：

企业微信。

钉钉。

Slack。

通知不影响 Workflow。

---

# 18. Security

Published Product：

禁止覆盖。

禁止删除。

禁止绕过 Workflow。

所有修改：

生成：

Audit Log。

Version。

Operation Log。

---

# 19. API Permission

所有 Product API：

统一：

JWT Authentication。

RBAC。

Permission Middleware。

Audit Middleware。

API 不允许：

绕过权限。

---

# 20. Future Extension

Release 2.x：

预留：

ABAC（Attribute-Based Access Control）

Approval Policy Engine

Multi-stage Approval

Conditional Workflow

Workflow Template

Workflow Designer

Approval Delegation

均不影响第一阶段设计。