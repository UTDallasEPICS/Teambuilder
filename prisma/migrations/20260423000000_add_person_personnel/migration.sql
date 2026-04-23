-- create the persons table
-- net_id is required and unique because it is the key for all upserts
-- everything else is optional so existing data does not break right away
CREATE TABLE "persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "net_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "github" TEXT,
    "discord" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- unique constraints on persons
CREATE UNIQUE INDEX "persons_net_id_key" ON "persons"("net_id");
CREATE UNIQUE INDEX "persons_email_key" ON "persons"("email");
CREATE UNIQUE INDEX "persons_github_key" ON "persons"("github");
CREATE UNIQUE INDEX "persons_discord_key" ON "persons"("discord");

-- create the personnel table
-- role is required so we always know what a person can access
CREATE TABLE "personnel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "personnel_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "personnel_person_id_key" ON "personnel"("person_id");

-- copy every existing student into persons
-- this keeps all their data intact and gives each student a Person record
INSERT INTO "persons" ("id", "net_id", "first_name", "last_name", "email", "github", "discord", "createdAt", "updatedAt")
SELECT "id", "net_id", "first_name", "last_name", "email", "github", "discord", "createdAt", "updatedAt"
FROM "students";

-- add person_id to students as nullable first so existing rows do not break
ALTER TABLE "students" ADD COLUMN "person_id" TEXT;

-- point each student at their new person record
-- since we used the same id when inserting into persons this is a direct match
UPDATE "students" SET "person_id" = "id";

-- add foreign key index
CREATE UNIQUE INDEX "students_person_id_key" ON "students"("person_id");

-- drop the columns that moved to persons
-- sqlite does not support DROP COLUMN before version 3.35
-- so we recreate the students table without those columns
PRAGMA foreign_keys=OFF;

CREATE TABLE "students_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "major" TEXT,
    "year" TEXT,
    "class" TEXT,
    "status" TEXT,
    "enrollment" TEXT,
    "meeting_day" TEXT,
    "gender" TEXT,
    "person_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "students_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- copy data into the new students table
INSERT INTO "students_new" ("id", "major", "year", "class", "status", "enrollment", "meeting_day", "gender", "person_id", "createdAt", "updatedAt")
SELECT "id", "major", "year", "class", "status", "enrollment", "meeting_day", "gender", "person_id", "createdAt", "updatedAt"
FROM "students";

-- swap tables
DROP TABLE "students";
ALTER TABLE "students_new" RENAME TO "students";

-- recreate the student to team join table index
CREATE UNIQUE INDEX "students_person_id_key" ON "students"("person_id");

PRAGMA foreign_keys=ON;
