import { useEffect, useMemo, useRef } from 'react'
import type { FarmSite, StatusFilter } from '../../types/site.ts'
import type { SiteActivity } from '../../types/activity.ts'
import { filterSites, getSiteCountries } from '../../lib/filterSites.ts'
import { calculateMetrics } from '../../lib/metrics.ts'
import { STATUS_LABELS } from '../../lib/status.ts'
import { hasActiveFilters } from '../../lib/dashboardUrl.ts'
import { calculateEnvironmentalOverview } from '../../lib/environmentalMetrics.ts'
import { getRecentActivities } from '../../lib/activities.ts'
import { SIMULATION_SNAPSHOT_AT } from '../../data/sites.ts'
import { useDashboardUrlState } from '../../hooks/useDashboardUrlState.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { AppShell } from '../AppShell/AppShell.tsx'
import { EmptyState } from '../EmptyState/EmptyState.tsx'
import { SiteDetail } from '../SiteDetail/SiteDetail.tsx'
import { SiteList } from '../SiteList/SiteList.tsx'
import { SiteToolbar } from '../SiteToolbar/SiteToolbar.tsx'
import { SiteMap } from '../SiteMap/SiteMap.tsx'
import { SummaryCards } from '../SummaryCards/SummaryCards.tsx'
import { EnvironmentalOverview } from '../EnvironmentalOverview/EnvironmentalOverview.tsx'
import { ActivityFeed } from '../ActivityFeed/ActivityFeed.tsx'
import styles from './Dashboard.module.css'

const NARROW_QUERY = '(max-width: 719px)'
const WIDE_QUERY = '(min-width: 1080px)'

function emptyResultMessage(
  search: string,
  status: StatusFilter,
  country: string,
): string {
  const term = search.trim()
  const parts: string[] = []
  if (term) parts.push(`"${term}"`)
  if (status !== 'all') parts.push(`status ${STATUS_LABELS[status]}`)
  if (country) parts.push(`country ${country}`)
  if (parts.length === 0) return 'No sites match the current filters.'
  return `No sites match ${parts.join(' with ')}.`
}

export function Dashboard({
  sites,
  activities,
  initialSelectedId = null,
}: {
  sites: readonly FarmSite[]
  activities: readonly SiteActivity[]
  initialSelectedId?: string | null
}) {
  const {
    search,
    status,
    country,
    sort,
    selectedId,
    detailOpen,
    setSearch,
    setStatus,
    handleStatusChange,
    setCountry,
    setSort,
    selectSite,
    closeDetail,
    clearFilters,
    revealSite,
  } = useDashboardUrlState(initialSelectedId)
  const isNarrow = useMediaQuery(NARROW_QUERY)
  const isWide = useMediaQuery(WIDE_QUERY)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pendingFocusId = useRef<string | null>(null)

  const metrics = calculateMetrics(sites)
  const countries = useMemo(() => getSiteCountries(sites), [sites])
  const visibleSites = filterSites(sites, { search, status, country, sort })
  const environmental = useMemo(
    () => calculateEnvironmentalOverview(sites, new Date(SIMULATION_SNAPSHOT_AT)),
    [sites],
  )
  const recentActivities = useMemo(() => getRecentActivities(activities, 5), [activities])
  const selectedSite = selectedId ? (sites.find((site) => site.id === selectedId) ?? null) : null
  const showDetail = selectedId != null && (isWide || detailOpen)
  const showList = sites.length > 0 && (isWide || !showDetail)
  const urlState = { search, status, country, sort, selectedId }
  const filtersActive = hasActiveFilters(urlState)

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

  function handleSelect(id: string) {
    selectSite(id)
  }

  function handleClose() {
    if (isWide) {
      const id = selectedId
      closeDetail(true)
      if (id) document.getElementById(`site-trigger-${id}`)?.focus()
      return
    }

    pendingFocusId.current = selectedId
    closeDetail(false)
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
      <EnvironmentalOverview metrics={environmental} />
      <ActivityFeed activities={recentActivities} onSelectSite={revealSite} />
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
              <div className={styles.mapPanel}>
                <SiteMap sites={visibleSites} selectedId={selectedId} onSelect={handleSelect} />
              </div>
              <SiteToolbar
                search={search}
                status={status}
                country={country}
                sort={sort}
                countries={countries}
                visibleCount={visibleSites.length}
                totalCount={sites.length}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onCountryChange={setCountry}
                onSortChange={setSort}
                onClear={filtersActive ? clearAction : undefined}
              />
              {visibleSites.length === 0 ? (
                <EmptyState
                  title="No matching sites"
                  message={emptyResultMessage(search, status, country)}
                  action={clearAction ? { label: 'Clear all filters', onClick: clearAction } : undefined}
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
              <p>Select a site from the list or map to see operations and simulated environmental data.</p>
            </aside>
          ) : null}
        </div>
      )}
    </AppShell>
  )
}
