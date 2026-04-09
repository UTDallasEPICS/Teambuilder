import { defineEventHandler } from 'h3';
import Papa from 'papaparse';
import type { StudentWithChoices } from '../students/index.get';

export interface ExportTeamsRequest {
  teamAssignments: Record<string, StudentWithChoices[]>;
  projects: Array<{ id: string; name: string }>;
  teamMeta?: Record<string, { projectId: string; meetingDay: string; projectName: string }>;
  semesterName?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ExportTeamsRequest>(event);

  if (!body.teamAssignments || !body.projects) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing teamAssignments or projects'
    });
  }

  // Transform into CSV rows
  const csvRows: Array<{ Project: string; 'Team Size': number; Members: string }> = [];

  for (const [teamKey, students] of Object.entries(body.teamAssignments)) {
    const meta = body.teamMeta?.[teamKey];
    const project = body.projects.find(p => p.id === (meta?.projectId ?? teamKey));
    const projectName = meta
      ? `${meta.projectName} (${meta.meetingDay === 'WEDNESDAY' ? 'Wednesday' : 'Thursday'})`
      : (project?.name || teamKey);
    
    const memberNames = (students as StudentWithChoices[])
      .map(s => `${s.firstName} ${s.lastName}`)
      .join('; ');

    csvRows.push({
      Project: projectName,
      'Team Size': students.length,
      Members: memberNames
    });
  }

  // Use PapaParse to generate CSV
  const csv = Papa.unparse(csvRows);

  // Set response headers
  setHeader(event, 'Content-Type', 'text/csv;charset=UTF-8');
  setHeader(event, 'Content-Disposition', 'attachment; filename="team-assignments.csv"');

  return csv;
});
