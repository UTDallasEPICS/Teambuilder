//TODO: Test the Get/Read functionality
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event); // Extract the query parameter 'id' from the request URL

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Partner ID is required.",
    });
  }

  const getPartner = await event.context.client.partner.findUnique({
    where: {
      id: id as string, // Ensure the 'id' is treated as a string
    },
    include: {
      Projects: true, // Optionally include related projects
      Teams: true,    // Optionally include related teams
    },
  });

  if (!getPartner) {
    throw createError({
      statusCode: 404,
      message: "Partner not found.",
    });
  }

  return getPartner;
});
