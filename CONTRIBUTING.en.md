# Contributing

[简体中文](CONTRIBUTING.md) | [English](CONTRIBUTING.en.md)

Bug reports, documentation, translations, tests and focused improvements are welcome.

## Before starting

Search existing issues. Discuss substantial changes before implementation. Read [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md): MIT covers original project code only, not the commercial EleAdmin components or third-party media. Submit only material you are entitled to distribute.

Report vulnerabilities using [SECURITY.md](SECURITY.md), without publishing exploit details.

## Development

Use Node.js 22.12.0 or a newer 22.x version and npm with the existing lockfile:

```bash
npm ci
npm run setup:local
npm run types
npm run db:migrate
npm run dev
```

Before submitting:

```bash
npm run check
npm test
npm run build
npm run test:ads
```

`test:ads` starts the built Worker with in-memory D1/R2 on an isolated port. It does not use local credentials, access Google ads, or change local or production databases. New installations must remain empty of personal articles, pages, categories and advertising settings.

## Pull requests

- Keep each PR focused. Explain the problem, resulting behavior, validation and remaining limitations.
- Give new settings defaults, validation and backward compatibility. Document database migrations and recovery.
- Reuse the existing Element Plus / EleAdmin wrappers and shared public components.
- Translate system messages and update both READMEs. See [the translation guide](docs/TRANSLATING.md).
- For advertising changes, test disabled mode, previews, duplicate initialization, invalid input, ads.txt and CSP. Never load or click live ads in automated tests.
- Never commit credentials, cookies, API keys, `.dev.vars`, `.deploy/`, `.wrangler/`, `local-admin.txt`, database exports or sensitive logs.

Maintainers review scope, licensing, compatibility and tests before merging; no fixed response time is promised. Your original contributions are offered under the applicable project license, without transferring copyright.

Real deployment feedback is welcome through the usage feedback template. Public URLs are optional; never share administrative access or personal data. Please do not fabricate usage or maintenance activity.

See [maintenance and release procedures](docs/MAINTENANCE.md) and the [changelog](CHANGELOG.en.md).
