# 维护与发布 · Maintenance and releases

[贡献指南](../CONTRIBUTING.md) · [Contributing](../CONTRIBUTING.en.md) · [更新日志](../CHANGELOG.md) · [Changelog](../CHANGELOG.en.md)

## 简体中文

当前主维护者：GitHub 账号 `kqdogs`。公开维护记录以仓库的提交、Issue、PR 和 Release 为准；本文件不是用户量、采用率或资助资格证明。

### 日常维护

1. 使用 Bug/功能/使用反馈模板收集真实需求；先复现、分类和记录环境。
2. 变更保持可审查范围，说明旧数据与接口兼容、迁移、验证和剩余限制。
3. 运行 `npm run check`、`npm test`、`npm run build` 与变更相关集成测试；广告集成运行 `npm run test:ads`。GitHub CI 成功以实际运行记录为准，不能用本地通过替代。
4. 更新两种语言的变更日志与使用文档，合并时关联原 Issue/PR。

### 首次发布

首版说明已准备在 [releases/v0.1.0.md](releases/v0.1.0.md)，当前是草稿。发布时：

1. 确认待发布提交、package 版本、验证结果一致，不含个人数据与凭据。
2. 核对 [第三方授权声明](../THIRD_PARTY_NOTICES.md)。商业源码的公开再分发授权证明目前未随仓库附带；文档完善不会自动解决授权。
3. 在确认的提交创建 `v0.1.0` 标签并建立 GitHub Release，把草稿状态改为实际发布时间与验证结果。不要提前声称已发布。
4. 检查首次空站、升级已有站、语言、登录和广告开关；云端部署是单独步骤。

后续版本记录用户可见变化、兼容性、配置、迁移和恢复办法。取消广告先关闭后台开关；验证 meta 与 ads.txt 随发布商 ID 保留，可通过清空 ID 移除。回滚到不支持广告的旧版本前，需先移除已添加的广告装修组件，再关闭广告；旧的严格布局校验不认识 `ad` 类型。

### 真实使用与 Codex 申请

收集自愿提供的部署反馈、真实问题修复和外部贡献；不虚构用户、Stars、PR 审查或维护年限。可用于维护的 Codex API 场景包括代码审查、测试、Issue 分诊与发布说明；项目内容生成不能替代开源维护证据。活动申请和获批由官方审核决定。

## English

Primary maintainer: GitHub account `kqdogs`. Commits, issues, pull requests and releases are the source of maintenance evidence; this document proves neither adoption nor funding eligibility.

Triage actual reports, reproduce issues, keep changes focused and document compatibility. Run checks, tests, build and relevant integration tests (`npm run test:ads` for advertising). Local passes do not prove GitHub CI has run. Keep both changelogs and guides consistent.

The [v0.1.0 release note](releases/v0.1.0.md) is a draft. Before tagging, match the package version, target commit and validation evidence; inspect credentials and personal data, and verify third-party redistribution rights. Commercial component redistribution authorization is not included in the repository. Documentation does not resolve that limitation.

Create the tag and GitHub Release only for the verified commit, then record the real publication date. Deployment is a separate operation. Validate empty installs and upgrades. To disable ads, turn off the setting; clear the publisher ID to remove verification and ads.txt. Before rolling back to code without advertising support, remove `ad` layout widgets first because the previous schema rejects that block type.

Collect voluntary real usage feedback and actual contributions. Do not invent adoption, review activity or project age. Codex maintenance workflows can include code review, tests, issue triage and release notes; acceptance into external programs remains subject to their review.
