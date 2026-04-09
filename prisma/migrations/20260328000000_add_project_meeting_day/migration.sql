-- Add nullable meeting day for projects to support Wednesday/Thursday split uploads
ALTER TABLE "projects" ADD COLUMN "meeting_day" TEXT;
