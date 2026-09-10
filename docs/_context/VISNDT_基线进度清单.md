# VISNDT 基线进度清单（M11.3 → M13.2）

> 用于：交接的"已核实基线"起点。由 `docs/_review/161-165` 原始报告重建 + 后续已核实修正。
> 原 `VISNDT_M11.3-M13.2_实际进度清单.md` 未在仓库检索到，按 2026-09-09 决策用本文件落位 `docs/_context`。

## M11.3 System Closeout（基线锚点，已核实）
- 22 controllers / 83 endpoints（M11.3 时点快照；**当前实测已推进至 48 controllers / 275 endpoints**，见 ACTUAL_STATE.md）
- 30 admin 路由 / 页面
- 回归测试 234/234 通过
- 业务能力 10/10
- 相关报告：161_Regression_Plan / 162_API_Regression / 163_Frontend_Regression / 164_Workflow_E2E / 165_System_Closeout

## M12 Release
- 本地打 tag `v0.7-release-ready`（annotated tag，指向 commit `168f353`；tag 对象 `368b1aa` peel 到该 commit，从未重打）
- 2026-09-09 已推送 `origin`（DECISIONS.md）

## M13.1 Product Center Enhancement（已核实）
- ParameterGroup / ParameterDefinition / ProductCategory 后台 CRUD，9 个页面，0 后端改动
- 已知限制：ENUM 参数无 Option 管理 UI（核实：仍缺失）

## M13.2.6
- 发现并部分修复 `GET /files/:id` 缺失（前端转内联数据绕过，后端接口仍未补；核实：`GET /files/:id` 元数据仍缺失）

## 采用的序号衔接
当前 `_review` 最新编号 853；新编号报告已停用，改用本清单 + DECISIONS.md / ACTUAL_STATE.md / 执行记录.md 追加记录。