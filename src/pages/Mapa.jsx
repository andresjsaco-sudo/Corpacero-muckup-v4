import React, { useEffect, useRef, useState } from 'react'
import { ZONES, SEVERITY_CONFIG } from '../data/mock'
import { SeverityBadge } from '../components/UI'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Mapa() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

    import('leaflet').then(L => {
      const map = L.map(mapRef.current, {
        center: [10.988, -74.790],
        zoom: 16,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      ZONES.forEach(zone => {
        const cfg = SEVERITY_CONFIG[zone.severity]
        const marker = L.circleMarker([zone.lat, zone.lng], {
          radius: zone.severity === 'critical' ? 12 : zone.severity === 'moderate' ? 9 : 7,
          fillColor: cfg.color,
          color: cfg.color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.35,
        }).addTo(map)

        marker.on('click', () => setSelected(zone))

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            font-family: IBM Plex Mono, monospace;
            font-size: 10px;
            font-weight: 600;
            color: ${cfg.color};
            background: rgba(9,9,11,0.85);
            border: 0.5px solid ${cfg.border};
            border-radius: 4px;
            padding: 2px 5px;
            white-space: nowrap;
            transform: translateY(-24px);
          ">${zone.id}</div>`,
          iconAnchor: [0, 0],
        })
        L.marker([zone.lat, zone.lng], { icon, interactive: false }).addTo(map)
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Legend overlay */}
        <div style={{
          position: 'absolute', bottom: 20, left: 20, zIndex: 999,
          background: 'rgba(9,9,11,0.9)',
          border: '0.5px solid var(--border-md)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: 8 }}>SEVERIDAD</div>
          {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Stats overlay */}
        <div style={{
          position: 'absolute', top: 20, right: 20, zIndex: 999,
          background: 'rgba(9,9,11,0.9)',
          border: '0.5px solid var(--border-md)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          gap: 20,
        }}>
          {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => {
            const count = ZONES.filter(z => z.severity === key).length
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: cfg.color }}>{count}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{cfg.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{
        width: 280,
        background: 'var(--bg-surface)',
        borderLeft: '0.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
          ZONAS MONITOREADAS
        </div>

        {ZONES.sort((a, b) => {
          const order = { critical: 0, moderate: 1, low: 2 }
          return order[a.severity] - order[b.severity]
        }).map(zone => {
          const cfg = SEVERITY_CONFIG[zone.severity]
          const isSelected = selected?.id === zone.id
          return (
            <div
              key={zone.id}
              onClick={() => {
                setSelected(isSelected ? null : zone)
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([zone.lat, zone.lng], 17, { duration: 0.8 })
                }
              }}
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                cursor: 'pointer',
                background: isSelected ? 'var(--bg-active)' : 'transparent',
                borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>{zone.id}</span>
                </div>
                <SeverityBadge severity={zone.severity} />
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Conf. {zone.confidence}%</span>
                <span>{formatDistanceToNow(zone.last, { locale: es, addSuffix: true })}</span>
              </div>
              {isSelected && (
                <div style={{ marginTop: 8, padding: '8px', background: 'var(--bg-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>COORDENADAS</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-secondary)' }}>
                    {zone.lat.toFixed(5)}, {zone.lng.toFixed(5)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
