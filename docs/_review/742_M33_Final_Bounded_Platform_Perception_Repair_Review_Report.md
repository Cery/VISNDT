# 742_M33_Final_Bounded_Platform_Perception_Repair_Review_Report

> 报告编号：742_M33_Final_Bounded_Platform_Perception_Repair  
> 报告类型：Frontend UX / Bounded Platform Perception Repair（有界修复 + 运行时验证）  
> 执行日期：2026-08-29  
> 评估范围：Web 前端（:3000）公共页面 `/products`、`/categories`，Supplier 旧入口 `/workspace/supplier`，已认证公共页 Header 平台入口  
> 执行方式：在 `740 Scope Reconciliation And Final Gate Audit` 与 `741 Cross-Role Platform Perception Audit` 基线上，执行**一次且仅一次**有界 Minimal Repair  
> 审计脚本：`VISNDT/database/_741_role_gate.mjs`、`VISNDT/database/_742_header_verify.mjs`  
> 截图目录：`VISNDT/database/_741_role_shots/`、`VISNDT/database/_742_header_verify/`  

---

## 一、任务概述

本任务基于 `740` 的范围裁决与 `741` 的跨角色平台感知审计结论，对 M33 当前已确认的 **Core Capability Perception Blocker** 进行最后一次、严格有界的修复：

- 将 `/products` 从「电商式能力目录」收敛为「工业检测能力注册表」语义；
- 将 `/categories` 从「产品分类」收敛为「能力分类索引」语义；
- 将 Supplier 旧入口 `/workspace/supplier` 从显式 Compatibility Shell 改为自动重定向至正式工作台 `/dashboard/supplier`；
- 在公共页面 Header 为已登录 Buyer/Supplier 添加最小化的「工作台」平台入口（桌面 + 移动端）。

**严格约束**：不修改 Backend / API / Database / Schema / Migration / Architecture / Business Logic / Route Architecture / Matching / Search / AI；不新增 Supplier Store / Marketplace / Transaction / 独立供应商页面；不进入 741 中已明确的 Header 信息架构重构、Layer B/C 页面重设计、Admin 数据治理等 Future Candidate 范围。

---

## 二、运行时与环境现状

| 服务 | 端口 | 状态 | 说明 |
|------|------|------|------|
| Web（Next.js 15） | 3000 | ✅ | 已重新构建并启动（`npx next build` exit 0 / `next start`） |
| Admin（Vite + AntD 5） | 3001 | ✅ | 工业运营中心 |
| API（NestJS） | 4000 | ✅ | `/api/v1/auth/login` 角色登录正常 |
| CDP（Edge headless） | 9222 | ✅ | 真实浏览器截图与 DOM 度量 |

**测试账号（来自 `database/seed_demo.ts`）**

| 角色 | 邮箱 | 组织 |
|------|------|------|
| Buyer | `demo.buyer.01@visndt.local` | 江南航空检测技术中心（BUYER） |
| Supplier | `demo.supplier.01@visndt.local` | 明视工业检测设备有限公司（SUPPLIER） |
| Admin | `demo.admin@visndt.local` | VISNDT 平台运营中心（ADMIN） |

---

## 三、修改清单（严格有界）

| 文件 | 修改类型 | 修改内容 |
|------|----------|----------|
| `apps/web/src/app/products/page.tsx` | 文案 | 标题 →「工业检测能力注册表」；搜索占位符 →「搜索检测能力、技术参数或型号…」；分类标签加「检测能力」后缀；数据锚点 →「项已注册检测能力」 |
| `apps/web/src/app/products/layout.tsx` | 文案 | `metadata.title/description/openGraph` 统一使用「能力注册表」语义 |
| `apps/web/src/components/products/ProductCard.tsx` | 文案 + 锚点 | 主按钮 →「查看能力详情」；锚点从 `#suppliers` 改为 `#specifications`；底部分类加「检测能力」后缀；详情链接 →「技术规格 →」 |
| `apps/web/src/components/products/ProductGrid.tsx` | 文案 | 结果计数 →「项注册能力」；空状态 →「能力注册表正在建设中」 |
| `apps/web/src/app/categories/page.tsx` | 文案 | 标题 →「能力分类」；副标题 →「按工业检测能力分类索引注册能力」；卡片标题加「检测能力」后缀；slug 后缀 →「· CAPABILITY」；子类标签加「能力」后缀；入口文案 →「浏览能力索引」 |
| `apps/web/src/app/workspace/supplier/page.tsx` | 行为 | 移除 Compatibility Shell 提示，改为 `useEffect` 自动 `router.replace('/dashboard/supplier')`，并显示加载过渡 |
| `apps/web/src/components/layout/PublicHeader.tsx` | 新增入口 | 已登录态桌面端与移动端菜单均新增「工作台」按钮，链接至 `/dashboard` |
| `database/_741_role_gate.mjs` | 脚本增强 | 增加 375/768/1024/1440 四视口，补充公共页面 `/products`、`/categories` 截图捕获 |
| `database/_742_header_verify.mjs` | 新建脚本 | 通过真实 API 登录并转移 HttpOnly Cookie 至 CDP 浏览器，验证桌面/移动端 Header「工作台」入口可见性 |

