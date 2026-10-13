import { describe, expect, it } from 'vitest'
import { formatCoordinates, getMapPosition, hasValidCoordinates } from './coordinates.ts'
import type { FarmSite } from '../types/site.ts'

const base: FarmSite = {
  id: 'X',
  name: 'Test',
  country: 'Norway',
  region: 'Test',
  manager: 'M',
  totalCages: 1,
  activeCages: 1,
  status: 'operational',
  updatedAt: '2026-10-01T00:00:00Z',
  lastInspectionOn: '2026-10-01',
  nextInspectionOn: '2026-11-01',
}

describe('coordinates', () => {
  it('accepts valid coordinates', () => {
    const site = { ...base, coordinates: { latitude: 62.1, longitude: -7.1 } }
    expect(hasValidCoordinates(site)).toBe(true)
    expect(getMapPosition(site)).toEqual({ latitude: 62.1, longitude: -7.1 })
    expect(formatCoordinates(site.coordinates!)).toBe('62.1°N, 7.1°W')
  })

  it('rejects missing or out-of-range coordinates', () => {
    expect(hasValidCoordinates(base)).toBe(false)
    expect(getMapPosition(base)).toBeNull()
    expect(
      hasValidCoordinates({ ...base, coordinates: { latitude: 91, longitude: 0 } }),
    ).toBe(false)
  })
})
