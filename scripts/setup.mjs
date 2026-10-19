import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { existsSync, writeFileSync, readFileSync, appendFileSync } from 'node:fs';
if (existsSync('.dev.vars')) { console.log('本地配置已存在，保留现有凭证。'); }
else {
  const password = '123456';
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex');
  writeFileSync('.dev.vars',`ADMIN_USERNAME=admin\nADMIN_PASSWORD_HASH=${salt}:${hash}\n`);
  writeFileSync('local-admin.txt',`本地管理后台：http://127.0.0.1:4321/admin\n用户名：admin\n密码：${password}\n仅本地使用，请勿提交此文件。\n`);
  console.log('已生成本地管理员，凭证保存在 local-admin.txt（未打印）。');
}
const configuration = readFileSync('.dev.vars', 'utf8');
if (!/^API_KEY_ENCRYPTION_KEY\s*=/m.test(configuration)) {
  appendFileSync('.dev.vars', `\nAPI_KEY_ENCRYPTION_KEY=${randomBytes(32).toString('hex')}\n`);
  console.log('已补充本地密钥加密配置，原管理员凭证保持不变；请重启本地服务。');
}
