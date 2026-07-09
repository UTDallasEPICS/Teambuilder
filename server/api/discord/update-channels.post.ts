/**
 * API endpoint to update Discord with channels for all projects
 * POST /api/discord/update-channels
 */
import createProjectDiscord from '~/server/integrations/discordBot/src/teambuilderFunc/createProjectDiscord';
import projectService from '~/server/services/projectService';

export default defineEventHandler(async () => {
  try {
    const projects = await projectService.getAllProjects();
    let created = 0;
    let errors: string[] = [];
    for (const project of projects) {
      try {
        await createProjectDiscord(project);
        created++;
      } catch (err: any) {
        errors.push(`${project.name}: ${err?.message || err}`);
      }
    }
    return {
      success: errors.length === 0,
      created,
      total: projects.length,
      errors,
      message: errors.length === 0
        ? `Successfully updated Discord with ${created} project channels.`
        : `Some errors occurred. ${created} succeeded, ${errors.length} failed.`
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error?.message || 'Failed to update Discord channels',
    });
  }
});
