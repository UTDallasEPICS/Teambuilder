export default defineEventHandler(async event => {
  const body = await readBody(event);
  type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH'

  const normalizeMeetingDay = (value: unknown): MeetingDay | null => {
    if (typeof value !== 'string') return null;
    const cleaned = value.trim().toUpperCase().replace(/\s+/g, '');
    if (
      cleaned === 'BOTH' ||
      cleaned === 'WEDNESDAY,THURSDAY' ||
      cleaned === 'THURSDAY,WEDNESDAY' ||
      cleaned === 'WEDNESDAY/THURSDAY' ||
      cleaned === 'THURSDAY/WEDNESDAY' ||
      cleaned === 'WEDNESDAY&THURSDAY' ||
      cleaned === 'THURSDAY&WEDNESDAY' ||
      cleaned === 'WEDTHU' ||
      cleaned === 'THUWED'
    ) {
      return 'BOTH';
    }
    if (cleaned === 'WEDNESDAY' || cleaned === 'WED') return 'WEDNESDAY';
    if (cleaned === 'THURSDAY' || cleaned === 'THU' || cleaned === 'THURS') return 'THURSDAY';
    return null;
  };

  const mergeMeetingDay = (existingDay: MeetingDay | null, incomingDay: MeetingDay | null): MeetingDay | null => {
    if (!incomingDay) return existingDay;
    if (!existingDay) return incomingDay;
    if (existingDay === 'BOTH' || incomingDay === 'BOTH') return 'BOTH';
    if (existingDay === incomingDay) return existingDay;
    return 'BOTH';
  };
  
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
      
      const existingProject = await event.context.client.project.findFirst({
        where: { name: project.name }
      });
      const incomingMeetingDay = normalizeMeetingDay(project.meetingDay ?? project.day)

      const createdProject = existingProject
        ? await event.context.client.project.update({
            where: { id: existingProject.id },
            data: {
              description: project.description,
              type: project.type || 'SOFTWARE',
              status: project.status || 'NEW',
              meetingDay: mergeMeetingDay((existingProject.meetingDay as MeetingDay | null) ?? null, incomingMeetingDay),
              repoURL: project.repoURL,
              partnerId: partnerId
            },
            include: {
              partner: true
            }
          })
        : await event.context.client.project.create({
            data: {
              name: project.name,
              description: project.description,
              type: project.type || 'SOFTWARE',
              status: project.status || 'NEW',
              meetingDay: incomingMeetingDay,
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
  const { name, description, partnerId, meetingDay } = body;
  const postProject = await event.context.client.project.create({
    data: {
      name,
      description,
      meetingDay: normalizeMeetingDay(meetingDay),
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