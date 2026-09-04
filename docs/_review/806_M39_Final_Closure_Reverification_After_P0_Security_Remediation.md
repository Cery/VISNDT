# 806 M39 Final Closure Re-verification After P0 Security Remediation

> Task: `806_M39_Final_Closure_Reverification_After_P0_Security_Remediation`
> Version: `V3.2.3`
> Date: `2026-09-02`
> Status: **M39 FINAL CLOSURE RE-VERIFICATION / READ-ONLY / SECURITY REGRESSION / BUSINESS LOOP RECONCILIATION / DOCUMENT / STOP**
>
> Critical State Distinction: `FIXED ≠ VERIFIED ≠ CLOSED`

***

## 1. Repository Verification

- Repository Root: `F:/Desktop/VISNDT`

- Code Root: `F:/Desktop/VISNDT/VISNDT`

- Subprojects present: `apps/web` ✓, `apps/api` ✓, `apps/admin` ✓, `database/prisma` ✓, `docs` ✓

- Runtime: PostgreSQL (`127.0.0.1:5432`, Docker `visndt-postgres`), API `:4000` up (`/api/v1/health` → 200)

- Web `:3000` **DOWN / ENV-LIMITED** (browser E2E not freshly re-run; 803 evidence carried)

- Read-only gate: **no production source modified**. Only temporary external read-only verification scripts used (`_806_security.mjs`). No `reset/clean/checkout/restore/stash/rebase/merge/destructive delete/mass overwrite`.

## 2. Git Baseline

- Branch: `main`

- HEAD: `76b08e5` (`768 M34.6 ... ; M34.7 NOT STARTED`)

- Working tree preserved in full. 805 fix code confirmed present (`demands.service.ts` uses `PUBLIC_USER_SELECT`).

## 3. 805 Reconciliation

Accept 805 facts (independent re-test below re-confirms at the API boundary):

```text
SEC-804-P0-01 = FIXED
SEC-805-P0-01 = FIXED
SEC-805-P0-02 = FIXED
SEC-805-P0-03 = FIXED
Public Exposure = 0
```

`M39 ≠ automatically CLOSED` — 806 owns the final decision.

## 4. Security Regression

Raw-JSON scan (not DOM) of the exact known-vulnerable paths:

| Endpoint                                            | Status | Sensitive fields |
| --------------------------------------------------- | ------ | ---------------- |
| `GET /demands`                                      | 200    | 0                |
| `GET /demands/{id}` (real DRAFT demand `6eb094ed…`) | 200    | 0                |
| `GET /products`                                     | 200    | 0                |
| `GET /products/{id}` (real `ebb1c034…`)             | 200    | 0                |
| `GET /rfqs`                                         | 200    | 0                |
| `GET /workflow-events`                              | 200    | 0                |
| `GET /workflow-events/{id}` (real `db26d311…`)      | 200    | 0                |

For every response: `passwordHash / password / refreshToken / accessToken / secret / apiKey / privateKey / credential` = **absent** from the raw JSON.

Demand detail positive projection confirmed:

```json
"createdByUser": {
  "id": "85859ce9-59ad-eceb-c27d-030075546f42", "email": "demo.buyer.01@visndt.local",
  "name": "张检测", "status": "ACTIVE",
  "organizationId": "8b0e7521-b98b-42ab-8005-4f32f0063551",
  "createdAt": "…", "updatedAt": "…"
}
```

Only the allow-list fields; `passwordHash` and all credential material absent.

## 5. Same-class Exposure Audit

Re-ran the full public sweep (`/demands`, `/products`, `/rfqs`, `/workflow-events`, `/content/public`, `/knowledge/public/entries`, `/search`, `/product-categories`, `/parameter-definitions` — list + detail where applicable): **16/16 PASS, sensitive=0**. No public response path returns a full User entity. Remaining user-relation occurrences are classified Auth/Org-scoped/Admin-only with safe `select`.

## 6. Credential Exposure Audit

`passwordHash`/token/secret references confined to: `auth` subsystem (login/refresh/invitation), `users` write path (bcrypt write-back), embedding/storage server-side env keys. **No public API path returns credential material. Public Exposure = 0.**

## 7. Guest Authorization

| Endpoint                                                                 | Guest result                           |
| ------------------------------------------------------------------------ | -------------------------------------- |
| `GET /demands`, `/products`, `/rfqs`, `/workflow-events` (public intent) | 200 + safe projection + no credentials |
| `GET /demands/my`                                                        | **401**                                |
| `GET /evaluations`                                                       | **401**                                |
| `GET /notifications`                                                     | **401**                                |

Protected business surfaces correctly reject guests.

## 8. Buyer Authorization

- Login `demo.buyer.01@visndt.local` → OK.

- `GET /demands/my` → 200, own org only (`8b0e75…`), `sensitive=0`.

- Public cross-org demand detail (own-org demand) → 200, `sensitive=0`.

- `GET /notifications` (auth) → 200, `sensitive=0`.

## 9. Supplier Authorization

