# VISNDT 项目交接与新工具接入准备文档

> 用途：新的开发工具（Claude Code 或其他）接手本项目前，按本文档顺序执行。
> 核心原则：**先验证，再记录，再修小的，再问大的，最后才做新功能。**
> 反过来做（先做新功能、边做边发现问题）正是过去几个月报告与代码脱节的成因。

---

## 0. 项目一句话概览

VISNDT 是面向中国大陆市场的工业内窥镜/工业无损检测（NDT）能力发现平台，
独立自营的垂直平台。核心业务闭环是四步：检测场景 → 标准化参数 → 方案匹配 →
RFQ 提交。差异化核心是把探头直径、工作长度等检测参数标准化，支撑 AI 驱动的
设备选型和询价流程。技术栈：apps/api（NestJS+Prisma+Postgres）、
apps/admin（React+Vite+AntDesign5+Zustand5，已成熟）、apps/web（Next.js，
已从空壳进展到有实际首页组件）。仓库是 pnpm monorepo。

---

## 阶段一：全仓库扫描，找出所有执行报告的位置

**背景**：800+ 份 md 格式执行报告，大部分集中在一个主目录（docs/_review/），
但也有 Trae 自建的、分散在其他几个目录的报告。**必须先找全，再建索引**，
否则后续核实工作会带着盲区。

**任务**：
- 扫描整个仓库，列出所有可能存放报告的目录（判断依据：目录下有多个 .md
  文件，文件名符合"编号_主题.md"格式，或包含日期/"报告/验证/完成/总结/
  Review/Report"关键词）
- 输出每个目录的路径和文件数量
- **不要假设只有 docs/_review 一处**

**产出**：一份"报告聚集地清单"，人工确认一遍，确保没有漏掉的目录。

**顺便检查**：报告编号是否跨目录冲突（主目录内部已知有 5 个重复编号：
06、36、82、92、213；如果 Trae 自建目录也用了同一套编号体系，冲突可能更多）。

- [ ] 完成

---

## 阶段二：建立报告索引（只读标题+摘要，不读全文）

**背景**：800+ 份报告全文塞进一次上下文装不下，且没必要——先看全局，
再决定精读哪些。

**任务**：对阶段一找到的所有报告，只读文件名和前 20 行，生成索引表：
编号 / 日期 / 主题 / 一句话结论 / 状态（完成/冻结/被取代）。

**产出**：`docs/_context/report_index.md`

- [ ] 完成

---

## 阶段三：提取"事实性声明"清单

**背景**：索引只是地图，接下来要挑出真正需要核实的具体主张。

**任务**：基于索引，找出每个功能模块"最新的、未被取代的"报告，列出它们
各自声称已完成的具体功能点（例如"GET /files/:id 已实现"、"ORG_ADMIN
角色已加入"），产出可逐条核对的清单，而不是叙述性总结。

**已有的起点**（不用从头做，直接作为已核实基线喂给工具）：
- `VISNDT_M11.3-M13.2_实际进度清单.md`（覆盖 M11.3→M13.2.6）
- M13.4.0 Web 前端架构评审的核实结论（见阶段六附录 A）

只需要在这两份基础上，继续核实 M13.4.0 之后的部分。

- [ ] 完成

---

## 阶段四：逐条回代码核实

**背景**：报告说"已完成"不等于代码里真的做了——这是本项目历史上已经
反复验证过的教训（Trae 的 M13.4.0 报告就高估过后端完成度）。

**任务**：对阶段三清单里的每一条，去实际源码核实（controller/schema/
组件文件），标记"已核实/与代码不符/无法判断"。

**已知需要重点核实的具体项**（历史遗留，逐条确认当前状态）：
- [ ] `GET /files/:id`（file-asset.controller.ts，历史上缺失）
- [ ] organizations 的 `GET :id` 是否已改为 public
- [ ] `categories.service.ts` vs `category.service.ts` 是否仍重复
- [ ] `Placeholder.tsx` 是否仍是零引用死代码
- [ ] ParameterDefinition 的 ENUM 类型是否已有 Option 管理 UI
- [ ] ORG_ADMIN 角色是否已加入角色枚举（历史上只有 ADMIN/MEMBER）
- [ ] `BusinessAnalytics.tsx` 图表颜色字面字符串 bug
      （`fill="VISNDT_COLORS.success"` 应为 `fill={VISNDT_COLORS.success}`）
