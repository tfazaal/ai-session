import { describe, expect, it } from 'vitest'
import { sites } from './sites.ts'
import { calculateMetrics } from '../lib/metrics.ts'
import { hasValidCoordinates } from '../lib/coordinates.ts'

describe('site records', () => {
  it('provides enough unique sites to exercise search and every status', () => {
    const ids = sites.map((site) => site.id)
    const metrics = calculateMetrics(sites)

    expect(sites.length).toBeGreaterThanOrEqual(12)
    expect(new Set(ids).size).toBe(sites.length)
    expect(metrics).toEqual({
      total: 16,
      operational: 9,
      attention: 4,
      maintenance: 3,
    })
    expect(metrics.operational).toBe(sites.filter((site) => site.status === 'operational').length)
    expect(sites.some((site) => site.description == null)).toBe(true)
    expect(sites.some((site) => site.totalCages === 1)).toBe(true)
    expect(sites.some((site) => !hasValidCoordinates(site))).toBe(true)
    expect(sites.every((site) => site.environmental?.source === 'simulated' || !site.environmental)).toBe(
      true,
    )
  })

  it('stores region, country, and timestamps on every site', () => {
    for (const site of sites) {
      expect(site.name.trim().length).toBeGreaterThan(0)
      expect(site.country.trim().length).toBeGreaterThan(0)
      expect(site.region.trim().length).toBeGreaterThan(0)
      expect(site.totalCages).toBeGreaterThan(0)
      expect(site.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(site.lastInspectionOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(site.nextInspectionOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
