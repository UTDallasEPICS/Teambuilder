/*
  Warnings:

  - A unique constraint covering the columns `[year,season]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "semesters_year_season_key" ON "semesters"("year", "season");
