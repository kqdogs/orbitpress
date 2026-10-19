# Cloudflare 部署检查（2026-10-20）

本次更新实现按钮部署时免填写应用密钥。未执行真实 Cloudflare 部署、资源查询或资源创建。

## 按钮流程

- 已移除声明必填 Secrets 的 .env.example；根 Wrangler 中未使用的 APP_ENV 变量也已移除。
- Cloudflare 自动识别 npm run build / npm run deploy，自动创建 D1/R2 并回写绑定。
- scripts/deploy-button.mjs 核对源配置与 Astro 构建绑定一致，按 DB 绑定迁移；首次生成 admin/123456 的随机盐摘要与独立随机 API 加密密钥，使用临时文件注入 Cloudflare Secrets。
- 更新保留已有 Secrets 和线上内容，只补缺失字段。原加密密钥遗失且数据库已有密文时拒绝生成替代密钥。
- 默认后台 /admin。登录后应修改初始密码；账户授权和 R2 开通仍由 Cloudflare 要求。
- 本机部署入口为 npm run deploy:cli，保留原独立配置、凭据备份和部署预检流程。不要将它填写为按钮部署命令。

## 已执行验证

- npm run types：生成绑定类型，移除未使用的 APP_ENV，保留实际管理员 Secrets 类型。
- npm run check：Astro 96 文件零错误/警告/hint，TypeScript 与 Vue 类型检查通过。
- npm test：19 个文件、215 项测试通过。
- npm run build：成功；保留现有后台 bundle 大小提醒，未做无关拆包修改。
- wrangler deploy --dry-run：成功，37 个模块，上传体积约1643.73 KiB，gzip429.20 KiB，正确识别 DB、MEDIA、ASSETS；未发布。
- tests/button-deploy.test.mjs：表单声明删除、首次凭据生成、独立随机盐/加密密钥、重复部署、部分配置、配置遗失、失败中止、临时凭据清理、进程错误脱敏、绑定一致性及并发锁。
- 真实隔离 D1：全部迁移后文章/页面为空，默认登录→改密→创建 API 密钥→再次部署→新密码登录和原密钥解密，文章与独立页面保留。

## 剩余验证与恢复边界

Cloudflare 的真实账户权限、资源开通状态、部署向导及 HTTPS 业务未验收，本地预检不能证明云端已部署。已有打开的旧向导需从 README 按钮重新进入；旧复制仓库需要同步新版。

本次不修改数据库 schema 或业务认证接口，不重置现有密码。失败会停止发布并清理临时 Secrets 文件；已有 D1/R2 和内容保留。数据库备份保存在部署任务 .deploy/backups，构建环境可能回收该目录，长期恢复需要独立保存备份。代码回滚不会恢复被删除的云端 Secret，请安全保管生产密钥。

第三方组件与参考素材仍遵循 THIRD_PARTY_NOTICES.md，不因部署脚本修改而获得额外授权。
