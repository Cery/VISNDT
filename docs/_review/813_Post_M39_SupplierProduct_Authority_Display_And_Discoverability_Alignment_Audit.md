# 813 — Post-M39 SupplierProduct Authority, Display & Discoverability Alignment Audit

> Task: `813_Post_M39_SupplierProduct_Authority_Display_And_Discoverability_Alignment_Audit`
> Version: `V3.2.3 Enhanced`
> Stage: **POST-M39 / READ-ONLY ARCHITECTURE ALIGNMENT AUDIT**
> Date: `2026-09-03`
> Repository Root: `f:\Desktop\VISNDT` · Code Root: `f:\Desktop\VISNDT\VISNDT` · Branch `main` · HEAD `76b08e5`

> **READ-ONLY.** No code / schema / migration / API / permission changes. Runtime evidence via
> public GETs and headless browser only; **no DB writes, no auth bypass, no direct DB modification.**

---

## 1. Executive Decision

**Decision Gate: A = AUTHORIZATION READY**

Current implementation **supports** the frozen target authority boundary with **three material
drift points** that are entirely resolvable within the existing architecture (no schema / migration /
new endpoint required):

1. **SupplierProduct is exposed as an independent search RESULT type** (separate `supplier-product`
   tab + one card per supplier-product → duplication risk). Target = supporting **signal** under
   Product.
2. **Supplier is exposed as an active global search TYPE** (separate `供应商` tab / selectable
   `supplier` type + independent SupplierResultCard + count). Target = **contextual provider**, not
   an active search authority.
3. **Write path missing / ADMIN-only** — SupplierProduct governance is `admin/supplier-products`
   ADMIN-only; there is **no supplier self-service write layer** (create/edit/media/parameter values)
   and **no supplier claim/attach**. This is the historical phase discontinuity the user flagged.

NOT BLOCKED. No P0/P1 security/leak/authority-conflict found. The three drift points are GAP
(G3/G5/G6), not fundamental-change candidates. Recommended remediation is **separately
authorized**, not auto-implemented.

---

## 2. Baseline

```text
M35 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M36 = CLOSED
M37 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M38 = CLOSED
M39 = CLOSED
810 = AUDITED / CONDITIONALLY AUTHORIZED
811 = VERIFIED / NON-BLOCKING FOLLOW-UP
812 = CLOSED
```

M39 / 811 / 812 are **not reopened**. Known Web baseline issue `knowledge-base/[slug]/page.tsx`
`RelatedProductItem.status` (Task 802/M39) is pre-existing and outside this audit; no new regression
was introduced by this audit.

### Evidence basis & priority used

Runtime/Browser/API/Persistence **>** Code **>** Schema/API Contract **>** Documentation **>**
Historical Design **>** Inference. Sources: Prisma schema (verbatim), NestJS controllers/services
(verbatim decorators & matching logic), Next.js web components, admin router/pages, headless-browser
runtime probe `VISNDT/_813_probe.mjs` (read-only GETs), sitemap.ts. Every statement is marked
VERIFIED / OBSERVED / INFERRED / UNVERIFIED / CONDITIONAL / PRE-EXISTING.

---

## 3. Authority Definitions (verification of frozen hypothesis)

| Object | Target Authority | Current State | Verdict |
|---|---|---|---|
| Platform Product / Capability | **WHAT** — engineering/discovery/spec authority | VERIFIED platform-centric; holds capability identity/category/description/spec/parameter definitions | **ACCEPTED** |
| SupplierProduct | **WHICH CONCRETE MODEL** — supplier-specific realization of a Platform Product | VERIFIED schema+display relation (`platformProductId`), but **search-treats-as-result** | **CONDITIONAL** |
| Supplier (Organization) | **WHO** — organization / capability provider | VERIFIED supplier=org profile+catalog of associated models; but **search-treats-as-active-type** | **CONDITIONAL** |
| Offer | **COMMERCIAL RESPONSE** — price/currency/commercial state | VERIFIED `Offer` owns price+currency; SupplierProduct holds none | **ACCEPTED** |

**Relationship verified in schema (VERIFIED):**
```
Product  --platformProductId-->  SupplierProduct  --organizationId-->  Organization(type=SUPPLIER)
                                        |
                                        +--offers-->  Offer --> RFQ / Inquiry / Business-follow-up
```

---

## 4. Platform Product / Capability Responsibility

**VERIFIED** (`database/prisma/schema.prisma` `Product` L374-405): holds `name / model / description /
categoryId / status / slug`, relations to `category`, `parameterValues`, `parameterAssociations`,
`media`, `offers`, `supplierProducts`. It owns capability identity, category, description,
specification (via ProductParameterValue→ParameterDefinition), engineering use, application, media.

