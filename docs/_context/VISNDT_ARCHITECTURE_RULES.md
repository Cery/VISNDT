# VISNDT Architecture Rules

> 最后更新: 2026-07-22
> 目的: AI 协作开发时的架构约束与规则

---

## Frozen Areas

以下区域**禁止修改**：

| 区域 | 路径 | 说明 |
|---|---|---|
| Backend | `apps/api/` | NestJS 全部模块 |
| Database | `database/prisma/` | Schema + Migrations |
| Auth | `apps/admin/src/auth/` | 认证模块 |
| Auth Store | `apps/admin/src/stores/auth.store.ts` | 认证状态 |
| Router Structure | `apps/admin/src/router/index.tsx` | 路由结构（仅允许添加新路由） |
| Layout | `apps/admin/src/layouts/AdminLayout.tsx` | 管理布局 |
| Axios Client | `apps/admin/src/api/client.ts` | HTTP 客户端 |
| Dependencies | `package.json` | 不新增 npm 依赖 |

---

## Allowed Changes

以下区域**允许修改**：

| 区域 | 路径 | 说明 |
|---|---|---|
| Pages | `apps/admin/src/pages/` | 新建/修改页面组件 |
| API Services | `apps/admin/src/api/` | 新建 Service 文件 |
| Types | `apps/admin/src/types/` | 新建/扩展类型定义 |
| Barrel Exports | `*\/index.ts` | 更新导出 |
| Router Entries | `apps/admin/src/router/index.tsx` | 仅添加新路由，不修改现有结构 |

---

## Development Rules

### TypeScript

- **零 `any`**: 所有类型必须明确声明
- **零 `TODO`**: 不遗留待办注释
- **零 `FIXME`**: 不遗留修复标记
- **Strict Mode**: 所有 TypeScript 严格检查

### Code Quality

- **零死代码**: 无未使用的导入、变量、函数
- **零重复逻辑**: 遵循 DRY 原则
- **命名一致性**: 使用项目统一的业务术语
- **注释密度**: 关键函数需要 JSDoc 注释

### Build

- **每次修改后验证**: `pnpm --filter @visndt/admin build`
- **Exit Code 必须为 0**
- **不引入新的构建警告**

### Architecture

- **单向依赖**: Page → Service → Types → API Client
- **无循环引用**
- **Barrel exports**: 所有公共 API 通过 `index.ts` 导出

---

## Page Development Template

所有 Admin 页面必须遵循以下模板：

```typescript
// 1. 状态定义 — discriminated union
type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SomeType };

// 2. 数据获取 — useCallback 包装
const fetchData = useCallback(async () => {
  setPageState({ status: 'loading' });
  try {
    const data = await someService.getData();
    setPageState({ status: 'success', data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load data';
    setPageState({ status: 'error', message });
  }
}, []);

// 3. 挂载请求 — useEffect
useEffect(() => { fetchData(); }, [fetchData]);

// 4. 条件渲染 — 3 种状态
if (pageState.status === 'loading') return <Spin />;
if (pageState.status === 'error') return <Alert type="error" action={<Button onClick={fetchData}>Retry</Button>} />;
// success: render data
```

---

## API Service Template

```typescript
import { apiClient } from './client';
import type { SomeType } from '../types/some.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const someService = {
  async getData(): Promise<SomeType> {
    const response = (await apiClient.get('/path')) as unknown as ApiResponseWrapper<SomeType>;
    return response.data;
  },
};
```

---

## Business Terminology

| 正确 | 错误 | 说明 |
|---|---|---|
| Organization | Supplier | 组织 |
| Demand | Requirement | 需求 |
| RFQ | Inquiry / Matching | 询价 |

---

## Security Rules

- **认证链路**: RequireAuth → JWT Token → Backend JWT Guard
- **授权**: RolesGuard 验证 ADMIN 角色
- **组织隔离**: organizationId 从 JWT 派生，不接受客户端传入
- **Token 过期**: 三层防御 (Rehydration → Route Guard → Backend 401)