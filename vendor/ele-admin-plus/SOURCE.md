# 参考组件来源

用户明确指定使用 `G:\code\admin-ts\eleadmin-plus-ts-ultra-1.6.0`。

- 本目录组件源码来自参考项目 components 目录；runtime 来自其 es 目录。
- theme-ui/covers、theme-ui/SettingItem.vue 来自参考项目 src/layout/components，保留原始文件。
- src/styles/studio-layout.scss、studio-variables.scss、studio-dark.scss、studio-rounded.scss 来自参考项目对应样式；studio-theme.scss 为 setting-drawer.vue 的样式。
- src/components/studio/layout/layoutPresets.ts 提取参考项目 src/utils/skin-config.ts 中 PREDEFINED_LAYOUTS 的原始布局数据。
- 本站适配 Vue 路由、会话、数据服务与主题状态；不拷贝演示项目的账号、密钥或数据库。
- 原包的授权提示、版权与校验逻辑保留；未添加移除授权验证的补丁。
- 2026-10-19 按用户要求直接在 ReceiverView 组件内部设置 `showLayoutWatermark=false`，关闭水印覆盖层，使用普通布局容器，保留插槽参数、样式透传与原授权计算。源码及 runtime 同步修改，应用入口没有水印配置，通用 EleWatermark 组件保持不变。替换 vendor 版本时需保留此本地改动。
