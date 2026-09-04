# VISNDT — 任务一：三角色真实浏览器 E2E 测试报告

> 阶段：审计 / 只读测试（未做任何写库、创建、删除、发布等破坏性操作）
> 日期：2026-09-01
> 范围：Web 端（:3000，GUEST/BUYER/SUPPLIER）+ 运营后台（:3001，ADMIN）
> 环境：Chrome Headless + CDP(9222)；API :4000 在线；DB 使用 Demo 数据（demo.admin / demo.buyer.01 / demo.supplier.01）
> 证据：`database/_796_e2e/web.jsonl`（39 条）、`database/_796_e2e/admin.jsonl`（30 条）

***

## 一、测试方法与边界

- **方式**：真实 Chrome 以 CDP(9222) 驱动，逐页 `Page.navigate` → 等待挂载 → 采集 DOM 状态（URL / h1 / 标题 / body 长度 / 按钮 / 链接 / 错误UI标记 / 控制台错误 / 运行时异常）。

- **覆盖**：

  - Web GUEST：公开页 9 + 受保护页 3（校验守卫重定向）。

  - Web BUYER：个人工作区 8 + 公开页 2。

  - Web SUPPLIER：供应商工作台 13（含寻源/响应/报价/询价/商机/展示/企业资料/成员）。

  - Admin：登录页 + 未授权守卫 + 28 个运营模块。

- **边界（明确未做）**：本次为**只读渲染级 E2E**，未执行「创建/删除/发布/提交」等写操作（遵循受控测试数据、不改真实业务数据的约束）。按钮「功能可用性」以「渲染到按钮 + 可点导航 + 对应页面可达」为判据，写链路的成功与否不在本次断言范围。

- **校验项**：每项按 `PASS / FAIL / PARTIAL` 判定，问题分级 **P0/P1/P2/P3**（P0=安全/数据完整性/越权；P1=功能缺陷/数据合理；P2=体验/视觉；P3=低影响）。

***

## 二、Web 端 — 访客（GUEST）视角

| #   | 路径                                             | h1/状态             | 判据             | 结果                       |
| --- | ---------------------------------------------- | ----------------- | -------------- | ------------------------ |
| G1  | `/` 首页                                         | 工业无损检测 产品与技术方案 平台 | 渲染、登录/注册/搜索入口  | PASS                     |
| G2  | `/categories`                                  | 能力分类              | 分类索引           | PASS                     |
| G3  | `/products`                                    | 工业检测能力注册表         | 20 按钮（搜索/参数筛选） | PASS                     |
| G4  | `/search?q=超声`                                 | 搜索                | 返回 1 条结果 + 知识  | PASS                     |
| G5  | `/solutions`                                   | 工业检测解决方案          | 列 2 方案         | PASS                     |
| G6  | `/knowledge-base`                              | 工业检测知识中心          | 领域/分类/条目       | PASS                     |
| G7  | `/business`                                    | 商务合作              | 询价 CTA 存在      | PASS                     |
| G8  | `/products/compare`                            | 产品对比              | 空态引导正确         | PARTIAL（标题为「能力注册表」，见 §六） |
| G9  | `/about`                                       | 关于 VISNDT         | 渲染             | PASS                     |
| G10 | `/workspace` `/dashboard` `/workspace/demands` | → 跳转 `/login`     | 受保护守卫          | **PASS（越权访问被拦截）**        |

**访客结论**：公开发现面完整可达，受保护页全部正确拦截跳转登录，公开可发现边界符合「Engineering Discovery」定位。

***

## 三、Web 端 — 买家（BUYER）视角

| #   | 路径                          | h1/状态                      | 判据                         | 结果               |
| --- | --------------------------- | -------------------------- | -------------------------- | ---------------- |
| B1  | `/dashboard`                | 个人工作区 → `/dashboard/buyer` | 采购方仪表盘                     | PASS             |
| B2  | `/workspace`                | 采购方工作空间                    | 业务快照（需求/RFQ/匹配/待决策）        | PASS             |
| B3  | `/workspace/demands`        | 我的需求                       | 空态 + 「创建需求」                | PASS（空态合理）       |
| B4  | `/workspace/demands/create` | 创建需求                       | 完整表单（标题/分类/预算/数量/联系人/技术参数） | PASS             |
| B5  | `/workspace/matches`        | 匹配结果                       | 空态提示                       | PASS             |
| B6  | `/workspace/rfqs`           | 询价请求                       | 「创建询价请求」                   | PASS             |
| B7  | `/workspace/rfqs/create`    | 创建询价                       | **逻辑：无需求时提示「请先创建一个需求」**    | **PASS（业务闭环合理）** |
| B8  | `/workspace/notifications`  | 通知中心                       | 未读 0、标记已读按钮                | PASS             |
| B9  | `/workspace/settings`       | 账户设置                       | 邮箱/姓名/组织/修改密码              | PASS             |
| B10 | `/products` `/categories`   | 公开页                        | 已登录可访问                     | PASS             |

