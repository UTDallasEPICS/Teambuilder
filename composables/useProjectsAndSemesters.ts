import type { Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';

const semesters = ref<Semester[]>([]);
const projects = ref<ProjectWithSemesters[]>([]);
const loaded = ref(false);

export const useProjectsAndSemesters = () => {
  if (!loaded.value) {
    onMounted(async () => {
      semesters.value = await $fetch<Semester[]>('/api/semesters');
      projects.value = await $fetch<ProjectWithSemesters[]>('/api/projects');
      loaded.value = true;
    });
  }

  return {
    semesters,
    projects,
  };
}
