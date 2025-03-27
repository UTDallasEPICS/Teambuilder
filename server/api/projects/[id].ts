// TODO: add DELETE

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: {
          error: 'Project ID is required'
        }
      }
    }

    const method = event.method;
    const project = event.context.client.project;
    const updatedProject = await readBody(event);

    console.log(id)
    console.log(method)
    console.log(updatedProject)

    switch (method) {
      case 'GET':
        return project.findUnique({ where: { id } });
      case 'PUT':
        return project.update({
          where: { id },
          data: updatedProject,
        })
    }
});
