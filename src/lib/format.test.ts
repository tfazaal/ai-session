import { describe, expect, it } from 'vitest'
import { formatCageCount, formatSiteCount, formatUpdatedDate } from './format.ts'

describe('formatters', () => {
  it('formats calendar dates without shifting the day', () => {
    expect(formatUpdatedDate('2026-10-11')).toBe('11 Oct 2026')
    expect(formatUpdatedDate('not-a-date')).toBe('not-a-date')
  })

  it('pluralizes cage and site counts', () => {
    expect(formatCageCount(1)).toBe('1 cage')
    expect(formatCageCount(12)).toBe('12 cages')
    expect(formatSiteCount(1)).toBe('1 site')
    expect(formatSiteCount(0)).toBe('0 sites')
  })
})
