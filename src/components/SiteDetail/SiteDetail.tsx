import type { RefObject } from 'react'
import type { FarmSite } from '../../types/site.ts'
import { formatCoordinates, hasValidCoordinates } from '../../lib/coordinates.ts'
import {
  formatCageCount,
  formatDateTime,
  formatPopulation,
  formatUpdatedDate,
  formatWeightKg,
} from '../../lib/format.ts'
import { StatusBadge } from '../StatusBadge/StatusBadge.tsx'
import styles from './SiteDetail.module.css'

export function SiteDetail({
  site,
  closeLabel,
  closeRef,
  onClose,
}: {
  site: FarmSite | null
  closeLabel: string
  closeRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}) {
  const description = site?.description?.trim()
  const coords = site?.coordinates && hasValidCoordinates(site) ? site.coordinates : null

  return (
    <section
      className={styles.panel}
      aria-labelledby="site-detail-heading"
      data-status={site?.status}
    >
      <div className={styles.header}>
        <h2 id="site-detail-heading" className={styles.title} tabIndex={-1}>
          {site ? site.name : 'Site not found'}
        </h2>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          {closeLabel}
        </button>
      </div>
      {site ? (
        <>
          <p className={styles.id}>{site.id}</p>
          <div className={styles.statusRow}>
            <StatusBadge status={site.status} />
          </div>

          <h3 className={styles.sectionTitle}>Overview</h3>
          <dl className={styles.facts}>
            <dt>Location</dt>
            <dd>{site.region}, {site.country}</dd>
            <dt>Coordinates</dt>
            <dd>{coords ? formatCoordinates(coords) : 'Not available'}</dd>
            <dt>Site manager</dt>
            <dd>{site.manager}</dd>
            <dt>Cages</dt>
            <dd>
              {formatCageCount(site.totalCages)} ({site.activeCages} active)
            </dd>
            <dt>Last updated</dt>
            <dd>{formatDateTime(site.updatedAt)}</dd>
          </dl>

          <h3 className={styles.sectionTitle}>Operations</h3>
          <dl className={styles.facts}>
            <dt>Fish population</dt>
            <dd>
              {site.fishPopulation != null ? formatPopulation(site.fishPopulation) : 'Not recorded'}
            </dd>
            <dt>Avg. fish weight</dt>
            <dd>
              {site.averageFishWeightKg != null
                ? formatWeightKg(site.averageFishWeightKg)
                : 'Not recorded'}
            </dd>
            <dt>Last inspection</dt>
            <dd>{formatUpdatedDate(site.lastInspectionOn)}</dd>
            <dt>Next inspection</dt>
            <dd>{formatUpdatedDate(site.nextInspectionOn)}</dd>
          </dl>

          <h3 className={styles.sectionTitle}>Environmental (simulated)</h3>
          <p className={styles.simulatedNote}>
            Readings below are fictional prototype data, not live sensor feeds.
          </p>
          {site.environmental ? (
            <dl className={styles.facts}>
              <dt>Water temperature</dt>
              <dd>{site.environmental.waterTemperatureC.toFixed(1)} °C</dd>
              <dt>Oxygen</dt>
              <dd>{site.environmental.oxygenMgL.toFixed(1)} mg/L</dd>
              <dt>Measured at</dt>
              <dd>{formatDateTime(site.environmental.measuredAt)}</dd>
            </dl>
          ) : (
            <p className={styles.notesMissing}>No simulated environmental reading on file.</p>
          )}

          <h3 className={styles.notesTitle}>Description</h3>
          <p className={description ? styles.notes : styles.notesMissing}>
            {description || 'No description has been recorded for this site.'}
          </p>
        </>
      ) : (
        <p className={styles.missing}>
          This selection does not match any site in the current records.
        </p>
      )}
    </section>
  )
}
