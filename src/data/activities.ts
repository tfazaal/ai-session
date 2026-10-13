import type { SiteActivity } from '../types/activity.ts'

export const activities: readonly SiteActivity[] = [
  {
    id: 'activity-001',
    siteId: 'NO-0208',
    type: 'environmental',
    description: 'Simulated environmental measurement recorded for the morning review.',
    timestamp: '2026-10-13T07:00:00Z',
  },
  {
    id: 'activity-002',
    siteId: 'NO-0142',
    type: 'inspection',
    description: 'Routine site inspection completed with no new actions.',
    timestamp: '2026-10-13T06:42:00Z',
  },
  {
    id: 'activity-003',
    siteId: 'CL-0091',
    type: 'status',
    description: 'Operational status updated to needs attention.',
    timestamp: '2026-10-13T04:25:00Z',
  },
  {
    id: 'activity-004',
    siteId: 'AU-0144',
    type: 'maintenance',
    description: 'Anchor-line replacement work scheduled for the next crew rotation.',
    timestamp: '2026-10-12T23:15:00Z',
  },
  {
    id: 'activity-005',
    siteId: 'CA-0220',
    type: 'environmental',
    description: 'Simulated temperature and oxygen sample added to the prototype record.',
    timestamp: '2026-10-12T22:15:00Z',
  },
  {
    id: 'activity-006',
    siteId: 'SC-0176',
    type: 'maintenance',
    description: 'Net-change progress recorded; feed system remains offline.',
    timestamp: '2026-10-12T14:45:00Z',
  },
  {
    id: 'activity-007',
    siteId: 'IS-0071',
    type: 'status',
    description: 'Remote camera outage escalated for operational review.',
    timestamp: '2026-10-12T08:30:00Z',
  },
]
