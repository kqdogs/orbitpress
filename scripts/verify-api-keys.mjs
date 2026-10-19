import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const base = process.env.LOCAL_TEST_URL || 'http://127.0.0.1:4322';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), '仅允许本地测试');
const wrangler = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const password = readFileSync('local-admin.txt', 'utf8').match(/密码：(.+)/)?.[1];
assert(password, '缺少本地凭证');
const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ username: 'admin', password }) });
assert.equal(login.status, 200);
const cookie = login.headers.get('set-cookie').split(';')[0], { data: { csrf } } = await login.json();
async function call(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const response = await fetch(base + path, { method, headers: { ...(auth ? { Cookie: cookie, Origin: base, 'X-CSRF-Token': csrf } : {}), ...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }), ...headers }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  let payload; try { payload = JSON.parse(text); } catch { payload = {}; }
  return { status: response.status, data: payload.data, code: payload.error?.code, cache: response.headers.get('cache-control') };
}
mkdirSync('test-results', { recursive: true });
function sql(statement) {
  const file = `test-results/key-fixture-${randomUUID()}.sql`;
  try {
    writeFileSync(file, statement);
    const output = execFileSync(process.execPath, [wrangler, 'd1', 'execute', 'blog-db', '--local', '--file', file, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return JSON.parse(output);
  } finally { unlinkSync(file); }
}
const results = [];
async function test(name, action) { await action(); results.push(name); console.log('PASS ' + name); }
const initial = (await call('/api/admin/keys')).data;
const originalPosts = (await call('/api/admin/posts?limit=100')).data;
const originalSettings = (await call('/api/admin/settings')).data;
const ids = [], legacyId = randomUUID(), expiredId = randomUUID(); ids.push(legacyId, expiredId);
const oldToken = 'rf_' + randomBytes(32).toString('hex'), oldHash = createHash('sha256').update(oldToken).digest('hex');
let created;
try {
  sql(`INSERT INTO api_keys(id,name,hash,scopes,created_at,expires_at) VALUES('${legacyId}','__arco_key_legacy','${oldHash}','["content:read"]','2026-10-19T00:00:00Z',${Math.floor(Date.now()/1000)+3600});
INSERT INTO api_keys(id,name,hash,scopes,created_at,expires_at) VALUES('${expiredId}','__arco_key_expired','${randomBytes(32).toString('hex')}','["content:read"]','2026-10-19T00:00:00Z',1);`);
  await test('未登录、CSRF、跨站与 Bearer 管理入口拒绝', async () => {
    assert.equal((await call(`/api/admin/keys/${legacyId}/reveal`, { method: 'POST', auth: false })).status, 401);
    assert.equal((await call(`/api/admin/keys/${legacyId}/reveal`, { method: 'POST', headers: { 'X-CSRF-Token': '' } })).status, 403);
    assert.equal((await call(`/api/admin/keys/${legacyId}/reveal`, { method: 'POST', headers: { Origin: 'https://invalid.example' } })).status, 403);
    assert.equal((await call(`/api/admin/keys/${legacyId}/reveal`, { method: 'POST', auth: false, headers: { Authorization: `Bearer ${oldToken}` } })).status, 401);
    assert.equal((await call(`/api/v1/keys/${legacyId}/reveal`, { method: 'POST', auth: false, headers: { Authorization: `Bearer ${oldToken}` } })).status, 404);
  });
  await test('旧哈希密钥仍可认证但无法还原，过期与不存在拒绝', async () => {
    assert.equal((await call('/api/v1/categories', { auth: false, headers: { Authorization: `Bearer ${oldToken}` } })).status, 200);
    assert.equal((await call(`/api/admin/keys/${legacyId}/reveal`, { method: 'POST' })).code, 'KEY_NOT_RECOVERABLE');
    assert.equal((await call(`/api/admin/keys/${expiredId}/reveal`, { method: 'POST' })).code, 'KEY_UNAVAILABLE');
    assert.equal((await call(`/api/admin/keys/${randomUUID()}/reveal`, { method: 'POST' })).status, 404);
  });
  await test('新密钥加密创建，重复查看一致且响应不缓存', async () => {
    const response = await call('/api/admin/keys', { method: 'POST', body: { name: '__arco_key_roundtrip', days: 7, scopes: ['content:read'] } });
    assert.equal(response.status, 201); created = response.data; ids.push(created.id);
    assert(/^rf_[a-f0-9]{64}$/.test(created.token));
    for (let i=0; i<2; i++) {
      const revealed = await call(`/api/admin/keys/${created.id}/reveal`, { method: 'POST' });
      assert.equal(revealed.status, 200); assert.equal(revealed.data.token === created.token, true); assert.equal(revealed.cache, 'no-store');
    }
    assert.equal((await call('/api/v1/categories', { auth: false, headers: { Authorization: `Bearer ${created.token}` } })).status, 200);
  });
  await test('列表只暴露 canReveal，不含密文、哈希或明文', async () => {
    const list = await call('/api/admin/keys');
    assert.equal(list.data.find(key => key.id === created.id).canReveal, true);
    assert.equal(list.data.find(key => key.id === legacyId).canReveal, false);
    for (const key of list.data) assert.deepEqual(Object.keys(key).sort(), ['id','name','scopes','createdAt','expiresAt','revokedAt','canReveal'].sort());
    const rows = sql(`SELECT length(encrypted_token) size, encrypted_token NOT LIKE 'rf_%' encrypted FROM api_key_secrets WHERE key_id='${created.id}';`);
    assert.deepEqual(rows[0].results, [{size:194, encrypted:1}]);
  });
  await test('撤销幂等、密文删除、再次查看与 Bearer 失效', async () => {
    for(let i=0;i<2;i++) assert.equal((await call(`/api/admin/keys/${created.id}/revoke`, {method:'POST'})).status, 200);
    assert.equal((await call(`/api/admin/keys/${created.id}/reveal`, {method:'POST'})).code, 'KEY_UNAVAILABLE');
    assert.equal((await call('/api/v1/categories', {auth:false,headers:{Authorization:`Bearer ${created.token}`}})).status, 401);
    const rows = sql(`SELECT count(*) count FROM api_key_secrets WHERE key_id='${created.id}';`);
    assert.equal(rows[0].results[0].count, 0);
  });
  await test('操作不改变原有文章、设置和密钥', async () => {
    assert.deepEqual((await call('/api/admin/posts?limit=100')).data, originalPosts);
    assert.deepEqual((await call('/api/admin/settings')).data, originalSettings);
    const current = (await call('/api/admin/keys')).data;
    for(const key of initial) assert.deepEqual(current.find(item=>item.id===key.id), key);
  });
} finally {
  const safeIds = ids.map(id => `'${id}'`).join(',');
  sql(`DELETE FROM api_key_secrets WHERE key_id IN (${safeIds}); DELETE FROM audit WHERE resource_id IN (${safeIds}); DELETE FROM api_keys WHERE id IN (${safeIds}) AND name LIKE '__arco_key_%'; DELETE FROM rate_limits WHERE id IN (${ids.map(id=>`'key:${id}'`).join(',')});`);
  writeFileSync('test-results/api-key-integration.json', JSON.stringify({base,results,passed:results.length,fixtureCleanup:true}, null, 2));
}
console.log(`${results.length} local API key checks passed; synthetic fixtures cleaned.`);
