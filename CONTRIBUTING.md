# 贡献指南

[简体中文](CONTRIBUTING.md) | [English](CONTRIBUTING.en.md)

感谢帮助维护 OrbitPress。问题反馈、文档、翻译、测试和代码改进都欢迎。

## 开始之前

- 先搜索已有 Issue；较大的功能先说明需求和方案。
- 阅读 [LICENSE](LICENSE) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。原创代码的 MIT 许可不覆盖 EleAdmin 商业组件或第三方图片。请勿提交无权分发的代码、素材或转载内容。
- 安全问题请按 [SECURITY.md](SECURITY.md) 私下报告，不要在公开 Issue 中贴利用细节。

## 开发与检查

需要 Node.js 22.12.0 或更新的 22.x 版本和 npm，使用已有 lockfile：

```bash
npm ci
npm run setup:local
npm run types
npm run db:migrate
npm run dev
```

提交前运行：

```bash
npm run check
npm test
npm run build
npm run test:ads
```

`test:ads` 在内存 D1/R2 和隔离端口启动已构建的 Worker，不读取本机账号，不访问 Google 广告，也不会修改本机或线上数据库。首次安装没有文章、页面、分类或广告配置；不要把个人内容作为默认种子提交。

## 提交与 PR

- 一个 PR 解决一个明确问题，说明改动前后行为、复现步骤、验证结果和未覆盖项。
- 新增配置必须有默认值、校验和旧客户端兼容；修改数据库需要迁移及恢复说明。
- 后台使用现有 Element Plus / EleAdmin 封装；前台公共元素复用组件。不要为了局部需求整体换 UI 库。
- 系统文案使用现有翻译入口，同时维护中英文 README 与词典，见 [翻译指南](docs/TRANSLATING.md)。
- 广告改动须覆盖关闭状态、预览隔离、重复初始化、错误输入、ads.txt 与 CSP。测试不要加载真实广告或点击广告。
- 不提交 `.dev.vars`、`.deploy/`、`.wrangler/`、`local-admin.txt`、API 密钥、Cookie、数据库备份和未脱敏日志。

维护者会核对范围、许可证、兼容性与测试后决定合并，不承诺固定响应时间。贡献自己的原创部分意味着同意按本仓库对应的许可证发布该部分；不要求转让版权。

## 真实使用反馈

欢迎通过使用反馈模板说明部署方式、用途和遇到的问题。公开网址可选，请勿提供后台入口、密码或数据库。反馈应基于实际使用，不需要为项目增加空提交、虚构用户或维护记录。

发布与维护流程见 [MAINTENANCE.md](docs/MAINTENANCE.md)，版本变化见 [CHANGELOG.md](CHANGELOG.md)。
