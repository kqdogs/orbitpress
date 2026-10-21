# 广告接入验证记录 · Advertising verification

日期 / Date: **2026-10-22**。范围：本地工作区中的 AdSense 接入及维护资料；本记录不代表 GitHub CI、正式 Release 或云端部署成功。

## 实际结果

| 检查 | 结果 |
| --- | --- |
| `npm run check` | Astro 检查 133 个文件，0 errors / warnings / hints；TypeScript 与 Vue 检查通过 |
| `npm test` | 29 个测试文件、355 项测试通过 |
| `npm run build` | 生产构建成功；已有较大 bundle 的提示仍存在 |
| `npm run test:ads` | 7 组隔离 Worker 集成测试通过 |
| `git diff --check` | 通过 |

集成测试使用临时内存 D1/R2，覆盖空站关闭默认值、验证 meta 与 ads.txt、管理员与 CSRF 保护、无效输入、版本冲突、公开广告位、条件 CSP、文章发布链路、后台与预览隔离、双语隐私页、旧客户端兼容和关闭/清空配置。测试不读取本地账号或线上数据库，不请求或点击真实 Google 广告。

## 审计与兼容

- 已检查设置 schema、API 合并与版本保护、存储读取、后台草稿保存、前台布局、装修组件、预览及翻译的调用关系。
- 集成测试发现 Astro 流式渲染导致布局响应头设置过晚；广告 CSP 判断已移到中间件，并通过原失败用例复验。
- 广告配置复用现有 settings JSON，无新增数据表；旧客户端省略广告字段时保留现有值。默认无发布商 ID，广告关闭。
- 后台只接收 ID 和经过清洗的隐私 Markdown，不允许粘贴任意脚本。Google 来源仅在启用广告的公开页面加入 CSP。
- 回滚旧布局 schema 前移除 `ad` 装修组件；关闭广告后，已保存 ID 的验证信息继续保留，清空 ID 后移除。

## 未验证与发布边界

尚无真实 AdSense 账号；站点审核、真实浏览器中的广告投放、CMP 消息、填充率与收入未验证。本地验证不包含生产部署、GitHub Actions、标签或 GitHub Release；GitHub 推送和 CI 状态以实际远端记录为准，首版说明仍为草稿。商业组件和参考素材的再分发许可仍按第三方声明处理，本记录不授予相关权利。

## English

Local validation on **2026-10-22** passed: Astro/TypeScript/Vue checks (133 Astro files, no diagnostics), 355 tests in 29 files, the production build, seven isolated Worker advertising integration groups and diff whitespace checks. The existing large-bundle warning remains.

The integration uses disposable in-memory D1/R2 and never accesses local credentials, production data or live Google ads. It covers configuration, authentication/CSRF, conflicts, public placements and CSP, published posts, admin/preview exclusion, privacy localization, legacy updates and disabling/clearing settings. An Astro streaming/header-order bug was fixed in middleware and the failing assertion now passes.

No live AdSense account, browser serving/CMP acceptance, approval, fill or revenue was verified. Local validation does not include cloud deployment, GitHub Actions, tags or Releases; verify push and CI status from the actual remote records. Release notes remain a draft. Third-party redistribution rights remain subject to their own licenses.
