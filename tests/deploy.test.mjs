import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { verifyPassword } from '../src/lib/security';
import { productionSettings, validateSecrets, databaseId, bucketNames, contentCounts, setupProduction, runDeployment } from '../scripts/deploy.mjs';

const env = { CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32) };
const id = '11111111-1111-4111-8111-111111111111';
const secrets = { ADMIN_USERNAME: 'admin', ADMIN_PASSWORD_HASH: `${'1'.repeat(32)}:${'2'.repeat(64)}`, API_KEY_ENCRYPTION_KEY: '3'.repeat(64) };
const temporary = [];
let mf;
afterEach(async () => { await mf?.dispose(); mf = undefined; await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true }))); });

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'blog deploy 空格 ')); temporary.push(root);
  await writeFile(join(root, 'wrangler.jsonc'), await readFile('wrangler.jsonc'));
  await mkdir(join(root, '.deploy'));
  await writeFile(join(root, '.deploy/secrets.json'), JSON.stringify(secrets));
  const calls = [], state = { database: false, bucket: false, migrated: false, posts: 0, pages: 0, fail: '', db: undefined, wrongBinding: false, emptyBackup: false };
  const run = async (step, tool, args, overrides) => {
    calls.push({ step, tool, args, overrides });
    if (step === state.fail) throw new Error('simulated failure');
    if (tool === 'astro' && args[0] === 'build') {
      expect(overrides.BLOG_DEPLOY_CONFIG).toMatch(/^\.\/.deploy\//);
      expect(overrides.BLOG_DEPLOY_CONFIG).not.toContain('\\');
      const config = JSON.parse(await readFile(resolve(root, overrides.BLOG_DEPLOY_CONFIG), 'utf8'));
      if (state.wrongBinding) config.d1_databases[0].binding = 'WRONG';
      await mkdir(join(root, 'dist/server'), { recursive: true });
      await writeFile(join(root, 'dist/server/wrangler.json'), JSON.stringify(config));
    }
    if (tool !== 'wrangler') return '';
    if (args[0] === 'd1' && args[1] === 'list') return JSON.stringify(state.database ? [{ name: 'rinfinity-blog-db', uuid: id }] : []);
    if (args[0] === 'd1' && args[1] === 'create') state.database = true;
    if (args[0] === 'd1' && args[1] === 'export') await writeFile(args[args.indexOf('--output') + 1], state.emptyBackup ? '' : '-- isolated backup fixture\n');
    if (args[0] === 'r2' && args[2] === 'list') return `Listing buckets...\n${state.bucket ? 'name:           rinfinity-blog-media\ncreation_date:  2026-10-20T00:00:00Z\n' : ''}`;
    if (args[0] === 'r2' && args[2] === 'create') state.bucket = true;
    if (args[0] === 'd1' && args[1] === 'migrations' && !state.migrated) {
      if (state.db) for (const migration of (await readdir('migrations')).filter(name => name.endsWith('.sql')).sort()) {
        const sql = (await readFile(resolve('migrations', migration), 'utf8')).replace(/^--.*$/mg, '').replace(/\r?\n/g, ' ');
        await state.db.exec(sql);
      }
      state.migrated = true;
    }
    if (args[0] === 'd1' && args[1] === 'execute') {
      const results = state.db ? (await state.db.prepare(args[args.indexOf('--command') + 1]).all()).results : [{ posts: state.posts, pages: state.pages }];
      return JSON.stringify([{ success: true, results }]);
    }
    return '';
  };
  return { root, calls, state, run, deploy: options => runDeployment({ root, env, run, log: () => {}, ...options }) };
}

