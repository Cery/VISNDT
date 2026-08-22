# @visndt/identity-contract

VISNDT Business Identity Number System Contract **v0.1**（纯 TS，无运行时依赖）。

三层身份模型：`Database ID(UUID)` + `Business Identity Number` + `Human Readable Reference`。

## 编码规范

```
VIS-{TYPE}-{YYYYMMDD}-{SEQUENCE}
```

| 类型 | 前缀 | 示例 |
|------|------|------|
| PRODUCT | `PROD` | `VIS-PROD-20260821-00000001` |
| DEMAND | `DEM` | `VIS-DEM-20260821-00000001` |
| RFQ | `RFQ` | `VIS-RFQ-20260821-00000001` |
| OFFER | `OFF` | `VIS-OFF-20260821-00000001` |
| ORGANIZATION | `ORG` | `VIS-ORG-20260821-00000001` |
| USER | `USR` | `VIS-USR-20260821-00000001` |
| ASSET | `AST` | `VIS-AST-20260821-00000001` |
| CONTENT | `CNT` | `VIS-CNT-20260821-00000001` |

## v0.1 派生规则（DB Schema FROZEN）

- 日期段 = 记录 `createdAt`（`YYYYMMDD`）。
- 序列段 = 由现有 UUID **确定性派生**：取去分隔符后前 8 位 hex → 无符号整数 → 补零（默认宽 8）。
- 同记录恒等、跨记录唯一、无需任何数据迁移/新列即可展示，且可逆回 UUID。
- 契约同时支持显式 `sequence` 传入，供未来规范化分配（如持久化自增序列）。

## API

- `deriveIdentity({ type, id, createdAt?, sequence?, width? })` → 完整 `BusinessIdentityParts`
- `identityFor`（等义别名）
- `parseIdentity(str)` / `isValidIdentity(str)` → 解析 / 校验
- `deriveSequence(uuid, width?)` → 派生态
- `formatIdentity(parts)` → 组装
- `identityMeta(type)` → `{ type, prefix, label }`
- `shortIdentity({ type, id })` → 紧凑展示 `VIS-{PREFIX}-{后6位}`

## 禁止

- 不作为数据库主键 / 不替代 UUID / 不承载业务状态 / 不写入业务逻辑。