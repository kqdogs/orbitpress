# EleAdmin 后台重构记录

日期：2026-10-19。仅本地运行，未部署。

## 实现

后台已切换为 Vue 3、Element Plus 和用户指定项目的真实 EleAdmin 组件。`vendor/ele-admin-plus/runtime` 来自参考项目 `es`，`vendor/ele-admin-plus` 保留原始组件源码。使用实际 EleProLayout、LayoutTool、EleCard 和 changeColor，不再保留 React / Arco 临时组件层。侧栏、顶部、主题抽屉分别封装；业务路由按独立 Vue 页面懒加载。

- 顶部工具、二级菜单、面包屑、页签、暗色、圆角和 14 套原始布局预设可切换。原始主题缩略图、设置项组件、抽屉样式和布局参数已沿用；业务状态与登录接口适配本站。未引入参考演示项目的账号管理、消息中心、多语言和背景皮肤模块。
- 文章与独立页面共用 ContentList / ContentEditor；WP 风格标题、状态筛选、批量回收/恢复和发布侧栏。分类为左侧表单、右侧表格，图标显示为实际 SVG 图标。删除仍有关联文章、导航或装修引用的分类会拒绝。
- Markdown 工具栏、快速提纲、概览快速草稿；编辑、预览、实时对照切换，350ms 防抖请求真实前台模板，预览不落库。快速提纲不调用外部 AI。
- 正文可插入多个 YouTube / 哔哩哔哩视频，支持 BV / av 和分 P。代码块保留视频短码原文；iframe 域名白名单与前台 CSP 配合。旧主视频字段继续兼容。
- 页面支持独立路径、草稿、发布、下架、回收与恢复；已发布页面加入 sitemap 和 canonical。文章、页面、后台路径冲突由预检查及数据库触发器保护。
- 页面装修统一切换首页、内容页和关于页；首页画布支持点击选择、指针拖动、键盘排序，预览更新保留滚动位置和选中描边。
- 保留品牌、页头、页脚、导航、固定链接、媒体、审计和 API 密钥再次查看；API 连接入口位于系统设置二级菜单。
- hash 为页面和编辑对象的地址来源；刷新保持当前位置。旧 `?view=` 地址自动转 hash；路由守卫保护未保存修改，并在组件卸载时注销。

## 数据与运行

用户已授权本地备份、迁移和测试。迁移前使用 Wrangler 本地 SQL 导出，备份为 `.local-backups/blog-db-before-pages-20261019.sql`（28440 字节）；实际备份方式是 SQL 导出，未复制完整 state 目录。已执行 0004_pages.sql、0005_content_paths.sql，原有数据没有重置。

本地后台：`http://127.0.0.1:4321/admin`。保留“本地编辑器验收”和“本地独立页面验收”两份草稿供检查。集成测试产生的内容移至回收站、测试密钥撤销、站点设置恢复原值。

## 验证

- `npm run check`：Astro / TypeScript / Vue 严格检查。
- `npm test -- --run --pool=threads --maxWorkers=1`：8 文件、112 项通过。
- `npm run test:integration`：56 项通过，覆盖认证、CSRF、版本、幂等、并发、分类、设置、媒体、发布与前台。
- `npm run test:studio`：10 项通过，覆盖页面状态、双视频、预览隔离、权限、路径、旧设置客户端、站点地图与设置恢复。
- `npm run build`：本地构建，产物仍有大于 500KB 的分包提示。
- Chrome 手工验收：文章保存与刷新、视频弹窗插入、预览、独立页面草稿、离开保护、暗色刷新持久化、圆角、卡片侧栏布局、分类图标、装修指针拖动与键盘排序、装修页面切换。

最终类型检查及构建日志：`.local-check-final.log`、`.local-build-final.log`；测试报告：`test-results/integration.json`、`test-results/studio-integration.json`。截图保存在 `test-results/studio-*.png`。

## 本地审计结论和边界

