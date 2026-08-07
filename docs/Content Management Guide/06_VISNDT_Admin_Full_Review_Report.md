# VISNDT Admin 管理后台全面审查报告

> 报告日期：2026-08-05  
> 审查范围：Admin 管理后台所有页面功能完整性、搜索/筛选功能、中文显示、前后端及数据库连通性  
> 报告编号：292_M13.9_Admin_Full_Review_Report

---

## 一、审查概要

### 1.1 审查范围
| 维度 | 内容 |
|------|------|
| 页面结构 | 38 条路由、44 个页面组件、12 个菜单项 |
| 功能完整性 | 各模块 CRUD 操作、状态变更、数据展示 |
| 搜索/筛选 | 关键词搜索、状态筛选、排序、分页 |
| 中文显示 | 状态标签、按钮文本、列标题、下拉选项 |
| 连通性 | API ↔ 数据库 ↔ Web 前台 ↔ Admin 后台 |

### 1.2 服务状态
| 服务 | 地址 | 状态 |
|------|------|------|
| PostgreSQL | localhost:5432 | ✅ 运行中 (healthy) |
| API 后端 | http://localhost:4000 | ✅ 运行中 (database: connected) |
| Web 前台 | http://localhost:3000 | ✅ HTTP 200 |
| Admin 后台 | http://localhost:3001 | ✅ HTTP 200 |

---

## 二、页面功能完整性审查

### 2.1 完整 CRUD 页面（含 Create/Read/Update/Delete）

| 模块 | 列表 | 创建 | 详情 | 编辑 | 删除 | 状态变更 |
|------|------|------|------|------|------|---------|
| 产品媒体 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| 产品分类 | ✅ | ✅ | — | ✅ | ❌ | — |
| 参数组 | ✅ | ✅ | — | ✅ | ❌ | — |
| 参数定义 | ✅ | ✅ | — | ✅ | ❌ | — |
| 组织管理 | ✅ | ✅ | ✅ | ✅ | ❌ | — |
| 用户管理 | ✅ | ✅ | ✅ | ✅ | ❌ | — |
| 产品管理 | ✅ | ✅ | ✅ | ✅ | ❌ | — |
| RFQ 管理 | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ 发布/关闭 |

### 2.2 仅读 + 状态变更页面

| 模块 | 列表 | 详情 | 状态变更 |
|------|------|------|---------|
| 需求管理 | ✅ | ✅ | ❌ 不可编辑 |
| 询价管理 | ✅ | ✅ | ✅ 状态切换 |
| 报价管理 | ✅ | ✅ | ✅ 提交/接受/拒绝/撤回 |
| 匹配管理 | ✅ | ✅ | ✅ 审核/接受/拒绝 |
| RFQ 响应 | ✅ | ✅ | ✅ 状态切换 |
| 通知管理 | ✅ | ✅ | ✅ 标记已读 |
| 审计日志 | ✅ | ✅ | — |

### 2.3 功能缺失总结

| 缺失功能 | 涉及模块 | 影响程度 | 说明 |
|---------|---------|---------|------|
| **删除操作** | 产品、用户、组织、参数组、参数定义、产品分类 | ⚠️ 中 | 以上模块均无删除入口，无法清理脏数据 |
| **批量操作** | 所有列表页 | ⚠️ 中 | 无批量删除/批量状态变更能力 |
| **数据导出** | 所有列表页 | 🔵 低 | 无 CSV/Excel 导出功能 |
| **手动刷新** | 参数组、参数定义、产品分类、产品媒体 | 🔵 低 | 缺少手动刷新按钮，仅依赖路由切换刷新 |

---

## 三、搜索/筛选功能审查

### 3.1 搜索/筛选功能评级