- Login `demo.supplier.01@visndt.local` → OK.

- `GET /demands/my` → 200, **own org only**, `containsBuyerOrg=false`, `sensitive=0`.

- `GET /workspace/supplier/*` → 200; `rfq-responses/mine`, `offers`, `inquiries/mine` → 200, `sensitive=0`.

## 10. Organization Scope

- Buyer org `8b0e75…` ≠ Supplier org `926d5a…`.

- Supplier `/demands/my` excludes buyer-org demands → **no cross-organization leakage**.

- No ownership/scope logic modified; response projection is the only change.

## 11. Evaluation → Demand

- Routes: `POST/GET /evaluations`, `GET/PATCH/DELETE /evaluations/:id`, `GET /evaluations/:id/connection` (code-verified).

- `GET /evaluations` → 200, `sensitive=0`.

- Demand CRUD + org/ownership validation in `demands.service` intact.

- **State: VERIFIED BY CODE / RUNTIME data sparse (0 evaluations at current data state).**

## 12. Demand → Match

- Matching path exists: `Demand.publish() → MatchingService.match()` (async, non-blocking) via `demands.service.publish/rematch/batchStatus`.

- Warning: the single buyer-owned live demand is **DRAFT (unpublished)** → `matches=0` at current data state. No valid published demand exists to produce a live `DemandMatch` without manufacturing/publishing a business scenario (forbidden).

- Deterministic scoring + required-parameter hard-fail present in matching code.

- **State: VERIFIED BY CODE / RUNTIME NOT VERIFIED (no published demand; no manufactured data).**

## 13. Match → RFQ

- Routes: `GET/POST /rfqs`, `GET /rfqs/:id`, `GET/POST /rfqs/:id/responses` (code-verified).

- 2 RFQs exist in real data; `GET /rfqs/{id}` → 200 for supplier.

- `sourceMatchId`/`targetOrganization` routing preserved; no new authority.

- **State: VERIFIED BY CODE / RUNTIME (RFQ presence confirmed; Match→RFQ transition not freshly exercised — empty downstream).**

## 14. RFQ → RFQResponse

- Routes: `GET/POST /rfqs/:id/responses`, `GET /rfq-responses/mine`, `GET /rfq-responses/:id` + view/accept/reject, PATCH (code-verified).

- `GET /rfqs/{id}/responses` → 200 (empty), `rfq-responses/mine` → 200 (empty).

- **State: VERIFIED BY CODE / RUNTIME data sparse (no responses at current data state).**

## 15. RFQResponse → Offer

- Routes: `GET/POST/GET /offers/:id`, `PATCH/:id`, `DELETE/:id`, `submit/accept/reject/withdraw` (code-verified).

- `GET /offers` → 200, `items=0`.

- No Commerce semantics: offer lifecycle is submit/accept/reject/withdraw, no order/payment.

- **State: VERIFIED BY CODE / RUNTIME NOT VERIFIED (offers=0).**

## 16. Offer → Inquiry

- Routes: `POST /inquiries`, `GET /inquiries/mine`, `GET /inquiries/:id` (code-verified).

- `GET /inquiries/mine` → 200 (empty).

- Inquiry is **Connection Authority only** — no Order/Deal/Lead/CRM-Opportunity semantics.

- **State: VERIFIED BY CODE / RUNTIME data sparse (inquiries=0).**

## 17. Inquiry → Workspace

- Routes: `GET /workspace/status`, `buyer/overview|demands|pending-decisions`, `supplier/overview|rfqs|responses|runtime/*` (code-verified).

- `workspace/status`, `buyer/overview`, `supplier/overview`, `supplier/rfqs|responses` all → 200.

- WorkflowEvent + Notification subsystems present and wired into demand publish/close, match status, RFQ lifecycle.

- **State: VERIFIED BY CODE / RUNTIME partially (overviews respond; workflow/notification data sparse).**

## 18. Buyer E2E

- Route path chain (Discovery → Evaluation → Demand → Match → RFQ → Response → Offer → Connection → Follow-up) fully present in code.

- Fresh full-chain runtime E2E **not re-executable** (web `:3000` ENV-LIMITED; no published demand → downstream stages empty).

- **State: CONDITIONALLY VERIFIED (code-complete; runtime chain partially evidenced).**

## 19. Supplier E2E

- Role authority + Organization Scope intact; `supplier/overview`/`rfqs`/`responses` respond 200 with safe projection.

- Downstream (response/offer/inquiry) empty at current data state.

- **State: CONDITIONALLY VERIFIED.**

## 20. Frontend Platformization

- 803 already established Whole-site Frontend Platformization = **VERIFIED**.

- 805 was **API-only**; no frontend source touched. No 805-induced frontend regression.

- **State: VERIFIED (carried from 803; no regression).**

## 21. Public Discovery

- Public surfaces (`/search`, `/product-categories`, `/products`, `/content/public`, `/knowledge/public/entries`, RFQ list) → 200, safe projection, no credentials.

- **State: VERIFIED.**

