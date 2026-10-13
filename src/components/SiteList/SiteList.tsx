import type { FarmSite } from '../../types/site.ts'
import { formatCageCount, formatDateTime } from '../../lib/format.ts'
import { StatusBadge } from '../StatusBadge/StatusBadge.tsx'
import styles from './SiteList.module.css'

export function SiteList({
  sites,
  selectedId,
  compact,
  onSelect,
}: {
  sites: readonly FarmSite[]
  selectedId: string | null
  compact: boolean
  onSelect: (id: string) => void
}) {
  if (compact) {
    return (
      <ul className={styles.cards} aria-label="Farm sites">
        {sites.map((site) => (
          <li key={site.id}>
            <button
              type="button"
              id={`site-trigger-${site.id}`}
              className={styles.card}
              aria-pressed={site.id === selectedId}
              onClick={() => onSelect(site.id)}
            >
              <span className={styles.cardTop}>
                <span className={styles.cardName}>{site.name}</span>
                <StatusBadge status={site.status} />
              </span>
              <span className={styles.cardId}>{site.id}</span>
              <span className={styles.cardLocation}>
                {site.region}, {site.country}
              </span>
              <span className={styles.cardMeta}>
                {formatCageCount(site.totalCages)}
                <span aria-hidden="true"> · </span>
                Updated {formatDateTime(site.updatedAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="visuallyHidden">Farm sites</caption>
        <thead>
          <tr>
            <th scope="col">Site</th>
            <th scope="col">Location</th>
            <th scope="col">Cages</th>
            <th scope="col">Status</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id} data-selected={site.id === selectedId ? 'true' : undefined}>
              <th scope="row">
                <button
                  type="button"
                  id={`site-trigger-${site.id}`}
                  className={styles.nameButton}
                  aria-pressed={site.id === selectedId}
                  onClick={() => onSelect(site.id)}
                >
                  {site.name}
                  <span className={styles.siteId}>{site.id}</span>
                </button>
              </th>
              <td>
                {site.region}, {site.country}
              </td>
              <td>{formatCageCount(site.totalCages)}</td>
              <td>
                <StatusBadge status={site.status} />
              </td>
              <td className={styles.updated}>{formatDateTime(site.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
