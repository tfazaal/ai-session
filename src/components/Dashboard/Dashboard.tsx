import { useEffect, useRef, useState } from 'react'
import type { FarmSite, StatusFilter } from '../../types/site.ts'
import { filterSites } from '../../lib/filterSites.ts'
import { calculateMetrics } from '../../lib/metrics.ts'
import { STATUS_LABELS } from '../../lib/status.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { AppShell } from '../AppShell/AppShell.tsx'
import { EmptyState } from '../EmptyState/EmptyState.tsx'
import { SiteDetail } from '../SiteDetail/SiteDetail.tsx'
import { SiteList } from '../SiteList/SiteList.tsx'
import { SiteToolbar } from '../SiteToolbar/SiteToolbar.tsx'
import { SummaryCards } from '../SummaryCards/SummaryCards.tsx'
import styles from './Dashboard.module.css'

const NARROW_QUERY = '(max-width: 719px)'
const WIDE_QUERY = '(min-width: 1080px)'

function emptyResultMessage(search: string, status: StatusFilter): string {
  const term = search.trim()
  if (term && status !== 'all') {
    return `No sites match "${term}" with status ${STATUS_LABELS[status]}.`
  }
  if (term) return `No sites match "${term}".`
  if (status !== 'all') return `No sites are marked ${STATUS_LABELS[status]}.`
  return 'No sites match the current filters.'
}

export function Dashboard({
  sites,
  initialSelectedId = null,
}: {
  sites: readonly FarmSite[]
  initialSelectedId?: string | null
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId)
  const [detailOpen, setDetailOpen] = useState(initialSelectedId != null)
  const isNarrow = useMediaQuery(NARROW_QUERY)
  const isWide = useMediaQuery(WIDE_QUERY)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pendingFocusId = useRef<string | null>(null)

  const metrics = calculateMetrics(sites)
  const visibleSites = filterSites(sites, { search, status })
  const selectedSite = selectedId ? (sites.find((site) => site.id === selectedId) ?? null) : null
  const showDetail = selectedId != null && (isWide || detailOpen)
  const showList = sites.length > 0 && (isWide || !showDetail)
  const filtersActive = search.trim() !== '' || status !== 'all'

  useEffect(() => {
    if (showDetail && !isWide) {
      closeRef.current?.focus()
    }
  }, [showDetail, isWide, selectedId])

  useEffect(() => {
    if (showDetail || pendingFocusId.current == null) return
    const id = pendingFocusId.current
    pendingFocusId.current = null
    document.getElementById(`site-trigger-${id}`)?.focus()
  }, [showDetail])

  function handleStatusChange(next: StatusFilter) {
    setStatus((current) => (next !== 'all' && current === next ? 'all' : next))
  }

  function handleSelect(id: string) {
    setSelectedId(id)
    setDetailOpen(true)
  }

  function handleClose() {
    if (isWide) {
      const id = selectedId
      setSelectedId(null)
      setDetailOpen(false)
      if (id) document.getElementById(`site-trigger-${id}`)?.focus()
      return
    }

    pendingFocusId.current = selectedId
    setDetailOpen(false)
  }

  function clearFilters() {
    setSearch('')
    setStatus('all')
  }

  const clearAction = filtersActive ? clearFilters : undefined

  return (
    <AppShell siteCount={metrics.total}>
      <div className={styles.intro}>
        <h1>Fish farm operations</h1>
        <p>Check which sites are operating, need attention, or are in maintenance.</p>
      </div>
      <SummaryCards
        metrics={metrics}
        status={status}
        disabled={sites.length === 0}
        onStatusChange={handleStatusChange}
      />
      {sites.length === 0 ? (
        <div className={styles.emptyPanel}>
          <EmptyState
            title="No sites available"
            message="There are no fish farming sites in the current records."
          />
        </div>
      ) : (
        <div className={styles.workspace}>
          {showList ? (
            <section className={styles.listPanel} aria-labelledby="sites-heading">
              <h2 id="sites-heading" className={styles.sectionTitle}>
                Sites
              </h2>
              <SiteToolbar
                search={search}
                status={status}
                visibleCount={visibleSites.length}
                totalCount={sites.length}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onClear={visibleSites.length > 0 ? clearAction : undefined}
              />
              {visibleSites.length === 0 ? (
                <EmptyState
                  title="No matching sites"
                  message={emptyResultMessage(search, status)}
                  action={clearAction ? { label: 'Clear filters', onClick: clearAction } : undefined}
                />
              ) : (
                <SiteList
                  sites={visibleSites}
                  selectedId={selectedId}
                  compact={isNarrow}
                  onSelect={handleSelect}
                />
              )}
            </section>
          ) : null}
          {showDetail ? (
            <SiteDetail
              site={selectedSite}
              closeLabel={isWide ? 'Close' : 'Back to sites'}
              closeRef={closeRef}
              onClose={handleClose}
            />
          ) : null}
          {isWide && !showDetail ? (
            <aside className={styles.placeholder} aria-label="Site details">
              <h2>Site details</h2>
              <p>Select a site to see its location, cages, status, and description.</p>
            </aside>
          ) : null}
        </div>
      )}
    </AppShell>
  )
}
