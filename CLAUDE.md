# CLAUDE.md — VISNDT 项目操作手册

> 本文件基于 2026-09-09 交叉核实（含一轮自我纠错，见文末"核实方法论"）。
> **规则：只写已核实的事实和已拍板的决策；未拍板的事项显式标「待定」，
> 不得替代人工决策做出假设。** 见文末"待拍板事项"章节前不要跳过。

## 0. 项目约束明细（唯一权威版本，2026-09-10 整理）

> 本节整合此次对话中出现过的全部约束，**以本节为准**——此前文档
> 中如有与本节冲突的表述（尤其是部署合规相关，见下），以本节为准，
> 视为已被更正。

**法律/部署合规**：
- 面向中国大陆用户的在线交易撮合平台，**需要 ICP 备案**，可能还
  需要"增值电信业务经营许可证"（涉及在线数据处理与交易处理业务）
  ——**此前"无需 ICP 备案"的表述已被推翻，不要再引用**
- 因此部署应选择**大陆境内云服务商**（阿里云/腾讯云大陆节点）+
  完成备案，此前"阿里云香港 ECS 绕开备案"的方案已不适用
- 不使用 Vercel 或任何依赖境外服务商、无法完成境内合规的部署方案
- 自托管（Docker Compose 起步），不依赖第三方 OAuth（迁移自由度考虑）

**数据库/schema**：
- schema/migration 冻结，任何结构性改动需人工审批（1-2 人团队下，
  审批可简化为"你本人过一遍具体 diff 再点头"，但必须是独立动作，
  不与其他改动混批）
- 命名不回溯：`ParameterGroup`/`WorkflowEvent`/`RFQ`/`RFQResponse`
  等现有命名维持不变（第 5 节）

**团队/资源约束**：
- 1-2 人团队，前期人力和资金有限
- 产品数据由**平台统一录入**，不做供应商自助提交/自助编辑（现阶段）
- 优先投入能降低平台自身人工成本的功能（如 AI 辅助录入），而不是
  持续给用户加新功能

**产品/设计原则**：
- Product 是平台权威、一级商业实体；Capability 是语义理解层，
  不重新做成独立商业实体
- 付费状态永远不能改变匹配分数/技术事实，只能影响曝光顺序
- **不做独立可浏览的供应商详情页/列表页**，供应商信息仅嵌入产品页
  展示（第 8.1 节）
- 前端设计以本对话中给出的设计判断为准，现有实现仅作参考

**内容/SEO 策略**：
- 产品目录、知识库、参数释义等公开发现型内容**必须保持可被搜索
  引擎/AI 工具抓取**（服务端渲染，非纯客户端异步加载）
- 供应商详细规格书、工作台内商业敏感数据**需要登录门禁**，不能
  为了"防抓取"把该开放的内容也一起挡住

**安全基线**：
- 任何新增写操作端点必须有正确的 Guard 配置，建议建立自动化检测
  （ESLint/CI 规则），不依赖人工逐个排查
- 不采用前端"禁止复制"类拦截作为内容保护主要手段（易绕过、伤害
  正常用户体验），优先用图片/文档水印

**报告治理**：
- 治理期间不新建任何报告性质 md 文件，核实/决策结果只追加进
  `DECISIONS.md`/`ACTUAL_STATE.md`/`执行记录.md`
- 任何脚本/临时文件不直接 `git add .`，只 add 明确要提交的文件

**仓库安全**：
- 仓库应保持私有（此前发现的凭据/浏览器 profile 泄露问题）
- git 历史清理（`git filter-repo`）待执行，执行前不要往仓库根目录/
  `database/` 目录直接堆放调试脚本，见《代码库整理与内容保护方案》

## 1. 项目身份

VISNDT：面向中国大陆市场的工业内窥镜 / 工业无损检测（NDT）能力发现平台，
独立自营垂直平台。业务闭环四步：检测场景 → 标准化参数 → 方案匹配 →
RFQ 提交。差异化核心：把探头直径、工作长度等检测参数标准化，支撑
AI 驱动的设备选型与询价。

