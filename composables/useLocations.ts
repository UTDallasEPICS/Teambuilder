// composables/useLocations.ts
//
// Each top-level location has its own dropdown of subpages
// Add/reorder/rename entries here and update automatically

export interface AppSubLocation {
  label: string
  path: string
}

export interface AppLocation {
  label: string
  path: string
  children: AppSubLocation[]
}

export function useLocations() {
  const locations: AppLocation[] = [
    {
      label: 'Database',
      path: '/database',
      children: [
        { label: 'Projects', path: '/database/projects' },
        { label: 'Partners', path: '/database/partners' },
        { label: 'Students', path: '/database/students' },
        { label: 'Demographics', path: '/database/demographics' },
      ],
    },
    {
      label: 'Formation',
      path: '/formation',
      children: [
        { label: 'Form Teams', path: '/formation/form-teams' },
        { label: 'Team Organization', path: '/formation/team-organization' },
      ],
    },
    {
      label: 'Automation',
      path: '/automation',
      children: [
        { label: 'Discord Bot', path: '/automation/discord-bot' },
        { label: 'GitHub Bot', path: '/automation/github-bot' },
      ],
    },
  ]

  return { locations }
}