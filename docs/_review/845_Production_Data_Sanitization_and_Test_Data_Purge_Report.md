# 845 Production Data Sanitization and Test Data Purge Report

- **Task**: 845_Production_Data_Sanitization_and_Test_Data_Purge
- **Version**: V3.4.0
- **Status**: DESTRUCTIVE DATA GOVERNANCE OPERATION / COMPLETED（受控数据清理完成）
- **类型**: Production Data Sanitization + Test Data Purge + Protected Data Verification
- **Code Change**: 无
- **Schema Change**: 无
- **Business Logic Change**: 无
- **执行日期**: 2026-09-07
- **数据库**: PostgreSQL（容器 `visndt-postgres`）
- **报告路径（仓库根目录）**: `F:\Desktop\VISNDT\docs\_review\845_Production_Data_Sanitization_and_Test_Data_Purge_Report.md`

---

## 0. 决策状态

| 项目 | 数值 |
| --- | --- |
| Current Productization Round | CLOSED |
| Post-Productization Cycle | STARTING |
| **845** | **CURRENT / DONE** |
| 846 | NEXT |
| 847 / 848 | FUTURE |
| 849 | FINAL RE-ACCEPTANCE |

---

## 1. 执行背景与唯一目标

建立面向生产运营的 **真实、可信、无开发测试污染** 的 Production Data Baseline。

必须保留：
- 管理员 `admin@visndt.com`（不改密码 / 角色 / 组织 / 状态）
- 组织 **微视（深圳市微视光电科技有限公司）**、**知象（西安知象光电科技有限公司）**
- 两家企业关联用户及经确认属于两家企业的真实数据

删除：其他管理账户 / 其他企业 / 其他企业用户 / 测试能力 / 测试能力分类 / 测试参数 / 测试 SupplierProduct / 测试 Demand / 测试 Match / 测试 RFQ / 测试 RFQResponse / 测试 Offer / 测试 Inquiry / 测试 Content / 测试 Media / 其他明确测试 / 演示 / E2E 数据。

---

## 2. Inventory（只读盘点）

### 2.1 删除前组织 / 用户全集（10 组织，15 用户）

| organization_id | 名称 | 类型 | 处置 |
| --- | --- | --- | --- |
| `b99cdbc7-eea1-4f09-bfd2-ed4753e3724c` | Admin Organization | ADMIN | **PRESERVE**（admin 归属组织） |
| `3159cda3-2057-3da9-c572-68b00c082cb5` | VISNDT 平台运营中心 | ADMIN | **PRESERVE**（admin@visndt.com 归属） |
| `697c99b2-1447-491a-a68a-566f51ca9181` | 深圳市微视光电科技有限公司 | SUPPLIER | **PRESERVE**（微视） |
| `be7e5cd7-b86e-4e75-9eb2-8d28ec41af42` | 西安知象光电科技有限公司 | SUPPLIER | **PRESERVE**（知象） |
| `5538dbde-8a84-41e9-a74a-49c9fbc218b2` | SZ Wise Supplier（测试桩组织） | SUPPLIER | **DELETE**（用户裁定=测试） |
| `3159cda3-2057-4da9-8572-68b00c082cb5` | VISNDT 平台运营中心（陈旧） | ADMIN | DELETE |
| `60e379fa-cb34-4af8-bcac-9b67be521464` | VISNDT 采购方企业 | BUYER | DELETE |
| `926d5a96-e1be-455c-8d58-8f4a79b6735d` | 明视工业检测设备有限公司 | SUPPLIER | DELETE |
| `8b0e7521-b98b-42ab-8005-4f32f0063551` | 江南航空检测技术中心 | BUYER | DELETE |
| `eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d` | 锐视检测技术有限公司 | SUPPLIER | DELETE |

| 用户（email） | 归属组织 | 处置 |
| --- | --- | --- |
| `admin@visndt.com` | 平台运营中心（保留组织） | **PRESERVE** |
| `supplier@visndt.com`、`zhangsan.763`、`lisi.763`、`admin.vs.763` | 微视 | **PRESERVE** |
| `wangwu.763`、`admin.zx.763`、`zhaoliu.763` | 知象 | **PRESERVE** |
| `system@visndt.com` | 系统账户（ORG=NULL） | **PRESERVE** |
| `vsndt@sz-wise.cn`、`demo.admin@visndt.local`、`buyer@visndt.com`、`demo.supplier.01`、`demo.buyer.01`、`demo.supplier.02` | 待删组织 | DELETE |

---

## 3. Whitelist — PRESERVE（保护集）

组织：
- `697c99b2-1447-491a-a68a-566f51ca9181` = **微视**
- `be7e5cd7-b86e-4e75-9eb2-8d28ec41af42` = **知象**
- `b99cdbc7-eea1-4f09-bfd2-ed4753e3724c`（Admin Organization）
- `3159cda3-2057-3da9-c572-68b00c082cb5`（admin 组织）

用户：
- `admin@visndt.com`
- 微视关联用户（supplier@visndt.com 等 4 名）
- 知象关联用户（wangwu.763 等 3 名）
- `system@visndt.com`

