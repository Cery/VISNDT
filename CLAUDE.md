# CLAUDE.md — VISNDT 项目操作手册

> 本文件基于 2026-09-09 交叉核实（含一轮自我纠错，见文末「核实方法论」）。
> 规则：只写已核实的事实和已拍板的决策；未拍板的事项显式标「待定」，
> 不得替代人工决策做出假设。见文末「待拍板事项」章节前不要跳过。

## 1. 项目身份

VISNDT：面向中国大陆市场的工业内窥镜 / 工业无损检测（NDT）能力发现平台，
独立自营垂直平台。业务闭环四步：检测场景 → 标准化参数 → 方案匹配 → RFQ 提交。
差异化核心：把探头直径、工作长度等检测参数标准化，支撑 AI 驱动的设备选型与询价。

## 2. 仓库结构与技术栈（已验证）

- 仓库根：`F:\Desktop\VISNDT`（git 顶层，`docs/` 在此层，不在代码目录下）
- 业务代码根：`F:\Desktop\VISNDT\VISNDT`（pnpm monorepo）
- `docs/`：`_review`（909 份执行报告）、`_context`（现状/决策文件，见第 10 节）、`VISNDT-Blueprint`（蓝图，600_Frontend 已冻结）、`Content Management Guide`（24 份独立编号子项目报告）
- apps/api：NestJS 11 + Prisma 5 + PostgreSQL，JWT 自研鉴权（无第三方 OAuth），Swagger 于 `/api/docs`
- apps/admin：React 18 + Vite + Ant Design 5 + Zustand 5 + Axios + React Router，端口 3001，dev proxy → 4000（已修复）
- apps/web：Next.js，端口 3000，已实测确认非空壳——`PublicHeader.tsx`（22 处 `blueprint-*` 类名）、`PublicFooter.tsx`（`blueprint-amber`）、`HomeHero.tsx` 等 6 个首页组件均使用统一设计令牌且接真实数据（`getProducts`、`supplier-discovery`），非占位符
- 数据库：PostgreSQL，22+ models / 15 enums，冻结（改动需架构审批）
- Runtime baseline：Node.js 22+

## 3. 冻结区 vs 可改区

- 冻结：数据库 schema / migration
- 可改：前台入参、表现层、组件
- 报告治理硬规则（2026-09-09 拍板，见第 10 节）：治理期间不新建任何报告性质的 md 文件（不只是带编号的），核实结果只追加进 `docs/_context/{DECISIONS, ACTUAL_STATE, 执行记录}.md` 三份文件

## 4. 真实 API 清单

全量普查（非抽样）：48 controllers / 275 endpoints。完整对照表见 `docs/_context/ACTUAL_STATE.md`。已知缺口：`GET /files/:id`（单文件元数据）不存在，前端目前用内联数据绕过。

## 5. 命名规范现状（已拍板部分 + 未拍板部分，不要混淆）

**已拍板、已核实**：schema 使用 `ParameterGroup` / `WorkflowEvent` / `RFQ` / `RFQResponse`；`StandardProduct` / `ParameterTemplate` / `WorkflowInstance` / `RFQItem` 在 schema 里均不存在。Blueprint 文档里出现的这几个替代命名属于文档自身漂移，不是代码违反规范——代码层面自洽。确认不回溯改名（涉及冻结的数据库表结构）。

⚠️ **未拍板，待定**：`suppliers/`、`matching/` 模块使用的是 Blueprint 明文禁止的术语（Requirement/Matching/Supplier 类命名）。这跟上面那条不是一回事——上面是"文档写的名字代码里根本没有"，这条是"代码里确实在用规范禁止的词"。是否回溯改名尚未拍板，涉及数据库表名，改动面大。遇到这个模块时不要自行决定是否重命名，先问。

## 6. 本地开发流程

```
1. docker compose up -d postgres minio   # 需根目录 .env
2. 配置 apps/api/.env 与 database/.env（两处都要）
3. pnpm db:generate && pnpm db:migrate
4. database/seed_admin.ts → admin@vip.com / admin123456
5. pnpm --filter @visndt/api dev      # 4000
6. pnpm --filter @visndt/admin dev    # 3001
7. pnpm --filter @visndt/web dev      # 3000
8. cd apps/api && pnpm test:e2e       # 当前 19 个 spec
```