- [ ] pnpm-workspace.yaml 的 allowBuilds 是否仍挡着 bcrypt/sharp 编译
- [ ] apps/admin/vite.config.ts 的 dev proxy 端口是否仍错配（应指向 4000）
- [ ] 本地打过标但未推送到 GitHub 的 release tag（`v0.7-release-ready`，
      commit `168f353`）是否已推送

**产出**：增量写入 `docs/_context/ACTUAL_STATE.md`（每核实完一个模块就
追加一段，不要等全部核实完再一次性生成，避免中途上下文用完导致进度丢失）。

- [ ] 完成

---

## 阶段五：处理蓝图 / 代码 / 冻结清单三方不一致

**背景**：这三者可能都不完美，也互相不完全一致，不能简单套"谁对谁错"。

**分类处理**（不要让工具自己判断对错，只做客观分类）：

| 类型 | 特征 | 处理方式 |
|---|---|---|
| 蓝图被后续决定合理取代 | 有明确时间线，后者更晚更详细 | 标记蓝图对应部分为"已废弃"，代码为准 |
| 说不清是故意改还是漂移 | 无法判断意图 | 列入人工决策清单，不自动处理 |
| 蓝图自身有缺陷 | 蓝图内部就自相矛盾 | 记录问题本身，不强行代入代码判断 |

**已知的具体不一致项**（供分类参考）：
- 早期栈（React19+Tailwind+Wouter+tRPC+Drizzle+MySQL）已被 NestJS+Prisma+
  Postgres+Vite+AntDesign 取代 → **蓝图被合理取代类**，无需处理
- Blueprint 禁用 Requirement/Matching/Supplier 术语，但代码中 suppliers/、
  matching/ 模块仍在用 → **说不清类**，需要人工拍板
- Blueprint 的 M0-M7 编号体系与实际执行的 M6-M11 编号体系对不上
  → **蓝图自身缺陷类**，记录即可
- Product/StandardProduct、ParameterGroup/ParameterTemplate、
  WorkflowEvent/WorkflowInstance、RFQResponse/RFQItem 等命名偏差
  → 需要在阶段四核实清单基础上逐一分类

**产出**：三方对照表（"蓝图说 A，代码是 B，冻结清单说 C"），不下结论，
按上表分类标注。

**拍板结果写入 `DECISIONS.md`**，每条一行，格式：
```
2026-09-XX：suppliers/matching 命名维持现状不改，Canonical Naming Spec
中这条规则标记为"MVP阶段未强制执行，暂不回溯"。
```
目的：这次拍板的结果，下一个工具/下一次会话不用再重新发现、重新纠结一遍。

- [ ] 三方对照表完成
- [ ] 人工拍板完成
- [ ] DECISIONS.md 已建立

---

## 阶段六：撰写正式 CLAUDE.md

**背景**：用阶段四、五核实过的真实清单来写，而不是历史文档——这样
CLAUDE.md 从一开始就是"经过验证"的，不是"复述报告"的。

**章节结构**（对应此前给 Trae 的取材任务）：
1. 项目身份（3-5 句话，基于阶段〇的一句话概览扩展）
2. Monorepo 结构与真实技术栈（每个 app 的实际版本号，非计划栈）
3. 冻结区域 vs 可改区域（阶段五拍板结果为准）
4. 真实 API 路由清单（阶段四核实结果）
5. 命名规范现状（阶段五的对照表 + 拍板结果）
6. 本地开发实际可跑通的流程（见阶段七）
7. 已知技术债 / 未完成项（阶段四清单中标记为"仍存在"的项）
8. 设计系统规范（如果已决定落地统一视觉方案）
9. 部署与基础设施现状

- [ ] 完成，放入仓库根目录

---

## 阶段七：本地开发环境（已验证可跑通的流程，直接照抄）

```
1. docker compose up -d postgres minio   # 需要根目录 .env
2. 配置 apps/api/.env 和 database/.env（两处都要，NestJS 读 apps/api
   的 cwd，Prisma CLI 读 database 的 cwd）
3. pnpm db:generate && pnpm db:migrate
4. database/seed_admin.ts 创建测试账号：admin@vip.com / admin123456
5. pnpm --filter @visndt/api dev      # 端口 4000，swagger 在 /api/docs
6. pnpm --filter @visndt/admin dev    # 端口 3001
7. pnpm --filter @visndt/web dev      # 端口 3000
8. e2e 测试：cd apps/api && pnpm test:e2e   # 17 个 spec 文件
```