真实业务数据：4 个公共 Platform Product；微视 / 知象共 6 个真实 SupplierProduct；admin 的 1 条真实 Demand 与关联 RFQ；微视 1 条真实 Offer；知识 / 方案内容。

AuditLog：**RETAIN（保留）**。

---

## 4. DELETE（删除集）

- 6 个测试 / 演示组织；6 个测试 / 演示用户。
- 删除范围内业务数据：`demand_parameter` 13、`buyer_evaluation` 1、`rfq_response` 4、`offer` 1、`rfq` 5、`demand_match` 5、`supplier_product` 6、`inquiry` 3、`demand` 10、`notification` 20、`organization_member` 6、`file_asset` 6。
- 受保护组织内自标记的测试 Inquiry 1 条（`204b6570`，[CONTROLLED TEST DATA]）。
- 测试参数定义 2 条（`E2E测试参数`、`TC715-1787693599528 枚举参数`）。
- `workflow_event` 63 条（operator=测试用户 或 测试业务实体时间轴）。
- `audit_log` 2789 条（operator=测试用户，经用户授权，见 §6）。

---

## 5. AMBIGUOUS（歧义集）

| 歧义项 | 事实 | 用户裁定 |
| --- | --- | --- |
| `5538dbde` 「SZ Wise Supplier」+用户 `vsndt@sz-wise.cn` | 英文测试桩组织；真实微视为 `697c99b2`（已保留） | **归类为测试并删除**（2026-09-07 用户确认） |
| `audit_log.operator_id` 2789 条强 FK（RESTRICT）指向待删测试用户，列 NOT NULL 无法保留关系 | 全部为测试/DEMO 用户产生的测试活动审计记录，非生产审计证据 | **删除这 2789 条测试用户审计**（2026-09-07 用户确认） |

> 依据 845 第一闸门「AMBIGUOUS > 0 不得盲删」，以上两项均在删除前取得用户明确授权，未发生盲删。

---

## 6. Backup（删除前备份证据）

备份目录：`F:\Desktop\VISNDT\VISNDT\_845_backup\`

| 文件 | 内容 |
| --- | --- |
| `bk_organization.csv` | 待删 6 组织 |
| `bk_user.csv` | 待删 6 用户 |
| `bk_org_member.csv` | 待删组织成员 6 |
| `bk_supplier_product.csv` | 待删 SupplierProduct 6 |
| `bk_demand.csv` | 待删 Demand 10 |
| `bk_demand_match.csv` | 待删 DemandMatch 5 |
| `bk_rfq.csv` / `bk_rfq_response.csv` | 待删 RFQ 5 / Response 4 |
| `bk_offer.csv` | 待删 Offer 1 |
| `bk_inquiry.csv` | 待删 Inquiry 3 |
| `bk_buyer_evaluation.csv` | 待删评估 1 |
| `bk_parameter_definition.csv` | 待删测试参数 2 |
| `bk_audit_test_users.csv` | 待删测试用户审计 2789 |
| `bk_workflow_test_users.csv` | 待删测试用户 workflow_event 63 |
| `pre_845_purge_20260906_222650.pgdump` | 保留的 dump 快照 |

> 说明：`pg_dump` 全量因 `vector`二方扩展（content.embedding）在容器内缺失而失败，故采用上述每表 COPY CSV 备份删除范围数据作为可恢复证据。

---

## 7. Controlled Purge（受控删除）

- 脚本：`VISNDT\_845_backup\purge_845.sql` + `purge_test_inquiry.sql`
- 执行结果：`PURGE_COMMITTED` / `TEST_INQUIRY_PURGED`（均为 `BEGIN…COMMIT` 单事务，原子提交）
- 每个 `DELETE` 按引用完整性（RESTRICT→CASCADE/SET NULL）顺序编排，任何一步失败即整体回滚。

| 顺序 | 操作 | 删除行数 |
| --- | --- | --- |
| 1 | demand_parameter | 13 |
| 2 | buyer_evaluation | 1 |
| 3 | rfq_response | 4 |
| 4 | offer | 1 |
| 5 | rfq | 5 |
| 6 | user_invitation（防御，RESTRICT） | 0 |
| 6b | workflow_event（测试用户 + 测试业务实体时间轴） | 63 |
| 7 | demand_match | 5 |
| 7 | supplier_product | 6 |
| 8 | inquiry | 3 |
| 9 | demand | 10 |
| 10 | notification（CASCADE） | 20 |
| 11 | organization_member | 6 |
| 11b | file_asset（uploaded_by RESTRICT） | 6 |
| 11c | audit_log（测试用户审计，用户授权） | 2789 |
| 12 | user | 6 |
| 13 | parameter_definition（注册测试参数） | 2 |
| 14 | organization | 6 |
| — | inquiry（自标记测试咨询） | 1 |

说明：`refresh_token`（441 条）随用户删除由 `ON DELETE CASCADE` 自动清除；`content`/`knowledge_entry`/`user_invitation` 对测试用户引用为 0，无额外操作。

---

## 8. Referential Integrity（引用完整性）

RESTRICT 强外键全部在删除前解决；删除后全局孤儿扫描全部为 0：

| 检查项 | 孤儿数 |
| --- | --- |
| organization_member.user_id / organization_id | 0 / 0 |
| notification.user_id | 0 |
| buyer_evaluation.user_id | 0 |
| refresh_token.user_id | 0 |
| workflow_event.operator_id | 0 |
| audit_log.operator_id | 0 |
| supplier_product.organization_id | 0 |
| demand.organization_id | 0 |
| content.author_id | 0 |
| conversion_event（无 FK 残留引用） | 0 |

---

## 9. Protected Data Verification（受保护数据核验）

| 校验项 | 期望 | 结果 | 状态 |
| --- | --- | --- | --- |
| admin@visndt.com（ACTIVE，未改） | 1 | 1 | PASS |
| 微视组织 `697c99b2`（ACTIVE） | 1 | 1 | PASS |
| 知象组织 `be7e5cd7`（ACTIVE） | 1 | 1 | PASS |
| 保留真实用户 | 8 | 8 | PASS |
| 待删组织（已 0 残留） | 0 | 0 | PASS |
| 待删用户（已 0 残留） | 0 | 0 | PASS |

---

## 10. Runtime Verification（运行时核验）

| 探测 | 结果 |
| --- | --- |
| API `/api/v1/health` | **200** `{"status":"ok","database":"connected"}` |
| Web `http://localhost:3000/` | **200** |
| 公共产品目录 `GET /api/v1/products` | 200，`total=4`（ZB-K60、ZB-TJ095、POP 4、MetroY Ultra），**无测试数据** |

