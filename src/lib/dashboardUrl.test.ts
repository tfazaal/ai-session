import { describe, expect, it } from 'vitest'
import { buildDashboardSearch, parseStatusParam, readDashboardUrl } from './dashboardUrl.ts'

describe('dashboardUrl', () => {
  it('reads status, search, and site from the query string', () => {
    expect(readDashboardUrl('?status=attention&q=norway&site=NO-0208')).toEqual({
      search: 'norway',
      status: 'attention',
      selectedId: 'NO-0208',
    })
  })

  it('defaults missing params to the dashboard baseline', () => {
    expect(readDashboardUrl('')).toEqual({
      search: '',
      status: 'all',
      selectedId: null,
    })
    expect(parseStatusParam('unknown')).toBe('all')
  })

  it('omits default values when building a shareable URL', () => {
    expect(buildDashboardSearch({ search: '', status: 'all', selectedId: null })).toBe('')
    expect(buildDashboardSearch({ search: '  ', status: 'operational', selectedId: 'NO-1' })).toBe(
      '?status=operational&site=NO-1',
    )
    expect(buildDashboardSearch({ search: 'fiord', status: 'all', selectedId: null })).toBe('?q=fiord')
  })
})
