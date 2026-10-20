import {describe,it,expect} from 'vitest';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
describe('可选分类迁移与真实SQLite约束',()=>{
 it('逐字段保留旧文章/触发器，支持NULL，非法或已删除分类及路径冲突仍被拒绝',()=>{
  const db=new DatabaseSync(':memory:');try{
   const migrations=readdirSync('migrations').sort();for(const file of migrations.filter(x=>x<'0010'))db.exec(readFileSync('migrations/'+file,'utf8'));
   db.exec("INSERT INTO categories(id,name,slug) VALUES('active','活动分类','active'),('deleted','删除分类','deleted'); UPDATE categories SET deleted_at='now' WHERE id='deleted';");
   const insert=db.prepare("INSERT INTO posts(id,title,slug,category_id,body,published_at,created_at,updated_at,updated_by,last_operation,status,highlights) VALUES(?,?,?,?,'原文','2026-10-21','created','updated','actor','op','published','[\"亮点\"]')");
   insert.run('old','旧文章','old','active');const before=db.prepare('SELECT * FROM posts').all();const triggers=db.prepare("SELECT name FROM sqlite_schema WHERE type='trigger' ORDER BY name").all();
   db.exec('BEGIN');db.exec(readFileSync('migrations/0010_optional_post_category.sql','utf8'));db.exec('COMMIT');
   expect(db.prepare('SELECT * FROM posts').all()).toEqual(before);expect(db.prepare("SELECT name FROM sqlite_schema WHERE type='trigger' ORDER BY name").all()).toEqual(triggers);
   insert.run('none','无分类','none',null);expect(db.prepare("SELECT category_id FROM posts WHERE id='none'").get().category_id).toBeNull();
   expect(()=>insert.run('invalid','无效','invalid','missing')).toThrow();expect(()=>insert.run('removed','已删除','removed','deleted')).toThrow(/CATEGORY_DELETED/);
   expect(()=>db.exec("UPDATE posts SET category_id='deleted' WHERE id='none'")).toThrow(/CATEGORY_DELETED/);
   expect(()=>db.exec("UPDATE posts SET slug='admin' WHERE id='none'")).toThrow(/CONTENT_PATH_CONFLICT/);
   db.exec("INSERT INTO pages(id,title,slug,created_at,updated_at,updated_by,last_operation) VALUES('page','页面','page','c','u','a','o')");
   expect(()=>db.exec("UPDATE posts SET slug='page' WHERE id='none'")).toThrow(/CONTENT_PATH_CONFLICT/);
   expect(()=>db.exec("UPDATE pages SET slug='old' WHERE id='page'")).toThrow(/CONTENT_PATH_CONFLICT/);
   expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([]);expect(db.prepare("PRAGMA index_list(posts)").all().map(x=>x.name)).toContain('posts_category');
  }finally{db.close();}
 });
});
