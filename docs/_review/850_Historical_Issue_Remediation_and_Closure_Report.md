# 850 Historical Issue Remediation and Closure Report

- **Task**: 850_Historical_Issue_Remediation_and_Closure
- **Version**: V3.4.0
- **Status**: **AUDIT-TO-FIX RECONCILIATION COMPLETE**
- **类型**: Targeted Bug Fix + Controlled Data Governance + Documentation Reconciliation + Runtime Verification
- **执行日期**: 2026-09-07
- **代码根**: `F:\Desktop\VISNDT\VISNDT`
- **Branch**: `main`

---

## 1. Task Scope

修复并关闭 848/语义审计联合确认的 **H01 / H04 / H23**。其余（H05/H22/H02/H03/H06/H07/H08/H13/H14/H15/H16/H19）**仅登记、不入范围**。

| 范围 | 处置 | 变更面 |
| --- | --- | --- |
| H01 Compare State Continuity（P1） | **修复 + 浏览器验证** | 前端 1 行（products/page.tsx 顶部「评估对比」） |
| H04 Data Test-Marker Cleanup（P2） | **受控清理 + 备份 + 残余扫描** | DB `product.description` 4 行（前缀精确清理） |
| H23 Documentation Truth Correction | **措辞对齐 + Roadmap 对账** | 845 报告 §15 附录；STATUS/ROADMAP 追加 |

**冻结**：无 Schema/API/Domain/State-architecture 变更；无 Compare/Home/Detail/Search 重设计；无 Capability/Feature/Application/DetectionObject 新建。

---

## 2. H01 Before State

**问题**：`apps/web/src/app/products/page.tsx` 顶部「评估对比」- `onClick={() => router.push('/products/compare')}` 不携带 `compareIds` → 跳转后对比列表为空。

**证据（848）**：`page.tsx:315` 与 `CompareBar.tsx:24`（`/products/compare?ids=<ids>`）语义不一致。

---

## 3. H01 Fix

仅改 `apps/web/src/app/products/page.tsx` 顶部「评估对比」onClic.k：

```tsx
onClick={() =>
  router.push(
    compareIds.length > 0
      ? `/products/compare?ids=${compareIds.join(',')}`
      : '/products/compare',
  )
}
```

- 复用既有 `compareIds` 状态（已在作用域内）。
- 空选择保留原 `/products/compare` 空态路由（不传 ids）。
- 保持 Compare 页读取逻辑完全不变（`compare/page.tsx` 读 `useSearchParams().get('ids')` 不变）。
- 与底部 CompareBar 采用相同 `?ids=` 语义。

**代码影响范围**：仅此 1 个 handler。无新依赖、无状态库、无 Compare 页改动。

---

## 4. H01 Runtime Verification

真实浏览器（CDP）：

| 步骤 | 结果 |
| --- | --- |
| Open /products | ✅ 页面加载 |
| Select Product A（ZB-K60）+ Product B（ZB-TJ095） | ✅ 选择成功 |
| Click 顶部「评估对比」 | ✅ 跳转到 `/products/compare?ids=ebb1c034-...,98fe9224-...` |
| Confirm route contains ids=A,B | ✅ URL 携带两 id |
| Confirm Compare 页加载 A+B | ✅ 对比表同时呈现 ZB-K60 与 ZB-TJ095 |

**结论**：H01 顶部入口与 CompareBar 语义已对齐，**对比状态在路由过渡后保持**。标签堆叠切换行为正常。

---

## 5. H04 Before State

**问题**：`product.description` 4 条真实公共产品仍残留 `[M34.6 CONTROLLED TEST DATA][PUBLIC SOURCE DATA] ` 前缀。公开 UI 已由 `display-text.ts` 的 `stripGovernanceLabels` 在显示层剥离，故 UI 不可见；但**数据源**标记残留，与 845「受控清理」事实不符。

