'use client'

import { useEffect, useRef, useState } from 'react'
import type { Event } from '@/lib/types'
import { getEventColor } from '@/lib/utils'

interface EventMapProps {
  events: Event[]
  selectedEventId?: string
  onEventSelect: (event: Event) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const DEFAULT_CENTER = { lng: 10, lat: 50, zoom: 4 }

export default function EventMap({ events, selectedEventId, onEventSelect }: EventMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialise map once
  useEffect(() => {
    if (!MAPBOX_TOKEN) return
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    let cancelled = false

    import('mapbox-gl').then((mapboxgl) => {
      if (cancelled || !mapContainerRef.current) return

      // Set token inside useEffect — never at module level
      mapboxgl.default.accessToken = MAPBOX_TOKEN

      const map = new mapboxgl.default.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
        zoom: DEFAULT_CENTER.zoom,
        attributionControl: false,
      })

      map.addControl(new mapboxgl.default.AttributionControl({ compact: true }), 'bottom-left')
      map.addControl(new mapboxgl.default.NavigationControl({ showCompass: false }), 'top-right')

      map.on('load', () => {
        if (!cancelled) setMapLoaded(true)
      })

      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
      setMapLoaded(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers whenever events or selection changes (after map load)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    import('mapbox-gl').then((mapboxgl) => {
      const map = mapRef.current
      if (!map) return

      const existingIds = new Set(markersRef.current.keys())
      const incomingIds = new Set(events.map((e) => e.id))

      // Remove stale markers
      existingIds.forEach((id) => {
        if (!incomingIds.has(id)) {
          markersRef.current.get(id)?.remove()
          markersRef.current.delete(id)
        }
      })

      events.forEach((event) => {
        const isSelected = event.id === selectedEventId
        const color = getEventColor(event.type)

        if (markersRef.current.has(event.id)) {
          // Update existing marker's element for selection state
          const marker = markersRef.current.get(event.id)
          if (marker) applyPinStyle(marker.getElement(), color, isSelected)
          return
        }

        // Create pin element
        const el = createPinElement(color, isSelected)
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onEventSelect(event)
        })

        const marker = new mapboxgl.default.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([event.lng, event.lat])
          .addTo(map)

        markersRef.current.set(event.id, marker)
      })
    })
  }, [mapLoaded, events, selectedEventId, onEventSelect])

  // Fly to selected event
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedEventId) return

    const event = events.find((e) => e.id === selectedEventId)
    if (!event) return

    mapRef.current.flyTo({
      center: [event.lng, event.lat],
      zoom: Math.max(mapRef.current.getZoom(), 8),
      duration: 1200,
      essential: true,
    })
  }, [mapLoaded, selectedEventId, events])

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ background: '#06232c' }}
      >
        <div className="text-center">
          <div className="mb-2 text-4xl">🗺️</div>
          <p className="text-sm font-medium text-white/60">Map unavailable</p>
          <p className="mt-1 text-xs text-white/40">
            Set <code className="rounded bg-white/10 px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the map.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full" style={{ background: '#06232c' }}>
      <div ref={mapContainerRef} className="h-full w-full" />
      {!mapLoaded && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ background: '#06232c' }}
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createPinElement(color: string, isSelected: boolean): HTMLElement {
  const el = document.createElement('div')
  el.className = 'event-pin'
  applyPinStyle(el, color, isSelected)
  return el
}

function applyPinStyle(el: HTMLElement, color: string, isSelected: boolean): void {
  const size = isSelected ? 20 : 14
  const ringSize = isSelected ? 32 : 22

  el.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background-color: ${color};
    border: 2px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.45)'};
    cursor: pointer;
    transition: width 0.15s ease, height 0.15s ease, border-color 0.15s ease;
    box-shadow: 0 0 0 ${isSelected ? '5px' : '3px'} ${color}55,
                0 2px 8px rgba(0,0,0,0.55);
    position: relative;
    z-index: ${isSelected ? 2 : 1};
  `

  // Outer pulse ring for selected state
  let ring = el.querySelector<HTMLElement>('.pin-ring')
  if (isSelected) {
    if (!ring) {
      ring = document.createElement('div')
      ring.className = 'pin-ring'
      el.appendChild(ring)
    }
    ring.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${ringSize}px;
      height: ${ringSize}px;
      border-radius: 50%;
      border: 2px solid ${color};
      opacity: 0.5;
      animation: pin-pulse 1.6s ease-out infinite;
      pointer-events: none;
    `
    // Inject keyframes once
    if (!document.getElementById('pin-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'pin-pulse-style'
      style.textContent = `
        @keyframes pin-pulse {
          0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
          70%  { transform: translate(-50%, -50%) scale(1.6); opacity: 0;   }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0;   }
        }
      `
      document.head.appendChild(style)
    }
  } else if (ring) {
    ring.remove()
  }
}
