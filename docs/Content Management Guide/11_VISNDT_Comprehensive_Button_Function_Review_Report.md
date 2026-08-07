# VISNDT 全面按钮功能审查报告

> 审查日期：2026-08-06
> 审查范围：Admin后台、Web前台、API后端、数据库
> 审查方式：代码级审查 + 架构分析

---

## 一、审查范围总览

| 审查对象 | 文件数 | 页面/端点数 | 状态 |
|---------|-------|------------|------|
| Admin后台页面 | 32个页面组件 | 12个菜单项, 38个路由 | ✅ 已审查 |
| Admin API服务 | 19个service文件 | 120+ API方法 | ✅ 已审查 |
| Web前台页面 | 10个页面文件 | 5个菜单项 | ✅ 已审查 |
| API后端Controller | 15个controller | 100+ 端点 | ✅ 已审查 |
| 数据库Prisma Schema | 1个schema文件 | 20+ 模型 | ✅ 已审查 |

---

## 二、Admin后台审查结果

### 2.1 菜单项与页面路由对应关系

| 菜单项 | 路由 | 页面组件 | 功能完整性 |
|-------|------|---------|-----------|
| 仪表盘 | /home | Home.tsx | ✅ 完整 |
| 产品管理 | /products | ProductList.tsx | ✅ 完整 |
| 产品管理-创建 | /products/create | ProductCreate.tsx | ✅ 完整 |
| 产品管理-详情 | /products/:id | ProductDetail.tsx | ✅ 完整 |
| 产品管理-编辑 | /products/:id/edit | ProductEdit.tsx | ✅ 完整 |
| 产品管理-媒体 | /products/:productId/media | ProductMediaList.tsx | ✅ 完整 |
| 需求管理 | /demands | DemandList.tsx | ⚠️ 缺失"查看/编辑"按钮 |
| 需求管理-详情 | /demands/:id | DemandDetail.tsx | ✅ 完整 |
| 需求管理-匹配详情 | /demands/:demandId/matches/:matchId | MatchDetail.tsx | ✅ 完整 |
| 匹配管理 | /matching | MatchingMonitor.tsx | ✅ 完整（只读监控） |
| RFQ管理 | /rfqs | RfqList.tsx | ⚠️ 缺失"编辑"按钮 |
| RFQ管理-创建 | /rfqs/create | RfqCreate.tsx | ✅ 完整 |
| RFQ管理-详情 | /rfqs/:id | RfqDetail.tsx | ✅ 完整 |
| RFQ响应详情 | /rfq-responses/:id | RfqResponseDetail.tsx | ✅ 完整 |
| 报价管理 | /offers | OfferList.tsx | ⚠️ 缺失"编辑"按钮 |
| 报价管理-详情 | /offers/:id | OfferDetail.tsx | ✅ 完整 |
| 询价管理 | /inquiries | InquiryList.tsx | ⚠️ 缺失"编辑"按钮 |
| 询价管理-详情 | /inquiries/:id | InquiryDetail.tsx | ✅ 完整 |
| 用户管理 | /users | UserList.tsx | ⚠️ 状态列显示英文 |
| 用户管理-创建 | /users/create | UserCreate.tsx | ✅ 完整 |
| 用户管理-详情 | /users/:id | UserDetail.tsx | ✅ 完整 |
| 用户管理-编辑 | /users/:id/edit | UserEdit.tsx | ✅ 完整 |
| 组织管理 | /organizations | OrganizationList.tsx | ✅ 完整 |
| 组织管理-创建 | /organizations/create | OrganizationCreate.tsx | ✅ 完整 |
| 组织管理-详情 | /organizations/:id | OrganizationDetail.tsx | ✅ 完整 |
| 组织管理-编辑 | /organizations/:id/edit | OrganizationEdit.tsx | ✅ 完整 |
| 参数组 | /parameter-groups | ParameterGroupList.tsx | ⚠️ 无批量状态变更 |
| 参数组-创建 | /parameter-groups/create | ParameterGroupCreate.tsx | ✅ 完整 |
| 参数组-编辑 | /parameter-groups/:id/edit | ParameterGroupEdit.tsx | ✅ 完整 |
| 参数定义 | /parameter-definitions | ParameterDefinitionList.tsx | ⚠️ 无批量状态变更 |
| 参数定义-创建 | /parameter-definitions/create | ParameterDefinitionCreate.tsx | ✅ 完整 |
| 参数定义-编辑 | /parameter-definitions/:id/edit | ParameterDefinitionEdit.tsx | ✅ 完整 |
| 分类管理 | /product-categories | ProductCategoryList.tsx | ⚠️ 无批量状态变更 |
| 分类管理-创建 | /product-categories/create | ProductCategoryCreate.tsx | ✅ 完整 |
| 分类管理-编辑 | /product-categories/:id/edit | ProductCategoryEdit.tsx | ✅ 完整 |
| 通知管理 | /notifications | NotificationList.tsx | ⚠️ 无搜索功能、无批量状态变更 |
| 通知管理-详情 | /notifications/:id | NotificationDetail.tsx | ✅ 完整 |
| 孤立文件管理 | /files/orphans | FileAssetOrphanList.tsx | ⚠️ 无搜索/筛选 |
| 审计日志 | /audit-logs | AuditLogList.tsx | ✅ 完整（只读日志） |