本次按数据库、接口、权限、状态和跨层契约进行较高深度审计。新增页面输入经过 Zod，服务端维护版本、发布状态和日期；管理写入需要会话与 CSRF，外部接口需要 Bearer scope；已发布修改额外要求发布权限，外部接口不能回收/恢复。写入经版本与幂等保护，未知数据库异常保持失败，路径触发器冲突映射 409。页面和文章的公开读取仅允许 published。

直接追踪 schema → API → service → SQL → repository → Vue 编辑器/列表 → Astro 前台/预览 → OpenAPI → 测试。没有 Git 仓库，未生成或声称 git diff / commit。源文件和运行结果作为审计证据。没有 App、队列或 BI 消费者。

审计结论：有非阻断风险，本地核心流程验收通过。生产部署、Cloudflare 远端绑定、真实域名、真机和跨浏览器、外部视频在当地网络的实际播放尚未验收。页面列表接口最多 100 项；前台站点地图最多包含 10000 篇文章和 10000 个页面。组件包当前显示 ELE ADMIN PLUS 授权水印和控制台授权提示，原授权机制保留，后续正式使用需要有效授权。

## 最终需求对账

| 需求 | 实现与调用链证据 | 验证证据与剩余缺口 |
| --- | --- | --- |
| 使用参考后台的真实组件、侧栏、顶部和主题 | `vendor/ele-admin-plus/SOURCE.md` → `entry.ts` → `layout/StudioShell.vue` / `StudioTopbar.vue` / `ThemeSettings.vue`；`astro.config.mjs` 指向原 runtime | 类型检查、构建及 Chrome 主题/圆角/布局切换；原授权水印保留，背景皮肤等演示模块未移植 |
| WP 风格文章、分类与新建页面 | 独立 `pages/*.vue` → `shared/ContentList.vue` / `ContentEditor.vue` → `api-controller.ts` → `page-service.ts` → `0004_pages.sql` / `repository.ts` | 文章/页面保存与刷新手测；56 项原集成和 10 项后台集成覆盖发布、版本、幂等、回收与恢复；页面列表上限 100 |
| 好用的 Markdown、快速写作、多视频 | `shared/MarkdownEditor.vue` / `ContentEditor.vue` → `video.ts` → `lib/markdown.ts` → 真实前台与预览 | `studio-content.test.ts`、`markdown.test.ts` 和集成验证多个 iframe、分 P、非法地址、代码块原文；实际外网播放未验收；快速写作提供提纲与草稿 |
| 编辑/预览切换与实时预览 | `ContentEditor.vue` → `shared/Preview.vue` → `/admin/preview` / `/admin/content-preview` → 前台模板；请求取消、防抖、卸载清理 | Chrome 预览验收；集成验证未保存内容不落库和 CSRF；手机真机未验收 |
| 后台路径及刷新保留当前页面 | `schema.ts` → `content-path.ts` → `api-controller.ts` → `0005_content_paths.sql`；`admin.astro` / `[...path].astro`；hash router 与 `StudioApp.vue` 守卫 | 后台路径集成、旧客户端字段兼容、`settings-race.test.ts` 竞争错误映射；Chrome 路由刷新及未保存离开保护 |
| 保留装修及已有设置 | `pages/Builder.vue` / `Settings.vue` / `Integrations.vue` → 既有设置与 API；`settingsDraft.ts` 保留版本和 dirty 状态 | 原集成覆盖设置/装修/分类引用保护；Chrome 画布指针与键盘排序；左侧 HTML 拖拽未单独通过手测 |
| 只本地迁移和测试、不部署 | SQL 备份 → 0004 / 0005 本地迁移 → 本地 D1 → `scripts/studio-integration.mjs` | 备份文件 28440 字节、页面链路集成通过；测试后恢复设置并撤销测试密钥；备份恢复未演练，远端未操作 |

最终复核仅补充审计记录，没有再次修改业务源码。构建大分包提示保留；本地后台 HTTP 检查返回 200。全部验证记录只代表本地环境，不构成生产部署验收。
