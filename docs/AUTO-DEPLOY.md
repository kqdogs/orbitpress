# 自动创建 Cloudflare 资源并部署

## 按钮部署：无需手填应用配置

README 的按钮会识别默认 `build` / `deploy` 命令，Cloudflare 自动创建 D1、R2 并回写绑定。已删除用于声明必填 Secrets 的示例文件及未使用的 APP_ENV 表单项。默认资源名可直接保留。

`npm run deploy` 调用 `scripts/deploy-button.mjs`：核对实际绑定与构建一致性→读取已有 Secrets 名称→导出 D1 备份→按绑定 DB 迁移→检查内容与已有密文→仅生成缺失 Secrets→发布。密码摘要随机盐、加密密钥随机生成；新站默认 admin/123456，后台 /admin。已有配置不会重置；只要已有 API 密文而加密密钥缺失，就停止并要求恢复原密钥。

Secrets 不写入源码、构建产物或命令参数值，通过仅当前任务可读的临时 JSON 文件注入，结束或失败后删除。备份位于构建任务 .deploy/backups，任务结束可能被平台清理，长期备份需另行保存。重跑不清空文章、页面或设置；不执行 seed。

Cloudflare 登录、GitHub 授权和 R2 开通仍需账户本人完成。已打开的旧表单/已复制的旧仓库不会自动切换到新模板，需要重新从按钮进入或同步仓库。

## 本机 CLI 部署


本轮仅实现并在本地验证脚本，没有查询、创建或部署任何真实云资源。`npm run deploy:cli` 才会执行云操作；确认上线前只运行 `npm run deploy:check`。执行构建/预检前请停止本项目的开发服务，完成后再启动。

## 数据规则

- 本地 `wrangler.jsonc` 和 `.wrangler/state` 保持原样。生产使用独立生成的 `.deploy/wrangler.production.json`。
- 默认生产资源为 Worker `rinfinity-blog`、D1 `rinfinity-blog-db`、R2 `rinfinity-blog-media`。脚本按完整名称查询；存在就复用，不存在才创建。
- 首次新建生产库只执行 `migrations`，文章和独立页面均为0。脚本不调用演示 seed、不上传本地SQLite、不执行清库SQL。
- 后续部署保留线上文章、页面、设置及R2对象；迁移前导出D1到 `.deploy/backups`。备份、迁移、构建或校验失败就停止发布。
- 首次生产为默认站点配置，不自动迁移本地装修、分类、API密钥、上传媒体或其他本地记录。代码内的公共静态资源正常打包。需要同步装修和媒体时，应另做受控迁移；不能直接上传整个本地数据库。
- 若目标名称已经对应一个有文章的生产库，脚本保留已有内容。若确需清理已有线上内容，须另行核对目标和备份，不通过常规部署删除。

## 本地预检

```powershell
npm run deploy:check
```

依次执行类型检查、自动测试、生产配置构建和 `wrangler deploy --dry-run`。该入口不运行云端list/create/export/migrations，也不上传Worker或secrets，不需要生产密钥。使用占位账户ID和D1 ID，不能证明云权限、R2开通状态、实际绑定或HTTPS业务可用。

## 用户确认上线后

1. 先确认EleAdmin现有授权、静态素材使用范围和生产域名。
2. 本机使用 `npx wrangler login` 登录，或通过安全的环境变量配置 `CLOUDFLARE_API_TOKEN`。选择明确账户：

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = '你的32位Cloudflare账户ID'
npm run setup:production
```

`setup:production` 生成独立生产管理员和加密密钥。新安装默认账号 `admin`、密码 `123456`、后台 `/admin`；账号/密码保存在 `.deploy/admin.txt`，secrets保存在 `.deploy/secrets.json`，均不会打印；重复执行不会覆盖。首次上线后在后台修改密码。安全备份整个 `.deploy`，不要提交或公开，Windows上还应限制目录访问权限。

已有生产环境换电脑/CI时，必须恢复原 `.deploy/secrets.json`，不能重新生成 `API_KEY_ENCRYPTION_KEY`，否则原API密钥密文无法读取。原后台已修改的密码优先使用D1记录，初始化文件只记录初始密码。

可选资源名称在首次部署前指定，以后保持一致：

```powershell
$env:BLOG_WORKER_NAME = 'rinfinity-blog'
$env:BLOG_D1_NAME = 'rinfinity-blog-db'
$env:BLOG_R2_NAME = 'rinfinity-blog-media'
```

账户需开通R2。身份权限应覆盖目标账户的Worker发布、D1列表/创建/迁移/导出、R2列表/创建；权限或R2开通失败会中止，不会将鉴权失败当作资源不存在。

明确确认目标账户、资源名称及生产secrets后执行：

```powershell
npm run deploy:cli
```

脚本先执行本地质量检查，再创建/复用资源、构建并核对实际绑定、dry-run、备份已有D1、迁移、校验文章/页面数量，最后使用Astro生成的 `dist/server/wrangler.json` 发布并上传生产secrets。不会修改本地根配置，不会自动清理创建了一半的资源；失败后保留资源供同名重试。

执行后仍需HTTPS验收前台、后台登录/改密、文章、独立页面、媒体上传、固定链接及API连接。当前未完成云端验收，不将本地预检等同上线成功。

## 故障与恢复

- 错误返回非零退出码，停止后续步骤。`.deploy/deploy.lock` 防止同一工作目录并发部署；异常强制退出留下锁时，先确认没有部署进程，再删除锁文件。
- 部署过程最长每个子命令15分钟。超时可能已经创建远端资源，应先核对资源状态，再同名重试；不要更换名称重复创建。
- 该本地锁不协调多台机器；同一账户/Worker只能由一个发布端执行，CI应设置对应并发组。
- Worker回滚可使用Cloudflare版本管理，但不会回滚D1迁移或数据。必要时依赖受控备份前滚修复；恢复数据库前需单独确认影响。改密后禁止回退到忽略D1凭据版本的旧认证代码。
- 修改 `wrangler.jsonc` 为带注释JSONC前需同步脚本解析方式；当前仓库该文件是合法JSON。R2列表解析已按锁定的Wrangler版本验收，格式变化会失败中止，升级CLI时需复测。

官方核对依据：Cloudflare Wrangler D1、R2、Workers命令文档及本机锁定版本4.151.1的help/实现；Astro Cloudflare适配器14.3.0支持独立 `configPath`。
