export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  semester: string;
  repo: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  netID: string;
  isAssigned: boolean;
}