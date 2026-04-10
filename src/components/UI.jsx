import React from 'react'
import { SEVERITY_CONFIG } from '../data/mock'

export function SeverityBadge({ severity, size = 'sm' }) {
  const cfg = SEVERITY_CONFIG[severity]
  if (!cfg) return null
  const pad = size === 'sm' ? '2px 7px' : '4px 10px'
  const fs = size === 'sm' ? 10 : 12
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: fs,
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
      border: `0.5px solid ${cfg.border}`,
      borderRadius: 20,
      padding: pad,
      letterSpacing: '0.2px',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
      {cfg.label}
    </span>
  )
}

export function StatCard({ label, value, delta, deltaColor = 'var(--success)', fill = 'var(--accent)', fillPct = 50 }) {
  return (
    <div style={{
      background: 'var(--bg-raised)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.2px' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, marginBottom: delta ? 8 : 0 }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, color: deltaColor, marginBottom: 8 }}>{delta}</div>
      )}
      <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', marginTop: 10 }}>
        <div style={{ width: `${fillPct}%`, height: '100%', borderRadius: 2, background: fill, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export function Panel({ title, action, children, style }) {
  return (
    <div style={{
      background: 'var(--bg-raised)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px 0',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>{title}</span>
          {action && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{action}</span>}
        </div>
      )}
      <div style={{ padding: title ? '0 16px 16px' : '16px' }}>
        {children}
      </div>
    </div>
  )
}

export function Table({ columns, rows, onRowClick }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.key} style={{
                textAlign: col.align || 'left',
                padding: '8px 12px',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '0.5px solid var(--border)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  textAlign: col.align || 'left',
                  whiteSpace: 'nowrap',
                  fontFamily: col.mono ? 'var(--mono)' : 'inherit',
                  fontSize: col.mono ? 12 : 13,
                }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
