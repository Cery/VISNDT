# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 18                                             |
| Document Name | Project Structure Audit Report                 |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 审计 VISNDT 项目当前结构、模块依赖、文件数量及潜在问题 |
| Date          | 2026-07-17                                     |
| Scope         | Read-only — no files modified                  |

---

# 1. Directory Tree

```
VISNDT/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── common/
│   │       │   ├── dto/
│   │       │   │   ├── api-response.dto.ts
│   │       │   │   └── pagination.dto.ts
│   │       │   ├── filters/
│   │       │   │   └── http-exception.filter.ts
│   │       │   └── interceptors/
│   │       │       └── logging.interceptor.ts
│   │       ├── prisma/
│   │       │   ├── prisma.module.ts
│   │       │   └── prisma.service.ts
│   │       ├── health/
│   │       │   ├── health.module.ts
│   │       │   └── health.controller.ts
│   │       ├── users/
│   │       │   ├── users.module.ts
│   │       │   ├── users.controller.ts
│   │       │   ├── users.service.ts
│   │       │   └── dto/
│   │       │       ├── create-user.dto.ts
│   │       │       └── update-user.dto.ts
│   │       ├── organizations/
│   │       │   ├── organizations.module.ts
│   │       │   ├── organizations.controller.ts
│   │       │   ├── organizations.service.ts
│   │       │   └── dto/
│   │       │       ├── create-organization.dto.ts
│   │       │       └── update-organization.dto.ts
│   │       ├── organization-members/
│   │       │   ├── organization-members.module.ts
│   │       │   ├── organization-members.controller.ts
│   │       │   ├── organization-members.service.ts
│   │       │   └── dto/
│   │       │       └── add-member.dto.ts
│   │       ├── product-categories/
│   │       │   ├── product-categories.module.ts
│   │       │   ├── product-categories.controller.ts
│   │       │   ├── product-categories.service.ts
│   │       │   └── dto/
│   │       │       ├── create-product-category.dto.ts
│   │       │       └── update-product-category.dto.ts
│   │       ├── products/
│   │       │   ├── products.module.ts
│   │       │   ├── products.controller.ts
│   │       │   ├── products.service.ts
│   │       │   └── dto/
│   │       │       ├── create-product.dto.ts
│   │       │       └── update-product.dto.ts
│   │       ├── parameter-groups/
│   │       │   ├── parameter-groups.module.ts
│   │       │   ├── parameter-groups.controller.ts
│   │       │   ├── parameter-groups.service.ts
│   │       │   └── dto/
│   │       │       ├── create-parameter-group.dto.ts
│   │       │       └── update-parameter-group.dto.ts
│   │       ├── parameter-definitions/
│   │       │   ├── parameter-definitions.module.ts
│   │       │   ├── parameter-definitions.controller.ts
│   │       │   ├── parameter-definitions.service.ts
│   │       │   └── dto/
│   │       │       ├── create-parameter-definition.dto.ts
│   │       │       └── update-parameter-definition.dto.ts
│   │       ├── product-parameters/
│   │       │   ├── product-parameters.module.ts
│   │       │   ├── product-parameters.controller.ts
│   │       │   ├── product-parameters.service.ts
│   │       │   └── dto/
│   │       │       └── set-product-parameter.dto.ts
│   │       ├── offers/
│   │       │   ├── offers.module.ts
│   │       │   ├── offers.controller.ts
│   │       │   ├── offers.service.ts
│   │       │   └── dto/
│   │       │       ├── create-offer.dto.ts
│   │       │       └── update-offer.dto.ts
│   │       └── demands/
│   │           ├── demands.module.ts
│   │           ├── demands.controller.ts
│   │           ├── demands.service.ts
│   │           └── dto/
│   │               ├── create-demand.dto.ts
│   │               └── update-demand.dto.ts
│   └── web/
│       └── src/ (Next.js scaffold — no business code)
├── database/
│   ├── package.json
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│           ├── 20260716152642_init/
│           │   └── migration.sql
│           └── migration_lock.toml
├── packages/
│   ├── shared-types/
│   │   └── src/index.ts (placeholder)
│   └── config/
│       └── src/index.ts (placeholder)
└── docs/
    ├── VISNDT-Blueprint/ (100-900 series)
    ├── _implementation/
    └── _review/ (01-17)
```

