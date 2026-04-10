import React, { useState, useEffect } from 'react'
import { LIVE_FRAMES, SEVERITY_CONFIG } from '../data/mock'
import { SeverityBadge, Panel } from '../components/UI'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Wifi, Camera } from 'lucide-react'

export default function Live() {
  const [frames, setFrames] = useState(LIVE_FRAMES)
  const [selected, setSelected] = useState(frames[0])
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ padding: 20, display: 'flex', gap: 16, height: '100%', overflow: 'hidden' }}>

      {/* Main viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <Panel style={{ flex: 1 }}>
          <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Camera size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                Zona {selected.zone} — Cámara principal
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
              color: 'var(--success)',
              background: 'var(--success-bg)',
              border: '0.5px solid var(--success-border)',
              borderRadius: 20, padding: '3px 9px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: 'var(--success)',
                animation: pulse ? 'none' : undefined,
                opacity: pulse ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }} />
              EN VIVO
            </div>
          </div>

          {/* Image viewer */}
          <div style={{ padding: '0 16px', position: 'relative' }}>
            <div style={{
              background: 'var(--bg-base)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/9',
            }}>
              <img
                src={selected.image}
                alt={`Frame zona ${selected.zone}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Overlay HUD */}
              <div style={{
                position: 'absolute', top: 10, left: 10, right: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div style={{
                  background: 'rgba(9,9,11,0.8)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--mono)',
                  backdropFilter: 'blur(4px)',
                }}>
                  {format(selected.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                </div>
                <div style={{
                  background: 'rgba(9,9,11,0.8)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--mono)',
                  backdropFilter: 'blur(4px)',
                }}>
                  {selected.detections} detección{selected.detections !== 1 ? 'es' : ''}
                </div>
              </div>
              {/* Simulated bounding boxes */}
              <div style={{
                position: 'absolute', top: '28%', left: '20%',
                width: '22%', height: '25%',
                border: `2px solid ${SEVERITY_CONFIG[selected.severity]?.color}`,
                borderRadius: 3,
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: -20, left: 0,
                  background: SEVERITY_CONFIG[selected.severity]?.bg,
                  border: `0.5px solid ${SEVERITY_CONFIG[selected.severity]?.border}`,
                  color: SEVERITY_CONFIG[selected.severity]?.color,
                  fontSize: 10, padding: '2px 5px', borderRadius: 3,
                  fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
                }}>
                  {SEVERITY_CONFIG[selected.severity]?.label} {selected.confidence}%
                </div>
              </div>
              {selected.detections > 1 && (
                <div style={{
                  position: 'absolute', top: '55%', right: '25%',
                  width: '16%', height: '18%',
                  border: '2px solid var(--warning)',
                  borderRadius: 3,
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: -20, left: 0,
                    background: 'var(--warning-bg)',
                    border: '0.5px solid var(--warning-border)',
                    color: 'var(--warning)',
                    fontSize: 10, padding: '2px 5px', borderRadius: 3,
                    fontFamily: 'var(--mono)',
                  }}>
                    Moderado 68%
                  </div>
                </div>
              )}
              {/* Bottom info bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(9,9,11,0.85))',
                padding: '20px 12px 10px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Wifi size={12} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>
                  Raspberry Pi 4 · LTE 87% · YOLOv8 edge
                </span>
              </div>
            </div>
          </div>

          {/* Metadata strip */}
          <div style={{
            padding: '12px 16px 14px',
            display: 'flex', gap: 24,
          }}>
            {[
              { label: 'Zona', value: selected.zone },
              { label: 'Severidad', value: <SeverityBadge severity={selected.severity} /> },
              { label: 'Confianza', value: `${selected.confidence}%` },
              { label: 'Detecciones', value: selected.detections },
              { label: 'Captura', value: format(selected.timestamp, 'HH:mm:ss') },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Frame strip sidebar */}
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
          CAPTURAS RECIENTES
        </div>
        {frames.map(f => {
          const active = f.id === selected.id
          return (
            <div
              key={f.id}
              onClick={() => setSelected(f)}
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                border: `0.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={f.image}
                  alt=""
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', top: 5, right: 5,
                }}>
                  <SeverityBadge severity={f.severity} />
                </div>
              </div>
              <div style={{ padding: '7px 9px', background: active ? 'var(--bg-active)' : 'var(--bg-raised)' }}>
                <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 2 }}>Zona {f.zone}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                  {format(f.timestamp, 'HH:mm:ss')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
