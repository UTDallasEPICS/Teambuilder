import { computed, ComputedRef, reactive, ref, watch } from "vue";
import { Student } from "../../types";

export const useStudentFilters = (students: ComputedRef<Student[]>) => {
  const searchQuery = ref('');
  const filterByNew = ref(false);
  const filterByReturning = ref(false);
  
  const filteredStudents = computed(() => {
    return students.value.filter((student) => (
      filterByName(student) && filterByStatus(student)
    ))
  })
  
  const filterByName = (student: Student) => {
    return fullName(student).toLowerCase().includes(searchQuery.value.toLowerCase())
  }
  
  const filterByStatus = (student: Student) => {
    return (filterByNew.value && student.status === 'new')
      || (filterByReturning.value && student.status === 'returning')
      || (!filterByNew.value && !filterByReturning.value) // no filter is selected
  }
  
  const toggleFilterByNew = () => {
    filterByNew.value = !filterByNew.value
  }
  
  const toggleFilterByReturning = () => {
    filterByReturning.value = !filterByReturning.value
  }

  const filteredStudentCount = computed(() => filteredStudents.value.length);

  const fullName = (student: Student) => {
    return student.firstName + ' ' + student.lastName;
  }

  return {
    searchQuery,
    filterByNew,
    filterByReturning,
    filteredStudents,
    filteredStudentCount,
    toggleFilterByNew,
    toggleFilterByReturning,
  };
}