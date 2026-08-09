# 304_M14_Task_Decomposition_Report

**日期**: 2026-08-08  
**任务编号**: M14.0.1 Freeze Delta & Task Decomposition  
**定位**: M14 开发前任务分层、执行顺序与首任务定义  
**前置基线**:

- `301_M14_Pre_Development_Audit_Report.md`
- `302_M14启动上下文 V2.0 Final.md`
- `303_M14_Freeze_Delta_Report.md`

---

## 0. 拆解结论总览

M14 不应再按“功能堆叠”推进，而应按 **基线统一 -> 角色入口 -> 闭环补口 -> 内容中心 -> 知识库 -> AI增强** 的顺序推进。

本次拆解将任务分为：

- **P0**：必须先做，否则 M14 继续失真
- **P1**：可在闭环成立后进入
- **P2**：后置增强，不进入首轮执行

---

## 1. 拆解原则

本次任务拆解遵守以下约束：

1. 不新增未经批准功能
2. 不引入新框架
3. 不做 Supplier Store / 独立商城 / 公开价格 / 支付交易
4. 优先复用现有模型与 API
5. Supplier 必须进入 `apps/web` 的平台内工作台，而不是独立前台
6. 在角色入口与内容范围未冻结前，不先扩数据库

---

## 2. P0 / P1 / P2 总表

| 优先级 | 任务编号 | 任务名称 | 目标 |
|---|---|---|---|
| P0 | M14.1.1 | Workspace Role & Navigation Foundation | 建立角色上下文与平台内角色化入口 |
| P0 | M14.1.2 | Supplier Workspace Entry Skeleton | 在 `workspace` 内建立 Supplier 入口骨架 |
| P0 | M14.2.1 | RFQ Response Web Submission Flow | 补齐 Supplier 响应 RFQ 的前台闭环 |
| P0 | M14.2.2 | Notification Center | 将现有通知 API 正式产品化 |
| P0 | M14.2.3 | Inquiry Recovery & Route Gap Cleanup | 修复公开询价假闭环与缺失路由问题 |
| P1 | M14.3.1 | Content Center Foundation | 把静态内容页升级为可持续内容入口 |
| P1 | M14.3.2 | Content Admin Operating Entry | 给内容维护建立最小运营入口 |
| P1 | M14.4.1 | Parameter Knowledge Entry | 以现有参数体系建立知识解释入口 |
| P2 | M14.5.1 | AI Drafting Assist | 内容初稿、参数解释辅助、字段检查 |
| P2 | M14.5.2 | Matching Explanation Enhancement | 匹配解释与辅助说明增强 |

---

## 3. P0 任务拆解

### M14.1.1 Workspace Role & Navigation Foundation

**目标**

把当前“全部用户都按 BUYER 处理”的工作台，升级为可承载 Buyer / Supplier / Admin 入口分流的统一骨架。

**为何必须先做**

- 当前 `RoleGuard` 仍写死 `BUYER`
- 当前 `AuthUser` 只有 `organizationId`，没有角色上下文
- 不先统一角色入口，Supplier 相关页面无法正确挂载

**当前代码事实**

- `apps/web/src/auth/RoleGuard.tsx` 未实现真实角色判断
- `apps/web/src/services/auth.service.ts` 的 `AuthUser` 不含角色信息
- `apps/api/src/auth/interfaces/auth-request.interface.ts` 当前只暴露 `id/email/name/organizationId`

**推荐范围**

- `apps/web/src/auth/*`
- `apps/web/src/components/workspace/*`
- `apps/web/src/app/workspace/*`
- 如角色上下文无法从现有 `/auth/me` 获得，则提交单独受控 API 补充方案

**冻结判断**

- 首选：Web 层完成
- 条件性：若必须暴露角色上下文，则对 `apps/api/auth` 做最小受控补充
- 禁止：直接重构权限模型或扩库

**完成标准**

1. Buyer / Supplier 至少能被前端识别
2. `workspace` 导航可按角色切换
3. 不出现独立 Supplier Store / `/supplier/*` 商城体系