---

# 2. NestJS Module Inventory

## 2.1 Module List (13 total)

| # | Module | File | Type | Dependencies |
|---|--------|------|------|-------------|
| 1 | AppModule | app.module.ts | Root | ConfigModule, PrismaModule, all business modules |
| 2 | PrismaModule | prisma/prisma.module.ts | Infrastructure | — (global) |
| 3 | HealthModule | health/health.module.ts | Infrastructure | PrismaService |
| 4 | UsersModule | users/users.module.ts | Identity | — |
| 5 | OrganizationsModule | organizations/organizations.module.ts | Identity | — |
| 6 | OrganizationMembersModule | organization-members/organization-members.module.ts | Identity | — |
| 7 | ProductCategoriesModule | product-categories/product-categories.module.ts | Product | — |
| 8 | ProductsModule | products/products.module.ts | Product | — |
| 9 | ParameterGroupsModule | parameter-groups/parameter-groups.module.ts | Product | — |
| 10 | ParameterDefinitionsModule | parameter-definitions/parameter-definitions.module.ts | Product | — |
| 11 | ProductParametersModule | product-parameters/product-parameters.module.ts | Product | — |
| 12 | OffersModule | offers/offers.module.ts | Offer | — |
| 13 | DemandsModule | demands/demands.module.ts | Demand | — |

## 2.2 Controller List (11 total)

| # | Controller | Route Prefix | File |
|---|-----------|-------------|------|
| 1 | HealthController | health | health/health.controller.ts |
| 2 | UsersController | users | users/users.controller.ts |
| 3 | OrganizationsController | organizations | organizations/organizations.controller.ts |
| 4 | OrganizationMembersController | organizations/:id/members | organization-members/organization-members.controller.ts |
| 5 | ProductCategoriesController | product-categories | product-categories/product-categories.controller.ts |
| 6 | ProductsController | products | products/products.controller.ts |
| 7 | ParameterGroupsController | parameter-groups | parameter-groups/parameter-groups.controller.ts |
| 8 | ParameterDefinitionsController | parameter-definitions | parameter-definitions/parameter-definitions.controller.ts |
| 9 | ProductParametersController | products/:id/parameters | product-parameters/product-parameters.controller.ts |
| 10 | OffersController | offers | offers/offers.controller.ts |
| 11 | DemandsController | demands | demands/demands.controller.ts |

## 2.3 Service List (12 total)

| # | Service | File | Injected Dependency |
|---|---------|------|-------------------|
| 1 | PrismaService | prisma/prisma.service.ts | — (extends PrismaClient) |
| 2 | UsersService | users/users.service.ts | PrismaService |
| 3 | OrganizationsService | organizations/organizations.service.ts | PrismaService |
| 4 | OrganizationMembersService | organization-members/organization-members.service.ts | PrismaService |
| 5 | ProductCategoriesService | product-categories/product-categories.service.ts | PrismaService |
| 6 | ProductsService | products/products.service.ts | PrismaService |
| 7 | ParameterGroupsService | parameter-groups/parameter-groups.service.ts | PrismaService |
| 8 | ParameterDefinitionsService | parameter-definitions/parameter-definitions.service.ts | PrismaService |
| 9 | ProductParametersService | product-parameters/product-parameters.service.ts | PrismaService |
| 10 | OffersService | offers/offers.service.ts | PrismaService |
| 11 | DemandsService | demands/demands.service.ts | PrismaService |
| 12 | LoggingInterceptor | common/interceptors/logging.interceptor.ts | — (global) |

## 2.4 DTO List (19 total)

