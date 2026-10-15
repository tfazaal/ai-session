import type { Coordinates, FarmSite } from '../types/site.ts'

export function hasValidCoordinates(site: FarmSite): boolean {
  const c = site.coordinates
  if (!c) return false
  if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) return false
  if (c.latitude < -90 || c.latitude > 90) return false
  if (c.longitude < -180 || c.longitude > 180) return false
  return true
}

export function getMapPosition(site: FarmSite): Coordinates | null {
  return hasValidCoordinates(site) ? site.coordinates! : null
}

export function formatCoordinates(coords: Coordinates): string {
  const lat = coords.latitude.toFixed(4)
  const lng = coords.longitude.toFixed(4)
  const latHem = coords.latitude >= 0 ? 'N' : 'S'
  const lngHem = coords.longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(Number(lat))}°${latHem}, ${Math.abs(Number(lng))}°${lngHem}`
}