---

### M14.1.2 Supplier Workspace Entry Skeleton

**目标**

在 `apps/web` 的 `workspace` 内建立 Supplier 工作台骨架，而不是再往 Admin 里塞前台业务。

**范围**

- Supplier 首页/概览
- Supplier 导航入口
- 待响应 RFQ 入口
- 已提交 Response 入口
- Offer 入口占位
- 组织资料入口

**依赖**

- 必须依赖 `M14.1.1`

**完成标准**

1. Supplier 登录后有平台内可见入口
2. Buyer / Supplier 菜单分流清晰
3. 不引入店铺、装修、公开商品橱窗

---

### M14.2.1 RFQ Response Web Submission Flow

**目标**

把当前 API 已有、Buyer 只读可见但 Supplier 无法提交的 RFQ Response，补成真实 Web 闭环。

**当前代码事实**

- 后端已有 `POST /rfqs/:id/responses`
- 后端已有 `PATCH /rfq-responses/:id`
- Web 目前只有 RFQ detail 中的响应列表展示

**范围**

- Supplier 端 RFQ 列表 -> 详情 -> 创建 Response
- Supplier 端已提交 Response 查看 / 再编辑
- Buyer 端 RFQ 详情继续查看响应结果

**完成标准**

1. Supplier 可以在 Web 提交 Response
2. Response 与 RFQ 状态流转能在前台体现
3. 不新增交易支付逻辑

---

### M14.2.2 Notification Center

**目标**

将已存在的 Notification API 从“只有未读数徽标”升级为正式页面能力。

**当前代码事实**

- Sidebar 已有 `/workspace/notifications` 菜单
- `app/workspace/notifications/page.tsx` 不存在
- Web 已有 `getNotifications / markAsRead / markAllAsRead`

**范围**

- 通知列表页
- 单条已读
- 全部已读
- 分页与空态

**完成标准**

1. 侧边栏链接不再落空
2. 未读数与列表页一致
3. 不扩展成后台消息运营系统

---

### M14.2.3 Inquiry Recovery & Route Gap Cleanup

**目标**

先把当前“假闭环”入口修复到真实可用，再继续新功能。

**当前代码事实**

- 产品详情页未向 `InquirySection` 传 `organizationId` / `offerId`
- `ManufacturerInfo` 目前传的是 `organization={null}`
- RFQ detail 有编辑按钮但路由不存在
- Demand / RFQ 搜索框只保存输入，不参与查询

**子项**

1. 修复公开询价入口
2. 处理 `/workspace/rfqs/[id]/edit` 缺页问题
3. 处理 Demand / RFQ 列表假搜索

**完成标准**

1. 公开询价可真实提交
2. 工作台不存在“点进去 404/无行为”的按钮
3. 列表页搜索要么真实接线，要么明确下线占位 UI

---

## 4. P1 任务拆解

### M14.3.1 Content Center Foundation

**目标**

把 `about / business / knowledge / solutions` 从静态说明页升级为内容资产入口。

**推荐最小范围**

- 内容中心列表页
- 内容详情页
- 内容分类 / 标签
- 最小 SEO 字段设计
- 与产品 / 参数预留关联位

**边界**

- 不先做复杂 CMS
- 不先做大规模内容建模
- 优先先定义产品入口和路由结构

---

### M14.3.2 Content Admin Operating Entry

**目标**

给平台建立最小的内容维护入口，支撑内容中心一期运行。

**建议**

- 优先在 `apps/admin` 做最小内容维护入口
- 若模型未冻结，先做结构设计与字段清单，不直接扩库

**依赖**

- 依赖 `M14.3.1`

---

### M14.4.1 Parameter Knowledge Entry

**目标**

复用当前参数体系，把参数从“匹配字段”升级为“解释型知识入口”。

**当前事实基础**

- `ParameterGroup`
- `ParameterDefinition`
- `ParameterOption`
- `ProductParameterDefinition`
- `ProductParameterValue`
- `DemandParameter`