describe('自动部署：资源、空内容、失败关闭', () => {
  it('配置/密钥边界严格校验；生产与本地名字隔离', () => {
    expect(productionSettings(env)).toEqual({ account: env.CLOUDFLARE_ACCOUNT_ID, worker: 'rinfinity-blog', database: 'rinfinity-blog-db', bucket: 'rinfinity-blog-media' });
    for (const input of [{}, { ...env, BLOG_WORKER_NAME: '../local' }, { ...env, BLOG_R2_NAME: 'cf-invalid' }]) expect(() => productionSettings(input)).toThrow();
    expect(validateSecrets(secrets)).toEqual(secrets);
    for (const input of [null, {}, { ...secrets, EXTRA: 'bad' }, { ...secrets, ADMIN_PASSWORD_HASH: 'bad' }, { ...secrets, API_KEY_ENCRYPTION_KEY: '' }]) expect(() => validateSecrets(input)).toThrow();
  });
  it('完整名称匹配；列表格式变化、失败返回、非法JSON均拒绝', () => {
    expect(databaseId(JSON.stringify([{ name: 'other', uuid: id }]), 'blog')).toBeUndefined();
    expect(() => databaseId('{}', 'blog')).toThrow();
    expect(() => databaseId(JSON.stringify([{ name: 'blog', uuid: 'bad' }]), 'blog')).toThrow();
    expect(bucketNames('Listing buckets...\n')).toEqual([]);
    expect(bucketNames('\u001b[32mListing buckets...\u001b[0m\nname:  blog-media-old\ncreation_date:  today\n')).toEqual(['blog-media-old']);
    for (const output of ['', 'Permission denied', 'Listing buckets...\nbucket_name: other', 'Listing buckets...\nname: blog-media']) expect(() => bucketNames(output)).toThrow();
    for (const output of ['[]', '[{"success":false,"results":[{"posts":0,"pages":0}]}]', '[{"success":true,"results":[{"posts":-1,"pages":0}]}]']) expect(() => contentCounts(output)).toThrow();
  });
  it('首次创建并写入正确生产绑定；仅迁移、不执行seed/清库/本地数据导入', async () => {
    const f = await fixture(); await f.deploy();
    const config = JSON.parse(await readFile(join(f.root, '.deploy/wrangler.production.json'), 'utf8'));
    expect(config.d1_databases[0].database_id).toBe(id);
    expect(config.r2_buckets[0].bucket_name).toBe('rinfinity-blog-media');
    expect(config.vars.APP_ENV).toBe('production');
    expect(config.d1_databases[0].migrations_dir).toBe(join(f.root, 'migrations'));
    expect(f.calls.filter(call => call.step.startsWith('创建'))).toHaveLength(2);
    expect(f.calls.at(-1).step).toBe('发布 Cloudflare Worker');
    const commands = JSON.stringify(f.calls);
    expect(commands).not.toMatch(/DELETE|seed|--local|\.dev\.vars|\.sqlite/);
    expect(commands).not.toContain(secrets.API_KEY_ENCRYPTION_KEY);
    expect(f.calls.find(call => call.step === '应用生产数据库迁移').args).toContain('--remote');
    expect(f.calls.at(-1).args).toContain(join(f.root, 'dist/server/wrangler.json'));
    expect(f.calls.at(-1).args).toContain('--secrets-file');
  });
  it('真实隔离D1：全部迁移后文章/页面为空；重试保留已上线文章、页面与生产密钥', async () => {
    const f = await fixture();
    mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("test")}}', compatibilityDate: '2026-10-18', d1Databases: ['DB'] }));
    f.state.db = await mf.getD1Database('DB');
    await f.deploy();
    expect(await f.state.db.prepare('SELECT count(*) AS count FROM posts').first('count')).toBe(0);
    expect(await f.state.db.prepare('SELECT count(*) AS count FROM pages').first('count')).toBe(0);
    expect(await f.state.db.prepare('SELECT count(*) AS count FROM categories').first('count')).toBe(0);
    const empty = JSON.parse(await f.state.db.prepare('SELECT value FROM settings WHERE id=1').first('value'));
    expect(empty.headerNav).toEqual([]);expect(empty.footerNav).toEqual([]);expect(empty.homeOptions.steps).toEqual([]);
    await f.state.db.exec("INSERT INTO categories(id,name,slug) VALUES('c','正式分类','category'); INSERT INTO posts(id,title,slug,category_id,created_at,updated_at,updated_by,last_operation) VALUES('p','正式文章','post','c','now','now','admin','op'); INSERT INTO pages(id,title,slug,created_at,updated_at,updated_by,last_operation) VALUES('g','正式页面','page','now','now','admin','op');");
    const secretsBefore = await readFile(join(f.root, '.deploy/secrets.json'), 'utf8');
    f.calls.length = 0; await f.deploy();
    expect(await f.state.db.prepare('SELECT title FROM posts WHERE id=?').bind('p').first('title')).toBe('正式文章');
    expect(await f.state.db.prepare('SELECT title FROM pages WHERE id=?').bind('g').first('title')).toBe('正式页面');
    expect(f.calls.some(call => call.step.startsWith('创建'))).toBe(false);
    expect(f.calls.findIndex(call => call.step === '备份已有生产 D1')).toBeLessThan(f.calls.findIndex(call => call.step === '应用生产数据库迁移'));
    expect(await readFile(join(f.root, '.deploy/secrets.json'), 'utf8')).toBe(secretsBefore);
  }, 30000);
  it('本地预检不查询/创建云资源，不迁移远端，不读取生产凭据', async () => {
    const f = await fixture(); await rm(join(f.root, '.deploy/secrets.json'));
    await f.deploy({ checkOnly: true, env: {} });
    expect(f.calls.filter(call => call.tool === 'wrangler').map(call => call.args[0])).toEqual(['deploy']);
    expect(f.calls.at(-1).args).toContain('--dry-run');
    expect(f.state.database).toBe(false); expect(f.state.bucket).toBe(false);
  });
  it.each(['类型检查 Astro', '类型检查 TypeScript', '类型检查后台', '运行自动测试', '查询 D1', '创建 D1', '确认 D1', '查询 R2', '创建 R2', '确认 R2', '构建生产 Worker', '验证 Worker 打包（不上传）', '应用生产数据库迁移', '校验生产内容'])('%s 失败立即停止，不发布且释放锁', async step => {
    const f = await fixture(); f.state.fail = step;
    await expect(f.deploy()).rejects.toThrow('simulated failure');
    expect(f.calls.some(call => call.step === '发布 Cloudflare Worker')).toBe(false);
    await expect(access(join(f.root, '.deploy/deploy.lock'))).rejects.toThrow();
  });
  it('已有库备份失败，不迁移、不发布', async () => {
    const f = await fixture(); f.state.database = true; f.state.bucket = true; f.state.fail = '备份已有生产 D1';
    await expect(f.deploy()).rejects.toThrow();
    expect(f.calls.some(call => call.step === '应用生产数据库迁移' || call.step === '发布 Cloudflare Worker')).toBe(false);
  });
  it('备份命令成功但文件为空，也停止迁移和发布', async () => {
    const f = await fixture(); f.state.database = true; f.state.bucket = true; f.state.emptyBackup = true;
    await expect(f.deploy()).rejects.toThrow('备份文件为空');
    expect(f.calls.some(call => call.step === '应用生产数据库迁移' || call.step === '发布 Cloudflare Worker')).toBe(false);
  });
  it('新库异常非空时拒绝上线，不删除任何内容', async () => {
    const f = await fixture(); f.state.posts = 2; f.state.pages = 1;
    await expect(f.deploy()).rejects.toThrow('新库出现非空');
    expect(f.calls.some(call => call.step === '发布 Cloudflare Worker')).toBe(false);
    expect(f.state.posts).toBe(2); expect(f.state.pages).toBe(1);
  });
  it('构建误用绑定时，在迁移和发布前中止', async () => {
    const f = await fixture(); f.state.wrongBinding = true;
    await expect(f.deploy()).rejects.toThrow('错误的生产绑定');
    expect(f.calls.some(call => call.step === '应用生产数据库迁移' || call.step === '发布 Cloudflare Worker')).toBe(false);
  });
  it('发布失败不报告成功，资源保留供下次重试', async () => {
    const f = await fixture(), logs = []; f.state.fail = '发布 Cloudflare Worker';
    await expect(f.deploy({ log: value => logs.push(value) })).rejects.toThrow('simulated failure');
    expect(logs.some(value => value.includes('已成功完成'))).toBe(false);
    expect(f.state.database).toBe(true); expect(f.state.bucket).toBe(true);
    await expect(access(join(f.root, '.deploy/deploy.lock'))).rejects.toThrow();
  });
  it('缺密钥、目标错误、并发锁阻止所有命令；损坏配置释放锁', async () => {
    const f = await fixture();
    await expect(f.deploy({ env: {} })).rejects.toThrow('ACCOUNT_ID');
    await writeFile(join(f.root, '.deploy/deploy.lock'), 'active');
    await expect(f.deploy()).rejects.toThrow('已有部署');
    expect(f.calls).toHaveLength(0);
    await rm(join(f.root, '.deploy/deploy.lock'));
    await writeFile(join(f.root, 'wrangler.jsonc'), 'invalid');
    await expect(f.deploy()).rejects.toThrow();
    await expect(access(join(f.root, '.deploy/deploy.lock'))).rejects.toThrow();
    await rm(join(f.root, '.deploy/secrets.json'));
    await expect(f.deploy()).rejects.toThrow('setup:production');
  });
  it('初始化独立生产凭据；重复初始化不重置，日志/代码不输出密码', async () => {
    const f = await fixture(); await rm(join(f.root, '.deploy/secrets.json'));
    expect(await setupProduction(f.root)).toBe(true);
    const before = await readFile(join(f.root, '.deploy/secrets.json'), 'utf8');
    const generated = validateSecrets(JSON.parse(before));
    expect(generated.ADMIN_USERNAME).toBe('admin');
    expect(await verifyPassword('123456', generated.ADMIN_PASSWORD_HASH)).toBe(true);
    expect(await verifyPassword('wrong-password', generated.ADMIN_PASSWORD_HASH)).toBe(false);
    expect(generated.API_KEY_ENCRYPTION_KEY).not.toBe(secrets.API_KEY_ENCRYPTION_KEY);
    expect(await readFile(join(f.root, '.deploy/admin.txt'), 'utf8')).toContain('123456');
    const other = await fixture(); await rm(join(other.root, '.deploy/secrets.json'));
    await setupProduction(other.root);
    const independent = JSON.parse(await readFile(join(other.root, '.deploy/secrets.json'), 'utf8'));
    expect(independent.ADMIN_PASSWORD_HASH).not.toBe(generated.ADMIN_PASSWORD_HASH);
    expect(independent.API_KEY_ENCRYPTION_KEY).not.toBe(generated.API_KEY_ENCRYPTION_KEY);
    expect(await setupProduction(f.root)).toBe(false);
    expect(await readFile(join(f.root, '.deploy/secrets.json'), 'utf8')).toBe(before);
  });
});
