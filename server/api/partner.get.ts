//TODO: Test the Get/Read functionality
export default defineEventHandler(async (event) => {
  //const {id} = await $fetch('$POSTGRES_PORT:5432');
  //const { id } = await readBody(event);
  const {id} = getQuery(event);
  const getPartner = await event.context.client.project.findUnique({
      where: {
          id: id,
      }, 
  });
  return getPartner;
})
