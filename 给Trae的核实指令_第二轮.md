# 给 Trae 的核实指令（第二轮）— 补齐覆盖矩阵里的空白

## 总原则（跟第一轮一样，不重复解释，直接执行）

只要原始证据（完整代码/命令+输出），不要总结。本次任务是核实，
不修改代码，不新建报告文件，结果直接发给用户。

---

## 0. 优先跑通 docker，拿真实 e2e 结果（最高优先级，放在最前面做）

```bash
docker compose up -d postgres minio
# 确认 apps/api/.env 与 database/.env 已配置
cd database && pnpm prisma migrate deploy   # 或项目实际用的迁移命令
cd apps/api && pnpm test:e2e
```

贴出完整的最终运行结果（通过/失败数量、每个失败用例的名称和首个
失败原因摘要）。如果这次也失败，明确说清楚失败原因是环境问题还是
真实断言失败（两者的错误信息形态不同，`PrismaClientInitializationError`
是环境问题，`expect(...).toBe(...)` 之类的是真实业务断言失败）。

---

## 1. supplier-products 治理审核完整逻辑（优先级最高）

```bash
cat apps/api/src/supplier-products/supplier-products.service.ts
```
完整贴出。这是产品型号审核工作流（DRAFT→SUBMITTED→REVIEWING→
APPROVED→PUBLISHED/REJECTED）的后端实现核心，之前只核实过路由清单，
没看过审批校验逻辑本身。

---

## 2. auth 完整流程

```bash
cat apps/api/src/auth/auth.service.ts
```
完整贴出（上次只看到 bcrypt 调用行号和两个辅助函数，register/login
主流程、refresh token 逻辑都没读过）。

---

## 3. 核心 CRUD service 完整代码

以下几个文件完整贴出（如果太长可分段）：
```bash
cat apps/api/src/offers/offers.service.ts
cat apps/api/src/organizations/organizations.service.ts
cat apps/api/src/users/users.service.ts
```

---

## 4. 内容与知识库

```bash
cat apps/api/src/content/content.service.ts
```
完整贴出，重点关注状态机（submit/review/publish/archive）的校验逻辑。

```bash
grep -c "async " apps/api/src/knowledge/knowledge.service.ts
```
先贴这个方法数量，如果文件不算长（参考这个数字判断），再贴完整内容；
如果很长，先贴出所有方法签名（`grep -n "async "`），我再挑重点让你贴。

---

## 5. embedding 实际实现

```bash
cat apps/api/src/embedding/embedding.service.ts
```
完整贴出，核对是否真的调用 OpenAI text-embedding-3-small、1536 维、
1000 字符分块这几个此前从 admin 前端文案里读到的细节，是否跟后端
实现一致（这些细节目前只有前端文案作为来源，从未被后端代码验证过）。

---

## 6. workflow-events 与 notifications

```bash
cat apps/api/src/workflow-events/workflow-events.service.ts
cat apps/api/src/notifications/notifications.service.ts
```

---

## 7. Prisma schema 剩余部分

上次只核对了约 250/1280 行（核心命名相关的几个 model）。这次请贴出
以下 model 的完整字段定义（不用贴全部 1280 行，只贴这几个 model 块）：
```
User、Product、Offer、Demand、SupplierProduct、Content、KnowledgeEntry、
Organization
```

---

## 8. 前后端联调抽查（可选，如果时间允许）

任选一个已核实的后端接口（比如 `POST /demands`），用 curl 或者
Postman 之类的方式真实调用一次（需要先有有效的 JWT，可以用
`admin@vip.com`/`admin123456` 登录拿 token，前提是 bcrypt 问题已解决
或者种子数据是直接写入哈希值绕过了 bcrypt），贴出真实的请求和响应，
验证一下文档里描述的字段和实际返回是否一致。如果 bcrypt 问题还没解决
导致登录都调不通，就跳过这一项，说明原因即可。

---

## 输出后怎么用

发给我之后，我会更新《后端核实覆盖矩阵.md》里对应模块的状态和证据来源，
并且检查这一轮有没有再发现类似"审计日志覆盖范围"那种文档与代码不符
的情况，同步更新 CLAUDE.md 和《项目全面技术文档》。
