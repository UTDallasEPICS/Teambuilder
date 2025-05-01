// for dynamic fetching
export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);
  
    const partner = await event.context.client.partner.findUnique({
      where: { id },
      include: {
        projects: {
          select: { name: true },
        },
      },
    });
  
    return {
      ...partner,
      projectName: partner?.projects?.map(p => p.name).join(', ') || 'None',
    };
  });
  