**已知两个坑**（阶段四会核实是否仍存在）：
- pnpm-workspace.yaml 的 allowBuilds 挡住 bcrypt/sharp 原生编译
  （Windows 非 WSL 环境还需要 VS Build Tools）
- apps/admin 的 dev proxy 曾错配到 3000（应为 4000）

- [ ] 本机验证一次，确认流程仍然成立

---

## 阶段八：零风险清理（可以直接做，不需要等拍板）

这些改动风险极低、不涉及架构决策，适合作为新工具的"热身任务"，
顺便验证它是否真的看懂了项目结构：

- [ ] 合并 categories.service.ts / category.service.ts
- [ ] 删除 Placeholder.tsx 死代码
- [ ] 修复 BusinessAnalytics.tsx 的字面字符串颜色 bug
- [ ] 修正 apps/admin/vite.config.ts 的 dev proxy 端口
- [ ] 推送本地未推送的 release tag（确认后）

---

## 阶段九：需要你拍板的悬而未决事项

不要让工具自己决定，列出来等你选：

- [ ] ORG_ADMIN 角色要不要加入角色枚举
- [ ] apps/web 现在要不要正式启动开发（目前已有首页雏形，但整体范围
      还没定案）
- [ ] Blueprint 禁用的 suppliers/matching 命名要不要回溯改掉
      （改动面大，涉及数据库表名）
- [ ] 是否落地本次讨论的统一设计系统（客户端"工程图纸"视觉语言 +
      Admin 端"待办优先"信息架构）
- [ ] `GET /files/:id`（M13.2.7 曾提议但未开始）要不要排期

---

## 阶段十：之后才是新功能开发

以上全部完成、DECISIONS.md 建立、CLAUDE.md 写好之后，才轮到：
- 落地统一设计系统（首页/列表页/详情页模板已有设计稿）
- 其他新功能开发

---

## 附录 A：已核实的历史结论摘要（作为阶段三、四的已知基线）

- M11.3 System Closeout：22 controllers/83 endpoints，30 admin 路由/页面，
  234/234 回归测试通过，业务能力 10/10 ✅ 已核实
- M12 Release：本地打了 `v0.7-release-ready` 标签（commit `168f353`），
  **未推送到 GitHub 远程** ⚠️ 需要处理
- M13.1 Product Center Enhancement：ParameterGroup/ParameterDefinition/
  ProductCategory 后台 CRUD，9 个页面，0 后端改动 ✅ 已核实；已知限制：
  ENUM 参数无 Option 管理 UI（未实现）
- M13.2.6：发现并部分修复 `GET /files/:id` 缺失问题（前端改用内联数据
  绕过，后端接口本身仍未补）
- M13.4.0 Web 前端架构评审：Trae 的报告**高估了后端 API 缺口**（demands/
  rfqs/offers/rfq-responses/notifications 接口 Trae 说缺失，实际都存在
  且可用；真实缺口只有 organizations GET:id 转 public 和 GET /files/:id）；
  Trae 提议的 Vercel 部署与已定的中国可访问/无 ICP/自托管架构冲突；
  Trae 提议的 next-auth v5 beta 和 next/font/google 均不建议采用
- apps/web 设计方案核实：docs/VISNDT-Blueprint/600_Frontend/ 下已有
  10 份详细、已冻结的前端蓝图文档（601-610），Trae 的 M13.4.0 报告完全
  没有引用这批文档；19 个核心业务路由中 16 个后端已就绪

## 附录 B：技术栈现状（截至最近一次核实）

- Admin：React 18 + TypeScript + Vite + Ant Design 5 + Zustand 5 + Axios
  + React Router
- Web：Next.js（已从空壳进展到有 PublicHeader/HomeDiscoveryLedge/
  FeaturedProductsSection 等实际组件）
- API：NestJS + TypeScript + Prisma ORM，JWT 自研鉴权（无第三方 OAuth，
  为迁移自由度考虑）
- 数据库：PostgreSQL，22 models / 15 enums，**冻结**（schema/migration
  改动需架构审批）
- 部署：Docker Compose（postgres+api+admin+minio），规划路径：
  Oracle Cloud 永久免费 ARM VM（阶段一）→ 阿里云香港 ECS（阶段二）
- Runtime baseline：Node.js 22+
