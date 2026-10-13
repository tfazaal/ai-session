import { useMemo, useState } from 'react'
import {
  countRequiringMaintenance,
  countUnderMaintenance,
  filterEquipment,
} from '../../equipment/maintenance.ts'
import type { Equipment, EquipmentStatusFilter } from '../../equipment/types.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { EmptyState } from '../EmptyState/EmptyState.tsx'
import { EquipmentList } from './EquipmentList.tsx'
import { EquipmentSummary } from './EquipmentSummary.tsx'
import { EquipmentToolbar } from './EquipmentToolbar.tsx'
import styles from './EquipmentDashboard.module.css'

const NARROW_QUERY = '(max-width: 719px)'

export function EquipmentDashboard({ equipment }: { equipment: readonly Equipment[] }) {
  const [status, setStatus] = useState<EquipmentStatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const compact = useMediaQuery(NARROW_QUERY)

  const visible = useMemo(() => filterEquipment(equipment, status), [equipment, status])
  const requiringCount = countRequiringMaintenance(equipment)

  function toggleDetails(id: string) {
    setSelectedId((current) => (current === id ? null : id))
  }

  return (
    <>
      <div className={styles.intro}>
        <h1>Equipment dashboard</h1>
        <p>Track equipment and maintenance across fictional fish farming sites.</p>
      </div>
      <EquipmentSummary
        total={equipment.length}
        requiring={requiringCount}
        underMaintenance={countUnderMaintenance(equipment)}
      />
      <section className={styles.panel} aria-labelledby="equipment-list-heading">
        <h2 id="equipment-list-heading" className={styles.heading}>
          Equipment list
        </h2>
        <EquipmentToolbar
          status={status}
          requiringCount={requiringCount}
          onStatusChange={(next) => {
            setStatus(next)
            setSelectedId(null)
          }}
        />
        {visible.length === 0 ? (
          <EmptyState
            title="No matching equipment"
            message="No equipment matches the current filter."
          />
        ) : (
          <EquipmentList
            items={visible}
            selectedId={selectedId}
            compact={compact}
            onToggle={toggleDetails}
            onClose={() => setSelectedId(null)}
          />
        )}
      </section>
    </>
  )
}