**No authority drift found** (VERIFIED): SupplierProduct does **NOT** redefine capability meaning,
does not create platform-level spec/category, does not carry platform engineering semantics. Platform
authority fully retained.

---

## 5. SupplierProduct Responsibility

Schema (`SupplierProduct` L556-597, `SupplierProductMedia` L599-637, `SupplierProductParameterValue`
L599-637):

| Supplier-owned field | Model | Business status |
|---|---|---|
| `brand`, `series`, `modelNumber`, `slug` | VERIFIED | IMPLEMENTED (identity) |
| `description` | VERIFIED (SupplierProduct identity model) | PARTIAL (no supplier write) |
| `technicalDescription` / `applicationInfo` | NOT in schema | MISSING (future use description) |
| `media` (`SupplierProductMedia`↔`FileAsset`) | VERIFIED schema + read path | IMPLEMENTED (schema) / WRITE-MISSING (no supplier write) |
| `parameterValues` (`SupplierProductParameterValue`) | VERIFIED schema (`parameterDefinitionId`, unique `(supplierProductId,parameterDefinitionId)`) | IMPLEMENTED (schema) / WRITE-MISSING (no supplier write) |
| organization relationship | VERIFIED (`organizationId`) | IMPLEMENTED |
| status / governance | VERIFIED `SupplierProductStatus` enum (DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED) | IMPLEMENTED (admin workflow) |

**Critical: presence of schema fields ≠ implemented business capability.** The schema fully supports
media + parameter values + lifecycle, but the **write path is ADMIN-only** — supplier cannot create /
edit / submit / manage media / set parameter values (VERIFIED: only `admin/supplier-products`).

---

## 6. Supplier Responsibility

**VERIFIED.** `/suppliers/[id]` (`apps/web/src/app/suppliers/[id]/page.tsx`) renders an organization
`CAPABILITY PROVIDER` profile + capability list + offer list + engineering-connection CTAs — **NOT a
storefront/catalog/price-list**. Homepage supplier section (`CapabilityProviderSection.tsx`) is
guidance ("能力提供商"), not a marketplace. `/suppliers` (index) is **404** (no central supplier
listing).

**Drift (runtime-proven):** Supplier is simultaneously implemented as an **active search type** —
`/search` tab `供应商` + selectable `supplier` + independent `SupplierResultCard` + count in total
results (VERIFIED: `SearchTypeTabs` TABS incl. `供应商`, `SearchPageContent` counts.suppliers,
`searchSuppliers()` returns org-grouped items, `SupplierResultCard`). Contradicts target "Supplier =
contextual provider, not active global search authority".

---

## 7. Offer Responsibility

**VERIFIED** (`Offer` L523-550): owns `price`, `currency`, `status`, `productId`, nullable
`supplierProductId`, `organizationId`, `createdByUser`, `onDelete: Restrict` on supplierProduct.
Offer = commercial/pricing response. **No price/currency/inventory on Product or SupplierProduct**
(VERIFIED schema scan). Target R4 ACCEPTED.

Display note (OBSERVED): search `SupplierProductResultCard` renders `commercialSummary.priceFrom~
priceTo currency` and `有效 Offer` count, sourced from **Offer** (correct commercial authority) but
exposed on public search and on Product detail supplier-models context → a **public/private display
consideration** (see 26), not a data-placement violation.

---

## 8. Field-Level Responsibility Matrix

| Content | Platform Product | SupplierProduct | Supplier | Offer | Knowledge/Solution |
|---|---|---|---|---|---|
| Capability Name | **AUTHORITY** | (refers via platformProductId) | — | — | — |
| Platform Product Name | **AUTHORITY** | ref | — | — | — |
| Category | **AUTHORITY** (`categoryId`) | facet via platform | — | — | — |
| Engineering Description | **AUTHORITY** | — | — | — | — |
| Technical Capability | **AUTHORITY** | — | — | — | — |
| Specification Definition | **AUTHORITY** | — | — | — | — |
| Parameter Semantics | **AUTHORITY** (`ParameterDefinition`) | (reuses def) | — | — | — |
| Supplier Brand / Series / ModelNumber | — | **OWNER** | — | — | — |
| Supplier Product Name / Desc / Technical / App Info | — | target owner (desc) | — | — | — |
| Supplier Media | — | **OWNER** (schema+read) | — | — | — |
| Supplier Parameter Values | — | **OWNER** (schema+read) | — | — | — |
| Enterprise / Company Profile | — | — | **OWNER** | — | — |
| Price / Currency | — | none | — | **OWNER** | — |
| RFQ Response / Inquiry / Connection | — | — | — | **RESPONSE** | private |
| Engineering Knowledge | — | — | — | — | **OWNER** (KnowledgeEntry/Content) |
| Engineering Solution | — | — | — | — | **OWNER** (Content/SOLUTION) |

