export const SITE_STATUSES = ['operational', 'attention', 'maintenance'] as const

export type SiteStatus = (typeof SITE_STATUSES)[number]

export type StatusFilter = 'all' | SiteStatus

export type FarmSite = {
  id: string
  name: string
  location: string
  cages: number
  status: SiteStatus
  updatedOn: string
  description?: string
}
