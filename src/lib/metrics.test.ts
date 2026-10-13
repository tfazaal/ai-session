import { describe, expect, it } from 'vitest'
import { calculateMetrics } from './metrics.ts'
import type { FarmSite } from '../types/site.ts'

function site(overrides: Partial<FarmSite> & Pick<FarmSite, 'id' | 'status'>): FarmSite {
  return {
    name: overrides.id,
    location: 'Nordland, Norway',
    cages: 2,
    updatedOn: '2026-10-01',
    ...overrides,
  }
}

describe('calculateMetrics', () => {
  it('counts each status from the site records', () => {
    const metrics = calculateMetrics([
      site({ id: 'a', status: 'operational' }),
      site({ id: 'b', status: 'operational' }),
      site({ id: 'c', status: 'attention' }),
      site({ id: 'd', status: 'maintenance' }),
      site({ id: 'e', status: 'maintenance' }),
      site({ id: 'f', status: 'maintenance' }),
    ])

    expect(metrics).toEqual({
      total: 6,
      operational: 2,
      attention: 1,
      maintenance: 3,
    })
  })

  it('returns zeros when there are no sites', () => {
    expect(calculateMetrics([])).toEqual({
      total: 0,
      operational: 0,
      attention: 0,
      maintenance: 0,
    })
  })

  it('keeps the total equal to the sum of the status counts', () => {
    const records = [
      site({ id: 'a', status: 'attention' }),
      site({ id: 'b', status: 'operational' }),
    ]
    const metrics = calculateMetrics(records)

    expect(metrics.total).toBe(records.length)
    expect(metrics.operational + metrics.attention + metrics.maintenance).toBe(metrics.total)
  })
})