---

## 四、构建与类型验证

```bash
cd apps/web
npx next build
```

**结果**：✅ exit 0，无类型错误，无构建失败；ESLint 仅返回既有 Warning（未使用变量、`<img>` 优化建议、Hook 依赖等，均非本任务引入）。

---

## 五、运行时验证

### 5.1 已认证公共页平台入口验证（`_742_header_verify.mjs`）

脚本通过 `POST /api/v1/auth/login` 真实登录，将 `access_token` / `refresh_token` HttpOnly Cookie 写入 CDP 浏览器，访问 `/products`，检测桌面端（1440×900）与移动端（375×812）Header 中「工作台」按钮的存在性与可见性。

**验证结果**：

```text
BUYER_DESKTOP_WORKSPACE {"text":"工作台","rect":{"x":1071.3125,"y":18,"width":94,"height":36,"top":18,"right":1165.3125,"bottom":54,"left":1071.3125},"visible":true}
BUYER_MOBILE_WORKSPACE {"text":"工作台","rect":{"x":148.328125,"y":479,"width":94.34375,"height":42,"top":479,"right":242.671875,"bottom":521,"left":148.328125},"visible":true}
SUPPLIER_DESKTOP_WORKSPACE {"text":"工作台","rect":{"x":1071.3125,"y":18,"width":94,"height":36,"top":18,"right":1165.3125,"bottom":54,"left":1071.3125},"visible":true}
SUPPLIER_MOBILE_WORKSPACE {"text":"工作台","rect":{"x":148.328125,"y":479,"width":94.34375,"height":42,"top":479,"right":242.671875,"bottom":521,"left":148.328125},"visible":true}
```

**结论**：Buyer / Supplier 在桌面与移动端公共页面均可见「工作台」入口，已登录用户从公共页面进入平台的感知闭环建立。

### 5.2 跨角色多视口平台感知复证（`_741_role_gate.mjs`）

修复后重新执行 `_741_role_gate.mjs`，覆盖 Buyer / Supplier / Admin / Public 四类角色，375×812 / 768×1024 / 1024×768 / 1440×900 四视口。

**统计**：

- 总度量记录：`423` 条
- 截图文件：`_741_role_shots/` 下全部 PNG 重新生成
- HTTP 200：全部通过
- 新引入 runtime error：`0`（见 §6.2 既有残余说明）
- 溢出情况：Web 1024 视口仍存在既有共享 Header 横向溢出（`sw=1097 > iw=1024`，非本任务引入，已在前序 729/732/735 中登记为 DEFERRED）

**关键感知证据**：

| 页面 | 角色 | 视口 | 标题/语义 | 状态 |
|------|------|------|-----------|------|
| `/products` | public | 375/768/1024/1440 | 「能力注册表 \| VISNDT」 | ✅ |
| `/categories` | public | 375/768/1024/1440 | h1「能力分类」+ 能力索引文案 | ✅ |
| `/products` | buyer/supplier | 375/768/1024/1440 | 与 public 一致的能力注册表语义 | ✅ |
| `/workspace/supplier` | supplier | 375/768/1024/1440 | 自动重定向至 `/dashboard/supplier`，不再显示 Compatibility Shell | ✅ |
| `/dashboard/supplier` | supplier | 375/768/1024/1440 | 正式供应商工作台完整呈现 | ✅ |

---

## 六、缺陷与残余项分类

### 6.1 本次修复已关闭的 741 项

| 741 编号 | 问题 | 修复方式 | 状态 |
|----------|------|----------|------|
| P0-1 | Supplier `/workspace/supplier` 为显式 Compatibility Shell | 自动重定向到 `/dashboard/supplier` | ✅ CLOSED |
| P0-2 | 公共页面对已登录 Buyer/Supplier 零角色感知 | Header 新增「工作台」入口 | ✅ CLOSED（最小闭环） |
| B1（740 A 类） | `/products` 电商范式感知 | 全页文案/数据锚点/卡片 CTA 统一为「能力注册表」语义 | ✅ CLOSED |
| B2（740 A 类） | `/categories` 商品名认知断层 | 标题/副标题/卡片/子类统一「能力分类索引」语义 | ✅ CLOSED |

### 6.2 未进入本次修复的残余 / Future Candidate