⚠️ **当前阻塞项（不是历史遗留、是现在生效的）**：bcrypt 原生二进制 `bcrypt_lib.node` 缺失，机制已查明——`pnpm-workspace.yaml` 里 `allowBuilds` 将 bcrypt 标记为 `false`，跳过了 node-pre-gyp 的原生构建步骤。任何依赖密码哈希的登录请求在当前环境下必然失败，不是间歇性问题。决策现状是"暂不放开，等到真正需要验证鉴权功能时再放开"——如果你的任务涉及需要实际登录验证的功能，先确认这一项是否已经解决，不要假设登录能跑通。

## 7. 已知技术债（仍开放，按影响排序）

| 项 | 影响 |
|---|---|
| bcrypt 原生二进制缺失（第 6 节） | 高——阻塞本地登录测试 |
| `GET /files/:id` 缺失 | 中——技术债，前端已绕过 |
| ENUM 参数无 Option 管理 UI | 中 |
| ORG_ADMIN 不在角色枚举（现仅 ADMIN/MEMBER/SUPPLIER） | 低，取决于产品决策 |
| apps/web 整体页面范围未定案（首页已落地） | 待产品决策 |

**已核实解决，不用再查**：`BusinessAnalytics.tsx` 颜色字面量 bug（9 处，已改为 JSX 表达式）、`Placeholder.tsx` 死代码（已删除）、`categories.service.ts` / `category.service.ts` "重复"（核实后确认是 admin/web 两端各自独立的正常架构，不是重复）。

## 8. 设计系统规范

- 客户端（apps/web）：`blueprint-*` design tokens（Tailwind）+ Noto Sans SC，**已落地**，不是设计稿阶段（证据见第 2 节）
- Admin 端："待办优先"信息架构（治理队列 + 统一页头组件 + 语义色板）设计稿已产出，代码未落地。**是否落地未拍板，见第 11 节**

## 9. 部署与基础设施

- Docker Compose（postgres + api + admin + minio）
- 规划：Oracle Cloud 永久免费 ARM VM（阶段一）→ 阿里云香港 ECS（阶段二）
- 既定约束：中国可访问 / 无 ICP 备案 / 自托管——不要提议 Vercel 或任何需要 ICP 备案的方案
- `v0.7-release-ready`：annotated tag，tag 对象哈希 `368b1aa`，peel 到的 commit 是 `168f353`（"M12.5-M12.7 Production Readiness Release"）。这是同一个 tag，从未被移动过（早期误判为"tag 被重打"是 `git rev-parse` 对 annotated tag 返回 tag 对象哈希而非 commit 哈希导致的误读）。已推送到 `origin`

## 10. 报告治理与核实方法论

- `docs/_review` 909 份报告 + `Content Management Guide` 24 份 + 几个零散小目录（`_architecture` / `_context` / `project-management` 等）
- 治理锁定生效中：不新建任何报告性质 md 文件，核实结果只追加进 `docs/_context/DECISIONS.md`、`ACTUAL_STATE.md`、`执行记录.md`
- `_review` 主目录 5 个重复编号（06/36/82/92/213）：已拍板"最小扰动"处理——不回填/不改旧文件，仅作记录
- 核实方法论（重要）：本项目历史上多次出现"报告说已完成，代码里没有"的情况（历史 Trae 报告曾高估后端 API 完成度），以及"核实过程本身引入新偏差"的情况（自建新报告、循环引用自己的结论、git 命令误用导致误判）。任何声称"已核实"的结论，如果证据只是另一份报告而不是直接读源码/跑命令，视为未核实。

## 11. 待拍板事项（按紧迫度排序，不要替用户决定）

1. bcrypt/allowBuilds 是否现在放开（如果近期需要本地测试登录相关功能，不应拖延）
2. `suppliers/` / `matching/` 命名是否回溯改（见第 5 节）
3. ORG_ADMIN 角色是否加入枚举
4. apps/web 整体开发范围
5. Admin 端统一设计系统是否落地
6. `GET /files/:id` 是否排期
7. `_review` 5 个重复编号是否需要更彻底处理

## 12. 与其他文档的衔接

- 核实/决策：`docs/_context/DECISIONS.md`、`ACTUAL_STATE.md`、`执行记录.md`、`VISNDT_基线进度清单.md`、`report_index.md`（933 份机器骨架，结论字段待人工补，目前是空的，不要当作已有结论使用）
- 交接总纲：`F:\Desktop\VISNDT\VISNDT\VISNDT_项目交接准备文档.md`
- 完整真实状态报告：`F:\Desktop\VISNDT\VISNDT\VISNDT_交接核实执行报告.md`（注：原引用 `VISNDT_真实状态报告.md` 不存在，此文件为其实际落盘版本）