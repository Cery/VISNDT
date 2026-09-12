# VISNDT 前端设计审计报告

**基准日期：2026-09-10 | 依据：直接读取 `github.com/Cery/VISNDT`（commit
`bc9effd`）源码 + 本对话前期对 admin 全部 30 个上传页面的逐文件核实。**

> ⚠️ **本报告包含一项重大修正**：此前所有文档（含 CLAUDE.md 待拍板清单
> 第 4 条）反复写"apps/web 整体页面范围尚未定案，首页已落地、其余未
> 规划"——**这个结论是错的**。直接读仓库发现 apps/web 实际有 **56 个
> 页面**，抽查的几个（产品列表 513 行、买方工作台 275 行、供应商报价
> 列表 221 行）都是接真实 `react-query` + service 层的完整实现，覆盖
> 买方/供应商双端工作台、需求/匹配/RFQ/报价全流程、知识库、搜索、
> 供应商自服务等完整业务闭环。这个发现本身就是本报告最重要的结论
> 之一，需要同步更正 CLAUDE.md 和技术文档。

---

## 一、Admin 前端审计（30 个页面，本对话前期逐文件读过源码）

### 1.1 正面评价

- **状态机驱动的页面模式统一**：几乎每个列表/详情页都用
  `PageState = loading | error | empty | success` 的判别联合类型，
  loading/error/empty 三态处理一致，不是每个页面各写一套
- **`StatusTag` 组件承担了状态语义统一的职责**，`resolveStatusTone`
  这套语义色映射是良好的设计意图
- **可复用操作组件**（`AdvancedFilterPanel`、`BatchActionBar`、
  `ExportButton`）在多个列表页复用，没有重复造轮子

### 1.2 问题清单（已在本对话中间轮次逐条核实）

| 问题 | 具体表现 | 影响 |
|---|---|---|
| 页头模式重复而非组件化 | "4px 色块 + Title + 副标题"这个结构在 `DemandList`、`InquiryList`、`OfferList`、`OrganizationList`、`RfqList`、`RfqCreate`、`RfqDetail`、`ProductCreate`、`ProductEdit`、`UserCreate`、`UserEdit` 等 15+ 文件里各自内联重复 | 以后统一改页头样式要改十几个文件 |
| 标题语言不统一 | 大部分中文，但 `OrganizationDetail`="Organization Profile"、`UserDetail`="User Profile"、`RfqCreate`="Create RFQ"、`MatchDetail`="Match Analysis" | 中英混杂，对中文管理员不友好 |
| 状态色/标签映射分散 | `STATUS_LABEL_MAP`、`ACTION_COLOR`、`RFQ_STATUS_LABEL_MAP`、`INQUIRY_STATUS_LABEL_MAP` 等在多个文件各自定义，`StatusTag` 统一系统没有被所有页面复用 | 语义色漂移风险，维护成本高 |
| 图表颜色字面量 bug（已修复） | `BusinessAnalytics.tsx` 9 处 `fill="VISNDT_COLORS.success"` 应为 `fill={VISNDT_COLORS.success}` | 已在本轮核实中修复 |
| 命名冲突 | "询价"（Inquiry，轻量咨询）与 RFQ（正式报价请求）是两个不同实体，但中文标签都往"询价"上靠，容易让管理员混淆业务阶段 | 认知负担 |
| Home.tsx / OperationCenter.tsx 理念冲突 | 前者是 KPI 仪表盘/图表墙，后者的代码注释明确写"No fake KPI / hard-coded counts"，两个首页级页面理念相反且同时存在 | 需要产品决策取舍其一 |

### 1.3 已产出但未落地的改造方案

本对话中已经设计出"待办优先"信息架构的统一设计稿（治理队列为主体、
统一页头组件、语义色板），采用了石墨灰/暖纸色/琥珀/靛青绿的配色家族，
与下面 web 端的 blueprint 体系呼应。**目前仅有设计稿，admin 端代码
一行未改**。

---

## 二、Web 前端审计（重大范围修正后的完整评估）

### 2.1 页面清单（56 个，非此前认为的 1 个）

