export type OperationalStatus = 'Operational' | 'Requires Maintenance' | 'Under Maintenance'

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type EquipmentType = 'Feed System' | 'Oxygenation' | 'Net Pen' | 'Monitoring' | 'Pumping'

export type EquipmentStatusFilter = 'all' | OperationalStatus

export type Equipment = {
  id: string
  name: string
  assetId: string
  farmSite: string
  equipmentType: EquipmentType
  status: OperationalStatus
  maintenancePriority: MaintenancePriority
  lastMaintenanceDate: string
}
