# 本地实现范围

## 布局基线
Page = Header[Brand + Social; Navigation] + Main(max=1200) + Footer
Home = Hero[Featured(7/12); Onboarding(5/12)] + Banner + Categories + VideoGrid(4) + TutorialGrid(3)
Listing = Title + CategoryTabs + ContentGrid(4) + Pagination
Article = DarkTitleBanner + Columns[TOC; Markdown+Video; ResourceCards]
Mobile(<760) = CompactHeader + SingleColumnHero + Grid(1/2) + StackedArticle
Admin = Sidebar + Toolbar + Workspace[Dashboard | Posts | Editor | Media | Categories | Settings | Integrations | Audit]

前台 Astro SSR；后台 React 客户端岛；服务端使用 Cloudflare Workers 运行环境。D1 是内容、会话、API 密钥和审计的唯一数据源；R2 保存上传图片。所有绑定仅本地模拟。兼容日期使用本地模拟器已支持的2026-10-18。

## 数据模型与访问路径
categories 1:N posts；posts 有 draft/published/trash 状态及 version 乐观锁。slug 永不复用（回收站也保留），正文为 Markdown。published_at 是 UTC ISO 时间。作者为单站点管理员。演示文章不是正式教程。
sessions 与 api_keys 保存 SHA-256 指纹；新建 API key 另外在 api_key_secrets 保存 AES-GCM 密文，管理员可再次查看，认证仍只用指纹。独立加密 secret 保存在环境配置中。管理员密码存 PBKDF2-SHA256。API key scopes 为 content:read/content:write/content:publish。
audit 保存操作者类型、动作和资源编号，不记录正文、凭证或 Cookie。media 为图片元数据，桶不公开，文章引用的图片通过应用读取。
idempotency 记录请求指纹与响应，24小时有效；与文章写入使用 D1 batch 同一事务。版本不匹配返回409。

初始演示数据为13篇文章、8个分类；测试另外创建可恢复的回收站夹具和1篇浏览器验收草稿。初期假设一年1万文章、每天100次写入，读多写少，待真实流量验证。索引包含 status/published_at/id、category/status；本地 EXPLAIN 确认公开列表按status走索引，但 COALESCE 排序仍使用临时B树，尚未做规模负载验证。搜索限100字符、列表每页最多24，后台每次加载最多100；小站标题/摘要 LIKE 搜索，未来增长后再评估全文索引。
初始迁移新增表；0002 为分类新增 deleted_at / last_operation 和文章分类有效性触发器，已有分类默认保持有效。后台支持分类回收站，前台和 AI 默认只读取有效分类。本地迁移前保留数据库备份。生产备份/恢复、流量容量与部署均待用户确认后验证。

## 安全边界
管理接口由 HttpOnly SameSite=Strict Cookie + 每次写入 Origin 和 CSRF header 校验。自动化接口只接受 Bearer API key，按scope授权，不复用Cookie。所有输入服务端严格schema校验，SQL值绑定；Markdown在服务端白名单清洗；上传仅允许PNG/JPEG/WebP并检查magic和5MB上限，拒绝SVG。
管理入口不提供公网注册。setup脚本只创建本地凭证；上线前需独立配置真实身份与环境。原站后台未访问，本项目后台独立实现。

## 当前边界
不调用模型供应商，不产生模型费用；预留内容API供任意AI Agent接入。没有部署脚本自动执行、没有云资源创建。视觉参考图片仅用于本地比对，正式上线素材来源与品牌由站点所有者确认。
