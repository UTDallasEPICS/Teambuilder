// export default defineEventHandler(async event => {
//   const { id } = getQuery(event);
//   await event.context.client.team.update({
//     where: {
//       id
//     },
//     data: {
//       removed:true,
//     },
//   });
// });


// 11/19/24 - added 
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  // Validate the ID is provided
  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing team ID.',
    });
  }

  // // Perform the update to mark the team as removed
  // const updatedTeam = await event.context.client.team.update({
  //   where: {
  //     id,
  //   },
  //   data: {
  //     removed: true,
  //   },
  // });

  // // Return the updated team record
  // return updatedTeam;

  
  try {
    const updatedTeam = await event.context.client.team.update({
      where: { id },
      // perform soft delete by setting removed to be true
      data: { removed: true },
    });
    return updatedTeam;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: `Team with id ${id} not found.`,
    });
  }
});