Alignment: Platform Product / SupplierProduct / Supplier / Offer boundaries are **correct and
contained** in schema; the two drift areas are **search authority** (Q2/Q3) and **write path** (G5).

---

## 9. Public Display Matrix

| Page | Platform Product | SupplierProduct | Supplier | Offer | Display Role |
|---|---|---|---|---|---|
| Homepage | PRIMARY (FeaturedProducts) | context | guidance section | — | capability discovery |
| Category `/categories` | PRIMARY (→`/products?categoryId`) | — | — | — | capability browse |
| Product Detail `/products/[id]` | **PRIMARY** (capability/spec/engineering) | supporting (`能力提供商与供应关系` block + `supplier-models` tab, **conditional on published models**) | supporting list | context (suppliers tab uses offers) | answer "what is this capability + which providers/models" |
| Search `/search` | PRIMARY tab | INDEPENDENT result tab `能力型号` (drift) | INDEPENDENT result tab `供应商` (drift) | price in supplier-product card (commercial context) | presently over-decomposed |
| Supplier Detail `/suppliers/[id]` | associated capability list | associated offerings | **PRIMARY entity** | offer list | "who+what+connect" |
| Supplier Workspace | — | no self-service surface | read profile/members | offer mgmt | offers + read-only |
| Offer/RFQ/Inquiry (private) | — | — | — | **PRIMARY** | private workflow |

**Q1 answer — Product Detail shows PLATFORM PRODUCT, not SupplierProduct** (VERIFIED): `ProductDetailContent`
centered on capability/spec/engineering; supplier models are supporting context in a dedicated
block (only when `totalPublishedModels>0`) + `supplier-models` tab. Target R14/R15 **accepted**;
implementation aligned.

Runtime: `/products/ebb1c034-...` returned the platform product detail; supplier-models block was
**absent** for that product because it has zero published models (conditional display, OBSERVED).

---

## 10. Supplier Workspace Audit

| Supplier-facing surface | Exists? | Detail |
|---|---|---|
| My Offers / Offer management | YES | dashboard/supplier + workspace (offers lifecycle) |
| "能力展示 / 展示管理" nav | YES (read/context) | describes viewing/managing public display capabilities (VERIFIED) |
| Supplier Product self-service (create) | **NO** | — |
| Supplier Product edit | **NO** | — |
| Supplier Product submit/publish | **NO** | admin-only workflow |
| Supplier Product media management | **NO** | schema ok, no supplier write |
| Supplier parameter-value management | **NO** | schema ok, no supplier write |
| Supplier product association / claim | **NO** | no claim/attach API |
| `/workspace/supplier` | redirect shell | `router.replace('/dashboard/supplier')` (VERIFIED) |

**No supplier self-service write path exists.** All SupplierProduct mutation lives under Admin
(`admin/supplier-products`). This is G5 / WRITE-MISSING, not misplacement.

---

## 11. Database / Schema Alignment

Key verifications (all VERIFIED against `database/prisma/schema.prisma`):

- `SupplierProduct.platformProductId` REFERENCES `Product` (relation `platformProduct`, `onDelete:
  Restrict`); unique `(organizationId, platformProductId, modelNumber)`.
- `SupplierProduct.organizationId` REFERENCES `Organization`.
- `SupplierProductParameterValue.parameterDefinitionId` REFERENCES `ParameterDefinition`; cascade
  delete; unique `(supplierProductId, parameterDefinitionId)`.
- `SupplierProductMedia` ↔ `FileAsset`; cascade delete.
- `Offer.supplierProductId` nullable; `onDelete: Restrict`; Offer has `price` + `currency`.
- No price/currency/inventory/stock/SKU/discount/cart/order/checkout/payment/salesVolume fields on
  `Product` or `SupplierProduct` (schema scan) — Target R10/R11 **schema-supported**.

Schema **supports** the frozen authority model; **no schema/migration change needed** to reach target
search/display/governance alignment.

---

## 12. API Alignment

SupplierProduct endpoints — `apps/api/src/supplier-products/supplier-products.controller.ts`
(VERIFIED): mounted `admin/supplier-products`, `JwtAuthGuard` + `RolesGuard` + `Role.ADMIN`.

| Method/Path | Auth | CRUD | Consumer |
|---|---|---|---|
| POST `/admin/supplier-products` | ADMIN | create (draft, orgId from admin context) | admin |
| GET `/admin/supplier-products` | ADMIN | list | admin |
| GET `/admin/supplier-products/:id` | ADMIN | read | admin |
| (workflow) submit/begin-review/approve/reject/publish | ADMIN | status transitions | admin |

