import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const directory = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const files = readdirSync(directory).filter(name => name.endsWith('.sqlite') && name !== 'metadata.sqlite');
assert.equal(files.length, 1, '必须唯一定位本地文章数据库');
const live = new DatabaseSync(directory + '/' + files[0], { readOnly: true });
const backup = new DatabaseSync(':memory:');
backup.exec(readFileSync('.local-backups/before-article-metadata-20261020.sql', 'utf8'));
const columns = backup.prepare('PRAGMA table_info(posts)').all().map(row => row.name);
const projection = columns.map(name => '"' + name + '"').join(',');
const previous = backup.prepare('SELECT ' + projection + ' FROM posts ORDER BY id').all();
for (const row of previous) {
  assert.deepEqual(live.prepare('SELECT ' + projection + ' FROM posts WHERE id=?').get(row.id), row, '原文章行不得被验收改变');
}
assert(live.prepare('PRAGMA table_info(posts)').all().some(row => row.name === 'highlights'));
assert(live.prepare('SELECT name FROM d1_migrations WHERE name=?').get('0006_article_highlights.sql'));
assert.equal(live.prepare('SELECT status FROM posts WHERE id=?').get('95b1bd5e-d5a9-4cf4-95a2-d2fda9a6ae02')?.status, 'trash');
const result = { passed: true, migrationApplied: true, originalRowsUnchanged: previous.length, browserFixtureInTrash: true, statusCounts: live.prepare('SELECT status, COUNT(*) count FROM posts GROUP BY status').all() };
writeFileSync('test-results/article-live-database.json', JSON.stringify(result, null, 2));
console.log('本地迁移已核对，原有 ' + previous.length + ' 行文章完全保持，浏览器验收草稿已在回收站。');
live.close(); backup.close();