## 2. 仓库结构与技术栈（已验证）

- 仓库根：`F:\Desktop\VISNDT`（git 顶层，`docs/` 在此层，不在代码目录下）
- 业务代码根：`F:\Desktop\VISNDT\VISNDT`（pnpm monorepo）
- `docs/`：`_review`（909 份执行报告）、`_context`（现状/决策文件，见第 10 节）、
  `VISNDT-Blueprint`（蓝图，`600_Frontend` 已冻结）、`Content Management Guide`
  （24 份独立编号子项目报告）
- **apps/api**：NestJS 11 + Prisma 5 + PostgreSQL，JWT 自研鉴权（无第三方
  OAuth），Swagger 于 `/api/docs`
- **apps/admin**：React 18 + Vite + Ant Design 5 + Zustand 5 + Axios +
  React Router，端口 3001，dev proxy → 4000（已修复）
- **apps/web**：Next.js，端口 3000，**已实测确认非空壳**——`PublicHeader.tsx`
  （22 处 `blueprint-*` 类名）、`PublicFooter.tsx`（`blueprint-amber`）、
  `HomeHero.tsx` 等 6 个首页组件均使用统一设计令牌且接真实数据
  （`getProducts`、`supplier-discovery`），非占位符
- 数据库：PostgreSQL，22+ models / 15 enums，**冻结**（改动需架构审批）
- Runtime baseline：Node.js 22+

## 3. 冻结区 vs 可改区

- **冻结**：数据库 schema / migration
- **可改**：前台入参、表现层、组件
- **报告治理硬规则**（2026-09-09 拍板，见第 10 节）：治理期间**不新建任何
  报告性质的 md 文件**（不只是带编号的），核实结果只追加进
  `docs/_context/{DECISIONS, ACTUAL_STATE, 执行记录}.md` 三份文件

## 4. 真实 API 清单

全量普查（非抽样）：**48 controllers / 275 endpoints**。完整对照表见
`docs/_context/ACTUAL_STATE.md`。已知缺口：`GET /files/:id`（单文件元数据）
不存在，前端目前用内联数据绕过。

**匹配算法实现（`matching/scoring/scoring.service.ts`，已读完整源码）**：
逐参数计分后按权重加权平均；必填参数（`required`）未匹配直接判定
`hardFail`，总分强制为 0；`NUMBER` 类型不是简单的"在范围内/不在范围内"
二元判断，超出上下限时按偏离度给部分分（`Math.max(0, Math.round((1 -
deviation) * 100))`）；`ENUM` 本质走精确匹配（大小写不敏感、去首尾空格）。
编排层在 `matching/matching.service.ts`，`demands.service.ts` 的
`matchScore` 只作为查询排序字段，不是算分逻辑本体。

**⚠️ 架构决策（待执行，2026-09-10 提出）**：匹配候选筛选逻辑当前用
"Product ACTIVE + 有 ACTIVE Offer"判断"是否有供给"，Offer 本该只是
商业响应，不该承担供给判断职责。**建议改为"Product ACTIVE + 有
SupplierProduct.status=PUBLISHED"**，这是一个代码改动（不涉及 schema），
但涉及匹配引擎的核心逻辑，改动前建议单独验证不影响现有已通过的
e2e 用例。

## 5. 命名规范现状（已拍板部分 + 未拍板部分，不要混淆）

**已拍板、已核实**：schema 使用 `ParameterGroup`/`WorkflowEvent`/`RFQ`/
`RFQResponse`；`StandardProduct`/`ParameterTemplate`/`WorkflowInstance`/
`RFQItem` 在 schema 里均不存在。Blueprint 文档里出现的这几个替代命名
属于**文档自身漂移**，不是代码违反规范——代码层面自洽。**确认不回溯改名**
（涉及冻结的数据库表结构）。

