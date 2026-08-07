# VISNDT Admin 管理后台修复方案

> 报告日期：2026-08-05  
> 修复范围：搜索/筛选功能 + 删除功能 + 组织列表搜索Bug  
> 文档编号：293_M13.9_Admin_Fix_Plan

---

## 一、概述

基于此前审查报告（06_VISNDT_Admin_Full_Review_Report.md）发现的三大类问题，制定本修复方案：

| 问题类别 | 涉及模块 | 数量 | 优先级 |
|---------|---------|------|--------|
| 搜索/筛选缺失 | 后端 8 个 API + 前端 8 个页面 | 16 处 | 高 |
| 删除功能缺失 | 后端 6 个 API + 前端 6 个页面 | 12 处 | 中 |
| 组织列表搜索 Bug | 1 处（前端传参+后端API） | 1 处 | 高 |

---

## 二、搜索/筛选功能修复

### 2.1 后端 API 改造

所有缺失搜索/筛选的后端 API 使用统一的模式：**扩展 DTO → 修改 Controller 签名 → 修改 Service 查询逻辑**。

#### 2.1.1 通用搜索 DTO 定义

**新建文件**: `apps/api/src/common/dto/search-params.dto.ts`

```typescript
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchParamsDto {
  @ApiPropertyOptional({ description: 'Search keyword', example: 'keyword' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by status', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
```

#### 2.1.2 各模块后端改造详情

##### 1. Offers 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/offers/offers.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/offers/offers.service.ts` | `findAll()` 方法增加 `keyword` 和 `status` 查询条件 |

**Service 修改后代码**:
```typescript
async findAll(params: SearchParamsDto) {
  const { page = 1, pageSize = 20, keyword, status } = params;
  const skip = (page - 1) * pageSize;

  const where: Prisma.OfferWhereInput = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    this.prisma.offer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { organization: true, product: true },
    }),
    this.prisma.offer.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
```

##### 2. RFQs 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/rfqs/rfqs.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/rfqs/rfqs.service.ts` | `findAll()` 方法增加 `keyword` 和 `status` 查询条件；keyword 搜索 demand.title |

**Service 修改思路**:
- `keyword` 搜索 RFQ 关联的 Demand.title
- `status` 直接过滤 RFQ.status

##### 3. Inquiries (Admin) 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/admin/admin-inquiry.controller.ts` | `list()` 方法增加 `@Query('keyword')` 和 `@Query('status')` 参数 |
| `apps/api/src/admin/admin-inquiry.service.ts` | `list()` 方法增加 `keyword` 和 `status` 查询条件 |

**Service 修改后代码**:
```typescript
async list(page: number, pageSize: number, keyword?: string, status?: string) {
  const skip = (page - 1) * pageSize;
  const where: Prisma.InquiryWhereInput = {};

  if (keyword) {
    where.OR = [
      { contactName: { contains: keyword } },
      { contactEmail: { contains: keyword } },
      { message: { contains: keyword } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    this.prisma.inquiry.findMany({ where, skip, take: pageSize, ... }),
    this.prisma.inquiry.count({ where }),
  ]);
  // ...
}
```

##### 4. Organizations 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/organizations/organizations.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/organizations/organizations.service.ts` | `findAll()` 方法增加 `keyword` 和 `status` 查询条件 |

**Service 修改思路**:
- `keyword` 搜索 name 和 type
- `status` 直接过滤 Organization.status

##### 5. Parameter Groups 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/parameter-groups/parameter-groups.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/parameter-groups/parameter-groups.service.ts` | `findAll()` 方法增加 `keyword` 查询条件 |

**Service 修改思路**:
- `keyword` 搜索 name 和 code
- `status` 不适用（参数组无状态字段）

##### 6. Parameter Definitions 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/parameter-definitions/parameter-definitions.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/parameter-definitions/parameter-definitions.service.ts` | `findAll()` 方法增加 `keyword` 和 `parameterGroupId` 查询条件 |

**Service 修改思路**:
- `keyword` 搜索 name 和 code
- 额外增加 `parameterGroupId` 筛选参数（按参数组过滤）