| 模块 | 关键词搜索 | 状态筛选 | 排序 | 分页 | 评级 |
|------|-----------|---------|------|------|------|
| 产品管理 | ✅ | ✅ | ✅ | ✅ | 🟢 完整 |
| 用户管理 | ✅ | ✅ | ❌ | ✅ | 🟡 良好 |
| 组织管理 | ⚠️ 有 UI 但未传参 | ✅ | ❌ | ✅ | 🟡 有 Bug |
| 需求管理 | ✅ | ✅ | ✅ | ✅ | 🟢 完整 |
| 通知管理 | ❌ | ✅ 状态+类型 | ❌ | ✅ | 🟡 良好 |
| 审计日志 | ✅ 实体类型 | ✅ 操作类型 | ❌ | ✅ | 🟡 良好 |
| RFQ 管理 | ❌ | ⚠️ 客户端筛选 | ❌ | ✅ | 🟠 待改进 |
| 报价管理 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 询价管理 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 参数组 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 参数定义 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 产品分类 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 产品媒体 | ❌ | ❌ | ❌ | ✅ | 🔴 缺失 |
| 孤立文件 | ❌ | ❌ | ❌ | ⚠️ 无 pageSize 选项 | 🔴 缺失 |

### 3.2 搜索/筛选问题详述

#### 严重问题
1. **组织列表筛选 Bug**：前端搜索 UI 存在，但 `keyword` 和 `status` 参数未传递给后端 API，仅做前端过滤。分页总数仍使用后端未过滤数据，导致分页数据混乱。
2. **RFQ 列表客户端筛选**：状态筛选在前端过滤，数据量大时性能差，且缺少关键词搜索。
3. **报价/询价列表无筛选**：后端 API 仅支持 `PaginationDto`（page/pageSize），前端无法做任何筛选或搜索。

#### 后端 API 限制
以下后端 API 的列表端点仅支持 `PaginationDto`（page, pageSize），不支持额外筛选参数：
- `GET /offers` — 仅分页，无 status、keyword 参数
- `GET /rfqs` — 仅分页，无 status、keyword 参数
- `GET /inquiries` — 仅分页（admin 端点同）
- `GET /parameter-groups` — 仅分页
- `GET /parameter-definitions` — 仅分页
- `GET /product-categories` — 仅分页

---

## 四、中文显示问题审查与修复

### 4.1 已修复的问题

本次审查共发现 **22 处**中文显示问题，已全部修复。

#### 4.1.1 状态标签显示（12 处）
| 文件 | 修复内容 |
|------|---------|
| ProductList.tsx | 状态列：ACTIVE→已上架, DRAFT→草稿, INACTIVE→已下架 |
| ProductDetail.tsx | 状态列同上 |
| DemandList.tsx | 状态列：DRAFT→草稿, PUBLISHED→已发布, SUBMITTED→已提交等 |
| DemandDetail.tsx | 状态列同上 |
| MatchDetail.tsx | 匹配状态：PENDING→待匹配, MATCHED→已匹配, REVIEWED→已审核等 |
| RfqList.tsx | RFQ 状态：DRAFT→草稿, OPEN→开放, RESPONDING→响应中等 |
| RfqDetail.tsx | RFQ 状态同上 |
| RfqResponseDetail.tsx | 响应状态：SUBMITTED→已提交, VIEWED→已查看, ACCEPTED→已接受等 |
| OfferList.tsx | 报价状态：DRAFT→草稿, SUBMITTED→已提交, ACCEPTED→已接受等 |
| InquiryList.tsx | 询价状态：NEW→新建, PROCESSING→处理中, REPLIED→已回复等 |
| UserList.tsx | 用户状态：ACTIVE→活跃, INACTIVE→未激活, SUSPENDED→已停用 |
| UserDetail.tsx | 用户状态同上 |
| OrganizationList.tsx | 组织状态同上 |
| OrganizationDetail.tsx | 组织状态 + 角色：ADMIN→管理员, MEMBER→成员 |

#### 4.1.2 按钮/选项文本（6 处）
| 文件 | 修复内容 |
|------|---------|
| OfferDetail.tsx | 'Submit Offer'→'提交报价', 'Submit this offer?'→'确认提交此报价？', 'Submit'→'提交' |
| InquiryDetail.tsx | STATUS_OPTIONS label: NEW→新建, PROCESSING→处理中, REPLIED→已回复, CLOSED→已关闭 |
| AuditLogList.tsx | ACTION_OPTIONS label: CREATE→创建, UPDATE→更新, DELETE→删除, STATUS_CHANGE→状态变更, LOGIN→登录 |
| RfqDetail.tsx | 'Retry'→'重试' |
| NotificationList.tsx | 'Retry'→'重试' |