| # | DTO | File | Domain |
|---|-----|------|--------|
| 1 | ApiResponse<T> | common/dto/api-response.dto.ts | Common |
| 2 | PaginationDto | common/dto/pagination.dto.ts | Common |
| 3 | CreateUserDto | users/dto/create-user.dto.ts | Identity |
| 4 | UpdateUserDto | users/dto/update-user.dto.ts | Identity |
| 5 | CreateOrganizationDto | organizations/dto/create-organization.dto.ts | Identity |
| 6 | UpdateOrganizationDto | organizations/dto/update-organization.dto.ts | Identity |
| 7 | AddMemberDto | organization-members/dto/add-member.dto.ts | Identity |
| 8 | CreateProductCategoryDto | product-categories/dto/create-product-category.dto.ts | Product |
| 9 | UpdateProductCategoryDto | product-categories/dto/update-product-category.dto.ts | Product |
| 10 | CreateProductDto | products/dto/create-product.dto.ts | Product |
| 11 | UpdateProductDto | products/dto/update-product.dto.ts | Product |
| 12 | CreateParameterGroupDto | parameter-groups/dto/create-parameter-group.dto.ts | Product |
| 13 | UpdateParameterGroupDto | parameter-groups/dto/update-parameter-group.dto.ts | Product |
| 14 | CreateParameterDefinitionDto | parameter-definitions/dto/create-parameter-definition.dto.ts | Product |
| 15 | UpdateParameterDefinitionDto | parameter-definitions/dto/update-parameter-definition.dto.ts | Product |
| 16 | SetProductParameterDto | product-parameters/dto/set-product-parameter.dto.ts | Product |
| 17 | CreateOfferDto | offers/dto/create-offer.dto.ts | Offer |
| 18 | UpdateOfferDto | offers/dto/update-offer.dto.ts | Offer |
| 19 | CreateDemandDto | demands/dto/create-demand.dto.ts | Demand |
| 20 | UpdateDemandDto | demands/dto/update-demand.dto.ts | Demand |

---

# 3. API Endpoint Inventory (37 total)

| # | Method | Path | Controller | Domain |
|---|--------|------|-----------|--------|
| 1 | GET | /api/v1/health | HealthController | Infrastructure |
| 2 | GET | /api/v1/users | UsersController | Identity |
| 3 | GET | /api/v1/users/:id | UsersController | Identity |
| 4 | POST | /api/v1/users | UsersController | Identity |
| 5 | PATCH | /api/v1/users/:id | UsersController | Identity |
| 6 | GET | /api/v1/organizations | OrganizationsController | Identity |
| 7 | GET | /api/v1/organizations/:id | OrganizationsController | Identity |
| 8 | POST | /api/v1/organizations | OrganizationsController | Identity |
| 9 | PATCH | /api/v1/organizations/:id | OrganizationsController | Identity |
| 10 | GET | /api/v1/organizations/:id/members | OrganizationMembersController | Identity |
| 11 | POST | /api/v1/organizations/:id/members | OrganizationMembersController | Identity |
| 12 | GET | /api/v1/product-categories | ProductCategoriesController | Product |
| 13 | GET | /api/v1/product-categories/:id | ProductCategoriesController | Product |
| 14 | POST | /api/v1/product-categories | ProductCategoriesController | Product |
| 15 | PATCH | /api/v1/product-categories/:id | ProductCategoriesController | Product |
| 16 | GET | /api/v1/products | ProductsController | Product |
| 17 | GET | /api/v1/products/:id | ProductsController | Product |
| 18 | POST | /api/v1/products | ProductsController | Product |
| 19 | PATCH | /api/v1/products/:id | ProductsController | Product |
| 20 | GET | /api/v1/parameter-groups | ParameterGroupsController | Product |
| 21 | GET | /api/v1/parameter-groups/:id | ParameterGroupsController | Product |
| 22 | POST | /api/v1/parameter-groups | ParameterGroupsController | Product |
| 23 | PATCH | /api/v1/parameter-groups/:id | ParameterGroupsController | Product |
| 24 | GET | /api/v1/parameter-definitions | ParameterDefinitionsController | Product |
| 25 | GET | /api/v1/parameter-definitions/:id | ParameterDefinitionsController | Product |
| 26 | POST | /api/v1/parameter-definitions | ParameterDefinitionsController | Product |
| 27 | PATCH | /api/v1/parameter-definitions/:id | ParameterDefinitionsController | Product |
| 28 | GET | /api/v1/products/:id/parameters | ProductParametersController | Product |
| 29 | POST | /api/v1/products/:id/parameters | ProductParametersController | Product |
| 30 | GET | /api/v1/offers | OffersController | Offer |
| 31 | GET | /api/v1/offers/:id | OffersController | Offer |
| 32 | POST | /api/v1/offers | OffersController | Offer |
| 33 | PATCH | /api/v1/offers/:id | OffersController | Offer |
| 34 | GET | /api/v1/demands | DemandsController | Demand |
| 35 | GET | /api/v1/demands/:id | DemandsController | Demand |
| 36 | POST | /api/v1/demands | DemandsController | Demand |
| 37 | PATCH | /api/v1/demands/:id | DemandsController | Demand |