## 22. Mobile

- No UI modification in 805/806. 803 baseline (375/768/1024/1440, no overflow/clipping, nav/CTA/workflow context) carried. Fresh viewport re-check not executable (web ENV-LIMITED).

- **State: VERIFIED by 803 / no fresh runtime (ENV-LIMITED).**

## 23. Runtime

- API `:4000` up (health 200); PostgreSQL healthy.

- Evidence scripts: `_806_security.mjs` (16 public + 3 negative-auth endpoints), role probes (buyer/supplier/admin), org-scope check. All read-only, reused existing real data, **zero test records created**.

- Web `:3000` down → **ENV-LIMITED**. Security/API result NOT downgraded.

- **State: CONDITIONALLY VERIFIED / ENV-LIMITED.**

## 24. Data Integrity

- No duplicate authority, no unauthorized state transition observed, no organization leakage, no direct DB bypass (all via API), **no credential leakage**.

- Schema **NO CHANGE**; Migration **NONE**.

- **State: VERIFIED.**

## 25. External Discoverability

- **Public** (remain public): Search, Category, Product, Solution, Knowledge, Supplier discovery, Business, About — verified reachable, safe projection.

- **Private/Controlled** (remain protected): Demand private workflow, Match, RFQ, RFQResponse, Offer, Inquiry, Workspace, Notification — Guest → 401; authenticated/org-scoped otherwise.

- **State: PRIVATE / CONTROLLED business surfaces maintained.**

## 26. Existing Carry-forward

- `M35 = CONDITIONAL / NOT CLOSED`, `M37 = CONDITIONAL / NON-BLOCKING` — kept.

- `BR-802-03`, `BR-802-04`, notifications/offers empty-state polish — **NON-BLOCKING**, kept (no fresh counter-evidence).

## 27. Blocking Findings

**None.** No public credential exposure, no authorization bypass, no organization leakage, no core workflow corruption, no data-integrity violation, no new unauthorized authority, no schema inconsistency.

## 28. Acceptance Matrix

| Criterion                | Status                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| Security                 | **VERIFIED** (P0 cleared; Public Exposure = 0)                    |
| Data Integrity           | VERIFIED                                                          |
| Business Loop            | CONDITIONALLY VERIFIED (code-complete; downstream runtime sparse) |
| Buyer E2E                | CONDITIONALLY VERIFIED                                            |
| Supplier E2E             | CONDITIONALLY VERIFIED                                            |
| Workspace                | VERIFIED BY CODE / partial runtime                                |
| Frontend Platformization | VERIFIED (803 carried; no regression)                             |
| Public Discovery         | VERIFIED                                                          |
| Mobile                   | VERIFIED by 803 / no fresh runtime (ENV-LIMITED)                  |
| Runtime                  | CONDITIONALLY VERIFIED / ENV-LIMITED (web down)                   |
| Documentation            | SYNCED (this task)                                                |
| P0                       | 0                                                                 |
| P1 Blocking              | 0                                                                 |

## 29. Final M39 Closure Decision

`Security` — the sole criterion that blocked M39 in 804 (`SEC-804-P0-01`) — is now **VERIFIED** at the API boundary. `PUBLIC CREDENTIAL EXPOSURE = 0`.

However the **full tracker chain runtime** (Business Loop downstream: Match→RFQ→Response→Offer→Inquiry; Buyer/Supplier E2E; Web/Mobile fresh UI) still has **genuine evidence gaps**, not defects: no published real Demand currently exists (the live buyer demand is DRAFT → `matches=0`, `offers=0`, responses/inquiries empty), and Web `:3000` is ENV-LIMITED. Per §28, where Security is verified but business runtime retains genuine gaps, the classification is:

```text
M39 = CONDITIONALLY VERIFIED
```

NOT `CLOSED` — the full §27 closure threshold (Business Loop runtime + Buyer/Supplier E2E runtime + Web/Mobile fresh runtime) is not yet satisfied by evidence.

**Exact closure gap (recorded, not manufactured as a new task):** a fresh full-chain runtime E2E requires (a) a published real demand producing live `DemandMatch`→`RFQ`→`Response`→`Offer`→`Inquiry` records, and (b) Web `:3000` UI available for multi-role execution — neither available at current data/environment state, and manufacturing a publish/mature business scenario is forbidden for this gate.

## 30. Documentation

- This report created.

- `PROJECT_STATUS.md`, `PROJECT_ROADMAP.md`, `MODULE_COMPLETION_MATRIX.md` synchronized (M39 = CONDITIONALLY VERIFIED; Security = VERIFIED; historical 804/805 conclusions untouched).

***

## STOP

- No 807 created. No M39.x created. No frontend/backend/schema modified. No security finding fixed inside this gate.

- `VERIFIED ≠ CLOSED`. M39 remains governed by the independent closure decision evidence set: **CONDITIONALLY VERIFIED**.

- The Security blocker is cleared; the remaining gap is runtime-business-loop completeness, to be reached only by independent, evidence-based assignment — not auto-created here.

