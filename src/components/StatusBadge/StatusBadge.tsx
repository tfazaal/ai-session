import type { SiteStatus } from '../../types/site.ts'
import { STATUS_LABELS } from '../../lib/status.ts'
import styles from './StatusBadge.module.css'

export function StatusBadge({ status }: { status: SiteStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
