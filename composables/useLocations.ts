// For the top-bar location/section links.
// Add or reorder entries here and the dropdown in TopBar.vue updates automatically.

export interface AppLocation {
  label: string
  path: string
}

export function useLocations() {
  const locations: AppLocation[] = [
    { label: 'Database', path: '/database' },
    { label: 'Formation', path: '/formation' },
    { label: 'Automation', path: '/automation' },
  ]

  return { locations }
}