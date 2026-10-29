export const pageTitles = {
  dashboard: 'Dashboard',
  arcanists: 'Arcanists',
  'status-effects': 'Status Effects',
  database: 'Database'
} as const

export type Page = keyof typeof pageTitles

export function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1)

  return hash in pageTitles ? (hash as Page) : 'dashboard'
}