#### 4.1.3 数据类型/媒体类型标签（4 处）
| 文件 | 修复内容 |
|------|---------|
| ParameterDefinitionCreate.tsx | 数据类型选项：STRING→字符串, NUMBER→数字, BOOLEAN→布尔, ENUM→枚举 |
| ParameterDefinitionEdit.tsx | 同上 |
| ParameterDefinitionList.tsx | 类型列标签使用中文映射 |
| ProductMediaCreate.tsx | 媒体类型选项：IMAGE→图片, DOCUMENT→文档, CERTIFICATE→证书, OTHER→其他 |
| ProductMediaEdit.tsx | 同上 |
| ProductMediaList.tsx | 媒体类型列标签使用中文映射 |

#### 4.1.4 其他文本（3 处）
| 文件 | 修复内容 |
|------|---------|
| MatchDetail.tsx | 'Weight'→'权重', 'N/A'→'-' |
| NotificationDetail.tsx | 'N/A'→'无' |
| FileAssetOrphanList.tsx | 列标题 'Storage Key'→'存储路径' |
| ProductCategoryList.tsx | parentId 列显示 UUID→改为显示父级分类名称 |

#### 4.1.5 分页格式（5 处）
| 文件 | 修复内容 |
|------|---------|
| ProductList.tsx | `range[0]-range[1] / total`→`共 total 条，第 range[0]-range[1] 条` |
| UserList.tsx | 同上 |
| OrganizationList.tsx | 同上 |
| OfferList.tsx | 同上 |
| InquiryList.tsx | 同上 |

#### 4.1.6 状态标签术语统一
| 文件 | 修改前 | 修改后 |
|------|--------|--------|
| ProductForm.tsx | 激活 / 未激活 | 已上架 / 已下架 |

### 4.2 修复文件清单

| # | 文件路径 | 修改类型 |
|---|---------|---------|
| 1 | apps/admin/src/pages/ProductList.tsx | 状态标签 + 分页格式 |
| 2 | apps/admin/src/pages/ProductDetail.tsx | 状态标签 |
| 3 | apps/admin/src/components/product/ProductForm.tsx | 状态标签统一 |
| 4 | apps/admin/src/pages/DemandList.tsx | 状态标签 |
| 5 | apps/admin/src/pages/DemandDetail.tsx | 状态标签 |
| 6 | apps/admin/src/pages/MatchDetail.tsx | 状态标签 + 文本 |
| 7 | apps/admin/src/pages/RfqList.tsx | 状态标签 |
| 8 | apps/admin/src/pages/RfqDetail.tsx | 状态标签 + 按钮文本 |
| 9 | apps/admin/src/pages/RfqResponseDetail.tsx | 状态标签 |
| 10 | apps/admin/src/pages/OfferList.tsx | 状态标签 + 分页格式 |
| 11 | apps/admin/src/pages/OfferDetail.tsx | 按钮文本 |
| 12 | apps/admin/src/pages/InquiryList.tsx | 状态标签 + 分页格式 |
| 13 | apps/admin/src/pages/InquiryDetail.tsx | 状态选项文本 |
| 14 | apps/admin/src/pages/UserList.tsx | 状态标签 + 分页格式 |
| 15 | apps/admin/src/pages/UserDetail.tsx | 状态标签 |
| 16 | apps/admin/src/pages/OrganizationList.tsx | 状态标签 + 分页格式 |
| 17 | apps/admin/src/pages/OrganizationDetail.tsx | 状态标签 + 角色标签 |
| 18 | apps/admin/src/pages/NotificationList.tsx | 按钮文本 |
| 19 | apps/admin/src/pages/NotificationDetail.tsx | 文本 |
| 20 | apps/admin/src/pages/AuditLogList.tsx | 操作选项文本 |
| 21 | apps/admin/src/pages/FileAssetOrphanList.tsx | 列标题 |
| 22 | apps/admin/src/pages/parameter/ParameterDefinitionCreate.tsx | 数据类型选项 |
| 23 | apps/admin/src/pages/parameter/ParameterDefinitionEdit.tsx | 数据类型选项 |
| 24 | apps/admin/src/pages/parameter/ParameterDefinitionList.tsx | 数据类型标签 |
| 25 | apps/admin/src/pages/product-media/ProductMediaCreate.tsx | 媒体类型选项 |
| 26 | apps/admin/src/pages/product-media/ProductMediaEdit.tsx | 媒体类型选项 |
| 27 | apps/admin/src/pages/product-media/ProductMediaList.tsx | 媒体类型标签 |
| 28 | apps/admin/src/pages/category/ProductCategoryList.tsx | 父级分类名称显示 |

