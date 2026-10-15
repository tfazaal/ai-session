import { describe, expect, it } from 'vitest'
import { activities } from '../data/activities.ts'
import { getRecentActivities } from './activities.ts'

describe('getRecentActivities', () => {
  it('returns the newest events first', () => {
    const recent = getRecentActivities(activities, 3)
    expect(recent).toHaveLength(3)
    expect(recent[0].timestamp >= recent[1].timestamp).toBe(true)
  })

  it('associates each event with a site id present in records', () => {
    for (const event of activities) {
      expect(event.siteId).toMatch(/^[A-Z]{2}-\d{4}$/)
    }
  })
})
