# FRONTEND CONTEXT

**Last Updated:** 2026-08-01  
**Phase:** M13.2.9

---

## 1. Admin Frontend (Active)

### 1.1 Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.0 | UI library |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| Ant Design | 5.29 | UI component library |
| React Router | 7.18 | Client-side routing |
| Axios | 1.18 | HTTP client |
| Zustand | 5.0 | State management |
| @ant-design/icons | 6.3 | Icon library |

### 1.2 Directory Structure

```
apps/admin/src/
├── api/                     # API service modules (19 files)
│   ├── client.ts            # Axios instance + JWT interceptor
│   ├── index.ts             # Re-exports all services
│   ├── auth.service.ts
│   ├── categories.service.ts
│   ├── category.service.ts
│   ├── dashboard.service.ts
│   ├── demand.service.ts
│   ├── file-asset.service.ts
│   ├── match.service.ts
│   ├── notification.service.ts
│   ├── offer.service.ts
│   ├── organization.service.ts
│   ├── parameter-definition.service.ts
│   ├── parameter-group.service.ts
│   ├── product-media.service.ts
│   ├── product.service.ts
│   ├── rfq-response.service.ts
│   ├── rfq.service.ts
│   ├── supplier.service.ts
│   └── user.service.ts
│
├── auth/                    # Auth context & guards
│   ├── RequireAuth.tsx      # Route guard component
│   └── ...
│
├── components/              # Shared components
│   ├── organization/
│   │   └── OrganizationForm.tsx
│   ├── product/
│   │   └── ProductForm.tsx
│   └── user/
│       └── UserForm.tsx
│
├── layouts/
│   └── AdminLayout.tsx      # Main layout (header, sidebar, content)
│
├── pages/                   # 40+ page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Placeholder.tsx
│   ├── product-media/       # ProductMedia management
│   │   ├── ProductMediaList.tsx
│   │   ├── ProductMediaCreate.tsx
│   │   └── ProductMediaEdit.tsx
│   ├── product/
│   │   ├── ProductList.tsx
│   │   ├── ProductCreate.tsx
│   │   ├── ProductEdit.tsx
│   │   └── ProductDetail.tsx
│   ├── demand/
│   │   ├── DemandList.tsx
│   │   └── DemandDetail.tsx
│   ├── user/
│   │   ├── UserList.tsx
│   │   ├── UserCreate.tsx
│   │   ├── UserEdit.tsx
│   │   └── UserDetail.tsx
│   ├── organization/
│   │   ├── OrganizationList.tsx
│   │   ├── OrganizationCreate.tsx
│   │   ├── OrganizationEdit.tsx
│   │   └── OrganizationDetail.tsx
│   ├── category/
│   │   ├── ProductCategoryList.tsx
│   │   ├── ProductCategoryCreate.tsx
│   │   └── ProductCategoryEdit.tsx
│   ├── parameter/
│   │   ├── ParameterGroupList.tsx, Create, Edit
│   │   └── ParameterDefinitionList.tsx, Create, Edit
│   ├── offer/
│   │   ├── OfferList.tsx
│   │   └── OfferDetail.tsx
│   ├── supplier/
│   │   ├── SupplierList.tsx
│   │   └── SupplierDetail.tsx
│   ├── rfq/
│   │   ├── RfqList.tsx, Create, Detail
│   │   └── RfqResponseDetail.tsx
│   ├── notification/
│   │   ├── NotificationList.tsx
│   │   └── NotificationDetail.tsx
│   ├── MatchDetail.tsx
│   └── MatchingMonitor.tsx
│
├── providers/
│   └── AppProvider.tsx      # Root app provider
│
├── router/
│   └── index.tsx            # React Router configuration
│
├── store/                   # Zustand stores
│   └── ...
│
├── types/                   # TypeScript type definitions (~15 files)
│   ├── index.ts
│   ├── file-asset.types.ts
│   ├── product-media.types.ts
│   ├── product.types.ts
│   ├── user.types.ts
│   ├── organization.types.ts
│   ├── demand.types.ts
│   ├── match.types.ts
│   ├── offer.types.ts
│   ├── supplier.types.ts
│   ├── rfq.types.ts
│   ├── notification.types.ts
│   └── ...
│
└── utils/
    └── file-utils.tsx       # File type icons, file size formatting
```

