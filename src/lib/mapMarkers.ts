import L from 'leaflet'
import type { SiteStatus } from '../types/site.ts'

/** Marker colors aligned with dashboard status indicators. */
export const STATUS_MARKER_COLORS: Record<SiteStatus, string> = {
  operational: '#3fb950',
  attention: '#d29922',
  maintenance: '#58a6ff',
}

export function createStatusMarkerIcon(status: SiteStatus, selected = false): L.DivIcon {
  const color = STATUS_MARKER_COLORS[status]
  const size = selected ? 18 : 14
  const ring = selected ? `box-shadow: 0 0 0 3px rgba(255,255,255,0.9), 0 0 0 5px ${color};` : ''

  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:999px;background:${color};border:2px solid #0d1117;${ring}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
