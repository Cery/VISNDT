# VISNDT 项目全面技术文档

基准日期：2026-09-09 | 依据：docs/_context/ACTUAL_STATE.md 全量核实结果 + 本轮交接过程中确认的事实。本文档不复述历史报告的未核实断言。
> 2026-09-10 第二轮核实已追加：详见正文两处修正（四.7 审计日志、七 e2e 专项）与第四节/第十一节。

## 一、项目是做什么的

VISNDT 是一个面向中国大陆市场的工业内窥镜 / 工业无损检测（NDT）能力 发现平台，独立自营，不依附于现有电商或行业平台。

要解决的问题：工业检测设备（内窥镜、超声、涡流探伤仪等）的采购决策 高度依赖具体工程参数（探头直径、工作长度、视场角、分辨率等），传统采购 方式靠人工比对产品手册、逐家询价，效率低且信息不透明。VISNDT 把这些 检测参数标准化成结构化数据，让买方能像填工程规格单一样描述需求，系统 自动匹配符合参数的供应商设备，再走询价（RFQ）→报价（Offer）的标准 商务流程。

核心业务闭环（四步）：

工程检测场景描述 → 标准化参数（探头直径/工作长度等） → 方案匹配 → RFQ 提交

平台角色：买方组织（BUYER）发布需求，供应商组织（SUPPLIER）注册 产品型号并响应询价，平台管理员（ADMIN）负责治理审核（产品型号审核、 组织/用户管理、内容知识库运营）。

## 二、系统架构
### 2.1 Monorepo 结构
F:\Desktop\VISNDT                     ← git 仓库根，docs/ 在此层
└── VISNDT\                           ← pnpm workspace 根（业务代码）
    ├── apps/
    │   ├── api/          NestJS 后端，唯一数据源
    │   ├── admin/        管理后台（治理/审核）
    │   └── web/          客户端网站（买卖双方使用）
    ├── database/         Prisma schema + migrations（独立 workspace）
    └── packages/         共享包（如 @visndt/design-system）

