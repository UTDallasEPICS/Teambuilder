/*
  Warnings:

  - You are about to drop the column `years_of_experience` on the `students` table. All the data in the column will be lost.
  - Added the required column `description` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordUser` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gitUserName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netID` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Semester" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Course" TEXT NOT NULL,
    "Year" INTEGER NOT NULL,
    "Sem" TEXT NOT NULL,
    "African_American" INTEGER NOT NULL,
    "Asian" INTEGER NOT NULL,
    "Hispanic" INTEGER NOT NULL,
    "International" INTEGER NOT NULL,
    "Other" INTEGER NOT NULL,
    "White" INTEGER NOT NULL,
    "Male" INTEGER NOT NULL,
    "Female" INTEGER NOT NULL,
    "Total" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_cs" INTEGER NOT NULL DEFAULT 0,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partner_id" TEXT NOT NULL,
    CONSTRAINT "projects_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("id", "name", "partner_id", "target_cs") SELECT "id", "name", "partner_id", "target_cs" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE TABLE "new_students" (
    "gitUserName" TEXT NOT NULL,
    "discordUser" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "seniority" TEXT NOT NULL DEFAULT '',
    "class" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enrollment" TEXT NOT NULL,
    "netID" TEXT NOT NULL
);
INSERT INTO "new_students" ("class", "email", "first_name", "id", "last_name", "major") SELECT "class", "email", "first_name", "id", "last_name", "major" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_gitUserName_key" ON "students"("gitUserName");
CREATE UNIQUE INDEX "students_discordUser_key" ON "students"("discordUser");
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
