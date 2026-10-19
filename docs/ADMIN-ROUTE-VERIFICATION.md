# 后台路由刷新验证

日期：2026-10-19；本地 Chrome，未部署。

- 当前 Vue 后台使用 hash：`/admin#/posts`、`/admin#/pages`、`/admin#/categories`、`/admin#/access`。
- `/admin#/access` 刷新后仍为后台路径页；文章保存后进入 `/admin#/editor/:id`，刷新保留该文章及多个视频正文。
- 旧 `?view=...&post=...` / `?view=page-editor&page=...` 由 entry.ts 转换为对应 hash 地址。
- 新建独立页面保存后进入 `/admin#/page-editor/:id`，列表读取到同一标题与路径。
- 修改页面标题后离开会出现“继续编辑 / 放弃并离开”确认，丢弃测试输入后返回列表，保存值保持不变。
- 主题偏好独立保存在 localStorage；暗色、圆角与卡片侧栏切换后生效。刷新保留暗色和路由。
- 路由守卫在组件卸载时移除，避免开发热更新残留过期状态。
- API 连接位于“系统设置”二级菜单，保留密钥再次查看能力。
- 后台路径更改接口经过本地测试：保存新路径、/admin 302 跳转、登录会话保留、旧客户端保存不覆盖已设置路径，最后恢复 /admin。
