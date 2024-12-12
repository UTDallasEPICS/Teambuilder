//TODO: Test Delete Functionality
export default defineEventHandler(async (event) => {
    //const { name } = await readBody(event);
    const { name } = getQuery(event);
    const deletedProject = await event.context.client.project.delete({
        where: {
            name: name,
        },
        data: {
            removed:true,
        },
    });
    return deletedProject;
})