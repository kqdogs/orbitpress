# 安全政策 · Security policy

## 简体中文

项目目前处于 0.x 早期开发阶段，修复优先针对 `main` 最新代码；不承诺旧版本长期支持或固定修复时限。

请勿通过公开 Issue 披露可利用的漏洞、密码、密钥、Cookie 或数据库。优先使用仓库 **Security → Report a vulnerability** 的私密报告入口；若维护者尚未启用该功能，先提交不含漏洞细节的 Issue 请求私密联系渠道，待建立渠道后再分享详情。

报告请包含受影响提交或版本、复现条件、最小步骤、预期与实际结果、影响说明及已脱敏证据。只在自己的隔离环境测试；不要访问他人数据或测试生产站点。

部署者应在首次登录后修改默认密码，保护 Cloudflare/GitHub 凭据和备份，限制 API 密钥权限，并在不再使用时撤销。默认账号供初始化使用，不适合长期公开运行。不要将真实广告点击作为测试步骤。

第三方许可证和授权状态见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)；本安全政策不授予商业组件再分发权。

## English

OrbitPress is in early 0.x development. Fixes primarily target the latest `main`; there is no long-term support commitment for older versions or guaranteed response deadline.

Do not disclose exploitable vulnerabilities or credentials in public issues. Prefer **Security → Report a vulnerability** when private vulnerability reporting is enabled. If unavailable, open an issue requesting a private contact channel without revealing vulnerability details, then wait for that channel before sharing the report.

Include the affected commit/version, prerequisites, minimal reproduction, expected and actual behavior, impact and redacted evidence. Test only in an isolated environment you own. Do not access others' data or test production sites.

Change the initial administrator password after installation. Protect Cloudflare/GitHub credentials and backups, minimize API key scopes and revoke unused keys. Do not test by clicking live advertisements.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for licensing scope; this policy grants no redistribution rights to commercial components.
