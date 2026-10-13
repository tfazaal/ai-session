import type { FarmSite } from '../types/site.ts'

export type DashboardMetrics = {
  total: number
  operational: number
  attention: number
  maintenance: number
}

export function calculateMetrics(sites: readonly FarmSite[]): DashboardMetrics {
  const metrics: DashboardMetrics = {
    total: sites.length,
    operational: 0,
    attention: 0,
    maintenance: 0,
  }

  for (const site of sites) {
    metrics[site.status] += 1
  }

  return metrics
}
