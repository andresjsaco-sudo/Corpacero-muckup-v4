import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Camera, Map, ClipboardList,
  FileText, History, Settings, ChevronRight
} from 'lucide-react'

const NAV = [
  {
    group: 'Monitoreo',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/live', icon: Camera, label: 'Feed en vivo' },
      { to: '/inspecciones', icon: ClipboardList, label: 'Inspecciones' },
    ],
  },
  {
    group: 'Análisis',
    items: [
      { to: '/mapa', icon: Map, label: 'Mapa' },
      { to: '/historial', icon: History, label: 'Historial' },
      { to: '/reportes', icon: FileText, label: 'Reportes' },
    ],
  },
  {
    group: 'Sistema',
    items: [
      { to: '/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
]

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    background: 'var(--bg-surface)',
    borderRight: '0.5px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logo: {
    padding: '18px 16px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '0.5px solid var(--border)',
  },
  logoMark: {
    width: 30,
    height: 30,
    background: 'var(--accent)',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: 'var(--text-primary)',
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.3px',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  groupLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.8px',
    padding: '12px 16px 4px',
    textTransform: 'uppercase',
  },
  footer: {
    padding: '12px 16px',
    borderTop: '0.5px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    flexShrink: 0,
  },
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 12px',
        margin: '1px 8px',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: isActive ? 'var(--bg-active)' : 'transparent',
        transition: 'background 0.15s, color 0.15s',
        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
      })}
    >
      <Icon size={15} strokeWidth={1.7} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoMark}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoText}>Corpacero</div>
          <div style={styles.logoSub}>Sistema NDT</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <div style={styles.groupLabel}>{group}</div>
            {items.map(item => <NavItem key={item.to} {...item} />)}
          </div>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.avatar}>JB</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>J. Betancourt</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ingeniero</div>
        </div>
      </div>
    </aside>
  )
}
