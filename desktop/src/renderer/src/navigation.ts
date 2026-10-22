export const pageTitles = {
  dashboard: 'Dashboard',
  arcanists: 'Arcanists',
  'status-effects': 'Status Effects'
} as const

export type Page = keyof typeof pageTitles

export function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1)

  return Object.prototype.hasOwnProperty.call(pageTitles, hash) ? (hash as Page) : 'dashboard'
}
