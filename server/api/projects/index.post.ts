import { createSemesters } from '~/server/factories/semester';
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
  const getProjectField = (project: Record<string, any>, ...keys: string[]) => {
    for (const key of keys) {
      const value = project[key];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) return trimmed;
      } else if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }

    return null;
  };

  const ensureImportSemesters = async () => {
    let semesters = sortSemesters(await event.context.client.semester.findMany());

    if (semesters.length === 0) {
      await event.context.client.semester.createMany({
        data: createSemesters(),
      });
      semesters = sortSemesters(await event.context.client.semester.findMany());
    }

    return semesters;
  };

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
    const cleaned = typeof value === 'string' ? value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
    // Accept common spreadsheet variants: "IN PROGRESS", "IN_PROGRESS", "IN-PROGRESS" => RETURNING
    if (cleaned === 'RETURNING' || cleaned === 'INPROGRESS' || cleaned === 'INPROG' || cleaned === 'INPROGRESS') return 'RETURNING';
    if (cleaned === 'COMPLETE' || cleaned === 'COMPLETED') return 'COMPLETE';
    if (cleaned === 'WITHDRAWN') return 'WITHDRAWN';
    if (cleaned === 'HOLD') return 'HOLD';
    if (cleaned === 'NEW') return 'NEW';
    // Default to NEW when unknown or empty
    return 'NEW';
  };

  const upsertTeamsForSemester = async (projectId: string, semesterId: string, meetingDay: MeetingDay | null) => {
    const days: Array<'WEDNESDAY' | 'THURSDAY'> =
      meetingDay === 'BOTH'
        ? ['WEDNESDAY', 'THURSDAY']
        : meetingDay === 'WEDNESDAY' || meetingDay === 'THURSDAY'
          ? [meetingDay]
          : ['THURSDAY'];

    // Some Prisma/client combos don't accept `skipDuplicates` — create per-day
    // and ignore unique-constraint errors to emulate skipDuplicates behavior.
    for (const day of days) {
      try {
        await event.context.client.team.create({
          data: { projectId, semesterId, meetingDay: day },
        });
      } catch (err: any) {
        // Ignore unique-constraint errors (P2002) and continue
        const code = err?.code ?? err?.name ?? '';
        const message = String(err?.message ?? err);
        if (code === 'P2002' || message.includes('Unique constraint') || message.includes('already exists')) {
          continue;
        }
        throw err;
      }
    }
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

  let effectiveLatestSemesterId: string | null = latestSemesterId;
  let effectiveSemesterId: string | null = selectedSemesterId;

  const deriveProjectStatus = async (projectId: string | null, incomingStatus: unknown): Promise<ProjectStatus> => {
    const normalizedStatus = normalizeProjectStatus(incomingStatus);

    if (!effectiveSemesterId || !effectiveLatestSemesterId || effectiveSemesterId === effectiveLatestSemesterId) {
      return normalizedStatus;
    }

    if (!projectId) {
      // For new uploads into a non-latest semester, do not force COMPLETE.
      // Honor incoming status (or default to NEW) instead.
      return normalizedStatus;
    }

    const isInLatest = await isProjectInLatestSemester(projectId);
    return isInLatest ? normalizedStatus : 'COMPLETE';
  };

  const importSemesters = await ensureImportSemesters();
  effectiveLatestSemesterId = importSemesters[0]?.id ?? latestSemesterId;
  effectiveSemesterId = selectedSemesterId && importSemesters.some((semester) => semester.id === selectedSemesterId)
    ? selectedSemesterId
    : effectiveLatestSemesterId;

  const mergeMeetingDay = (existingDay: MeetingDay | null, incomingDay: MeetingDay | null): MeetingDay | null => {
    if (!incomingDay) return existingDay;
    if (!existingDay) return incomingDay;
    if (existingDay === 'BOTH' || incomingDay === 'BOTH') return 'BOTH';
    if (existingDay === incomingDay) return existingDay;
    return 'BOTH';
  };

  const findExistingProject = async (projectName: unknown, partnerId?: string | null) => {
    if (typeof projectName !== 'string' || !projectName.trim()) return null;
    const raw = projectName.trim();

    // 1) Exact match (fast path)
    const exactMatch = await event.context.client.project.findFirst({
      where: {
        name: raw,
        ...(partnerId ? { partnerId } : {}),
      },
    });
    if (exactMatch) return exactMatch;

    // 2) Normalize and strip common semester prefixes (e.g., "S26 - ")
    const stripSemesterPrefix = (s: string) => s.replace(/^[SF]\d{2,4}(\s+\S+)?\s*-\s*/, '').trim();
    const candidateNormalized = normalizeProjectName(stripSemesterPrefix(raw));
    if (!candidateNormalized) return null;

    // 3) Fetch all projects and attempt to find a best fuzzy match
    const allProjects = await event.context.client.project.findMany({
      select: { id: true, name: true, meetingDay: true, partnerId: true },
    });

    // Exact-normalized matches
    const exactNormalized = allProjects.filter((project) => {
      const pn = normalizeProjectName(stripSemesterPrefix(project.name));
      return pn === candidateNormalized && (!partnerId || project.partnerId === partnerId);
    });
    if (exactNormalized.length === 1) return exactNormalized[0];

    // Fuzzy includes (project contains candidate or vice-versa)
    for (const project of allProjects) {
      const pn = normalizeProjectName(stripSemesterPrefix(project.name));
      if (!pn) continue;
      if ((!partnerId || project.partnerId === partnerId) && (pn.includes(candidateNormalized) || candidateNormalized.includes(pn))) {
        return project;
      }
    }

    return null;
  };
  
  // Handle array of projects (bulk upload)
  if (uploadedProjects) {
    const results = {
      successful: [] as any[],
      failed: [] as Array<{ name: string; error: string; row: any }>,
    };

    const derivePartnerDetails = (project: Record<string, any>) => ({
      name: getProjectField(
        project,
        'partnerName',
        'partnername',
        'nonProfitPartner',
        'nonprofitPartner'
      ) || 'Default Partner',
        contactName: getProjectField(
        project,
        'partnerContactName',
        'partnercontactname',
        'projectPartner',
        'projectpartner'
      ) || 'N/A',
        contactEmail: getProjectField(
        project,
        'partnerContactEmail',
        'partnercontactemail',
        'partnerContactEmail',
        'projectPartnerEmail'
      ) || 'default@example.com',
    });
    
    for (const project of uploadedProjects) {
      try {
        // Validate required fields
        if (!project.name || typeof project.name !== 'string' || !project.name.trim()) {
          results.failed.push({
            name: project.name || 'Unknown',
            error: 'Project name is required',
            row: project,
          });
          continue;
        }

        let partnerId = null;
        const partnerDetails = derivePartnerDetails(project);
        if (partnerDetails.name) {
          const partner = await event.context.client.partner.findFirst({
            where: { name: partnerDetails.name }
          });
          if (partner) {
            partnerId = partner.id;
            if (partnerDetails.contactName !== 'N/A' || partnerDetails.contactEmail !== 'default@example.com') {
              await event.context.client.partner.update({
                where: { id: partner.id },
                data: {
                  contactName: partnerDetails.contactName,
                  contactEmail: partnerDetails.contactEmail,
                },
              });
            }
            console.log(`Found partner "${partnerDetails.name}" with ID ${partnerId} for project "${project.name}"`);
          } else {
            const createdPartner = await event.context.client.partner.create({
              data: {
                name: partnerDetails.name,
                contactName: partnerDetails.contactName,
                contactEmail: partnerDetails.contactEmail,
              },
            });
            partnerId = createdPartner.id;
            console.log(`Created partner "${partnerDetails.name}" with ID ${partnerId} for project "${project.name}"`);
          }
        }
        
        // If no partner name was supplied, create/use the shared placeholder partner.
        if (!partnerId) {
          console.log(`Using default partner for project "${project.name}"`);
          let defaultPartner = await event.context.client.partner.findFirst({
            where: { name: 'Default Partner' }
          });
          
          if (!defaultPartner) {
            defaultPartner = await event.context.client.partner.create({
              data: {
                name: 'Default Partner',
                contactName: partnerDetails.contactName,
                contactEmail: partnerDetails.contactEmail
              }
            });
          } else if (partnerDetails.contactName !== 'N/A' || partnerDetails.contactEmail !== 'default@example.com') {
            defaultPartner = await event.context.client.partner.update({
              where: { id: defaultPartner.id },
              data: {
                contactName: partnerDetails.contactName,
                contactEmail: partnerDetails.contactEmail,
              },
            });
          }
          partnerId = defaultPartner.id;
        }
        
        const existingProject = await findExistingProject(project.name, partnerId);
        const incomingMeetingDay = normalizeMeetingDay(project.meetingDay ?? project.day)
        const resolvedStatus = await deriveProjectStatus(existingProject?.id ?? null, project.status || 'NEW');
        const descriptionParts = [
          project.description,
          (project.projectNumber ?? project.projectnumber) ? `Project # ${project.projectNumber ?? project.projectnumber}` : '',
          (project.partnerContactName ?? project.partnercontactname) ? `Project Partner: ${project.partnerContactName ?? project.partnercontactname}` : '',
          (project.partnerContactEmail ?? project.partnercontactemail) ? `Project Partner Email: ${project.partnerContactEmail ?? project.partnercontactemail}` : '',
          (project.partnerContactName2 ?? project.partnercontactname2) ? `Project Partner 2: ${project.partnerContactName2 ?? project.partnercontactname2}` : '',
          (project.partnerContactEmail2 ?? project.partnercontactemail2) ? `Project Partner Email 2: ${project.partnerContactEmail2 ?? project.partnercontactemail2}` : '',
          (project.partnerPhone ?? project.partnerphone) ? `Project Partner Phone: ${project.partnerPhone ?? project.partnerphone}` : '',
          (project.partnerAddress ?? project.partneraddress) ? `Project Partner Address: ${project.partnerAddress ?? project.partneraddress}` : '',
          (project.mentorName ?? project.mentorname) ? `Mentor: ${project.mentorName ?? project.mentorname}` : '',
          (project.mentorEmail ?? project.mentoremail) ? `Mentor Email: ${project.mentorEmail ?? project.mentoremail}` : '',
        ].filter(Boolean);
        const description = descriptionParts.join(' | ');

        const createdProject = existingProject
          ? await event.context.client.project.update({
              where: { id: existingProject.id },
              data: {
                description,
                type: project.type || 'SOFTWARE',
                status: resolvedStatus,
                meetingDay: mergeMeetingDay((existingProject.meetingDay as MeetingDay | null) ?? null, incomingMeetingDay),
                repoURL: project.repoURL || '',
                partnerId: partnerId
              },
              include: {
                partner: true
              }
            })
          : await event.context.client.project.create({
              data: {
                name: project.name.trim(),
                description,
                type: project.type || 'SOFTWARE',
                status: resolvedStatus,
                meetingDay: incomingMeetingDay,
                repoURL: project.repoURL || '',
                partnerId: partnerId
              },
              include: {
                partner: true
              }
            });

        if (effectiveSemesterId) {
          await upsertTeamsForSemester(
            createdProject.id,
            effectiveSemesterId,
            (createdProject.meetingDay as MeetingDay | null) ?? null,
          );
        }
        
        results.successful.push(createdProject);
        console.log(`✓ Successfully processed project: "${project.name}"`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error processing project "${project.name}":`, error);
        results.failed.push({
          name: project.name || 'Unknown',
          error: errorMessage,
          row: project,
        });
      }
    }
    
    return results;
  }
  
  // Handle single project (original behavior)
  const { name, description, partnerId, meetingDay, status } = body;
  const existingProject = await findExistingProject(name, partnerId ?? null);
  const resolvedStatus = await deriveProjectStatus(existingProject?.id ?? null, status);
  const resolvedPartnerId = partnerId || (await event.context.client.partner.findFirst({
    where: { name: 'Default Partner' }
  }))?.id || (await event.context.client.partner.create({
    data: {
      name: 'Default Partner',
      contactName: 'N/A',
      contactEmail: 'default@example.com',
    },
  })).id;

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

    if (effectiveSemesterId) {
      await upsertTeamsForSemester(
        updatedProject.id,
        effectiveSemesterId,
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
      partner: {
        connect: { id: resolvedPartnerId }
      }
    },
    include: {
      partner: true
    }
  });

  if (effectiveSemesterId) {
    await upsertTeamsForSemester(
      createdProject.id,
      effectiveSemesterId,
      (createdProject.meetingDay as MeetingDay | null) ?? null,
    );
  }

  return createdProject;
});