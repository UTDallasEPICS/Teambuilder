/*import { defineStore } from 'pinia'
import { createRandomStudents } from '../server/factories/student'
import type { Student } from '@prisma/client';

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
        student.status = 'ARCHIVED';
      } else {
        console.error('Could not find student')
      }
    },
    restoreStudent(id: string) {
      const student = this.getStudentById(id);
      if (student) {
        student.status = 'RETURNING';
      } else {
        console.error('Could not find student')
      }
    },
   /* parseFileData(){
      this.hasDummyData = false;
    }*/
    createDummyData() { //replace this with a parsing method instead
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
      return state.students.filter(student => student.status !== 'ARCHIVED');
    },
    getArchivedStudents: (state) => {
      return state.students.filter(student => student.status === 'ARCHIVED');
    },
    getStudentById: (state) => (id: string) => {
      return state.students.find(student => student.id === id);
    },
  }
})
