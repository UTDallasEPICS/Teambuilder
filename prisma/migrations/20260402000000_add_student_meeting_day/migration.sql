-- Add nullable meeting day for students to support Wednesday/Thursday split uploads
ALTER TABLE "students" ADD COLUMN "meeting_day" TEXT;