# M系列开发过程与目标控制文档

## 文档信息

- 任务编号：`M14.2.4.CONTROL-DOC`
- 任务名称：`M系列开发过程与目标控制文档初始化`
- 文档路径：`docs/_review/M_Series_Development_Control_Plan.md`
- 生成方式：只读分析 + 文档生成
- Git 仓库根目录：`F:\Desktop\VISNDT`
- 业务代码根目录：`F:\Desktop\VISNDT\VISNDT`
- 当前分支：`main`
- 基线来源：`81/126/146/165/211/297/298/300/301/304/322/323/326/327/333/336/338/339`

---

# 1. 项目总体目标

VISNDT 工业检测平台的最终商业目标，是在现有技术基础上持续推进为“工业检测设备信息发布 + 需求撮合 + RFQ 询价 + 智能匹配 + 工作空间运营”的平台型产品。

当前长期目标固定为以下 7 个能力域：

1. 产品中心
2. 供应商管理
3. 买家需求发布
4. RFQ 询价
5. 智能匹配
6. 工作空间
7. 平台运营

长期边界同时固定如下：

- 不开发 `Supplier Store`
- 不开发 Supplier 独立商城
- 不公开价格
- 不进入交易支付
- 保持“信息发布展示 + 平台撮合”模式

---

# 2. 当前架构状态

## 2.1 Backend

- `NestJS`
- `Prisma`
- `PostgreSQL`
- `JWT`
- `RBAC`

当前后端已具备 Auth、Organization、Product、Demand、RFQ、RFQ Response、Offer、Notification、Inquiry、AuditLog、Matching、Admin 等核心模块能力。  
当前 M14.2.4 阶段的核心后端控制点，不是继续扩模型，而是冻结 `workspaceRole` 契约并收口最小 RBAC 修复边界。

## 2.2 Frontend

- `Next.js Web`
- `React Admin`

现状拆分为两条前端线：

1. `apps/web`：Next.js Web，已完成 Buyer MVP，M14.1 增加了 Supplier Workspace 主链路，但当前工作区仍未形成干净冻结基线。
2. `apps/admin`：React Admin（Vite + Ant Design），已完成管理端主骨架与主要运营页面，处于冻结维护状态。

## 2.3 Database

当前数据库基线以 `VISNDT/database/prisma/schema.prisma` 与 `VISNDT/database/prisma/migrations/` 为准：

- Prisma Schema：`23` 个 model
- Enum：`16` 个
- Migration：`19` 个
- 当前迁移已连续落地到 `20260808051535_add_product_created_by`

当前 Schema 事实说明：

1. M13.9 Freeze 之后数据库仍发生过补丁迁移，当前基线晚于早期 M13.9 文档。
2. 核心业务实体已覆盖 `User / Organization / Product / Offer / Demand / RFQ / RFQResponse / Notification / AuditLog / Inquiry`。
3. 当前阶段不允许新增数据库字段或执行 migration。

---

# 3. 已完成阶段

| 阶段 | 目标 | 完成状态 | 关键成果 | 遗留问题 |
|---|---|---|---|---|
| `M8` | 完成后端业务架构与匹配能力基础建设 | 完成 | 建立 NestJS + Prisma 后端主架构；完成 18+ 模块、匹配引擎、需求域与安全基线；形成 M9 前置冻结基线 | 主要遗留为后续前端与运营层尚未建设 |
| `M9` | 完成 Admin V1 | 完成并冻结 | 完成 Admin Foundation、Auth、Dashboard、Product、Demand、Matching Monitor、User/Organization 管理；形成 27 个子阶段闭环 | 仅保留后续功能扩展与技术债，不影响收口 |
| `M10` | 完成 Admin V1 Enhancement | 完成并冻结 | 扩展 User/Organization Detail、Notification Center、Dashboard Enhancement；完成受控后端解冻与再冻结 | Router 变更已冻结，后续不得无审计扩展 |
| `M11` | 完成 RFQ 生命周期与通知增强 | 完成并冻结 | 完成 RFQ、RFQ Response、Offer 生命周期、Notification 触发链、系统回归验证 | Web 侧仍未产品化 Supplier 入口 |
| `M12` | 完成 Production Readiness | 完成并发布 | 完成 Docker、环境模板、安全加固、生产准备、Release Commit + Tag | 进入 M13 前，重心从发布准备转到产品能力扩展 |
| `M13` | 完成 Web MVP 与平台资产整理 | 完成并冻结 | 完成 Buyer Web MVP、公共页面、工作台、Auth/CSRF、平台能力文档与系统验证；M13.9 达成 Web MVP Freeze | Supplier Web 缺失；数据库在 Freeze 后出现补丁迁移；工程质量与构建稳定性仍需持续审计 |
| `M14` | 补齐 Workspace 与角色契约，推进 Supplier 入口 | 进行中 | 已完成 M14 预审计、任务拆解、M14.1 Supplier Workspace 主链路、M14.2.0-M14.2.3 Web Build 稳定化审计、M14.2.4 WorkspaceRole Contract Freeze | 当前最大问题不是功能缺口，而是工作区脏状态与 `5A/5B` 边界未收口 |

