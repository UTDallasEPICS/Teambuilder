export interface Project {
  id: string;
  name: string;
  description: string;
  targetCS: number;
  status: Status;                          // not in schema
  semester: string;                        // not in schema
  repoURL: string;                         
  type: 'software' | 'hardware' | 'both';
}

export interface Student {
  id: string;
  netID: string;
  firstName: string;
  lastName: string;
  email: string;
  gitUserName: string;
  discordUser: string;
  major: 'CE' | 'CS' | 'DS' | 'SE' | 'ME' | 'BME' | 'EE' | 'SYS' | 'Other';
  seniority: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  class: '2200' | '3200';
  enrollment: string;    // not sure what this is
  status: Status;        // not in schema
}

export type Status = 'new' | 'returning' | 'archived';