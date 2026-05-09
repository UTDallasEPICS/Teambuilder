import { sortSemesters } from '~/server/services/semesterService';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const uploadedProjects = Array.isArray(body)
    ? body
    : Array.isArray(body?.projects)
      ? body.projects
      : null;
  const selectedSemesterId = Array.isArray(body) ? null : (body?.semesterId ?? null);
  type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH'
  type ProjectStatus = 'NEW' | 'RETURNING' | 'COMPLETE' | 'WITHDRAWN' | 'HOLD'

  const allSemesters = sortSemesters(await event.context.client.semester.findMany());
  const latestSemesterId = allSemesters[0]?.id ?? null;

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

  const normalizeProjectStatus = (value: unknown): ProjectStatus => {
    const cleaned = typeof value === 'string' ? value.trim().toUpperCase() : 'NEW';
    if (cleaned === 'RETURNING') return 'RETURNING';
    if (cleaned === 'COMPLETE') return 'COMPLETE';
    if (cleaned === 'WITHDRAWN') return 'WITHDRAWN';
    if (cleaned === 'HOLD') return 'HOLD';
    return 'NEW';
  };

  const upsertTeamsForSemester = async (projectId: string, semesterId: string, meetingDay: MeetingDay | null) => {
    const days: Array<'WEDNESDAY' | 'THURSDAY'> =
      meetingDay === 'BOTH'
        ? ['WEDNESDAY', 'THURSDAY']
        : meetingDay === 'WEDNESDAY' || meetingDay === 'THURSDAY'
          ? [meetingDay]
          : ['THURSDAY'];

    await event.context.client.team.createMany({
      data: days.map((day) => ({
        projectId,
        semesterId,
        meetingDay: day,
      })),
      skipDuplicates: true,
    });
  };

  const isProjectInLatestSemester = async (projectId: string): Promise<boolean> => {
    if (!latestSemesterId) return false;

    const existing = await event.context.client.team.findFirst({
      where: {
        projectId,
        semesterId: latestSemesterId,
      },
      select: { id: true },
    });

    return !!existing;
  };

  const deriveProjectStatus = async (projectId: string | null, incomingStatus: unknown): Promise<ProjectStatus> => {
    const normalizedStatus = normalizeProjectStatus(incomingStatus);

    if (!selectedSemesterId || !latestSemesterId || selectedSemesterId === latestSemesterId) {
      return normalizedStatus;
    }

    if (!projectId) {
      return 'COMPLETE';
    }

    const isInLatest = await isProjectInLatestSemester(projectId);
    return isInLatest ? normalizedStatus : 'COMPLETE';
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
  if (uploadedProjects) {
    const createdProjects = [];
    
    for (const project of uploadedProjects) {
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
      const resolvedStatus = await deriveProjectStatus(existingProject?.id ?? null, project.status || 'NEW');

      const createdProject = existingProject
        ? await event.context.client.project.update({
            where: { id: existingProject.id },
            data: {
              description: project.description,
              type: project.type || 'SOFTWARE',
              status: resolvedStatus,
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
              status: resolvedStatus,
              meetingDay: incomingMeetingDay,
              repoURL: project.repoURL,
              partnerId: partnerId
            },
            include: {
              partner: true
            }
          });

      if (selectedSemesterId) {
        await upsertTeamsForSemester(
          createdProject.id,
          selectedSemesterId,
          (createdProject.meetingDay as MeetingDay | null) ?? null,
        );
      }
      
      createdProjects.push(createdProject);
    }
    
    return createdProjects;
  }
  
  // Handle single project (original behavior)
  const { name, description, partnerId, meetingDay, status } = body;
  const existingProject = await findExistingProject(name, partnerId ?? null);
  const resolvedStatus = await deriveProjectStatus(existingProject?.id ?? null, status);

  if (existingProject) {
    const updatedProject = await event.context.client.project.update({
      where: { id: existingProject.id },
      data: {
        description,
        status: resolvedStatus,
        meetingDay: mergeMeetingDay((existingProject.meetingDay as MeetingDay | null) ?? null, normalizeMeetingDay(meetingDay)),
        ...(partnerId ? { partnerId } : {}),
      },
      include: {
        partner: true
      }
    });

    if (selectedSemesterId) {
      await upsertTeamsForSemester(
        updatedProject.id,
        selectedSemesterId,
        (updatedProject.meetingDay as MeetingDay | null) ?? null,
      );
    }

    return updatedProject;
  }

  const createdProject = await event.context.client.project.create({
    data: {
      name,
      description,
      status: resolvedStatus,
      meetingDay: normalizeMeetingDay(meetingDay),
      Partner: {
        connect: { id: partnerId }
      }
    },
    include: {
      partner: true
    }
  });

  if (selectedSemesterId) {
    await upsertTeamsForSemester(
      createdProject.id,
      selectedSemesterId,
      (createdProject.meetingDay as MeetingDay | null) ?? null,
    );
  }

  return createdProject;
});