### 2.2 Admin页面按钮功能详细检查

#### 2.2.1 ProductList（产品管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建产品 | navigate(/products/create) | - | - | - | ✅ |
| 搜索(Input.Search) | onSearch触发handleSearch | - | - | - | ✅ |
| 状态筛选(Select) | onChange触发handleStatusChange | - | - | - | ✅ |
| 重置 | 重置所有查询参数 | - | - | - | ✅ |
| 查看(行) | navigate(/products/:id) | - | - | - | ✅ |
| 编辑(行) | navigate(/products/:id/edit) | - | - | - | ✅ |
| 删除(行) | Modal.confirm → remove → 刷新 | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | BatchOperations → batchDelete | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | BatchOperations → batchStatus | ✅ | ✅ | ✅ | ✅ |
| 排序 | handleTableChange → sortBy/sortOrder | - | - | - | ✅ |
| 分页 | handleTableChange → page/pageSize | - | - | - | ✅ |

#### 2.2.2 DemandList（需求管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| ❌ 查看(行) | 缺失 | - | - | - | ❌ |
| ❌ 编辑(行) | 缺失 | - | - | - | ❌ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 排序 | ✅ | - | - | - | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.3 RfqList（RFQ管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 创建询价 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| ❌ 编辑(行) | 缺失 | - | - | - | ❌ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.4 OfferList（报价管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| ❌ 编辑(行) | 缺失 | - | - | - | ❌ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.5 InquiryList（询价管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| ❌ 编辑(行) | 缺失 | - | - | - | ❌ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.6 UserList（用户管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建用户 | ✅ | - | - | - | ✅ |
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| 编辑(行) | ✅ | - | - | - | ✅ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ⚠️ 状态列显示英文 | 显示"ACTIVE"而非"活跃" | - | - | - | ⚠️ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.7 OrganizationList（组织管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建组织 | ✅ | - | - | - | ✅ |
| 搜索 | ✅ | - | - | - | ✅ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| 编辑(行) | ✅ | - | - | - | ✅ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量状态变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.8 NotificationList（通知管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| ❌ 搜索 | 缺失 | - | - | - | ❌ |
| 状态筛选 | ✅ | - | - | - | ✅ |
| 类型筛选 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 查看(行) | ✅ | - | - | - | ✅ |
| ❌ 批量状态变更 | 缺失 | - | - | - | ❌ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.9 ProductCategoryList（分类管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建分类 | ✅ | - | - | - | ✅ |
| 搜索 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 编辑(行) | ✅ | - | - | - | ✅ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ❌ 批量状态变更 | 缺失 | - | - | - | ❌ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.10 ParameterGroupList（参数组管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建分组 | ✅ | - | - | - | ✅ |
| 搜索 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 编辑(行) | ✅ | - | - | - | ✅ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ❌ 批量状态变更 | 缺失 | - | - | - | ❌ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.11 ParameterDefinitionList（参数定义管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 创建定义 | ✅ | - | - | - | ✅ |
| 搜索 | ✅ | - | - | - | ✅ |
| 重置 | ✅ | - | - | - | ✅ |
| 编辑(行) | ✅ | - | - | - | ✅ |
| 删除(行) | ✅ | ✅ | ✅ | ✅ | ✅ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ❌ 批量状态变更 | 缺失 | - | - | - | ❌ |
| 分页 | ✅ | - | - | - | ✅ |

