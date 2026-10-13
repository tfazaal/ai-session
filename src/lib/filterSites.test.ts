import { describe, expect, it } from 'vitest'
import { filterSites } from './filterSites.ts'
import type { FarmSite } from '../types/site.ts'

const records: FarmSite[] = [
  {
    id: 'NO-1',
    name: 'Hestøya',
    location: 'Nordland, Norway',
    cages: 12,
    status: 'operational',
    updatedOn: '2026-10-11',
    description: 'Sheltered site.',
  },
  {
    id: 'NO-2',
    name: 'Rørvik North',
    location: 'Trøndelag, Norway',
    cages: 8,
    status: 'attention',
    updatedOn: '2026-10-12',
    description: 'Overnight oxygen drop in two cages.',
  },
  {
    id: 'SC-1',
    name: 'Sound of Mull',
    location: 'Argyll, Scotland',
    cages: 1,
    status: 'maintenance',
    updatedOn: '2026-10-06',
  },
]

describe('filterSites', () => {
  it('returns every site, sorted by name, when search and status are open', () => {
    const result = filterSites(records, { search: '   ', status: 'all' })

    expect(result.map((site) => site.name)).toEqual(['Hestøya', 'Rørvik North', 'Sound of Mull'])
  })

  it('matches site names without case sensitivity', () => {
    const result = filterSites(records, { search: '  HEST ', status: 'all' })

    expect(result.map((site) => site.id)).toEqual(['NO-1'])
  })

  it('matches location text, including the country', () => {
    const result = filterSites(records, { search: 'scotland', status: 'all' })

    expect(result.map((site) => site.id)).toEqual(['SC-1'])
  })

  it('does not search the description', () => {
    const result = filterSites(records, { search: 'oxygen', status: 'all' })

    expect(result).toEqual([])
  })

  it('filters by operational status', () => {
    const result = filterSites(records, { search: '', status: 'maintenance' })

    expect(result.map((site) => site.status)).toEqual(['maintenance'])
  })

  it('applies search and status together', () => {
    const result = filterSites(records, { search: 'norway', status: 'attention' })

    expect(result.map((site) => site.id)).toEqual(['NO-2'])
  })

  it('returns no sites when the combined filters exclude everything', () => {
    const result = filterSites(records, { search: 'norway', status: 'maintenance' })

    expect(result).toEqual([])
  })

  it('does not mutate the original list', () => {
    const original = [...records]
    filterSites(records, { search: 'norway', status: 'all' })

    expect(records).toEqual(original)
  })
})
