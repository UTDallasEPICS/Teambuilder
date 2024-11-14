// export default defineEventHandler(async event => {
//   const { id } = getQuery(event);
//   return await event.context.client.team.findFirst({
//     where: {
//       id
//     }
//   });
// });

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  
  return await event.context.client.team.findFirst({
    where: {
      id,
    },
    include: {
      Project: true,   // Include project details
      Partner: true,   // Include partner details
      Students: true,  // Include associated students
    },
  });
});

