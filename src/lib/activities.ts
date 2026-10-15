import type { SiteActivity } from '../types/activity.ts'

export function getRecentActivities(
  activities: readonly SiteActivity[],
  limit = 5,
): SiteActivity[] {
  return [...activities]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
}