### Endpoint Summary

| Domain | Endpoints | GET | POST | PATCH |
|--------|-----------|-----|------|-------|
| Infrastructure | 1 | 1 | 0 | 0 |
| Identity | 11 | 6 | 4 | 1 |
| Product | 18 | 10 | 5 | 3 |
| Offer | 4 | 2 | 1 | 1 |
| Demand | 4 | 2 | 1 | 1 |
| **Total** | **38** | **21** | **11** | **6** |

---

# 4. Prisma Model ↔ API Mapping

| Prisma Model | Controller(s) | Status |
|-------------|---------------|--------|
| User | UsersController | Implemented |
| Organization | OrganizationsController | Implemented |
| OrganizationMember | OrganizationMembersController | Implemented |
| ProductCategory | ProductCategoriesController | Implemented |
| Product | ProductsController | Implemented |
| ParameterGroup | ParameterGroupsController | Implemented |
| ParameterDefinition | ParameterDefinitionsController | Implemented |
| ParameterOption | — | Not yet exposed |
| ProductParameterValue | ProductParametersController | Implemented |
| ProductParameterDefinition | — | Not yet exposed |
| Offer | OffersController | Implemented |
| Demand | DemandsController | Implemented |
| RFQ | — | Not yet implemented |
| RFQResponse | — | Not yet implemented |
| WorkflowEvent | — | Not yet implemented |
| Notification | — | Not yet implemented |
| FileAsset | — | Not yet implemented |
| AuditLog | — | Not yet implemented |

**Coverage**: 10/18 models (56%) have API endpoints.

---

# 5. Architecture Check

## 5.1 Import Dependency Graph

```
main.ts
  └── app.module.ts
       ├── ConfigModule (global)
       ├── PrismaModule (global)
       │    └── PrismaService
       ├── HealthModule → PrismaService
       ├── UsersModule → PrismaService
       ├── OrganizationsModule → PrismaService
       ├── OrganizationMembersModule → PrismaService
       ├── ProductCategoriesModule → PrismaService
       ├── ProductsModule → PrismaService
       ├── ParameterGroupsModule → PrismaService
       ├── ParameterDefinitionsModule → PrismaService
       ├── ProductParametersModule → PrismaService
       ├── OffersModule → PrismaService
       └── DemandsModule → PrismaService
```

**Import direction**: All modules → PrismaService (unidirectional, no cycles).

## 5.2 Layer Discipline

| Layer | Direct Prisma Access | Count |
|-------|---------------------|-------|
| Controller | None | 0/11 |
| Service | Via PrismaService | 11/11 |
| Filter | None | 1/1 |

**PASS**: No controller directly accesses Prisma.

---

# 6. Quality Checks

## 6.1 TODO / FIXME / HACK / TEMP

| Pattern | Results |
|---------|---------|
| TODO | 0 |
| FIXME | 0 |
| HACK | 0 |
| XXX | 0 |
| TEMP | 0 |

