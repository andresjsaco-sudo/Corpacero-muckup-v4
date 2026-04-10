import React, { useState } from 'react'
import { REPORTS, SEVERITY_CONFIG } from '../data/mock'
import { Panel, SeverityBadge } from '../components/UI'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileText, Download, Eye, AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

function StatusBadge({ status }) {
  if (status === 'processing') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, color: 'var(--warning)',
      background: 'var(--warning-bg)', border: '0.5px solid var(--warning-border)',
      borderRadius: 20, padding: '2px 8px',
    }}>
      <Clock size={10} /> Procesando
    </span>
  )
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, color: 'var(--success)',
      background: 'var(--success-bg)', border: '0.5px solid var(--success-border)',
      borderRadius: 20, padding: '2px 8px',
    }}>
      <CheckCircle size={10} /> Completo
    </span>
  )
}

export default function Reportes() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ padding: 20, display: 'flex', gap: 16, height: '100%', overflow: 'hidden' }}>

      {/* Report list */}
      <Panel style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px 0', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Reportes de inspección</span>
          <button style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            border: '0.5px solid var(--accent)',
            background: 'var(--bg-active)',
            color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <FileText size={13} />
            Generar reporte
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 16px' }}>
          {REPORTS.map((rpt, i) => {
            const isSelected = selected?.id === rpt.id
            return (
              <div
                key={rpt.id}
                onClick={() => setSelected(isSelected ? null : rpt)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `0.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--bg-active)' : 'var(--bg-raised)',
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'var(--bg-raised)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{rpt.title}</div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{rpt.id}</div>
                  </div>
                  <StatusBadge status={rpt.status} />
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{format(rpt.date, "dd 'de' MMM yyyy", { locale: es })}</span>
                  <span>{rpt.zones} zonas</span>
                  <span style={{ color: rpt.criticals > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {rpt.criticals} críticos
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{rpt.inspector}</span>
                </div>

                {isSelected && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
                    <button style={{
                      flex: 1, padding: '7px', borderRadius: 'var(--radius-md)',
                      border: '0.5px solid var(--border)',
                      background: 'var(--bg-surface)',
                      fontSize: 12, color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Eye size={13} /> Ver detalle
                    </button>
                    <button style={{
                      flex: 1, padding: '7px', borderRadius: 'var(--radius-md)',
                      border: '0.5px solid var(--border)',
                      background: 'var(--bg-surface)',
                      fontSize: 12, color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Download size={13} /> Exportar PDF
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      {/* Summary stats */}
      <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        <Panel title="Resumen general">
          {[
            { label: 'Total reportes', value: REPORTS.length },
            { label: 'Completados', value: REPORTS.filter(r => r.status === 'complete').length },
            { label: 'Zonas inspeccionadas', value: REPORTS.reduce((a, r) => a + r.zones, 0) },
            { label: 'Total críticos', value: REPORTS.reduce((a, r) => a + r.criticals, 0) },
            { label: 'Total moderados', value: REPORTS.reduce((a, r) => a + r.moderates, 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '0.5px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </Panel>

        <Panel title="Por inspector">
          {[...new Set(REPORTS.map(r => r.inspector))].map(name => {
            const count = REPORTS.filter(r => r.inspector === name).length
            const initials = name.split('.').map(s => s.trim()[0]).join('')
            return (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '0.5px solid var(--border)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--bg-active)',
                  border: '0.5px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, color: 'var(--accent)', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: 12, flex: 1 }}>{name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count}</span>
              </div>
            )
          })}
        </Panel>
      </div>
    </div>
  )
}
