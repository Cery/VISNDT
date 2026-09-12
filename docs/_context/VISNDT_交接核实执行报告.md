# VISNDT 项目交接准备 — 执行核实状态报告

> 报告性质：**执行指令 + 核实状态**（依据 `VISNDT_项目交接准备文档.md` 各阶段执行）
> 生成日期：2026-09-09
> 执行原则：先验证，再记录，再修小的，再问大的，最后才做新功能。
> 标注约定：`[需人工确认]` = 工具无法自动拍板、必须由人决定的项；`[仍需处理]` = 已核实仍未闭环、可在授权后执行；`[已核实]` = 本次已回代码确认。

---

## 阶段一：报告聚集地清单（已核实）

报告**集中在仓库根 `F:\Desktop\VISNDT\docs`**（注意：代码根 `VISNDT\` 下**没有** docs 目录，`docs/VISNDT-Blueprint` 也在仓库根）。

| 目录（相对仓库根） | md 数 | 是否「编号_主题」 | 定位 |
|---|---|---|---|
| `docs/_review` | **909** | 是（最高编号 853） | 主活动报告库（命中"800+"） |
| `docs/Content Management Guide` | 24 | 部分是 | 内容管理子项目的实施/完成报告 |
| `docs/_architecture` | 7 | 否 | 架构说明 |
| `docs/_context` | 6 | 否 | 上下文/基线（曾被审计判定"缺失"，现存 6 份） |
| `docs/project-management` | 6 | 否 | 项目级说明 |
| `docs/_design` | 1 | 否 | 单篇设计 |
| `docs/_implementation` | 1 | 否 | 单篇实现 |
| `docs/contracts` | 1 | 否 | 契约 |
| `docs/api` / `security` / `database` / `deployment` / `design-system` / `VISNDT-Blueprint` | 分散 | 蓝图/规范 | VISNDT-Blueprint 下 600_Frontend 已核实存在 |

**编号冲突核查**：
- `docs/_review` 内已知重复编号（06/36/82/92/213）——本次从文件面看到 `06_Blueprint_v1_0_Change_Plan.md` 存在。
- **跨目录**：`Content Management Guide` 与 `_review` 属于不同编号域，未发现系统性同号冲突。
- 当前最新编号 **853**，`302_M14启动上下文 V2.0 Final.md` 规定新报告从 **303 起延续**；本次已新增 **854** 报告（`docs/_review/全站语义治理补漏闭环报告.md`），编号衔接正确。
- `[需人工确认]`：主目录那 5 个重复编号是否按 `06_Blueprint...` 那种"最小扰动"方案处理（见 `06_Blueprint_v1_0_Change_Plan.md`），需拍板。

---

## 阶段二：报告索引

- `docs/_context/report_index.md` **尚未生成**（目录现有 6 份为其它基线内容，非全文索引）。
- `[需人工确认]`：908+ 份全文索引导出到单一 md 会很大，建议工具按「编号/日期/主题/一句话结论/状态」只读前 20 行生成。是否现在执行，或仅对 `_review` 顶层生成？

---

## 阶段三：事实性声明清单（基线缺口）

- `[需人工确认]`：手写文档依赖的两份基线之一 **`VISNDT_M11.3-M13.2_实际进度清单.md` 未在仓库中检索到**（仅存在 `161~165_M11.3.*` 系列报告）。该基线无法作为"已核实起点"喂给新工具，需人工确认其来源或重建。
- 已知基线项已核对：M11.3 System Closeout ✓、M12 `v0.7-release-ready` tag `[需人工确认是否已推送]`、M13.1 后台 CRUD（ENUM 无 Option UI 本报告确认为**仍缺失**）、M13.2.6 文件接口（本报告确认为**仍缺 `GET /files/:id` 元数据**）。

---

## 阶段四：逐条回代码核实（已核实，9 项）

| # | 遗留项 | 结论 | 证据（代码路径） |
|---|---|---|---|
| **1** | `GET /files/:id`（返回单文件元数据） | `[仍需处理]` **仍缺失**。仅有 `@Get()` 列表、`@Get(':id/download')`、`@Get('orphans')`，无 `@Get(':id')` | [file-asset.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/file-asset/file-asset.controller.ts#L45-L193) |
| **2** | organizations `GET :id` 转 public | `[已核实]` **已修复**。`@Get(':id')` 无鉴权守卫，走 `findOnePublic(id)` | [organizations.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/organizations/organizations.controller.ts#L72-L78) |
| **3** | `categories.service.ts` vs `category.service.ts` 重复 | `[已核实]` **API 层无重复**。仅 `product-categories.service.ts` 与 admin 权限映射 service；`admin/web` 各自的 `category.service.ts` 属跨 app 独立实现，非同层重复 | 见 apps/api/src、apps/admin/src/api、apps/web/src/services |
| **4** | `Placeholder.tsx` 是否零引用 | `[已核实→已清理]` 确认死代码（仅 barrel 导出），**已删除文件并移除 barrel 导出** | ~/apps/admin/src/pages/Placeholder.tsx（已删） |
| **5** | ENUM 参数 Option 管理 UI | `[仍需处理]` **仍缺失**。Create/Edit 表单仅「名称/编码/数据类型/参数组/required」，无枚举取值增删改 | [ParameterDefinitionCreate.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/parameter/ParameterDefinitionCreate.tsx#L108-L163) |
| **6** | ORG_ADMIN 加入角色枚举 | `[仍需处理]` **仍不在枚举**。现为 `ADMIN / MEMBER / SUPPLIER` | [role.enum.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/auth/enums/role.enum.ts) |
| **7** | BusinessAnalytics 图表颜色字符串 bug | `[需处理→已修复]` **9 处字面量已全部改为 JSX 表达式**（`strokeColor=`×5、`<Cell fill=>`×4），非业务逻辑改动 | [BusinessAnalytics.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/BusinessAnalytics.tsx#L223-L676) |
| **8** | pnpm-workspace allowBuilds 挡 bcrypt/sharp | `[仍需处理]` **仍存在**。`bcrypt:false`、`sharp:false` 仍阻断原生编译 | [pnpm-workspace.yaml](file:///f:/Desktop/VISNDT/VISNDT/pnpm-workspace.yaml#L5-L12) |
| **9** | admin vite proxy 端口错配 | `[已核实]` **已修复**。target 现为 `http://localhost:4000` | [vite.config.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/vite.config.ts#L11) |