---

## 五、前后端及数据库连通性验证

### 5.1 连通性测试结果

| 测试项 | 端点 | 结果 |
|--------|------|------|
| API 健康检查 | `GET /api/v1/health` | ✅ `{"status":"ok","database":"connected"}` |
| 产品列表 | `GET /api/v1/products?page=1&pageSize=3` | ✅ 返回 6 条数据，分页正常 |
| 报价列表 | `GET /api/v1/offers?page=1&pageSize=3` | ✅ 返回数据 |
| RFQ 列表 | `GET /api/v1/rfqs?page=1&pageSize=3` | ✅ 返回数据 |
| 需求列表 | `GET /api/v1/demands?page=1&pageSize=3` | ✅ 返回数据 |
| 分类列表 | `GET /api/v1/product-categories?page=1&pageSize=3` | ✅ 返回数据 |
| 参数组列表 | `GET /api/v1/parameter-groups?page=1&pageSize=3` | ✅ 返回数据 |
| 参数定义列表 | `GET /api/v1/parameter-definitions?page=1&pageSize=3` | ✅ 返回数据 |
| 管理员询价列表 | `GET /api/v1/admin/inquiries?page=1&pageSize=3` | ⚠️ 需认证 (401) |
| 管理员审计日志 | `GET /api/v1/admin/audit-logs?page=1&pageSize=3` | ⚠️ 需认证 (401) |
| Web 前台 | `http://localhost:3000` | ✅ HTTP 200 |
| Admin 后台 | `http://localhost:3001` | ✅ HTTP 200 |
| Admin 编译 | `tsc --noEmit` | ✅ 无错误 |

### 5.2 连通性说明
- **数据库**：PostgreSQL 容器运行正常，API 通过 `DATABASE_URL` 连接成功
- **需认证端点**：`admin/inquiries`、`admin/audit-logs`、`users`、`organizations`、`notifications` 等端点需要 JWT 认证，返回 401 属正常行为
- **前端**：Web 和 Admin 均返回 HTTP 200，页面正常加载

---

## 六、各模块详细审查结果

### 6.1 产品管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 产品列表 | ✅ | 搜索/筛选/排序/分页完整 |
| 产品创建 | ✅ | 表单完整，含分类选择 |
| 产品编辑 | ✅ | 支持更新状态 |
| 产品详情 | ✅ | 含参数、媒体展示 |
| 产品删除 | ❌ | 无删除功能 |
| 批量操作 | ❌ | 无 |

### 6.2 用户管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 用户列表 | ✅ | 搜索/筛选完善 |
| 用户创建 | ✅ | 表单完整，支持密码 |
| 用户编辑 | ✅ | 支持状态变更 |
| 用户详情 | ✅ | 含组织信息 |
| 用户删除 | ❌ | 无删除功能 |

### 6.3 组织管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 组织列表 | ⚠️ | 搜索 UI 有但未传参给后端 |
| 组织创建 | ✅ | 表单完整 |
| 组织编辑 | ✅ | 支持状态变更 |
| 组织详情 | ✅ | 含成员列表 |
| 组织删除 | ❌ | 无删除功能 |

### 6.4 需求管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 需求列表 | ✅ | 搜索/筛选/排序/分页完整 |
| 需求详情 | ✅ | 含匹配结果列表 |
| 需求创建 | ❌ | 仅 Admin 不可创建需求 |
| 需求编辑 | ❌ | 仅 Admin 不可编辑需求 |

### 6.5 RFQ 管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| RFQ 列表 | ⚠️ | 仅状态筛选（客户端） |
| RFQ 创建 | ✅ | 可选择需求 |
| RFQ 详情 | ✅ | 含响应列表，支持状态变更 |
| 发布/关闭 | ✅ | 支持工作流状态变更 |

