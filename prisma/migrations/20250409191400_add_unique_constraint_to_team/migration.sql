/*
  Warnings:

  - A unique constraint covering the columns `[project_id,semester_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "teams_project_id_semester_id_key" ON "teams"("project_id", "semester_id");
