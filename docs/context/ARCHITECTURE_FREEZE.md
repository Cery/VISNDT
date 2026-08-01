# ARCHITECTURE FREEZE

**Last Updated:** 2026-08-01  
**Phase:** M13.2.9

---

## 1. Freeze Categories

### 🔴 RED — Absolute Freeze (Cannot Modify Under Any Circumstances)

These areas are locked. Any modification requires a formal freeze review and explicit approval.

| Area | Files | Rationale |
|---|---|---|
| **Prisma Schema** | `database/prisma/schema.prisma` | All models, fields, relations, enums, indexes, and mappings are frozen. Modifying the schema requires a migration, which is prohibited. |
| **Migrations** | `database/prisma/migrations/` | No new migrations. No modification of existing migrations. |
| **FileAsset Data Model** | Schema FileAsset model | Fields `entityType`, `entityId`, `storageKey`, `fileType`, `fileName`, `mimeType`, `fileSize`, `uploadedBy` are frozen. |
| **Auth System** | `apps/api/src/auth/jwt.strategy.ts` | JWT payload structure, strategy implementation, and token validation logic are frozen. |
| **Auth Guards** | `apps/api/src/auth/jwt-auth.guard.ts`, `guards/roles.guard.ts` | Guard logic, role hierarchy, and decorator signatures are frozen. |
| **Admin Layout** | `apps/admin/src/layouts/AdminLayout.tsx` | Layout shell, menu structure, sidebar/hamburger behavior are frozen. |
| **Admin Router Shell** | `apps/admin/src/router/index.tsx` | Router configuration structure (BrowserRouter, RequireAuth wrapper, layout nesting) is frozen. |
| **Admin Auth** | `apps/admin/src/auth/` | Auth context, guards, token storage, and axios interceptor are frozen. |
| **Admin Store** | `apps/admin/src/store/` | Zustand store structure and selectors are frozen. |
| **Admin API Client** | `apps/admin/src/api/client.ts` | Axios instance, interceptors, base URL configuration are frozen. |
| **Storage Module** | `apps/api/src/storage/storage.service.ts` | S3 interface (`upload()`, `deleteObject()`, `getSignedUrl()`) is frozen. |
| **Prisma Module** | `apps/api/src/prisma/prisma.module.ts` | Global module configuration is frozen. |

### 🟡 YELLOW — Conditional Freeze (Audit Required)

These areas can be modified but require a careful audit of downstream impact. Existing functionality must be preserved.

| Area | Files | Conditions |
|---|---|---|
| **Existing API Controllers** | `apps/api/src/*/` `*.controller.ts` | Cannot remove existing endpoints. Cannot change existing route paths. Cannot change existing response formats. New endpoints allowed only within the same file. |
| **Existing API DTOs** | `apps/api/src/*/dto/` | Cannot remove existing fields. Cannot change validation rules. New DTOs allowed. |
| **Backend Service Signatures** | `apps/api/src/*/` `*.service.ts` | Cannot change existing method signatures. New methods allowed. New service dependencies allowed (must be imported in module). |
| **ProductMedia Module** | `apps/api/src/product-media/` | Cannot change controller. Cannot change DTOs. Service methods can be enhanced. |
| **FileAsset Module** | `apps/api/src/file-asset/` | Cannot change existing endpoints. New endpoints allowed. Service methods can be added. |

### 🟢 GREEN — Allowed Modifications

These areas can be modified freely within the current freeze rules.

| Area | Scope |
|---|---|
| **Admin New Pages** | `apps/admin/src/pages/` — New React components |
| **Admin New API Services** | `apps/admin/src/api/` — New service modules |
| **Admin New Types** | `apps/admin/src/types/` — New type definition files |
| **Admin New Components** | `apps/admin/src/components/` — New shared components |
| **Admin New Routes** | New routes in `apps/admin/src/router/index.tsx` (within existing layout) |
| **Admin New Utils** | `apps/admin/src/utils/` — New utility functions |
| **Backend New Services** | New methods in existing services |
| **Backend New DTOs** | New DTO files in existing module dto/ directories |
| **Documentation** | `docs/_review/`, `docs/context/` — New markdown files |

---

## 2. Documentation Rules

| Rule | Description |
|---|---|
| **Report Naming** | `docs/_review/{number}_{Phase}_{Description}_Report.md` |
| **Report Location** | `F:/Desktop/VISNDT/docs/_review/` (NOT `F:/Desktop/VISNDT/VISNDT/docs/_review/`) |
| **Context Location** | `F:/Desktop/VISNDT/docs/context/` |
| **Report Must Include** | Repository Root Verification, Modified Files, Build Verification, Freeze Compliance, Final Status, Next Step Recommendation |

---

## 3. Convention Rules

| Rule | Description |
|---|---|
| **Business Terms** | Organization (not Supplier), Demand (not Requirement), RFQ (not Inquiry/Matching) |
| **PageState Pattern** | `{ status: 'loading' } \| { status: 'error'; error: string } \| { status: 'empty' } \| { status: 'success'; data: T }` |
| **No any/console.log/TODO/FIXME** | All new code must be type-safe with proper error handling |
| **API Call Pattern** | Admin pages call service methods ONLY; service methods call apiClient; NEVER call axios directly from pages |
| **Auth Pattern** | Admin pages inside `<RequireAuth>` wrapper; API calls use JWT Bearer token via interceptor |
| **API Response Format** | `ApiResponse.ok(data, message)` — unified response format |

---

## 4. Phase-Specific Freeze Overrides

### M13.2.9 (Current)
- **ALL code modifications PROHIBITED** — documentation only phase
- Only `docs/context/` and `docs/_review/` can be created/modified

### M13.2.7.5 (Proposed)
- Only `apps/api/src/product-media/product-media.service.ts` can be modified
- Refactor `remove()` to reuse `FileAssetService.delete()`

### M13.3 (Proposed)
- New endpoints allowed (with audit)
- New admin pages allowed (with audit)
- No Prisma schema changes
- No migration changes

---

*Generated by M13.2.9 Context Handoff System Design*