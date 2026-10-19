import { readFile, writeFile, mkdir, open, unlink, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { commandRunner, initialSecrets, contentCounts } from './deploy.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const requiredSecrets = ['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'API_KEY_ENCRYPTION_KEY'];

export async function runButtonDeployment({ root = projectRoot, env = process.env, run, log = console.log } = {}) {
  // 按钮先创建资源并回写配置；使用实际绑定，不自行猜测账户或数据库名称。
  const source = JSON.parse(await readFile(resolve(root, 'wrangler.jsonc'), 'utf8'));
  const builtPath = resolve(root, 'dist/server/wrangler.json');
  const built = JSON.parse(await readFile(builtPath, 'utf8'));
  const database = source.d1_databases?.find(binding => binding.binding === 'DB');
  const media = source.r2_buckets?.find(binding => binding.binding === 'MEDIA');
  const builtDatabase = built.d1_databases?.find(binding => binding.binding === 'DB');
  const builtMedia = built.r2_buckets?.find(binding => binding.binding === 'MEDIA');
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(source.name ?? '') ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(database?.database_id ?? '') ||
      database.database_id === '00000000-0000-0000-0000-000000000001' || !database.database_name || !media?.bucket_name) {
    throw new Error('未取得 Cloudflare 创建的 D1/R2 绑定。请从 README 的部署按钮创建项目；本机部署使用 npm run deploy:cli。');
  }
  if (built.name !== source.name || builtDatabase?.database_id !== database.database_id ||
      builtDatabase.database_name !== database.database_name || builtMedia?.bucket_name !== media.bucket_name ||
      (source.account_id && built.account_id !== source.account_id)) throw new Error('构建与源配置绑定不一致，停止发布，请重新构建。');

  const folder = resolve(root, '.deploy');
  await mkdir(folder, { recursive: true, mode: 0o700 });
  const lockPath = resolve(folder, 'deploy.lock');
  const lock = await open(lockPath, 'wx').catch(() => { throw new Error('无法获取部署锁，请确认没有其他部署正在执行。'); });
  const temporarySecrets = resolve(folder, `button-secrets-${randomUUID()}.json`);
  const command = run ?? commandRunner(root, env, {}, log);
  const cf = (step, args) => command(step, 'wrangler', [...args, '--config', builtPath]);
  try {
    let names;
    try {
      const listed = JSON.parse(await cf('读取现有生产密钥名称', ['secret', 'list', '--format', 'json']));
      if (!Array.isArray(listed) || listed.some(item => !item || typeof item.name !== 'string' || item.type !== 'secret_text')) throw new Error('密钥列表格式无效，停止发布。');
      names = new Set(listed.map(item => item.name));
    } catch (error) {
      // 仅接受 Wrangler 明确的 Worker 不存在错误；权限、网络与解析错误均中止。
      if (!error.message.includes(`Worker "${source.name}" not found.`)) throw error;
      names = new Set();
    }
    await mkdir(resolve(folder, 'backups'), { recursive: true, mode: 0o700 });
    const backup = resolve(folder, 'backups', `button-${Date.now()}-${randomUUID()}.sql`);
    await cf('备份部署数据库', ['d1', 'export', 'DB', '--remote', '--output', backup]);
    if ((await stat(backup)).size === 0) throw new Error('数据库备份为空，停止迁移和发布。');
    await cf('应用生产数据库迁移', ['d1', 'migrations', 'apply', 'DB', '--remote']);
    const output = await cf('校验生产内容', ['d1', 'execute', 'DB', '--remote', '--command',
      'SELECT (SELECT count(*) FROM posts) AS posts, (SELECT count(*) FROM pages) AS pages, (SELECT count(*) FROM api_key_secrets) AS encryptedKeys', '--json']);
    const counts = contentCounts(output);
    const encryptedKeys = JSON.parse(output)[0].results[0].encryptedKeys;
    if (!Number.isSafeInteger(encryptedKeys) || encryptedKeys < 0) throw new Error('加密密钥数据校验失败，停止发布。');
    if (!names.has('API_KEY_ENCRYPTION_KEY') && encryptedKeys > 0) throw new Error('已有 API 密钥但原加密密钥缺失，请恢复原加密密钥；不会生成新密钥覆盖。');
    const missing = requiredSecrets.filter(name => !names.has(name));
    const generated = missing.length ? initialSecrets() : {};
    const secrets = Object.fromEntries(missing.map(name => [name, generated[name]]));
    const args = ['deploy', '--config', builtPath];
    if (missing.length) {
      await writeFile(temporarySecrets, JSON.stringify(secrets), { flag: 'wx', mode: 0o600 });
      args.push('--secrets-file', temporarySecrets);
    }
    log(`文章 ${counts.posts} 篇，独立页面 ${counts.pages} 个；已有内容与密钥保持不变，仅补充 ${missing.length} 项缺失配置。`);
    await (run ?? commandRunner(root, env, secrets, log))('发布 Cloudflare Worker', 'wrangler', args);
    log('部署命令完成。新站后台 /admin，初始账号 admin；登录后请修改初始密码。');
  } finally {
    try { await unlink(temporarySecrets); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    finally { await lock.close(); await unlink(lockPath); }
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { await runButtonDeployment(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
