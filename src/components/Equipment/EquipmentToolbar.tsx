import {
  EQUIPMENT_STATUS_FILTERS,
} from '../../equipment/maintenance.ts'
import type { EquipmentStatusFilter } from '../../equipment/types.ts'
import styles from './EquipmentToolbar.module.css'

export function EquipmentToolbar({
  status,
  requiringCount,
  onStatusChange,
}: {
  status: EquipmentStatusFilter
  requiringCount: number
  onStatusChange: (status: EquipmentStatusFilter) => void
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="equipment-status-filter">
          Status filter
        </label>
        <select
          id="equipment-status-filter"
          className={styles.select}
          value={status}
          onChange={(event) => onStatusChange(event.target.value as EquipmentStatusFilter)}
        >
          {EQUIPMENT_STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p className={styles.note}>
        {requiringCount} {requiringCount === 1 ? 'asset requires' : 'assets require'} maintenance
      </p>
    </div>
  )
}
