import { defineStore } from 'pinia'
import { createRandomStudents } from '../server/factories/student'
import { Student } from '../types';

export const useStudentStore = defineStore('studentStore', {
  state: () => ({
    students: [] as Student[],
    hasDummyData: false
  }),
  actions: {
    addStudent(student: Student) {
      this.students.push(student)
    },
    setStudents(students: Student[]) {
      this.students = students;
    },
    archiveStudent(id: string) {
      const student = this.getStudentById(id);
      if (student) {
        student.status = 'archived';
      } else {
        console.error('Could not find student')
      }
    },
    restoreStudent(id: string) {
      const student = this.getStudentById(id);
      if (student) {
        student.status = 'returning';
      } else {
        console.error('Could not find student')
      }
    },
    createDummyData() {
      if (!this.hasDummyData) {
        this.setStudents(createRandomStudents(150))
        this.hasDummyData = true;
      }
    }
  },
  getters: {
    getAllStudents: (state) => {
      return state.students;
    },
    getActiveStudents: (state) => {
      return state.students.filter(student => student.status !== 'archived');
    },
    getArchivedStudents: (state) => {
      return state.students.filter(student => student.status === 'archived');
    },
    getStudentById: (state) => (id: string) => {
      return state.students.find(student => student.id === id);
    },
  }
})
