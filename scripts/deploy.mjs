import { execFile } from 'node:child_process';
import { promisify, stripVTControlCharacters } from 'node:util';
import { readFile, writeFile, mkdir, open, unlink, stat } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomBytes, pbkdf2Sync } from 'node:crypto';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const execute = promisify(execFile);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const tools = {
  wrangler: 'wrangler/bin/wrangler.js', astro: 'astro/bin/astro.mjs',
  vitest: 'vitest/vitest.mjs', tsc: 'typescript/bin/tsc', 'vue-tsc': 'vue-tsc/bin/vue-tsc.js',
};

export function productionSettings(env) {
  const account = env.CLOUDFLARE_ACCOUNT_ID;
  const worker = env.BLOG_WORKER_NAME ?? 'rinfinity-blog';
  const database = env.BLOG_D1_NAME ?? `${worker}-db`;
  const bucket = env.BLOG_R2_NAME ?? `${worker}-media`;
  if (!/^[0-9a-f]{32}$/i.test(account ?? '')) throw new Error('请设置正确的 CLOUDFLARE_ACCOUNT_ID（32位账户ID）。');
  if (!/^[a-z][a-z0-9-]{0,62}$/.test(worker) || !/^[a-z][a-z0-9_-]{0,63}$/.test(database)) throw new Error('Worker 或 D1 名称格式不正确。');
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket) || bucket.startsWith('cf-')) throw new Error('R2 桶名称格式不正确。');
  return { account, worker, database, bucket };
}

export function validateSecrets(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
    Object.keys(value).sort().join(',') !== 'ADMIN_PASSWORD_HASH,ADMIN_USERNAME,API_KEY_ENCRYPTION_KEY' ||
    typeof value.ADMIN_USERNAME !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(value.ADMIN_USERNAME) ||
    typeof value.ADMIN_PASSWORD_HASH !== 'string' || typeof value.API_KEY_ENCRYPTION_KEY !== 'string' ||
    !/^[0-9a-f]{32}:[0-9a-f]{64}$/i.test(value.ADMIN_PASSWORD_HASH ?? '') ||
    !/^[0-9a-f]{64}$/i.test(value.API_KEY_ENCRYPTION_KEY ?? '')) {
    throw new Error('生产密钥配置无效。请运行 npm run setup:production，或恢复原生产 secrets.json。');
  }
  return value;
}

export function databaseId(output, name) {
  const rows = JSON.parse(output);
  if (!Array.isArray(rows) || rows.some(row => !row || typeof row.name !== 'string' || !uuid.test(row.uuid ?? ''))) throw new Error('D1 列表格式不符合预期，停止部署。');
  const matches = rows.filter(row => row.name === name);
  if (matches.length > 1) throw new Error('发现同名 D1，停止部署。');
  return matches[0]?.uuid;
}

export function bucketNames(output) {
  // Wrangler 4.151.1 的 list 没有 --json；按完整 name 字段匹配，禁止子串匹配。
  const text = stripVTControlCharacters(output);
  if (!text.includes('Listing buckets...')) throw new Error('R2 列表格式不符合预期，停止部署。');
  const body = text.slice(text.indexOf('Listing buckets...') + 'Listing buckets...'.length).trim();
  const row = /^name:[ \t]+([a-z0-9][a-z0-9-]{1,61}[a-z0-9])[ \t]*\r?\ncreation_date:[ \t]+[^\r\n]+$/gm;
  const names = [...body.matchAll(row)].map(match => match[1]);
  if (body.replace(row, '').trim()) throw new Error('R2 列表字段不完整，停止部署。');
  return names;
}

export function contentCounts(output) {
  const result = JSON.parse(output);
  const row = result?.[0]?.results?.[0];
  if (!Array.isArray(result) || result.length !== 1 || result[0].success !== true ||
    !row || !Number.isSafeInteger(row.posts) || row.posts < 0 || !Number.isSafeInteger(row.pages) || row.pages < 0) throw new Error('生产内容校验失败，停止部署。');
  return row;
}

