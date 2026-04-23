-- Add meeting_day to teams and make team uniqueness day-aware.
-- Existing teams are backfilled from project meeting_day:
--   WEDNESDAY -> WEDNESDAY, everything else -> THURSDAY.
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_teams" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "project_id" TEXT NOT NULL,
  "semester_id" TEXT NOT NULL,
  "meeting_day" TEXT NOT NULL DEFAULT 'THURSDAY',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "teams_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "teams_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_teams" ("id", "project_id", "semester_id", "meeting_day", "createdAt", "updatedAt")
SELECT
  t."id",
  t."project_id",
  t."semester_id",
  CASE
    WHEN p."meeting_day" = 'WEDNESDAY' THEN 'WEDNESDAY'
    ELSE 'THURSDAY'
  END AS "meeting_day",
  t."createdAt",
  t."updatedAt"
FROM "teams" t
LEFT JOIN "projects" p ON p."id" = t."project_id";

DROP TABLE "teams";
ALTER TABLE "new_teams" RENAME TO "teams";

CREATE UNIQUE INDEX "teams_project_id_semester_id_meeting_day_key" ON "teams"("project_id", "semester_id", "meeting_day");

PRAGMA foreign_keys=ON;
