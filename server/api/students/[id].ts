/**
 * POST /api/bids
 * Imports a parsed UTDesign/EPICS bid-response CSV.
 *
 * Expected row shape (after PapaParse with header:true):
 *   row["Student Name"]  – first name (may be multi-word, e.g. "Maryam Fatima")
 *   row[""]              – last name  (empty-string header from the blank column in the CSV)
 *   row["Student Email"] – email
 *   row["SSO ID"]        – netID (skip row if blank)
 *   row["Classification"]– Freshman | Sophomore | Junior | Senior
 *   row["Enrollment"]    – "EPCS 2200" | "EPCS 3200"
 *   row["School and Major"] – "Erik Jonsson … :::: Computer Science"
 *   row["Gender"]        – Male | Female | Non-binary | Prefer not to say
 *   row["Choice 1"] … row["Choice 6"] – "S26 - OrgName: ProjectTitle" (blank if none)
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return { statusCode: 400, body: { error: 'Student ID is required' } };
  }

  const method = event.method;
  const client: PrismaClient = event.context.client;

  switch (method) {
    case 'GET':
      // include the linked Person so callers get name email etc
      return client.student.findUnique({
        where: { id },
        include: { person: true },
      });

    case 'PUT': {
      const body = await readBody(event);

      // fields that belong on Person
      const personFields: any = {};
      if (body.firstName !== undefined) personFields.firstName = body.firstName;
      if (body.lastName  !== undefined) personFields.lastName  = body.lastName;
      if (body.email     !== undefined) personFields.email     = body.email;
      if (body.github    !== undefined) personFields.github    = body.github;
      if (body.discord   !== undefined) personFields.discord   = body.discord;

      // fields that belong on Student
      const studentFields: any = {};
      if (body.major      !== undefined) studentFields.major      = body.major;
      if (body.year       !== undefined) studentFields.year       = body.year;
      if (body.class      !== undefined) studentFields.class      = body.class;
      if (body.status     !== undefined) studentFields.status     = body.status;
      if (body.enrollment !== undefined) studentFields.enrollment = body.enrollment;
      if (body.meetingDay !== undefined) studentFields.meetingDay = body.meetingDay;
      if (body.gender     !== undefined) studentFields.gender     = body.gender;

      // get the student first so we know which person to update
      const existing = await client.student.findUnique({ where: { id } });
      if (!existing) throw createError({ statusCode: 404, message: 'Student not found' });

      // update person if there are person-level changes
      if (Object.keys(personFields).length > 0) {
        await client.person.update({
          where: { id: existing.personId },
          data: personFields,
        });
      }

      // update student fields
      return client.student.update({
        where: { id },
        data: studentFields,
        include: { person: true },
      });
    }

    case 'DELETE':
      return client.student.delete({ where: { id } });
  }
});