export function commandRunner(root, env, secrets, log) {
  const hidden = [...Object.values(secrets), env.CLOUDFLARE_API_TOKEN, env.CLOUDFLARE_API_KEY].filter(Boolean);
  const redact = text => hidden.reduce((text, secret) => text.split(secret).join('[REDACTED]'), stripVTControlCharacters(text));
  return async (step, tool, args, overrides = {}) => {
    log(step);
    try {
      const { stdout } = await execute(process.execPath, [resolve(root, 'node_modules', tools[tool]), ...args], {
        cwd: root, shell: false, timeout: 15 * 60 * 1000, maxBuffer: 8 * 1024 * 1024,
        env: { ...env, CI: 'true', NO_COLOR: '1', WRANGLER_SEND_METRICS: 'false', ...overrides },
      });
      if (tool === 'vitest' || step === '发布 Cloudflare Worker') log(redact(stdout).trim());
      return stdout;
    } catch (error) {
      throw new Error(`${step}失败（${error.killed ? '超时' : error.code ?? '启动错误'}）。\n${redact(`${error.stdout ?? ''}\n${error.stderr ?? ''}`).slice(-4000)}`);
    }
  };
}

export function initialSecrets() {
  const salt = randomBytes(16).toString('hex');
  return {
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD_HASH: `${salt}:${pbkdf2Sync('123456', salt, 100000, 32, 'sha256').toString('hex')}`,
    API_KEY_ENCRYPTION_KEY: randomBytes(32).toString('hex'),
  };
}