##### 7. Product Categories 模块

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/product-categories/product-categories.controller.ts` | `findAll()` 参数类型从 `PaginationDto` 改为 `SearchParamsDto` |
| `apps/api/src/product-categories/product-categories.service.ts` | `findAll()` 方法增加 `keyword` 查询条件 |

**Service 修改思路**:
- `keyword` 搜索 name
- `status` 不适用（分类无状态字段）

##### 8. Product Media 模块

**注意**: 产品媒体列表是通过 `GET /products/:productId/media` 获取，按 productId 过滤，分页需求较低。如果需要分页，需新增 `page`/`pageSize` 参数支持。

| 文件 | 修改内容 |
|------|---------|
| `apps/api/src/product-media/product-media.controller.ts` | `findByProduct()` 增加 `@Query()` 分页参数 |
| `apps/api/src/product-media/product-media.service.ts` | `findByProduct()` 改为分页查询 |

---

### 2.2 前端搜索/筛选 UI 改造

#### 2.2.1 前端类型扩展

**`apps/admin/src/types/organization.types.ts`** — `SearchOrganizationParams` 增加字段：

```typescript
export interface SearchOrganizationParams {
  page?: number;
  pageSize?: number;
  keyword?: string;    // 新增
  status?: string;     // 新增
}
```

#### 2.2.2 各页面改造详情

##### 1. OfferList.tsx — 新增搜索+筛选

**修改内容**:
- 添加 `keyword` 和 `status` 状态管理
- 添加 `Input.Search` 搜索框
- 添加 `Select` 状态筛选下拉
- 修改 `offerService.getList()` 调用传递搜索参数

**示例代码**:
```typescript
// 新增搜索/筛选状态
const [keyword, setKeyword] = useState('');
const [statusFilter, setStatusFilter] = useState('');

// 修改 API 调用
const fetchOffers = useCallback(async () => {
  setPageState({ status: 'loading' });
  try {
    const result = await offerService.getList(
      query.page, query.pageSize, query.keyword, query.status
    );
    // ...
  }
}, [query]);

// 新增搜索 UI
<Space style={{ marginBottom: 16 }} wrap>
  <Input.Search
    placeholder="按标题搜索报价"
    allowClear
    onSearch={(v) => setQuery(p => ({ ...p, keyword: v, page: 1 }))}
    style={{ width: 320 }}
  />
  <Select
    placeholder="按状态筛选"
    allowClear
    value={query.status || undefined}
    onChange={(v) => setQuery(p => ({ ...p, status: v || '', page: 1 }))}
    options={[
      { value: '', label: '全部状态' },
      { value: 'DRAFT', label: '草稿' },
      { value: 'SUBMITTED', label: '已提交' },
      { value: 'ACCEPTED', label: '已接受' },
      { value: 'REJECTED', label: '已拒绝' },
      { value: 'WITHDRAWN', label: '已撤回' },
    ]}
    style={{ width: 160 }}
  />
</Space>
```

##### 2. OfferList.tsx — 修改 service 调用

```typescript
// offerService.getList() 增加搜索参数
async getList(
  page = 1,
  pageSize = 20,
  keyword?: string,
  status?: string,
): Promise<OfferListResponse> {
  const params: Record<string, any> = { page, pageSize };
  if (keyword) params.keyword = keyword;
  if (status) params.status = status;
  const response = (await apiClient.get('/offers', { params })) as any;
  return response.data;
},
```

##### 3. InquiryList.tsx — 新增搜索+筛选

**修改内容**:
- 添加 `keyword` 和 `status` 状态管理
- 添加搜索框和状态筛选下拉
- 修改 `inquiryService.getList()` 传递搜索参数

##### 4. RfqList.tsx — 改为服务端筛选

**当前问题**: 客户端筛选（`filteredData` 使用 useMemo 在前端过滤）。

**修改内容**:
- 移除 `filteredData` 客户端过滤逻辑
- 添加 `keyword` 搜索框
- 修改 `rfqService.getList()` 传递搜索参数，让后端过滤

##### 5. OrganizationList.tsx — 修复搜索传参 Bug

**当前问题**: 前端有搜索 UI 但 `keyword` 和 `status` 参数未传递给后端 API。

**修改内容**:
- 修改 `fetchOrganizations()` 中的 `params`，将 `keyword` 和 `status` 传递给 API
- 移除 `filteredData` 客户端过滤逻辑（改为后端过滤）

```typescript
// 修改前
const params: SearchOrganizationParams = {
  page: query.page,
  pageSize: query.pageSize,
};

