# 内容 API v1

所有JSON成功响应 `{data: ...}`；失败响应 `{error:{code,message,requestId}}`。不返回数据库异常。
路径前缀 `/api/v1`；所有写入Content-Type为application/json，正文最大300KB，未知字段拒绝。UTF-8 Markdown最多100000字符。无跨域授权。

## 管理员
POST /api/auth/login `{username,password}` → Cookie + `{data:{csrf}}`；GET /api/auth/session → 当前身份和CSRF；POST /api/auth/logout → 撤销会话。
管理请求 `/api/admin/*` 使用Cookie。写请求必须同源Origin并带 `X-CSRF-Token`。

## AI 与自动化
请求头 `Authorization: Bearer <token>`。密钥由后台创建，默认不授予发布权限；可立即撤销。新密钥加密保存，管理员可再次查看和复制；旧哈希密钥继续有效但无法还原。管理接口与加密配置见 `docs/API-KEY-REVEAL.md`。

|方法|路径|权限|输入/结果|
|---|---|---|---|
|GET|/api/v1/posts|content:read|status可选draft/published/trash，limit默认12最多24，cursor为上页nextCursor，返回items/nextCursor|
|GET|/api/v1/posts/:id|content:read|单篇文章|
|POST|/api/v1/posts|content:write|PostInput，始终创建草稿，201|
|PUT|/api/v1/posts/:id|content:write|完整PostInput + version；修改已发布文章还需content:publish；更新保持现有状态|
|POST|/api/v1/posts/:id/publish|content:publish|`{version}`，草稿→已发布|
|POST|/api/v1/posts/:id/unpublish|content:publish|`{version}`，已发布→草稿|
|GET|/api/v1/categories|content:read|分类列表|

PostInput = `{title,slug,excerpt,body,categoryId,cover,videoId,featured,tags,highlights?,resources?}`。
title 1..180，slug为小写英文/数字/连字符，最多120且保留系统路径；excerpt最多500；cover为空或本站 /media/、/images/路径；videoId为空或11位YouTube ID；tags最多8个各30字符；featured布尔。拒绝null，清空用空字符串/空数组；不接受status、author或createdAt。

`resources` 为 `{title,items:[{label,url,code}],descriptionUrl}`：标题 1..80 字；最多 12 条资源，label 1..100 字、code 最多 100 字，url 必须为无登录凭据的完整 HTTPS 地址。descriptionUrl 可为空或 HTTPS 地址。创建时省略为空卡片，更新时省略保留旧值；清空时传入 `items:[]` 和 `descriptionUrl:''`。编辑器、未保存预览、前台与内容 API 共用此结构。

管理员专用采集接口 `POST /api/admin/imports`，请求 `{url}`，返回 `{data:{article,sourceUrl,warnings}}`。需要管理员 Cookie、同源 Origin 与 CSRF，API 密钥不能访问。只允许 rinfinity.net 单篇 HTTPS 文章地址，每分钟最多 4 次，最长 24 秒；响应错误为 400 地址无效、413 超限、422 无有效正文、502 来源错误、504 超时。返回候选字段不含 categoryId、status，不会创建或发布文章；图片可写入本站媒体库。保存时选择本站分类，再调用现有文章 API。
所有文章写入需要 `Idempotency-Key`（8..100 ASCII字符），以身份+method+path+key为作用域；24小时内同body返回首次结果，不同body返回409。PUT完整替换可编辑字段，不覆盖其他字段。乐观锁version必需。草稿不可从前台、搜索、公开接口或站点地图读取。

常见状态：400参数错误；401无效凭证；403权限/CSRF错误；404不存在；409重复slug/版本冲突/幂等冲突；413请求过大；415格式错误；429限流（Retry-After）；500内部错误。
重试：仅网络错误/5xx，最多2次指数退避，沿用幂等key；409读取最新版本人工合并，不能盲重试。单次请求目标5秒内（本地实测单独记录，非生产SLO）。

管理扩展：同样的文章资源位于 /api/admin/posts，另有trash/restore操作；categories可新增编辑；media支持图片multipart上传；settings更新全局配置；keys创建/撤销；audit只读。仅管理会话可使用。
站点设置包含 `title`、`tagline`、`description`、`logo`、`socialFollowText`、`notice` 和四个 HTTPS 社交链接。`logo` 只能引用本站 `/images/` 或 `/media/` 资源；后台可直接上传 Logo，保存后同步到头部、文章作者卡片和页脚。文章编辑器通过 POST /admin/preview 生成未保存文章的真实前台页面，直接复用 SiteLayout + ArticleContent；请求需管理员 Cookie、同源 Origin 与 CSRF，响应 no-store/noindex，不写入文章或公开草稿。后台 iframe 使用 sandbox 隔离，并支持桌面/手机宽度切换。
示例调用见 scripts/ai-client.mjs；机器可读规范为 /api/openapi.json。新API暂无旧客户端，后续破坏变更使用v2。
