/*
  Warnings:

  - You are about to drop the column `Two_or_More` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the column `Unknown` on the `Semester` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Semester" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Course" TEXT NOT NULL,
    "African_American" INTEGER NOT NULL,
    "Hispanic" INTEGER NOT NULL,
    "International" INTEGER NOT NULL,
    "Other" INTEGER NOT NULL,
    "White" INTEGER NOT NULL,
    "Male" INTEGER NOT NULL,
    "Female" INTEGER NOT NULL,
    "Total" INTEGER NOT NULL
);
INSERT INTO "new_Semester" ("African_American", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Total", "White") SELECT "African_American", "Course", "Female", "Hispanic", "Id", "International", "Male", "Name", "Other", "Total", "White" FROM "Semester";
DROP TABLE "Semester";
ALTER TABLE "new_Semester" RENAME TO "Semester";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
