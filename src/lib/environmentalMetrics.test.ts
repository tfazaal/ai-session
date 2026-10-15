import { describe, expect, it } from 'vitest'
import { calculateEnvironmentalOverview } from './environmentalMetrics.ts'
import { SIMULATION_SNAPSHOT_AT } from '../data/sites.ts'
import type { FarmSite } from '../types/site.ts'

const ref = new Date(SIMULATION_SNAPSHOT_AT)

const withEnv = (overrides: Partial<FarmSite>): FarmSite => ({
  id: 'T',
  name: 'T',
  country: 'Norway',
  region: 'R',
  manager: 'M',
  totalCages: 2,
  activeCages: 2,
  status: 'operational',
  updatedAt: '2026-10-01T00:00:00Z',
  lastInspectionOn: '2026-10-01',
  nextInspectionOn: '2026-10-12',
  environmental: {
    source: 'simulated',
    waterTemperatureC: 10,
    oxygenMgL: 8,
    measuredAt: '2026-10-13T07:00:00Z',
  },
  ...overrides,
})

describe('calculateEnvironmentalOverview', () => {
  it('averages simulated readings from sites that have them', () => {
    const metrics = calculateEnvironmentalOverview(
      [
        withEnv({
          environmental: {
            source: 'simulated',
            waterTemperatureC: 10,
            oxygenMgL: 8,
            measuredAt: '2026-10-13T07:00:00Z',
          },
        }),
        withEnv({
          environmental: {
            source: 'simulated',
            waterTemperatureC: 12,
            oxygenMgL: 6,
            measuredAt: '2026-10-13T07:00:00Z',
          },
        }),
        withEnv({ environmental: undefined }),
      ],
      ref,
    )

    expect(metrics.averageWaterTemperatureC).toBe(11)
    expect(metrics.averageOxygenMgL).toBe(7)
    expect(metrics.sitesWithReadings).toBe(2)
  })

  it('counts overdue inspections and stale readings using the reference date', () => {
    const metrics = calculateEnvironmentalOverview(
      [
        withEnv({ nextInspectionOn: '2026-10-10' }),
        withEnv({
          nextInspectionOn: '2026-10-20',
          environmental: {
            source: 'simulated',
            waterTemperatureC: 9,
            oxygenMgL: 8,
            measuredAt: '2026-10-10T12:00:00Z',
          },
        }),
      ],
      ref,
    )

    expect(metrics.overdueInspections).toBe(1)
    expect(metrics.staleReadings).toBe(1)
  })

  it('returns null averages when no readings exist', () => {
    const metrics = calculateEnvironmentalOverview([withEnv({ environmental: undefined })], ref)
    expect(metrics.averageWaterTemperatureC).toBeNull()
    expect(metrics.averageOxygenMgL).toBeNull()
  })
})
