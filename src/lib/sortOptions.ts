import type { SiteSort } from '../types/site.ts'

export const SITE_SORT_OPTIONS: { value: SiteSort; label: string }[] = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'cages-desc', label: 'Cages (high to low)' },
  { value: 'cages-asc', label: 'Cages (low to high)' },
  { value: 'updated-desc', label: 'Updated (newest)' },
  { value: 'updated-asc', label: 'Updated (oldest)' },
]
