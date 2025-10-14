/*
import { defineStore } from 'pinia'
import { Project } from '../types'
import { createRandomProjects } from '../server/factories/project'

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    projects: [] as Project[],
    hasDummyData: false
  }),
  actions: {
    addProject(project: Project) {
      this.projects.push(project)
    },
    setProjects(projects: Project[]) {
      this.projects = projects
    },
    archiveProject(id: string) {
      const project = this.getProjectById(id);
      if (project) {
        project.status = 'archived';
      } else {
        console.error('Could not find project')
      }
    },
    restoreProject(id: string) {
      const project = this.getProjectById(id);
      if (project) {
        project.status = 'returning';
      } else {
        console.error('Could not find project')
      }
    },
    createDummyData() {
      if (!this.hasDummyData) {
        this.setProjects(createRandomProjects(40))
        this.hasDummyData = true;
      }
    }
  },
  getters: {
    getActiveProjects: (state) => {
      return state.projects.filter(project => project.status !== 'archived');
    },
    getArchivedProjects: (state) => {
      return state.projects.filter(project => project.status === 'archived');
    },
    getProjectById: (state) => (id: string) => {
      return state.projects.find(project => project.id === id);
    },
  }
})
*/