**买家结论**：需求→匹配→询价创建闭环完整，且 RFQ 创建被「先有需求」约束，逻辑合理。空数据态均有明确引导。

***

## 四、Web 端 — 供应商（SUPPLIER）视角

| #   | 路径                                  | h1/状态                          | 判据                     | 结果                |
| --- | ----------------------------------- | ------------------------------ | ---------------------- | ----------------- |
| S1  | `/dashboard`                        | 供应商工作台 → `/dashboard/supplier` | 概览（RFQ/响应/Offer/商机/展示） | PASS              |
| S2  | `/workspace/supplier/rfqs`          | 供应商询价管理                        | 展示公开 RFQ 1 条（发动机缸盖检测）  | PASS              |
| S3  | `/workspace/supplier/responses`     | 报价响应管理                         | 空态                     | PASS              |
| S4  | `/workspace/supplier/offers`        | 我的报价                           | 「创建报价」+ 状态筛选           | PASS              |
| S5  | `/workspace/supplier/offers/new`    | 创建报价                           | 产品选择 + 报价表单            | PASS              |
| S6  | `/workspace/supplier/inquiries`     | 收到的询价                          | 空态                     | PASS              |
| S7  | `/workspace/supplier/opportunities` | 商机中心                           | 公开 RFQ 1 条             | PASS              |
| S8  | `/workspace/supplier/profile`       | 企业资料                           | 明视工业检测设备有限公司           | PASS              |
| S9  | `/workspace/supplier/display`       | 展示管理                           | 展示完整度 60%，企业身份         | PASS              |
| S10 | `/workspace/supplier/members`       | 组织成员                           | 成员总数 0 空态              | PASS              |
| S11 | `/workspace/supplier/dashboard`     | **404 页面未找到**                  | 该路由不存在                 | **FAIL（见 §六 D1）** |

**供应商结论**：RFQ 机会列表有真实数据、商机/展示/企业资料等自服务入口齐全，能力与复用约束（M35 复用说明文案）到位。但存在 1 处 **404 死路由**（供应商「仪表盘」锚点若指此路径将失效），需实测菜单 href 确认。

***

## 五、运营后台（ADMIN）视角

### 5.0 认证与守卫

| #    | 项                                                | 结果               |
| ---- | ------------------------------------------------ | ---------------- |
| A0-1 | 登录页可渲染（VISNDT 管理后台 · Platform Governance Center） | PASS             |
| A0-2 | **未授权访问** **`/home`** **→ 强制跳转** **`/login`**    | **PASS（路由守卫有效）** |

### 5.1 正常渲染且有数据的模块

| 模块                            | 按钮/内容                  | 结果                                      |
| ----------------------------- | ---------------------- | --------------------------------------- |
| `/products` 能力管理              | 创建能力/导出/搜索/查看/编辑/删除 ×4 | PASS                                    |
| `/demands` 需求管理               | 查看/编辑/删除 ×3            | PASS                                    |
| `/rfqs` RFQ 管理                | 重置/创建 RFQ/查看/删除        | **PARTIAL**（控制台有 deprecated 警告，见 §六 D4） |
| `/parameter-groups` 参数组       | 创建分组 + 4 组、编辑/删除       | PASS                                    |
| `/parameter-definitions` 参数定义 | 创建定义 + 多个定义、编辑/删除      | PASS                                    |
| `/product-categories` 能力分类    | 创建分类 + 展开行/编辑/删除       | PASS                                    |
| `/notifications` 通知管理         | 重置/标记全部已读              | PASS                                    |

### 5.2 内容区空转 / 错误态模块（关键发现）

