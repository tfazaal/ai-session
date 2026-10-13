import { SITE_STATUSES, type StatusFilter } from '../types/site.ts'

export type DashboardUrlState = {
  search: string
  status: StatusFilter
  selectedId: string | null
}

export function parseStatusParam(value: string | null): StatusFilter {
  if (value && (SITE_STATUSES as readonly string[]).includes(value)) {
    return value as StatusFilter
  }
  return 'all'
}

export function readDashboardUrl(search: string): DashboardUrlState {
  const query = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(query)
  return {
    search: params.get('q') ?? '',
    status: parseStatusParam(params.get('status')),
    selectedId: params.get('site') || null,
  }
}

export function buildDashboardSearch(state: DashboardUrlState): string {
  const params = new URLSearchParams()
  if (state.status !== 'all') params.set('status', state.status)
  const term = state.search.trim()
  if (term) params.set('q', term)
  if (state.selectedId) params.set('site', state.selectedId)
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export function dashboardUrlStatesEqual(a: DashboardUrlState, b: DashboardUrlState): boolean {
  return a.search === b.search && a.status === b.status && a.selectedId === b.selectedId
}
