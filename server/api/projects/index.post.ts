export default defineEventHandler(async event => {
  const body = await readBody(event);
  type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH'

  const normalizeProjectName = (value: unknown): string => {
    if (typeof value !== 'string') return '';

    const cleaned = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');

    return cleaned;
  };

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

  const findExistingProject = async (projectName: unknown, partnerId?: string | null) => {
    if (typeof projectName !== 'string' || !projectName.trim()) return null;

    const exactMatch = await event.context.client.project.findFirst({
      where: {
        name: projectName.trim(),
        ...(partnerId ? { partnerId } : {}),
      },
    });
    if (exactMatch) return exactMatch;

    const normalizedName = normalizeProjectName(projectName);
    if (!normalizedName) return null;

    const allProjects = await event.context.client.project.findMany({
      select: { id: true, name: true, meetingDay: true, partnerId: true },
    });

    const normalizedMatches = allProjects.filter(
      (project) =>
        normalizeProjectName(project.name) === normalizedName &&
        (!partnerId || project.partnerId === partnerId)
    );

    if (normalizedMatches.length === 1) return normalizedMatches[0];
    return null;
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
      
      const existingProject = await findExistingProject(project.name, partnerId);
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
  const existingProject = await findExistingProject(name, partnerId ?? null);

  if (existingProject) {
    return event.context.client.project.update({
      where: { id: existingProject.id },
      data: {
        description,
        meetingDay: mergeMeetingDay((existingProject.meetingDay as MeetingDay | null) ?? null, normalizeMeetingDay(meetingDay)),
        ...(partnerId ? { partnerId } : {}),
      },
      include: {
        partner: true
      }
    });
  }

  return event.context.client.project.create({
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
});