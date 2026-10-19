-- Additive: hash-only keys remain valid and are not rewritten.
CREATE TABLE api_key_secrets (
 key_id TEXT PRIMARY KEY REFERENCES api_keys(id) ON DELETE CASCADE,
 encrypted_token TEXT NOT NULL CHECK(length(encrypted_token)=194)
) STRICT;
