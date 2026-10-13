import type { FarmSite } from '../types/site.ts'

/** Fictional prototype thresholds — not universal aquaculture limits. */
export const STALE_READING_HOURS = 36

export type EnvironmentalOverview = {
  averageWaterTemperatureC: number | null
  averageOxygenMgL: number | null
  sitesWithReadings: number
  overdueInspections: number
  staleReadings: number
}

function isInspectionOverdue(site: FarmSite, referenceDate: Date): boolean {
  const next = new Date(`${site.nextInspectionOn}T23:59:59Z`)
  return next.getTime() < referenceDate.getTime()
}

function isReadingStale(measuredAt: string, referenceDate: Date): boolean {
  const measured = new Date(measuredAt).getTime()
  const ageHours = (referenceDate.getTime() - measured) / (1000 * 60 * 60)
  return ageHours > STALE_READING_HOURS
}

export function calculateEnvironmentalOverview(
  sites: readonly FarmSite[],
  referenceDate: Date = new Date(),
): EnvironmentalOverview {
  let tempSum = 0
  let oxySum = 0
  let readingCount = 0
  let overdueInspections = 0
  let staleReadings = 0

  for (const site of sites) {
    if (isInspectionOverdue(site, referenceDate)) overdueInspections += 1

    const env = site.environmental
    if (!env) continue

    tempSum += env.waterTemperatureC
    oxySum += env.oxygenMgL
    readingCount += 1

    if (isReadingStale(env.measuredAt, referenceDate)) staleReadings += 1
  }

  return {
    averageWaterTemperatureC:
      readingCount > 0 ? Math.round((tempSum / readingCount) * 10) / 10 : null,
    averageOxygenMgL: readingCount > 0 ? Math.round((oxySum / readingCount) * 10) / 10 : null,
    sitesWithReadings: readingCount,
    overdueInspections,
    staleReadings,
  }
}
