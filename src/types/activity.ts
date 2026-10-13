export const ACTIVITY_TYPES = [
  'inspection',
  'maintenance',
  'status',
  'environmental',
] as const

export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export type SiteActivity = {
  id: string
  siteId: string
  type: ActivityType
  description: string
  timestamp: string
}
