# 805 SEC-804-P0 Public Demand Data Exposure Fix And Authorization Boundary Audit

> Task: `805_SEC_804_P0_Public_Demand_Data_Exposure_Fix_And_Authorization_Boundary_Audit`
> Version: `V3.2.3`
> Date: `2026-09-02`
> Status: **P0 SECURITY REMEDIATION / AUTHORIZATION-BOUNDARY FIX / PUBLIC API AUDIT / RUNTIME VERIFY / RECONCILE / DOCUMENT / STOP**

***

## 1. Repository Verification

- Repository Root: `F:/Desktop/VISNDT`

- Code Root: `F:/Desktop/VISNDT/VISNDT`

- Subprojects present: `apps/web` ✓, `apps/api` ✓, `apps/admin` ✓, `database/prisma` ✓, `docs` ✓

- Runtime services: PostgreSQL (`127.0.0.1:5432`, Docker container `visndt-postgres`, healthy), API `:4000` (up)

- Preserved all existing working-tree changes. No `reset/clean/checkout/restore/stash/rebase/merge/destructive delete` executed.

## 2. Git Baseline

- Branch: `main`

- HEAD: `76b08e5` · `768 M34.6 closeout docs: sync ... ; M34.6 = CLOSED, M34.7 NOT STARTED`

Files modified in this task (apps/api only):

