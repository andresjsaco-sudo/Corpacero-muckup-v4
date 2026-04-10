import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { HISTORY_EVENTS, DAILY_DATA, SEVERITY_CONFIG } from '../data/mock'
import { SeverityBadge, Panel } from '../components/UI'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle, Settings, FileText, Activity } from 'lucide-react'

const TYPE_CONFIG = {
  detection: { label: 'Detección', icon: Activity, color: 'var(--accent)' },
  system: { label: 'Sistema', icon: Settings, color: 'var(--text-muted)' },
  report: { label: 'Reporte', icon: FileText, color: 'var(--success)' },
  maintenance: { label: 'Mantenimiento', icon: AlertTriangle, color: 'var(--warning)' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '0.5px solid var(--border-md)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 12px',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function Historial() {
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = HISTORY_EVENTS.filter(e => typeFilter === 'all' || e.type === typeFilter)

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>

      {/* Trend chart */}
      <Panel title="Tendencia de detecciones — últimos 30 días">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={DAILY_DATA}>
            <defs>
              <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="modGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0C5CAB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0C5CAB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} interval={4} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-md)' }} />
            <Area type="monotone" dataKey="low" name="Leve" stroke="#0C5CAB" strokeWidth={1.5} fill="url(#lowGrad)" dot={false} />
            <Area type="monotone" dataKey="moderate" name="Moderado" stroke="#f59e0b" strokeWidth={1.5} fill="url(#modGrad)" dot={false} />
            <Area type="monotone" dataKey="critical" name="Crítico" stroke="#ef4444" strokeWidth={1.5} fill="url(#critGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Event log */}
      <Panel style={{ flex: 1 }}>
        <div style={{ padding: '14px 16px 0', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Registro de eventos</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'Todos'], ['detection', 'Detección'], ['system', 'Sistema'], ['report', 'Reporte']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTypeFilter(val)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 11,
                  border: '0.5px solid',
                  borderColor: typeFilter === val ? 'var(--accent)' : 'var(--border)',
                  background: typeFilter === val ? 'var(--bg-active)' : 'var(--bg-raised)',
                  color: typeFilter === val ? 'var(--text-primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          {filtered.slice(0, 30).map((evt, i) => {
            const typeCfg = TYPE_CONFIG[evt.type] || TYPE_CONFIG.system
            const Icon = typeCfg.icon
            return (
              <div key={evt.id} style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < filtered.length - 1 ? '0.5px solid var(--border)' : 'none',
                alignItems: 'flex-start',
              }}>
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--bg-raised)',
                    border: '0.5px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: typeCfg.color,
                  }}>
                    <Icon size={12} />
                  </div>
                  {i < filtered.slice(0, 30).length - 1 && (
                    <div style={{ width: 0.5, flex: 1, minHeight: 16, background: 'var(--border)', marginTop: 4 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <div>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{evt.message}</span>
                      {evt.zone && (
                        <span style={{ marginLeft: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                          Zona {evt.zone}
                        </span>
                      )}
                    </div>
                    {evt.severity && <SeverityBadge severity={evt.severity} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(evt.timestamp, { locale: es, addSuffix: true })} · {format(evt.timestamp, 'dd/MM/yy HH:mm')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