// 修改后
const params: SearchOrganizationParams = {
  page: query.page,
  pageSize: query.pageSize,
  keyword: query.keyword.trim() || undefined,
  status: query.status || undefined,
};
```

##### 6. ParameterGroupList.tsx — 新增搜索

**修改内容**:
- 添加 `keyword` 搜索框
- 修改 `parameterGroupService.list()` 传递搜索参数

##### 7. ParameterDefinitionList.tsx — 新增搜索+筛选

**修改内容**:
- 添加 `keyword` 搜索框
- 添加 `parameterGroupId` 筛选下拉（按参数组过滤）
- 修改 `parameterDefinitionService.list()` 传递搜索参数

##### 8. ProductCategoryList.tsx — 新增搜索

**修改内容**:
- 添加 `keyword` 搜索框
- 修改 `categoryService.list()` 传递搜索参数

##### 9. ProductMediaList.tsx — 维持现状

**说明**: 产品媒体列表按 productId 过滤，属于产品详情子页面，搜索需求较低。暂不修改。

---

## 三、删除功能修复

### 3.1 后端 API 新增删除端点

#### 3.1.1 删除策略

所有删除操作采用 **级联删除**（Cascade Delete）策略：
- 删除前检查关联数据，若有依赖则阻止删除或给予警告
- 使用 `DELETE` HTTP 方法
- 管理员权限（`JwtAuthGuard + RolesGuard + @Roles(Role.ADMIN)`）
- 返回 `ApiResponse.ok(null, 'xxx deleted')`

#### 3.1.2 各模块删除端点

| 模块 | 端点 | 关联检查 | 级联处理 |
|------|------|---------|---------|
| 产品 | `DELETE /products/:id` | 检查是否有 Offer、DemandMatch | 级联删除 Media、ParameterValues、ParameterAssociations |
| 用户 | `DELETE /users/:id` | — | 级联删除 Memberships、Notifications、RefreshTokens |
| 组织 | `DELETE /organizations/:id` | 检查是否有 User、Offer、Demand | 阻止删除（有依赖数据） |
| 参数组 | `DELETE /parameter-groups/:id` | 检查是否有 ParameterDefinition | 阻止删除（有依赖数据） |
| 参数定义 | `DELETE /parameter-definitions/:id` | 检查是否有 ProductParameterValue | 阻止删除（有依赖数据） |
| 产品分类 | `DELETE /product-categories/:id` | 检查是否有 Product、子分类 | 阻止删除（有依赖数据） |

#### 3.1.3 示例：Products 模块删除实现

**Controller** (`apps/api/src/products/products.controller.ts`):
```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete product (ADMIN only). Cascades: media, parameter values, parameter associations' })
@ApiParam({ name: 'id', description: 'Product UUID' })
async remove(@Param('id') id: string) {
  return ApiResponse.ok(await this.service.remove(id), 'Product deleted');
}
```

**Service** (`apps/api/src/products/products.service.ts`):
```typescript
async remove(id: string) {
  // 1. Check existence
  const product = await this.prisma.product.findUnique({
    where: { id },
    include: { offers: true, demandMatches: true },
  });
  if (!product) throw new NotFoundException(`Product ${id} not found`);

  // 2. Check dependencies
  if (product.offers.length > 0) {
    throw new BadRequestException(
      'Cannot delete product with existing offers. Remove offers first.',
    );
  }

  // 3. Cascade delete in transaction
  await this.prisma.$transaction([
    this.prisma.productMedia.deleteMany({ where: { productId: id } }),
    this.prisma.productParameterValue.deleteMany({ where: { productId: id } }),
    this.prisma.productParameterDefinition.deleteMany({ where: { productId: id } }),
    this.prisma.product.delete({ where: { id } }),
  ]);

  return { id };
}
```

#### 3.1.4 其他模块实现要点

| 模块 | 事务级联 | 注意 |
|------|---------|------|
| **Users** | `deleteMany(notification) → deleteMany(refreshToken) → deleteMany(membership) → delete(user)` | 保留 `AuditLog` 引用（不级联删除） |
| **Organizations** | 先检查 → 有依赖则抛出 `BadRequestException` | 不自动删除，让管理员先清理依赖 |
| **Parameter Groups** | 先检查是否有 `definitions` → 有则阻止 | 提示先删除参数定义 |
| **Parameter Definitions** | 先检查是否有 `productValues` → 有则阻止 | 提示先解除产品关联 |
| **Product Categories** | 先检查是否有 `products` 或 `children` → 有则阻止 | 提示先清空分类下的产品 |

### 3.2 前端删除按钮 UI 改造

#### 3.2.1 通用删除确认弹窗

使用 Ant Design 的 `Modal.confirm()` 实现删除确认：

```typescript
const handleDelete = useCallback(async (id: string, name: string) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除"${name}"吗？此操作不可恢复。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await productService.remove(id);
        message.success('删除成功');
        fetchProducts(); // 刷新列表
      } catch (err) {
        message.error(err instanceof Error ? err.message : '删除失败');
      }
    },
  });
}, [fetchProducts]);
```

#### 3.2.2 各页面添加删除按钮

| 页面 | 位置 | 按钮样式 | 条件 |
|------|------|---------|------|
| ProductList.tsx | 操作列新增 | 红色 Danger 按钮 | 所有产品 |
| ProductDetail.tsx | 页面底部操作区 | 红色 Danger 按钮 | 非 ACTIVE 状态 |
| UserList.tsx | 操作列新增 | 红色 Danger 按钮 | 仅对非 ADMIN 用户 |
| UserDetail.tsx | 页面底部操作区 | 红色 Danger 按钮 | 仅对非自己 |
| OrganizationList.tsx | 操作列新增 | 红色 Danger 按钮 | 仅对无依赖的组织 |
| OrganizationDetail.tsx | 页面底部操作区 | 红色 Danger 按钮 | 仅对无依赖的组织 |
| ParameterGroupList.tsx | 操作列新增 | 红色 Danger 按钮 | 仅对无关联定义的分组 |
| ParameterDefinitionList.tsx | 操作列新增 | 红色 Danger 按钮 | 仅对无关联值的定义 |
| ProductCategoryList.tsx | 操作列新增 | 红色 Danger 按钮 | 仅对无产品的分类 |

#### 3.2.3 前端 Service 新增删除方法

每个模块需要在对应的 service 文件中新增 `remove()` 方法：

```typescript
// productService.ts
async remove(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

// userService.ts
async remove(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

// organizationService.ts
async remove(id: string): Promise<void> {
  await apiClient.delete(`/organizations/${id}`);
}

// parameterService.ts (parameter-group)
async remove(id: string): Promise<void> {
  await apiClient.delete(`/parameter-groups/${id}`);
}

// parameterDefinitionService.ts
async remove(id: string): Promise<void> {
  await apiClient.delete(`/parameter-definitions/${id}`);
}

// categoryService.ts
async remove(id: string): Promise<void> {
  await apiClient.delete(`/product-categories/${id}`);
}
```

---

## 四、Prisma Schema 检查

### 4.1 当前级联删除配置

检查 `schema.prisma` 中的 `onDelete` 配置：

```prisma
// 当前状态：所有模型均未显式配置 onDelete
// 需要添加 onDelete: Cascade 的关联
```

### 4.2 需要添加级联删除的关联

```prisma
// User 删除时级联
memberships    OrganizationMember[]  @relation(onDelete: Cascade)
notifications  Notification[]        @relation(onDelete: Cascade)
refreshTokens  RefreshToken[]        @relation(onDelete: Cascade)

// Product 删除时级联
media                 ProductMedia[]                @relation(onDelete: Cascade)
parameterValues       ProductParameterValue[]       @relation(onDelete: Cascade)
parameterAssociations ProductParameterDefinition[]  @relation(onDelete: Cascade)

// Organization 删除时级联
members  OrganizationMember[]  @relation(onDelete: Cascade)
users    User[]                @relation(onDelete: SetNull)
offers   Offer[]               @relation(onDelete: Cascade)
demands  Demand[]              @relation(onDelete: SetNull)
```

**注意**: 修改 Prisma Schema 后需要执行 `npx prisma migrate dev` 生成数据库迁移。

---

## 五、实施顺序与工作量估算

### 5.1 推荐实施顺序

```
Phase 1: 修复组织列表搜索 Bug (高优先级)
  → 修改 SearchOrganizationParams 类型
  → 修改 OrganizationList.tsx 传递搜索参数
  → 修改 organizations.service.ts 支持 keyword/status 搜索

Phase 2: 实现搜索/筛选功能 (高优先级)
  → 创建 SearchParamsDto 通用 DTO
  → 改造 Offers 模块 (API + 前端)
  → 改造 Inquiries 模块 (API + 前端)
  → 改造 RFQs 模块 (API + 前端)
  → 改造 Parameter Groups 模块 (API + 前端)
  → 改造 Parameter Definitions 模块 (API + 前端)
  → 改造 Product Categories 模块 (API + 前端)

Phase 3: 实现删除功能 (中优先级)
  → 添加 Prisma onDelete 级联配置 + 生成迁移
  → 实现 Products 删除 (API + 前端)
  → 实现 Users 删除 (API + 前端)
  → 实现 Organizations 删除 (API + 前端)
  → 实现 Parameter Groups 删除 (API + 前端)
  → 实现 Parameter Definitions 删除 (API + 前端)
  → 实现 Product Categories 删除 (API + 前端)
```

### 5.2 工作量估算

| 阶段 | 后端文件修改 | 前端文件修改 | 预计工时 |
|------|------------|------------|---------|
| Phase 1: 组织搜索 Bug | 2 | 2 | 0.5h |
| Phase 2: 搜索/筛选 | 16 | 14 | 4h |
| Phase 3: 删除功能 | 12 | 14 | 3h |
| Prisma Schema 修改 | 1 | 0 | 0.5h |
| 编译验证 | 0 | 0 | 0.5h |
| **总计** | **31** | **30** | **~8.5h** |

### 5.3 修改文件清单

#### Phase 1: 组织搜索 Bug 修复

| 文件 | 修改类型 |
|------|---------|
| `apps/admin/src/types/organization.types.ts` | 修改 - SearchOrganizationParams 增加 keyword/status |
| `apps/admin/src/pages/OrganizationList.tsx` | 修改 - 传递搜索参数到 API |
| `apps/api/src/organizations/organizations.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/organizations/organizations.service.ts` | 修改 - 增加 keyword/status 查询 |

#### Phase 2: 搜索/筛选功能

| 文件 | 修改类型 |
|------|---------|
| `apps/api/src/common/dto/search-params.dto.ts` | **新建** - 通用搜索 DTO |
| `apps/api/src/offers/offers.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/offers/offers.service.ts` | 修改 - 增加 keyword/status 查询 |
| `apps/api/src/rfqs/rfqs.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/rfqs/rfqs.service.ts` | 修改 - 增加 keyword/status 查询 |
| `apps/api/src/admin/admin-inquiry.controller.ts` | 修改 - 增加 keyword/status 参数 |
| `apps/api/src/admin/admin-inquiry.service.ts` | 修改 - 增加 keyword/status 查询 |
| `apps/api/src/parameter-groups/parameter-groups.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/parameter-groups/parameter-groups.service.ts` | 修改 - 增加 keyword 查询 |
| `apps/api/src/parameter-definitions/parameter-definitions.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/parameter-definitions/parameter-definitions.service.ts` | 修改 - 增加 keyword 查询 |
| `apps/api/src/product-categories/product-categories.controller.ts` | 修改 - 改用 SearchParamsDto |
| `apps/api/src/product-categories/product-categories.service.ts` | 修改 - 增加 keyword 查询 |
| `apps/admin/src/api/offer.service.ts` | 修改 - getList 增加搜索参数 |
| `apps/admin/src/api/inquiry.service.ts` | 修改 - getList 增加搜索参数 |
| `apps/admin/src/api/rfq.service.ts` | 修改 - getList 增加搜索参数 |
| `apps/admin/src/api/organization.service.ts` | 修改 - 无变化（已传递 params） |
| `apps/admin/src/pages/OfferList.tsx` | 修改 - 新增搜索+筛选 UI |
| `apps/admin/src/pages/InquiryList.tsx` | 修改 - 新增搜索+筛选 UI |
| `apps/admin/src/pages/RfqList.tsx` | 修改 - 改为服务端筛选 |
| `apps/admin/src/pages/parameter/ParameterGroupList.tsx` | 修改 - 新增搜索 UI |
| `apps/admin/src/pages/parameter/ParameterDefinitionList.tsx` | 修改 - 新增搜索+筛选 UI |
| `apps/admin/src/pages/category/ProductCategoryList.tsx` | 修改 - 新增搜索 UI |

#### Phase 3: 删除功能

| 文件 | 修改类型 |
|------|---------|
| `database/prisma/schema.prisma` | 修改 - 添加 onDelete 级联配置 |
| `apps/api/src/products/products.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/products/products.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/api/src/users/users.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/users/users.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/api/src/organizations/organizations.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/organizations/organizations.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/api/src/parameter-groups/parameter-groups.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/parameter-groups/parameter-groups.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/api/src/parameter-definitions/parameter-definitions.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/parameter-definitions/parameter-definitions.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/api/src/product-categories/product-categories.controller.ts` | 修改 - 新增 DELETE 端点 |
| `apps/api/src/product-categories/product-categories.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/admin/src/api/product.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/admin/src/api/user.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/admin/src/api/organization.service.ts` | 修改 - 新增 remove() 方法 |
| `apps/admin/src/pages/ProductList.tsx` | 修改 - 操作列新增删除按钮 |
| `apps/admin/src/pages/ProductDetail.tsx` | 修改 - 底部新增删除按钮 |
| `apps/admin/src/pages/UserList.tsx` | 修改 - 操作列新增删除按钮 |
| `apps/admin/src/pages/UserDetail.tsx` | 修改 - 底部新增删除按钮 |
| `apps/admin/src/pages/OrganizationList.tsx` | 修改 - 操作列新增删除按钮 |
| `apps/admin/src/pages/OrganizationDetail.tsx` | 修改 - 底部新增删除按钮 |
| `apps/admin/src/pages/parameter/ParameterGroupList.tsx` | 修改 - 操作列新增删除按钮 |
| `apps/admin/src/pages/parameter/ParameterDefinitionList.tsx` | 修改 - 操作列新增删除按钮 |
| `apps/admin/src/pages/category/ProductCategoryList.tsx` | 修改 - 操作列新增删除按钮 |

---

## 六、验证标准

### 6.1 编译验证

| 检查项 | 命令 | 预期结果 |
|--------|------|---------|
| API 编译 | `pnpm --filter @visndt/api build` | Exit code 0 |
| Admin 编译 | `pnpm --filter @visndt/admin build` | Exit code 0 |
| Web 编译 | `pnpm --filter @visndt/web build` | Exit code 0 |

### 6.2 功能验证

| 检查项 | 验证方法 | 预期结果 |
|--------|---------|---------|
| 产品列表搜索 | 输入关键词搜索 | 返回匹配产品 |
| 产品列表状态筛选 | 选择状态下拉 | 仅显示对应状态产品 |
| 组织列表搜索 | 输入关键词搜索 | 参数传递到后端，返回正确结果 |
| 报价列表搜索+筛选 | 输入关键词 + 选择状态 | 正确过滤 |
| 询价列表搜索+筛选 | 输入关键词 + 选择状态 | 正确过滤 |
| RFQ 列表搜索 | 输入关键词 | 后端过滤，非客户端过滤 |
| 删除产品 | 点击删除按钮 → 确认 | 产品及关联数据被删除 |
| 删除有依赖的组织 | 点击删除按钮 → 确认 | 提示错误，阻止删除 |

### 6.3 回归验证

| 检查项 | 验证方法 |
|--------|---------|
| 现有 API 不受影响 | 验证所有现有 GET/POST/PATCH 端点正常 |
| 分页功能正常 | 验证搜索+筛选后的分页总数正确 |
| 权限控制正常 | 验证非 ADMIN 用户无法调用 DELETE 端点 |

---

## 七、风险与注意事项

### 7.1 风险点

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Prisma Schema 修改导致数据库迁移异常 | 数据库表结构变更 | 先在 staging 环境测试迁移 |
| 删除操作导致数据丢失 | 用户误操作删除重要数据 | 使用级联检查机制，阻止有依赖的删除 |
| 搜索参数不兼容 | 前端旧版本调用新 API 失败 | 搜索参数均为可选参数，向后兼容 |

### 7.2 注意事项

1. **所有新增搜索参数均为可选**，不传参时行为与现有 PaginationDto 完全一致，确保向后兼容
2. **删除操作均为硬删除**（非软删除），删除后数据不可恢复。如果未来需要回收站功能，建议改为软删除（添加 `deletedAt` 字段）
3. **Prisma 迁移**需要在修改 schema 后执行 `npx prisma migrate dev --name add_cascade_delete`，并确保 Docker 中的 PostgreSQL 正在运行
4. **组织删除**由于关联关系复杂，建议采用"先清理依赖再删除"的策略，而非自动级联删除

---

*报告由 Trae AI 自动生成*