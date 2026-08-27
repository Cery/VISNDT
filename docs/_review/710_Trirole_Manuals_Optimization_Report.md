# 710 Trirole Manuals Optimization Report

## 1. 任务概述

- **任务 4**：优化完善管理员、用户、供应商手册。
- **依据**：709（Trirole Data Compliance E2E And Defect Fix）结论 + M30 术语规范 + 系统实际行为实测。
- **范围**：仅修改 3 份手册文档（Markdown），**零代码 / 零数据库 / 零 API / 零架构变更**。

## 2. 仓库与文件

- 仓库根：`F:\Desktop\VISNDT`（Git root）
- 代码根：`F:\Desktop\VISNDT\VISNDT`
- 修改文件（3 份手册）：

| 文件 | 版本 |
|------|------|
| `docs/Content Management Guide/05_VISNDT管理员操作手册.md` | V2.0 → V2.1 |
| `docs/Content Management Guide/06_VISNDT用户手册.md` | V1.0 → V1.1 |
| `docs/Content Management Guide/07_VISNDT供应商手册.md` | V1.0 → V2.0 |

## 3. 对齐依据（系统实测）

手册优化前，对系统实际行为做了定向核验：

- Admin 侧导航（`apps/admin/src/layouts/AdminLayout.tsx`）：分组「首页 / 能力中心 / 业务中心 / 用户与供应商 / 内容中心 / 媒体中心 / 数据与分析 / 系统管理」，菜单为「能力管理 / 能力型号审核 / 能力分类 / 参数体系 / 能力询价 …」。
- Web 工作区导航（`apps/web/src/components/workspace/WorkspaceSidebar.tsx`）：BUYER 6 项、SUPPLIER 9 项。
- Web 公共导航（`apps/web/src/components/layout/PublicHeader.tsx`）：首页 / 产品中心 / 产品分类 / 解决方案 / 知识中心 / 商务合作 / 关于我们。
- 产品中心页标题（`apps/web/src/app/products/layout.tsx`）：**「能力目录」**（工业检测能力目录）。
- 供应商运行时页（`apps/web/src/app/workspace/supplier/runtime/page.tsx`）：**只读**（Supplier Runtime = Capability Operation Boundary），能力概览 + 状态列表 + 买方兴趣快照，**无创建/编辑入口**。
- 供应商企业资料（`profile/page.tsx`）：可编辑组织名称/类型（自服务 OK）。
- 供应商能力展示（`display/page.tsx`）：展示管理（只读概览 + 企业身份 + 可供货产品 + 供应管理 + 公开预览）。
- 搜索域（`apps/web/src/app/search/SearchPageContent.tsx`）：`all/product/knowledge/solution/supplier-product`。

## 4. 变更明细

### 4.1 管理员手册（05）V2.0 → V2.1

1. 头部版本/日期更新，新增「与系统实际行为对齐」声明与术语规范说明（能力 = 原「产品」，能力型号 = 原「供应商型号 / Supplier Product」）。
2. §1 系统概述：核心对象改为 能力（Capability / Product）/ 能力型号（Capability Model / Supplier Product）。
3. §3 导航总览：与 Admin 实际菜单一致 —— 产品中心→**能力中心**；产品管理→**能力管理**；供应商型号审核→**能力型号审核**；产品分类→**能力分类**；产品询价→**能力询价**。
4. §5 能力中心（原「产品中心」）：能力管理（DRAFT/ACTIVE/INACTIVE）；新增「已被能力型号绑定引用的能力受保护不可删除」说明。
5. §5.2 能力型号审核：明确**当前能力型号的创建与状态流转均由管理员在此完成**；供应商端「运行时能力」为只读（自助创建为未来项）；补充「生命周期状态迁移由专用动作接口驱动，无通用 PATCH/DELETE」设计说明。
6. §6.4 产品询价 → 能力询价。
7. §12.2 供应商型号审核流程 → **能力型号治理流程**（管理员创建/录入 → 提交 → 开始审核 → 通过/发布 或 拒绝）。
8. §14 FAQ、§13 权限矩阵、§4.1、§8.2 等处的「产品/供应商型号」旧术语统一为「能力/能力型号」。

### 4.2 用户手册（06）V1.0 → V1.1

1. 头部版本/日期更新，新增术语提示（能力 = 产品；前台导航显示「产品中心」，页面标题为「能力目录」）。
2. §1 平台简介：能力（Capability / Product）目录。
3. §3.2 产品中心 → **能力目录（产品中心）**，补充页面标题说明与操作等价提示。
4. §4.2 搜索内容：结果类型与实际搜索域对齐 —— 能力（Product）/ 知识（Knowledge）/ 解决方案（Solution）/ 能力型号（Supplier Product），并补充类型切换筛选说明。
5. §4.4 产品询价 → 能力询价。

### 4.3 供应商手册（07）V1.0 → V2.0（重点修正）

1. 头部版本/日期更新，顶部新增醒目提示：**能力型号的创建与审核由平台管理员统一治理，供应商端「运行时能力」为只读**（自助创建为未来项）。
2. §1 角色说明与 §1.1 业务闭环：移除「提交能力型号」动作，改为「通过能力型号（由平台管理员治理并发布）让能力被采购方发现」；业务闭环改为 企业资料 → 报价 → RFQ 机会/商机 → 响应 → 能力展示 → 运行时能力（只读）。
3. §5 重写：**运行时能力（能力型号查看 · 只读）** —— 能力概览（统计卡）、能力型号状态列表（搜索/状态筛选/系列筛选/分页）、状态说明、买方兴趣快照（查看买方兴趣 → Inquiry 上下文）；明确「不提供创建或编辑入口」「如需新增/修改请联系平台管理员」。
4. §11 FAQ：新增「运行时能力没有新建/编辑入口」条目；调整「能力型号提交后审核中 / 被拒绝」为管理员治理语境。

## 5. 校验

- 三份手册对旧术语做全量扫描：残留均为合理上下文（术语规范说明、公共导航「产品中心」标注、历史报告 `06_VISNDT_Admin_Full_Review_Report.md` 不在本次范围）。
- 手册与系统行为一致点：Admin 导航菜单、Web 公共/工作区导航、能力目录页标题、供应商运行时只读边界、搜索域类型。
- **零代码变更**：无需 build；Database / Schema / API / Search / Matching / Storage / AI 全 UNCHANGED。

## 6. 结论

- **任务 4 = PASS**：三份手册已与系统实际行为、M30 术语规范（能力 / 能力型号）对齐，供应商手册修正了与「只读 Supplier Runtime」冻结设计不符的旧提交流程描述。
- 项目文档同步：PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md 已记录 709（Trirole E2E）与 710（手册优化）。

## 7. 下一步

- 四个任务全部完成：任务 1（数据合规修复）/ 任务 2（三角色 E2E）/ 任务 3（缺陷修复）/ 任务 4（手册优化）均 PASS。
- M30 相关后续按既有路线推进（M30 Final Closeout → M31 Entry）。