Unified public search `GET /search` (VERIFIED `search.controller.ts`) is **public** and returns all
entity groups (`products`, `supplierProducts`, `suppliers`, `knowledge`, `content`, `solutions`) —
including SupplierProduct + Supplier groups, unconditionally. `GET /search/supplier-models` +
`GET /search/context` are helper discovery endpoints (public).

**Determination:** admin-only SupplierProduct governance is **intentional governance**, but it
double-functions as the **missing supplier self-service layer** (there is no supplier write/read
boundary). Public search exposes supplier-product + supplier as result groups (search-layer drift).

---

## 13. Permission / Governance Model

No permission system implemented (per task mandate). Evaluation against current architecture:

The candidate **Level model (0→3)** fits the current architecture **well**:
- Level 0 (Platform Managed) = **current state** (admin-only).
- Level 1 (Supplier Association/claim) → needs new `claim/attach` endpoint mapped to existing
  `organizationId` scope; schema-ready.
- Level 2 (Supplier Managed + Admin Review) → maps cleanly to existing `SupplierProductStatus`
  lifecycle (DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED). **Native fit** (VERIFIED enum).
- Level 3 (Trusted Self-Service) → future.

**Key invariant (frozen):** Manage SupplierProduct ≠ Create Platform Product. Platform authority
stays with platform (no SupplierProduct path creates capability/category/ParameterDefinition —
VERIFIED).

---

## 14. Search Authority Audit

**Q2/Q3 are the two confirmed drift points.**

| Search Object | Current Authority | Searchable | Visible as independent result? | Recommended authority | Gap |
|---|---|---|---|---|---|
| Platform Product / Capability | PRIMARY tab `检测能力` | YES | YES (ProductResultCard) | **Primary** | — |
| SupplierProduct | independent RESULT, one-per-row | YES | **YES** — independent `supplier-product` tab + `SupplierProductResultCard`, link→capability detail | **Supporting signal** under Product | **G3** |
| Supplier | **active type** | YES | **YES** — independent `供应商` tab + `SupplierResultCard` + count | **Contextual provider** (not active type) | **G3** |
| Knowledge | PRIMARY tab | YES | YES | Primary | — |
| Solution | PRIMARY tab | YES | YES | Primary | — |
| Specification / Parameter | facet / context | YES | no independent card | Supporting search context | — |

Precise findings (VERIFIED):

- `supplier` and `supplier-product` **both exist as selectable search types** in the web SearchDomain
  union, `SearchTypeTabs` (tab `供应商`, tab `能力型号`), `GlobalSearchBar` selector list,
  `SearchPageContent` result sections, counts, and summary.
- **API contract has no `type` param** (`UnifiedSearchDto` = q/page/pageSize/category/filters/brand/
  series/hasOffer) — `type` is a **frontend-only dimension**; `/search` always returns all groups.
  So "supplier as search type" and "supplier-product as result type" are **web-layer** choices, not
  backend contract. **Removal at the UI layer needs no backend change** (lowest-risk remediation).
- `searchSupplierProducts()` returns **one item per SupplierProduct** ordered by publishedAt;
  `searchSuppliers()` aggregates **by organization** (one per org). So `type=supplier-product`
  results are **1-per-model → duplicated** when multiple suppliers carry the same platform model.
- modelNumber/brand searches: `searchSupplierProducts`/`searchSuppliers` match brand/series/
  modelNumber OR platformProduct name/model/description; `searchProducts` matches name/model/
  description only (does NOT surface supplier models inside the product card).
- **Runtime proof (OBSERVED, `_813_probe.mjs`):** `/search?q=ZB-K60` → tabs `检测能力(1) 方案 能力型号(2) 供应商(1) 知识`; `articleCards=3`; `bodyHasPrice=true`. → modelNumber resolves to **2
  supplier-product results + 1 supplier result** (duplication risk) and **price is shown in public
  results**.

---

## 15. Search Query Behavior

| Query | Matched Authority | Rendered Result | Context | Duplicate Risk | Recommended Authority |
|---|---|---|---|---|---|
| ZB-K60 (model) | SupplierProduct (+ Product) | supplier-product cards (2) + supplier card (1) | capability detail link | **YES** (2 cards for 1 model family) | Product result + matching supplier-product context |
| brand name | SupplierProduct | supplier-product/supplier cards | — | possible per supplier-model | Product result + supplier context |
| series name | SupplierProduct | supplier-product cards | — | possible | Product result + supplier context |
| supplier company name | SupplierProduct→Organization | supplier card | — | low (org-grouped) | Product/Supplier context |
| capability name | Product | product card (+ maybe supplier-product) | — | moderate | Product primary |
| technical/parameter term | Product/ParameterDefinition | product + supplier-product (facet) | engineering context | possible | Product primary + contextual supplier |
| application term | Product (via description) | product | — | low | Product primary |

