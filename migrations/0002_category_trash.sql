-- Additive migration: existing categories stay active; paths remain reserved in trash.
ALTER TABLE categories ADD COLUMN deleted_at TEXT;
ALTER TABLE categories ADD COLUMN last_operation TEXT;

-- Enforce the post/category invariant even if a write races with deletion.
CREATE TRIGGER posts_active_category_insert BEFORE INSERT ON posts
WHEN EXISTS(SELECT 1 FROM categories WHERE id=NEW.category_id AND deleted_at IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'CATEGORY_DELETED'); END;
CREATE TRIGGER posts_active_category_update BEFORE UPDATE OF category_id ON posts
WHEN EXISTS(SELECT 1 FROM categories WHERE id=NEW.category_id AND deleted_at IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'CATEGORY_DELETED'); END;