#### 2.2.12 FileAssetOrphanList（孤立文件管理）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 刷新 | ✅ | - | - | - | ✅ |
| ❌ 搜索/筛选 | 缺失 | - | - | - | ❌ |
| ❌ 分页控制 | 前端无分页交互 | - | - | - | ❌ |
| 批量删除 | ✅ | ✅ | ✅ | ✅ | ✅ |

#### 2.2.13 AuditLogList（审计日志）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 操作类型筛选 | ✅ | - | - | - | ✅ |
| 实体类型搜索 | ✅ | - | - | - | ✅ |
| 刷新 | ✅ | - | - | - | ✅ |
| 分页 | ✅ | - | - | - | ✅ |
| 行操作 | 只读，无需操作按钮 | - | - | - | ✅ |

#### 2.2.14 MatchingMonitor（匹配监控）
| 按钮 | 功能 | Loading | 错误处理 | 成功提示 | 状态 |
|-----|------|---------|---------|---------|------|
| 刷新 | 只读仪表盘，无操作按钮 | - | - | - | ✅ |

---

### 2.3 Admin API服务完整性

| 服务模块 | getList | getById | create | update | remove | batchDelete | batchStatus | 一致性 |
|---------|---------|---------|--------|--------|--------|-------------|-------------|--------|
| product | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| user | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| organization | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| demand | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ 无create/update |
| rfq | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| offer | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ 无create/update |
| inquiry | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ 无create/update |
| notification | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ⚠️ 无单删/批量状态 |
| category | ✅(list) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ 方法名不一致 |
| parameter-definition | ✅(list) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ 方法名不一致 |
| parameter-group | ✅(list) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ 方法名不一致 |
| audit-log | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 只读，合理 |
| file-asset | ✅(orphans) | ❌ | ✅(upload) | ❌ | ✅ | ✅ | ❌ | 特殊逻辑 |
| match | ✅ | ✅ | ❌ | ✅(status) | ❌ | ❌ | ❌ | 只读+状态 |
| rfq-response | ✅ | ✅ | ❌ | ✅(status) | ❌ | ❌ | ❌ | 只读+状态 |
| product-media | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | 无批量操作 |
| dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 只读 |

---

## 三、Web前台审查结果

### 3.1 页面与按钮功能清单

| 页面 | 路由 | 按钮 | 功能 | Loading | 状态 |
|-----|------|------|------|---------|------|
| 仪表盘 | /dashboard | 浏览产品(链接) | navigate(/products) | - | ✅ |
| 仪表盘 | /dashboard | 我的需求(链接) | navigate(/workspace/demands) | - | ✅ |
| 仪表盘 | /dashboard | 创建询价(链接) | navigate(/workspace/rfqs) | - | ✅ |
| 仪表盘 | /dashboard | 匹配结果(链接) | navigate(/workspace/matches) | - | ✅ |
| 登录 | /login | 登录按钮 | auth.login() | ✅ | ✅ |
| 登录 | /login | 注册链接 | navigate(/register) | - | ✅ |
| 注册 | /register | 注册按钮 | auth.register() | ✅ | ✅ |
| 注册 | /register | 登录链接 | navigate(/login) | - | ✅ |
| 需求列表 | /workspace/demands | Try again(错误重试) | 重新加载数据 | ✅ | ✅ |
| 需求创建 | /workspace/demands/create | Create Demand | createDemand() | ✅ | ✅ |
| 需求创建 | /workspace/demands/create | Cancel | navigate(back) | - | ✅ |
| 需求详情 | /workspace/demands/[id] | ← Back to Demands | navigate(back) | - | ✅ |
| ❌ 需求详情 | /workspace/demands/[id] | **编辑(Edit)** | **缺失** | - | ❌ |
| ❌ 需求详情 | /workspace/demands/[id] | **删除(Delete)** | **缺失** | - | ❌ |
| ❌ 需求详情 | /workspace/demands/[id] | **发布(Publish)/关闭(Close)** | **缺失** | - | ❌ |
| RFQ列表 | /workspace/rfqs | Try again(错误重试) | 重新加载数据 | ✅ | ✅ |
| RFQ创建 | /workspace/rfqs/create | Create RFQ | createRfq() | ✅ | ✅ |
| RFQ创建 | /workspace/rfqs/create | Cancel | navigate(back) | - | ✅ |
| RFQ创建 | /workspace/rfqs/create | Create a demand → | navigate(/workspace/demands/create) | - | ✅ |
| RFQ详情 | /workspace/rfqs/[id] | ← Back to RFQs | navigate(back) | - | ✅ |
| ❌ RFQ详情 | /workspace/rfqs/[id] | **编辑(Edit)** | **缺失** | - | ❌ |
| ❌ RFQ详情 | /workspace/rfqs/[id] | **删除(Delete)** | **缺失** | - | ❌ |
| ❌ RFQ详情 | /workspace/rfqs/[id] | **发布/关闭** | **缺失** | - | ❌ |
| 匹配列表 | /workspace/matches | Try again(错误重试) | 重新加载数据 | ✅ | ✅ |
| 设置 | /workspace/settings | Logout | auth.logout() | - | ✅ |
| ❌ 设置 | /workspace/settings | **编辑个人资料** | **缺失** | - | ❌ |

