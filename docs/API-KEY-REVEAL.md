# 管理员再次查看 API 密钥

范围：仅本地实现与验证；不部署、不重置现有内容或密钥。

## 接口契约

沿用 REST 管理接口与统一 `{data}` / `{error:{code,message,requestId}}` 响应，仅后台工作台消费。自动化 `/api/v1` 契约不变。

- `GET /api/admin/keys`：原列表字段保留，增加布尔 `canReveal`。不返回明文、哈希或密文。最多 100 条，按创建时间倒序。
- `POST /api/admin/keys`：原输入 `{name,scopes,days}` 与输出 `{id,token}` 保留。新增 AES-GCM 加密存储；缺少有效加密配置时返回 503 `KEY_ENCRYPTION_CONFIG`，不创建记录。每次主动提交创建一条新连接，前端锁定提交且不自动重试；超时后先刷新列表确认。
- `POST /api/admin/keys/:id/reveal`：无请求体；返回 `{id,token}`。要求管理员会话、精确同源 Origin、CSRF，Bearer 密钥无管理权限。每管理员每分钟至多 30 次；返回 `Cache-Control:no-store`，审计仅保存操作者、动作、资源 ID 和时间。
- `POST /api/admin/keys/:id/revoke`：原 `{ok:true}` 保留，原子撤销并删除加密副本；重复撤销幂等。
- 错误：401 `UNAUTHENTICATED`；403 `ORIGIN`/`CSRF`；404 `NOT_FOUND`；409 `KEY_UNAVAILABLE`（过期、撤销或查看期间状态改变）、`KEY_NOT_RECOVERABLE`（旧密钥只有哈希）；429 `RATE_LIMIT`；503 `KEY_ENCRYPTION_CONFIG`/`KEY_DECRYPTION_FAILED`。

## 数据与兼容

新增 `api_key_secrets`，以 `key_id` 主键关联 `api_keys(id)`，一对零或一；`encrypted_token` 为非空版本化密文。认证继续只查 SHA-256 哈希。旧行不改、不回填。创建密钥、加密副本和审计放在同一 D1 batch；撤销与副本删除也在同一 batch。查看时再次校验有效状态，避免撤销竞态。按主键查询，无新增扫描或索引需求，容量与密钥数线性增长。

AES-GCM-256 使用独立 `API_KEY_ENCRYPTION_KEY`（64 位十六进制 secret），每条随机 12 字节 IV，AAD 绑定版本和 key ID；密文带 128 位认证标签。环境 secret 不写入源码、D1、localStorage 或日志。浏览器只在页面内存短暂保留明文，隐藏、切页、切后台清除；再次查看重新鉴权获取。

迁移为增量建表，兼容旧应用；本地执行前导出数据库备份。回退可恢复旧代码并保留新增表，认证不依赖密文；不得删除 secret 或覆盖原加密配置，否则已存密文无法恢复。生产 secret 配置、轮换与远端迁移留待部署确认后处理。

## 验收

加密往返、随机 IV、错误密钥/AAD/篡改拒绝；真实本地创建、重复查看、列表脱敏、未登录/CSRF/跨站/Bearer 拒绝、过期和撤销拒绝；旧哈希认证不变；本地桌面/手机 Arco 页面、切页重新查看、主题、编辑预览与装修回归。测试只创建并清理带专用前缀的测试记录，不操作已有密钥。
