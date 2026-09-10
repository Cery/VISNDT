# DECISIONS.md — 拍板记录

> 每条一行：日期：决策（原因）。目的：避免下一个工具/下一次会话重复发现与纠结。
> 本文件的治理规则：**在报告治理方案确定前，禁止新建编号报告**，执行结果只追加本文件 / ACTUAL_STATE.md / 执行记录.md。

- 2026-09-09：`v0.7-release-ready` 为 **annotated tag**，其 tag 对象 `368b1aa` peel 到 commit `168f353`。**此前"指向 368b1aa / tag 曾重打"的判读有误，已更正**（`git rev-parse` 对 annotated tag 返回的是 tag 对象哈希，非 commit）。与文档所记一致，从未重打，已推送 `origin`（Cery/VISNDT）。
- 2026-09-09：`allowBuilds`(bcrypt/sharp) **暂不放开**（真实机制已更正）。node_modules 已安装，`bcrypt@6.0.0` 已在 `.pnpm` 中；但其原生二进制 `bcrypt_lib.node` 缺失——由 `allowBuilds:false` 跳过 node-pre-gyp 构建所致，登录鉴权 `require('bcrypt')` 届时必然失败，属潜在阻塞。决策：待确需真实鉴权验证时再放开，并在原生 Windows 安装 VS Build Tools。此前"依赖未安装"的理由不成立，已更正。
- 2026-09-09：**报告治理锁定**——治理方案确定前，禁止新建 `<编号>_*.md` 报告；本次及后续核实结果只追加 `DECISIONS.md` / `ACTUAL_STATE.md` / `执行记录.md`，不再产出处新的编号报告。
- 2026-09-09：命名偏差最终确认——schema 使用 `ParameterGroup`/`WorkflowEvent`/`RFQ`/`RFQResponse`（无 StandardProduct/ParameterTemplate/WorkflowInstance/RFQItem），代码自洽；Blueprint 文档替代命名属文档漂移，按"蓝图被合理取代"处理，**确认不回溯改名**（涉 DB 冻结）。
- 2026-09-09：`_review/` 主目录重复编号（06/36/82/92/213）确认按**最小扰动方案**处理（参照 `06_Blueprint_v1_0_Change_Plan.md`：新报告顺延编号，对旧同号不做破坏性回填）。
- 2026-09-09：报告**索引范围确认**为两大主源——`docs/_review` 顶层 + `Content Management Guide`；不全量索引 908+ 份，只生成"编号/日期/主题/一句话结论/状态"。索引产物 `docs/_context/report_index.md`。
- 2026-09-09：suggested 清理基线——`Placeholder.tsx` 死代码已删除、`BusinessAnalytics.tsx` 9 处颜色字面量已修复（阶段八两项落地）。