---

# 4. 当前 M14 阶段目标

## 4.1 M14 总目标

M14 的阶段目标不是继续堆新功能，而是围绕 Workspace 体系做四件事：

1. 明确角色入口
2. 补齐 Supplier 平台内工作台
3. 固化 `workspaceRole` 契约
4. 在冻结边界内恢复干净的开发节奏

## 4.2 M14.1

定位：`Supplier Workspace Foundation`

当前结论：

- 已完成 Supplier Workspace 主链路
- `322_M14.1.5_Closeout_Audit_Report.md` 结论为 `PASS WITH NOTES`

已完成内容：

- Supplier 登录与入口
- Supplier RFQ 列表/详情
- Supplier Response 提交与重复提交保护

遗留：

- 当时存在 Web Build 环境问题，后续已进入 `323-326` 稳定性链路单独审计

## 4.3 M14.2

定位：`Workspace Stabilization + Build Stabilization + Contract Freeze`

当前已完成：

- `M14.2.0` Web Build 环境审计
- `M14.2.1` 依赖稳定化
- `M14.2.2` Lint 稳定化
- `M14.2.3` Next Build Runtime 审计

当前结论：

- `@visndt/web build` 在 `326` 审计时已可通过
- 当前真正阻断项已从“构建失败”转为“工作区边界未收口”

## 4.4 M14.2.4

定位：`Workspace 状态对齐 / Contract Freeze / 边界恢复`

当前已形成的正式控制链：

1. `327`：Development Status Alignment
2. `333`：WorkspaceRole Contract Freeze
3. `336`：5A Result Audit
4. `338`：Boundary Cleanup Audit
5. `339`：Workspace Change Classification

M14.2.4 当前总目标已经收敛为：

- 把 `workspaceRole` 设计冻结为唯一基线
- 把当前工作区按 A/B/C/D/E 分类
- 先收口 `5A`，再决定是否放行 `5B`

---

# 5. 当前任务状态

## 5.1 `M14.2.4.4C`

- 任务名称：`WorkspaceRole Contract Freeze`
- 状态：`完成`
- 结论：已冻结三层角色模型边界  
  - `Organization.type = 业务身份`
  - `OrganizationMember.role = 内部权限`
  - `workspaceRole = 工作区人格`
- 冻结矩阵：
  - `SUPPLIER / MANUFACTURER / DISTRIBUTOR -> SUPPLIER`
  - `BUYER -> BUYER`
  - `UNKNOWN / NULL -> null`

## 5.2 `M14.2.4.5A`

- 任务名称：`Backend Minimal RBAC Contract Fix`
- 状态：`执行中`
- 当前判断：后端最小契约修复方向基本正确，但存在边界恢复问题

当前问题：

1. `5A` 允许范围仅应包含 3 个后端文件
2. 实际工作区已提前触达 `5B` 前端文件
3. `auth.controller.ts` 形成越界补充改动
4. 当前尚不满足“5A 完成并放行下一任务”的条件

## 5.3 `M14.2.4.5B`

- 任务名称：`Frontend Workspace Contract Alignment`
- 状态：`等待执行`
- 当前判断：代码事实已存在提前修改，但流程上仍未获独立放行

控制口径：

- `5B` 不能并回 `5A`
- 需独立任务、独立结果审计、独立放行

---

# 6. 当前 Git 工作区状态

## 6.1 总体状态

基于当前 `main` 分支工作区快照：

- 已跟踪修改：`17`
- 已跟踪删除：`1`
- 未跟踪项：多项
- 当前工作区：`脏状态`

结论：