| File                                                       | Change                                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/common/projection/user.projection.ts`                 | **NEW** — `PUBLIC_USER_SELECT` allow-list (id/email/name/status/organizationId/createdAt/updatedAt)     |
| `src/demands/demands.service.ts`                           | `createdByUser: { select: PUBLIC_USER_SELECT }` ×3 (public list / auth list / public detail)            |
| `src/products/products.service.ts`                         | `createdBy: { select: { ...PUBLIC_USER_SELECT, organization: true } }` ×2 (public list / public detail) |
| `src/rfqs/rfqs.service.ts`                                 | `createdByUser: { select: PUBLIC_USER_SELECT }` ×3 (public list / org list / detail)                    |
| `src/workflow-events/workflow-events.service.ts`           | `operator: { select: PUBLIC_USER_SELECT }` ×2 (public list / public detail)                             |
| `src/organization-members/organization-members.service.ts` | `user: { select: PUBLIC_USER_SELECT }` ×3 (org-scoped reads)                                            |

Note: `organization-members.controller.ts` and part of `organization-members.service.ts` differences shown in `git diff --stat` are **pre-existing** (M39 workspace work present before this task) and were preserved untouched.

## 3. P0 Reproduction

**SEC-804-P0-01** reproduced at the API boundary as guest (unauthenticated):

- `GET /api/v1/demands` → each `createdByUser` contained `passwordHash` (bcrypt hash) → HTTP 200, leaked

- `GET /api/v1/demands/{id}` → `createdByUser.passwordHash` present → HTTP 200, leaked

This confirmed the issue is **broader than the single recorded endpoint**: both the public **list** and public **detail** demand paths exposed credential material.

## 4. Root Cause

`demands.service` used `include: { createdByUser: true }` (no projection) on:

```ts
// demands.service.ts — findOne (public detail), findAll (public list), findMy (auth)
include: { createdByUser: true }
```

Loading the **full Prisma entity** includes `passwordHash` (map: `password_hash`). The existing `protectContactInfo()` only masks buyer contact fields; it never touches the user relation. So credentials entered the public DTO directly. This is the documented class:

```text
Public API Response ≠ Internal Prisma Entity Shape
```

## 5. Remediation

Applied an explicit **allow-list projection** (preferred strategy, no post-hoc field stripping, no `@Exclude()` reliance):

```ts
// common/projection/user.projection.ts
export const PUBLIC_USER_SELECT = Prisma.validator<Prisma.UserSelect>()({
  id: true, email: true, name: true, status: true,
  organizationId: true, createdAt: true, updatedAt: true,
});
```

`passwordHash` is **not** in the allow-list. A future field added to `User` will NOT automatically become public — it must be deliberately added. Redeployed everywhere a User relation previously returned the full entity through a response path.

## 6. Public Projection Strategy

- Strategy: **explicit SELECT (allow-list)** at the Prisma query layer, shared via `PUBLIC_USER_SELECT`.

- Boilerplate `@Exclude()` / global serializer not used — the repository had no reliable global serialization contract, and the fix must be structural at the data-access boundary.

- Non-public scalar/relation fields are returned as-is; only unambiguous credential material (`passwordHash`) is excluded from every audited projection.

- No new authority, entity, schema, route, or API architecture introduced.

## 7. Same-class Exposure Audit

Swept `apps/api/src` services for user-relation includes and classified findings:

| Surface                              | Relation                      | Class             | Before                      | After            |
| ------------------------------------ | ----------------------------- | ----------------- | --------------------------- | ---------------- |
| `demands` getAll/findOne             | `createdByUser`               | **Public**        | leaked                      | SAFE             |
| `demands` findMy                     | `createdByUser`               | Auth / Org-scoped | leaked                      | SAFE             |
| `products` getAll/findOne            | `createdBy`                   | **Public**        | leaked                      | SAFE             |
| `rfqs` getAll                        | `createdByUser`               | **Public**        | leaked                      | SAFE             |
| `rfqs` findMine/detail               | `createdByUser`               | Auth / Org-scoped | leaked                      | SAFE             |
| `workflow-events` getAll/findOne     | `operator`                    | **Public**        | leaked                      | SAFE             |
| `organization-members` reads         | `user`                        | Auth / Org-scoped | leaked                      | SAFE             |
| `content` / `knowledge` / `search`   | `author`                      | Public read       | safe select {id,email,name} | SAFE (unchanged) |
| `content-revision` / `rfq-responses` | `createdBy: true`             | scalar ID select  | not a relation              | SAFE (unchanged) |
| `offers` / `admin-inquiry`           | `createdByUser` / `createdBy` | Auth              | safe select {id,email,name} | SAFE (unchanged) |

Result: **FINDINGS remediated** — 4 public + 3 authenticated/org-scoped surfaces that leaked `passwordHash` were projected through the allow-list.

## 8. Credential Exposure Audit

Searched `apps/api/src` for `passwordHash | password | refreshToken | accessToken | secret | apiKey | privateKey | credential | auth | session`.

Remaining references and classification:

| Location                       | Purpose                                                   | Class                                 | Public leak?                                         |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| `auth/auth.service.ts`         | bcrypt hash/compare on login/register/refresh             | Auth subsystem                        | No (worst-case: caller's own token at auth boundary) |
| `auth/auth.controller.ts`      | issues access/refresh token to the caller                 | Auth subsystem                        | No                                                   |
| `users/users.service.ts`       | bcrypt write on create/update only; reads use safe select | Admin / Internal                      | No                                                   |
| `content/content.scheduler.ts` | seeds a demo hash                                         | Internal                              | No                                                   |
| `embedding` / `storage`        | server-side external API key / S3 secret                  | Internal (env only, never serialized) | No                                                   |

Conclusion: **No public API path returns credential material.** `passwordHash` is never projected into any response DTO after this fix.

## 9. Public API Endpoint Matrix

| Endpoint                                  | Auth             | Data Object | User Rel        | Sensitive Fields                 | Projection             | Guest         | Buyer       | Supplier     | Admin      | Status |
| ----------------------------------------- | ---------------- | ----------- | --------------- | -------------------------------- | ---------------------- | ------------- | ----------- | ------------ | ---------- | ------ |
| `GET /demands`                            | Public           | Demand      | `createdByUser` | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /demands/{id}`                       | Public           | Demand      | `createdByUser` | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /demands/my`                         | Auth+Org         | Demand      | `createdByUser` | none                             | allow-list             | —             | 200 own org | own org only | 200        | SAFE   |
| `GET /rfqs`                               | Public           | RFQ         | `createdByUser` | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /workflow-events`                    | Public           | Event       | `operator`      | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /workflow-events/{id}`               | Public           | Event       | `operator`      | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /products`                           | Public           | Product     | `createdBy`     | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /products/{id}`                      | Public           | Product     | `createdBy`     | none                             | allow-list             | 200 / no cred | 200         | 200          | 200        | SAFE   |
| `GET /content/public` + `/slug`           | Public           | Content     | `author`        | none                             | select {id,email,name} | safe          | —           | —            | —          | SAFE   |
| `GET /knowledge/public/entries` + `/slug` | Public           | Knowledge   | `author`        | none                             | select {id,name,email} | safe          | —           | —            | —          | SAFE   |
| `GET /search`                             | Public           | Aggregated  | `author`        | none                             | select {id,name}       | safe          | —           | —            | —          | SAFE   |
| `GET /users`, `GET /users/{id}`           | **ADMIN / self** | User        | n/a             | none (read select excludes hash) | allow-list             | —             | —           | —            | 200 / safe | SAFE   |

## 10. Guest Verification

- `GET /demands/{id}` → **200**, `sensitive=0`, `createdByUser` = safe scalar set, **no** **`passwordHash`** (negative). Positive: `id`, `title`, `status`, org, safe user fields present.

- `GET /demands` → **200**, `sensitive=0` (list)

- `GET /rfqs`, `GET /workflow-events`, `GET /products` → **200**, `sensitive=0`

- 10-endpoint sweep (list+detail) across demand/rfq/product/content/workflow-event/knowledge/search/category/parameter surfaces → **all** **`sensitive=0`**.

## 11. Buyer Verification

- `GET /demands/my` (org-scoped) → **200**, `sensitive=0`, own-org only

- `GET /demands/{public:id}` (cross-org public demand) → **200**, `sensitive=0` (public discovery preserved)

## 12. Supplier Verification

- `GET /demands/{public:id}` → **200**, `sensitive=0`

- `GET /demands/my` → **200**, **own organization only**; supplier org (926d5a…) ≠ buyer org (8b0e75…); **does NOT include buyer-org demands** → org-scope isolation PASS

## 13. Admin Verification

- `GET /users` (ADMIN) → **200**, 15 users, `sensitive=0` (read select excludes hash)

- Admin role guards verified (list is ADMIN-scoped).

## 14. Organization Scope

- Org A ≠ Org B verified: supplier `/demands/my` returned only supplier-org data; buyer-org demand not leaked.

- No Organization / OrganizationMember semantics changed; ownership checks retained; only response projection adjusted.

## 15. Runtime Evidence

- PostgreSQL `visndt-postgres` **healthy**, port 5432 up.

- API `:4000` up after clean compile (`Found 0 errors`), all routes mapped.

- Evidence scripts: `_805_verify.mjs`, `_805_verify2.mjs`, `_805_guest_sweep.mjs`, `_805_guest_sweep2.mjs` (read-only, guest + role checks). Reused existing real public data — no test record created.

## 16. Schema / Migration

- **NO CHANGE** to schema.

- **NONE** migration.

- No `Fundamental Change Candidate` triggered.

## 17. API Compatibility

- Only sensitive response fields removed. Demand authority, public semantics, routes, workflow, ownership, and status model unchanged.

- Positive fields (demand id/title/status, org, safe user info) retained.

## 18. Security Regression

Post-fix re-grep of `apps/api/src`:

- No `include`/`select` in any response path returns full User entity.

- `passwordHash` references confined to auth/subscription internal write & env-only server config.

- **Public Exposure = 0.**

## 19. Remaining Issues

No remaining public API credential exposure.

Recorded as independent findings (same class, discovered during this audit, all remediated in this task):

| ID            | Endpoint                                            | Finding                             | State                                      |
| ------------- | --------------------------------------------------- | ----------------------------------- | ------------------------------------------ |
| SEC-804-P0-01 | `GET /demands`, `GET /demands/{id}`                 | `createdByUser.passwordHash` public | **FIXED / AWAITING FINAL RE-VERIFICATION** |
| SEC-805-P0-01 | `GET /products`, `GET /products/{id}`               | `createdBy.passwordHash` public     | **FIXED**                                  |
| SEC-805-P0-02 | `GET /rfqs`                                         | `createdByUser.passwordHash` public | **FIXED**                                  |
| SEC-805-P0-03 | `GET /workflow-events`, `GET /workflow-events/{id}` | `operator.passwordHash` public      | **FIXED**                                  |

## 20. M39 Closure Impact

This task fixes the recorded blocker but does **NOT** close M39.

```text
SEC-804-P0-01 = FIXED / AWAITING FINAL RE-VERIFICATION
M39           = BLOCKED → awaiting independent M39 final closure gate
```

## 21. Documentation

- This report created.

- `PROJECT_STATUS.md`, `PROJECT_ROADMAP.md`, `MODULE_COMPLETION_MATRIX.md` synchronized (security state recorded; historical 804-and-earlier conclusions untouched).

## 22. Final State

```text
Task:                805_SEC_804_P0_Public_Demand_Data_Exposure_Fix_And_Authorization_Boundary_Audit
Repository Root:     F:/Desktop/VISNDT
Code Root:           F:/Desktop/VISNDT/VISNDT
Branch:              main
HEAD:                76b08e5
M35:                 CONDITIONAL / NOT CLOSED
M36:                 CLOSED
M37:                 CONDITIONAL / NON-BLOCKING
M38:                 CLOSED
M39 Before Task:     BLOCKED
P0 Fix:              FIXED
Demand Public API:   SAFE
Same-class Audit:    FINDINGS → all remediated (Public Exposure = 0)
Credential Audit:    PASS (remaining refs are auth/internal only)
Guest:               VERIFIED (200, no credential fields)
Buyer:               VERIFIED (own org only, no credential fields)
Supplier:            VERIFIED (public safe; org scope isolated)
Admin:               VERIFIED (ADMIN-scoped, safe projection)
Organization Scope:  INTACT
Runtime API:         VERIFIED (:4000, PostgreSQL healthy)
Web Browser:         environment limited (:3000 unreachable at verification time)
Schema:              NO CHANGE
Migration:           NONE
API Contract:        SAFE / semantics preserved
Fundamental Change:  0
New Security Findings: SEC-805-P0-01 / -02 / -03 (remediated)
SEC-804-P0-01:       FIXED / AWAITING FINAL RE-VERIFICATION
M39:                 BLOCKED / AWAITING FINAL RE-VERIFICATION
```

***

## STOP

- No 806 created.

- M39 not closed. M38 not reopened.

- No frontend platformization work performed.

- `FIXED` is not `CLOSED`; the independent M39 closure gate owns the final closure decision.

