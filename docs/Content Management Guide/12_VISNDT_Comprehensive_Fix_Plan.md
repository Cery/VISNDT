# VISNDT 全面按钮功能修复计划

> 计划日期：2026-08-06
> 基于审查报告：11_VISNDT_Comprehensive_Button_Function_Review_Report.md
> 修复范围：P0-P3全部20个问题

---

## 一、修复阶段划分

| 阶段 | 内容 | 问题数 | 涉及范围 |
|------|------|--------|---------|
| Phase 1 | P0阻塞性问题修复 | 2个 | apps/api + apps/admin |
| Phase 2 | P1 Admin后台功能缺失 | 5个 | apps/admin |
| Phase 3 | P1 Web前台功能缺失 | 4个 | apps/web |
| Phase 4 | P2中优先级优化 | 6个 | apps/admin + apps/web |
| Phase 5 | P3低优先级优化 | 3个 | apps/admin + apps/web |
| Phase 6 | 构建验证 | - | 全项目 |

---

## 二、详细修复方案

### Phase 1: P0阻塞性问题修复（2个）

#### 1.1 Inquiry API路径不一致
**问题**：Admin前端 `inquiry.service.ts` 调用 `/admin/inquiries`，但后端 `InquiriesController` 只有 `/inquiries` 路径。

**修复方案**：在 `apps/api/src/inquiries/inquiries.controller.ts` 中新增 Admin 专属端点，使用 `/admin/inquiries` 前缀。

**涉及文件**：
- `apps/api/src/inquiries/inquiries.controller.ts`
- `apps/api/src/inquiries/inquiries.service.ts`

**具体修改**：
```typescript
// inquiries.controller.ts 新增
@Controller('admin/inquiries')
export class AdminInquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inquiries (ADMIN only)' })
  async findAll(@Query() dto: PaginationDto) { ... }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) { ... }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async updateStatus(@Param('id') id: string, @Body() dto: { status: string }) { ... }

  @Delete('batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async batchDelete(@Body() dto: { ids: string[] }) { ... }

  @Patch('batch/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async batchStatus(@Body() dto: { ids: string[]; status: string }) { ... }
}
```

#### 1.2 Inquiry批量操作端点不存在
**问题**：Admin前端调用 `DELETE /admin/inquiries/batch` 和 `PATCH /admin/inquiries/batch/status`，但后端无对应端点。

**修复方案**：在 Phase 1.1 中一并实现。

---

### Phase 2: P1 Admin后台功能缺失（5个）

#### 2.1 DemandList添加查看/编辑按钮
**文件**：`apps/admin/src/pages/DemandList.tsx`
**修改**：操作列添加"查看"和"编辑"按钮
```typescript
// 在 columns 的 actions 列中添加
<Button type="link" onClick={() => navigate(`/demands/${record.id}`)}>查看</Button>
<Button type="link" onClick={() => navigate(`/demands/${record.id}/edit`)}>编辑</Button>
```

#### 2.2 RfqList添加编辑按钮
**文件**：`apps/admin/src/pages/RfqList.tsx`
**修改**：操作列添加"编辑"按钮

#### 2.3 OfferList添加编辑按钮
**文件**：`apps/admin/src/pages/OfferList.tsx`
**修改**：操作列添加"编辑"按钮

#### 2.4 InquiryList添加编辑按钮
**文件**：`apps/admin/src/pages/InquiryList.tsx`
**修改**：操作列添加"编辑"按钮

#### 2.5 UserList状态列中文显示
**文件**：`apps/admin/src/pages/UserList.tsx`
**修改**：状态列使用 `STATUS_LABEL_MAP` 映射中文显示
```typescript
const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  SUSPENDED: '已停用',
};
// render 中: STATUS_LABEL_MAP[status] || status
```

---

### Phase 3: P1 Web前台功能缺失（4个）

#### 3.1 Web需求详情页添加编辑/删除/发布按钮
**文件**：`apps/web/src/components/demand/DemandDetail.tsx`
**修改**：添加操作按钮区域
- 编辑按钮：跳转编辑页
- 删除按钮：调API删除
- 发布按钮：调API publish
- 关闭按钮：调API close

#### 3.2 Web RFQ详情页添加编辑/删除/发布按钮
**文件**：`apps/web/src/components/rfq/RFQDetail.tsx`
**修改**：添加操作按钮区域

#### 3.3 Web列表页添加搜索/分页
**文件**：多个 workspace 页面
**修改**：添加搜索框和分页控件

#### 3.4 Web需求/RFQ列表添加创建按钮
**文件**：`apps/web/src/app/workspace/demands/page.tsx`、`apps/web/src/app/workspace/rfqs/page.tsx`
**修改**：添加"创建需求"和"创建RFQ"按钮

---

### Phase 4: P2中优先级优化（6个）

#### 4.1 分类/参数组/参数定义添加批量状态变更
**文件**：
- `apps/admin/src/pages/category/ProductCategoryList.tsx`
- `apps/admin/src/pages/parameter/ParameterGroupList.tsx`
- `apps/admin/src/pages/parameter/ParameterDefinitionList.tsx`
**修改**：BatchOperations 添加 `onBatchStatus` 和 `statusOptions`

