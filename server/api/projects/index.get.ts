export default defineEventHandler(async (event) => {
    const project = event.context.client.project;
    const { id } = getQuery(event);

    if (id) {
        return project.findUnique({ where: { id } })
    } else {
        return project.findMany();
    }
})