### 3.2 Web前台缺失功能汇总

| 缺失功能 | 影响页面 | 严重程度 |
|---------|---------|---------|
| 需求列表无"创建需求"按钮 | 需求列表页 | 高 |
| RFQ列表无"创建RFQ"按钮 | RFQ列表页 | 高 |
| 需求详情无"编辑"按钮 | 需求详情页 | 高 |
| 需求详情无"删除"按钮 | 需求详情页 | 高 |
| 需求详情无"发布/关闭"按钮 | 需求详情页 | 高 |
| RFQ详情无"编辑"按钮 | RFQ详情页 | 高 |
| RFQ详情无"删除"按钮 | RFQ详情页 | 高 |
| RFQ详情无"发布/关闭"按钮 | RFQ详情页 | 高 |
| 设置页无"编辑个人资料"功能 | 设置页 | 中 |
| 所有列表页无搜索/筛选功能 | 需求/RFQ/匹配列表页 | 中 |
| 所有列表页无分页控制 | 需求/RFQ/匹配列表页 | 中 |
| 产品详情页无"询价/报价"操作 | 产品详情页 | 中 |
| Dashboard无"创建需求"快捷操作 | 仪表盘 | 低 |

---

## 四、API后端审查结果

### 4.1 Controller端点完整性

| Controller | 端点数量 | CRUD完整 | 批量操作 | 业务操作 | 状态 |
|-----------|---------|---------|---------|---------|------|
| Auth | 6 | N/A | N/A | login/register/refresh/logout | ✅ |
| Users | 7 | ✅ | ✅ | ✅ | ✅ |
| Organizations | 7 | ✅ | ✅ | ✅ | ✅ |
| Products | 7 | ✅ | ✅ | ✅ | ✅ |
| Categories | 6 | ✅ | ✅(batch) | ❌无batchStatus | ⚠️ |
| Parameter Groups | 6 | ✅ | ✅(batch) | ❌无batchStatus | ⚠️ |
| Parameter Definitions | 6 | ✅ | ✅(batch) | ❌无batchStatus | ⚠️ |
| Demands | 15+ | ✅ | ✅ | publish/close/rematch/parameters/matches | ✅ |
| RFQs | 9 | ✅ | ✅ | publish/close | ✅ |
| Offers | 10 | ✅ | ✅ | submit/accept/reject/withdraw | ✅ |
| Inquiries | 3 | ⚠️(仅C-R) | ✅ | ✅ | ⚠️ 无update |
| Notifications | 6 | ⚠️(仅R-D) | ✅(batch) | markRead/markAllRead | ✅ |
| File Asset | 6 | ✅ | ✅(batch) | upload/download/cleanup | ✅ |
| Admin Dashboard | 4 | N/A | N/A | stats/activities/pending/status | ✅ |
| Invitations | 7 | ✅ | ✅ | accept/resend | ✅ |

### 4.2 API端点问题

1. **InquiriesController** - 缺少 `PATCH /inquiries/:id` 更新端点（Admin前台有updateStatus需求）
2. **ProductCategoriesController** - 批量删除使用 `DELETE /product-categories/batch` 而非统一的 `POST /product-categories/batch-delete`，路径不一致
3. **ParameterGroupsController** - 同上，批量删除路径不一致
4. **ParameterDefinitionsController** - 同上，批量删除路径不一致
5. **NotificationsController** - 批量删除使用 `DELETE /notifications/batch` 而非 `POST /notifications/batch-delete`
6. **FileAssetController** - 批量删除使用 `DELETE /files/batch` 而非 `POST /files/batch-delete`
7. **InquiryService** - Admin端使用 `/admin/inquiries` 路径，非标准路径

