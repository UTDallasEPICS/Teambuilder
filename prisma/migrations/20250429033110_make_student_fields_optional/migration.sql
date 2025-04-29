-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "github" TEXT,
    "discord" TEXT,
    "email" TEXT,
    "net_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "enrollment" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_students" ("class", "createdAt", "discord", "email", "enrollment", "first_name", "github", "id", "last_name", "major", "net_id", "status", "updatedAt", "year") SELECT "class", "createdAt", "discord", "email", "enrollment", "first_name", "github", "id", "last_name", "major", "net_id", "status", "updatedAt", "year" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_github_key" ON "students"("github");
CREATE UNIQUE INDEX "students_discord_key" ON "students"("discord");
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE UNIQUE INDEX "students_net_id_key" ON "students"("net_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
