import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import type { FarmSite } from '../../types/site.ts'
import { getMapPosition, hasValidCoordinates } from '../../lib/coordinates.ts'
import { formatCageCount, formatDateTime } from '../../lib/format.ts'
import { createStatusMarkerIcon } from '../../lib/mapMarkers.ts'
import { STATUS_LABELS } from '../../lib/status.ts'
import styles from './SiteMap.module.css'

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function MapBounds({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 7)
      return
    }
    const bounds: LatLngBoundsExpression = positions
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 8 })
  }, [map, positions])

  return null
}

function MapSelectionSync({
  selectedId,
  sites,
}: {
  selectedId: string | null
  sites: readonly FarmSite[]
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedId) return
    const site = sites.find((s) => s.id === selectedId)
    const pos = site ? getMapPosition(site) : null
    if (!pos) return
    map.panTo([pos.latitude, pos.longitude], { animate: true })
  }, [map, selectedId, sites])

  return null
}

function SiteMarker({
  site,
  selected,
  onSelect,
}: {
  site: FarmSite
  selected: boolean
  onSelect: (id: string) => void
}) {
  const markerRef = useRef<LeafletMarker>(null)
  const pos = getMapPosition(site)!

  useEffect(() => {
    if (selected) markerRef.current?.openPopup()
  }, [selected])

  return (
    <Marker
      ref={markerRef}
      position={[pos.latitude, pos.longitude]}
      icon={createStatusMarkerIcon(site.status, selected)}
      eventHandlers={{
        click: () => onSelect(site.id),
      }}
    >
      <Popup>
        <p className={styles.popupTitle}>{site.name}</p>
        <p className={styles.popupMeta}>
          {site.region}, {site.country}
          <br />
          {STATUS_LABELS[site.status]}
          <br />
          {formatCageCount(site.totalCages)}
          <br />
          Updated {formatDateTime(site.updatedAt)}
        </p>
      </Popup>
    </Marker>
  )
}

export function SiteMap({
  sites,
  selectedId,
  onSelect,
}: {
  sites: readonly FarmSite[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const mappable = useMemo(() => sites.filter(hasValidCoordinates), [sites])
  const positions = useMemo(
    () => mappable.map((s) => [s.coordinates!.latitude, s.coordinates!.longitude] as LatLngTuple),
    [mappable],
  )
  const hiddenCount = sites.length - mappable.length
  const defaultCenter: LatLngTuple = positions[0] ?? [62, 10]

  return (
    <div className={styles.wrap}>
      {hiddenCount > 0 ? (
        <p className={styles.notice} role="status">
          {hiddenCount} filtered {hiddenCount === 1 ? 'site is' : 'sites are'} not shown on the map
          (missing or invalid coordinates).
        </p>
      ) : null}
      <MapContainer
        className={styles.map}
        center={defaultCenter}
        zoom={4}
        scrollWheelZoom={false}
        aria-label="Farm site map"
      >
        <TileLayer
          attribution={OSM_ATTRIBUTION}
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds positions={positions} />
        <MapSelectionSync selectedId={selectedId} sites={mappable} />
        {mappable.map((site) => (
          <SiteMarker
            key={site.id}
            site={site}
            selected={site.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
      <p className={styles.attribution}>
        Map tiles: OpenStreetMap (prototype use only — not for high-volume production traffic).
      </p>
    </div>
  )
}