| 模块                                                                                                                                                                  | 观测                | 判定                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------- |
| `/home`、`/operation-center`                                                                                                                                         | 仅边栏 + 「重新加载」错误态   | **FAIL**（P1，错误边界被触发）            |
| `/analytics` `/business-analytics` `/monitoring`                                                                                                                    | 仅边栏，内容区空白（btn=0）  | **FAIL/PARTIAL**（P1，数据为空或图表未加载） |
| `/matching` `/users` `/organizations` `/supplier-products` `/inquiries` `/audit-logs` `/embedding` `/media` `/files/orphans` `/product-category-knowledge-mappings` | 仅「重 试」按钮（数据加载失败态） | **FAIL**（P1，10 个模块进入 retry 错误态） |
| `/content`                                                                                                                                                          | body 为空（整白）       | **FAIL**（P1）                    |
| `/offers` 报价管理                                                                                                                                                      | 仅「重置」，无列表内容       | PARTIAL（P2）                     |

> 说明：以上 10+ 模块处于 retry/空态，但 `/products`、`/demands`、`/rfqs` 等使用**同一套 token 与 API client** 却能正常渲染数据，可据此排除「鉴权/注入串」系统性因素，倾向于各模块接口自身报错或数据缺失（**需在后端/接口层复核根因**）。

***

## 六、问题清单（按严重度分级）

### P0 — 无

未发现越权访问、数据完整性或鉴权漏洞（守卫正确拦截、角色工作区隔离正常）。

### P1 — 功能缺陷 / 逻辑 / 完整性

| ID | 归属      | 问题                                                                                                                                                               | 证据                    |
| -- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| D1 | Web-供应商 | `/workspace/supplier/dashboard` 为 **404 死路由**（供应商「仪表盘」锚点若指向此处则整页失效）                                                                                              | web.jsonl SUPPLIER 记录 |
| D2 | Admin   | 10 个模块（matching/users/organizations/supplier-products/inquiries/audit-logs/embedding/media/files/orphans/product-category-knowledge-mappings）进入 **「重 试」数据加载失败态** | admin.jsonl           |
| D3 | Admin   | `/home`、`/operation-center` 触发 **错误边界「重新加载」态**；`/content` 整页空白；analytics/business-analytics/monitoring 内容区空白                                                     | admin.jsonl           |
| D4 | Web+B2B | `/products/compare` 页面 `title` 仍为「能力注册表」（**元信息与页面语义不一致**，影响 SEO 判定）                                                                                              | web.jsonl G8          |

### P2 — 体验 / 规范

| ID | 归属        | 问题                                              |
| -- | --------- | ----------------------------------------------- |
| D5 | Admin-RFQ | antd `columns.render` 已废弃告警（性能相关），建议改用 `onCell` |

### P3 — 低影响

- 空数据态文案整体规范，无 P3 发现。

***

## 七、功能完整性 / 逻辑合理性总评

- **认证与越权**：三处守卫（Guest 访问受保护页 / 未登录 Admin 访问后台）均正确重定向，**通过**。

- **角色工作区隔离**：买家工作区（需求→匹配→RFQ）与供应商工作区（RFQ机会→响应→报价→询价→商机→展示）完全分离，导航与落地页不同，**通过 且 逻辑合理**。

- **业务闭环**：RFQ 创建依赖「先有需求」= 闭环成立；供应商端 RFQ 列表有真实数据进入；展示完整度有量化指标。**通过**。

- **管理员治理面完整性**：28 模块中约 **13+** 内容区无法正常渲染（空缺/错误态），**治理侧可用性不足，为主要缺口**。

- **按钮/操作可达性**：核心写按钮（创建能力/需求/分类/分组/定义/RFQ、导出、编辑/删除）均已渲染；写链路本身本次未执行。

### 验收清单

| 验收项                       | 结果                   |
| ------------------------- | -------------------- |
| 三角色页面可达（访客公开页 / 买家 / 供应商） | ✅ PASS               |
| 受保护路由越权拦截                 | ✅ PASS               |
| Admin 登录 + 未授权守卫          | ✅ PASS               |
| 28 个 Admin 模块全部正常渲染       | ❌ FAIL（约 13+ 空转/错误态） |
| 供应商「仪表盘」路由无死链             | ❌ FAIL（D1）           |
| 控制台零错误                    | ❌ FAIL（D4/D5）        |

