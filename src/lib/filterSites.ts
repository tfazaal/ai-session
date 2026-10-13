import type { FarmSite, StatusFilter } from '../types/site.ts'

export type SiteQuery = {
  search: string
  status: StatusFilter
}

export function filterSites(sites: readonly FarmSite[], query: SiteQuery): FarmSite[] {
  const search = query.search.trim().toLowerCase()

  return sites
    .filter((site) => {
      const matchesStatus = query.status === 'all' || site.status === query.status
      if (!matchesStatus) return false
      if (!search) return true

      const haystack = `${site.name} ${site.location}`.toLowerCase()
      return haystack.includes(search)
    })
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
}
