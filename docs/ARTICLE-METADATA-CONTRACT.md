# 文章标签和亮点契约（本地）

目标：截图标题区统一用于实际文章、编辑器实时预览、装修预览；独立页面不新增文章字段。

| 字段/接口 | 请求与结果 | 兼容、权限和失败 |
|---|---|---|
| POST/PUT /api/admin/posts 及 /api/v1/posts | 新增可选highlights:string[]，最多6、单条trim后1–40；返回数组 | 创建缺省[]；更新省略保留旧值；[]清空；null/超量400 VALIDATION。原content:write/publish、CSRF、Idempotency-Key、version保护和状态审计不变 |
| POST /admin/preview | 接受同一可选highlights，与标签一起使用同一ArticleHeader | 仍需会话/CSRF，不保存、no-store；旧请求省略时仅预览兼容摘要 |
| GET /api/admin/tags | 无query，返回data:[{name:string,count:number}]，最多100，按使用篇数降序和名称排序，排除回收站 | 管理员会话及content:read；401/403沿原模型；只读、不调用远端模型 |
| GET /?tag=编码标签 | 最多30字符，按posts.tags精确筛选已发布文章（英文ASCII忽略大小写） | 空/过长400，空结果200；分页保留tag和s，草稿/回收站不公开；未知cursor沿原400 |
| GET /api/admin/posts及/api/v1/posts?tag=... | 新增可选tag过滤；使用原分页与状态范围 | scope仍为content:read；非法过滤400；OpenAPI增加tag参数 |

数据模型：posts拥有0–6个展示亮点，归文章作者编辑，非敏感内容；随文章草稿/发布/回收站流转。highlights是新增nullable TEXT JSON数组列，NULL仅标识迁移前旧数据；读取时从既有excerpt的“·”分隔短句转换为数组，不回写摘要。新文章持久化[]；编辑已有文章会明确回显兼容亮点。显式[]不回退；旧PUT省略保留。原posts.tags JSON数组不改表，最多8个，每个30字。

消费者：ContentEditor/ArticleMetadataFields/TermInput→post schema→content-service参数化写入→repository转换→公开/管理API、ArticleHeader、HomeHero；PostCard和ArticleHeader的标签统一链接tagHref。OpenAPI由postInput/postUpdate自动生成，ai-client示例增加highlights。无APP、报表、外部SDK、队列或缓存模型；未删除旧字段。

自动生成在浏览器本地根据文章标题/摘要/正文和常用标签提取词语，按钮触发，保留手工项且总数不超过8；不是外部AI服务，不会自动保存或发布。常用标签来自管理员只读接口，包含草稿但不向公开标签归档暴露草稿。

本地迁移前实查：0001–0005已执行，posts共18行（发布5、草稿1、回收站12）；原article布局未保存。当前表/索引/触发器见.local-article-schema-before.json。新增列不需索引、回填或重建文章，NULL延迟兼容读取；原事务、分类外键、路径冲突触发器和版本条件不变。规模小且仅本地开发，迁移暂停写入；如失败停止，不叠加下一次迁移。线上规模/QPS/锁窗口待部署前另验。

备份：.local-backups/before-article-metadata-20261020.sql，含私有本地会话，禁止提交。脚本verify-article-migration.mjs在独立内存库导入备份、演练迁移/约束/恢复，不接触原数据。实际执行仅本地wrangler migrations apply；回滚代码时保留兼容新增列，完整恢复只在停服后按验证备份进行，不能直接DROP列当数据回滚。