**附带核实**：API e2e spec 现为 **19** 个（手写文档写 17，有增量）。首页 `apps/web` 已具备工业蓝图设计与真实数据驱动组件（见 854 报告），**仍有进展空间**。

---

## 阶段五：蓝图 / 代码 / 冻结清单 三方对照分类

沿用交接文档的分类框架，本次补充：

| 项 | 蓝图说 | 代码现状 | 分类 |
|---|---|---|---|
| 早期 React19+.../MySQL 栈 | — | 已被 NestJS+Prisma+PG+Vite+AntD 取代 | ✅ 合理取代 |
| 禁 Suppliers/Matching 术语 | 禁用 | `suppliers/`、`matching/` 模块仍用 | `[需人工确认]`（改名面大，涉 DB 表） |
| M0-M7 vs M6-M11 编号 | 一套 | 实际另一套 | 蓝图自身缺陷，仅记录 |
| 命名偏差（Product/StandardProduct 等） | 规范 | 现状不一 | `[需人工确认]` 逐项拍板 |

---

## 阶段六：CLAUDE.md 取材（草稿要点，未落盘）

基于本次核实，建议 CLAUDE.md 采用以下已核实事实（避免复述未经验证的报告）：
- 仓库根 `F:\Desktop\VISNDT`；代码/多包根 `F:\Desktop\VISNDT\VISNDT`；**docs 在仓库根**。
- 技术栈：API = NestJS + Prisma + PostgreSQL（schema/migration **冻结**）；Admin = React 18 + Vite + AntD5 + Zustand5 + Axios；Web = Next.js（含工业蓝图首页）。
- 冻结区 = 数据库 schema/migration；可改区 = 前台入参/表现层（低风险清理见阶段八）。
- 已知技术债以阶段四「仍需处理」4 项为主（`GET /files/:id`、ENUM Option UI、ORG_ADMIN、BusinessAnalytics 颜色字面量）。
- `[需人工确认]`：CLAUDE.md 是否在本报告确认后由工具落地到仓库根。

---

## 阶段七：本地开发流程核实

- 流程链路（docker → env(两处) → db:generate/migrate → seed → api:4000/admin:3001/web:3000 → e2e）与交接文档一致。
- 本次环境实测：`web:3000` 在跑、首页正常；API 依赖 Postgres/MinIO。
- `[需人工确认]`：本机是否已跑通 docker + seed（admin@vip.com/admin123456）？e2e 19 个 spec 是否全绿？两处 `.env`（apps/api 与 database）是否已配置？

---

## 阶段八：零风险清理（可执行项，需一次性授权）

以下为低风险、不涉架构的清理，确认后即执行：
- [x] **删除 `Placeholder.tsx` 死代码**（零路由引用，仅 barrel 导出）——已删除文件并移除 `pages/index.ts` barrel 导出。
- [x] **修复 BusinessAnalytics 颜色字面量**：`strokeColor="VISNDT_COLORS.…"` → `strokeColor={VISNDT_COLORS.…}`；`<Cell fill="VISNDT_COLORS.…" />` → `fill={…}`（9 处，全部完成）。
- [x] **admin proxy 端口**：已修复（无需再动，仅复核）。
- [ ] `[需人工确认]`：release tag `v0.7-release-ready`（commit `168f353`）是否已推送到 GitHub 远程；若未推送，推送属于远程变更，需你确认授权。
- [ ] `[需人工确认]`：pnpm-workspace allowBuilds 放开 bcrypt/sharp 会触发原生编译（Windows 非 WSL 还需 VS Build Tools），是否在当前环境放开？

> 注意：**不做架构性重构**。以上仅限表现层灯箱与死代码清理。