| 编号 | 问题 | 来源 | 不修复理由 | 处置 |
|------|------|------|------------|------|
| FC-742-01 | Supplier `/workspace/supplier/rfqs` 列表显示 Buyer 侧「需求」文案，角色数据错位 | 741 P0-3 | 涉及业务逻辑与数据面，超出「感知修复」范围；需后端/前端业务页联合治理 | **Future Candidate** |
| FC-742-02 | Admin 首页「平均匹配度 10,000%」等异常指标展示 | 741 P2-4 / 740 E 类 | 属于数据/Metric 治理，未修改 Backend/Admin 业务逻辑 | **Future Candidate** |
| FC-742-03 | 公共页面 Header 导航文案（产品中心/产品分类等）仍偏官网 | 741 D 类 / 740 D 类 | Header 信息架构重构为独立 IA 工作，不在 740 授权的 B1+B2 修复范围内 | **Future Candidate** |
| FC-742-04 | Web 1024 视口共享 Header 横向溢出 | 729/732/735 已登记 | 既有基线，非本任务引入 | **DEFERRED** |
| OBS-742-01 | `pub_products_768` 捕获到 1 条 RSC prefetch `/register` 相关 runtime error（`Cannot find module './9155.js'`） | 本次验证 | 页面本身 `/register` 直接访问 200；错误为背景 RSC payload 预取，不影响用户可见渲染；与本次文案/入口修改无关 | **Observation**（建议冻结期后排查 Next.js chunk 一致性） |

---

## 七、与冻结约束的关系

根据项目记忆、`ARCHITECTURE_FREEZE.md` 精神与 740 范围裁决：

- **已修改**：前端展示层文案、链接锚点、最小入口按钮、旧入口重定向行为；
- **未修改**：Backend、API、Database、Schema、Migration、Architecture、Business Logic、Matching、Search、AI、Route Architecture；
- **未新增**：Supplier Store、Marketplace、Transaction、独立供应商页面、Schema、API；
- **未激活**：AI / RAG / 自动生成内容。

本次修复完全落在 740 授权的「一次且仅一次有界 Minimal Repair」边界内。

---

## 八、截图证据索引

| 文件 | 说明 |
|------|------|
| `database/_741_role_shots/pub_products_*.png` | 公共 `/products` 四视口：能力注册表语义 |
| `database/_741_role_shots/pub_categories_*.png` | 公共 `/categories` 四视口：能力分类索引 |
| `database/_741_role_shots/supplier_workspace_legacy_*.png` | `/workspace/supplier` 自动重定向至正式 Dashboard |
| `database/_741_role_shots/supplier_dashboard_*.png` | 正式供应商工作台 |
| `database/_741_role_shots/buyer_dashboard_*.png` | 正式采购方工作台 |
| `database/_742_header_verify/buyer_public_header_1440.png` | Buyer 桌面端 Header「工作台」入口 |
| `database/_742_header_verify/buyer_public_header_375.png` | Buyer 移动端 Header「工作台」入口 |
| `database/_742_header_verify/supplier_public_header_1440.png` | Supplier 桌面端 Header「工作台」入口 |
| `database/_742_header_verify/supplier_public_header_375.png` | Supplier 移动端 Header「工作台」入口 |

---

## 九、结论

1. **M33 Final Bounded Platform Perception Repair = COMPLETED**。`/products`、`/categories` 的 Industrial Inspection Capability Discovery 语义已统一；Supplier 旧入口感知断层已消除；已登录用户公共页面平台入口已建立。
2. **本次修复未触碰冻结域**：无 Backend / API / Database / Schema / Migration / Architecture / Matching / Search / AI 变更。
3. **运行时验证通过**：Web 生产构建 exit 0；`_742_header_verify` 4/4 平台入口可见；`_741_role_gate` 423 条度量全量复证，无新引入的功能阻塞或可见错误。
4. **残余风险可控**：Supplier RFQ 数据错位、Admin 指标异常、Header 信息架构重构已登记为 Future Candidate / Deferred，不扩大本次修复范围。

**Gate 判定**：本次有界修复满足 740 Decision B 的 Repair Contract，可关闭 742，不推荐自动进入新的修复轮次。

---

## 十、验证清单

- [x] `apps/web` 生产构建 exit 0
- [x] `/products` 标题、搜索占位符、数据锚点、卡片 CTA 改为能力注册表语义
- [x] `/categories` 标题、副标题、分类卡片、子类标签改为能力分类索引语义
- [x] `/workspace/supplier` 自动重定向至 `/dashboard/supplier`
- [x] `PublicHeader` 已登录态桌面/移动端均显示「工作台」入口
- [x] `_742_header_verify.mjs` Buyer/Supplier 桌面+移动端通过
- [x] `_741_role_gate.mjs` 375/768/1024/1440 四视口重新捕获并度量
- [x] 项目文档（PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md）已同步

---

*报告结束。下一步：由产品负责人确认是否将 FC-742-01 ~ FC-742-04 纳入冻结期后的迭代规划。*
