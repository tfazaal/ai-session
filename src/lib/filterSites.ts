import type { FarmSite, SiteSort, StatusFilter } from '../types/site.ts'

export type SiteQuery = {
  search: string
  status: StatusFilter
  country: string
  sort: SiteSort
}

export function getSiteCountries(sites: readonly FarmSite[]): string[] {
  const set = new Set(sites.map((s) => s.country))
  return [...set].sort((a, b) => a.localeCompare(b, 'en'))
}

function compareSites(a: FarmSite, b: FarmSite, sort: SiteSort): number {
  switch (sort) {
    case 'name-asc':
      return a.name.localeCompare(b.name, 'en')
    case 'name-desc':
      return b.name.localeCompare(a.name, 'en')
    case 'cages-desc':
      return b.totalCages - a.totalCages
    case 'cages-asc':
      return a.totalCages - b.totalCages
    case 'updated-desc':
      return b.updatedAt.localeCompare(a.updatedAt)
    case 'updated-asc':
      return a.updatedAt.localeCompare(b.updatedAt)
    default:
      return 0
  }
}

export function filterSites(sites: readonly FarmSite[], query: SiteQuery): FarmSite[] {
  const search = query.search.trim().toLowerCase()

  return sites
    .filter((site) => {
      const matchesStatus = query.status === 'all' || site.status === query.status
      if (!matchesStatus) return false
      if (query.country && site.country !== query.country) return false
      if (!search) return true

      const haystack =
        `${site.name} ${site.region} ${site.country} ${site.id} ${site.manager}`.toLowerCase()
      return haystack.includes(search)
    })
    .slice()
    .sort((a, b) => compareSites(a, b, query.sort))
}
