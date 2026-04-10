import React, { useState } from 'react'
import { INSPECTIONS, SEVERITY_CONFIG } from '../data/mock'
import { SeverityBadge, Table, Panel } from '../components/UI'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { X, Layers, Droplets, MapPin, FileText } from 'lucide-react'

const SEVERITY_ORDER = { critical: 0, moderate: 1, low: 2 }

export default function Inspecciones() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = INSPECTIONS
    .filter(i => filter === 'all' || i.severity === filter)
    .filter(i => !search || i.id.toLowerCase().includes(search.toLowerCase()) || i.zone.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.timestamp - a.timestamp)

  const cols = [
    { key: 'id', label: 'ID', mono: true, render: v => <span style={{ color: 'var(--text-muted)' }}>{v}</span> },
    { key: 'zone', label: 'Zona', render: v => <span style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}>{v}</span> },
    { key: 'severity', label: 'Severidad', render: v => <SeverityBadge severity={v} /> },
    { key: 'confidence', label: 'Confianza', align: 'right', render: v => `${v}%` },
    { key: 'rustArea', label: 'Área oxid.', align: 'right', render: v => `${v} cm²` },
    { key: 'thickness', label: 'Espesor', align: 'right', render: v => `${v} mm` },
    { key: 'timestamp', label: 'Fecha', render: v => format(v, 'dd/MM/yy HH:mm') },
  ]

  return (
    <div style={{ padding: 20, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por ID o zona..."
          style={{
            background: 'var(--bg-raised)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '7px 12px',
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
            width: 240,
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'Todos'], ['critical', 'Crítico'], ['moderate', 'Moderado'], ['low', 'Leve']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                border: '0.5px solid',
                borderColor: filter === val ? 'var(--accent)' : 'var(--border)',
                background: filter === val ? 'var(--bg-active)' : 'var(--bg-raised)',
                color: filter === val ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} resultados</span>
      </div>

      {/* Table */}
      <Panel style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <Table columns={cols} rows={filtered} onRowClick={setSelected} />
        </div>
      </Panel>

      {/* Detail drawer */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', justifyContent: 'flex-end',
          background: 'rgba(0,0,0,0.5)',
        }} onClick={() => setSelected(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 440,
              background: 'var(--bg-surface)',
              borderLeft: '0.5px solid var(--border)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Zona {selected.zone}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{selected.id}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SeverityBadge severity={selected.severity} size="md" />
                <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)', padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Image */}
            <img src={selected.image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />

            {/* Metrics grid */}
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: <Droplets size={14} />, label: 'Área oxidada', value: `${selected.rustArea} cm²` },
                { icon: <Layers size={14} />, label: 'Espesor', value: `${selected.thickness} mm` },
                { icon: <FileText size={14} />, label: 'Confianza', value: `${selected.confidence}%` },
                { icon: <MapPin size={14} />, label: 'Coordenadas', value: `${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`, mono: true },
              ].map(({ icon, label, value, mono }) => (
                <div key={label} style={{
                  background: 'var(--bg-raised)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 5 }}>
                    {icon}
                    <span style={{ fontSize: 11 }}>{label}</span>
                  </div>
                  <div style={{ fontSize: mono ? 11 : 15, fontWeight: 600, fontFamily: mono ? 'var(--mono)' : 'inherit' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>NOTAS</div>
              <div style={{
                background: 'var(--bg-raised)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {selected.notes}
              </div>
            </div>

            {/* Timestamp */}
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>FECHA DE CAPTURA</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-secondary)' }}>
                {format(selected.timestamp, "dd 'de' MMMM yyyy 'a las' HH:mm:ss", { locale: es })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
