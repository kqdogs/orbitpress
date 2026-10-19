# 本地定制改造与验收

日期：2026-10-19。项目运行在 `http://127.0.0.1:4321`；后台 `/admin`。未部署，未操作远程 D1/R2。

## 功能与入口

| 用户需求 | 实现与消费链 | 验证 |
| --- | --- | --- |
| 页脚去除内容管理 | `SiteLayout → SiteFooter`，所有前台页面统一复用 | 集成用例检查页脚无管理链接 |
| 后台明暗色、顶部操作 | `AdminApp → AdminShell`；Arco 主题属性、浏览器持久化；查看网站、主题、环境、账号、退出位于右上 | Chrome 切换与刷新后保留深色；390px 下操作区、抽屉正常 |
| 实时文章预览 | `EditorView → requestPreview → POST /admin/preview → ArticleContent + SiteLayout`，输入停止 450ms 后自动更新，旧请求取消、30秒超时提示 | 未保存标题/正文真实浏览器同步；桌面1200px、手机390px；预览不写库；未登录/跨站/无CSRF拒绝 |
| WP 风格固定链接 | `SiteCustomization → settingsInput → settings → permalinks → repository.resolvePostPath`，PostCard、首页推荐、后台查看、canonical、sitemap统一生成 | 八种格式真实HTTP访问；关闭格式404；错误日期/分类404；草稿隔离 |
| 首页装修 | 六区块开关、顺序、标题/副标题；推荐文章、首屏文案、横幅链接、视频列数及数量、图文数量、分类多选、新手步骤 | 保存→SSR顺序、开关、内容、分类和卡片数量断言；旧客户端遗漏新字段保留已存配置 |
| 分类图标 | 分类列表与选择器显示图标和中文标签 | Chrome查看表格及下拉；保持原有枚举值兼容 |
| 前台视觉与动画 | 共用 BrandBackdrop 星点/流星，头部渐变延伸首屏，导航呼吸光、页脚流光；视频裸卡、分类说明与紧凑页脚 | 对照原站桌面截图；头部连续截图变化；CTA与页脚动画名检查；390px菜单展开无裁切、横向溢出为0 |
| 少量测试数据 | `sample-posts.mjs`统一种子与本地清理保留集合 | 保留Maya、DITO、Roogoo、地址证明、AI工作流，共5篇；数据库外键检查通过 |

后台设置路径：左侧「站点设置」下方的「固定链接 · 访问格式」和「首页装修」。固定链接可多选；默认格式用于新生成链接，其他启用格式仍能访问同一已发布文章。自定义示例 `/guide/%postname%.html`。关闭旧格式后，对应旧URL返回404。

## 字段、兼容与安全审计

深度：跨前后台、设置持久化、公开路由和本地清理，按高风险影响面检查。本目录没有Git仓库，无法生成相对基线的Git diff；按真实文件与引用搜索追踪实现和消费方。

| 新字段 | 保存和读取 | 默认及兼容 | 边界 |
| --- | --- | --- | --- |
| `permalinkFormats`、`permalinkCustom` | 设置表JSON → schema → 后台选项/统一路由/链接/站点地图 | 默认文章名；旧请求未传时保留现值 | 至少一个、去重；自定义限本站，必须含一次文章名token；拒绝系统路径、脚本、路径穿越与未知token |
| `homeHero`、`homeSections` | 同上 → HomePage | 六个默认区块；旧JSON补默认，旧请求不覆盖 | 完整区块、唯一顺序、长度限制 |
| `homeOptions` | 同上 → HomePage与分类引用保护 | 自动推荐、4列、8视频、3图文、默认六步骤 | 数量有界；分类引用保存时原子检查；删除分类与设置保存通过版本条件互斥 |
| 后台主题 | 浏览器localStorage → Arco主题属性 | 未配置使用浅色，读写失败不阻断后台 | 不改会话或权限 |

已搜范围：`src`、`tests`、`scripts`，关键词 `postPath / matchPostPath / permalinkFormats / homeOptions / homeSections / settingsInput / configuredCategorySlugs / BrandBackdrop / 内容管理 / sidebar-bottom`。公开AI API继续使用现有文章契约；站点设置是管理员内部契约，AI密钥不能进入管理端。正式与预览内容继续经过Markdown清洗；iframe未授予脚本执行权限。预览中装饰动画脚本不执行，真实前台执行动画。

编辑链路覆盖：表单回显→校验→CSRF→版本条件保存→再次读取→前台SSR；旧设置请求兼容曾在集成测试发现失败，移除输入默认填充值后复验通过。删除链路覆盖：日常文章/分类仍为回收站；本轮用户要求清理的本地测试垃圾由专用脚本备份后删除，包括关联测试审计记录、幂等重放缓存和R2测试图片。保留分类导航及用户设置、上传图片，不新增表结构迁移。

## 测试证据

- `npm run check`：56 files，0 errors / warnings / hints。
- `npm test`：59/59，真实schema、链接规则、路径边界、Markdown与客户端安全处理；仅请求客户端测试使用fetch mock。
- `npm run test:integration`：56/56，真实本地workerd、D1、R2；报告 `test-results/integration.json`。含权限负向、CSRF、版本冲突、并发写、幂等、安全上传、预览、装修、链接及旧客户端兼容。
- `npm run build`：成功。Arco共享依赖仍有大于500KB的chunk提示，未做网络性能专项测量。
- Chrome实测：深浅主题、刷新持久化、分类图标、实时预览、1200/390px预览、前后台窄屏导航；当次前后台控制台error日志为空。
- 截图：`test-results/home-desktop.png`、`admin-live-preview.png`、`mobile-layout.png`。临时响应式验收页只用于本地测试，已从最终构建移除。

## 数据备份与恢复

首次清理前快照：`.local-backups/before-customization-2026-10-19T01-21-28-827Z/`，含 `database.sql`、D1/R2状态目录、清理SQL与结果。该次39篇→5篇，清除34篇文章、12个测试分类、24个已撤销测试密钥、11张未引用测试图片。后续清理移除118条历史测试幂等缓存；最终集成测试产生的夹具再次备份清理。

`node scripts/cleanup-local.mjs` 仅预演；`--apply`要求先停本地服务，自动备份后清理。只允许项目根目录、本地命令和已知测试数据，遇到未知文章即停止。恢复时先停服务，用备份中的 `state/d1`、`state/r2`同时恢复对应本地目录；SQL导出可用于离线恢复。未演练整库恢复，备份含本地认证状态，应保持私有。

## 审计结论与界限

本地已覆盖功能通过，有非阻断风险：Arco共享chunk较大；原站世界地图背景和动画是独立重做，尚未做像素级或逐帧差异验收。桌面与窄屏截图对照不能等同于完全一比一。真实手机硬件、跨浏览器、性能压测、生产环境配置和Cloudflare部署未验证。本轮没有触发部署。

使用技能：JavaScript/TypeScript、React、API、数据库、安全为实现must；test-engineering、code-audit为验证和收口must；本地Cloudflare/Wrangler用于模拟、备份及清理。部署与发布为conditional，本轮未执行；没有批量读无关技能。