```
公开发现层：首页 / 产品列表 / 产品详情 / 产品对比 / 分类 / 搜索 /
           供应商列表&详情 / 供应商型号 / 解决方案 / 知识库（域/条目）/
           知识中心 / 文章 / 洞察 / 关于 / 商务合作 / 登录 / 注册 /
           离线页

工作台层（买方）：仪表盘 / 需求列表&创建&编辑&详情 / 匹配列表&详情 /
           RFQ 列表&创建&详情 / 评估 / 通知 / 设置

工作台层（供应商）：仪表盘 / 产品型号列表&详情 / 报价列表&创建&编辑 /
           询价列表&详情 / RFQ 列表&详情 / 商机 / 成员管理 / 资料 /
           展示页 / 运行时（含询价上下文）
```

覆盖面完整，是一个真正意义上的买卖双方业务闭环产品，不是营销站 +
占位符。

### 2.2 设计系统一致性——发现一个真实的、值得优先处理的缺口

**`blueprint-*` 设计令牌的实际使用范围只有 8 个文件**：
`PublicHeader`、`PublicFooter`、以及首页的 6 个 section 组件
（`HomeHero`、`RecentProductsSection`、`CategoryRegisterSection`、
`KnowledgeIndexSection`、`SolutionFlowSection`、`CTASection`）。

**其余 50 个页面（占比近 90%）用的是完全不同的、未被任何文档描述过的
视觉体系**——组件目录里有独立的 `components/engineering/`（如
`EngineeringDiscoveryNav`，工程信息发现导航）、`components/workspace/`
（`WorkspaceLayout`、`BuyerJourneySteps`、`StatCard` 等）自成一套，
没有使用 `blueprint-*` 令牌。

**这意味着**：一个用户从首页（已经是精心设计的"工业蓝图"视觉语言）
点击"查看检测产品"或登录进工作台，会进入一个**视觉语言完全切换**的
页面——这不是"admin 和 web 风格不统一"这种此前讨论过的问题，是**web
端自己内部就不统一**，而且是营销首页（访客第一眼看到的）和实际产品
体验（真正下单/管理业务的地方）风格不一致，后者反而更重要却更朴素。

**这个发现改变了"统一设计系统"这件事的实际范围**：此前的讨论一直
是"客户端已落地 vs Admin 待落地"的两分法，实际情况应该是三分：
1. **web 首页+页头页脚**（blueprint 体系，已落地，8 个文件）
2. **web 工作台+产品发现层**（未知/未设计的体系，50 个文件，范围
   比 admin 端要改的量还大）
3. **admin 端**（设计稿已出，未落地）

### 2.3 正面评价

尽管视觉语言不统一，**工程实现质量是扎实的**：
- `AuthGuard`/`RoleGuard` 权限包装组件在需要鉴权的页面统一复用
- `EmptyState`/`ErrorState`/`Loading` 这套通用状态组件在多个页面复用，
  没有像早期 admin 那样每页各写一套
- `WorkspaceLayout` 承担了工作台页面的布局统一
- SEO 元数据（`buildPageMetadata`）在知识库等内容页面有规范化处理
- 用 `react-query` 做数据请求，不是裸 `fetch`/`useEffect` 手写加载
  状态（比早期 admin 页面的手写状态机模式更现代）

工程架构上，web 端反而比 admin 端更成熟；问题出在**视觉设计系统的
覆盖范围**，不是代码质量。

---

## 三、两端对比结论

| 维度 | Admin | Web |
|---|---|---|
| 页面规模 | 30 个，已核实全部 | 56 个，此前完全未被文档覆盖 |
| 设计系统覆盖 | 未落地（仅设计稿） | 8/58 文件落地（首页+头尾），核心业务页面未覆盖 |
| 组件复用 | 部分复用，页头/状态色仍分散 | 状态组件（Empty/Error/Loading）复用良好 |
| 数据请求模式 | 手写 `PageState` 判别联合 | `react-query` |
| 最大风险 | 15+ 处页头重复代码，未来改样式成本高 | 首页精美但产品核心体验风格割裂，且此前完全没被纳入审计范围 |

**统一设计系统这件事，真正需要优先投入的不是 admin 端**（虽然那边也
该做），**而是 web 端的工作台和产品发现层**——这部分是买卖双方真正
使用产品完成业务的地方，目前的视觉一致性状况此前从未被评估过，风险
被严重低估了。