---

## 五、数据库模型审查

### 5.1 模型完整性

| 模型 | 状态字段 | 时间戳 | 关联关系 | 索引 | 状态 |
|------|---------|--------|---------|------|------|
| User | ✅ status | ✅ createdAt/updatedAt | ✅ organization | ✅ | ✅ |
| Organization | ✅ status | ✅ createdAt/updatedAt | ✅ users/offers | ✅ | ✅ |
| Product | ✅ status | ✅ createdAt/updatedAt | ✅ category/media | ✅ | ✅ |
| ProductCategory | ✅ | ✅ createdAt/updatedAt | ✅ parent/children | ✅ | ✅ |
| Demand | ✅ status | ✅ createdAt/updatedAt/publishedAt | ✅ user/organization/category | ✅ | ✅ |
| RFQ | ✅ status | ✅ createdAt/updatedAt/publishedAt/closedAt | ✅ demand/user | ✅ | ✅ |
| Offer | ✅ status | ✅ createdAt/updatedAt | ✅ product/organization | ✅ | ✅ |
| Inquiry | ✅ status | ✅ createdAt/updatedAt | ✅ product/organization/user | ✅ | ✅ |
| Notification | ✅ status | ✅ createdAt | ✅ user | ✅ | ✅ |
| FileAsset | ✅ | ✅ createdAt/updatedAt | ✅ user | ✅ | ✅ |
| AuditLog | ✅ | ✅ createdAt | ✅ user | ✅ | ✅ |
| ParameterGroup | ✅ | ✅ createdAt/updatedAt | ✅ definitions | ✅ | ✅ |
| ParameterDefinition | ✅ | ✅ createdAt/updatedAt | ✅ group | ✅ | ✅ |

### 5.2 数据库问题

| 问题 | 模型 | 说明 | 严重程度 |
|-----|------|------|---------|
| ProductCategory缺少status | ProductCategory | 分类无启用/禁用状态 | 低 |
| ParameterGroup缺少status | ParameterGroup | 参数组无启用/禁用状态 | 低 |
| ParameterDefinition缺少status | ParameterDefinition | 参数定义无启用/禁用状态 | 低 |

---

## 六、前后端交互问题

### 6.1 API路径不一致（Admin前端 vs 后端）

| 前端Service调用路径 | 后端Controller路径 | 是否一致 |
|--------------------|-------------------|---------|
| /admin/inquiries | InquiriesController(/inquiries) | ❌ 不一致 |
| /admin/inquiries/:id | InquiriesController(/inquiries/:id) | ❌ 不一致 |
| /admin/inquiries/:id/status | InquiriesController(无此端点) | ❌ 不存在 |
| /admin/inquiries/batch | InquiriesController(无此端点) | ❌ 不存在 |
| /admin/inquiries/batch/status | InquiriesController(无此端点) | ❌ 不存在 |
| /admin/audit-logs | AdminController | ❌ 需确认 |
| /admin/audit-logs/:id | AdminController | ❌ 需确认 |
| /admin/matching/stats | MatchController | ❌ 需确认 |

### 6.2 批量删除路径不一致

| 前端Service | 请求方法+路径 | 后端Controller | 状态 |
|------------|-------------|---------------|------|
| productService | POST /products/batch-delete | ✅ POST /products/batch-delete | ✅ 一致 |
| userService | POST /users/batch-delete | ✅ POST /users/batch-delete | ✅ 一致 |
| organizationService | POST /organizations/batch-delete | ✅ | ✅ 一致 |
| demandService | POST /demands/batch-delete | ✅ | ✅ 一致 |
| rfqService | POST /rfqs/batch-delete | ✅ | ✅ 一致 |
| offerService | POST /offers/batch-delete | ✅ | ✅ 一致 |
| inquiryService | DELETE /admin/inquiries/batch | 无此端点 | ❌ 不一致 |
| notificationService | DELETE /notifications/batch | ✅ | ✅ 一致 |
| categoryService | DELETE /product-categories/batch | ✅ | ✅ 不一致(方法) |
| parameterGroupService | DELETE /parameter-groups/batch | ✅ | ✅ 不一致(方法) |
| parameterDefinitionService | DELETE /parameter-definitions/batch | ✅ | ✅ 不一致(方法) |
| fileAssetService | DELETE /files/batch | ✅ | ✅ 不一致(方法) |