### 1.3 Complete Route List (48 routes)

| Route | Page | Auth |
|---|---|---|
| `/login` | Login | Public |
| `/` | Redirect → /home | Auth |
| `/home` | Dashboard | Auth |
| `/products` | ProductList | Auth |
| `/products/create` | ProductCreate | Auth |
| `/products/:id` | ProductDetail | Auth |
| `/products/:id/edit` | ProductEdit | Auth |
| `/products/:productId/media` | ProductMediaList | Auth |
| `/products/:productId/media/create` | ProductMediaCreate | Auth |
| `/products/:productId/media/:id/edit` | ProductMediaEdit | Auth |
| `/demands` | DemandList | Auth |
| `/demands/:id` | DemandDetail | Auth |
| `/demands/:demandId/matches/:matchId` | MatchDetail | Auth |
| `/matching` | MatchingMonitor | Auth |
| `/users` | UserList | Auth |
| `/users/create` | UserCreate | Auth |
| `/users/:id` | UserDetail | Auth |
| `/users/:id/edit` | UserEdit | Auth |
| `/organizations` | OrganizationList | Auth |
| `/organizations/create` | OrganizationCreate | Auth |
| `/organizations/:id` | OrganizationDetail | Auth |
| `/organizations/:id/edit` | OrganizationEdit | Auth |
| `/notifications` | NotificationList | Auth |
| `/notifications/:id` | NotificationDetail | Auth |
| `/rfqs` | RfqList | Auth |
| `/rfqs/create` | RfqCreate | Auth |
| `/rfqs/:id` | RfqDetail | Auth |
| `/rfq-responses/:id` | RfqResponseDetail | Auth |
| `/offers` | OfferList | Auth |
| `/offers/:id` | OfferDetail | Auth |
| `/suppliers` | SupplierList | Auth |
| `/suppliers/:id` | SupplierDetail | Auth |
| `/parameter-groups` | ParameterGroupList | Auth |
| `/parameter-groups/create` | ParameterGroupCreate | Auth |
| `/parameter-groups/:id/edit` | ParameterGroupEdit | Auth |
| `/parameter-definitions` | ParameterDefinitionList | Auth |
| `/parameter-definitions/create` | ParameterDefinitionCreate | Auth |
| `/parameter-definitions/:id/edit` | ParameterDefinitionEdit | Auth |
| `/product-categories` | ProductCategoryList | Auth |
| `/product-categories/create` | ProductCategoryCreate | Auth |
| `/product-categories/:id/edit` | ProductCategoryEdit | Auth |
| `*` | NotFound | Public |

### 1.4 Admin Menu Structure

```
Dashboard       → /home
Products        → /products
Demands         → /demands
RFQs            → /rfqs
Offers          → /offers
Matching        → /matching
Users           → /users
Organizations   → /organizations
Suppliers       → /suppliers
Parameters      → /parameter-groups
                   /parameter-definitions
                   /product-categories
Notifications   → /notifications
```

### 1.5 UI Conventions

| Rule | Description |
|---|---|
| **PageState Pattern** | All pages use `{ status: 'loading' } \| { status: 'error' } \| { status: 'empty' } \| { status: 'success' }` |
| **API Call Pattern** | Pages call service methods → service methods call apiClient → NEVER call axios directly |
| **No any/console.log/TODO/FIXME** | All code must be type-safe |
| **Ant Design** | All UI components from antd |
| **File Type Icons** | Use `getFileTypeIcon()` from `utils/file-utils.tsx` |
| **File Size** | Use `formatFileSize()` from `utils/file-utils.tsx` |
| **Image Preview** | Use `Image` from antd with `Image.PreviewGroup` for galleries |
| **Download** | Call `fileAssetService.getSignedUrl(id)` → `window.open(url, '_blank')` |

---

## 2. Web Frontend (Planned)

| Metric | Value |
|---|---|
| Status | ❌ Not started |
| Planned Stack | Next.js 14+ with App Router |
| Phase | M13.3+ |
| Purpose | Public-facing supplier portal, product browsing, demand submission |

---

*Generated by M13.2.9 Context Handoff System Design*