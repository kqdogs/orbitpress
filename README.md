# 星笺 · OrbitPress

**让内容有自己的轨道。**

基于 Astro、Vue 和 Cloudflare Workers 的博客与内容管理项目。支持 Markdown 写作、独立页面、可视化装修，以及供外部 AI 与自动化工具使用的内容 API。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fkqdogs%2Forbitpress)

> 自有代码采用 MIT 许可；第三方组件与参考素材遵循各自授权，不包含在本项目 MIT 授权范围内，详见[来源与许可](#来源与许可)。

## 功能

| 模块 | 已有能力 |
| --- | --- |
| 内容管理 | 文章草稿与发布、分类、标签、摘要、重点提示、回收站恢复 |
| 写作体验 | Markdown 编辑、编辑/预览切换、快速写作、插入多个 YouTube / 哔哩哔哩视频 |
| 文章采集 | 输入 rinfinity.net 首页批量查找文章，或导入单篇；图片存入本站，可选分类，保存为草稿 |
| 视频资源 | 每篇文章可填写多条资源链接、优惠码和完整视频简介链接，前台展示可复制的资源卡片 |
| 独立页面 | 新建、编辑和发布页面，设置独立访问路径 |
| 可视化装修 | 统一切换首页、文章模板、关于页和独立页面；拖拽组件，配置正文与左右侧栏 |
| 品牌配置 | Logo、标题、副标题、页头导航、页脚、社交关注及社区卡片 |
| 前台体验 | 搜索交互、页头/页脚动画、阅读进度与返回顶部 |
| 后台管理 | Vue + Element Plus / EleAdmin 布局、二级菜单、主题切换、刷新保留路由 |
| 站点设置 | 文章固定链接、自定义文章路径、后台入口路径、修改密码 |
| 内容 API | 草稿写入、发布权限、版本校验、幂等写入、密钥创建/查看/撤销 |
| Cloudflare | Workers 服务、D1 数据库、R2 媒体存储、自动迁移与部署预检 |

AI 通过内容 API 接入：由外部工具完成内容生成，再按授权写入或发布。本项目目前不内置模型供应商，也不会主动调用付费模型。

新站默认名称为 **YaChin科技生活**，使用项目内的 Y 标识；社交与交流群地址默认留空，可在后台自行配置。

后台新建文章中的“采集文章”只填充当前草稿，不会自动保存或发布。来源限定为 `https://rinfinity.net/` 的单篇文章；单次最多导入 16 张图片、24MB 图片数据，失败的图片替换为待上传提示，不保留远程图片地址。请确认转载权限并检查内容后发布。

Markdown 代码块支持任意语言标记、缩进、换行和一键复制；编辑器提供常用语言选择，也可输入自定义语言名。这里的语言支持指代码原样呈现，不包含所有语言的语法高亮。YouTube 支持起播时间、隐私播放模式切换和原视频入口；播放器仍受 YouTube 的登录验证、地区及嵌入权限控制。

## 技术栈

- **前台与服务端**：Astro、Cloudflare Workers。
- **管理后台**：Vue 3、TypeScript、Element Plus、EleAdmin 组件与主题。
- **数据与媒体**：Cloudflare D1、R2。
- **内容处理**：Markdown 渲染与 HTML 清洗。
- **验证与工具**：Vitest、Miniflare、Wrangler。

## 本地运行

需要 Node.js **22.12.0 或更新版本**、npm。依赖版本以 `package-lock.json` 为准。

```bash
git clone https://github.com/kqdogs/orbitpress.git
cd orbitpress
npm ci
npm run setup:local
npm run types
npm run db:migrate
npm run dev
```

- 前台：`http://127.0.0.1:4321/`。
- 初始后台：`http://127.0.0.1:4321/admin`，可在后台修改入口路径。
- 新安装默认账号 **`admin`**、密码 **`123456`**，后台 **`/admin`**；凭据同时保存在 `local-admin.txt`。重复初始化不会重置已有凭据，请登录后修改初始密码。
- 本地数据库与媒体持久化在 `.wrangler/state`，生产不会自动读取它。

需要演示文章时，再单独执行：

```bash
```

新安装的导航、分类、文章、页面均为空。需要本地演示内容时可单独执行 `npm run db:seed`，生产部署不会运行它。空站先在后台创建分类，再创建文章。

## Cloudflare 一键部署

点击上方 **Deploy to Cloudflare**，登录 Cloudflare 并授权 GitHub，保持默认设置后点击部署。**无需手填管理员、密码摘要、API 加密密钥或构建/迁移命令。** 资源名称默认已提供，可按需修改。

部署流程会自动：

1. 根据 Wrangler 绑定创建 D1 数据库与 R2 桶，并将实际资源信息写入复制后的仓库。
2. 使用仓库默认构建和部署命令，备份部署数据库并应用迁移；新站不导入测试文章或页面。
3. 首次生成随机盐密码摘要和独立的 API 加密密钥，通过 Cloudflare Secrets 注入。
4. 后续部署复用已有 Secrets、管理员密码和线上内容；只补缺失配置。若已有加密 API 密钥但原加密配置丢失，会停止更新，避免破坏数据。

部署后访问 **`/admin`**，初始账号 **`admin`**、密码 **`123456`**，登录后修改初始密码，再设置站点信息、装修和内容。

账户需要先开通 R2。账户登录、仓库授权及账户内的资源名称冲突处理由 Cloudflare 平台要求，项目无法代为跳过。旧的部署表单会保留旧模板配置，请从本仓库的按钮重新进入；已复制的旧仓库需要同步更新。

按钮识别的默认命令（无需填写）：

| 阶段 | 仓库命令 |
| --- | --- |
| 构建 | `npm run build` |
| 部署 | `npm run deploy` |

`npm run deploy` 使用按钮回写的真实绑定和 Astro 生成的 `dist/server/wrangler.json`，不会读取本机 `.dev.vars` 或 `.deploy/secrets.json` 作为生产凭据。不存在全站共享的硬编码加密密钥。

临时凭据文件在发布结束或失败后删除；数据库备份放在构建任务的 `.deploy/backups`，不会提交到 Git。构建环境是临时的，长期恢复应另行保存数据库备份。首次生产不会自动迁移本地的装修、分类、API 密钥或上传媒体。详情见 [自动部署说明](docs/AUTO-DEPLOY.md)。

当前已完成本地隔离测试与构建，未执行这个按钮的真实云端部署验收。官方机制见 [Deploy to Cloudflare 文档](https://developers.cloudflare.com/workers/platform/deploy-buttons/)。

## 本机 CLI 部署

适合自行发布或更新已有站点。与上方按钮流程二选一；同一站点请使用一致的账户、资源名称和生产加密密钥。

先停止本项目开发服务，执行仅本地预检：

```bash
npm run deploy:check
```

确认部署后，登录并初始化生产凭据：

```bash
npx wrangler login
npm run setup:production
```

PowerShell 设置目标账户并部署：

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = '你的32位账户ID'
npm run deploy:cli
```

macOS / Linux：

```bash
export CLOUDFLARE_ACCOUNT_ID='你的32位账户ID'
npm run deploy:cli
```

CLI 默认使用 `rinfinity-blog` Worker、`rinfinity-blog-db` 数据库和 `rinfinity-blog-media` 桶；可通过 `BLOG_WORKER_NAME`、`BLOG_D1_NAME`、`BLOG_R2_NAME` 修改。按钮部署出的资源名称可能不同，接管更新前必须指定实际名称，并恢复原生产 Secrets。

脚本自动创建或复用 D1/R2、校验生产绑定、构建、dry-run、备份已有 D1、应用迁移并发布。任一步失败都会停止后续发布，已创建的资源保留供重试。详细步骤、并发与回滚边界见 [自动部署说明](docs/AUTO-DEPLOY.md)。

## AI 与自动化接入

在后台 **系统设置 → API 连接** 创建密钥。默认仅授予内容读写权限，发布需要单独授权。新密钥支持管理员再次查看和复制，也可撤销。

| 入口 | 说明 |
| --- | --- |
| `/api/v1/posts` | 文章读取、草稿创建及更新 |
| `/api/v1/posts/:id/publish` | 在具备发布权限时发布文章 |
| `/api/v1/categories` | 分类查询 |
| `/api/openapi.json` | 机器可读接口规范 |

完整约定见 [API 文档](docs/API.md)、[密钥管理说明](docs/API-KEY-REVEAL.md)。调用示例见 [`scripts/ai-client.mjs`](scripts/ai-client.mjs)，使用前设置 `BLOG_URL`、`BLOG_API_KEY`，并将示例的 `categoryId` 改为本站已有分类ID；新生产库没有演示分类。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm run check` | Astro、TypeScript 与 Vue 类型检查 |
| `npm test` | 自动测试 |
| `npm run build` | 生成生产构建 |
| `npm run preview` | 本地生产构建预览 |
| `npm run test:integration` | 对正在运行的本地服务进行集成验证，会创建测试记录 |
| `npm run test:studio` | 后台集成验证，会操作本地测试数据 |
| `npm run db:migrate` | 应用本地 D1 迁移 |
| `npm run db:seed` | 生成本地演示内容 |
| `npm run setup:production` | 生成本机保管的生产管理员与密钥 |
| `npm run deploy:check` | 仅本地生产预检，不创建云资源或上传 |
| `npm run deploy` | 按钮部署：自动迁移、生成缺失 Secrets 并发布 |
| `npm run deploy:cli` | 本机 CLI 自动创建/复用资源并部署 |

不要同时运行开发服务和构建/预检，以免 Astro 开发缓存冲突。测试与本地预检通过不代表云端权限、域名和实际业务已经验收。

## 项目结构

```text
src/
  components/         前台组件与后台界面
    studio/           后台布局、路由与独立功能页面
  lib/                内容服务、校验、认证与 API
  pages/              前台、后台入口与 API 路由
  styles/             公共样式与后台主题
migrations/           D1 表结构迁移
public/               静态资源
scripts/              本地初始化、部署和集成验证
tests/                自动测试
vendor/               当前使用的第三方组件源码与 runtime
docs/                 功能约定、部署说明和验证记录
wrangler.jsonc        本地绑定及按钮部署的资源模板
```

## 数据与账号

- 新安装默认账号 `admin`、密码 `123456`、后台 `/admin`；登录后请修改密码。现有安装不会被初始化脚本重置。每次安装仍使用独立随机盐和 API 加密密钥。
- 修改密码会使现有后台会话失效；新的密码摘要保存在 D1，优先于初始化摘要。
- 生产加密密钥不能在每次部署时重新生成。
- 文章与页面支持回收站，不应通过部署清库来整理内容。
- `.wrangler/`、`.deploy/`、`.dev.vars`、`local-admin.txt`、数据库备份与测试产物不得公开提交。

## 来源与许可

本项目自有代码采用 [MIT](LICENSE) 许可。该许可不覆盖以下第三方内容，也不授予第三方源码、商标与素材的额外使用权；完整范围见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

1. `vendor/ele-admin-plus` 包含 EleAdmin Plus Ultra 商业组件、runtime 和主题，来源见 [SOURCE.md](vendor/ele-admin-plus/SOURCE.md)。相应组件及复制的样式、布局预设遵循原作者授权，使用和再分发须自行取得适用许可。
2. `public/images` 中的参考站点图片与品牌资源不适用本项目 MIT 许可，来源见 [reference-manifest.json](public/images/reference-manifest.json)。正式运营请替换为自己的素材或取得相应授权。
3. npm 依赖各自遵循原许可证，本项目许可证不替代其声明。

仓库中不包含原站管理后台；前台视觉参考与第三方素材也不代表本项目与参考站点存在官方关系。

## 参与贡献

欢迎提交问题反馈和改进建议。反馈时提供复现步骤、预期结果、运行环境与经过脱敏的错误信息；不要上传账号、Token、Cookie、密码文件或数据库。

提交修改前运行 `npm run check` 和相关测试。涉及内容模型、API、数据库或部署流程时，请同步对应文档，并说明迁移与兼容影响。

## 部署参考

- [Cloudflare Deploy to Cloudflare 按钮](https://developers.cloudflare.com/workers/platform/deploy-buttons/)
- [Workers Builds 配置](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [项目部署说明](docs/AUTO-DEPLOY.md)
- [当前部署检查记录](docs/CLOUDFLARE-READINESS.md)

项目仓库：[kqdogs/orbitpress](https://github.com/kqdogs/orbitpress)。

### 文章采集与资源卡片

后台“内容管理 → 文章采集”，输入 rinfinity.net 首页地址，点击“查找文章”，勾选文章后点击“采集所选”。分类默认不分配，也可统一选择，保存后可逐篇修改。目录最多显示前 5 页、100 篇文章，逐篇下载并保存为草稿，不会自动发布。

队列显示每篇文章的处理结果，可停止、重试失败项。当前队列中成功项会跳过；保存结果不确定的项目使用原请求与幂等键重试。离开或刷新页面会清除当前队列，已保存的草稿保留；重新扫描不提供跨批次去重，请先检查已有文章。处理期间请保持页面打开。

“采集单篇文章”或“所有文章 → 采集文章”仍可输入单篇地址，填充编辑器后手动保存。当前来源适配仅支持 rinfinity.net。

采集保留文章标题和标签，将封面、正文图片存入本站媒体库（包含延迟加载图片）。单次最多16张图片、合计24MB，单图5MB；失败图片会显示提示。文章访问地址遵循本站固定链接，例如 `/%post_id%.html`，不沿用原站路径。页头始终保留独立的首页入口，分类和其他导航可自行添加。

来源标题中的分隔亮点会单独填入“文章亮点”，标签保留在文章标签字段。封面用于列表和视频海报，在文章正文中不再重复。图片会实际下载到本站 R2（本地调试为本地 R2 存储），正文使用本站 `/media/` 地址；失败时提示补传，不使用原站图片作为远程回退。

文章编辑右侧“本期视频提到的链接”可添加多条资源链接、可选优惠码及完整视频简介地址；保存后显示在文章右侧，无右栏时在正文底部显示。

文章和独立页面的“回收站”支持恢复、单项或批量彻底删除；分类回收站支持恢复和彻底删除，仍被文章或导航引用时会阻止删除。彻底删除不可恢复，保留共享媒体文件。
