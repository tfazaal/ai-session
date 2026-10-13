import type { RefObject } from 'react'
import type { FarmSite } from '../../types/site.ts'
import { formatCageCount, formatUpdatedDate } from '../../lib/format.ts'
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
          <dl className={styles.facts}>
            <dt>Location</dt>
            <dd>{site.location}</dd>
            <dt>Cages</dt>
            <dd>{formatCageCount(site.cages)}</dd>
            <dt>Last updated</dt>
            <dd>{formatUpdatedDate(site.updatedOn)}</dd>
          </dl>
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
