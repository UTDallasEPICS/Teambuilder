import type { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const meetingDay = typeof query.meetingDay === 'string' ? query.meetingDay.toUpperCase() : null;

  const where: Prisma.StudentWhereInput =
    meetingDay === 'WEDNESDAY'
      ? { meetingDay: 'WEDNESDAY' }
      : meetingDay === 'THURSDAY'
        ? {
            OR: [
              { meetingDay: 'THURSDAY' },
              { meetingDay: null },
            ],
          }
        : {};

  const result = await event.context.client.$transaction(async (tx: Prisma.TransactionClient) => {
    const studentsToDelete = await tx.student.findMany({
      where,
      select: { id: true },
    });

    if (studentsToDelete.length === 0) {
      return { count: 0 };
    }

    const studentIds = studentsToDelete.map((student: { id: string }) => student.id);

    // Choices reference students via foreign key, so remove those first.
    await tx.choice.deleteMany({
      where: {
        studentId: { in: studentIds },
      },
    });

    // Ensure any existing team membership links are removed before deletion.
    await Promise.all(
      studentIds.map((id: string) =>
        tx.student.update({
          where: { id },
          data: {
            teams: { set: [] },
          },
        })
      )
    );

    return tx.student.deleteMany({
      where: {
        id: { in: studentIds },
      },
    });
  });
  
  return {
    success: true,
    count: result.count,
    message: `Deleted ${result.count} students`
  };
});
