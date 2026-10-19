# 后台重构契约（仅本地）

后台入口：Astro 页面加载 Vue SPA，hash 路由为页面和编辑对象的唯一来源。EleAdmin、Element Plus 使用参考项目原组件与样式。旧查询地址转换为 hash。

| 接口 | 输入 / 输出 | 权限及失败 |
|---|---|---|
| GET /api/admin/pages | status、q；Page[]（最多 100） | 管理会话；400 非法查询 |
| POST /api/admin/pages | pageInput → Page，201 | 会话+CSRF；Idempotency-Key；400 校验、409 路径冲突 |
| PUT /api/admin/pages/:id | pageInput+version → Page | CSRF、版本；404/409 |
| POST /api/admin/pages/:id/{publish,unpublish,trash,restore} | version → Page | 草稿→发布→草稿；任意非回收站→回收站→草稿；非法流转409 |
| /api/v1/pages 同类接口 | 相同 DTO | Bearer scope；修改已发布需要 publish；外部禁止 trash/restore |
| POST /admin/content-preview | title/excerpt/body → HTML | 会话+CSRF，POST only，不落库，no-store |
| PUT /api/admin/settings | 原设置+可选 adminPath+version | adminPath 默认 /admin，旧客户端不传保留当前值；系统保留路径400，冲突409 |

PageInput：title/slug/excerpt/body/menuLabel 映射 pages.title/slug/excerpt/body/menu_label。id、status、version、日期、操作人由服务端维护。publishedAt 为 ISO UTC 或 null。回收站保留 slug，恢复为草稿。页面和文章 slug 互斥，后台路径不能占用任一内容 slug；数据库触发器兜底并发冲突。

新表 pages 独立于 posts，无级联删除及回填，不影响既有文章。本次已获本地迁移授权，迁移前通过 wrangler d1 export blog-db --local 导出一致性 SQL 备份到 .local-backups/blog-db-before-pages-20261019.sql，再执行 0004 / 0005 迁移。没有复制完整 state 目录。代码回退可保留新增表和触发器；整库恢复需先停本地服务、另存迁移后数据，将备份导入隔离的本地 D1 状态目录完成核对后再替换，不能将 SQL 直接重复导入现用数据库。恢复未实际执行，未经演练不声称可一键回滚。备份含会话及加密密钥，已由 .gitignore 忽略。不执行远端命令。

消费者：新 Vue 编辑器、列表、真实前台 PageContent、预览、API 自动化、OpenAPI、测试。旧前台文章和设置字段保留。无 App/SDK/队列/BI 消费者。测试覆盖 DTO、视频安全/代码块、权限、状态、版本、回放、冲突、发布访问、旧客户端设置保存和 hash 刷新。

## 页面装修契约（2026-10-19）

统一入口仍为 /home，通过 query.target 选择 home、article、about、default、page:{稳定页面ID}；刷新由 URL 恢复目标，切换沿用全局未保存保护。页面列表新增装修入口。所有目标共用 PageLayoutBuilder、组件库、区域列表、属性面板与实时画布；原 HomeBuilder 已删除。

| 字段 / 接口 | 约束与消费方 | 兼容及失败 |
|---|---|---|
| settings.pageLayouts | record，键为 home/article/about/default/page:{ID}；最多100个，总JSON最多48KB；复用settings JSON和version | 旧设置默认空对象；旧客户端PUT省略时保留原布局；关联页面不存在409 PAGE_NOT_FOUND |
| PageLayout | sidebar: none/left/right/both；width: standard/wide；main 0–12，left/right各0–8 | 首页禁止content，允许空画布；其他目标必须一个可见content且位于main；跨区ID唯一；非法400 VALIDATION |
| LayoutBlock | id/type/title/text/href/image/alt/limit/level/links/enabled；19种类型含正文，18种可添加组件 | 新增home-hero/promo/categories/videos/tutorials/notice；本站媒体、本站或HTTPS链接；Markdown沿用清洗；未知字段、类型、危险输入400 |
| POST /admin/page-preview | page: home/article/about/page；settings；可选postId/pageId；builder默认false | 会话+CSRF；140KB；不落库、no-store/noindex；页面不存在或回收站404；缺pageId展示模板样例 |
| POST /admin/content-preview | 原title/excerpt/body，加可选pageId | 沿用认证、CSRF、不落库；已保存页面传ID以使用专属布局，未保存页面用default |

前台由 ContentLayout / LayoutBlock 共用渲染。独立页面先用 page:{ID}，否则继承 default；article/about各自独立。无配置时直接渲染原正文。正文Markdown归原编辑器维护，装修不能删除或转移到侧栏；隐藏侧栏仍保留配置。恢复默认只移除配置键，保存后生效。

首页六个区块拆为 home/ 下的组件，经 HomeSection 在同一个 ContentLayout 渲染，其他模板也可添加这些组件。首页无 pageLayouts.home 时由 initialPageLayout 纯适配旧 homeSections 的顺序、显隐、标题和副标题，不自动写库；保存后以新布局为准，恢复默认移除该键。homeHero/homeOptions/notice 继续作为同类首页组件共享的数据设置，每个实例的标题、副标题、显隐、顺序、位置独立；后台明确提示共享范围。每次渲染按类型批量读取首页数据，不随实例数重复查询。旧 /admin/home-preview 保留并调用相同 HomePage。

分类链接引用检查包含所有区域的按钮和快捷链接；保留已有分类删除/改路径保护及设置版本条件，隐藏区也保留引用。公开v1 API、OpenAPI、SDK、数据表和平台配置未增加字段或迁移。

## 预览、页脚与文章链接（2026-10-20）

Preview.vue 共用独立设备视口：桌面1440px、手机390px，以ResizeObserver测量外部可用区域并缩放整个iframe。视口高度按比例增加，保留滚动与画布事件的iframe坐标。卸载释放observer和请求。后台面板宽度不再触发前台手机断点；真实前台响应式不变。

settings新增footerCopyright（GET默认空串，空值使用“© {year} {title}”）和footerNav（GET默认null，null沿用默认，数组自定义，[]隐藏）；旧客户端PUT省略保留。底部导航最多12项，label/href沿用安全导航规则。编辑入口在“页脚与关注”；恢复默认显式提交null。引用分类的页脚导航也会阻止分类删改路径。版权输出经过Astro转义，仅替换{year}/{title}。

categoryInput.icon增加ep:ElementPlusName白名单，保留8个旧图标值。白名单和静态SVG由scripts/generate-category-icons.mjs从已安装的@element-plus/icons-vue生成；无运行时外部请求。后台封装EleIconSelect，前台只输出对应本地SVG；未知值400。categories.icon现有字符串列不变，无迁移；公开分类只读API保持字段类型，OpenAPI描述补充ep:值语义。

文章兼容地址若仍在permalinkFormats中，GET 301跳转当前主链接；保留非p查询参数。主地址直接200，禁用格式404。canonical、卡片、分享链接和sitemap仍共用postPath。独立页面始终/{slug}/，不参与文章地址跳转；后台编辑器中的文章slug是文章别名，不代表最终URL。旧脚本的别名200断言同步为301并验证Location和最终正文。