当前不具备“直接继续新开发”的条件。必须先按分类口径收口。

## 6.2 A / B / C / D / E 分类

| 分类 | 含义 | 当前结论 |
|---|---|---|
| `A` | `5A` 核心修改 | 允许保留，但必须单独收口 |
| `B` | `5B` 提前修改 | 允许留存证据，但不得并入 `5A` |
| `C` | Auth Contract 补充 | 待 ChatGPT/上层审阅决定回退或补审 |
| `D` | 历史业务修改 | 暂时保留，但不得混入当前任务结论 |
| `E` | 无关变更 | 作为文档/依赖/规则杂项单独管理 |

## 6.3 分类结果

### A 类：`5A` 核心修改

- `VISNDT/apps/api/src/auth/auth.service.ts`
- `VISNDT/apps/api/src/auth/dto/auth-response.dto.ts`
- `VISNDT/apps/api/src/auth/interfaces/auth-request.interface.ts`

### B 类：`5B` 提前修改

- `VISNDT/apps/web/src/services/auth.service.ts`
- `VISNDT/apps/web/src/auth/RoleGuard.tsx`
- `VISNDT/apps/web/src/components/workspace/WorkspaceSidebar.tsx`
- `VISNDT/apps/web/src/app/workspace/supplier/page.tsx`
- `VISNDT/apps/web/src/app/workspace/supplier/rfqs/page.tsx`
- `VISNDT/apps/web/src/app/workspace/supplier/rfqs/[id]/page.tsx`
- `VISNDT/apps/web/src/app/workspace/supplier/responses/page.tsx`

### C 类：Auth Contract 补充

- `VISNDT/apps/api/src/auth/auth.controller.ts`

### D 类：历史业务修改

- `VISNDT/apps/api/src/organizations/organizations.service.ts`
- `VISNDT/apps/api/src/rfq-responses/rfq-responses.controller.ts`
- `VISNDT/apps/api/src/rfq-responses/rfq-responses.service.ts`
- `VISNDT/apps/api/src/rfqs/rfqs.controller.ts`
- `VISNDT/apps/api/src/rfqs/rfqs.service.ts`
- `VISNDT/apps/web/src/lib/api/rfqs.ts`
- `VISNDT/apps/web/src/services/inquiry.service.ts`
- `VISNDT/apps/web/src/services/rfq.service.ts`
- `VISNDT/apps/web/src/components/rfq/RFQResponseStatusBadge.tsx`

### E 类：无关变更

- `VISNDT/apps/web/package.json`
- `VISNDT/pnpm-lock.yaml`
- `.trae/rules/`
- `docs/_review/*` 既有报告与删除项

---

# 7. 后续开发任务路线

当前推荐顺序固定如下，不允许跳步：

1. `M14.2.4.5A 收口`
2. `M14.2.4.5B`
3. `M14.2.4.6 Workspace UI`
4. `M14.3 Supplier Workspace`
5. `M14.4 Buyer Workspace`
6. `M14.5 Matching Workspace`
7. `M15 Business Closed Loop`

放行原则：

- 未完成上一任务审计，不进入下一任务
- 未恢复清晰工作区边界，不进入新功能
- 未完成 `docs/_review` 编号报告，不视为阶段完成

---

# 8. 每个任务必须包含

## 8.1 `M14.2.4.5A 收口`

- 任务编号：`M14.2.4.5A`
- 目标：在 `4.4C` 冻结口径下，仅收口后端最小 RBAC 契约修复，并明确越界项处置
- 允许修改范围：
  - `VISNDT/apps/api/src/auth/auth.service.ts`
  - `VISNDT/apps/api/src/auth/dto/auth-response.dto.ts`
  - `VISNDT/apps/api/src/auth/interfaces/auth-request.interface.ts`
- 禁止修改范围：
  - `apps/web`
  - `database`
  - 非许可的 `apps/api` 文件
- 输入文档：
  - `333_M14.2.4.4C_WorkspaceRole_Contract_Freeze_Specification.md`
  - `336_M14.2.4.5A_Result_Audit_Report.md`
  - `338_M14.2.4.5A_Boundary_Cleanup_Audit.md`
  - `339_M14.2.4_Workspace_Change_Classification_Report.md`
- 输出文档：
  - `docs/_review/[编号]_M14.2.4.5A_*_Report.md`
