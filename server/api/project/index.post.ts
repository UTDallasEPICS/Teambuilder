// TODO: Test the Post/Create function
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
      Teams: true,
      Partner: true 
    }
  });
  return postProject;
});