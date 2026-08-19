# 597_Product_Center_Current_State_Audit_Report

> 任务类型: Read-only Audit（只读审计，无代码/数据库/文档状态变更）
> 对象: VISNDT Product Center（非 Search Result Page）
> 目的: 为 M24.1.8 后续 / M25 Product Center Experience 提供真实 Repository Baseline
> 日期: 2026-08-19

---

## 1. Repository Verification

- Repository Root: `F:\Desktop\VISNDT` — verified
- Code Root: `F:\Desktop\VISNDT\VISNDT` — verified
- Branch: `main`
- Current Commit: `c54ef89`（M23 终止）
- 关键目录均存在: `apps/web` / `apps/api` / `apps/admin` / `database/prisma` / `docs/project-management` / `docs/_review`

约束遵守: 本次审计未修改任何代码 / 数据库 / 文档状态 / 未新增文件（除本审计报告本身）。

## 2. Current Product Center Architecture

Product Center 当前是一个**客户端渲染的目录 + 筛选页**，与 Search 页面共享大量筛选能力。整体结构：

```
/products (ProductsPageContent, 'use client')
├── SearchBar            关键词搜索（客户端）
├── <aside>              侧边栏
│   └── ProductFilter
│       ├── Category（平铺分类导航）
│       ├── ParameterFilterPanel（动态参数筛选）
│       └── Sort（排序下拉）
├── 主内容区
│   ├── Active Filter Chips（已筛选标签）
│   ├── ProductGrid（产品网格 / 骨架 / 空态）
│   └── Pagination（分页）
└── CompareBar（底部浮动比较栏）
```

数据获取方式: React Query（TanStack `useQuery`）客户端拉取，非服务端渲染（SSR）。

## 3. Route Analysis

| 项 | 值 |
| --- | --- |
| Route | `/products` |
| 入口组件 | `apps/web/src/app/products/page.tsx` → `ProductsPageContent` |
| Page Type | Client Component（`'use client'`），外层 `Suspense` 包裹（因使用 `useSearchParams`） |
| Layout | `apps/web/src/app/products/layout.tsx`（仅 Metadata，无结构布局） |
| 子路由 | `/products/[slug]`（产品详情）、`/products/compare`（比较） |
| Navigation Entry | `PublicHeader` / `PublicFooter` 的「产品中心」链接 `href=/products`；首页 Hero/Featured、Search 空态、供应商详情页均链向 `/products` |
| Data Source | 见 §5 |

## 4. Component Analysis

| 组件 | 路径 | 职责 |
| --- | --- | --- |
| ProductsPageContent | `app/products/page.tsx` | 页面容器、状态管理、URL 同步 |
| SearchBar | `components/products/SearchBar.tsx` | 关键词提交 + 清除 |
| ProductFilter | `components/products/ProductFilter.tsx` | 侧边栏：分类 + 参数 + 排序 |
| ParameterFilterPanel | `components/products/ParameterFilterPanel.tsx` | 动态参数筛选（Number/ENUM/Boolean/Text） |
| ProductGrid | `components/products/ProductGrid.tsx` | 网格渲染 + 骨架屏 + 空态 |
| ProductCard | `components/products/ProductCard.tsx` | 单产品卡片 + 比较复选框 + 供应商入口 |
| CompareBar | `components/products/CompareBar.tsx` | 底部浮动比较栏（≥2 可对比） |
| HighlightText | `components/products/HighlightText.tsx` | 关键词高亮（前端） |
| Pagination / ErrorState / EmptyState | `components/common/…` | 通用分页 / 错误 / 空态 |

## 5. Data Flow

三个独立数据源，均在客户端并行请求：

| 用途 | 前端调用 | 后端端点 | 后端服务 |
| --- | --- | --- | --- |
| 产品列表 | `getProducts()` (`services/product.service.ts`) | `GET /products` | `products.service.findAll()` |
| 分类列表 | `getCategories(1,100)` (`services/category.service.ts`) | `GET /product-categories` | `product-categories.service.findAll()` |
| 参数定义 | `getFilterParameterDefinitions()` (`services/parameter-definition.service.ts`) | `GET /parameter-definitions` + 逐条 `GET /parameter-definitions/:id`（合并 ENUM options） | `parameter-definitions.*` |

产品列表查询参数（`GET /products`）: `keyword` / `categoryId` / `status`（固定传 `ACTIVE`）/ `parameterFilters`（exact `value` 或 numeric `valueMin`/`valueMax`，二者互斥）/ `sortBy` / `sortOrder` / `page` / `pageSize=12`。

后端字段来源（`findAll` 的 `include`）: `category`、`createdBy.organization`。**注意列表接口不 include `media` 与 `parameterValues`**，因此列表页天生无法渲染真实图片与参数摘要。

## 6. Sidebar Analysis

侧边栏 = `ProductFilter`，包含三块：

```text
Current Sidebar:
  Classification:      YES（平铺单层，非树形）
  Parameter Filter:    YES（动态，全站参数定义）
  Search Facet:        NO（无 facet，是普通参数筛选面板，非分类相关 facet）
  Sort:                YES（最新/最早/名称 A-Z/Z-A/最近更新）
```

分类导航现状：

```text
Category Tree（UI 实际渲染，平铺）:
全部分类
A
B
C
...
（无二级展开、无树形层级）
```