- 完成标准：
  - 仅保留 A 类核心修改
  - 对 C 类 `auth.controller.ts` 给出明确结论
  - 不夹带 B/D/E 类结果
  - 形成可独立审计的 `5A` 收口结果
- Audit 要求：
  - 必须核对允许文件名单
  - 必须复核 `workspaceRole` 映射矩阵
  - 必须输出越界项清单

## 8.2 `M14.2.4.5B`

- 任务编号：`M14.2.4.5B`
- 目标：让前端严格消费冻结后的 `workspaceRole` 契约，完成 Workspace Contract Alignment
- 允许修改范围：
  - `VISNDT/apps/web/src/services/auth.service.ts`
  - `VISNDT/apps/web/src/auth/RoleGuard.tsx`
  - `VISNDT/apps/web/src/components/workspace/WorkspaceSidebar.tsx`
  - `VISNDT/apps/web/src/app/workspace/supplier/**`
- 禁止修改范围：
  - `apps/api`
  - `database`
  - 与 Supplier Workspace 无关页面
- 输入文档：
  - `333_M14.2.4.4C_WorkspaceRole_Contract_Freeze_Specification.md`
  - `336_M14.2.4.5A_Result_Audit_Report.md`
  - `339_M14.2.4_Workspace_Change_Classification_Report.md`
- 输出文档：
  - `docs/_review/[编号]_M14.2.4.5B_*_Report.md`
- 完成标准：
  - 前端不再使用 `workspaceRole ?? 'BUYER'`
  - `null` 明确拒绝进入业务工作区
  - Buyer / Supplier 导航按冻结契约分流
- Audit 要求：
  - 必须单独建报告
  - 必须验证不新增 Supplier Store
  - 必须验证无数据库/后端改动

## 8.3 `M14.2.4.6 Workspace UI`

- 任务编号：`M14.2.4.6`
- 目标：在契约冻结后，统一 Workspace 导航、空态、权限提示、状态展示与交互一致性
- 允许修改范围：
  - `VISNDT/apps/web/src/app/workspace/**`
  - `VISNDT/apps/web/src/components/workspace/**`
  - 仅必要的 `services` 只读消费层
- 禁止修改范围：
  - `apps/api`
  - `database`
  - 业务流程扩展性开发
- 输入文档：
  - `322_M14.1.5_Closeout_Audit_Report.md`
  - `333_M14.2.4.4C_WorkspaceRole_Contract_Freeze_Specification.md`
  - `M_Series_Development_Control_Plan.md`
- 输出文档：
  - `docs/_review/[编号]_M14.2.4.6_Workspace_UI_Report.md`
- 完成标准：
  - 不存在空链接、错误入口、假搜索、角色错路由
  - Workspace 页面状态语义统一
  - 不引入新的角色模型
- Audit 要求：
  - 必须包含 UI 清单与页面边界
  - 必须验证不触达冻结后端模块

## 8.4 `M14.3 Supplier Workspace`

- 任务编号：`M14.3`
- 目标：把 Supplier 相关现有 API 能力稳定产品化为平台内工作台，而不是独立商城
- 允许修改范围：
  - 默认仅 `apps/web/src/app/workspace/supplier/**`
  - `apps/web/src/components/**` 中与 Supplier 直接相关的组件
  - 必要时仅复用现有 API，不默认放行后端改动
- 禁止修改范围：
  - `Supplier Store`
  - 独立 Supplier 站点
  - `database`
  - 公开价格/交易支付
- 输入文档：
  - `298_VISNDT_M14_Roadmap_Decision_Report.md`
  - `304_M14_Task_Decomposition_Report.md`
  - `322_M14.1.5_Closeout_Audit_Report.md`
- 输出文档：
  - `docs/_review/[编号]_M14.3_Supplier_Workspace_Report.md`
- 完成标准：
  - Supplier 在平台内可完成 RFQ/Response/Offer 相关工作流
  - 不出现商城化页面
  - 复用已有后端能力优先
- Audit 要求：
  - 必须验证“平台内工作台”定位
  - 必须验证不新扩数据库

## 8.5 `M14.4 Buyer Workspace`

- 任务编号：`M14.4`
- 目标：完善 Buyer Workspace 与 Supplier Workspace 的契约对齐与闭环协同
- 允许修改范围：
  - `VISNDT/apps/web/src/app/workspace/**`
  - `VISNDT/apps/web/src/components/**` 中 Buyer Workspace 相关组件
