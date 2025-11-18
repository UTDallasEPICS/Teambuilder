export default defineEventHandler(async event => {
  const body = await readBody(event);
  
  // Handle array of projects (bulk upload)
  if (Array.isArray(body)) {
    const createdProjects = [];
    
    for (const project of body) {
      // Find partner by name if partnerName is provided
      let partnerId = null;
      if (project.partnerName) {
        const partner = await event.context.client.partner.findFirst({
          where: { name: project.partnerName }
        });
        if (partner) {
          partnerId = partner.id;
          console.log(`Found partner "${project.partnerName}" with ID ${partnerId} for project "${project.name}"`);
        } else {
          console.log(`Partner "${project.partnerName}" not found for project "${project.name}"`);
        }
      }
      
      // If no partner found, create/use default partner
      if (!partnerId) {
        console.log(`Using default partner for project "${project.name}"`);
        let defaultPartner = await event.context.client.partner.findFirst({
          where: { name: 'Default Partner' }
        });
        
        if (!defaultPartner) {
          defaultPartner = await event.context.client.partner.create({
            data: {
              name: 'Default Partner',
              contactName: 'N/A',
              contactEmail: 'default@example.com'
            }
          });
        }
        partnerId = defaultPartner.id;
      }
      
      const createdProject = await event.context.client.project.create({
        data: {
          name: project.name,
          description: project.description,
          type: project.type || 'SOFTWARE',
          status: project.status || 'NEW',
          repoURL: project.repoURL,
          partnerId: partnerId
        },
        include: {
          partner: true
        }
      });
      
      createdProjects.push(createdProject);
    }
    
    return createdProjects;
  }
  
  // Handle single project (original behavior)
  const { name, description, partnerId } = body;
  const postProject = await event.context.client.project.create({
    data: {
      name,
      description,
      Partner: {
        connect: { id: partnerId }
      }
    },
    include: {
      partner: true
    }
  });
  return postProject;
});