Note (VERIFIED): Product result card does **not** currently aggregate the matching supplier models
under it, so the "Product result + nested suppliers" target is **not yet formed** — supplier context
appears on the Product **detail page** instead (9). This is the core search-model gap.

---

## 16. SEO Audit

**VERIFIED** (`apps/web/src/app/sitemap.ts`):
- Sitemap emits Product detail `/products/:id`, knowledge-base, content (KNOWLEDGE/ARTICLE/SOLUTION),
  static core. **No SupplierProduct entries. No `/suppliers/:id` entries. No supplier-product
  landing routes.**
- Runtime: `/supplier-products`, `/supplier-product-center`, `/suppliers` all **404** (no index).

**Determination:** Target R12/R13/R9 **already satisfied** — no SupplierProduct SEO flood, no
independent SupplierProduct SEO authority, Platform Product = canonical SEO object. **No SEO gap.**
(The only SEO-adjacent consideration: price shown on public search supplier-product cards — see 26.)

---

## 17. AI / LLM Discoverability Audit

Public content hierarchy today (VERIFIED):
- Platform Product = primary semantic object on Product detail + FeaturedProducts; carries
  capability/engineering/spec semantics → **WHAT**.
- SupplierProduct = model/brand info, **no independent route**; semantics surface only via Product
  detail "supplier models" block and search cards → **WHICH MODEL** (contextual).
- Supplier = `/suppliers/[id]` org profile → **WHO** (contextual).

The target semantic hierarchy (WHAT / WHICH MODEL / WHO PROVIDES) is **largely preserved**:
SupplierProduct has **no independent machine-readable page** (no route/sitemap/SEO metadata), so AI/
LLM discoverability does **not** elevate SupplierProduct to a parallel authority. **Acceptable**;
no AI API / structured data changes made (per mandate).

---

## 18. Low-Operation Audit

Target model is aligned with low-operation intent (INFERRED from schema + lifecycle enum):
- Product → SupplierProduct relationship is **FK-driven** (`platformProductId`) → no manual sync of
  supplier models to products (schema provides automatic relationship).
- SupplierProductStatus lifecycle supports governed submission without re-plumbing.
- SEO is Product-centric (sitemap), so no per-supplier-product SEO maintenance.
- Search is unified (`/search` single endpoint), no parallel index maintenance.

Risk (OBSERVED): the **independent supplier-product/supplier search tabs + duplicate cards** add
result-ambiguity that, if left, raises search maintenance/UX cost; collapsing to "Product result +
supplier context" (target) **reduces** that cost.

---

## 19. Mobile Audit

Supplier-product UI surfaces today (OBSERVED from code + 812/813 responsive baseline):
- Search tabs (`SearchTypeTabs`) are horizontally scrollable with edge shadows — mobile-safe.
- Supplier-model block on Product detail is responsive stacking.
- Supplier workspace has **no** supplier-product management UI (nothing to be mobile).
- No new SupplierProduct self-service screens exist to test per-viewport.

Missing surfaces (all future, none built): supplier claim/attach, supplier managed edit, media,
parameter values — these do not exist at any viewport. **No build performed** (per mandate). No
blocking responsive regression found on existing surfaces.

---

## 20. Historical Implementation Reconstruction

| Historical Intent | Current Implementation | Evidence | Drift | Remediation (future) |
|---|---|---|---|---|
| Platform Product → (platformProductId) → SupplierProduct (WHAT model) | Schema intact, FK + unique OK | schema.prisma | none | — |
| SupplierProduct → Organization (WHO) | Schema intact | schema.prisma | none | — |
| Offer = commercial, holds price/currency, refs supplierProduct | Offer owns price/currency; SupplierProduct holds none | schema.prisma L523-550 | none | — |
| Unified search, SupplierProduct dimension (M28.0/M661.x) | SupplierProduct = **independent result + rich card with price** | search.service/searchSupplierProducts; SupplierProductResultCard | **search treats model as RESULT not SIGNAL** | Candidate D |
| Supplier search (M34.4 PUBLISHED→org) | Supplier = **active selectable type + independent card** | searchSuppliers; SearchTypeTabs; SupplierResultCard | **supplier as active search authority** | Candidate D |
| SupplierProduct lifecycle (DRAFT→…→PUBLISHED) | Status enum + **admin-only workflow** | SupplierProductStatus; admin controller | **write path admin-only; supplier self-service missing** | Candidates A/B/C |
| SupplierProduct media / parameter values | Schema + read path exist; **no supplier write** | SupplierProductMedia/ParameterValue schema | **schema ahead of implementation** | Candidate C |