**⚠️ 未拍板，待定**：`suppliers/`、`matching/` 模块使用的是 Blueprint
明文禁止的术语（Requirement/Matching/Supplier 类命名）。这跟上面那条
不是一回事——上面是"文档写的名字代码里根本没有"，这条是"代码里确实在用
规范禁止的词"。**是否回溯改名尚未拍板**，涉及数据库表名，改动面大。
遇到这个模块时不要自行决定是否重命名，先问。

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

**⚠️ e2e 测试真实状态（2026-09-09 实测，非推测）**：19 个 spec / 165 个用例，
**实际运行结果 165 failed / 165 total**。失败原因是
`PrismaClientInitializationError: Can't reach database server at localhost:5432`
——docker 未启动，数据库连不上，**跟业务逻辑对错无关**。这意味着"19 个 spec
存在"不能被理解为"有一套能验证业务正确性的测试"，当前环境下这套测试**完全
无法验证任何业务逻辑**，必须先跑通 docker + 数据库迁移才能知道真实通过率。

**⚠️ 当前阻塞项（不是历史遗留、是现在生效的）**：bcrypt 原生二进制
`bcrypt_lib.node` 缺失，机制已查明——`pnpm-workspace.yaml` 里
`allowBuilds` 将 bcrypt 标记为 `false`，跳过了 node-pre-gyp 的原生构建
步骤。**任何依赖密码哈希的登录请求在当前环境下必然失败**，不是间歇性
问题。决策现状是"暂不放开，等到真正需要验证鉴权功能时再放开"——如果
你的任务涉及需要实际登录验证的功能，先确认这一项是否已经解决，
不要假设登录能跑通。

## 7. 已知技术债（仍开放，按影响排序）

| 项 | 影响 |
|---|---|
| bcrypt 原生二进制缺失（第 6 节） | 高——阻塞本地登录测试 |
| `GET /files/:id` 缺失 | 中——技术债，前端已绕过 |
| ENUM 参数无 Option 管理 UI | 中 |
| `ORG_ADMIN` 不在角色枚举（现仅 ADMIN/MEMBER/SUPPLIER） | 低，取决于产品决策 |
| apps/web 整体页面范围未定案（首页已落地） | 待产品决策 |
| **审计日志实际覆盖范围远窄于文档声明** | 高——见下方专项说明 |
| e2e 测试当前无法验证业务逻辑（环境问题） | 高——见第 6 节 |

**已核实解决，不用再查**：`BusinessAnalytics.tsx` 颜色字面量 bug（9 处，
已改为 JSX 表达式）、`Placeholder.tsx` 死代码（已删除）、
`categories.service.ts`/`category.service.ts`"重复"（核实后确认是
admin/web 两端各自独立的正常架构，不是重复）。

**⚠️ 审计日志覆盖范围专项说明（2026-09-09 直接读源码核实，纠正此前误判）**：
`AuditLogService.log()` 全仓库实际调用点只有 8 处——AI 模块 5 处（均
STATUS_CHANGE）、`content.service.ts` 3 处（CREATE/UPDATE/STATUS_CHANGE）。
**登录（LOGIN）从未被记录，DELETE 动作从未被使用，demands/rfqs/offers/
products 等核心业务实体完全没有审计日志写入调用**。此前文档里"审计日志
覆盖 Product/Content/User/.../Demand/Inquiry/RFQ/Offer"的说法来自
`AuditLogList.tsx` 前端筛选框的选项列表，**那只是 UI 允许筛选的实体类型，
不代表后端真的在写日志**，是一次"把前端下拉框当成后端真实覆盖范围"的
误判，现已用源码证据纠正。如果审计合规是产品需求，这里有实质性缺口
需要补开发工作，不是文档措辞问题。

## 8. 设计系统规范

