import { describe, expect, it } from 'vitest'
import { filterSites, getSiteCountries } from './filterSites.ts'
import { sampleFarmSites } from '../test/fixtures/sites.ts'

describe('filterSites', () => {
  it('returns every site, sorted by name, when filters are open', () => {
    const result = filterSites(sampleFarmSites, {
      search: '   ',
      status: 'all',
      country: '',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.name)).toEqual(['Hestøya', 'Rørvik North', 'Sound of Mull'])
  })

  it('matches site names without case sensitivity', () => {
    const result = filterSites(sampleFarmSites, {
      search: '  HEST ',
      status: 'all',
      country: '',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.id)).toEqual(['NO-1'])
  })

  it('matches country and region text', () => {
    const result = filterSites(sampleFarmSites, {
      search: 'scotland',
      status: 'all',
      country: '',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.id)).toEqual(['SC-1'])
  })

  it('does not search the description', () => {
    const result = filterSites(sampleFarmSites, {
      search: 'oxygen',
      status: 'all',
      country: '',
      sort: 'name-asc',
    })

    expect(result).toEqual([])
  })

  it('filters by operational status', () => {
    const result = filterSites(sampleFarmSites, {
      search: '',
      status: 'maintenance',
      country: '',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.status)).toEqual(['maintenance'])
  })

  it('filters by country', () => {
    const result = filterSites(sampleFarmSites, {
      search: '',
      status: 'all',
      country: 'Norway',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.id)).toEqual(['NO-1', 'NO-2'])
  })

  it('applies search, status, and country together', () => {
    const result = filterSites(sampleFarmSites, {
      search: 'norway',
      status: 'attention',
      country: 'Norway',
      sort: 'name-asc',
    })

    expect(result.map((site) => site.id)).toEqual(['NO-2'])
  })

  it('sorts by cage count descending', () => {
    const result = filterSites(sampleFarmSites, {
      search: '',
      status: 'all',
      country: '',
      sort: 'cages-desc',
    })

    expect(result.map((site) => site.totalCages)).toEqual([12, 8, 1])
  })

  it('sorts by updated date ascending', () => {
    const result = filterSites(sampleFarmSites, {
      search: '',
      status: 'all',
      country: '',
      sort: 'updated-asc',
    })

    expect(result.map((site) => site.id)).toEqual(['SC-1', 'NO-1', 'NO-2'])
  })

  it('returns no sites when the combined filters exclude everything', () => {
    const result = filterSites(sampleFarmSites, {
      search: 'norway',
      status: 'maintenance',
      country: '',
      sort: 'name-asc',
    })

    expect(result).toEqual([])
  })

  it('does not mutate the original list', () => {
    const original = [...sampleFarmSites]
    filterSites(sampleFarmSites, { search: 'norway', status: 'all', country: '', sort: 'name-asc' })

    expect(sampleFarmSites).toEqual(original)
  })
})

describe('getSiteCountries', () => {
  it('returns unique sorted country names', () => {
    expect(getSiteCountries(sampleFarmSites)).toEqual(['Norway', 'United Kingdom'])
  })
})
