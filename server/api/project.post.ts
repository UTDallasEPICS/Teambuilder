// TODO: Test the function
export default defineEventHandler(async event => {
  const { name, description, partnerId } = await readBody(event);
  const postProject = await event.context.client.project.create({
    data: {
      name,
      description,
      Partner: {
        connect: { id: partnerId }
      }
    },
    include: {
      partner: true,
      name: true
    }
  });
  return postProject;
});