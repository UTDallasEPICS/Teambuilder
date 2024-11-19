/*
  Warnings:

  - Added the required column `Sem` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Semester" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Course" TEXT NOT NULL,
    "Year" TEXT NOT NULL,
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
INSERT INTO "new_Semester" ("African_American", "Asian", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Total", "White") SELECT "African_American", "Asian", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Total", "White" FROM "Semester";
DROP TABLE "Semester";
ALTER TABLE "new_Semester" RENAME TO "Semester";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