**建议顺序**

1. 先做参数解释卡片 / 参数详情页
2. 再做与产品 / 类目 / 内容的关联
3. 最后再决定是否需要新增外层模型

---

## 5. P2 任务拆解

### M14.5.1 AI Drafting Assist

**范围**

- 内容初稿辅助
- 参数解释初稿辅助
- SEO 标题 / 摘要辅助
- 产品资料完整性检查

**为何后置**

当前平台首先缺的是产品化入口，不是 AI 能力本身。

---

### M14.5.2 Matching Explanation Enhancement

**范围**

- 匹配结果解释文案
- Buyer 端匹配理由可视化
- 供应商响应优先级辅助说明

**为何后置**

在 Supplier 入口和 RFQ Response 闭环未建成前，解释增强收益有限。

---

## 6. 执行顺序建议

### Phase 1：M14.0 已完成

- `303_M14_Freeze_Delta_Report.md`
- `304_M14_Task_Decomposition_Report.md`

### Phase 2：首轮必须执行

1. `M14.1.1 Workspace Role & Navigation Foundation`
2. `M14.1.2 Supplier Workspace Entry Skeleton`
3. `M14.2.1 RFQ Response Web Submission Flow`
4. `M14.2.2 Notification Center`
5. `M14.2.3 Inquiry Recovery & Route Gap Cleanup`

### Phase 3：闭环建立后进入

1. `M14.3.1 Content Center Foundation`
2. `M14.3.2 Content Admin Operating Entry`
3. `M14.4.1 Parameter Knowledge Entry`

### Phase 4：增强与优化

1. `M14.5.1 AI Drafting Assist`
2. `M14.5.2 Matching Explanation Enhancement`

---

## 7. 第一条开发任务定义

### 推荐任务编号

`M14.1.1 Workspace Role & Navigation Foundation`

### 推荐原因

这是当前所有 P0 的总前置：

- 不先解决角色上下文，Supplier 入口没法正确建立
- 不先解决统一导航，后续 RFQ Response / Notification / Offer 页面会继续散落
- 不先明确平台内工作台边界，就容易回到“Supplier 做成独立商城”这条错误路径

### 本任务建议只做四件事

1. 识别 Buyer / Supplier 角色来源
2. 修正 `RoleGuard`
3. 统一 `workspace` 导航骨架
4. 为 Supplier 菜单预留正式入口

### 本任务明确不做

1. 不扩数据库
2. 不做 Supplier Store
3. 不上支付 / 公开价格
4. 不同步启动内容中心

---

## 8. 风险与依赖

### High

1. **角色上下文来源不足**
   当前 `/auth/me` 无角色信息，若不先解决，前端只能继续猜角色。

2. **继续按旧 Freeze 文档推进**
   会导致任务误以为 database / api 仍处于原始冻结态。

3. **任务顺序错位**
   如果先做内容中心或 Buyer 页增强，会继续累积“后端有能力、Web 无闭环”的问题。

### Medium

4. **前端假入口遗留**
   Notification、RFQ edit、Inquiry 等入口若不先清理，会影响 M14 第一批验收质量。

5. **范围蔓延**
   Supplier 工作台容易被误做成独立商城，必须持续用 301/302 约束。

---

## 9. Build 与执行说明

本报告是任务拆解文档，不执行业务改动：

- 未执行 build
- 未执行测试
- 未执行迁移

后续每个开发任务执行后，仍需按固定格式输出：

1. 修改文件
2. 修改原因
3. 架构影响
4. 数据库影响
5. API 影响
6. Build 结果
7. Freeze 检查
8. Review 报告路径

---

## 10. 最终结论

M14 的任务顺序现在已经可以统一为：

> **先角色与入口，再业务闭环，再内容中心，再知识库，最后 AI 增强。**

本报告结论：

- `M14.0.1` 已完成拆解
- 下一条唯一推荐执行任务为：

`M14.1.1 Workspace Role & Navigation Foundation`
