import type { SiteSort, StatusFilter } from '../../types/site.ts'
import { STATUS_FILTER_OPTIONS } from '../../lib/status.ts'
import { SITE_SORT_OPTIONS } from '../../lib/sortOptions.ts'
import styles from './SiteToolbar.module.css'

export function SiteToolbar({
  search,
  status,
  country,
  sort,
  countries,
  visibleCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onCountryChange,
  onSortChange,
  onClear,
}: {
  search: string
  status: StatusFilter
  country: string
  sort: SiteSort
  countries: readonly string[]
  visibleCount: number
  totalCount: number
  onSearchChange: (search: string) => void
  onStatusChange: (status: StatusFilter) => void
  onCountryChange: (country: string) => void
  onSortChange: (sort: SiteSort) => void
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
            placeholder="Site name, region, or manager"
            autoComplete="off"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className={styles.selectField}>
          <label className={styles.label} htmlFor="site-country">
            Country
          </label>
          <select
            id="site-country"
            className={styles.select}
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectField}>
          <label className={styles.label} htmlFor="site-sort">
            Sort by
          </label>
          <select
            id="site-sort"
            className={styles.select}
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SiteSort)}
          >
            {SITE_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            Clear all filters
          </button>
        ) : null}
      </div>
    </div>
  )
}
