import { useEffect, useRef, useState } from 'react'
import type { StatusFilter } from '../types/site.ts'
import {
  buildDashboardSearch,
  dashboardUrlStatesEqual,
  readDashboardUrl,
  type DashboardUrlState,
} from '../lib/dashboardUrl.ts'

type HistoryMode = 'push' | 'replace' | 'none'

function writeHistory(state: DashboardUrlState, mode: Exclude<HistoryMode, 'none'>) {
  const path = `${window.location.pathname}${buildDashboardSearch(state)}`
  const current = `${window.location.pathname}${window.location.search}`
  if (path === current) return
  if (mode === 'push') window.history.pushState(null, '', path)
  else window.history.replaceState(null, '', path)
}

export function useDashboardUrlState(initialSelectedId: string | null) {
  const [state, setState] = useState<DashboardUrlState>(() => {
    const fromUrl = readDashboardUrl(window.location.search)
    if (!fromUrl.selectedId && initialSelectedId) {
      return { ...fromUrl, selectedId: initialSelectedId }
    }
    return fromUrl
  })
  const [detailOpen, setDetailOpen] = useState(() => state.selectedId != null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const fromUrl = readDashboardUrl(window.location.search)
    if (!fromUrl.selectedId && initialSelectedId) {
      const next = { ...fromUrl, selectedId: initialSelectedId }
      writeHistory(next, 'replace')
      setState(next)
      setDetailOpen(true)
    }
  }, [initialSelectedId])

  useEffect(() => {
    const onPopState = () => {
      const next = readDashboardUrl(window.location.search)
      setState(next)
      setDetailOpen(next.selectedId != null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const commit = (next: DashboardUrlState, history: HistoryMode) => {
    if (!dashboardUrlStatesEqual(stateRef.current, next)) {
      setState(next)
    }
    if (history !== 'none') writeHistory(next, history)
  }

  const setSearch = (search: string) => {
    commit({ ...stateRef.current, search }, 'replace')
  }

  const setStatus = (status: StatusFilter) => {
    commit({ ...stateRef.current, status }, 'push')
  }

  const handleStatusChange = (next: StatusFilter) => {
    const current = stateRef.current.status
    const status = next !== 'all' && current === next ? 'all' : next
    commit({ ...stateRef.current, status }, 'push')
  }

  const selectSite = (id: string) => {
    const next = { ...stateRef.current, selectedId: id }
    const siteChanged = stateRef.current.selectedId !== id
    commit(next, siteChanged ? 'push' : 'none')
    setDetailOpen(true)
  }

  const closeDetail = (wide: boolean) => {
    if (wide) {
      commit({ ...stateRef.current, selectedId: null }, 'push')
      setDetailOpen(false)
      return
    }
    setDetailOpen(false)
  }

  const clearFilters = () => {
    commit({ ...stateRef.current, search: '', status: 'all' }, 'push')
  }

  return {
    search: state.search,
    status: state.status,
    selectedId: state.selectedId,
    detailOpen,
    setSearch,
    setStatus,
    handleStatusChange,
    selectSite,
    closeDetail,
    clearFilters,
  }
}
