//TODO: Test Delete Functionality
export default defineEventHandler(async (event) => {
  //const { name } = await readBody(event);
  const { id } = getQuery(event);
  const deletedPartner = await event.context.client.project.delete({
      where: {
          id: id,
      },
      data: {
          removed:true,
      },
  });
  return deletedPartner;
})