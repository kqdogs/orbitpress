PRAGMA foreign_keys = ON;
CREATE TABLE pages (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 excerpt TEXT NOT NULL DEFAULT '',
 body TEXT NOT NULL DEFAULT '',
 menu_label TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','trash')),
 published_at TEXT,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 updated_by TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1 CHECK(version>0),
 last_operation TEXT NOT NULL,
 CHECK(status <> 'published' OR published_at IS NOT NULL)
) STRICT;
CREATE INDEX pages_public ON pages(status,published_at DESC,id DESC);
