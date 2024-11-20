/*
  Warnings:

  - You are about to alter the column `Year` on the `Semester` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Semester" (
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
INSERT INTO "new_Semester" ("African_American", "Asian", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Sem", "Total", "White", "Year") SELECT "African_American", "Asian", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Sem", "Total", "White", "Year" FROM "Semester";
DROP TABLE "Semester";
ALTER TABLE "new_Semester" RENAME TO "Semester";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
