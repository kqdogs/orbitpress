-- Preserve every existing post; NULL means no category was assigned.
-- Drop external triggers temporarily so SQLite can rename the replacement table.
DROP TRIGGER pages_path_insert;
DROP TRIGGER pages_path_update;
DROP TRIGGER settings_admin_path;
CREATE TABLE posts_optional_category (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '',
 category_id TEXT REFERENCES categories(id), cover TEXT NOT NULL DEFAULT '', video_id TEXT NOT NULL DEFAULT '',
 featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0,1)), tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(tags)),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','trash')),
 published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1 CHECK(version>0), last_operation TEXT NOT NULL,
 highlights TEXT DEFAULT NULL CHECK(highlights IS NULL OR (json_valid(highlights) AND json_type(highlights)='array' AND json_array_length(highlights)<=6)),
 resources TEXT NOT NULL DEFAULT '{"title":"本期视频提到的链接","items":[],"descriptionUrl":""}' CHECK(json_valid(resources) AND json_type(resources)='object'),
 CHECK(status <> 'published' OR published_at IS NOT NULL)
) STRICT;
INSERT INTO posts_optional_category(id,title,slug,excerpt,body,category_id,cover,video_id,featured,tags,status,published_at,created_at,updated_at,updated_by,version,last_operation,highlights,resources)
 SELECT id,title,slug,excerpt,body,category_id,cover,video_id,featured,tags,status,published_at,created_at,updated_at,updated_by,version,last_operation,highlights,resources FROM posts;
DROP TABLE posts;
ALTER TABLE posts_optional_category RENAME TO posts;
CREATE INDEX posts_public ON posts(status,published_at DESC,id DESC);
CREATE INDEX posts_category ON posts(category_id,status,published_at DESC,id DESC);
CREATE TRIGGER posts_active_category_insert BEFORE INSERT ON posts
WHEN EXISTS(SELECT 1 FROM categories WHERE id=NEW.category_id AND deleted_at IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'CATEGORY_DELETED'); END;
CREATE TRIGGER posts_active_category_update BEFORE UPDATE OF category_id ON posts
WHEN EXISTS(SELECT 1 FROM categories WHERE id=NEW.category_id AND deleted_at IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'CATEGORY_DELETED'); END;
CREATE TRIGGER pages_path_insert BEFORE INSERT ON pages BEGIN
 SELECT RAISE(ABORT,'CONTENT_PATH_CONFLICT') WHERE EXISTS(SELECT 1 FROM posts WHERE slug=NEW.slug)
 OR EXISTS(SELECT 1 FROM settings WHERE COALESCE(json_extract(value,'$.adminPath'),'/admin')='/'||NEW.slug);
END;
CREATE TRIGGER pages_path_update BEFORE UPDATE OF slug ON pages BEGIN
 SELECT RAISE(ABORT,'CONTENT_PATH_CONFLICT') WHERE EXISTS(SELECT 1 FROM posts WHERE slug=NEW.slug)
 OR EXISTS(SELECT 1 FROM settings WHERE COALESCE(json_extract(value,'$.adminPath'),'/admin')='/'||NEW.slug);
END;
CREATE TRIGGER posts_path_insert BEFORE INSERT ON posts BEGIN
 SELECT RAISE(ABORT,'CONTENT_PATH_CONFLICT') WHERE EXISTS(SELECT 1 FROM pages WHERE slug=NEW.slug)
 OR EXISTS(SELECT 1 FROM settings WHERE COALESCE(json_extract(value,'$.adminPath'),'/admin')='/'||NEW.slug);
END;
CREATE TRIGGER posts_path_update BEFORE UPDATE OF slug ON posts BEGIN
 SELECT RAISE(ABORT,'CONTENT_PATH_CONFLICT') WHERE EXISTS(SELECT 1 FROM pages WHERE slug=NEW.slug)
 OR EXISTS(SELECT 1 FROM settings WHERE COALESCE(json_extract(value,'$.adminPath'),'/admin')='/'||NEW.slug);
END;
CREATE TRIGGER settings_admin_path BEFORE UPDATE OF value ON settings BEGIN
 SELECT RAISE(ABORT,'CONTENT_PATH_CONFLICT') WHERE
 EXISTS(SELECT 1 FROM posts WHERE '/'||slug=COALESCE(json_extract(NEW.value,'$.adminPath'),'/admin'))
 OR EXISTS(SELECT 1 FROM pages WHERE '/'||slug=COALESCE(json_extract(NEW.value,'$.adminPath'),'/admin'));
END;