#### 4.2 NotificationList添加搜索功能
**文件**：`apps/admin/src/pages/NotificationList.tsx`
**修改**：添加 `Input.Search` 搜索框

#### 4.3 NotificationList添加批量状态变更（标记已读）
**文件**：`apps/admin/src/pages/NotificationList.tsx`
**修改**：添加 `handleBatchStatus` → `notificationService.markAllRead()`

#### 4.4 FileAssetOrphanList添加搜索/筛选
**文件**：`apps/admin/src/pages/FileAssetOrphanList.tsx`
**修改**：添加文件类型筛选和文件名搜索

#### 4.5 Web设置页添加编辑个人资料功能
**文件**：`apps/web/src/app/workspace/settings/page.tsx`
**修改**：添加编辑姓名、密码等字段

#### 4.6 批量删除路径统一
**说明**：仅梳理记录，不修改实际代码（涉及后端API路径变更风险较高）

---

### Phase 5: P3低优先级优化（3个）

#### 5.1 分类/参数组/参数定义添加status字段
**文件**：`database/prisma/schema.prisma`
**说明**：需要数据库迁移，建议在下一版本规划中考虑

#### 5.2 API方法名统一
**文件**：`apps/admin/src/api/category.service.ts`、`parameter-group.service.ts`、`parameter-definition.service.ts`
**说明**：将 `list()` 改为 `getList()` 保持一致性

#### 5.3 Web产品页添加询价入口
**说明**：需要前后端配合，风险较高，建议在下一版本规划中考虑

---

## 三、修改文件清单

### 后端 API（apps/api）
| 文件 | 修改内容 | 风险 |
|------|---------|------|
| `apps/api/src/inquiries/inquiries.controller.ts` | 新增 AdminInquiriesController | 中 |
| `apps/api/src/inquiries/inquiries.service.ts` | 新增 Admin 查询方法 | 低 |

### Admin 后台（apps/admin）
| 文件 | 修改内容 | 风险 |
|------|---------|------|
| `apps/admin/src/pages/DemandList.tsx` | 添加查看/编辑按钮 | 低 |
| `apps/admin/src/pages/RfqList.tsx` | 添加编辑按钮 | 低 |
| `apps/admin/src/pages/OfferList.tsx` | 添加编辑按钮 | 低 |
| `apps/admin/src/pages/InquiryList.tsx` | 添加编辑按钮 | 低 |
| `apps/admin/src/pages/UserList.tsx` | 状态列中文显示 | 低 |
| `apps/admin/src/pages/category/ProductCategoryList.tsx` | 添加批量状态变更 | 低 |
| `apps/admin/src/pages/parameter/ParameterGroupList.tsx` | 添加批量状态变更 | 低 |
| `apps/admin/src/pages/parameter/ParameterDefinitionList.tsx` | 添加批量状态变更 | 低 |
| `apps/admin/src/pages/NotificationList.tsx` | 添加搜索/批量状态 | 低 |
| `apps/admin/src/pages/FileAssetOrphanList.tsx` | 添加搜索/筛选 | 低 |
| `apps/admin/src/api/category.service.ts` | list→getList 方法名统一 | 低 |
| `apps/admin/src/api/parameter-group.service.ts` | list→getList 方法名统一 | 低 |
| `apps/admin/src/api/parameter-definition.service.ts` | list→getList 方法名统一 | 低 |

### Web 前台（apps/web）
| 文件 | 修改内容 | 风险 |
|------|---------|------|
| `apps/web/src/components/demand/DemandDetail.tsx` | 添加编辑/删除/发布/关闭按钮 | 中 |
| `apps/web/src/components/rfq/RFQDetail.tsx` | 添加编辑/删除/发布/关闭按钮 | 中 |
| `apps/web/src/app/workspace/demands/page.tsx` | 添加创建按钮/搜索/分页 | 低 |
| `apps/web/src/app/workspace/rfqs/page.tsx` | 添加创建按钮/搜索/分页 | 低 |
| `apps/web/src/app/workspace/matches/page.tsx` | 添加搜索/分页 | 低 |
| `apps/web/src/app/workspace/settings/page.tsx` | 添加编辑个人资料功能 | 低 |

---

## 四、执行顺序

```
Phase 1 (P0) → Phase 2 (P1 Admin) → Phase 3 (P1 Web) → Phase 4 (P2) → Phase 5 (P3) → Phase 6 (Build)
```

每个Phase完成后需执行 `pnpm build` 验证编译通过。

---

## 五、风险说明

| 风险 | 说明 | 应对措施 |
|------|------|---------|
| 新增 AdminInquiriesController 与现有 InquiriesController 路由冲突 | 使用不同 Controller 名称和路径前缀 | 确保路径完全隔离 |
| Web 前台组件修改涉及 API 调用 | 需要确认 API 端点是否存在 | 修改前检查后端 API |
| 数据库 schema 修改需要迁移 | 涉及 Prisma migrate | 建议暂缓，先修复其他问题 |