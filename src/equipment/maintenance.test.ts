import { describe, expect, it } from 'vitest'
import {
  countRequiringMaintenance,
  countUnderMaintenance,
  filterEquipment,
  isMaintenanceOverdue,
  matchesStatusFilter,
} from './maintenance.ts'
import type { Equipment } from './types.ts'

const items: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Blower',
    assetId: 'A-1',
    farmSite: 'North',
    equipmentType: 'Feed System',
    status: 'Operational',
    maintenancePriority: 'Low',
    lastMaintenanceDate: '2026-08-01',
  },
  {
    id: 'eq-2',
    name: 'Diffuser',
    assetId: 'A-2',
    farmSite: 'North',
    equipmentType: 'Oxygenation',
    status: 'Requires Maintenance',
    maintenancePriority: 'Critical',
    lastMaintenanceDate: '2026-01-01',
  },
  {
    id: 'eq-3',
    name: 'Winch',
    assetId: 'A-3',
    farmSite: 'West',
    equipmentType: 'Net Pen',
    status: 'Under Maintenance',
    maintenancePriority: 'Medium',
    lastMaintenanceDate: '2026-09-01',
  },
]

const reference = new Date(2026, 9, 13)

describe('maintenance', () => {
  it('counts requiring and under-maintenance items', () => {
    expect(countRequiringMaintenance(items)).toBe(1)
    expect(countUnderMaintenance(items)).toBe(1)
  })

  it('matches status filters without case sensitivity', () => {
    expect(matchesStatusFilter(items[1], 'all')).toBe(true)
    expect(matchesStatusFilter(items[1], 'requires maintenance')).toBe(true)
    expect(matchesStatusFilter(items[0], 'Requires Maintenance')).toBe(false)
  })

  it('filters the list by status', () => {
    expect(filterEquipment(items, 'Under Maintenance').map((item) => item.id)).toEqual(['eq-3'])
  })

  it('marks maintenance overdue after 90 days from the reference date', () => {
    expect(isMaintenanceOverdue('2026-01-01', reference)).toBe(true)
    expect(isMaintenanceOverdue('2026-09-01', reference)).toBe(false)
    expect(isMaintenanceOverdue('2026-07-15', reference)).toBe(true)
  })
})
