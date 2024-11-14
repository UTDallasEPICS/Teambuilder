/*
  Warnings:

  - Added the required column `gitUserName` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Semester" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Course" TEXT NOT NULL,
    "African_American" INTEGER NOT NULL,
    "Hispanic" INTEGER NOT NULL,
    "International" INTEGER NOT NULL,
    "Two_or_More" INTEGER NOT NULL,
    "Other" INTEGER NOT NULL,
    "Unknown" INTEGER NOT NULL,
    "White" INTEGER NOT NULL,
    "Male" INTEGER NOT NULL,
    "Female" INTEGER NOT NULL,
    "Total" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "years_of_experience" TEXT NOT NULL DEFAULT '',
    "class" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gitUserName" TEXT NOT NULL
);
INSERT INTO "new_students" ("class", "email", "first_name", "id", "last_name", "major", "years_of_experience") SELECT "class", "email", "first_name", "id", "last_name", "major", "years_of_experience" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE UNIQUE INDEX "students_gitUserName_key" ON "students"("gitUserName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