**受影响的 4 行**：
- `ebb1c034-4280-480b-89ce-29753660e126` ZB-K60
- `98fe9224-12b1-4b2e-ba5d-f17f23f7e9e2` ZB-TJ095（细径光纤工业内窥镜）
- `a5a26d69-320f-4c95-a480-3d15f2faea2a` POP 4 便携式三维扫描仪
- `38a711ff-9352-40ea-978b-90ecd566b826` MetroY Ultra 三维扫描仪/工业检测

---

## 6. H04 Cleanup Evidence

**受控前置**（依据指令 20、21）：Inventory → exact-match → preview → targeted backup → controlled update → residual scan。

**备份**：`VISNDT/_850_h04/850_h04_pre_product_backup.csv`（4 行，含 id/name/model/status/description）。执行 `COPY 4`。

**受控更新**（事务）：仅剥离以 `[M34.6 CONTROLLED TEST DATA][PUBLIC SOURCE DATA]` 开头的精确前缀，`regexp_replace('^\[M34\.6 CONTROLLED TEST DATA\]\[PUBLIC SOURCE DATA\]\s*','')`。

**结果**：`UPDATE 4`，附 SELECT 复核 4 行正文完整保留（如 ZB-K60 → "便携式工业检测内窥镜，360°全方位摆头，IP67防护，软性插入管"）。

> **未**做全局替换 / 空白覆盖 / 删除正文 / 改写真实内容。

---

## 7. H04 Residual Scan

| 扫描条件 | 命中 |
| --- | --- |
| `description ILIKE '%M34.6%'` | 0 |
| `description ILIKE '%CONTROLLED TEST DATA%'` | 0 |
| `description ILIKE '%PUBLIC SOURCE DATA%'` | 0 |
| `description ILIKE '%TEST DATA%'` / `'%M34.%'` | 0 |
| 全表 `product` 总数 | 4（无丢失） |
| 空 description 行数 | 0 |

**Runtime 复核**：
- `/search?q=内窥镜` → 结果包 ZB-K60/ZB-TJ095，description 无任何标记。
- `/products/zb-k60` 详情页 → 显示“便携式工业检测内窥镜，360°全方位摆头，IP67防护，软性插入管”，无标记、无残缺、无空白。
- Home/商品列表 → 无标记。

**H04 残余 = 0，无因清理导致的空/坏内容。**

---

## 8. H23 Documentation Correction

检查 `845_Production_Data_Sanitization_and_Test_Data_Purge_Report.md`、`PROJECT_STATUS.md`、`PROJECT_ROADMAP.md` 中「Test Data Purge Complete / All Test Data Deleted」类绝对表述。

**处置**：845 标题「Test Data Purge / 测试数据清理完成」存在被误读为「ALL TEST DATA DELETED」的风险 → 在 845 报告**新增 §15 Post-845 Truth Correction Addendum（850 追加）**，将表述收敛为：

> **ALL IDENTIFIED / CONTROLLED TEST / DEMO / E2E DATA PURGED（含 850 H04 对保留产品 description 前缀的受控清理）。**

**关键原则**：仅新增事实澄清附录，**未改写 §1–§14 历史审计事实**，未修改删除范围/行数/授权结论。

---

## 9. Roadmap Reconciliation

- `PROJECT_STATUS.md` 追加 **### 850** 条目：H01 CLOSED / H04 CLOSED / H23 CLOSED；H05=P3 FOLLOW-UP；H22=P2 OPERATIONAL FOLLOW-UP；H02/H03/H06/H07/H08/H13/H14/H15/H16/H19 = DATA-LIMITED / FOLLOW-UP；Next=STOP。
- `PROJECT_ROADMAP.md` 追加 **### 850** 条目：同理；登记不改 H05/H22；不自动启动 Backup & Restore Assurance。
- **未提前将 H01/H04/H23 标为 CLOSED**；全部以实际修复 + 验证证据为准。

---

## 10. Regression Verification

真实浏览器回归 `apps/web` 公开面：

