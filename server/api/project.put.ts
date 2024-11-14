//TODO: Test the Put/Update functionality
export default defineEventHandler(async (event) => {
    const { id, name, description, partnerId } = await readBody(event);
    const updateProject = await event.context.client.project.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          description: description,
          partnerId: partnerId,
        },
      })
    return updateProject;
});
