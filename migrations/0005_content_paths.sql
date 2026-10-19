-- Both tables retain their slugs in trash; cross-content paths cannot shadow one another.
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