- 禁止修改范围：
  - `apps/api` 核心 Auth/RBAC
  - `database`
  - 与 Buyer 工作台无关的公共站点改造
- 输入文档：
  - `300_M13.9.3_System_Verification_Report.md`
  - `304_M14_Task_Decomposition_Report.md`
  - 前序 `M14.3` 报告
- 输出文档：
  - `docs/_review/[编号]_M14.4_Buyer_Workspace_Report.md`
- 完成标准：
  - Buyer 侧 Demand / RFQ / Match / Workspace 状态一致
  - 与 Supplier 侧形成可审计的协同链
  - 不破坏 M13.9 Buyer MVP 冻结基线
- Audit 要求：
  - 必须对 Buyer 既有页面做回归检查
  - 必须记录是否影响 M13.9 Freeze

## 8.6 `M14.5 Matching Workspace`

- 任务编号：`M14.5`
- 目标：把现有 Matching 能力在 Workspace 中做可见化、解释化、可运营化，但不重构算法
- 允许修改范围：
  - `apps/web` 的 Matching 相关页面与组件
  - 必要的只读聚合消费层
- 禁止修改范围：
  - 匹配算法重构
  - 新框架
  - `database`
  - 交易与支付
- 输入文档：
  - `81_M8_Final_Architecture_Audit_Report.md`
  - `298_VISNDT_M14_Roadmap_Decision_Report.md`
  - 前序 Workspace 系列报告
- 输出文档：
  - `docs/_review/[编号]_M14.5_Matching_Workspace_Report.md`
- 完成标准：
  - 匹配结果在 Workspace 中可清晰展示
  - 保持现有算法与模型边界
  - 不新增未经审批的后端接口
- Audit 要求：
  - 必须说明是否只是 UI/消费层增强
  - 必须记录对 Match 闭环的实际提升

## 8.7 `M15 Business Closed Loop`

- 任务编号：`M15`
- 目标：在“不做支付、不做公开价格、不做独立商城”的前提下，形成平台撮合闭环
- 允许修改范围：
  - 仅在专项规划和专项审计放行后定义
  - 优先基于既有 Demand / RFQ / Response / Offer / Notification 体系
- 禁止修改范围：
  - Payment
  - 公开价格体系
  - Supplier 独立商城
  - 未经审批的数据库重构
- 输入文档：
  - `298_VISNDT_M14_Roadmap_Decision_Report.md`
  - 本控制文档
  - 全部前序 M14 关闭报告
- 输出文档：
  - `docs/_review/[编号]_M15_Business_Closed_Loop_Report.md`
- 完成标准：
  - 形成平台撮合闭环，不越过业务禁区
  - 任务拆解、边界、输入输出全部先冻结后执行
- Audit 要求：
  - 必须先有专项架构审计
  - 必须先冻结业务边界，再进入执行

---

# 9. Trae 执行规则

## 9.1 单任务原则

- 一次任务窗口只执行一个任务
- 不允许把 `5A + 5B` 合并执行
- 不允许未审先进入下一编号任务

## 9.2 执行前必须确认

1. 仓库根目录：`F:\Desktop\VISNDT`
2. 当前 Git 状态
3. 冻结文件
4. 影响文件

## 9.3 执行中必须遵守

1. 优先复用现有模型/API
2. 不修改冻结模块
3. 不新增未经批准功能
4. 不修改 `apps/api`、`apps/web`、`database` 之外的无关系统文件来绕过边界

## 9.4 执行后必须生成

所有执行任务在结束后必须输出到：

- `docs/_review/`

并生成编号报告，且完成后立即停止，等待审核。

## 9.5 执行后固定输出项

每次任务完成后，必须返回以下内容：

1. 修改文件
2. 修改原因
3. 是否符合冻结设计
4. Database 影响
5. API 影响
6. Build 结果
7. Review 报告路径
8. 未完成事项

## 9.6 当前控制结论

从本文件生效起，M 系列后续推进必须按以下门禁执行：

1. 先收口 `M14.2.4.5A`
2. 再独立审查 `M14.2.4.5B`
3. 再进入 `Workspace UI`
4. 后续所有 M14/M15 任务都必须在本控制文档之下执行

当前状态结论：

- 控制文档：已初始化
- 代码开发：不得继续扩大范围
- 下一动作：等待审核
