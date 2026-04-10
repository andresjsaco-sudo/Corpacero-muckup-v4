import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { HOURLY_DATA, ZONES, SEVERITY_CONFIG, INSPECTIONS } from '../data/mock'
import { StatCard, Panel, SeverityBadge } from '../components/UI'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const last12 = HOURLY_DATA.slice(12)

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
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

const DeviceRow = ({ name, sub, status }) => {
  const color = status === 'ok' ? 'var(--success)' : status === 'warn' ? 'var(--warning)' : 'var(--danger)'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 0',
      borderBottom: '0.5px solid var(--border)',
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const criticals = ZONES.filter(z => z.severity === 'critical').length
  const moderates = ZONES.filter(z => z.severity === 'moderate').length
  const totalInf = HOURLY_DATA.reduce((a, h) => a + h.inferences, 0)
  const recentInspections = INSPECTIONS.slice(0, 5)

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', height: '100%' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
        <StatCard
          label="Estructuras activas"
          value={ZONES.length}
          delta="Zona industrial B"
          deltaColor="var(--text-muted)"
          fill="var(--accent)"
          fillPct={75}
        />
        <StatCard
          label="Alertas críticas"
          value={criticals}
          delta={`+1 vs ayer`}
          deltaColor="var(--danger)"
          fill="var(--danger)"
          fillPct={Math.round(criticals / ZONES.length * 100)}
        />
        <StatCard
          label="Inferencias hoy"
          value={totalInf.toLocaleString()}
          delta="YOLOv8 · 97% acc."
          deltaColor="var(--success)"
          fill="var(--success)"
          fillPct={62}
        />
        <StatCard
          label="Latencia MQTT"
          value="38ms"
          delta="LTE · AWS IoT Core"
          deltaColor="var(--text-muted)"
          fill="var(--warning)"
          fillPct={38}
        />
      </div>

      {/* Charts + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 16 }}>

        <Panel title="Detecciones por hora — últimas 12h" action="hoy">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={last12} barSize={10} barGap={2}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="critical" name="Crítico" stackId="a" fill="var(--danger)" opacity={0.8} radius={[0,0,0,0]} />
              <Bar dataKey="moderate" name="Moderado" stackId="a" fill="var(--warning)" opacity={0.8} radius={[0,0,0,0]} />
              <Bar dataKey="low" name="Leve" stackId="a" fill="var(--accent)" opacity={0.7} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--border)' }}>
            {[
              { label: 'Crítico', count: criticals, color: 'var(--danger)', pct: Math.round(criticals / ZONES.length * 100) },
              { label: 'Moderado', count: moderates, color: 'var(--warning)', pct: Math.round(moderates / ZONES.length * 100) },
              { label: 'Leve', count: ZONES.length - criticals - moderates, color: 'var(--success)', pct: Math.round((ZONES.length - criticals - moderates) / ZONES.length * 100) },
            ].map(({ label, count, color, pct }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 68, flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: color }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, textAlign: 'right', flexShrink: 0 }}>{count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Zonas activas" action={`${ZONES.length} total`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ZONES.slice(0, 6).map(z => {
              const cfg = SEVERITY_CONFIG[z.severity]
              return (
                <div key={z.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '0.5px solid var(--border)',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, flex: 1, fontFamily: 'var(--mono)' }}>{z.id}</span>
                  <SeverityBadge severity={z.severity} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.confidence}%</span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

        <Panel title="Últimas inspecciones">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recentInspections.map(ins => (
              <div key={ins.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: '0.5px solid var(--border)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', width: 90, flexShrink: 0 }}>{ins.id}</span>
                <span style={{ fontSize: 12, flex: 1 }}>Zona {ins.zone}</span>
                <SeverityBadge severity={ins.severity} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                  {formatDistanceToNow(ins.timestamp, { locale: es, addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Estado del sistema">
          <DeviceRow name="Raspberry Pi 4" sub="Edge · YOLOv8 activo · cam OK" status="ok" />
          <DeviceRow name="AWS IoT Core" sub="MQTT · 38ms latencia" status="ok" />
          <DeviceRow name="Lambda + DynamoDB" sub="2,341 registros hoy" status="warn" />
          <DeviceRow name="LTE — SIM7600G-H" sub="Señal 87% · uptime 99.2%" status="ok" />
          <DeviceRow name="Vercel (dashboard)" sub="corpacero.vercel.app · online" status="ok" />
        </Panel>
      </div>

    </div>
  )
}
