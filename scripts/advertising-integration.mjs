import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

if (!existsSync('dist/server/entry.mjs')) throw Error('Run npm run build before npm run test:ads');
const salt = randomBytes(16).toString('hex');
const password = 'isolated-advertising-fixture';
// The installed v5 converter does not crawl imports; provide the complete build module graph.
const moduleFiles = ['entry.mjs', ...readdirSync('dist/server', { recursive: true }).map(String).filter(name => name.endsWith('.mjs') && name !== 'entry.mjs')];
const mf = new Miniflare(convertV4MiniflareOptions({
  modules: moduleFiles.map(name => ({ type: 'ESModule', path: resolve('dist/server', name) })), modulesRoot: resolve('dist/server'),
  compatibilityDate: '2026-10-18', compatibilityFlags: ['nodejs_compat'],
  host: '127.0.0.1', port: 0,
  d1Databases: ['DB'], r2Buckets: ['MEDIA'],
  assets: { directory: resolve('dist/client'), binding: 'ASSETS', routerConfig: { has_user_worker: true } },
  bindings: { ADMIN_USERNAME: 'fixture', ADMIN_PASSWORD_HASH: `${salt}:${pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex')}`, API_KEY_ENCRYPTION_KEY: randomBytes(32).toString('hex') },
}));
const base = 'http://localhost';
let cookie = '', csrf = '', passed = 0;
async function call(path, { method = 'GET', body, admin = false, headers = {}, idempotent = false } = {}) {
  const h = { ...headers };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  if (admin) { h.Cookie = cookie; h.Origin = base; h['X-CSRF-Token'] = csrf; }
  if (idempotent) h['Idempotency-Key'] = randomUUID();
  const response = await mf.dispatchFetch(base + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
  const text = await response.text();
  let json; try { json = JSON.parse(text); } catch {}
  return { status: response.status, headers: response.headers, text, data: json?.data };
}
async function test(name, fn) { await fn(); passed++; console.log(`PASS ${name}`); }
const noAds = response => { assert(!response.text.includes('data-adsense-loader')); assert(!response.text.includes('class="adsbygoogle"')); assert(!response.headers.get('Content-Security-Policy')?.includes('googlesyndication')); assert(!response.headers.has('X-OrbitPress-Ads')); };

try {
  const db = await mf.getD1Database('DB');
  for (const file of readdirSync('migrations').filter(name => name.endsWith('.sql')).sort()) {
    await db.exec(readFileSync('migrations/' + file, 'utf8').replace(/^[ \t]*--.*$/mg, '').replace(/\r?\n/g, ' '));
  }
  await test('empty install has no ad requests or publisher identity', async () => {
    const home = await call('/'); assert.equal(home.status, 200); noAds(home);
    assert(!home.text.includes('google-adsense-account'));
    assert.equal((await call('/ads.txt')).status, 404);
    assert.equal((await call('/privacy/')).status, 200);
  });
  const login = await call('/api/auth/login', { method: 'POST', headers: { Origin: base }, body: { username: 'fixture', password } });
  assert.equal(login.status, 200); cookie = login.headers.get('set-cookie').split(';')[0]; csrf = login.data.csrf;
  let current = (await call('/api/admin/settings', { admin: true })).data;
  const save = async (value, version = current.version) => {
    const result = await call('/api/admin/settings', { method: 'PUT', admin: true, body: { ...value, version } });
    if (result.status === 200) current = result.data;
    return result;
  };
  const config = { ...current.value.advertising, clientId: 'ca-pub-1234567890123456', slots: { home: '1234567890', articleTop: '1234567891', articleBottom: '1234567892', sidebar: '1234567893' } };
  await test('save identity while disabled generates verification and exact ads.txt', async () => {
    assert.equal((await save({ ...current.value, advertising: config })).status, 200);
    const home = await call('/'); noAds(home); assert(home.text.includes('content="ca-pub-1234567890123456"'));
    const ads = await call('/ads.txt'); assert.equal(ads.status, 200); assert.equal(ads.text, 'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
  });
  await test('authentication, CSRF, invalid input and stale versions reject changes', async () => {
    const body = { ...current.value, version: current.version };
    assert.equal((await call('/api/admin/settings', { method: 'PUT', body })).status, 401);
    assert.equal((await call('/api/admin/settings', { method: 'PUT', body, headers: { Cookie: cookie, Origin: base } })).status, 403);
    assert.equal((await save({ ...current.value, advertising: { ...config, enabled: true } })).status, 400);
    assert.equal((await save({ ...current.value, advertising: { ...config, clientId: '<script>' } })).status, 400);
    assert.equal((await save(current.value, current.version - 1)).status, 409);
    assert.equal((await call('/api/admin/settings', { admin: true })).data.version, current.version);
  });
  const block = { id: 'ad-widget', type: 'ad' };
  await test('enabled public ads render one async library and conditional CSP', async () => {
    assert.equal((await save({ ...current.value, advertising: { ...config, enabled: true, consentReady: true, privacyContact: 'privacy@example.com', privacyPolicy: '## Operator fixture\n\nPrivacy fixture.' }, pageLayouts: { home: { sidebar: 'right', main: [{ id: 'home-text', type: 'markdown', text: 'Fixture homepage' }], right: [block] }, article: { sidebar: 'right', main: [{ id: 'article-content', type: 'content' }], right: [block] } } })).status, 200);
    const home = await call('/'); assert.equal(home.status, 200);
    assert.equal((home.text.match(/data-adsense-loader/g) || []).length, 1);
    assert(home.text.includes('data-ad-placement="home"')); assert(home.text.includes('data-ad-placement="sidebar"'));
    assert(home.headers.get('Content-Security-Policy').includes('https://*.googlesyndication.com'));
    assert(!home.headers.has('X-OrbitPress-Ads'));
  });
  const input = { title: 'Ad fixture article', slug: 'ad-fixture', excerpt: '', body: '## Content\n\nFixture only.', categoryId: '', cover: '', videoId: '', featured: false, tags: [] };
  let post;
  await test('published article includes top, bottom and widget placements', async () => {
    const created = await call('/api/admin/posts', { method: 'POST', admin: true, body: input, idempotent: true }); assert.equal(created.status, 201); post = created.data;
    const published = await call(`/api/admin/posts/${post.id}/publish`, { method: 'POST', admin: true, body: { version: post.version }, idempotent: true }); assert.equal(published.status, 200); post = published.data;
    const article = await call('/ad-fixture/'); assert.equal(article.status, 200);
    for (const place of ['articleTop', 'articleBottom', 'sidebar']) assert(article.text.includes(`data-ad-placement="${place}"`));
    assert.equal((article.text.match(/data-adsense-loader/g) || []).length, 1);
  });
  await test('backend, custom backend, previews, privacy, search and errors never request ads', async () => {
    for (const path of ['/admin', '/privacy/', '/?s=Fixture', '/missing-fixture/']) noAds(await call(path));
    const policy = await call('/privacy/', { headers: { Cookie: 'orbitpress_locale=en' } });
    assert(policy.text.includes('Privacy policy')); assert(policy.text.includes('Operator fixture')); assert(policy.text.includes('mailto:privacy@example.com'));
    const preview = await call('/admin/page-preview', { method: 'POST', admin: true, body: { page: 'article', postId: post.id, settings: current.value, builder: true } });
    assert.equal(preview.status, 200); noAds(preview); assert(preview.text.includes('广告位预览'));
    assert.equal((await save({ ...current.value, adminPath: '/manage-fixture' })).status, 200);
    noAds(await call('/manage-fixture'));
  });
  await test('legacy client updates preserve advertising and disabling removes all ad units', async () => {
    const { advertising, ...legacy } = current.value;
    assert.equal((await save({ ...legacy, tagline: 'Legacy fixture' })).status, 200);
    assert.deepEqual(current.value.advertising, advertising);
    assert.equal((await save({ ...current.value, advertising: { ...advertising, enabled: false } })).status, 200);
    noAds(await call('/')); noAds(await call('/ad-fixture/'));
    assert.equal((await call('/ads.txt')).status, 200);
    assert.equal((await save({ ...current.value, advertising: { ...current.value.advertising, clientId: '' } })).status, 200);
    assert.equal((await call('/ads.txt')).status, 404);
  });
  console.log(`Advertising integration: ${passed} passed; isolated in-memory data disposed.`);
} finally { await mf.dispose(); }
