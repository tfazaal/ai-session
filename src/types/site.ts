export const SITE_STATUSES = ['operational', 'attention', 'maintenance'] as const

export type SiteStatus = (typeof SITE_STATUSES)[number]

export type StatusFilter = 'all' | SiteStatus

export const SITE_SORTS = [
  'name-asc',
  'name-desc',
  'cages-desc',
  'cages-asc',
  'updated-desc',
  'updated-asc',
] as const

export type SiteSort = (typeof SITE_SORTS)[number]

export type Coordinates = {
  latitude: number
  longitude: number
}

export type EnvironmentalMeasurement = {
  source: 'simulated'
  waterTemperatureC: number
  oxygenMgL: number
  measuredAt: string
}

export type FarmSite = {
  id: string
  name: string
  country: string
  region: string
  coordinates?: Coordinates
  manager: string
  totalCages: number
  activeCages: number
  status: SiteStatus
  updatedAt: string
  lastInspectionOn: string
  nextInspectionOn: string
  fishPopulation?: number
  averageFishWeightKg?: number
  environmental?: EnvironmentalMeasurement
  description?: string
}
