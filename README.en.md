# OrbitPress · 星笺

[简体中文](README.md) | [English](README.en.md)

**Give your content its own orbit.**

A blog and content management project built with Astro, Vue and Cloudflare Workers. Write in Markdown, publish standalone pages, customize layouts visually and connect external AI or automation tools through a content API.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fkqdogs%2Forbitpress)

> Original project code is MIT licensed. Third-party components and reference assets retain their own licenses. See [Licensing and sources](#licensing-and-sources).

## Features

| Area | Capabilities |
| --- | --- |
| Posts | Drafts, publishing, categories, tags, excerpts, highlights, trash, restore and permanent deletion |
| Writing | Markdown editor, edit/preview toggle, quick drafts, multiple YouTube and Bilibili embeds |
| Imports | Discover public articles from a blog home URL or import one article, including title, tags, cover and inline images; optional category; save as drafts |
| Video resources | Per-post resource links, copyable promo codes and a full video description link |
| Pages | Create, edit and publish standalone pages with their own paths |
| Visual customizer | Home, post, about and standalone page templates; drag blocks between content and sidebars |
| Branding | Logo, title, subtitle, header navigation, footer, social links and community cards |
| Reader experience | Search, animated header/footer, reading progress and back-to-top control |
| Administration | Vue, Element Plus and EleAdmin layout, nested menus, themes and persistent routes |
| Site settings | Post permalinks, custom URL structures, admin path and password changes |
| Content API | Draft writes, publishing scopes, optimistic version checks, idempotency and revocable encrypted keys |
| Languages | Simplified Chinese and English interfaces on the public site and in the admin, including editor controls and previews |
| Hosting | Cloudflare Workers, D1 and R2 with migrations and deployment checks |
| Google AdSense | Publisher verification, dynamic ads.txt, homepage/article placements and draggable ad widgets; disabled by default |

The default site name is **YaChin科技生活** with the project's Y logo. Social and community URLs start empty. A fresh installation has no custom navigation, categories, posts or pages; a built-in Home link remains available independently of categories.

AI integrations are external: a writing tool generates content and calls the authorized content API. No model provider or paid model call is built in.

## Local development

Requires Node.js **22.12.0 or newer** and npm. Exact dependency versions are recorded in `package-lock.json`.

```bash
git clone https://github.com/kqdogs/orbitpress.git
cd orbitpress
npm ci
npm run setup:local
npm run types
npm run db:migrate
npm run dev
```

- Site: `http://127.0.0.1:4321/`.
- Initial admin: `http://127.0.0.1:4321/admin`.
- Initial username: **`admin`**; password: **`123456`**. Change the password after signing in. The initial credentials are also stored in `local-admin.txt`. Re-running initialization does not reset an existing installation.
- Local D1 and R2 data persist under `.wrangler/state`. Production does not automatically import them.

Optional local demo content:

```bash
npm run db:seed
```

Production deployment never runs the demo seed. Categories are optional when creating a post.

## Languages

Use the language selector in the site header, admin top bar or login page to switch between **简体中文** and **English**. The browser remembers the choice in the `orbitpress_locale` cookie for one year. Chinese is the default. Switching reloads the current URL, preserving the admin route; unsaved admin changes require confirmation first.

System controls, forms, menus, search, editor tools, messages and previews are translated. Post/page content, titles, category names, custom navigation labels, branding and saved block text stay as authored. Switching the interface does not translate or rewrite your database. Authors can write posts in either language.

Server-rendered pages select their language per request, with no shared mutable locale. See the bilingual [translation guide](docs/TRANSLATING.md) to contribute translations.

## Deploy to Cloudflare

Click **Deploy to Cloudflare** above, sign in to Cloudflare, authorize GitHub and deploy with the defaults. **There are no administrator, password hash, API encryption key or migration command fields to fill in.** Resource names have defaults and can be changed if needed.

The deployment flow:

1. Creates the D1 database and R2 bucket from the Wrangler bindings. Cloudflare writes the actual resource details back into your copied repository.
2. Uses the repository build/deploy commands, backs up the deployment database and applies migrations. No sample posts or pages are imported.
3. On first installation, generates a randomly salted password hash and a separate API encryption key, and injects them as Cloudflare Secrets.
4. On updates, reuses existing Secrets, passwords and content, filling only missing configuration. If encrypted API keys exist but the original encryption configuration is missing, deployment stops to protect them.

After deployment, open **`/admin`**, sign in with **`admin` / `123456`**, change the password and configure the site.

Enable R2 on your Cloudflare account first. Cloudflare still requires account login, repository authorization and resolution of resource name conflicts. Open a fresh deployment from this repository's button if an older form asks for obsolete fields; previously copied repositories need to be updated.

| Stage | Default command |
| --- | --- |
| Build | `npm run build` |
| Deploy | `npm run deploy` |

The button deployment uses the real bindings Cloudflare writes back and Astro's generated `dist/server/wrangler.json`. It does not read your local `.dev.vars` or `.deploy/secrets.json` as production credentials. There is no shared hard-coded encryption key.

Temporary credential files are removed on success or failure. D1 exports are placed in the build job's `.deploy/backups` and excluded from Git. Build environments are temporary: retain your own backups for long-term recovery. Local layouts, categories, API keys and uploaded media are not transferred automatically.

The deployment button flow has local isolated tests and build checks; a real end-to-end deployment through the button has not been verified. See [detailed deployment notes (Chinese)](docs/AUTO-DEPLOY.md) and the [official button documentation](https://developers.cloudflare.com/workers/platform/deploy-buttons/).

## Deploy from your computer

Use this flow to publish or update a site from a local checkout. Use consistent account, resource names and encryption keys when updating an existing installation.

Stop the development server before running the local preflight:

```bash
npm run deploy:check
```

Sign in and initialize production credentials:

```bash
npx wrangler login
npm run setup:production
```

PowerShell:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = 'your-32-character-account-id'
npm run deploy:cli
```

macOS / Linux:

```bash
export CLOUDFLARE_ACCOUNT_ID='your-32-character-account-id'
npm run deploy:cli
```

CLI defaults are Worker `rinfinity-blog`, D1 `rinfinity-blog-db` and R2 `rinfinity-blog-media`. Override them with `BLOG_WORKER_NAME`, `BLOG_D1_NAME` and `BLOG_R2_NAME`. If taking over a button deployment, specify its actual resource names and restore the original production Secrets.

The script creates or reuses resources, checks production bindings, builds, performs a dry run, exports an existing D1 database, applies migrations and deploys. A failure stops subsequent steps. Already created resources remain available for retry. See [deployment and rollback details (Chinese)](docs/AUTO-DEPLOY.md).

## Importing articles

Open **Content → Article import**, enter a public blog's home URL, click **Find articles**, select entries and import them. Discovery tries public WordPress APIs, RSS/Atom, sitemaps and article links. Common public HTML blogs such as WordPress, Ghost, Hexo, Hugo, Jekyll, Astro and custom sites are handled without choosing a platform.

Categories are unassigned by default. Set one for the batch or edit individual drafts later. The catalog lists at most 100 articles in pages of 20; imports run sequentially and save as drafts, never automatically publish. Generic discovery reads at most 12 index documents and is not an unlimited crawler.

The queue shows results and supports stopping and retrying failed items. Successful items in the current queue are skipped. Unconfirmed saves reuse the original request and idempotency key. Leaving or refreshing clears the queue but keeps saved drafts. Rescanning does not deduplicate across batches; review existing posts first. Keep the import page open during processing.

Use **Import a single article** or **All posts → Import articles** to fill the editor, then save manually. Pages requiring login, CAPTCHA, anti-bot verification or JavaScript-only rendering may not be importable. Extraction accuracy varies by theme. Review drafts and confirm republication rights before publishing.

Titles and tags are preserved. Recognized title highlights become separate post highlights. Covers and inline images, including lazy-loaded images, are downloaded to this site's R2 store (local R2 in development) and referenced through `/media/` paths. Limits: 16 images, 24 MB total and 5 MB per image; PNG, JPEG and WebP. Failed images produce a replacement notice rather than a remote fallback. Covers appear in cards and video posters, without being repeated in article content. Imported posts use your permalink structure, such as `/%post_id%.html`, rather than the source path.

Imports only access public domains. Credentials, special ports, IP literals, private and reserved DNS addresses are rejected, with every redirect checked again. Site credentials are never forwarded. DNS preflight does not pin the actual connection address: production relies on Cloudflare Workers' public outbound network isolation. Do not substitute a private-network proxy or service binding. Local/self-hosted environments need equivalent network isolation and access to public DNS-over-HTTPS; DNS failures return `IMPORT_DNS` rather than bypassing checks.

## Writing, videos and resource cards

Markdown code blocks accept arbitrary language identifiers while preserving indentation and line breaks. Readers can copy code with one click. The editor provides common language suggestions and custom input. This is literal code rendering, not syntax highlighting for every language.

YouTube embeds support start times, a privacy playback alternative and a link to the source video. Playback remains subject to YouTube sign-in verification, regional restrictions and embedding permissions. Multiple YouTube and Bilibili videos can be inserted into a post.

Use **Links mentioned in this video** in the post editor to add resource links, optional promo codes and a full description URL. Cards appear in the right sidebar or below the content when no right sidebar exists.

Post and page trash supports restoring, single permanent deletion and bulk permanent deletion. Categories can also be restored or permanently deleted, but references from posts or navigation block deletion. Permanent deletion cannot be undone; shared media files are retained.

## AI and automation API

Create a key under **System settings → API connections**. Content read/write permissions are available by default; publishing requires a separate scope. Administrators can reveal, copy and revoke keys.

| Endpoint | Purpose |
| --- | --- |
| `/api/v1/posts` | Read posts, create and update drafts |
| `/api/v1/posts/:id/publish` | Publish with the required scope |
| `/api/v1/categories` | List categories |
| `/api/openapi.json` | Machine-readable API specification |

Authenticate using a Bearer key. Writes require a unique `Idempotency-Key`; updates and publishing require the latest `version`. See the [API reference (Chinese)](docs/API.md), [key-management notes (Chinese)](docs/API-KEY-REVEAL.md) and [`scripts/ai-client.mjs`](scripts/ai-client.mjs). Set `BLOG_URL` and `BLOG_API_KEY`, then replace the sample `categoryId` with an existing category ID. Fresh production databases contain no demo categories.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run check` | Astro, TypeScript and Vue checks |
| `npm test` | Automated tests |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run test:integration` | Integration checks against a running local server; creates test records |
| `npm run test:studio` | Admin integration checks; changes local test data |
| `npm run db:migrate` | Apply local D1 migrations |
| `npm run db:seed` | Generate local demo content |
| `npm run setup:production` | Generate locally held production credentials |
| `npm run deploy:check` | Local production preflight without cloud resource creation or upload |
| `npm run deploy` | Deployment button flow: migrate, fill missing Secrets and deploy |
| `npm run deploy:cli` | Local CLI resource provisioning and deployment |

Do not run development and build/preflight concurrently; they share Astro's cache. Local checks do not verify your cloud permissions, domains or production business flows.

## Project structure

```text
src/
  components/         Public components and admin interface
    studio/           Admin layout, routes and feature pages
  lib/                Content, validation, authentication, API and i18n
  pages/              Public/admin entry points and API routes
  styles/             Shared styles and admin themes
migrations/           D1 migrations
public/               Static assets
scripts/              Initialization, deployment and integration checks
tests/                Automated tests
vendor/               Third-party component sources and runtime
docs/                 Contracts, deployment notes and validation records
wrangler.jsonc        Local bindings and deployment resource template
```

## Data and credentials

- Initial credentials are `admin` / `123456` at `/admin`. Change them after installation. Existing installations are not reset. Each installation has its own random password salt and API encryption key.
- Password changes invalidate existing admin sessions. D1's password hash takes precedence over the initialization hash.
- Keep the same production encryption key on subsequent deployments.
- Use trash to manage content; deployment does not empty your database.
- Never commit `.wrangler/`, `.deploy/`, `.dev.vars`, `local-admin.txt`, database exports or test artifacts.

## Licensing and sources

Original project code is available under [MIT](LICENSE). That license does not cover third-party source, trademarks or media, nor grant additional rights to them. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

1. `vendor/ele-admin-plus` contains commercial EleAdmin Plus Ultra components, runtime and themes. See [SOURCE.md](vendor/ele-admin-plus/SOURCE.md). These components and copied styles/layout presets retain the original author's licensing requirements; obtain the appropriate license for use and redistribution.
2. Reference-site images and branding under `public/images` are excluded from the project MIT license. See [reference-manifest.json](public/images/reference-manifest.json). Replace them with your own assets or obtain permission.
3. npm dependencies retain their respective licenses.

The repository does not contain the reference site's administrative backend. Visual references and assets do not imply affiliation with that site.

## Google AdSense

Open **System settings → Google ads**. Advertising is disabled and publisher IDs are empty by default. Configure your own account ID for the verification meta tag and dynamic `/ads.txt`; enable ads after Google site approval and applicable CMP setup. Manual homepage/article placements and a draggable Google ads widget are supported. Admin previews never load live ads. The `/privacy/` page supports editable additions and a contact email. See the bilingual [AdSense guide](docs/ADSENSE.md).

## Contributing

See [CONTRIBUTING.en.md](CONTRIBUTING.en.md), [SECURITY.md](SECURITY.md), [CHANGELOG.en.md](CHANGELOG.en.md) and the [maintenance/release guide](docs/MAINTENANCE.md). A CI workflow is included; its actual status is determined by GitHub Actions runs, not local results.

Issues and improvements are welcome. Include reproduction steps, expected behavior, environment and redacted errors. Never upload credentials, tokens, cookies, password files or databases.

Run `npm run check` and relevant tests before contributing. Document migrations and compatibility when changing content models, APIs, databases or deployment flows. Keep the two READMEs consistent; see the [translation guide](docs/TRANSLATING.md).

Repository: [kqdogs/orbitpress](https://github.com/kqdogs/orbitpress).
