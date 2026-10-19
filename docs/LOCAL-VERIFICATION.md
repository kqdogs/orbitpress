# 本地验收记录

验收日期：2026-10-19（Asia/Shanghai）

## 范围

- 前台：首页、视频列表、教程列表、分类页、搜索、文章详情、404、移动导航。
- 后台：登录、概览、文章编辑、Markdown 预览、发布/下架、媒体、分类、站点设置、AI 与自动化、操作记录。
- 内容服务：D1 文章状态机、版本并发控制、幂等写入、API scope、CSRF/Origin、Markdown 清洗、R2 媒体。

## 实际证据

- `npm run check`：0 errors / warnings / hints。
- `npm test`：48/48 通过。
- `npm run build`：成功。
- `npm run test:integration`：52/52 通过，报告见 `test-results/integration.json`。
- 本地 D1 `PRAGMA foreign_key_check`：空结果；`posts` 表、索引和查询计划已读取。公开列表按 `status` 使用 `posts_public` 索引，`COALESCE` 排序当前使用临时 B-tree，尚未做大数据量压测。
- 浏览器闭环：创建 `local-browser-acceptance` → 预览 → 发布 → 前台读取 → 下架 → 前台 404；文章当前保留为草稿。
- 移动视口：CSS 宽度 375px（请求 390px），前台与后台 `scrollWidth === clientWidth`，未发现横向溢出；手机导航和搜索弹窗可用。
- 文章编辑器预览：后台“预览”直接渲染正式前台 SiteLayout + ArticleContent，支持桌面/手机宽度，包含头部导航、文章横幅、目录、正文、视频占位、作者卡片、资源区和页脚；未保存文章也可预览，服务端不写入文章。
- 站点设置：可修改站点名称、副标题、描述、Logo 路径/上传 Logo、底部关注文案和社交链接；修改后的 Logo/标题会同步到头部、文章作者卡片和页脚。
- 头部与页脚：保留原有网络/星空背景，并增加独立的光晕、星点和流光动画层；系统减少动画偏好时自动停用。

## AI 接入边界

本轮 Arco 重构、导航编辑、分类回收站和浏览器验证明细见 `docs/ARCO-REFACTOR.md`。

后台提供 Bearer API key、`content:read` / `content:write` / `content:publish` 独立权限、幂等键、OpenAPI 文档和示例客户端。创建接口始终生成草稿，发布需要独立权限；当前没有接入模型供应商，也不会产生模型调用费用。

## 审计结论与上线前事项

- SQL 使用绑定参数；会话和 API key 只存哈希；管理写入要求 SameSite Cookie、同源 Origin 和 CSRF；Markdown 经过白名单清洗；上传检查大小、MIME 与文件头并拒绝 SVG 伪装。
- 当前只运行本地模拟器，未创建或访问远程 D1/R2，未执行部署。
- 上线前仍需确认真实 D1/R2 资源、生产身份与密钥、域名、备份恢复、CSP nonce、媒体完整解码校验、过期幂等/限流记录清理策略，并进行真实流量压测。
- `public/images` 中的参考素材用于本地视觉比对；正式上线前需确认素材授权并替换正文示例内容。

