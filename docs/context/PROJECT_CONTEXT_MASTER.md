# VISNDT Project Context Master

**Last Updated:** 2026-08-01  
**Current Phase:** M13.3.3 — M13.3 Closeout Audit  
**Recent Phase:** M13.3 — FileAsset Lifecycle Enhancement ✅ COMPLETE  
**Status:** 🟢 Active Development

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | VISNDT |
| **Repository Root** | `F:/Desktop/VISNDT` |
| **Working Directory** | `F:/Desktop/VISNDT/VISNDT` |
| **Project Type** | B2B SaaS — Supplier-Network Digital Transformation Platform |
| **Repository** | pnpm Monorepo |

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend** | NestJS + TypeScript | NestJS 11, Node ≥20 |
| **Frontend (Admin)** | React 19 + TypeScript + Vite | Ant Design 5, React Router 7 |
| **Frontend (Web)** | Next.js (planned) | Not started |
| **Database** | PostgreSQL + Prisma | Prisma 7.8 |
| **Storage** | S3 Compatible (MinIO/LocalStack) | @aws-sdk/client-s3 |
| **Auth** | JWT + Passport | @nestjs/jwt, @nestjs/passport |
| **Package Manager** | pnpm | ≥9.0.0 |
| **Monorepo** | pnpm Workspace | — |

---

## 3. Current System Architecture

### 3.1 Module Structure

```
F:/Desktop/VISNDT/VISNDT/
├── apps/
│   ├── api/              # NestJS Backend
│   │   └── src/
│   │       ├── auth/           # JWT Auth, Guards, Roles
│   │       ├── users/          # User CRUD (ADMIN + ORG_ADMIN)
│   │       ├── organizations/  # Organization CRUD (ADMIN)
│   │       ├── organization-members/  # Membership management
│   │       ├── products/       # Product CRUD (Global Catalog)
│   │       ├── product-categories/  # Category tree
│   │       ├── product-media/  # Product images & documents
│   │       ├── product-parameters/  # Product-parameter mapping
│   │       ├── parameter-groups/    # Parameter grouping
│   │       ├── parameter-definitions/  # Parameter definitions
│   │       ├── offers/         # Offers (Organization-scoped)
│   │       ├── demands/        # Demand + Matching
│   │       ├── rfqs/           # RFQ + RFQ Responses
│   │       ├── rfq-responses/  # RFQ Response management
│   │       ├── suppliers/      # Supplier profiles
│   │       ├── notifications/  # Notification system
│   │       ├── workflow-events/  # Workflow audit trail
│   │       ├── matching/       # Matching engine (internal)
│   │       ├── file-asset/     # File upload, download, orphans
│   │       ├── storage/        # S3/MinIO abstraction (@Global)
│   │       ├── admin/          # Admin dashboard stats
│   │       ├── health/         # Health check
│   │       └── prisma/         # Database service (@Global)
│   │
│   └── admin/            # React Admin Frontend
│       └── src/
│           ├── pages/          # 40+ pages
│           ├── api/            # 19 API service modules
│           ├── auth/           # Auth context, guards
│           ├── components/     # Shared components
│           ├── layouts/        # AdminLayout
│           ├── providers/      # AppProvider
│           ├── router/         # React Router config
│           ├── store/          # Zustand stores
│           ├── types/          # TypeScript type definitions
│           └── utils/          # Utility functions
│
├── database/
│   └── prisma/
│       ├── schema.prisma       # Single schema file
│       └── migrations/         # All migrations
│
├── packages/
│   └── shared-types/          # Shared TypeScript types
│
└── docs/
    ├── _review/               # ~130+ review reports
    └── context/               # Context handoff documents ← THIS DIRECTORY
```

### 3.2 Backend Status

| Metric | Value |
|---|---|
| NestJS Modules | 24 |
| Controllers | ~20 |
| Services | ~24 |
| Prisma Models | 24 |
| API Endpoints | ~80+ |
| Auth System | JWT + RBAC (ADMIN, ORG_ADMIN, MEMBER, USER) |
| Rate Limiting | @nestjs/throttler (100 req/min global, per-endpoint overrides) |
| File Storage | S3/MinIO via @aws-sdk |

### 3.3 Admin Status

| Metric | Value |
|---|---|
| React Pages | 40+ |
| Routes | ~50 |
| API Service Modules | 19 |
| Type Files | ~15 |
| UI Framework | Ant Design 5 |
| State Management | Zustand |
| Auth | JWT stored in localStorage, Axios interceptor |

### 3.4 Web Frontend Status

| Metric | Value |
|---|---|
| Status | ❌ Not started |
| Planned | Next.js 14+ with App Router |
| Phase | M13.3+ |

---

## 4. Completed Phase List

### M1-M8: Foundation

| Phase | Description | Status |
|---|---|---|
| M1-M5 | MVP Definition, Blueprint, Database Design | ✅ |
| M6-M7 | Database Migration, Auth System | ✅ |
| M8 | M8 API Freeze, Matching Engine | ✅ |

### M9: Admin System V1

| Phase | Description | Status |
|---|---|---|
| M9.0 | Admin Foundation (Layout, Router, Auth, Store, API Client) | ✅ |
| M9.1 | Auth System (Login, Guards, Persistence) | ✅ |
| M9.2 | Dashboard (API + Statistics Page) | ✅ |
| M9.3 | Product Management (CRUD, Detail, Form) | ✅ |
| M9.4 | Demand Management (List, Detail) | ✅ |
| M9.5 | System Audit, Baseline Freeze | ✅ |

### M10: Admin Extension

| Phase | Description | Status |
|---|---|---|
| M10.1 | User & Organization Management (CRUD, Detail) | ✅ |
| M10.2 | Notification Center Architecture Review | ✅ |

