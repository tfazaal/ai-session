import type { MaintenancePriority } from '../../equipment/types.ts'
import styles from './EquipmentBadges.module.css'

const PRIORITY_CLASS: Record<MaintenancePriority, string> = {
  Low: styles.low,
  Medium: styles.medium,
  High: styles.high,
  Critical: styles.critical,
}

export function PriorityBadge({ priority }: { priority: MaintenancePriority }) {
  return <span className={`${styles.priority} ${PRIORITY_CLASS[priority]}`}>{priority}</span>
}