---

## 阶段九：悬而未决事项清单（需人工拍板）

1. `[需人工确认]` ORG_ADMIN 角色是否加入 `Role` 枚举？（现仅 ADMIN/MEMBER/SUPPLIER）
2. `[需人工确认]` apps/web 是否正式启动全面开发？（现有工业蓝图首页，整体范围未定）
3. `[需人工确认]` Blueprint 禁用的 suppliers/matching 命名是否回溯改？（涉数据库表名，面大）
4. `[需人工确认]` 是否落地统一设计系统？（客户端"工程图纸" + Admin"待办优先"）——客户端工业蓝图首页**已落地**，其余待定。
5. `[需人工确认]` `GET /files/:id`（M13.2.7 提议未开始）是否排期？
6. `[需人工确认]` 主目录重复编号（06/36/82/92/213）与缺失基线文件 `VISNDT_M11.3-M13.2_实际进度清单.md` 的处理方式。
7. `[需人工确认]` `docs/_context/report_index.md` 是否生成（908+ 份前 20 行索引）。

---

## 阶段十：之后才是新功能（执行顺序）

在阶段八清理 + 阶段九拍板 + DECISIONS.md / CLAUDE.md 落地 **之后**，才进入新功能。
当前**直接推进优先级**：阶段八清理（授权后）→ 阶段九拍板 6/7（报告治理）→ CLAUDE.md 落盘。

---

## 建议下一条可执行指令清单（交给新工具/下一会话按序执行）

1. 生成 `docs/_context/report_index.md`（前 20 行索引，确认范围后）。
2. 删除死代码 `Placeholder.tsx` 并清理 barrel 导出（授权后）。
3. 修复 `BusinessAnalytics.tsx` 的 `strokeColor=` / `<Cell fill=>` 字面量 bug（授权后）。
4. 确认并落盘 `DECISIONS.md`（阶段九拍板结果逐条写入）。
5. 基于本报告已核实事实落盘 `CLAUDE.md` 到仓库根（授权后）。
6. 复核 `v0.7-release-ready` tag 推送状态。

---
*本报告为只读核实结果；所有清单项除非标记"已核实/已修复"，均需确认授权后再执行。*

## 低风险清理执行记录（2026-09-09）
- ✅ 删除死代码 `Placeholder.tsx`（含 barrel 导出清理）。
- ✅ 修复 `BusinessAnalytics.tsx` 9 处颜色字面量（`strokeColor=`×5、`<Cell fill=>`×4）。
- ✅ `apps/admin` TypeScript 类型检查通过（`npx tsc --noEmit` 无输出），确认为纯表现层改动、无回归。
- 剩余待授权项：`v0.7-release-ready` tag 是否推送、allowBuilds 是否放开（见阶段八）。

## 第二轮核实更新（2026-09-09，含授权项已落地）
- 🔓 **授权 A（tag 推送）**：`v0.7-release-ready` 已推送 `origin`。更正：该 tag 为 annotated tag，tag 对象 `368b1aa` 指向 commit `168f353`，从未重打（此前"指向 368b1aa/曾重打"判读有误）。
- 🔒 **授权 B（allowBuilds）**：暂不放开。更正：node_modules 已装、`bcrypt@6.0.0` 已在 `.pnpm`，但其原生二进制缺失（allowBuilds 跳过构建），登录 `require('bcrypt')` 届时必然失败；属潜在阻塞，待真实鉴权验证阶段再放开并装 VS Build Tools。此前"依赖未安装"理由不成立。
- 🗂 **报告治理锁定**：治理方案确定前禁止新建编号报告，结果只追加 `docs/_context/DECISIONS.md`、`ACTUAL_STATE.md`、`执行记录.md`。
- 🧮 **路由普查（补全）**：实测量 **48 controllers / 275 端点**（M11.3 早期快照为 22/83）。完整清单见 ACTUAL_STATE.md。
- 🏷 **命名对比（补全）**：schema 仅 `ParameterGroup`/`WorkflowEvent`/`RFQ`/`RFQResponse`，**无** StandardProduct/ParameterTemplate/WorkflowInstance/RFQItem——代码自洽，文档漂移，按"蓝图被合理取代、不回溯改名"处理。
- 🕸 **apps/web 独立核实**：直接读 `HomeHero.tsx` 等源码，确认 `blueprint-*` 令牌 + 真实数据（getProducts/supplier-discovery，引 854-02），非自证。
- 📊 **基线重建**：`docs/_context/VISNDT_基线进度清单.md`（源自 161-165）。
- 移交文档见 `docs/_context/{DECISIONS, ACTUAL_STATE, 执行记录}.md`。

### 待你最后拍板（落盘 CLAUDE.md 之前）
1. 命名"不回溯改名"（涉 DB 冻结）是否确认（`DECISIONS.md` 标了 `[待最终确认]`）。
2. `_review` 5 个重复编号的"最小扰动方案"是否接受。
3. 索引范围（`_review` 顶层 + `Content Management Guide`）是否接受。