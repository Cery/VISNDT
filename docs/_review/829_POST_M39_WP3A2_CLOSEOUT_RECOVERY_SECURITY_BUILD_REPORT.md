# 829 POST-M39 WP-3A.2 CLOSEOUT RECOVERY SECURITY BUILD REPORT

> Version: V3.3.7 · Status: FROZEN / BLOCKING CLOSEOUT GATE / POST-M39 PRODUCTIZATION
> Work Package: **WP-3A.2 CLOSEOUT RECOVERY GATE**
> Repository: `F:\Desktop\VISNDT` · Code Root: `F:\Desktop\VISNDT\VISNDT` · Branch: `main`
> Date: 2026-09-06

---

## 1. Executive Summary

针对 828（WP-3A.2 Search + Categories + Product List）遗留的两项阻断收尾执行最小化闭合：

- **SEC-828-P0-01**（运行实例 `GET /products` 泄漏 `createdBy.passwordHash`）→ **CLOSED**：运行实例已加载当前源码安全投影，实时探针 + 浏览器上下文 fetch 双重实证 `passwordHash ABSENT`，全公共端点凭据扫描 `NONE`。
- **ENV-828-E1**（`next build` 被 `next/font` Google Fonts ETIMEDOUT 阻断）→ **CLOSED**：字体网络恢复可达，`next build` exit 0（48 静态页）。

结论：**Code State = Runtime State**；**828 = CONDITIONAL PASS → PASS / CLOSED**；**WP-3A.3 = READY / NEXT（不自动启动）**。

---

## 2. Repository Verification

```
git rev-parse --show-toplevel  → F:/Desktop/VISNDT
git branch --show-current      → main
git rev-parse --short HEAD     → 8bba999
```

## 3. Code Root

```
F:\Desktop\VISNDT\VISNDT
├── apps\api     ✅（backend，本任务未改）
└── apps\web     ✅（frontend，828 重构，本任务仅验证）
```

## 4. Branch / Working Tree

- Branch = `main` ✅
- API 工作树（`apps/api`）= **clean**（无任何源码改动）✅
- Web/Admin 存在 828 遗留未提交改动与 untracked 验证资产（沿用既有状态，本任务不改）⚠️ 记录

## 5. 824 / 826 / 827 / 828 Baseline

| ID | WP | 状态 |
|---|---|---|
| 824 | WP-1 Frontend Productization Contract | PASS / FROZEN |
| 826 | WP-2 Frontend Reconstruction Foundation | PASS |
| 827 | WP-3A.1 Public Discovery Shell + Home + Navigation | PASS / CLOSED |
| 828 | WP-3A.2 Search + Categories + Product List | **CONDITIONAL PASS**（SEC-828-P0-01 OPEN + ENV-828-E1 OPEN） |

828 遗留双 OPEN 与本任务 V3.3.7 指令一致。✅

## 6. SEC-828-P0-01 Before State

- 源码 `apps/api/src/common/projection/user.projection.ts` 的 `PUBLIC_USER_SELECT` 明确**不含** `passwordHash`（id/email/name/status/organizationId/createdAt/updatedAt）——**未修改** ✅
- 828 复核时运行实例 `GET /api/v1/products?status=ACTIVE` 返回 `createdBy.passwordHash` = **PRESENT**（部署陈旧）⚠️

## 7. Runtime Container Identification

| 项 | 值 |
|---|---|
| Container | `visndt-api`（`9b180bf39d94…`） |
| Image | `visndt-api:latest`（`0f5812f15768…`） |
| 构建时间 | 2026-09-05 20:43:11 UTC ≈ 本地 09-06 04:43 |
| 启动时间 | 2026-09-05 20:44:56 UTC ≈ 本地 09-06 04:44 |
| 端口 | 4000（健康 200） |
| 进程 | `node apps/api/dist/main`（`docker top` 确认） |

## 8. Source vs Runtime Consistency

- HEAD `8bba999`（2026-09-04 11:24 +0800）
- 运行镜像构建时间（09-06 04:43 本地）**晚于** HEAD → 镜像构建基于当前源码 ✅
- API 工作树 clean → **Source = Runtime** ✅

## 9. API Runtime Rebuild / Redeploy

关闭闸门验证时运行实例已为**当前源码构建产物**（镜像构建时间 > HEAD、dist 来自当前源码、`PUBLIC_USER_SELECT` 已在运行代码中生效），故安全投影在运行层已生效，**无需重复重建**。未修改 API Source / Schema / DTO / Business Logic。✅

## 10. Runtime Revision Verification

- 容器/镜像/源码一致（见 §7、§8）✅
- 健康检查 `/api/v1/health` = **200** ✅
- 进程启动时间戳 04:44（今日）✅

## 11. Public API Security Verification

`GET /api/v1/products?status=ACTIVE&page=1&pageSize=5`：

- `createdBy` keys = `id,email,name,status,organizationId,createdAt,updatedAt,organization`
- **`passwordHash` = ABSENT** ✅

## 12. passwordHash Exposure Before / After

| | 状态 |
|---|---|
| Before（828 复核） | `createdBy.passwordHash` **PRESENT**（部署陈旧） |
| After（829 关闭闸门） | `createdBy.passwordHash` **ABSENT**（实时探针 + 浏览器 fetch） |

## 13. Credential Material Scan

对 `/products`（含/不含 status）、`/search?q=内窥镜`、`/product-categories` 响应全文扫描：

`password` / `passwordHash` / `hashedPassword` / `salt` / `credential` / `secret` / `accessToken` / `refreshToken` = **NONE** ✅