**Core discontinuity (INFERRED/conformed):** the **schema and admin-governance layer were built
forward** (SupplierProduct + status lifecycle + media + parameter values), but the **supplier
self-service write path was never connected** and the **discovery layer progressively treated
Supplier/SupplierProduct as first-class search objects** — exactly the "historical fragments" the
mission described.

---

## 21. Current-State Capability Matrix

| Capability | Schema | API | Admin | Supplier | Public | Search | SEO | Runtime | State |
|---|---|---|---|---|---|---|---|---|---|
| SupplierProduct create | yes | ADMIN | yes | no | — | — | — | admin-only | PARTIAL (admin, no supplier) |
| SupplierProduct read | yes | ADMIN + public(ctx) | yes | no | yes(detail ctx) | yes(result) | no | observed | IMPLEMENTED(read path) |
| SupplierProduct edit | yes | ADMIN | yes | no | — | — | — | admin-only | READ-ONLY/WRITE-MISSING for supplier |
| SupplierProduct submit/lifecycle | yes enum | ADMIN | yes | no | — | — | — | admin | WRITE-MISSING (supplier) |
| SupplierProduct media | yes schema | ADMIN(read) | partial | no | (detail hasMedia flag) | — | — | read | WRITE-MISSING |
| SupplierProduct parameter values | yes schema | ADMIN | partial | no | — | — | — | read | WRITE-MISSING |
| SupplierProduct public display | yes (detail ctx) | product detail | — | — | yes supporting | yes card | — | observed | IMPLEMENTED (contextual) |
| SupplierProduct search matching | yes | yes searchSupplierProducts | — | — | — | yes | — | observed (dup) | **WRONG AUTHORITY (independent result)** |
| SupplierProduct SEO | — | — | — | — | — | — | none | 404 routes | NOT APPLICABLE (target: none) |
| SupplierProduct central catalog | no | no | no | no | no (404) | no | no | 404 | NOT FOUND (target: none) |
| Supplier claim / attach | no | no | no | no | — | — | — | absent | MISSING (future) |
| Supplier management permission | no | no | no | no | — | — | — | — | MISSING (future) |

---

## 22. Gap Classification

| ID | G-class | Description | Priority |
|---|---|---|---|
| 813-G1 | G3 | SupplierProduct = independent **result** type (one-per-model) → duplication on multi-supplier models | **P1** (search authority) |
| 813-G2 | G3 | Supplier = **active search type**/tab/card → contradicts "contextual provider" | **P1** (search authority) |
| 813-G3 | G5 / WRITE-MISSING | SupplierProduct write path admin-only; no supplier create/edit/submit/media/params | **P1** (capability gap, non-blocking) |
| 813-G4 | G6 | No supplier claim/attach + no delegated supplier-management permission model | P2 (future governance) |
| 813-G5 | G2 | Price/commercial summary rendered on public search supplier-product card + Product supplier tab | **P2** (public/commerce display boundary) |

No P0. Gaps 813-G1/G2 are UI-layer authority drift (no backend contract change). Capability gaps
G3/G4 are the intended future batches. G5 is a display-boundary note, non-blocking.

---

## 23. Target Architecture (frozen)

```
                         VISNDT PLATFORM
                                |
                                v
                     ┌─────────────────────────┐
                     │ Platform Product        │
                     │ / Capability            │
                     │   WHAT                  │
                     │ Engineering + Spec +    │
                     │ Search/SEO Authority    │
                     └───────────┬─────────────┘
                                 |  platformProductId
                                 v
                     ┌─────────────────────────┐
                     │ SupplierProduct         │
                     │   WHICH MODEL           │  Brand / Series / ModelNumber
                     │   Supplier-owned info   │  Media / SupplierParameterValues
                     └───────────┬─────────────┘
                                 |  organizationId
                                 v
                     ┌─────────────────────────┐
                     │ Supplier Organization   │  WHO · Company / Enterprise
                     └─────────────────────────┘
                                 |
                                 v
                               Offer   (Commercial Response · price/currency/state)
```

**Where current code differs (measured):** only at the **search/display layer** — current search
lifts SupplierProduct to its own result type and Supplier to its own active tab (14-22 drift). The
data layer already matches the frozen diagram.

---

## 24. Target Display Model (frozen)

```
Product / Capability Detail
  Platform Product  -- engineering info / spec / applications / detection objects / knowledge/solutions
        |
        +-- Available Supplier Models   (Supplier A/Model A · Supplier B/Model B · …)
             +-- each links to /suppliers/{id}  (contextual, no price storefront)

Supplier Detail
  Supplier  -- enterprise info -> associated platform capabilities -> associated supplier products
       (no central SupplierProduct storefront)
```

