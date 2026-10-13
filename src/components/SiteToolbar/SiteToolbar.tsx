import type { StatusFilter } from '../../types/site.ts'
import { STATUS_FILTER_OPTIONS } from '../../lib/status.ts'
import styles from './SiteToolbar.module.css'

export function SiteToolbar({
  search,
  status,
  visibleCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onClear,
}: {
  search: string
  status: StatusFilter
  visibleCount: number
  totalCount: number
  onSearchChange: (search: string) => void
  onStatusChange: (status: StatusFilter) => void
  onClear?: () => void
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.controls}>
        <div className={styles.searchField}>
          <label className={styles.label} htmlFor="site-search">
            Search
          </label>
          <input
            id="site-search"
            className={styles.search}
            type="search"
            value={search}
            placeholder="Site name or location"
            autoComplete="off"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <fieldset className={styles.statusField}>
          <legend className={styles.label}>Status</legend>
          <div className={styles.options}>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="radio"
                  name="site-status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={() => onStatusChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className={styles.summaryRow}>
        <p className={styles.count} aria-live="polite">
          Showing {visibleCount} of {totalCount} sites
        </p>
        {onClear ? (
          <button type="button" className={styles.clear} onClick={onClear}>
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  )
}