三端通过 apps/api 暴露的 REST API 交互，admin 和 web 各自维护 独立的前端服务层（api/*.service.ts），不共享前端代码，只共享后端契约。

### 2.2 三端职责划分
|App|使用者|核心职责|
|---|---|---|
|api|—|唯一数据源与业务逻辑；鉴权、匹配引擎、Embedding 生成、审计日志|
|admin|平台运营/管理员|治理审核（产品型号/组织/用户/内容）、数据分析、运营监控|
|web|买方/供应商（终端用户）|检索能力/产品、发布需求、查看匹配结果、提交询价|

### 2.3 数据模型概览

PostgreSQL，22+ models / 15 enums，核心实体关系：

```
Organization (BUYER/SUPPLIER) ─┬─ User (ADMIN/MEMBER)
                                 └─ SupplierProduct（供应商产品型号，
                                        绑定 Organization + Product）

Product（平台能力/标准产品）─┬─ ProductCategory
                              ├─ ProductMedia
                              └─ ParameterGroup ─ ParameterDefinition
                                                    （ENUM/NUMBER/…）

Demand（买方需求）─┬─ DemandParameter（引用 ParameterDefinition）
                    ├─ DemandMatch（匹配结果，含 matchScore/matchDetails；
                    │    状态机 PENDING→MATCHED→REVIEWED→ACCEPTED/REJECTED/EXPIRED）
                    └─ RFQ ─┬─ RFQResponse
                             └─ Offer

Content / KnowledgeDomain / KnowledgeCategory / KnowledgeEntry
                    （知识库，通过 ProductCategoryKnowledgeMapping 关联产品分类）

AuditLog（跨实体审计）
```

数据库 schema/migration 处于冻结状态，任何结构性改动需要架构审批。

## 三、技术栈详解
|层|技术|备注|
|---|---|---|
|API 框架|NestJS 11|装饰器路由，Swagger 自动生成于 /api/docs|
|ORM|Prisma 5|PostgreSQL|
|鉴权|自研 JWT|无第三方 OAuth（为迁移自由度考虑，不依赖 Vercel/Auth0 等）|
|Admin 前端|React 18 + Vite + Ant Design 5 + Zustand 5 + Axios + React Router|端口 3001|
|Web 前端|Next.js|端口 3000|
|密码哈希|bcrypt 6.0.0|⚠️ 当前本机原生二进制缺失，登录功能阻塞（见第七节）|
|文件存储|MinIO（S3 兼容）|Docker Compose 内服务|
|AI/Embedding|OpenAI text-embedding-3-small|1536 维向量（schema 为 vector(1536)；代码未强制维度，模型名由 .env 覆盖）|
|容器化|Docker Compose|postgres + api + admin + minio|
|包管理|pnpm workspace|monorepo，allowBuilds 控制原生模块编译|
|Runtime|Node.js 22+||

## 四、核心功能模块

基于全量路由普查（48 controllers / 275 endpoints），按业务域归类：

### 4.1 身份与组织
- 用户（users，7 端点）：CRUD + 状态管理（ACTIVE/INACTIVE/SUSPENDED）
- 组织（organizations + organization-members，11 端点）：买方/ 供应商组织管理，成员角色（ADMIN/MEMBER），供应商可开关"产品型号 自助管理"权限
- 鉴权（auth + invitation，7 端点）：登录、邀请注册

### 4.2 产品与参数标准化体系（平台核心差异化能力）
- 产品分类（product-categories，7 端点）
- 平台产品/能力（products + 参数 + 媒体，18 端点）：标准化的 "能力"注册表，是需求匹配的基准
- 参数体系（parameter-groups + parameter-definitions，12 端点）： 定义探头直径、工作长度等参数的名称/单位/数据类型（NUMBER/ENUM 等）； 已知缺陷：ENUM 类型参数缺少枚举取值的可视化管理界面
- 供应商产品型号（supplier-products 治理端 11 + 自服务端 10 = 21 端点）：供应商在平台产品之上注册自己的具体型号（品牌/型号/系列）， 走 DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED（或 REJECTED） 审核工作流，平台级跨组织审核

### 4.3 需求与匹配
- 需求（demands，19 端点）：买方发布检测需求，附带标准化参数
- 匹配（matches + admin/matching，2 端点 + 匹配逻辑内嵌于 demand 生命周期）：需求参数与产品参数比对生成 matchScore， 匹配详情含逐参数因子（weight/score/matched/required/type）， 支持人工审核（PENDING→REVIEWED→ACCEPTED/REJECTED）与重新匹配

### 4.4 商务流程
- RFQ（rfqs，12 端点）：由匹配结果生成询价单，DRAFT→OPEN→ RESPONDING→CLOSED/CANCELLED
- RFQ 响应（rfq-responses，8 端点）：供应商对 RFQ 的响应， SUBMITTED→VIEWED→ACCEPTED/REJECTED
- 报价（offers，11 端点）：DRAFT→SUBMITTED→ACCEPTED/REJECTED/ WITHDRAWN，或独立的 ACTIVE/INACTIVE 上下架状态
- 询价咨询（inquiries，3 端点 + admin 端 6 端点）：区别于 RFQ 的 轻量级初步咨询，NEW→PROCESSING→REPLIED→CLOSED

### 4.5 内容与知识库
- 内容管理（content 系列，12+6+8+2 端点）：含标签、版本修订
- 知识库（knowledge + knowledge/public，22+6 端点）：领域/分类/ 条目三层结构，通过映射表关联产品分类，为匹配结果提供工程知识上下文 （KnowledgeContextPanel 在匹配详情页展示）

### 4.6 AI 能力
- Embedding（embedding，7 端点）：内容与产品的向量化，OpenAI text-embedding-3-small，1536 维，管理员手动触发批量生成
- 内容切片（chunking）：按段落分割，最大 1000 字符/块，为未来 RAG/语义搜索建立基础设施
- 语义检索（semantic + semantic-query，2+1 端点）
- AI 辅助（ai，3 端点）

### 4.7 平台治理与运营
- 审计日志（audit-logs + audit-intelligence，2+1 端点）
  - 2026-09-09 核实：`AuditLogService.log()` 类型定义支持 CREATE/UPDATE/DELETE/STATUS_CHANGE/LOGIN 五种 action，但**显式调用点**全仓库只有 8 处——AI 模块 5 处（均 STATUS_CHANGE）、content.service.ts 3 处（CREATE/UPDATE/STATUS_CHANGE）。LOGIN 从未被记录、DELETE 从未被使用，demands/rfqs/offers/products 等核心业务实体完全没有显式审计调用。
  - **2026-09-10 补充修正**：除上述显式调用外，`apps/api/src/prisma/prisma.service.ts` 的 Prisma 中间件 `$use` 会对**所有 model 的所有写操作**（create/update/delete/upsert）自动写一条 AuditLog（隐射 CREATE/DELETE/UPDATE，**不含 STATUS_CHANGE/LOGIN**），并在写入时排除 AuditLog 自身防递归。即自动覆盖范围比"只有文档说的窄"更广（全表写自动审计）；但 `STATUS_CHANGE`/`LOGIN` 仅由显式调用产生。
- 运营监控（admin/monitoring）：系统健康/业务风险/匹配健康/ Embedding 覆盖率/Analytics 管道五个维度的健康检查
- 业务分析（analytics + admin/analytics/business）：漏斗/ 生命周期/转化/匹配效果的深度分析（区别于首页的轻量概览）
- 文件资产（files，8 端点）：已知缺口——缺少 GET /files/:id 单文件元数据接口
- 工作流事件（workflow-events，3 端点）：驱动详情页的业务流转 时间轴展示

## 五、匹配引擎工作原理

流程层面：

- 买方发布 Demand 时，为其附加标准化参数（引用 ParameterDefinition， 支持精确值 value 或范围 valueMin/valueMax）
- 匹配引擎将 Demand 的参数集合与已发布 Product 的参数集合逐项比对
- 生成 matchScore（0-100）与结构化的 matchDetails
- 匹配结果进入 DemandMatch，状态机 PENDING→MATCHED→REVIEWED→ ACCEPTED/REJECTED（另有 EXPIRED 终态；此状态机来自 demands.service.ts 的 MATCH_TRANSITIONS 白名单，比早期概念性 描述多一个 MATCHED 中间态），人工可审核，也支持触发 rematch （删除现有匹配重新运行）
- 被接受的匹配可一键"生成 RFQ"，进入商务流程

算法实现层面（2026-09-09 直接读 matching/scoring/scoring.service.ts 完整源码核实，非概念推测）：

- 逐个需求参数计算得分后按权重加权平均：totalWeightedScore / totalWeight
- 必填参数硬性淘汰：某个 required=true 的参数得分为 0，整个匹配 直接判定 hardFail，总分强制归零，不再继续加权（scoring.service.ts 的 calculateScore 方法里这是一个提前 return 分支）
- NUMBER 类型参数不是二元判断：产品参数值落在需求的 [valueMin, valueMax] 区间内得 100 分；超出区间时按偏离比例给部分分 （Math.max(0, Math.round((1 - deviation) * 100))），不是简单的 "在范围内给分、不在范围内清零"
- ENUM 类型本质是精确匹配：大小写不敏感、去除首尾空格后比较， 匹配得 100 分，不匹配得 0 分
- 编排层在 matching/matching.service.ts；demands.service.ts 里出现的 matchScore 字段只用作查询结果排序（orderBy: { matchScore: 'desc' }）， 不是算分逻辑的实现位置，避免误读

这套机制的核心价值在于参数标准化——如果 ParameterDefinition 体系 不完整（比如 ENUM 类型缺 Option 管理，见第七节），匹配精度会直接受影响。

## 六、设计系统
### 6.1 客户端（apps/web）——已落地

"工业蓝图/工程图纸"视觉语言，核心理念是让界面本身呼应检测/测量行业的 视觉语汇，而不是套用通用 SaaS 模板：

- 配色：石墨灰（blueprint-graphite）+ 暖纸色底 + 琥珀强调色 （blueprint-amber）+ 靛青绿次要色
- 字体：Noto Sans SC（正文）+ JetBrains Mono（参数数值/编号，等宽字体 强化"这是精确工程数据"的语感）
- 结构性元素：四角测量标记线（呼应检测/测量场景）、索引表格式的分类 浏览（而非图标卡片网格）、设备参数直接列在产品卡片上（而非笼统的 图片+标题）
- 已验证落地范围：PublicHeader、PublicFooter、首页（HomeHero 等 6 个组件），使用真实数据（产品型号总数、供应商总数），非静态示例

### 6.2 Admin 端——设计稿阶段，未落地

针对管理员的"待办优先"信息架构（区别于客户端的营销/浏览导向）：

- 核心理念：治理队列（产品型号审核）作为首页主体，替代纯粹的 KPI 仪表盘/图表墙——依据是 OperationCenter.tsx 代码注释里已经写明的 团队共识"No fake KPI / hard-coded counts"
- 复用客户端的色系家族，但状态语义色（成功/警示/错误/处理中）做了 区分，保持功能可辨识度
- 统一的页头组件、状态标签样式，解决此前"15+ 个文件各自内联重复页头 样式"、"状态色语义分散在各文件"的问题
- 当前状态：仅有设计稿（首页/列表页/详情页模板），代码未改动

## 七、已知缺陷与技术债（全部经代码核实，非报告转述）

### 高优先级 / 当前阻塞

1. **bcrypt 原生二进制缺失**：pnpm-workspace.yaml 的 allowBuilds 跳过了 bcrypt 的原生构建，bcrypt_lib.node 不存在，导致任何依赖 密码哈希的登录请求当前必然失败。这不是间歇性问题，是持续阻塞。
2. **审计中间件 FK → 活跃用户删除被阻断【已本地实证，当前阻塞】**
   - PrismaService `$use` 中间件对全部 model 全部写操作自动写 AuditLog，`operatorId` 引用 User。
   - **2026-09-10 本地实证确认**（非推测）：模拟"用户执行过操作 → 管理员删除"，走 `UsersService.remove` 同款数组事务 `$transaction([...user.delete])`，触发 `PrismaClientKnownRequestError P2003`，`meta.field_name=audit_log_operator_id_fkey (index)`，**删除被外键挡住，用户删除后仍存在**。
   - 影响：只要目标用户的历史操作产生了审计行（几乎必然），`UsersService.remove`（admin 用户管理="删除用户"）就报 P2003 失败 → **用户管理这一核心治理功能实际是残缺的**，与 bcrypt 并列当前阻塞。
   - **修复方式有取舍，"不是随便选一个执行"（独立待拍板项，见第十节）**：
     - ❌ 先清 audit_log 再删用户、或 FK 改 CASCADE：效果一致——删除用户的同时抹掉该用户**全部历史操作痕迹**。但审计的存在意义恰是"即使当事人不在，操作痕迹仍在"（离职员工、封禁账号恰恰最需保留）→ 两者都违背审计本意。
     - ✅ 更合理方向：`audit_log.operatorId/entityId` 改为 **nullable + onDelete: SetNull**（用户删除时审计行保留、关联置空）；或给 User 做**软删除**（从不真正 DELETE 行）。两者都牵涉 **schema 冻结区**，按治理规则需走架构审批后再动。
     - 因此本项拆成两件独立的事：①bug 存在（已实证）②用哪种方式修（有代价、需审批），不要合并成"选一个让 Trae 改"就完。
3. **审计日志显式调用点远窄于文档声明**：
   - 显式 `AuditLogService.log` 调用仅 8 处（AI 模块 5 处 STATUS_CHANGE、content 3 处 CREATE/UPDATE/STATUS_CHANGE）；LOGIN 从未记录、DELETE 从未使用、核心业务实体无显式写入。
   - 注：`STATUS_CHANGE`/`LOGIN` 不被中间件自动覆盖（中间件仅隐射 CREATE/UPDATE/DELETE）。
   - **附发现**：Prisma 5 的 `$use` 中间件**不随交互式事务客户端 `tx` 触发**——只有根客户端及数组事务 `$transaction([...])` 走中间件。这使"自动审计覆盖一切"的断言需加限定。
4. **e2e 真实结果（2026-09-10 更新，替换 09-09 旧结论）**：
   - 09-09 旧结论（19 spec / 165 用例全部因 docker 未启动连不上库而失败）已过时——本次 docker 已起 + 迁移 up-to-date，e2e 已真实跑通。
   - 真实结果：**165 用例，117 通过 / 48 失败；8/19 套件失败**。48 个失败中相当比例源自两类**代码缺陷**而非业务断言：审计中间件 FK 冲突（清理级联失败）+ `Product.categoryId` 非空与 e2e fixture 失配（`PrismaClientValidationError: Argument 'category' is missing`）；另有少量语义差异（auth 注册无邀请码期望 401、实际 400）。详见第十一节。

### 中优先级
- GET /files/:id（单文件元数据接口）不存在，前端用内联数据绕过
- ParameterDefinition 的 ENUM 类型缺少枚举取值的可视化增删改界面， 影响参数标准化体系的可维护性
- apps/web 整体页面范围尚未定案（首页已落地，其余页面未规划）

### 低优先级 / 待产品决策
- ORG_ADMIN 角色不在角色枚举中（现仅 ADMIN/MEMBER/SUPPLIER）
- suppliers/、matching/ 模块命名与 Blueprint 规范禁用术语冲突， 是否回溯改名未拍板（涉及数据库表名，改动面大）

### 已解决（历史遗留，本轮核实确认已修复）
- organizations GET :id 已转 public
- admin Vite dev proxy 端口已修正（→4000）
- BusinessAnalytics.tsx 9 处图表颜色字面量 bug 已修复
- Placeholder.tsx 死代码已删除

## 八、部署与基础设施现状
- 本地：Docker Compose（postgres + api + admin + minio）
- 规划路径：Oracle Cloud 永久免费 ARM VM（阶段一）→ 阿里云香港 ECS （阶段二）
- 既定约束：中国可访问、无 ICP 备案、自托管——历史上曾有工具建议 用 Vercel 部署，与此约束直接冲突，已否决
- v0.7-release-ready tag 已推送到 GitHub origin

## 九、项目治理历史与经验教训

这个项目积累了 900+ 份执行报告，过程中反复出现"报告声称已完成，代码 里没有"的落差（历史工具报告曾高估后端 API 完成度），以及"核实工作 本身又引入新偏差"的情况（自建新报告、循环引用自己的结论作为证据、 git 命令误用导致误判 tag 状态）。

2026-09-09 交接核实建立了新的治理原则：

- 任何"已核实"的结论，证据必须是直接读源码/跑命令的结果， 不能是另一份报告
- 治理期间不再新建报告性质的文件，核实结果只追加进 DECISIONS.md/ACTUAL_STATE.md/执行记录.md 三份文件
- 冻结区域不等于"这是完美状态"，只是"改动需要走审批"，冻结项 本身也应该有复查节点

## 十、当前待拍板事项汇总
|#|事项|紧迫度|
|---|---|---|
|1|bcrypt/allowBuilds 是否现在放开|高（如需本地测登录）|
|2|suppliers/matching 命名是否回溯改|中|
|3|ORG_ADMIN 角色是否加入枚举|低|
|4|apps/web 整体开发范围|待规划|
|5|Admin 端统一设计系统是否落地|待规划|
|6|GET /files/:id 是否排期|低|
|7|_review 5 个重复编号是否需要更彻底处理|低|
|+A |审计中间件 FK：活跃用户删除被 P2003 阻断（已实证，bug 存在）|**当前阻塞**（与 bcrypt 并列）|
|+B |FK 修复方式取舍（清审计 vs CASCADE vs operatorId SET NULL vs 用户软删；前两者毁审计、后两者改冻结 schema 需审批）|**当前阻塞·关联**，独立拍板|

## 十一、2026-09-10 第二轮核实偏差与结果（追加）

> 本轮为只读核实，未修改任何业务代码。逐格状态见根目录 `后端核实覆盖矩阵.md`；原始 e2e 日志 `F:\Desktop\VISNDT\e2e_full_result.log`。

### 11.1 e2e 真实运行（第 0 步，替换第七节旧结论）
环境：docker `visndt-postgres` healthy + `prisma migrate status` up-to-date（38 迁移已应用）。
```
Test Suites: 8 failed, 11 passed, 19 total
Tests:       48 failed, 117 passed, 165 total
```
失败套件：matching/match-flow、auth/auth-invitation、users/users-security、matching/performance-benchmark、demands/demand-flow、organizations/organizations-security、offers/offer-core、rfq/rfq-core。

**三类真实根因（均非环境）**：
1. **审计中间件 FK 冲突**：`prisma.service.ts` 的 `$use` 自动写 AuditLog，`operatorId=currentUserId ?? 全零UUID`；测试清理 `user.deleteMany` 命中 `audit_log_operator_id_fkey` → 成套件级联失败。同缺陷影响 `UsersService.remove` 用户删除路径（事务未先清 AuditLog）。
2. **Schema 漂移 → fixture 失效**：`Product.categoryId` 非空，e2e `createProductWithParams`（match-flow.e2e-spec.ts:208）未传 `category` → `PrismaClientValidationError: Argument 'category' is missing`。
3. **断言语义差异**：auth-invitation Case1「注册无邀请码」期望 401，实际 `AuthService.register` 抛 `BadRequestException`(400)。

推论：失败中相当比例是①的级联效应，**不能简单解读为业务逻辑错误**；117 通过说明主链路（产品/admin/rematch/category-filter/rate-limit/workflow-permission）真实跑通。

#### 11.1.1 FK 冲突是否真实生产 bug —— 已本地实证确认（不是推测）
用回滚安全的临时脚本复刻 `UsersService.remove` 的删除路径，在本地 Postgres 实测：
```
DELETE_RESULT : ERROR
ERROR_NAME    : PrismaClientKnownRequestError
ERROR_CODE    : P2003
ERROR_META    : {"modelName":"User","field_name":"audit_log_operator_id_fkey (index)"}
USER_EXISTS_AFTER : YES (删除被阻断)
```
结论：**只要目标用户的历史操作产生了审计行（`operatorId`/`entityId` 指向该用户），删除就被 `audit_log_operator_id_fkey` 挡住、用户仍在**。`UsersService.remove`（admin 用户管理"删除用户"）对活跃用户必然 P2003。测试数据已清理，数据库无残留。
额外发现：Prisma 5 的 `$use` 中间件**不随交互式事务 `$transaction(async tx=>…)` 触发**，仅根客户端与数组事务触发——评估"自动审计覆盖率"时需注意。

#### 11.1.2 非 FK/非 fixture 的真实断言失败（原始证据）
- **组织跨域鉴权**：`organizations-security.e2e-spec.ts:211` `GET /organizations/:id (other org)` 期望 403、实收 **200**；`:281` PATCH (MEMBER) 期望 403、实收 **200**。注意：GET /organizations/:id 已按文档转 public（故 GET 返回 200 是预期）；PATCH 收 200 则需复核是否真漏鉴权或用例种子问题——**待进一步定位，不擅自下论断**。
- **产品 / RFQ create**：`expect(res.status).toBe(200)` 实收非 200（`offers/offer-core:193`、`rfq/rfq-core:243` 等）——多为前述 fixture（category 缺参）级联。

#### 11.1.3 三条原始报错堆栈（用户要求的原始材料）
（1）FK 冲突（`e2e_full_result.log`，cleanup `prisma.user.deleteMany`，经中间件 `next(params)` 抛出）：
```
Foreign key constraint violated: `audit_log_operator_id_fkey (index)`
    -> this.$use(async (params, next) => {
       const result = await next(params);
       ...
   70 await prisma.user.deleteMany(
```
（2）`categoryId` 缺失（`PrismaClientValidationError`）：
```
Argument `category` is missing.
   -> this.$use(...) { const result = await next(params); ... }
（type 提示给了 connectOrCreate: ProductCategoryCreateOrConnectWithoutProductsInput …）
```
（3）组织跨域鉴权断言失配：
```
expect(received).toBe(expected) // Object.is equality
Expected: 403
Received: 200
   -> expect(res.status).toBe(403);   // organizations-security.e2e-spec.ts:211 / :281
```

### 11.2 审计日志覆盖（修正第一轮 §8 判读）
中间件自动覆盖**所有 model 所有写操作**（隐射 CREATE/DELETE/UPDATE），排除 AuditLog 防递归；**不映射 STATUS_CHANGE/LOGIN**（这两者仅由显式 `AuditLogService.log` 调用产生，如 content 模块的 STATUS_CHANGE）。

### 11.3 本轮完整读取源码的模块（service 全文）
- `auth.service.ts`：register/login/refreshTokens（token 轮换）/logout/validateUser；`resolveWorkspaceRole` 与 supplier-products 816 归属判定同源。
- `supplier-products.service.ts`（治理核心）：状态机 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED`；`publish` 有门禁（拒绝 platform 占位 brand/modelNumber、要求 brand+modelNumber+description）；`createOwn/submitOwn/updateOwn` 全经 `validateForOrganization` 归属隔离；`remove` 受 Offer.supplierProductId(Restrict) 依赖保护。
- `offers.service.ts`：状态机 + `validateSupplierBinding`（校验 supplierProduct.organizationId/platformProductId 与 offer 一致）。
- `organizations.service.ts` / `users.service.ts` / `content.service.ts`（状态机+修订快照+审计）/ `embedding.service.ts` / `workflow-events.service.ts` / `notifications.service.ts`（ADMIN 组织域 / MEMBER 自域）。
- schema 提取：User/Organization/Product/Offer/SupplierProduct/Demand/DemandParameter/DemandMatch/Content/KnowledgeEntry 等完整字段块。

### 11.4 embedding 细节核对
- 模型名读取 `OPENAI_EMBEDDING_MODEL`，`.env` 实际为 `openai/text-embedding-3-small`（base URL 指向 OpenRouter）。
- **1536 维未在代码强制**（仅注释声称 "@returns 1536-dim"）；schema `Product.embedding`/`Content.embedding` 为 `Unsupported("vector(1536)")`。
- 1000 是 `generateContentChunks` 的 `maxChunkSize`；embedding 文本为 `slice(0, 8000)`。

### 11.5 留白模块已补齐（第 2.5 轮）
- `matching.service.ts`（编排层）✅ 已核实：`match()` 全流程（加载 demand→候选产品（ACTIVE+有 ACTIVE Offer+category filter）→逐产品 `scoring.calculateScore`→过滤低分→`demandMatch.upsert`（PENDING+matchDetails+workflow event）→返回统计）+ `review`/`accept`/`reject` 状态机（前置状态校验 PENDING/REVIEWED + 组织域隔离 + 工作流事件）。
- `workspace.service.ts` ✅ 已核实：Buyer/Supplier Overview（count 聚合）、BuyerDemands/PendingDecisions、SupplierRfqs/Responses/Products/InquiryContext、`attachSupplierProduct`（817，DRAFT+防重复+平台权威保持）。
- `search.service.ts` + `semantic/` ✅ 已核实：统一发现（Product/SupplierProduct/Knowledge/Content/Solution/Supplier，filter-before-pagination，Supplier 来源=PUBLISHED SupplierProduct→Organization）；语义检索用 pgvector `<=>` 余弦 + 阈值 + 诊断（`retrieval.service.ts`）；`semantic.service.ts` 仅为健康检查壳。
- `knowledge.service.ts` ✅ 已核实全部 28 方法体：Domain/Category/Entry/ContentRef/Relation CRUD、public 查询、`findRelatedProducts`（经 `ProductCategoryKnowledgeMapping` 反向映射 + 确定性排序）。
- `file-asset.service.ts` + controller ✅ 已核实：MIME 白名单(图片/pdf/office/txt/csv)+10MB 限制；`upload`/`batchUploadWithOwnership`（ownership 标记防被当孤儿清理）；`download`（Content 关联文件需 `PUBLISHED` 门禁，否则 403）；`delete`/`batchDelete`（`canDeleteSafely` 三重媒体引用校验）；孤儿清理 `findOrphans`+`cleanupOrphans`（entityId=占位符 + organizationId=null + 四类媒体引用为 0）。
  - **确认缺陷属实**：**无 `GET /files/:id`**（单文件元数据接口）——controller 只有 `GET /`(ADMIN) / `GET orphans` / `GET :id/download` / `DELETE :id` 等，前端内联数据绕过。
  - **观察（待复核）**：`GET :id/download` **无 UrlGuard**——非 Content 关联文件对外公开返回签名下载 URL（service 注释注明"保留旧公开行为"）；有授权面收紧空间，但为既有有意行为。
- **后端 service 层覆盖矩阵已全绿**（唯一曾留白的 file-asset 已补齐）。

## 附录：相关文档索引
- 项目操作手册（面向 AI 工具）：CLAUDE.md
- 交接总纲：VISNDT_项目交接准备文档.md
- 核实执行过程记录：docs/_context/{DECISIONS, ACTUAL_STATE, 执行记录, VISNDT_基线进度清单}.md
- 核实覆盖矩阵：后端核实覆盖矩阵.md
- 第一轮原始证据：后端源码与关键结论独立验证.md | 引出本轮的证据：给Trae的核实指令_第二轮.md
- 蓝图原始设计文档：docs/VISNDT-Blueprint/（600_Frontend 系列已冻结）
- 历史执行报告：docs/_review/（909 份）、docs/Content Management Guide/（24 份）