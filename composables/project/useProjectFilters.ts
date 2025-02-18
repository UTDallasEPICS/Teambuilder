import { computed, ComputedRef, reactive, ref, watch } from "vue";
import { Project } from "../../types";

export const useProjectFilters = (projects: ComputedRef<Project[]>) => {
  const searchQuery = ref('');
  const filterByNew = ref(false);
  const filterByReturning = ref(false);

  const semesters = computed(() => {
    const allSemesterEntries = projects.value.map((project) => project.semester);
    return [...new Set(allSemesterEntries)];
  });

  const semesterFilters = reactive(
    Object.fromEntries(semesters.value.map(key => [key, false]))
  )
  
  watch(semesters, (newSemesters) => {
    for (const key in semesterFilters) {
      if (!newSemesters.includes(key)) {
        delete semesterFilters[key];
      }
    }
  });
  
  const filteredProjects = computed(() => {
    return projects.value.filter((project) => (
      filterByName(project) && filterByStatus(project) && filterBySemester(project)
    ))
  })
  
  const filterByName = (project: Project) => {
    return project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  }
  
  const filterByStatus = (project: Project) => {
    return (filterByNew.value && project.status === 'new')
      || (filterByReturning.value && project.status === 'returning')
      || (!filterByNew.value && !filterByReturning.value) // no filter is selected
  }

  const filterBySemester = (project: Project) => {
    return Object.values(semesterFilters).every(value => !value)
      || semesterFilters[project.semester];
  }
  
  const toggleFilterByNew = () => {
    filterByNew.value = !filterByNew.value
  }
  
  const toggleFilterByReturning = () => {
    filterByReturning.value = !filterByReturning.value
  }

  const toggleSemesterFilter = (semester: string) => {
    semesterFilters[semester] = !semesterFilters[semester];
  }

  const filteredProjectCount = computed(() => filteredProjects.value.length);

  return {
    searchQuery,
    filterByNew,
    filterByReturning,
    semesterFilters,
    filteredProjects,
    filteredProjectCount,
    toggleSemesterFilter,
    toggleFilterByNew,
    toggleFilterByReturning,
  };
}