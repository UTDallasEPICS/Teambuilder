//TODO: Implement the Get functionality
export default defineEventHandler(async (event) => {
    const {id, description, name } = await $fetch('$POSTGRES_PORT:5432');
    const getProject = await event.context.client.project.findFirst({
        
    });
    return getProject;
})
  