- **客户端（apps/web）**：`blueprint-*` design tokens（Tailwind）+
  Noto Sans SC，**已落地**，不是设计稿阶段（证据见第 2 节），但目前
  仅覆盖 8 个文件（Header/Footer/首页 6 组件），**其余约 50 个业务
  页面（工作台/产品/知识库等）未覆盖，用的是另一套未文档化的视觉
  语言**——是否延伸 blueprint 体系到这些页面，见第 11 节
- **Admin 端**："待办优先"信息架构（治理队列 + 统一页头组件 + 语义
  色板）**设计稿已产出，代码未落地**。是否落地未拍板，见第 11 节
- **⚠️ 设计权威性说明（2026-09-10）**：用户已明确前端设计以 Claude
  的设计判断为准，现有实现仅作参考，不是必须原样保留的基准。第 13
  节列出的设计决策是确定性结论，不是待确认的建议

## 8.1 供应商信息展示原则（确定性设计决策，2026-09-10）

**平台不做独立可浏览的供应商详情页/列表页，供应商信息仅作为产品
信息的一部分嵌入展示**，理由：防止用户绕开平台直接联系供应商、
防止供应商资源被竞品收割、与"Product 是平台权威资产"这个既有架构
方向一致。

已确认需要处理的具体代码点（不是假设）：
- `apps/web/src/app/suppliers/[id]/page.tsx`——独立供应商详情页，
  下线
- `apps/web/src/app/supplier-models/page.tsx`——独立供应商列表页，
  下线；`PublicFooter.tsx` 第 19 行对应链接一并移除
- `apps/api/src/search/search.service.ts`（约第 499 行）——统一搜索
  把 `Supplier` 作为独立可检索返回类型，需要移除
- `apps/web/src/components/products/SupplierInfo.tsx` 第 63 行——
  产品页内嵌供应商信息组件，当前有链接跳转到 `/suppliers/${id}`，
  这是实际的"泄漏点"，必须移除，否则即使下线了独立页面，用户仍能
  从产品页点过去
- **保留不变**：`SupplierModelsSection.tsx`/`SupplierCompareTable.tsx`/
  `SupplierCapabilityList.tsx`——这些是产品页内"多个供应商型号并排
  对比"的嵌入式组件，已经符合"嵌入而非独立"的设计原则，不需要改

## 9. 部署与基础设施

- Docker Compose（postgres + api + admin + minio）
- 规划：Oracle Cloud 永久免费 ARM VM（阶段一）→ 阿里云香港 ECS（阶段二）
- **既定约束：中国可访问 / 无 ICP 备案 / 自托管**——不要提议 Vercel 或
  任何需要 ICP 备案的方案
- `v0.7-release-ready`：annotated tag，tag 对象哈希 `368b1aa`，peel 到
  的 commit 是 `168f353`（"M12.5-M12.7 Production Readiness Release"）。
  这是同一个 tag，从未被移动过（早期误判为"tag 被重打"是 `git rev-parse`
  对 annotated tag 返回 tag 对象哈希而非 commit 哈希导致的误读）。
  **已推送到 origin**

## 10. 报告治理与核实方法论

- `docs/_review` 909 份报告 + `Content Management Guide` 24 份 +
  几个零散小目录（`_architecture`/`_context`/`project-management` 等）
- **治理锁定生效中**：不新建任何报告性质 md 文件，核实结果只追加进
  `docs/_context/DECISIONS.md`、`ACTUAL_STATE.md`、`执行记录.md`
- `_review` 主目录 5 个重复编号（06/36/82/92/213）：已拍板"最小扰动"
  处理——不回填/不改旧文件，仅作记录
- **核实方法论**（重要）：本项目历史上多次出现"报告说已完成，代码里
  没有"的情况（历史 Trae 报告曾高估后端 API 完成度），以及"核实过程
  本身引入新偏差"的情况（自建新报告、循环引用自己的结论、git 命令
  误用导致误判）。**任何声称"已核实"的结论，如果证据只是另一份报告
  而不是直接读源码/跑命令，视为未核实**。