关键点：数据模型 `ProductCategory` **已具备** `parentId` + `children` 自关联（schema 树形支持），但 UI `ProductFilter` 使用 `categories.map()` **平铺渲染**，未使用 `children`，未实现树形 / 二级分类展开。

## 7. Product Card Analysis

`ProductCard` 当前渲染字段：

| 字段 | 渲染 | 说明 |
| --- | --- | --- |
| Product Name | ✅ | `HighlightText` 关键词高亮 |
| Model | ✅ | 非空才显示，`型号：{model}` |
| 图片 | ❌ | 占位图（"暂无图片"），未渲染 `ProductMedia` 真实图片 |
| Description | ✅ | `line-clamp-2` |
| Category | ✅ | badge + `translateCategoryName` 前端硬编码翻译 |
| 参数摘要 | ❌ | 列表接口不返回 `parameterValues`，卡片不展示参数摘要 |
| 供应商能力入口 | ✅ | 底部链接 `…/#suppliers` |
| 比较复选框 | ✅ | `isCompared` / `onCompareToggle`（右上角） |

进入详情: `Link href=/products/${product.id}`。

## 8. Product Center vs Search Boundary

| Capability | Product Center（/products） | Search（/search） |
| --- | --- | --- |
| Category | 平铺单选分类筛选 | 分类 tab + 分类相关 facet（多分类，上下文驱动） |
| Parameter Filter | 动态参数筛选（全站参数定义；Number 范围 / ENUM / Boolean / Text） | 分类相关 facet（基于 Search Context 的相关参数） |
| Keyword Query | `SearchBar` → `GET /products?keyword` | `GlobalSearchBar` → `GET /search?q` |
| Content Domain | 仅产品（Product） | 多域（product / knowledge / solution / supplier） |
| Pagination | 数字分页（`Pagination`） | 「加载更多」无限滚动 |
| Facet | 无（普通参数筛选面板） | 有（`ParameterFacet`，Search Context） |
| Product Card | `ProductCard`（比较 + 供应商入口，无图片/参数摘要） | `ProductResultCard`（显示 status，无比较/供应商入口/图片） |
| 后端 API | `GET /products` | `GET /search`（unified search） |

**边界结论**: 两者在「分类 + 参数 + 关键词」能力上存在重叠，但定位应有别——Product Center 是「目录浏览 / 分类导航」，Search 是「关键词 + facet 能力发现」。当前 `/products` 页面实际已具备完整搜索+筛选形态，边界模糊。

## 9. Existing Issues

1. **分类 UI 平铺**：schema 已支持树形（`parentId`/`children`），UI 未实现二级分类展开，Catalog Navigation 能力弱。
2. **无真实图片**：`ProductMedia.fileAssetId` 已建模且有详情接口，但 `ProductCard` 与列表接口（不 include `media`）均未渲染真实图片。
3. **无参数摘要**：列表接口不返回 `parameterValues`，卡片不展示参数概要，削弱「能力发现」体验。
4. **Product Center 与 Search 能力重叠**：`/products` 与 `/search` 均具备关键词+分类+参数筛选，边界需明确（拆分 / 分流）。
5. **参数筛选无分类上下文**：`ParameterFilterPanel` 使用全站 `getFilterParameterDefinitions()`，不区分分类，与 Search 的「分类相关参数」体系、以及 594/595 的 Knowledge Mapping 分类上下文不一致。
6. **分类名前端硬编码翻译**：`translateCategoryName` 在前端映射翻译，非后端字段或 i18n 体系，维护性弱。

## 10. Future Optimization Candidates

（对应 M24.1.8 后续 / M25 Product Center Experience，均为候选，非本次实施）

1. 树形分类导航（复用 `parentId`/`children`，二级展开 / 面包屑）。
2. `ProductCard` 真实图片渲染（`ProductMedia` + `fileAssetId`，列表接口补充 media 或独立缩略图）。
3. `ProductCard` 参数摘要展示（列表接口补充核心参数）。
4. 厘清 Product Center 与 Search 的能力边界（去重 / 分流，避免双份筛选入口）。
5. 参数筛选分类上下文化（与 Search Context / 分类相关参数对齐）。
6. 分类名本地化（后端返回中文或统一 i18n，替代前端硬编码翻译）。

---

## 最终执行输出

```text
Task:                 Product Center Current State Audit
Status:               COMPLETED
Repository:           verified（main @ c54ef89）
Code:                 UNCHANGED
Database:             UNCHANGED
API:                  UNCHANGED
Web:                  UNCHANGED

Product Center Route: /products（app/products/page.tsx → ProductsPageContent）
Main Components:      SearchBar + ProductFilter + ParameterFilterPanel + ProductGrid + ProductCard + CompareBar
Data Source:          GET /products + GET /product-categories + GET /parameter-definitions（(+ detail for ENUM)）
Sidebar:              Classification YES（平铺）/ Parameter Filter YES / Search Facet NO / Sort YES
Search Boundary:      verified（与 Search 存在分类+参数+关键词能力重叠）

Review Report:        docs/_review/597_Product_Center_Current_State_Audit_Report.md
```

Audit First → Understand Current State → No Assumption → No Code Change → No Scope Expansion。