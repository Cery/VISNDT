# VISNDT 综合代码审计分析报告与修复执行计划

> 报告日期: 2026-08-07  
> 审计范围: Admin后台交互按钮、分类删除功能、前台注册401、登录逻辑及顶部栏用户状态  
> 报告编号: 14_VISNDT_Comprehensive_Audit_Analysis_Report

---

## 目录

1. [任务一：Admin 后台交互按钮审查](#1-任务一admin-后台交互按钮审查)
2. [任务二：分类删除功能错误提示审查](#2-任务二分类删除功能错误提示审查)
3. [任务三：前台注册 401 问题定位](#3-任务三前台注册-401-问题定位)
4. [任务四：登录逻辑及顶部栏用户状态审查](#4-任务四登录逻辑及顶部栏用户状态审查)
5. [修复执行计划总表](#5-修复执行计划总表)

---

## 1. 任务一：Admin 后台交互按钮审查

### 1.1 审查范围

审查了 `apps/admin/src/pages/` 下所有具有 CRUD 操作的列表页面，共审查 **15 个页面**：

| 页面文件 | 按钮类型 | 状态 |
|---------|---------|------|
| ProductCategoryList | 创建/编辑/删除/批量删除 | ✅ 正常 |
| ProductList | 创建/编辑/查看/删除/批量删除/批量状态 | ✅ 正常 |
| OrganizationList | 创建/编辑/查看/删除/批量删除/批量状态 | ✅ 正常 |
| UserList | 创建/编辑/查看/删除/批量删除/批量状态 | ✅ 正常 |
| ParameterGroupList | 创建/编辑/删除/批量删除 | ✅ 正常 |
| ParameterDefinitionList | 创建/编辑/删除/批量删除 | ✅ 正常 |
| DemandList | 查看/删除/批量删除/批量状态 | ✅ 正常 |
| RfqList | 创建/查看/删除/批量删除/批量状态 | ✅ 正常 |
| OfferList | 查看/删除/批量删除/批量状态 | ✅ 正常 |
| InquiryList | 查看/删除/批量删除/批量状态 | ✅ 正常 |
| NotificationList | 查看/批量删除/标记全部已读 | ✅ 正常 |
| FileAssetOrphanList | 批量删除/刷新 | ✅ 正常 |
| ProductMediaList | 下载/编辑/删除(Popconfirm) | ✅ 正常 |
| AuditLogList | 筛选/刷新（只读页面） | ✅ 正常 |
| MatchingMonitor | 刷新（仪表盘页面） | ✅ 正常 |

### 1.2 发现的重大问题

#### 问题 1.2.1：BatchOperations 组件静默吞错误（严重）

**文件路径**: [BatchOperations.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/components/BatchOperations.tsx)

**代码位置**: 第 40-42 行、第 59-61 行

```typescript
// 批量删除 - 第38-42行
onOk: async () => {
  if (onBatchDelete) {
    try {
      await onBatchDelete(selectedRowKeys as string[]);
    } catch (err) {
      console.error('Batch delete error:', err); // ← 只有 console.error，没有用户反馈
    }
  }
},

// 批量状态变更 - 第57-61行
onOk: async () => {
  if (onBatchStatus) {
    try {
      await onBatchStatus(selectedRowKeys as string[], key);
    } catch (err) {
      console.error('Batch status change error:', err); // ← 同样静默吞错误
    }
  }
},
```

**技术原因**: `catch` 块仅将错误输出到控制台 (`console.error`)，未调用 `message.error()` 或任何用户可见的反馈。无论 API 请求失败原因是网络错误、权限不足还是业务逻辑错误，用户都看不到任何提示。

**影响范围**: 所有使用 `BatchOperations` 组件的页面（共 9 个页面）的批量删除和批量状态变更操作。

#### 问题 1.2.2：BatchOperations 组件缺少操作成功反馈（中等）

**代码位置**: 第 37-45 行、第 56-64 行

`onBatchDelete` 和 `onBatchStatus` 执行成功后，组件本身不显示任何成功提示。虽然部分父组件（如 `ProductCategoryList`）在 `handleBatchDelete` 中有 `message.success()` 调用，但这也意味着：
- 如果父组件忘记添加成功提示，用户将看到"无反应"
- 不一致的体验：部分页面有成功提示，部分没有

#### 问题 1.2.3：ProductMediaList 删除按钮使用 Popconfirm 而非 Modal.confirm（轻微）

**文件路径**: [ProductMediaList.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/product-media/ProductMediaList.tsx)

**代码位置**: 第 288-298 行

使用 `Popconfirm` 而非 `Modal.confirm`，样式不一致但功能正常，无功能性缺陷。

#### 问题 1.2.4：NotificationList 缺少单条删除按钮（轻微）

**文件路径**: [NotificationList.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/NotificationList.tsx)

通知列表只有"批量删除"和"标记全部已读"，没有单条删除按钮。这属于功能缺失而非 Bug。

### 1.3 各项按钮功能评估结论

**结论**: 除 BatchOperations 组件的静默吞错误问题外，Admin 后台所有页面的交互按钮（创建、编辑、查看、删除、批量操作）均具有正确的点击事件绑定、回调函数定义、加载状态管理和错误处理。

---

## 2. 任务二：分类删除功能错误提示审查

### 2.1 后端删除逻辑完整分析

**文件路径**: [product-categories.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/product-categories/product-categories.service.ts)

#### 2.1.1 单条删除 (`remove` 方法，第 98-120 行)

```typescript
async remove(id: string) {
  const cat = await this.prisma.productCategory.findUnique({
    where: { id },
    include: { 
      _count: { 
        select: { products: true, children: true } 
      } 
    },
  });
  if (!cat) throw new NotFoundException(`ProductCategory ${id} not found`);

  if (cat._count.products > 0 || cat._count.children > 0) {
    const reasons: string[] = [];
    if (cat._count.products > 0) reasons.push(`${cat._count.products} product(s)`);
    if (cat._count.children > 0) reasons.push(`${cat._count.children} child category(ies)`);
    throw new BadRequestException(
      `Cannot delete category with existing dependencies: ${reasons.join(', ')}. Remove dependencies first.`,
    );
  }

  await this.prisma.productCategory.delete({ where: { id } });
  return { id };
}
```

**前置校验**: ✅ 在 DELETE 前查询了子分类数量 (`children`) 和关联产品数量 (`products`)

**事务处理**: ❌ **未使用事务**。如果删除操作在 `delete()` 时失败（如数据库异常），不会回滚，但由于 `delete()` 是最后一步且无副作用，风险较低。

#### 2.1.2 批量删除 (`batchDelete` 方法，第 56-96 行)

```typescript
async batchDelete(ids: string[]) {
  const results = await Promise.allSettled(
    ids.map(async (id) => {
      // ... 每个分类的独立校验和删除
    }),
  );
  // 返回 { succeeded, failed }
}
```

**问题**: 使用 `Promise.allSettled` 意味着部分删除可能成功、部分失败，但前端没有正确处理部分成功/部分失败的情况。

### 2.2 错误信息传递链

#### 2.2.1 后端错误结构

NestJS 的 `BadRequestException` 返回的标准格式为：
```json
{
  "statusCode": 400,
  "message": "Cannot delete category with existing dependencies: 2 product(s), 1 child category(ies). Remove dependencies first.",
  "error": "Bad Request"
}
```

**缺少错误码**: 响应中没有 `code` 或 `type` 字段供前端区分错误类型。

#### 2.2.2 前端错误处理

**文件路径**: [ProductCategoryList.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/category/ProductCategoryList.tsx)

```typescript
// 第95行 - 单条删除
message.error(err instanceof Error ? err.message : '删除失败');

// 第112行 - 批量删除
message.error(err instanceof Error ? err.message : '批量删除失败');
```

**当前问题**: 前端直接显示后端返回的英文错误消息（如 `Cannot delete category with existing dependencies: 2 product(s). Remove dependencies first.`），用户难以理解。

### 2.3 数据库级联删除配置

**文件路径**: [schema.prisma](file:///F:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma)（第 267-283 行）

```prisma
model ProductCategory {
  id       String  @id @default(uuid()) @db.Uuid
  name     String
  slug     String  @unique
  parentId String? @map("parent_id") @db.Uuid
  // ...
  parent   ProductCategory?  @relation("CategoryTree", fields: [parentId], references: [id])
  children ProductCategory[] @relation("CategoryTree")
  products Product[]
  demands  Demand[]
}
```

**级联策略**: 未显式设置 `onDelete`，Prisma 默认行为为 `Restrict`（禁止删除有外键引用的记录），与后端校验逻辑一致，不会出现外键约束冲突导致的意外删除。

### 2.4 问题总结

| 问题 | 严重程度 | 说明 |
|------|---------|------|
| 错误消息为英文 | 中 | 用户看到 "Cannot delete category..." 而非中文提示 |
| 缺少错误码规范 | 中 | 前端无法区分"存在子分类"、"存在产品"、"系统异常" |
| 批量删除结果未详细展示 | 低 | 部分成功/部分失败时，未展示具体哪些成功、哪些失败 |
| 删除操作未使用事务 | 低 | 单条删除操作无事务保护 |

---

## 3. 任务三：前台注册 401 问题定位

### 3.1 问题根因分析

#### 3.1.1 前端注册表单

**文件路径**: [register/page.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/register/page.tsx)

- 第 128-146 行：邀请码字段标记为 `（选填）`
- 第 31 行：传递 `inviteToken || undefined`

#### 3.1.2 后端 DTO 定义

**文件路径**: [register.dto.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/dto/register.dto.ts)

```typescript
// 第19-22行
@ApiPropertyOptional({ description: 'Invitation token (required for registration)', example: 'uuid-token' })
@IsOptional()
@IsString()
inviteToken?: string;
```

**DTO 标记为 `@IsOptional()`**，即从请求体解析层面允许为空。

#### 3.1.3 后端业务逻辑

**文件路径**: [auth.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/auth.service.ts)

```typescript
// 第26-28行
if (!dto.inviteToken) {
  throw new UnauthorizedException('Invitation token is required');
}
```

**根因**: 后端 `auth.service.ts` 的 `register()` 方法**强制要求** `inviteToken` 必须存在，但：
1. 前端表单将邀请码标记为**选填**
2. 后端 DTO 也标记为 `@IsOptional()`
3. 业务逻辑却抛出 `UnauthorizedException`

**这是严重的前后端不一致问题**。

#### 3.1.4 邀请流程验证

**文件路径**: [invitation.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/invitation.service.ts)

邀请流程：
1. Admin 管理员通过 `POST /invitations` 创建邀请（创建时需要指定邮箱和角色）
2. 系统生成 `token`（UUID），设置 7 天有效期
3. 用户注册时提交 `inviteToken`，后端验证 token 是否存在、未过期、邮箱匹配
4. 注册成功后 `consumeInvitation` 标记为已使用

**业务逻辑依据**: 要求邀请码的设计是为了防止未授权的注册，只有被管理员邀请的用户才能注册。但该限制未在前端明确告知用户。

### 3.2 401 的精确位置

**返回 401 的位置**: [auth.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/auth.service.ts) 第 26 行

```typescript
throw new UnauthorizedException('Invitation token is required');
```

**HTTP 状态码**: 401（Unauthorized）  
**语义合理性**: 不合理。使用 401 表示"缺少邀请码"在语义上不准确。401 通常表示身份验证失败，而这里应使用 400（Bad Request）或 403（Forbidden）。

### 3.3 CSRF 与中间件检查

- 注册端点 `/auth/register` 在 `CSRF_EXCLUDED_PATHS` 中（api-client.ts 第 25 行），不会被 CSRF 拦截
- 注册端点没有 `@UseGuards(JwtAuthGuard)`，不会被全局认证守卫拦截
- 请求不会被 ApiError 响应拦截器改写为 401

### 3.4 前端拦截器行为

**文件路径**: [api-client.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/lib/api-client.ts)

第 99-116 行：`apiClient` 在收到 401 后会尝试刷新 token，但注册接口的 401 是后端返回的，刷新 token 会失败（因为未登录），最终抛出 `ApiError(401, 'Session expired')`。

### 3.5 安全风险评估

如果移除邀请码要求，需要评估：
- **风险**: 允许无邀请码注册可能导致大量垃圾账号
- **缓解**: 已有 `@Throttle({ default: { limit: 5, ttl: 60000 } })` 限流（每分钟最多 5 次注册尝试）
- **建议**: 保留邀请码机制，但统一前后端表现

---

## 4. 任务四：登录逻辑及顶部栏用户状态审查

### 4.1 Admin 登录逻辑

**文件路径**: [Login.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/Login.tsx)

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 表单验证 | ✅ | 邮箱格式 + 必填校验 |
| 加载状态 | ✅ | `loading` 状态禁用按钮 + 显示 spinner |
| 错误提示 | ✅ | 显示"邮箱或密码错误，请重试。" |
| 登录后跳转 | ✅ | 支持 `from` 参数跳转回原页面 |
| 401 拦截 | ✅ | 响应拦截器处理 401 重定向 |

**文件路径**: [auth.store.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/stores/auth.store.ts)

| 检查项 | 状态 | 说明 |
|--------|------|------|
| JWT 持久化 | ✅ | 使用 zustand persist 持久化到 localStorage |
| Token 过期检测 | ✅ | `checkTokenExpiry` + 水合时检查 |
| 清除认证 | ✅ | `clearAuth` 清除所有状态 |

### 4.2 Web 前台登录逻辑

**文件路径**: [login/page.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/login/page.tsx)

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 表单验证 | ✅ | 邮箱格式 + 必填校验 |
| 加载状态 | ✅ | `submitting` 状态禁用按钮 + 显示 spinner |
| 错误提示 | ✅ | 401 → "邮箱或密码错误"；其他 → 显示具体错误 |
| 登录后跳转 | ✅ | `router.replace('/dashboard')` |

### 4.3 顶部栏用户状态显示（关键问题）

**文件路径**: [PublicHeader.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/layout/PublicHeader.tsx)

**发现重大问题**: Header 组件**完全未使用 `useAuth()` 钩子**，永远显示"登录"和"注册"按钮，不感知用户认证状态。

```typescript
// 第57-69行 - 始终显示登录/注册按钮
<div className="hidden md:flex items-center gap-3 flex-shrink-0">
  <Link href="/login">登录</Link>
  <Link href="/register">注册</Link>
</div>
```

**预期行为**: 登录后应显示用户信息（如用户名、头像）和退出按钮，而非登录/注册按钮。

**缺少的功能**:
1. 未根据 `isAuthenticated` 状态切换显示
2. 未显示当前用户信息（用户名/邮箱）
3. 无退出登录按钮
4. 无用户头像/下拉菜单

### 4.4 Web 前台 AuthProvider 状态管理

**文件路径**: [AuthProvider.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/auth/AuthProvider.tsx)

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 初始加载 | ✅ | 挂载时调用 `getMe()` 检查登录状态 |
| 登录后设置用户 | ✅ | `login()` 调用后 `setUser(res.user)` |
| 退出清除 | ✅ | `logout()` 调用后 `setUser(null)` |
| 注册后设置用户 | ✅ | `register()` 调用后 `setUser(res.user)` |
| 加载状态 | ✅ | `isLoading` 在初次检查时控制 |

---

## 5. 修复执行计划

### 5.1 优先级与分类

| 优先级 | 任务 | 影响范围 | 风险等级 |
|--------|------|---------|---------|
| P0 | 修复 BatchOperations 静默吞错误 | 所有使用批量操作的页面 | 低风险 |
| P0 | 统一注册邀请码前后端行为 | 前台注册流程 | 低风险 |
| P1 | 分类删除错误消息中文化 | 分类管理页面 | 低风险 |
| P1 | 添加分类删除错误码规范 | 后端 + 前端 | 低风险 |
| P2 | PublicHeader 用户状态感知 | Web 前台所有页面 | 低风险 |
| P3 | 修改注册缺少邀请码的错误码 | 后端 | 低风险 |

### 5.2 修复计划详情

#### 修复 1：BatchOperations 组件 - 添加用户反馈（P0）

**文件**: [BatchOperations.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/components/BatchOperations.tsx)

**修改内容**:
1. `handleDelete` 的 `catch` 块中增加 `message.error()`
2. `handleStatusChange` 的 `catch` 块中增加 `message.error()`
3. 在 `onBatchDelete` 成功后增加 `message.success()`

**具体代码**:

```typescript
// 修改 handleDelete 第 38-42 行
const handleDelete = () => {
  const desc = deleteDescription || `确定要删除选中的 ${count} 项吗？此操作不可撤销。`;
  Modal.confirm({
    title: deleteTitle,
    content: desc,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      if (onBatchDelete) {
        try {
          await onBatchDelete(selectedRowKeys as string[]);
          message.success(`成功删除 ${count} 项`);
        } catch (err) {
          console.error('Batch delete error:', err);
          message.error(err instanceof Error ? err.message : '批量删除失败，请重试。');
        }
      }
    },
  });
};

// 修改 handleStatusChange 第 56-62 行
const handleStatusChange: MenuProps['onClick'] = async ({ key }) => {
  const option = statusOptions?.find((o) => o.value === key);
  Modal.confirm({
    title: '确认状态变更',
    content: `确定要将选中的 ${count} 项状态变更为「${option?.label || key}」吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      if (onBatchStatus) {
        try {
          await onBatchStatus(selectedRowKeys as string[], key);
          message.success(`成功更新 ${count} 项状态`);
        } catch (err) {
          console.error('Batch status change error:', err);
          message.error(err instanceof Error ? err.message : '批量状态变更失败，请重试。');
        }
      }
    },
  });
};
```

#### 修复 2：统一注册邀请码机制（P0）

**方案选择**: 建议采用**方案A**（保留邀请码、统一表现）

**方案A（推荐）**: 保留邀请码机制，前端明确标记为必填
- 修改 `register/page.tsx`：将邀请码字段标记改为 **必填**，去掉"选填"标签
- 修改 `register/page.tsx`：在表单提交前检查 inviteToken 是否为空，为空时显示错误提示
- 修改 `auth.service.ts`：将 `UnauthorizedException` 改为 `BadRequestException`（语义更准确）

**方案B（备选）**: 允许无邀请码注册
- 修改 `auth.service.ts`：移除 inviteToken 强制检查
- 允许用户注册时无组织，注册后由管理员分配组织
- 需要修改 `register.dto.ts` 移除 `@IsOptional()`（如果改为必填）

**推荐采用方案A中的具体修改**:

**文件**: [auth.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/auth.service.ts) 第 26 行

```typescript
// 原代码
if (!dto.inviteToken) {
  throw new UnauthorizedException('Invitation token is required');
}

// 改为
if (!dto.inviteToken) {
  throw new BadRequestException('注册需要邀请码，请联系管理员获取。');
}
```

**文件**: [register/page.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/register/page.tsx) 第 128-146 行

```typescript
// 修改邀请码字段 - 改为必填
<div>
  <label htmlFor="reg-invite" className="block text-sm font-medium text-slate-700 mb-1">
    邀请码 <span className="text-red-500">*</span>
  </label>
  <input
    id="reg-invite"
    type="text"
    value={inviteToken}
    onChange={(e) => setInviteToken(e.target.value)}
    required
    disabled={status === 'submitting'}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
    placeholder="请输入管理员提供的邀请码"
  />
</div>
```

#### 修复 3：分类删除错误消息中文化（P1）

**文件**: [product-categories.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/product-categories/product-categories.service.ts)

**修改内容**:
1. 将英文错误消息改为中文
2. 添加错误码字段

```typescript
// 修改 remove 方法（第109-116行）
if (cat._count.products > 0 || cat._count.children > 0) {
  const reasons: string[] = [];
  if (cat._count.products > 0) reasons.push(`${cat._count.products} 个产品`);
  if (cat._count.children > 0) reasons.push(`${cat._count.children} 个子分类`);
  throw new BadRequestException({
    code: cat._count.products > 0 ? 'CATEGORY_HAS_PRODUCTS' : 'CATEGORY_HAS_CHILDREN',
    message: `无法删除该分类：分类下存在 ${reasons.join('、')}，请先移除依赖项后再删除。`,
    details: {
      productCount: cat._count.products,
      childCount: cat._count.children,
    },
  });
}
```

**文件**: [ProductCategoryList.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/category/ProductCategoryList.tsx)

**修改内容**: 前端错误处理增强

```typescript
// 修改 handleDelete 的 catch 块（第95行）
} catch (err) {
  let errorMsg = '删除失败';
  if (err instanceof Error) {
    try {
      const apiError = JSON.parse(err.message);
      errorMsg = apiError.message || apiError.error || err.message;
    } catch {
      errorMsg = err.message;
    }
  }
  message.error(errorMsg);
}
```

#### 修复 4：PublicHeader 用户状态感知（P2）

**文件**: [PublicHeader.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/layout/PublicHeader.tsx)

**修改内容**:
1. 导入 `useAuth` 钩子
2. 根据 `isAuthenticated` 和 `user` 状态切换显示登录/注册按钮或用户信息

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider'; // 新增

// ... 在组件内部
export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth(); // 新增

  // ... 修改桌面端 Auth Buttons 区域
  {isAuthenticated && user ? (
    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-slate-700 hover:text-primary transition-colors px-3 py-2"
      >
        {user.name || user.email}
      </Link>
      <button
        onClick={async () => { await logout(); window.location.href = '/'; }}
        className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-2"
      >
        退出
      </button>
    </div>
  ) : (
    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
      <Link href="/login" className="...">登录</Link>
      <Link href="/register" className="...">注册</Link>
    </div>
  )}
```

#### 修复 5：修改注册缺少邀请码的错误码（P3）

**文件**: [auth.service.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/api/src/auth/auth.service.ts) 第 26 行

```typescript
// 将 UnauthorizedException 改为 BadRequestException
throw new BadRequestException('注册需要邀请码，请联系管理员获取。');
```

### 5.3 安全风险评估

| 修复项 | 安全风险 | 缓解措施 |
|--------|---------|---------|
| 修复 1（BatchOperations 反馈） | 无 | 仅增加用户反馈，不修改业务逻辑 |
| 修复 2（注册邀请码） | 低 | 保留邀请码机制，仅统一前后端表现 |
| 修复 3（分类删除消息） | 无 | 仅修改错误消息格式和内容 |
| 修复 4（Header 用户状态） | 低 | 仅在已登录时显示用户信息，不涉及权限 |
| 修复 5（错误码修改） | 无 | 仅修改异常类型 |

### 5.4 执行顺序建议

```
Phase 1 (P0 - 立即修复)
├── 修复 1: BatchOperations 组件用户反馈
└── 修复 2: 统一注册邀请码前后端行为

Phase 2 (P1 - 尽快修复)
├── 修复 3: 分类删除错误消息中文化 + 错误码
└── 修复 5: 修改后端错误码类型

Phase 3 (P2 - 按计划修复)
└── 修复 4: PublicHeader 用户状态感知
```

---

## 附录 A：审查文件清单

| 文件路径 | 关联任务 |
|---------|---------|
| apps/admin/src/components/BatchOperations.tsx | 任务一 |
| apps/admin/src/pages/category/ProductCategoryList.tsx | 任务一、二 |
| apps/admin/src/pages/ProductList.tsx | 任务一 |
| apps/admin/src/pages/OrganizationList.tsx | 任务一 |
| apps/admin/src/pages/UserList.tsx | 任务一 |
| apps/admin/src/pages/parameter/ParameterGroupList.tsx | 任务一 |
| apps/admin/src/pages/parameter/ParameterDefinitionList.tsx | 任务一 |
| apps/admin/src/pages/DemandList.tsx | 任务一 |
| apps/admin/src/pages/RfqList.tsx | 任务一 |
| apps/admin/src/pages/OfferList.tsx | 任务一 |
| apps/admin/src/pages/InquiryList.tsx | 任务一 |
| apps/admin/src/pages/NotificationList.tsx | 任务一 |
| apps/admin/src/pages/FileAssetOrphanList.tsx | 任务一 |
| apps/admin/src/pages/product-media/ProductMediaList.tsx | 任务一 |
| apps/admin/src/pages/AuditLogList.tsx | 任务一 |
| apps/admin/src/pages/MatchingMonitor.tsx | 任务一 |
| apps/api/src/product-categories/product-categories.service.ts | 任务二 |
| apps/api/src/product-categories/product-categories.controller.ts | 任务二 |
| apps/admin/src/api/category.service.ts | 任务二 |
| database/prisma/schema.prisma | 任务二 |
| apps/web/src/app/register/page.tsx | 任务三 |
| apps/api/src/auth/auth.service.ts | 任务三 |
| apps/api/src/auth/auth.controller.ts | 任务三 |
| apps/api/src/auth/dto/register.dto.ts | 任务三 |
| apps/api/src/auth/invitation.service.ts | 任务三 |
| apps/web/src/lib/api-client.ts | 任务三、四 |
| apps/web/src/auth/AuthProvider.tsx | 任务三、四 |
| apps/web/src/services/auth.service.ts | 任务三、四 |
| apps/web/src/app/login/page.tsx | 任务四 |
| apps/web/src/components/layout/PublicHeader.tsx | 任务四 |
| apps/admin/src/pages/Login.tsx | 任务四 |
| apps/admin/src/stores/auth.store.ts | 任务四 |
| apps/admin/src/api/client.ts | 任务四 |
| apps/admin/src/api/product.service.ts | 任务一 |
| apps/admin/src/api/user.service.ts | 任务一 |
| apps/admin/src/api/organization.service.ts | 任务一 |