export async function setupProduction(root = projectRoot) {
  const folder = resolve(root, '.deploy');
  await mkdir(folder, { recursive: true, mode: 0o700 });
  const path = resolve(folder, 'secrets.json');
  try {
    validateSecrets(JSON.parse(await readFile(path, 'utf8')));
    return false; // 已有生产加密密钥必须保留，避免旧 API 密钥无法解密。
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const password = '123456';
  const secrets = initialSecrets();
  // 凭据先落盘；写失败就不生成 secrets，禁止打印密码。
  await writeFile(resolve(folder, 'admin.txt'), `生产后台初始账号：admin\n初始密码：${password}\n上线后请在后台修改密码。请安全备份整个 .deploy 目录，切勿提交。\n`, { flag: 'wx', mode: 0o600 });
  await writeFile(path, JSON.stringify(secrets, null, 2), { flag: 'wx', mode: 0o600 });
  return true;
}

export async function runDeployment({ root = projectRoot, checkOnly = false, env = process.env, run, log = console.log } = {}) {
  const settings = productionSettings(checkOnly ? { ...env, CLOUDFLARE_ACCOUNT_ID: '0'.repeat(32) } : env);
  let secrets = {};
  const folder = resolve(root, '.deploy');
  const secretsPath = resolve(folder, 'secrets.json');
  if (!checkOnly) {
    try { secrets = validateSecrets(JSON.parse(await readFile(secretsPath, 'utf8'))); }
    catch { throw new Error('请先运行 npm run setup:production，或恢复原生产 .deploy/secrets.json；不会使用本地管理员凭据。'); }
  }
  await mkdir(folder, { recursive: true, mode: 0o700 });
  const lockPath = resolve(folder, 'deploy.lock');
  const lock = await open(lockPath, 'wx').catch(error => { throw new Error(error.code === 'EEXIST' ? '已有部署/预检在运行。若进程已退出，请确认后删除 .deploy/deploy.lock。' : '无法创建部署锁。'); });
  // 预检不携带云凭据；部署不上传本地 SQLite、.dev.vars 或演示 seed。
  const commandEnv = { ...env };
  delete commandEnv.CLOUDFLARE_ENV;
  delete commandEnv.BLOG_DEPLOY_CONFIG;
  if (checkOnly) for (const key of Object.keys(commandEnv)) if (/^CLOUDFLARE_|^CF_/.test(key)) delete commandEnv[key];
  const command = run ?? commandRunner(root, commandEnv, secrets, log);
  const configPath = resolve(folder, checkOnly ? 'wrangler.check.json' : 'wrangler.production.json');
  try {
    const source = JSON.parse(await readFile(resolve(root, 'wrangler.jsonc'), 'utf8'));
    const config = {
      $schema: resolve(root, 'node_modules/wrangler/config-schema.json'),
      name: settings.worker, account_id: settings.account,
      main: resolve(root, 'node_modules/@astrojs/cloudflare/dist/entrypoints/server.js'),
      compatibility_date: source.compatibility_date, compatibility_flags: source.compatibility_flags,
      assets: { directory: resolve(root, 'dist/client'), binding: 'ASSETS' },
      d1_databases: [{ binding: 'DB', database_name: settings.database, database_id: '00000000-0000-0000-0000-000000000001', migrations_dir: resolve(root, 'migrations') }],
      r2_buckets: [{ binding: 'MEDIA', bucket_name: settings.bucket }],
      vars: { APP_ENV: 'production' }, observability: { enabled: true },
    };
    const cf = (step, args) => command(step, 'wrangler', [...args, '--config', configPath]);
    await command('类型检查 Astro', 'astro', ['check']);
    await command('类型检查 TypeScript', 'tsc', ['--noEmit']);
    await command('类型检查后台', 'vue-tsc', ['--noEmit', '-p', 'tsconfig.studio.json']);
    await command('运行自动测试', 'vitest', ['run']);
    await writeFile(configPath, JSON.stringify(config, null, 2));
    let fresh = false;
    if (!checkOnly) {
      log(`部署目标：账户 ${settings.account} / ${settings.worker}；首次不导入文章、页面，已有内容保留。`);
      let id = databaseId(await cf('查询 D1', ['d1', 'list', '--json']), settings.database);
      if (!id) {
        await cf('创建 D1', ['d1', 'create', settings.database, '--update-config=false']);
        fresh = true;
        id = databaseId(await cf('确认 D1', ['d1', 'list', '--json']), settings.database);
        if (!id) throw new Error('创建后未找到目标 D1，停止部署。');
      }
      const buckets = bucketNames(await cf('查询 R2', ['r2', 'bucket', 'list']));
      if (!buckets.includes(settings.bucket)) {
        await cf('创建 R2', ['r2', 'bucket', 'create', settings.bucket, '--update-config=false']);
        if (!bucketNames(await cf('确认 R2', ['r2', 'bucket', 'list'])).includes(settings.bucket)) throw new Error('创建后未找到目标 R2，停止部署。');
      }
      config.d1_databases[0].database_id = id;
      await writeFile(configPath, JSON.stringify(config, null, 2));
    }
    // Astro 会对 configPath 使用 new URL；Windows盘符绝对路径会被误识别为协议。
    await command('构建生产 Worker', 'astro', ['build'], { BLOG_DEPLOY_CONFIG: `./${relative(root, configPath).replaceAll('\\', '/')}` });
    const builtPath = resolve(root, 'dist/server/wrangler.json');
    const built = JSON.parse(await readFile(builtPath, 'utf8'));
    if (built.name !== settings.worker || built.account_id !== settings.account || built.vars?.APP_ENV !== 'production' ||
      built.d1_databases?.[0]?.binding !== 'DB' || built.d1_databases[0].database_name !== settings.database ||
      built.d1_databases[0].database_id !== config.d1_databases[0].database_id ||
      built.r2_buckets?.[0]?.binding !== 'MEDIA' || built.r2_buckets[0].bucket_name !== settings.bucket) throw new Error('构建使用了错误的生产绑定，停止部署。');
    await command('验证 Worker 打包（不上传）', 'wrangler', ['deploy', '--dry-run', '--config', builtPath, '--outdir', resolve(folder, 'dry-run')]);
    if (checkOnly) { log('本地生产预检通过；未查询或创建云资源，未部署。'); return; }
    if (!fresh) {
      const backup = resolve(folder, 'backups', `${settings.database}-${Date.now()}.sql`);
      await mkdir(dirname(backup), { recursive: true, mode: 0o700 });
      await cf('备份已有生产 D1', ['d1', 'export', 'DB', '--remote', '--output', backup]);
      if ((await stat(backup)).size === 0) throw new Error('生产备份文件为空，停止迁移和发布。');
    }
    await cf('应用生产数据库迁移', ['d1', 'migrations', 'apply', 'DB', '--remote']);
    const counts = contentCounts(await cf('校验生产内容', ['d1', 'execute', 'DB', '--remote', '--command', 'SELECT (SELECT count(*) FROM posts) AS posts, (SELECT count(*) FROM pages) AS pages', '--json']));
    if (fresh && (counts.posts !== 0 || counts.pages !== 0)) throw new Error('新库出现非空文章/页面，停止发布；不会自动删除数据。');
    log(`生产文章 ${counts.posts} 篇，独立页面 ${counts.pages} 个；本地测试内容未导入。`);
    await command('发布 Cloudflare Worker', 'wrangler', ['deploy', '--config', builtPath, '--secrets-file', secretsPath]);
    log('发布命令已成功完成。请继续通过生产 HTTPS 验收登录、文章、页面和媒体功能。');
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || args.some(arg => !['--check', '--setup'].includes(arg))) throw new Error('仅支持 --check 或 --setup。');
    if (args[0] === '--setup') console.log(await setupProduction() ? '生产凭据已生成：.deploy/admin.txt；密钥：.deploy/secrets.json。请安全备份，未上传。' : '生产凭据已存在，保留原配置。');
    else await runDeployment({ checkOnly: args[0] === '--check' });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
