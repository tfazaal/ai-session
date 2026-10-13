import type { OperationalStatus } from '../../equipment/types.ts'
import { equipmentStatusTone } from '../../equipment/maintenance.ts'
import styles from '../StatusBadge/StatusBadge.module.css'

export function EquipmentStatusBadge({ status }: { status: OperationalStatus }) {
  return (
    <span className={`${styles.badge} ${styles[equipmentStatusTone(status)]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  )
}