## 14. Product / Category Runtime Regression

| 端点 | 状态 |
|---|---|
| `GET /api/v1/products?status=ACTIVE` | 200，4 条，无凭据字段 |
| `GET /api/v1/products` | 200，无凭据字段 |
| `GET /api/v1/search?q=test` | 200，无凭据字段 |
| `GET /api/v1/product-categories` | 200，无凭据字段 |

（前端实际使用 `/product-categories`，初始 `/categories` 404 为路径误探，非回归。）

## 15. ENV-828-E1 Build Environment

- `https://fonts.googleapis.com` **可达**（root 404 属正常，**无 ETIMEDOUT**）✅
- 分类：**NETWORK ERROR → RESOLVED**；非 CODE/DEPENDENCY ERROR ✅

## 16. Web Typecheck

```
npx tsc --noEmit -p apps/web/tsconfig.json  → TSC_EXIT=0（66s）
```

✅ PASS

## 17. Web Build

```
cd apps/web && npx next build
→ ✓ Compiled successfully in 79s
→ ✓ Generating static pages (48/48)
→ NEXT_BUILD_EXIT=0（249.7s）
```

✅ PASS（Next 15.5.20；仅既有非阻断 lint warnings：`_error` unused、`<img>` no-img-element 等——均为既有项，非新增）

## 18. API Typecheck / Build

- `npx tsc --noEmit -p apps/api/tsconfig.json` → **EXIT=0** ✅
- `npx nest build`（apps/api）→ **EXIT=0** ✅（baseline confirmation；API 无源码变化）

## 19. Browser Security Verification

Real headed Chrome（CDP，1440/375）：浏览器上下文 `fetch` 真实运行 API：

- `/products?status=ACTIVE` → status 200、`creds=[]`、`createdByKeys=id,email,name,status,organizationId,createdAt,updatedAt,organization` → **passwordHash ABSENT** ✅
- `/search?q=内窥镜` → status 200、`creds=[]` ✅

## 20. Browser Regression

Real headed Chrome **12/12 PASS**：

| 项 | 结果 |
|---|---|
| /products 卡片渲染（1440） | ✅ |
| /products 375 无横向溢出 | ✅ |
| /search?q= 结果渲染 + 提交闭环 | ✅ |
| /categories 13 条真实分类链接 | ✅ |
| 分类 → /products?categoryId= 导航 | ✅ |
| 375 分类无横向溢出 | ✅ |
| console error | 0 ✅ |

无新增 5xx / console error / data missing。

## 21. Cleanup

N/A——本任务未新增测试业务数据，未删除真实业务数据。✅

## 22. Files Changed

| File | Change | Reason | Layer |
|---|---|---|---|
| `database/_ux_verify/827/_wp3a2_closeout_sec.mjs` | 新增 | 829 浏览器安全/回归验证脚本 | Tool（非业务） |

```
Business Source Changed = NO
Schema Changed           = NO
API Contract Changed     = NO
API Source Changed       = NO
```

## 23. New Issues

无新增。⚠️ 已记录非阻断项：web/admin 工作树存在 828 遗留未提交改动与 untracked 验证资产（既有状态，非本任务引入）。

## 24. Remaining Issues

| 项 | 类别 |
|---|---|
| `g-console` | 826 P2 Future Candidate（延续） |
| 分页多页真实路径（ACTIVE 目录单页 4 条无法真实触发） | 组件契约成立，非阻断（延续） |
| web/admin 未提交改动需后续统一收敛 | 治理项（延续） |

## 25. P0 / P1 / P2 / P3

| 级别 | 项 | 状态 |
|---|---|---|
| **P0** | SEC-828-P0-01（运行实例泄漏 passwordHash） | **CLOSED**（运行层实证） |
| P1 | 无 | — |
| P2 | `g-console`（826 延续） | 延续 |
| P3 | 无新增 | — |

## 26. BLOCKING / NON-BLOCKING

- SEC-828-P0-01：**CLOSED**（非阻塞）
- ENV-828-E1：**CLOSED**（非阻塞）
- 全部验证项通过，**无阻断项**

## 27. 828 Closeout Decision

**828 = PASS / CLOSED**

依据：SEC-828-P0-01 CLOSED（运行实例安全投影实证）+ ENV-828-E1 CLOSED（网络可达 + `next build` PASS）+ Source = Runtime + 无新增回归（Browser 12/12、API/Web typecheck & build 全过）。

## 28. WP-3A.3 Readiness

**WP-3A.3（Product Detail + Related Discovery）= READY / NEXT**，但**不自动启动**，须独立授权。

## 29. Progress Synchronization

已同步：

- `docs/project-management/PROJECT_STATUS.md` ✅（追加 829；828 升级 PASS/CLOSED）
- `docs/project-management/PROJECT_ROADMAP.md` ✅（追加 829；828 升级 PASS/CLOSED）
- `docs/project-management/MODULE_COMPLETION_MATRIX.md` ✅（追加 829；828 升级 PASS/CLOSED）

主路线不变：827 ✅ → 828 ✅（经 829）→ **WP-3A.3 READY**。

## 30. Final Decision

**PASS**

- P0 Closed ✅（SEC-828-P0-01，运行实例实证）
- Build Closed ✅（ENV-828-E1，`next build` exit 0）
- Runtime = Source ✅（API 工作树 clean，镜像构建 > HEAD，安全投影运行层生效）
- No New Regression ✅（Browser 12/12、typecheck/build 全过）

## 31. STOP

**任务结束，停止执行。** 无自动后续任务。WP-3A.3 仅 READY，须独立授权后启动。
