# 翻译贡献说明 / Translation guide

[简体中文 README](../README.md) | [English README](../README.en.md)

## 简体中文

- 系统中文原文即翻译键，英文映射位于 `src/lib/i18n/en.json`。新增界面文案时同时补充英文，保留 `{0}` 等编号参数及 `%post_id%` 等协议标记。
- Vue 与浏览器脚本使用 `src/lib/i18n/client.ts` 的 `t()`。Astro 服务端使用 `translator(Astro.locals.locale)`，显式传递语言，不设置服务器全局语言。
- Markdown 控件通过 `renderMarkdown(body, { locale })` 本地化。文章正文、代码、用户标题、分类名与已保存的导航/装修文案不是翻译键，保持原样。
- 切换入口共享 `orbitpress_locale` Cookie，允许值为 `zh-CN`、`en`，默认 `zh-CN`。后台刷新当前路由，未保存内容先确认。组件库使用自带语言资源。
- 修改说明文档时同步 `README.md` 与 `README.en.md`，保持部署命令、限制、默认账号与许可一致。尚未翻译的技术文档在英文 README 中明确标为 Chinese。
- 提交前运行 `npm run check`、`npm test`、`npm run build`；浏览器验证两种语言、刷新、后台路由、编辑器预览与移动端。确认切换语言没有改动内容数据。

## English

- Chinese source messages are translation keys. English mappings live in `src/lib/i18n/en.json`. Add both when introducing system text. Preserve numbered parameters such as `{0}` and protocol tokens such as `%post_id%`.
- Vue components and browser scripts use `t()` from `src/lib/i18n/client.ts`. Astro server code uses `translator(Astro.locals.locale)`. Pass locale explicitly; never keep a mutable global server locale.
- Localize Markdown controls with `renderMarkdown(body, { locale })`. Authored content, code, user titles, category names and saved navigation/block text are not translation keys and must stay unchanged.
- Language selectors share the `orbitpress_locale` cookie, allowlisted to `zh-CN` and `en`, defaulting to Chinese. The admin reloads its current route and confirms before discarding unsaved changes. Component libraries use their bundled locales.
- Update `README.md` and `README.en.md` together. Keep deployment commands, limits, initial credentials and licensing consistent. Links to untranslated technical documents are labeled Chinese in the English README.
- Before contributing, run `npm run check`, `npm test` and `npm run build`. Check both languages, refresh persistence, admin routes, editor previews and mobile access in a browser. Verify that switching language does not change content data.
