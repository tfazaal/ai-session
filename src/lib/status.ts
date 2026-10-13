import type { SiteStatus, StatusFilter } from '../types/site.ts'

export const STATUS_LABELS: Record<SiteStatus, string> = {
  operational: 'Operational',
  attention: 'Needs attention',
  maintenance: 'Maintenance',
}

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'operational', label: STATUS_LABELS.operational },
  { value: 'attention', label: STATUS_LABELS.attention },
  { value: 'maintenance', label: STATUS_LABELS.maintenance },
]
