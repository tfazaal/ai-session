import { describe, expect, it } from 'vitest'
import {
  buildDashboardSearch,
  hasActiveFilters,
  parseSortParam,
  parseStatusParam,
  readDashboardUrl,
} from './dashboardUrl.ts'

describe('dashboardUrl', () => {
  it('reads status, search, country, sort, and site from the query string', () => {
    expect(
      readDashboardUrl('?status=attention&q=norway&country=Norway&sort=cages-desc&site=NO-0208'),
    ).toEqual({
      search: 'norway',
      status: 'attention',
      country: 'Norway',
      sort: 'cages-desc',
      selectedId: 'NO-0208',
    })
  })

  it('defaults missing params to the dashboard baseline', () => {
    expect(readDashboardUrl('')).toEqual({
      search: '',
      status: 'all',
      country: '',
      sort: 'name-asc',
      selectedId: null,
    })
    expect(parseStatusParam('unknown')).toBe('all')
    expect(parseSortParam('unknown')).toBe('name-asc')
  })

  it('omits default values when building a shareable URL', () => {
    expect(
      buildDashboardSearch({
        search: '',
        status: 'all',
        country: '',
        sort: 'name-asc',
        selectedId: null,
      }),
    ).toBe('')
    expect(
      buildDashboardSearch({
        search: '  ',
        status: 'operational',
        country: 'Chile',
        sort: 'updated-desc',
        selectedId: 'NO-1',
      }),
    ).toBe('?status=operational&country=Chile&sort=updated-desc&site=NO-1')
    expect(
      buildDashboardSearch({ search: 'fiord', status: 'all', country: '', sort: 'name-asc', selectedId: null }),
    ).toBe('?q=fiord')
  })

  it('detects active filters', () => {
    expect(
      hasActiveFilters({
        search: '',
        status: 'all',
        country: '',
        sort: 'name-asc',
        selectedId: null,
      }),
    ).toBe(false)
    expect(
      hasActiveFilters({
        search: 'x',
        status: 'all',
        country: '',
        sort: 'name-asc',
        selectedId: null,
      }),
    ).toBe(true)
    expect(
      hasActiveFilters({
        search: '',
        status: 'all',
        country: '',
        sort: 'cages-desc',
        selectedId: null,
      }),
    ).toBe(true)
  })
})
