import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { verifyPassword } from '../src/lib/security';
import { handleApi } from '../src/lib/api-controller';
import { commandRunner } from '../scripts/deploy.mjs';

const folders = [];
let mf;
afterEach(async () => { await mf?.dispose(); mf = undefined; await Promise.all(folders.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'orbitpress button ')); folders.push(root);
  const config = {
    name: 'selected-worker',
    d1_databases: [{ binding: 'DB', database_name: 'selected-db', database_id: '11111111-1111-4111-8111-111111111111' }],
    r2_buckets: [{ binding: 'MEDIA', bucket_name: 'selected-media' }],
  };
  await mkdir(join(root, 'dist/server'), { recursive: true });
  await writeFile(join(root, 'wrangler.jsonc'), JSON.stringify(config));
  await writeFile(join(root, 'dist/server/wrangler.json'), JSON.stringify(config));
  const calls = [], logs = [], state = { secrets: {}, exists: false, fail: '', encryptedKeys: 0, posts: 0, pages: 0, badList: false, db: undefined, migrated: false, emptyBackup: false };
  const run = async (step, tool, args) => {
    calls.push({ step, tool, args });
    if (step === state.fail) throw new Error('simulated failure');
    if (args[0] === 'secret') {
      if (!state.exists) throw new Error('Worker "selected-worker" not found.');
      return state.badList ? '{invalid' : JSON.stringify(Object.keys(state.secrets).map(name => ({ name, type: 'secret_text' })));
    }
    if (args[0] === 'd1' && args[1] === 'export') await writeFile(args[args.indexOf('--output') + 1], state.emptyBackup ? '' : '-- fixture backup');
    if (args[0] === 'd1' && args[1] === 'migrations' && state.db && !state.migrated) {
      for (const name of (await readdir('migrations')).filter(n => n.endsWith('.sql')).sort()) await state.db.exec((await readFile(join('migrations', name), 'utf8')).replace(/^--.*$/mg, '').replace(/\r?\n/g, ' '));
      state.migrated = true;
    }
    if (args[0] === 'd1' && args[1] === 'execute') return JSON.stringify([{ success: true, results: state.db ? (await state.db.prepare(args[args.indexOf('--command') + 1]).all()).results : [{ posts: state.posts, pages: state.pages, encryptedKeys: state.encryptedKeys }] }]);
    if (args[0] === 'deploy') {
      if (args.includes('--secrets-file')) Object.assign(state.secrets, JSON.parse(await readFile(args[args.indexOf('--secrets-file') + 1], 'utf8')));
      state.exists = true;
    }
    return '';
  };
  return { root, config, calls, logs, state, deploy: async () => (await import('../scripts/deploy-button.mjs')).runButtonDeployment({ root, run, log: text => logs.push(text) }) };
}
describe('免填写的 Cloudflare 按钮部署', () => {
  it('部署表单没有必填应用密钥；默认命令直接调用按钮部署，不要求本机配置', async () => {
    const example = await readFile('.env.example', 'utf8').catch(e => { if (e.code === 'ENOENT') return ''; throw e; });
    expect(example).not.toMatch(/^\s*(ADMIN_USERNAME|ADMIN_PASSWORD_HASH|API_KEY_ENCRYPTION_KEY)\s*=/m);
    const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
    expect(config.vars).toBeUndefined();
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    expect(pkg.scripts.deploy).toBe('node scripts/deploy-button.mjs');
    expect(pkg.scripts['deploy:cli']).toBe('node scripts/deploy.mjs');
  });
  it('首次无需.env/.deploy/手填密码，自动注入随机独立密钥、默认账号并清理临时文件', async () => {
    const f = await fixture(); await f.deploy();
    expect(f.state.secrets.ADMIN_USERNAME).toBe('admin');
    expect(await verifyPassword('123456', f.state.secrets.ADMIN_PASSWORD_HASH)).toBe(true);
    expect(f.state.secrets.API_KEY_ENCRYPTION_KEY).toMatch(/^[a-f0-9]{64}$/);
    const other = await fixture(); await other.deploy();
    expect(other.state.secrets.API_KEY_ENCRYPTION_KEY).not.toBe(f.state.secrets.API_KEY_ENCRYPTION_KEY);
    expect(other.state.secrets.ADMIN_PASSWORD_HASH).not.toBe(f.state.secrets.ADMIN_PASSWORD_HASH);
    expect(f.calls.at(-1).step).toBe('发布 Cloudflare Worker');
    expect(f.calls.find(c => c.args[1] === 'migrations').args).toContain('DB');
    expect(JSON.stringify(f.calls)).not.toMatch(/seed|DELETE|--local|\.dev\.vars/);
    expect(f.logs.join('\n')).not.toContain(f.state.secrets.API_KEY_ENCRYPTION_KEY);
    expect((await readdir(join(f.root, '.deploy'))).filter(n => n.startsWith('button-secrets-'))).toEqual([]);
  });
  it('重复部署保持已有管理员和加密密钥；只补缺失字段', async () => {
    const f = await fixture(); await f.deploy();
    const before = { ...f.state.secrets }; f.calls.length = 0;
    await f.deploy();
    expect(f.state.secrets).toEqual(before);
    expect(f.calls.at(-1).args).not.toContain('--secrets-file');
    delete f.state.secrets.ADMIN_USERNAME;
    await f.deploy();
    expect(f.state.secrets).toEqual(before);
  });
  it('真实隔离D1：首次自动迁移、默认登录与改密，更新后保留文章页面和可解密API密钥', async () => {
    const f = await fixture();
    mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("test")}}', compatibilityDate: '2026-10-18', d1Databases: ['DB'] }));
    f.state.db = await mf.getD1Database('DB');
    await f.deploy();
    for (const table of ['posts', 'pages']) expect(await f.state.db.prepare(`SELECT count(*) AS count FROM ${table}`).first('count')).toBe(0);
    const origin = 'https://orbitpress.example';
    async function api(path, body, auth = {}) {
      const response = await handleApi(new Request(origin + '/api/' + path, {
        method: 'POST', headers: { origin, 'content-type': 'application/json', cookie: auth.cookie ?? '', 'x-csrf-token': auth.csrf ?? '' }, body: JSON.stringify(body),
      }), { DB: f.state.db, ...f.state.secrets }, path);
      return { response, data: (await response.json()).data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
    }
    const initial = await api('auth/login', { username: 'admin', password: '123456' });
    expect(initial.response.status).toBe(200);
    const auth = { cookie: initial.cookie, csrf: initial.data.csrf };
    await api('auth/password', { currentPassword: '123456', newPassword: 'updated-password-fixture', confirmPassword: 'updated-password-fixture' }, auth);
    const logged = await api('auth/login', { username: 'admin', password: 'updated-password-fixture' });
    const updatedAuth = { cookie: logged.cookie, csrf: logged.data.csrf };
    const key = await api('admin/keys', { name: 'fixture', scopes: ['content:read'], days: 1 }, updatedAuth);
    await f.state.db.exec("INSERT INTO categories(id,name,slug) VALUES('c','测试分类','category'); INSERT INTO posts(id,title,slug,category_id,created_at,updated_at,updated_by,last_operation) VALUES('p','保留文章','post','c','now','now','admin','op'); INSERT INTO pages(id,title,slug,created_at,updated_at,updated_by,last_operation) VALUES('g','保留页面','page','now','now','admin','op');");
    const before = { ...f.state.secrets };
    await f.deploy();
    expect(f.state.secrets).toEqual(before);
    await expect(api('auth/login', { username: 'admin', password: '123456' })).rejects.toMatchObject({ status: 401 });
    expect((await api('auth/login', { username: 'admin', password: 'updated-password-fixture' })).response.status).toBe(200);
    expect((await api(`admin/keys/${key.data.id}/reveal`, {}, updatedAuth)).data.token).toBe(key.data.token);
    expect(await f.state.db.prepare('SELECT title FROM posts WHERE id=?').bind('p').first('title')).toBe('保留文章');
    expect(await f.state.db.prepare('SELECT title FROM pages WHERE id=?').bind('g').first('title')).toBe('保留页面');
    delete f.state.secrets.API_KEY_ENCRYPTION_KEY;
    await expect(f.deploy()).rejects.toThrow('原加密密钥');
  }, 30000);
  it('并发锁拒绝同一目录重复运行，且不执行云命令', async () => {
    const f = await fixture(); await mkdir(join(f.root, '.deploy'));
    await writeFile(join(f.root, '.deploy/deploy.lock'), 'active');
    await expect(f.deploy()).rejects.toThrow('部署锁');
    expect(f.calls).toHaveLength(0);
  });
  it('真实子进程报错中的生产密钥和账户Token被脱敏', async () => {
    const f = await fixture(); await f.deploy();
    await mkdir(join(f.root, 'node_modules/wrangler/bin'), { recursive: true });
    await writeFile(join(f.root, 'node_modules/wrangler/bin/wrangler.js'), 'process.stderr.write(process.env.SECRET_FIXTURE + process.env.CLOUDFLARE_API_TOKEN); process.exit(1);');
    const token = 'fixture-token-not-a-real-token';
    const logs = [];
    const run = commandRunner(f.root, { ...process.env, SECRET_FIXTURE: f.state.secrets.API_KEY_ENCRYPTION_KEY, CLOUDFLARE_API_TOKEN: token }, f.state.secrets, text => logs.push(text));
    let failure;
    try { await run('发布 Cloudflare Worker', 'wrangler', []); } catch (error) { failure = error; }
    expect(failure).toBeInstanceOf(Error);
    expect(failure.message).toContain('[REDACTED]');
    expect(failure.message + logs.join('\n')).not.toContain(f.state.secrets.API_KEY_ENCRYPTION_KEY);
    expect(failure.message + logs.join('\n')).not.toContain(token);
  });
  it('已有加密API密钥而加密配置遗失时停止，禁止生成新密钥破坏数据', async () => {
    const f = await fixture(); f.state.exists = true; f.state.encryptedKeys = 1;
    await expect(f.deploy()).rejects.toThrow('原加密密钥');
    expect(f.calls.some(c => c.args[0] === 'deploy')).toBe(false);
  });
  it.each(['读取现有生产密钥名称', '备份部署数据库', '应用生产数据库迁移', '校验生产内容', '发布 Cloudflare Worker'])('%s失败即中止，不把权限/网络错误当作新安装', async step => {
    const f = await fixture(); f.state.exists = true; f.state.fail = step;
    await expect(f.deploy()).rejects.toThrow('simulated failure');
    if (step !== '发布 Cloudflare Worker') expect(f.calls.some(c => c.args[0] === 'deploy')).toBe(false);
    expect((await readdir(join(f.root, '.deploy'))).filter(n => n.startsWith('button-secrets-'))).toEqual([]);
  });
  it('列表格式异常/备份为空/占位ID/构建绑定不一致均拒绝发布', async () => {
    for (const failure of ['badList', 'emptyBackup', 'placeholder', 'mismatch']) {
      const f = await fixture(); f.state.exists = true;
      if (failure === 'placeholder') { f.config.d1_databases[0].database_id = '00000000-0000-0000-0000-000000000001'; await writeFile(join(f.root, 'wrangler.jsonc'), JSON.stringify(f.config)); }
      else if (failure === 'mismatch') { f.config.name = 'other-worker'; await writeFile(join(f.root, 'dist/server/wrangler.json'), JSON.stringify(f.config)); }
      else f.state[failure] = true;
      await expect(f.deploy()).rejects.toThrow();
      expect(f.calls.some(c => c.args[0] === 'deploy')).toBe(false);
    }
  });
});
