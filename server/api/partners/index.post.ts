export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const uploadedPartners = Array.isArray(body)
    ? body
    : Array.isArray(body?.partners)
      ? body.partners
      : null;

  const normalizeProjectName = (value: string) => (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
  );

  const parseProjectNames = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item ?? '').trim())
        .filter(Boolean);
    }

    const raw = String(value ?? '').trim();
    if (!raw || raw.toLowerCase() === 'none') return [];

    return raw
      .split(/[,;|]/)
      .map((part) => part.trim())
      .filter(Boolean);
  };
  
  // Handle array of partners (bulk upload)
  if (uploadedPartners) {
    const allProjects = await event.context.client.project.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const projectsByNormalizedName = new Map<string, Array<{ id: string; name: string }>>();
    for (const project of allProjects) {
      const normalizedName = normalizeProjectName(project.name);
      const existing = projectsByNormalizedName.get(normalizedName) ?? [];
      existing.push(project);
      projectsByNormalizedName.set(normalizedName, existing);
    }

    const createdPartners = [];

    for (const partner of uploadedPartners) {
      const partnerName = String(partner?.name ?? '').trim();
      if (!partnerName) continue;

      const existingPartner = await event.context.client.partner.findFirst({
        where: { name: partnerName }
      });

      const savedPartner = existingPartner
        ? await event.context.client.partner.update({
            where: { id: existingPartner.id },
            data: {
              contactName: partner.contactName,
              contactEmail: partner.contactEmail
            }
          })
        : await event.context.client.partner.create({
            data: {
              name: partnerName,
              contactName: partner.contactName,
              contactEmail: partner.contactEmail
            }
          });

      const projectNames = parseProjectNames(partner.projectName ?? partner.projects);
      for (const projectName of projectNames) {
        const normalized = normalizeProjectName(projectName);
        if (!normalized) continue;

        const matches = projectsByNormalizedName.get(normalized) ?? [];
        if (matches.length !== 1) continue;

        await event.context.client.project.update({
          where: { id: matches[0].id },
          data: { partnerId: savedPartner.id },
        });
      }

      createdPartners.push(savedPartner);
    }

    return createdPartners;
  }

  // Handle single partner (original behavior)
  const { name, contactName, contactEmail, projectIds } = body;

  const newPartner = await event.context.client.partner.create({
    data: {
      name,
      contactName,
      contactEmail,
      projects: projectIds
        ? {
            connect: projectIds.map((id: string) => ({ id })),
          }
        : undefined,
    },
    include: {
      projects: true,
    },
  });

  return {
    ...newPartner,
    projectName: newPartner.projects.map(p => p.name).join(', ') || 'None',
  };
});

