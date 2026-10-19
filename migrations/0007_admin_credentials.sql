-- 无记录时继续使用初始环境凭据，不迁移或重置现有密码。
CREATE TABLE admin_credentials (
 id INTEGER PRIMARY KEY CHECK(id=1),
 password_hash TEXT NOT NULL,
 version INTEGER NOT NULL CHECK(version>0),
 updated_at TEXT NOT NULL,
 last_operation TEXT NOT NULL
) STRICT;
ALTER TABLE sessions ADD COLUMN credential_version INTEGER NOT NULL DEFAULT 0;