---

## 11. 最终基线（Final State）与完成标准

| 指标 | 值 |
| --- | --- |
| 组织（ACTIVE） | 4 |
| 真实用户（不含 system） | 8 |
| Platform Product | 4 |
| SupplierProduct（微视/知象真实） | 6 |
| Demand（admin 真实 DRAFT） | 1 |
| RFQ（admin 真实） | 1 |
| Offer（微视真实） | 1 |
| Inquiry | 0 |
| demand_match / rfq_response | 0 / 0 |
| Content | 8 |
| Notification | 27 |
| WorkflowEvent | 15 |
| **AuditLog（保留）** | **1573** |

### 845 完成标准判定表

| 完成标准 | 结果 |
| --- | --- |
| admin@visndt.com | **PASS** |
| 微视 | **PASS** |
| 知象 | **PASS** |
| Protected Users | **PASS** |
| Non-protected Organizations = DELETED | **PASS** |
| Test Business Data = DELETED | **PASS** |
| No Orphan | **PASS** |
| Public Test Data Leak = NONE | **PASS** |
| Runtime | **PASS** |
| AuditLog = RETAIN | **PASS**（1573 条保留；仅删除测试/DEMO 用户产生的 2789 条测试审计，经用户授权，且已 CSV 备份） |

**最终判定：845 数据清理执行完成，Production Baseline 已就绪。**

---

## 12. 记录与治理同步

- 数据清理动作本身可审计：删除范围、删除行数、授权依据、备份证据全部记录于本报告；被删测试用户审计已备份至 `bk_audit_test_users.csv`。
- 无 Schema / Migration / API / Business Logic 变更。

---

## 13. Provisional Note（后续基线标记）

清理完成后，后续任务：
- **846 Real Product Value Density**（NEXT）：在真实保留产品与 6 个 SupplierProduct 上提升价值密度（主图 / 规格 / 应用 / 选型可比性）。
- 本报告不自动创建后续任务；845 完成后显式 STOP。

---

## 14. STOP

845 任务完结。

---

## 15. Post-845 Truth Correction Addendum（850 追加）

> 本附录用于修正 845 标题中「Test Data Purge / 测试数据清理完成」可能被误读为「ALL TEST DATA DELETED」的绝对性表述。**不修改 §1–§14 历史审计事实。**

**事实澄清**：845 实际完成了「ALL **IDENTIFIED / CONTROLLED** TEST / DEMO / E2E DATA PURGED」（受控、可识别测试数据清除 + 受保护基线保留），其范围见 §4 DELETE 集。该完成度**不意味着**「全部含测试字样的内容 100% 清除」。

**后续发现与补齐（850）**：
- 850 H04 发现 `product.description`（4 条真实公共产品）仍残留 `[M34.6 CONTROLLED TEST DATA][PUBLIC SOURCE DATA]` 前缀（845 时期处理对象为删除集行，未覆盖保留产品 description 的前缀）。
- 850 已对该 4 行执行**精确前缀受控清理**（保留真实业务正文，见 `docs/_review/850_Historical_Issue_Remediation_and_Closure_Report.md`），并完成残余扫描 = **0**。
- 因此当前精确、可证明的表述为：**ALL IDENTIFIED / CONTROLLED TEST / DEMO / E2E DATA PURGED（含 850 H04 对保留产品 description 前缀的受控清理）。**
- 845/850 的备份证据：845 = `_845_backup/`（删除集 CSV + pgdump）；850 = `_850_h04/850_h04_pre_product_backup.csv`（4 行 description 清理前快照）。

**不影响**：§1–§14 的删除范围、行数、授权、审计结论均保持有效。