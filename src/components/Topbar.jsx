import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTheme } from '../context/ThemeContext'
import { Bell, RefreshCw, Sun, Moon } from 'lucide-react'

// dentro del componente:
const { theme, toggle } = useTheme()

// en el JSX, junto a los otros iconButtons:
<button onClick={toggle} style={styles.iconBtn} title="Cambiar tema">
  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
</button>


const PAGE_TITLES = {
  '/': 'Dashboard',
  '/live': 'Feed en vivo',
  '/inspecciones': 'Inspecciones',
  '/mapa': 'Mapa de corrosión',
  '/historial': 'Historial',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
}

const styles = {
  bar: {
    height: 'var(--topbar-height)',
    background: 'var(--bg-surface)',
    borderBottom: '0.5px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  badge: (color, bg, border) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    color,
    background: bg,
    border: `0.5px solid ${border}`,
    borderRadius: 20,
    padding: '3px 9px',
  }),
  dot: (color) => ({
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: color,
  }),
  clock: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    border: '0.5px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'background 0.15s',
  },
}

export default function Topbar() {
  const location = useLocation()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const title = PAGE_TITLES[location.pathname] || ''

  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        <span style={styles.title}>{title}</span>
        <div style={styles.badge('var(--text-muted)', 'transparent', 'var(--border)')}>
          Zona industrial B · Barranquilla
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.badge('var(--success)', 'var(--success-bg)', 'var(--success-border)')}>
          <div style={styles.dot('var(--success)')} />
          Sistema activo
        </div>
        <span style={styles.clock}>{format(now, 'HH:mm:ss')}</span>
        <button style={styles.iconBtn} title="Refrescar">
          <RefreshCw size={14} />
        </button>
        <button style={styles.iconBtn} title="Notificaciones">
          <Bell size={14} />
        </button>
      </div>
    </div>
  )
}
