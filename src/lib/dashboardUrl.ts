import { SITE_SORTS, SITE_STATUSES, type SiteSort, type StatusFilter } from '../types/site.ts'

export type DashboardUrlState = {
  search: string
  status: StatusFilter
  country: string
  sort: SiteSort
  selectedId: string | null
}

export function parseStatusParam(value: string | null): StatusFilter {
  if (value && (SITE_STATUSES as readonly string[]).includes(value)) {
    return value as StatusFilter
  }
  return 'all'
}

export function parseSortParam(value: string | null): SiteSort {
  if (value && (SITE_SORTS as readonly string[]).includes(value)) {
    return value as SiteSort
  }
  return 'name-asc'
}

export function readDashboardUrl(search: string): DashboardUrlState {
  const query = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(query)
  return {
    search: params.get('q') ?? '',
    status: parseStatusParam(params.get('status')),
    country: params.get('country') ?? '',
    sort: parseSortParam(params.get('sort')),
    selectedId: params.get('site') || null,
  }
}

export function buildDashboardSearch(state: DashboardUrlState): string {
  const params = new URLSearchParams()
  if (state.status !== 'all') params.set('status', state.status)
  const term = state.search.trim()
  if (term) params.set('q', term)
  if (state.country) params.set('country', state.country)
  if (state.sort !== 'name-asc') params.set('sort', state.sort)
  if (state.selectedId) params.set('site', state.selectedId)
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export function dashboardUrlStatesEqual(a: DashboardUrlState, b: DashboardUrlState): boolean {
  return (
    a.search === b.search &&
    a.status === b.status &&
    a.country === b.country &&
    a.sort === b.sort &&
    a.selectedId === b.selectedId
  )
}

export function hasActiveFilters(state: DashboardUrlState): boolean {
  return (
    state.search.trim() !== '' ||
    state.status !== 'all' ||
    state.country !== '' ||
    state.sort !== 'name-asc'
  )
}