**PASS**: Zero temporary markers found.

## 6.2 Duplicate Files

**PASS**: No duplicate files detected. Each domain has unique module/controller/service/DTO files.

## 6.3 Naming Consistency

| Convention | Status |
|------------|--------|
| Module: PascalCase (e.g., UsersModule) | PASS |
| Controller: PascalCase + "Controller" | PASS |
| Service: PascalCase + "Service" | PASS |
| DTO: PascalCase + "Dto" | PASS |
| File: kebab-case (e.g., users.controller.ts) | PASS |
| API route: kebab-case (e.g., product-categories) | PASS |

**PASS**: All naming conventions consistent.

## 6.4 Import Cycles

**PASS**: No circular imports. All imports are downward (Controller → Service → PrismaService, or → common/dto).

## 6.5 Unused / Reserved Directories

| Directory | Status |
|-----------|--------|
| common/decorators/ | Not created (reserved) |
| common/constants/ | Not created (reserved) |

**INFO**: Two reserved directories were mentioned in Phase 13 Batch 2 but never populated. This is expected — they are reserved for future use.

---

# 7. Package Status

| Package | Health | Status |
|---------|--------|--------|
| @visndt/api | Active | 13 modules, 38 endpoints, build passes |
| @visndt/database | Active | schema.prisma frozen, 1 migration executed |
| @visndt/shared-types | Placeholder | `export {}` only — no business types |
| @visndt/config | Placeholder | `export {}` only — no config |
| apps/web | Scaffold | Next.js boilerplate only — no business code |

---

# 8. File Count Summary

| Layer | Files |
|-------|-------|
| app.module.ts | 1 |
| main.ts | 1 |
| Common (dto, filters, interceptors) | 3 |
| Prisma | 2 |
| Health | 2 |
| Identity (Users, Orgs, Members) | 14 |
| Product (Categories, Products, Parameters) | 24 |
| Offer | 5 |
| Demand | 5 |
| **Total src/** | **57** |

| Layer | Files |
|-------|-------|
| docs/_review/ | 17 reports |
| docs/_implementation/ | 1 plan |
| docs/VISNDT-Blueprint/ | ~80+ documents |
| database/ | 3 files |
| packages/ | 4 files |

---

# 9. Risk Assessment

| Risk | Severity | Detail |
|------|----------|--------|
| packages placeholder | LOW | shared-types and config are empty — no impact until used |
| apps/web scaffold | LOW | No frontend code — expected per MVP phase |
| Unimplemented Prisma models | MEDIUM | 8/18 models (RFQ, RFQResponse, WorkflowEvent, Notification, FileAsset, AuditLog, ParameterOption, ProductParameterDefinition) have no API |
| Missing Authentication | MEDIUM | No auth module — all endpoints are public |
| Missing RFQ API | MEDIUM | Next phase dependency — required for Demand → RFQ flow |

---

# 10. Final Status

```
Project Structure Audit: PASS
```

| Metric | Value |
|--------|-------|
| Modules | 13 |
| Controllers | 11 |
| Services | 12 |
| DTOs | 20 |
| API Endpoints | 38 |
| Prisma Models (total) | 18 |
| Prisma Models (with API) | 10 |
| TODO/FIXME | 0 |
| Import cycles | 0 |
| Duplicate files | 0 |
| Naming violations | 0 |
| Build | PASS |

### Items for Human Review

| # | Item | Recommendation |
|---|------|---------------|
| 1 | 8 Prisma models have no API | Implement in next phases (RFQ, Workflow, Notification, File, Audit, ParameterOption, ProductParameterDefinition) |
| 2 | No Authentication | Implement before production deployment |
| 3 | packages/ are placeholders | Populate when shared types/config are needed |
| 4 | apps/web has no business code | Implement per Frontend phase plan |

> **声明**: 本报告基于 2026-07-17 只读扫描生成。未修改任何文件。项目结构健康，无循环依赖、无临时代码、无命名不一致。