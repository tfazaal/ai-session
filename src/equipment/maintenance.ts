import type { Equipment, EquipmentStatusFilter, OperationalStatus } from './types.ts'

export const MAINTENANCE_INTERVAL_DAYS = 90

export const EQUIPMENT_STATUS_FILTERS: { value: EquipmentStatusFilter; label: string }[] = [
  { value: 'all', label: 'All equipment' },
  { value: 'Operational', label: 'Operational' },
  { value: 'Requires Maintenance', label: 'Requires Maintenance' },
  { value: 'Under Maintenance', label: 'Under Maintenance' },
]

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase()
}

export function countRequiringMaintenance(items: readonly Equipment[]): number {
  return items.filter((item) => item.status === 'Requires Maintenance').length
}

export function countUnderMaintenance(items: readonly Equipment[]): number {
  return items.filter((item) => normalizeStatus(item.status) === normalizeStatus('Under Maintenance'))
    .length
}

export function matchesStatusFilter(item: Equipment, filter: string): boolean {
  if (filter === 'all') return true
  return normalizeStatus(item.status) === normalizeStatus(filter)
}

export function filterEquipment(
  items: readonly Equipment[],
  filter: EquipmentStatusFilter,
): Equipment[] {
  return items.filter((item) => matchesStatusFilter(item, filter))
}

export function isMaintenanceOverdue(
  lastMaintenanceDate: string,
  referenceDate: Date = new Date(),
): boolean {
  const [year, month, day] = lastMaintenanceDate.split('-').map(Number)
  const lastService = new Date(year, month - 1, day)
  lastService.setHours(0, 0, 0, 0)

  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)

  const elapsedDays = (today.getTime() - lastService.getTime()) / (1000 * 60 * 60 * 24)
  return elapsedDays >= MAINTENANCE_INTERVAL_DAYS
}

export function equipmentStatusTone(
  status: OperationalStatus,
): 'operational' | 'attention' | 'maintenance' {
  if (status === 'Operational') return 'operational'
  if (status === 'Requires Maintenance') return 'attention'
  return 'maintenance'
}