| 路由 | 结果 |
| --- | --- |
| `/products` | ✅ 列表/分类 rail / 顶部与底部对比正常 |
| `/products/compare` | ✅ 空态正常；`?ids=` 双产品对比正常 |
| `/products/[slug]`（zb-k60） | ✅ 详情渲染、description 干净 |
| `/search?q=内窥镜` | ✅ 结果正常、无标记、无坏描述 |

**回归范围**：navigation / Compare / product rendering / description rendering 通过。未借机做任何 Home/Detail/Search/Design-system 重构。

---

## 11. Build Verification

`apps/web`：
- **TypeScript** `npx tsc --noEmit` → **通过（无错误）**
- **ESLint** `next lint`（全量 + 单独 `products/page.tsx`）→ **No ESLint warnings or errors on changed file**（全量仅存既有 warn，均不在改动文件）
- **Next build** `next build` → **PASS，exit 0**；全部路由生成成功（含 /products、/products/compare/[props] 等）

**无新增编译错误、无新增运行时错误、无路由生成错误。**

---

## 12. Architecture Integrity

- `Product = WHAT` / `SupplierProduct = WHICH MODEL` / `Organization = OWNER` / `Offer = COMMERCIAL`：语义不变。
- **未引入** Capability 实体 / 新 Domain Authority。
- 无 Schema change / 无 Migration / 无 API Contract change。
- 本任务代码变更仅 `apps/web/src/app/products/page.tsx` 一个前端 URL 构造（`git diff` 确认该 handler 为唯一 hunk；同文件其余 hunk 为 835 既有工作区改动，非本次）。DB 变更仅受控数据 UPDATE（不是 schema）。

---

## 13. Remaining Issues

| ID | 状态 | 说明 |
| --- | --- | --- |
| H01 | **CLOSED** | 修复 + 浏览器验证 |
| H04 | **CLOSED** | 清理 + residual=0 + runtime 复核 |
| H23 | **CLOSED** | 文档澄清 + Roadmap 对账 |
| H05 | **P3 FOLLOW-UP** | UUID/slug 路由、sitemap、canonical —— 本任务不动 |
| H22 | **P2 OPERATIONAL FOLLOW-UP** | 未执行恢复；登记 `OPEN OPERATIONAL FOLLOW-UP`，推荐独立任务 Backup & Restore Assurance |
| H02/H03/H06/H07/H08/H13/H14/H15/H16/H19 | **DATA-LIMITED / FOLLOW-UP** | 技术链路存在但数据不足，不造数据/不架构改 |

---

## 14. Final Status

**判定**：**PASS**

满足：
- ✅ H01 fixed + runtime verified
- ✅ H04 cleaned + residual scan clear + runtime verified
- ✅ H23 corrected（含 845 附录 / STATUS / ROADMAP 对账）
- ✅ build passes（tsc / lint / next build）
- ✅ no architecture change

**Final Output**：
- H01 = **CLOSED**
- H04 = **CLOSED**
- H23 = **CLOSED**
- H05 = **P3 FOLLOW-UP**
- H22 = **P2 OPERATIONAL FOLLOW-UP**
- H02/H03/H06/H07/H08/H13/H14/H15/H16/H19 = **DATA-LIMITED / FOLLOW-UP**

**Remaining**：
- Remaining P1 Count = **0**
- Remaining P2 Count = **1**（H22 运营跟进）
- Remaining P3 Count = **1**（H05）
- Data-Limited Count = **10**
- Future Candidate Count = **0（本任务未新增 future candidate）**

---

## 15. STOP Gate

任务已按范围完成。**未执行**：Search 增强 / 产品数据富集 / Mobile 重设计 / SEO 重设计 / Capability / Feature / Application / DetectionObject 建模 / Backup restore 执行。

**不做下一步**（除非独立授权）：修复 H05 / H22、启动 Backup & Restore Assurance、启动 846 或任何后续任务。

---

## TASK COMPLETE
## AUDIT-TO-FIX RECONCILIATION COMPLETE
## STOP