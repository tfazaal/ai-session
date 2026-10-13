import { equipmentStatusTone, isMaintenanceOverdue } from '../../equipment/maintenance.ts'
import type { Equipment } from '../../equipment/types.ts'
import { formatUpdatedDate } from '../../lib/format.ts'
import { EquipmentStatusBadge } from './EquipmentStatusBadge.tsx'
import { OverdueFlag } from './OverdueFlag.tsx'
import { PriorityBadge } from './PriorityBadge.tsx'
import styles from './EquipmentDetail.module.css'

export function EquipmentDetail({
  item,
  onClose,
}: {
  item: Equipment
  onClose: () => void
}) {
  const overdue = isMaintenanceOverdue(item.lastMaintenanceDate)

  return (
    <div
      className={styles.panel}
      data-tone={equipmentStatusTone(item.status)}
      role="region"
      aria-label={`${item.name} details`}
    >
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{item.name}</h3>
          <p className={styles.id}>{item.assetId}</p>
        </div>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={styles.badges}>
        <EquipmentStatusBadge status={item.status} />
        <PriorityBadge priority={item.maintenancePriority} />
        <OverdueFlag overdue={overdue} />
      </div>
      <dl className={styles.facts}>
        <dt>ID</dt>
        <dd>{item.id}</dd>
        <dt>Farm site</dt>
        <dd>{item.farmSite}</dd>
        <dt>Type</dt>
        <dd>{item.equipmentType}</dd>
        <dt>Status</dt>
        <dd>{item.status}</dd>
        <dt>Priority</dt>
        <dd>{item.maintenancePriority}</dd>
        <dt>Last maintenance</dt>
        <dd>{formatUpdatedDate(item.lastMaintenanceDate)}</dd>
        <dt>Overdue</dt>
        <dd>{overdue ? 'Yes' : 'No'}</dd>
      </dl>
    </div>
  )
}