Current Product Detail **already** follows this (supporting supplier-models block + tabs). Display
model accepted; no storefront exists anywhere (404 runtime-verified).

---

## 25. Target Search Model (frozen)

```
Unified /search
  +- PRIMARY result authority   -> Platform Product / Capability · Knowledge · Solution
  +- SUPPORTING match signals   -> SupplierProduct (brand/series/modelNumber/desc/parameterValues)
  +- CONTEXTUAL provider        -> Supplier   (NOT an active search type)

User Query -> Unified Search -> SupplierProduct matching -> match Platform Product
          -> return Platform Product result -> show matching SupplierProduct / Supplier context
```

Current search **differs**: Supplier is an active type; SupplierProduct is an independent result
row with price. **Reaching target = frontend-only** consolidation (Product result aggregates supplier
models; Supplier demoted to context), no backend contract change (API has no `type`).

---

## 26. Public / Private Boundary

| Surface | Boundary | Current |
|---|---|---|
| Platform Product | PUBLIC | yes (canonical SEO) |
| SupplierProduct contextual info | PUBLIC (contextual) | yes |
| Supplier | PUBLIC (contextual) | yes |
| Knowledge / Solution / Business / About | PUBLIC | yes |
| Demand / RFQ / RFQResponse / Offer / Inquiry / Workspace | PRIVATE | yes (guarded) |
| Price/currency | **Commercial/private unless authorized** | **813-G5**: price + offer count surfaced on public search supplier-product cards; commercial summary visible on Product supplier-models context |

Determination (VERIFIED): no cross-org leak, no private-workflow exposure, no checkout/order/payment
surface. The one boundary note is **price display width on public discovery** (Offer is the correct
data owner; the question is whether public search should show prices before deeper engagement).
Target R11 (no price/inventory public display **through SupplierProduct** as a data placement) is
schema-satisfied; the display-level price exposure is a policy decision to be taken in a future batch,
not a defect.

---

## 27. Recommended Remediation Batches (RECOMMENDED, NOT AUTHORIZED)

| Candidate | Scope | Gate class | Requires schema? |
|---|---|---|---|
| **Next Candidate A** | Supplier Attach / Claim Foundation (+ delegated view permission, non-authoritative) | G6/G5 | no |
| **Next Candidate B** | Authorized SupplierProduct Management (create/edit/submit → admin review via existing lifecycle) | G5 | no |
| **Next Candidate C** | Media + Supplier Parameter Values management (schema already ready) | G5 | no |
| **Next Candidate D** | Search/Public-display/SEO/LLM alignment — SupplierProduct → supporting signal; Supplier → contextual provider (UI-layer) | G3 | no |

All remain **RECOMMENDED** until separately authorized. Candidate D has the smallest footprint
(web-layer only, no backend/schema).

---

## 28. Risks

- **Duplicate search results / model ambiguity** if Candidate D is deferred long-term (UX + discoverability drift persists). Low risk of data corruption.
- **Capability gap persists** without B/C — suppliers remain unable to self-maintain models/media/
  params (operational, not correctness).
- **Price-on-search** if left unaddressed could drift toward marketplace perception (positioning risk, not code defect).
- No schema/API/migration risk — target requires none.

---

## 29. Final Frozen Rules

| Rule | Verdict |
|---|---|
| R1 Platform Product = WHAT | **FROZEN** (VERIFIED) |
| R2 SupplierProduct = WHICH MODEL | **FROZEN** (VERIFIED) |
| R3 Supplier = WHO | **FROZEN** (VERIFIED) |
| R4 Offer = COMMERCIAL RESPONSE | **FROZEN** (VERIFIED — price/currency on Offer only) |
| R5 Platform Product = primary engineering authority | **FROZEN** |
| R6 Platform Product = primary public search authority | **CONDITIONAL** (true today in practice; not yet uniquely enforced — G1/G2) |
| R7 SupplierProduct = supporting search signal | **CONDITIONAL** (target asserted; current = independent result → Batch D) |
| R8 Supplier = contextual provider, not active global search authority | **CONDITIONAL** (target asserted; current = active type → Batch D) |
| R9 No public SupplierProduct central catalog | **FROZEN** (VERIFIED 404) |
| R10 No SupplierProduct marketplace semantics | **FROZEN** (schema) |
| R11 No price/inventory public display through SupplierProduct | **CONDITIONAL** (schema-satisfied; display-level price on search open note) |
| R12 No SupplierProduct SEO flood | **FROZEN** (VERIFIED sitemap) |
| R13 No default independent SupplierProduct SEO authority | **FROZEN** (no routes) |
| R14 Public Product page = Platform Product-centered | **FROZEN** (VERIFIED) |
| R15 SupplierProduct appears contextually under Product/Supplier | **CONDITIONAL** (product detail yes; search = independent so far) |
| R16 Supplier cannot create Platform Product/Capability | **FROZEN** (VERIFIED) |
| R17 Supplier cannot redefine Platform ParameterDefinition | **FROZEN** (VERIFIED) |
| R18 Future delegated supplier mgmt permissions without delegating platform authority | **CONDITIONAL** (architecture-compatible; model recommended) |
| R19 SupplierProduct self-service, if implemented, must remain governed | **FROZEN** (policy; lifecycle ready) |
| R20 Search/SEO/discoverability must not be negatively affected by SupplierProduct | **CONDITIONAL** (only risk = G1/G5 display-level price) |