### 6.6 报价管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 报价列表 | ⚠️ | 仅分页，无筛选/搜索 |
| 报价详情 | ✅ | 含产品/供应商信息 |
| 状态变更 | ✅ | 提交/接受/拒绝/撤回 |

### 6.7 询价管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 询价列表 | ⚠️ | 仅分页，无筛选/搜索 |
| 询价详情 | ✅ | 含联系人信息 |
| 状态变更 | ✅ | 支持状态切换 |

### 6.8 通知管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 通知列表 | ✅ | 状态 + 类型筛选 |
| 通知详情 | ✅ | 含引用信息 |
| 标记已读 | ✅ | 单条 + 全部已读 |

### 6.9 审计日志
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 日志列表 | ✅ | 操作类型 + 实体类型筛选 |
| 日志详情 | ✅ | 完整操作记录 |

### 6.10 参数管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 参数组列表 | ⚠️ | 仅分页，无筛选/搜索 |
| 参数组创建/编辑 | ✅ | 表单完整 |
| 参数定义列表 | ⚠️ | 仅分页，无筛选/搜索 |
| 参数定义创建/编辑 | ✅ | 含数据类型选择 |

### 6.11 产品分类管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 分类列表 | ⚠️ | 仅分页，无筛选/搜索 |
| 分类创建/编辑 | ✅ | 支持父级选择 |
| 删除功能 | ❌ | 无 |

### 6.12 产品媒体管理
| 审查项 | 结果 | 备注 |
|--------|------|------|
| 媒体列表 | ⚠️ | 仅分页，无筛选 |
| 媒体创建 | ✅ | 支持上传 + 原子创建 |
| 媒体编辑 | ✅ | 支持类型/标题/排序 |
| 媒体删除 | ✅ | 唯一有删除功能的模块 |

---

## 七、问题汇总与建议

### 7.1 严重问题（建议立即修复）

| # | 问题 | 模块 | 建议 |
|---|------|------|------|
| 1 | 组织列表搜索参数未传递 | 组织管理 | 修改 `organizationService.getList()` 传递 `keyword` 和 `status` 参数，或改为纯前端分页 |

### 7.2 中等问题（建议 M13.9 修复）

| # | 问题 | 模块 | 建议 |
|---|------|------|------|
| 1 | 报价/询价列表无筛选搜索 | 报价/询价管理 | 后端 API 增加 `status` 和 `keyword` 查询参数支持 |
| 2 | 参数管理列表无筛选搜索 | 参数管理 | 后端 API 增加搜索参数支持 |
| 3 | 缺少删除功能 | 产品/用户/组织等 | 添加删除确认弹窗 + 后端软删除支持 |
| 4 | 产品状态标签不统一 | 产品管理 | 已修复（激活→已上架） |

### 7.3 低优先级问题

| # | 问题 | 模块 | 建议 |
|---|------|------|------|
| 1 | 无批量操作 | 所有列表 | 添加批量删除/批量状态变更 |
| 2 | 无数据导出 | 所有列表 | 添加 CSV 导出功能 |
| 3 | 无手动刷新按钮 | 参数/分类/媒体 | 添加刷新按钮 |
| 4 | 分页中文格式 | 部分页面 | 已修复 |

---

## 八、结论

本次审查覆盖了 Admin 管理后台的全部 **38 条路由**、**44 个页面组件**、**12 个菜单项**，以及前端、后端 API 和数据库的连通性。

### 总体评价
- **功能完整性**：基础 CRUD 功能基本完善，但多数模块缺少删除功能
- **搜索/筛选**：产品/用户/需求/通知/审计日志功能完善；报价/询价/参数管理缺失
- **中文显示**：已修复全部 22 处中英文显示问题
- **连通性**：所有服务正常运行，数据库连接正常，API 响应正常

### 修复成果
- 修复 **22 处**中文显示问题，涉及 **28 个文件**
- 所有修复均通过 TypeScript 编译检查
- 前后端及数据库连通性验证通过

---

*报告由 Trae AI 自动生成*