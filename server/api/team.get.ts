// export default defineEventHandler(async event => {
//   const { id } = getQuery(event);
//   return await event.context.client.team.findFirst({
//     where: {
//       id
//     }
//   });
// });

// export default defineEventHandler(async (event) => {
//   const { id } = getQuery(event);
  
//   return await event.context.client.team.findFirst({
//     where: {
//       id,
//     },
//     include: {
//       Project: true,   // Include project details
//       Partner: true,   // Include partner details
//       Students: true,  // Include associated students
//     },
//   });
// });


// 11/19/24
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  // Validate the query parameter
  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing team ID.',
    });
  }

  // Fetch the team details
  const team = await event.context.client.team.findFirst({
    where: {
      id,
      removed: false, // Exclude teams marked as removed
    },
    include: {
      Project: true,   // Include project details
      Partner: true,   // Include partner details
      Students: {
        include: {
          Student: true, // Include student details for associated students
        },
      },
    },
  });

  // Handle case where no team is found
  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: `Team with id "${id}" not found.`,
    });
  }

  return team;
});


