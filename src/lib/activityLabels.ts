import type { ActivityType } from '../types/activity.ts'

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  inspection: 'Inspection',
  maintenance: 'Maintenance',
  status: 'Status update',
  environmental: 'Environmental (simulated)',
}
