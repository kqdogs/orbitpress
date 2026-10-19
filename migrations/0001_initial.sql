PRAGMA foreign_keys = ON;
CREATE TABLE categories (
 id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 40), slug TEXT NOT NULL UNIQUE,
 description TEXT NOT NULL DEFAULT '', icon TEXT NOT NULL DEFAULT 'globe', version INTEGER NOT NULL DEFAULT 1
) STRICT;
CREATE TABLE posts (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '',
 category_id TEXT NOT NULL REFERENCES categories(id), cover TEXT NOT NULL DEFAULT '', video_id TEXT NOT NULL DEFAULT '',
 featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0,1)), tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(tags)),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','trash')),
 published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1 CHECK(version>0), last_operation TEXT NOT NULL,
 CHECK(status <> 'published' OR published_at IS NOT NULL)
) STRICT;
CREATE INDEX posts_public ON posts(status,published_at DESC,id DESC);
CREATE INDEX posts_category ON posts(category_id,status,published_at DESC,id DESC);
CREATE TABLE sessions (hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires_at INTEGER NOT NULL) STRICT;
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE api_keys (id TEXT PRIMARY KEY,name TEXT NOT NULL,hash TEXT NOT NULL UNIQUE,scopes TEXT NOT NULL CHECK(json_valid(scopes)),created_at TEXT NOT NULL,expires_at INTEGER NOT NULL,revoked_at TEXT) STRICT;
CREATE TABLE audit (id TEXT PRIMARY KEY,actor TEXT NOT NULL,action TEXT NOT NULL,resource_id TEXT NOT NULL,created_at TEXT NOT NULL) STRICT;
CREATE INDEX audit_date ON audit(created_at DESC);
CREATE TABLE idempotency (scope TEXT PRIMARY KEY,fingerprint TEXT NOT NULL,response TEXT NOT NULL,code INTEGER NOT NULL,expires_at INTEGER NOT NULL) STRICT;
CREATE INDEX idempotency_expiry ON idempotency(expires_at);
CREATE TABLE rate_limits (id TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL) STRICT;
CREATE TABLE media (id TEXT PRIMARY KEY,name TEXT NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL,created_at TEXT NOT NULL) STRICT;
CREATE TABLE settings (id INTEGER PRIMARY KEY CHECK(id=1),value TEXT NOT NULL CHECK(json_valid(value)),version INTEGER NOT NULL DEFAULT 1) STRICT;
INSERT INTO settings(id,value) VALUES(1,'{"title":"YaChin科技生活","tagline":"连接世界的科技频道","description":"分享海外账户、虚拟卡、eSIM 和 AI 工具的实用教程。","youtube":"","telegram":"","bilibili":"","twitter":"","notice":"","headerNav":[],"footerNav":[],"homeOptions":{"steps":[],"categoryIds":[],"promoHref":"/tutorials/"}}');