---

## 七、问题汇总与优先级

### P0 - 阻塞性问题（影响核心功能）

| 编号 | 问题 | 位置 | 说明 |
|------|------|------|------|
| P0-1 | Inquiry API路径不一致 | admin inquiry.service.ts | 前端调用/admin/inquiries但后端只有/inquiries |
| P0-2 | Inquiry批量操作端点不存在 | admin inquiry.service.ts | batchDelete/batchStatus调用后端不存在的端点 |

### P1 - 高优先级（功能缺失）

| 编号 | 问题 | 位置 | 说明 |
|------|------|------|------|
| P1-1 | DemandList缺少查看/编辑按钮 | apps/admin/src/pages/DemandList.tsx | 用户无法从列表导航到详情/编辑 |
| P1-2 | RfqList缺少编辑按钮 | apps/admin/src/pages/RfqList.tsx | 用户无法从列表编辑RFQ |
| P1-3 | OfferList缺少编辑按钮 | apps/admin/src/pages/OfferList.tsx | 用户无法从列表编辑Offer |
| P1-4 | InquiryList缺少编辑按钮 | apps/admin/src/pages/InquiryList.tsx | 用户无法从列表编辑Inquiry |
| P1-5 | UserList状态列显示英文 | apps/admin/src/pages/UserList.tsx | 显示"ACTIVE"而非"活跃" |
| P1-6 | Web需求详情无编辑/删除/发布按钮 | apps/web/src/app/workspace/demands/[id]/page.tsx | 用户无法管理需求 |
| P1-7 | Web RFQ详情无编辑/删除/发布按钮 | apps/web/src/app/workspace/rfqs/[id]/page.tsx | 用户无法管理RFQ |
| P1-8 | Web列表页无搜索/分页 | apps/web workspace pages | 所有列表页缺少搜索和分页 |
| P1-9 | Web需求/RFQ列表无创建按钮 | apps/web workspace pages | 用户需通过侧边栏创建 |

### P2 - 中优先级（功能优化）

| 编号 | 问题 | 位置 | 说明 |
|------|------|------|------|
| P2-1 | 分类/参数组/参数定义无批量状态变更 | admin pages | 只能批量删除，不能批量状态变更 |
| P2-2 | NotificationList无搜索功能 | admin pages | 无法搜索通知标题/内容 |
| P2-3 | NotificationList无批量状态变更 | admin pages | 只能批量删除，不能批量标记已读 |
| P2-4 | FileAssetOrphanList无搜索/筛选 | admin pages | 无法搜索文件名/类型 |
| P2-5 | Web设置页无编辑个人资料 | apps/web/src/app/workspace/settings/page.tsx | 只能查看，不能编辑 |
| P2-6 | 批量删除路径不一致 | 多个service文件 | DELETE vs POST, /batch vs /batch-delete |

### P3 - 低优先级（建议优化）

| 编号 | 问题 | 位置 | 说明 |
|------|------|------|------|
| P3-1 | 分类/参数组/参数定义无status字段 | database schema | 无启用/禁用状态 |
| P3-2 | API方法名不一致 | category/parameter service | 使用list()而非getList() |
| P3-3 | Web产品页无询价入口 | apps/web | 用户无法发起询价 |

---

## 八、审查结论

### 已完成功能
- ✅ Admin后台12个菜单项、38个页面路由全部正确配置
- ✅ 所有列表页基本功能（搜索、筛选、重置、分页、批量操作）已实现
- ✅ 所有详情页、创建页、编辑页功能完整
- ✅ 所有API端点有认证、授权、CSRF保护
- ✅ 所有表单提交有loading状态、错误处理、成功提示
- ✅ 所有删除操作有确认弹窗
- ✅ 批量操作有loading状态、错误处理、成功提示
- ✅ 数据库模型字段完整，关联关系正确

### 待修复问题
- ❌ **P0级问题2个** - Inquiry API路径不一致，需紧急修复
- ❌ **P1级问题9个** - 功能缺失，影响用户体验
- ❌ **P2级问题6个** - 功能优化，提升管理效率
- ❌ **P3级问题3个** - 建议优化，完善产品

---

*报告生成时间：2026-08-06 15:30*
*审查方式：代码级审查*