### M11: Business Features

| Phase | Description | Status |
|---|---|---|
| M11.1 | Match Review Center, Offer & Supplier Management | ✅ |
| M11.2 | RFQ Management | ✅ |

### M13.2: ProductMedia + FileAsset (Current)

| Phase | Description | Status |
|---|---|---|
| M13.2.5.3 | ProductMedia Upload Integration | ✅ |
| M13.2.5.4 | ProductMedia Display Enhancement | ✅ |
| M13.2.6 | E2E Verification | ✅ |
| M13.2.7.1 | Delete Lifecycle Audit | ✅ |
| M13.2.7.2 | Delete Lifecycle Fix | ✅ |
| M13.2.7.3 | Create Lifecycle Fix | ✅ |
| M13.2.7.4 | Orphan Detection & Cleanup | ✅ |
| M13.2.8 | Phase Closeout Audit | ✅ |
| M13.2.9 | Context Handoff System Design | ✅ |

### M13.3: FileAsset Lifecycle Enhancement

| Phase | Description | Status |
|---|---|---|
| M13.3.0 | Planning & Architecture Review | ✅ |
| M13.3.1 | Atomic Upload-Create | ✅ |
| M13.3.2 | Admin Orphan Management UI | ✅ |
| M13.3.3 | Phase Closeout Audit | 🟢 In Progress |

---

## 5. Current Freeze Rules

### 5.1 Absolute Freeze (Cannot Modify)

| Area | Scope |
|---|---|
| **Prisma Schema** | No modifications to any model, field, relation, enum, or index |
| **Migrations** | No new migrations, no modification of existing migrations |
| **FileAsset Data Model** | No changes to `FileAsset` model fields |
| **Admin Layout** | AdminLayout.tsx, menu structure, routing shell |
| **Auth System** | JWT strategy, guards, token payload structure |
| **Storage Module** | StorageService interface |

### 5.2 Conditional Freeze (Audit Required)

| Area | Scope |
|---|---|
| **API Endpoints** | New endpoints allowed with audit; existing endpoints cannot be removed |
| **Backend Modules** | New services/methods allowed; existing signatures preserved |
| **Admin Frontend** | New pages allowed; existing pages preserved |

### 5.3 Allowed Modifications

| Area | Scope |
|---|---|
| **Admin Pages** | New pages, components, UI enhancements |
| **Admin API Services** | New service methods, new service files |
| **Admin Types** | New type files, new interfaces |
| **Backend Services** | New methods, refactoring (within module) |
| **Documentation** | docs/_review/, docs/context/ |

---

## 6. Current Technical Debt

| # | Issue | Severity | Module | Phase |
|---|---|---|---|---|
| TD-2 | `GET /files/:id/download` is public | MEDIUM | FileAsset | M13.4+ |
| TD-3 | `remove()` duplicates `FileAssetService.delete()` | LOW | ProductMedia | M13.2.7.5 |
| TD-4 | `entityType` hardcoded to `'PRODUCT'` | LOW | FileAsset | M14+ |
| TD-6 | No FileAsset pagination | LOW | FileAsset | M14+ |

### Resolved in M13.3

| # | Issue | Resolution |
|---|---|---|
| TD-1 | Frontend abandonment orphans | Atomic upload-create (M13.3.1) |
| TD-5 | No admin UI for orphan management | `/files/orphans` page (M13.3.2) |

---

## 7. Next Phase Roadmap

### Immediate (M13.3.3)
- [x] Closeout audit
- [x] Update context docs

### After Review
- M13.2.7.5: Refactor `ProductMediaService.remove()` (optional, low priority)
- M13.4: Web Frontend (Next.js supplier portal) — requires separate planning phase

### Near Term (M13.4)
- Web Frontend planning + initial setup
- Download auth (JWT protection for download endpoint)

### Future (M14+)
- Business Closed Loop (Organization → Product → Offer → Demand → RFQ → Response)
- Matching Enhancement
- Dynamic entityType
- AuditLog System
- Notification Enhancement

---

## 8. Key Documents

| Document | Path | Purpose |
|---|---|---|
| **Context Master** | `docs/context/PROJECT_CONTEXT_MASTER.md` | This file — highest-level project overview |
| **Current Status** | `docs/context/CURRENT_STATUS.md` | Current phase, recent changes, build status |
| **Architecture Freeze** | `docs/context/ARCHITECTURE_FREEZE.md` | Detailed freeze rules and constraints |
| **Database Context** | `docs/context/DATABASE_CONTEXT.md` | Prisma models, relations, migration status |
| **API Context** | `docs/context/API_CONTEXT.md` | API endpoints, modules, auth patterns |
| **Frontend Context** | `docs/context/FRONTEND_CONTEXT.md` | Admin UI, Web frontend, router, components |
| **Roadmap** | `docs/context/ROADMAP_CONTEXT.md` | Historical, current, and future phase planning |
| **Handoff Template** | `docs/context/HANDOFF_TEMPLATE.md` | Template for future phase handoff documents |
| **Review Reports** | `docs/_review/` | All phase completion reports (130+) |
| **Project Memory** | `c:\Users\ws_tj\.trae-cn\memory\projects\-f-Desktop-VISNDT\project_memory.md` | AI agent memory for project rules |

---

## 9. Quick Start (New Chat Session)

When starting a new chat session, read these files in order:

1. `docs/context/PROJECT_CONTEXT_MASTER.md` ← THIS FILE
2. `docs/context/CURRENT_STATUS.md` ← Current phase and recent changes
3. `docs/context/ARCHITECTURE_FREEZE.md` ← What you CAN and CANNOT modify
4. Review the relevant `docs/_review/` report for the current phase

---

*Generated by M13.2.9 Context Handoff System Design*