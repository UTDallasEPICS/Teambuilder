/*
  Warnings:

  - Added the required column `description` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discord` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordUserName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gitHub` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gitUserName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayTeam` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_cs" INTEGER NOT NULL DEFAULT 0,
    "partner_id" TEXT NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("id", "name", "partner_id", "target_cs") SELECT "id", "name", "partner_id", "target_cs" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "years_of_experience" TEXT NOT NULL DEFAULT '',
    "class" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gitUserName" TEXT NOT NULL,
    "discordUserName" TEXT NOT NULL,
    "gitHub" BOOLEAN NOT NULL,
    "discord" BOOLEAN NOT NULL
);
INSERT INTO "new_students" ("class", "email", "first_name", "id", "last_name", "major", "years_of_experience") SELECT "class", "email", "first_name", "id", "last_name", "major", "years_of_experience" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE UNIQUE INDEX "students_gitUserName_key" ON "students"("gitUserName");
CREATE UNIQUE INDEX "students_discordUserName_key" ON "students"("discordUserName");
CREATE TABLE "new_teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "thursdayTeam" BOOLEAN NOT NULL,
    CONSTRAINT "teams_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teams_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_teams" ("id", "name", "partner_id", "project_id") SELECT "id", "name", "partner_id", "project_id" FROM "teams";
DROP TABLE "teams";
ALTER TABLE "new_teams" RENAME TO "teams";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