## 11. 待拍板事项（按紧迫度排序，不要替用户决定）

1. bcrypt/allowBuilds 是否现在放开（如果近期需要本地测试登录相关功能，
   不应拖延）
2. `suppliers/`/`matching` 命名是否回溯改（第 5 节）
3. `ORG_ADMIN` 角色是否加入枚举
4. `AuditLog.operatorId` 外键修复方式——nullable+SetNull（推荐）/
   用户软删除，两者都涉及冻结 schema，需架构审批（第 7 节 bug 本身
   已实证确认存在，这里只是修复方式未选定）
5. apps/web 视觉设计是否延伸 blueprint 体系到工作台/产品等 ~50 个
   页面（第 8 节）
6. Admin 端统一设计系统是否落地
7. `GET /files/:id` 是否排期
8. `_review` 5 个重复编号是否需要更彻底处理
9. 匹配候选逻辑 Offer→SupplierProduct 的改动排期（第 4 节）

**已从此清单移除、视为已决策的项**：apps/web 整体开发范围
（已核实为 56 个真实页面，非"未规划"，见第 13 节）；供应商信息
展示原则（已确定，见第 8.1 节）。

## 12. 与其他文档的衔接

- 核实/决策：`docs/_context/DECISIONS.md`、`ACTUAL_STATE.md`、`执行记录.md`、
  `VISNDT_基线进度清单.md`、`report_index.md`（933 份机器骨架，结论字段
  待人工补，目前是空的，不要当作已有结论使用）
- 交接总纲：`VISNDT_项目交接准备文档.md`
- 完整真实状态报告：`VISNDT_真实状态报告.md`
- 架构审核：`VISNDT_平台架构设计审核报告.md`（含匹配候选对象等开放
  架构问题）
- 前端设计权威文档：`VISNDT_前端Web_Admin规划实施方案.md`（**执行
  前端相关任务时必读**，含全部 86 个真实页面的路由清单、5 类页面
  模板规范、供应商展示原则的完整代码定位）
- 改造路线图：`VISNDT_项目合理化提升改造建议方案.md`（Phase 0-4）
- 商业化提案（非既定需求，需用户先拍板才能执行）：
  `VISNDT_商业化产品设计方案.md`、`VISNDT_重新设计工程方案.md`
- 代码库整理：`VISNDT_代码库整理与内容保护方案.md`（含仓库三层
  260+ 零散文件的分类清理方法、真实凭据文件清单）

## 13. Web 端路由清单与前端具体决策记录（2026-09-10）

**apps/web 实际路由数：56 个**（并非早期文档误写的"仅首页"），
完整清单见 `VISNDT_前端Web_Admin规划实施方案.md` 第四节。

**本轮确认的具体决策**（执行前端任务时按此为准，不要重新讨论）：
- `Home.tsx`（admin）从未被 `router/index.tsx` 引用，是死代码，
  `/home` 实际指向 `OperationCenter`——**删除 `Home.tsx`**
- `/knowledge-base` 是唯一权威知识库路由（导航实际链接、762 行
  完整实现），`/knowledge`（479 行，未被导航引用）**下线或重定向**
- 供应商工作台 `opportunities`/`responses`/`rfqs` 三个页面是合法的
  三段式漏斗（发现可响应RFQ→提交响应→追踪列表），**不是重复功能**，
  只需要改善导航文案的区分度，不需要合并/删除
- `/workspace/supplier/runtime` 是"M28.0 Supplier Runtime"，代码
  注释明确"NOT a Marketplace/Seller Center — read-only"，实际功能
  是供应商认领平台产品，**保留但建议改名**（"runtime"是开发内部
  术语，不适合用户可见）
- 两端 `/foundation` 均为设计系统验证页（非业务功能），**不放入
  正式导航、加入 robots.txt 排除**
