import { Fragment } from 'react'
import { isMaintenanceOverdue } from '../../equipment/maintenance.ts'
import type { Equipment } from '../../equipment/types.ts'
import { formatUpdatedDate } from '../../lib/format.ts'
import { EquipmentDetail } from './EquipmentDetail.tsx'
import { EquipmentStatusBadge } from './EquipmentStatusBadge.tsx'
import { OverdueFlag } from './OverdueFlag.tsx'
import { PriorityBadge } from './PriorityBadge.tsx'
import styles from './EquipmentList.module.css'

export function EquipmentList({
  items,
  selectedId,
  compact,
  onToggle,
  onClose,
}: {
  items: readonly Equipment[]
  selectedId: string | null
  compact: boolean
  onToggle: (id: string) => void
  onClose: () => void
}) {
  if (compact) {
    return (
      <ul className={styles.cards} aria-label="Equipment">
        {items.map((item) => {
          const overdue = isMaintenanceOverdue(item.lastMaintenanceDate)
          const expanded = item.id === selectedId
          return (
            <li key={item.id}>
              <article className={styles.card} data-selected={expanded ? 'true' : undefined}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.cardName}>{item.name}</p>
                    <p className={styles.mono}>{item.assetId}</p>
                  </div>
                  <EquipmentStatusBadge status={item.status} />
                </div>
                <p className={styles.cardLine}>{item.farmSite}</p>
                <p className={styles.cardLine}>{item.equipmentType}</p>
                <div className={styles.cardMeta}>
                  <PriorityBadge priority={item.maintenancePriority} />
                  <span className={styles.cardLine}>{formatUpdatedDate(item.lastMaintenanceDate)}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.cardLine}>Overdue</span>
                  <OverdueFlag overdue={overdue} />
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.action}
                    aria-expanded={expanded}
                    onClick={() => onToggle(item.id)}
                  >
                    {expanded ? 'Hide details' : 'Details'}
                  </button>
                </div>
                {expanded ? <EquipmentDetail item={item} onClose={onClose} /> : null}
              </article>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="visuallyHidden">Equipment</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Asset ID</th>
            <th scope="col">Site</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            <th scope="col">Last maintenance</th>
            <th scope="col">Overdue</th>
            <th scope="col">
              <span className="visuallyHidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const overdue = isMaintenanceOverdue(item.lastMaintenanceDate)
            const expanded = item.id === selectedId
            return (
              <Fragment key={item.id}>
                <tr data-selected={expanded ? 'true' : undefined}>
                  <td className={styles.name}>{item.name}</td>
                  <td className={styles.mono}>{item.assetId}</td>
                  <td>{item.farmSite}</td>
                  <td>{item.equipmentType}</td>
                  <td>
                    <EquipmentStatusBadge status={item.status} />
                  </td>
                  <td>
                    <PriorityBadge priority={item.maintenancePriority} />
                  </td>
                  <td className={styles.date}>{formatUpdatedDate(item.lastMaintenanceDate)}</td>
                  <td>
                    <OverdueFlag overdue={overdue} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.action}
                      aria-expanded={expanded}
                      onClick={() => onToggle(item.id)}
                    >
                      {expanded ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expanded ? (
                  <tr className={styles.expand}>
                    <td colSpan={9}>
                      <EquipmentDetail item={item} onClose={onClose} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