---

## 30. Decision Gate

**A = AUTHORIZATION READY**

Existing architecture (schema + status lifecycle + unified `/search` + public/private guardrails)
fully supports the frozen target authority boundary. The three drift points (G1/G2 search-layer,
G3/G4 capability, G5 display) are resolvable **without** schema/migration/new-endpoint/fundamental
change. **No D (fundamental change) required.**

STOP RULES evaluated: no P0 security issue; no cross-org leak; no SupplierProduct/Product authority
conflict (platform authority intact); current search reconcilable (UI-layer); public/private boundary
intact; schema does not contradict the authority model. → **No BLOCKED condition.**

---

## 31. Next Authorized / Recommended Work

```text
NEXT AUTHORIZED WORK:
  none — this audit is READ-ONLY; no implementation auto-authorized.

NEXT RECOMMENDED WORK:
  {A . Supplier Attach / Claim Foundation (needs separate authorization) |
   B . Authorized SupplierProduct Management |
   C . Media + Supplier Parameter Values |
   D . Search/Discoverability alignment — SupplierProduct -> supporting signal, Supplier -> contextual provider}

Recommended order of first candidate: D (lowest footprint, web-only) or B (business value),
each gated by separate authorization.

M39: CLOSED  (unchanged)
```

**Final Stop:** 813 is an alignment audit only. **No automatic implementation.** Next work must be
separately authorized.

---

## 45. Final Output

```text
FINAL STATE:                      AUDITED / ALIGNED / (three drift points -> future batches)

AUTHORITY MODEL:                  accepted

SEARCH MODEL:                     conditional   (Supplier active-type + SupplierProduct independent-result -> Batch D)

DISPLAY MODEL:                    accepted      (Product detail = Platform-centered w/ contextual supplier models)

SEO / LLM MODEL:                  accepted      (Platform Product = canonical; SupplierProduct has no independent authority)

SUPPLIERPRODUCT GOVERNANCE:       conditional   (schema + admin lifecycle ready; write/self-service path missing -> Batch A/B/C)

CURRENT IMPLEMENTATION:           partially aligned   (data/display aligned; search-authority + supplier-write diverged)

NEXT AUTHORIZED WORK:             none

NEXT RECOMMENDED WORK:            {A Supplier Attach/Claim | B SupplierProduct Management |
                                   C Media + Parameter Values | D Search/Discoverability alignment}
                                   — each requires separate authorization

M39:                              CLOSED
```

---

### Three key questions (explicit, as prioritized)

1. **Product Detail 当前展示 Product 还是 SupplierProduct？** → **Platform Product** 为主体
   （capability/spec/engineering/tabs）；SupplierProduct 仅作为"能力提供商与供应关系"支持上下文
   与 `supplier-models` tab，且仅在有已发布型号时显示。**展示对齐（DISPLAY accepted）。**
2. **Search 把 SupplierProduct 当"结果"还是"匹配信号"？** → **当前当独立"结果"**：独立
   `能力型号` tab + 一型号一卡 + 多供应商同款 → 重复；卡内显示价格。**应为 Product 下的支持
   信号 → Batch D（web 层即可，后端无 type 契约，无需改后端/库）。**
3. **Supplier 是"上下文提供商"还是"搜索对象"？** → **当前被实现成主动搜索对象**：独立 `供应商`
   tab + 可选 `supplier` type + 独立卡 + 计数。**应为上下文提供商 → Batch D（web 层收起）。**

Evidence files: `database/prisma/schema.prisma`, `apps/api/src/search/*`, `apps/api/src/supplier-products/*`,
`apps/web/src/app/search/*`, `apps/web/src/components/search/*`, `apps/web/src/app/products/[slug]/page.tsx`,
`apps/web/src/components/products/ProductDetailContent.tsx`, `apps/web/src/app/suppliers/[id]/page.tsx`,
`apps/web/src/app/sitemap.ts`, `apps/web/src/components/layout/PublicHeader.tsx` (812),
runtime probe `VISNDT/_813_probe.mjs`.