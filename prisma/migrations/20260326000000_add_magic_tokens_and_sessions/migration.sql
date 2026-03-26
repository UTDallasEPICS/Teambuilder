-- Add MagicToken table
CREATE TABLE "magic_tokens" (
    "id"         TEXT NOT NULL PRIMARY KEY,
    "token"      TEXT NOT NULL,
    "email"      TEXT NOT NULL,
    "used"       BOOLEAN NOT NULL DEFAULT false,
    "expiresAt"  DATETIME NOT NULL,
    "user_id"    TEXT NOT NULL,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "magic_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Unique index on magic_tokens.token
CREATE UNIQUE INDEX "magic_tokens_token_key" ON "magic_tokens"("token");

-- Add Session table
CREATE TABLE "sessions" (
    "id"        TEXT NOT NULL PRIMARY KEY,
    "token"     TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Unique index on sessions.token
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
