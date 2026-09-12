# 批次四：Admin 端设计系统落地 - 任务清单

## 工作目标
将统一的 PageHeader 组件应用到所有 45 个 Admin 页面，替代此前分散的页头实现。

## 进度统计（截至当前）

### 已完成（10/45）
以下页面已应用 PageHeader 组件：
- [x] AuditLogList.tsx（未提交）
- [x] NotificationList.tsx（未提交）
- [x] SupplierProductList.tsx（未提交）
- [x] UserList.tsx（未提交）
- [x] ProductList.tsx（已提交）
- [x] OrganizationList.tsx（已提交）
- [x] RfqList.tsx（已提交）
- [x] InquiryList.tsx（已提交）
- [x] OfferList.tsx（已提交）
- [x] DemandList.tsx（已提交）

### 待改造（35/45）
以下页面尚未应用 PageHeader：

#### 详情页（Detail）
- [ ] DemandDetail.tsx
- [ ] InquiryDetail.tsx
- [ ] MatchDetail.tsx
- [ ] NotificationDetail.tsx
- [ ] OfferDetail.tsx
- [ ] OrganizationDetail.tsx
- [ ] ProductDetail.tsx
- [ ] RfqDetail.tsx
- [ ] RfqResponseDetail.tsx
- [ ] SupplierProductDetail.tsx
- [ ] UserDetail.tsx

#### 编辑页（Edit/Create）
- [ ] DemandEdit.tsx
- [ ] OrganizationCreate.tsx
- [ ] OrganizationEdit.tsx
- [ ] ProductCategoryKnowledgeMappingCreate.tsx
- [ ] ProductCategoryKnowledgeMappingEdit.tsx
- [ ] ProductCategoryKnowledgeMappingList.tsx
- [ ] ProductCreate.tsx
- [ ] ProductEdit.tsx
- [ ] RfqCreate.tsx
- [ ] SupplierProductCreate.tsx
- [ ] UserCreate.tsx
- [ ] UserEdit.tsx

#### 功能页（Analytics/Monitoring）
- [ ] Analytics.tsx
- [ ] AuditIntelligence.tsx
- [ ] BusinessAnalytics.tsx
- [ ] EmbeddingManagement.tsx
- [ ] FileAssetOrphanList.tsx
- [ ] MatchingMonitor.tsx
- [ ] MediaList.tsx
- [ ] Monitoring.tsx
- [ ] OperationCenter.tsx

#### 特殊页面（无需改造）
- [N/A] FoundationShowcase.tsx（设计系统验证页，不放入正式导航）
- [N/A] Login.tsx（登录页，无页头）
- [N/A] NotFound.tsx（404页，无页头）

## 下一步行动

### 立即行动：提交未提交的改动
```bash
cd /f/Desktop/VISNDT/VISNDT
git add apps/admin/src/pages/AuditLogList.tsx
git add apps/admin/src/pages/NotificationList.tsx
git add apps/admin/src/pages/SupplierProductList.tsx
git add apps/admin/src/pages/UserList.tsx
git commit -m "批次四（续）：完成 AuditLog/Notification/SupplierProduct/User 页面 PageHeader 应用"
```

### 建议分批策略
**批次 4-1**（优先级高 - 列表页剩余）：
- ProductCategoryKnowledgeMappingList.tsx
- MediaList.tsx
- FileAssetOrphanList.tsx

**批次 4-2**（详情页）：
11 个 Detail 页面

**批次 4-3**（编辑页）：
10 个 Create/Edit 页面

**批次 4-4**（分析/监控页）：
- Analytics.tsx
- AuditIntelligence.tsx
- BusinessAnalytics.tsx
- MatchingMonitor.tsx
- Monitoring.tsx
- OperationCenter.tsx
- EmbeddingManagement.tsx

## PageHeader 组件使用规范

位置：`apps/admin/src/components/common/PageHeader.tsx`

基本用法：
```tsx
import { PageHeader } from '../components/common';

<PageHeader
  title="页面标题"
  subtitle="可选：说明文字"
  extra={<Button type="primary">操作按钮</Button>}
  accentColor={VISNDT_COLORS.warning} // 可选，默认琥珀色
/>
```

设计特征：
- 4px 垂直色块（左侧视觉锚点）
- 标题 + 副标题
- 右侧操作区域
- 底部边框分隔

## 注意事项
1. 不要改动 FoundationShowcase/Login/NotFound 这 3 个特殊页面
2. 每批改造后运行 `pnpm --filter @visndt/admin build` 验证编译通过
3. 保持现有业务逻辑不变，只替换页头部分
4. 统一使用 `VISNDT_COLORS` 色值常量（从 `../components/design-system/tokens` 导入）
