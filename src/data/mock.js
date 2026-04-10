import { subHours, subDays, subMinutes, format } from 'date-fns'

export const ZONES = [
  { id: 'B-12', lat: 10.9878, lng: -74.7889, severity: 'critical', confidence: 94, last: subMinutes(new Date(), 4) },
  { id: 'A-07', lat: 10.9865, lng: -74.7901, severity: 'moderate', confidence: 71, last: subMinutes(new Date(), 22) },
  { id: 'C-03', lat: 10.9891, lng: -74.7875, severity: 'critical', confidence: 87, last: subMinutes(new Date(), 61) },
  { id: 'D-01', lat: 10.9855, lng: -74.7860, severity: 'low', confidence: 43, last: subMinutes(new Date(), 140) },
  { id: 'B-08', lat: 10.9900, lng: -74.7920, severity: 'moderate', confidence: 68, last: subMinutes(new Date(), 35) },
  { id: 'A-02', lat: 10.9872, lng: -74.7845, severity: 'low', confidence: 38, last: subMinutes(new Date(), 210) },
  { id: 'E-05', lat: 10.9910, lng: -74.7895, severity: 'low', confidence: 29, last: subMinutes(new Date(), 300) },
  { id: 'C-11', lat: 10.9845, lng: -74.7932, severity: 'moderate', confidence: 59, last: subMinutes(new Date(), 78) },
]

export const SEVERITY_CONFIG = {
  critical: { label: 'Crítico', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  moderate: { label: 'Moderado', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  low: { label: 'Leve', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
}

export const HOURLY_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  critical: Math.floor(Math.random() * 4),
  moderate: Math.floor(Math.random() * 8 + 2),
  low: Math.floor(Math.random() * 12 + 4),
  inferences: Math.floor(Math.random() * 120 + 40),
}))

export const DAILY_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'dd/MM'),
  critical: Math.floor(Math.random() * 6),
  moderate: Math.floor(Math.random() * 15 + 3),
  low: Math.floor(Math.random() * 20 + 8),
}))

export const INSPECTIONS = Array.from({ length: 40 }, (_, i) => {
  const sev = ['critical', 'moderate', 'low'][Math.floor(Math.random() * 3)]
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)]
  return {
    id: `INS-${String(1000 + i).padStart(4, '0')}`,
    zone: zone.id,
    severity: sev,
    confidence: Math.floor(Math.random() * 40 + 55),
    timestamp: subHours(new Date(), Math.floor(Math.random() * 168)),
    thickness: (Math.random() * 4 + 2).toFixed(1),
    rustArea: (Math.random() * 35 + 2).toFixed(1),
    image: `https://picsum.photos/seed/${i + 10}/400/300`,
    lat: zone.lat + (Math.random() - 0.5) * 0.002,
    lng: zone.lng + (Math.random() - 0.5) * 0.002,
    notes: ['Corrosión uniforme en superficie expuesta', 'Picaduras profundas detectadas', 'Oxidación superficial incipiente', 'Descamación en bordes', 'Corrosión galvánica en unión'][Math.floor(Math.random() * 5)],
  }
})

export const LIVE_FRAMES = Array.from({ length: 12 }, (_, i) => {
  const sev = Math.random() > 0.6 ? 'critical' : Math.random() > 0.4 ? 'moderate' : 'low'
  return {
    id: `FRAME-${i}`,
    timestamp: subMinutes(new Date(), i * 3),
    zone: ZONES[Math.floor(Math.random() * ZONES.length)].id,
    severity: sev,
    confidence: Math.floor(Math.random() * 30 + 65),
    image: `https://picsum.photos/seed/${100 + i}/640/480`,
    detections: Math.floor(Math.random() * 4 + 1),
  }
})

export const REPORTS = Array.from({ length: 12 }, (_, i) => ({
  id: `RPT-${String(2024100 + i).padStart(7, '0')}`,
  title: `Inspección semanal — Zona ${['A', 'B', 'C', 'D'][i % 4]}-${String(i + 1).padStart(2, '0')}`,
  date: subDays(new Date(), i * 7),
  zones: Math.floor(Math.random() * 8 + 2),
  criticals: Math.floor(Math.random() * 5),
  moderates: Math.floor(Math.random() * 10 + 2),
  inspector: ['J. Betancourt', 'M. Rodríguez', 'K. Lascarro'][i % 3],
  status: i === 0 ? 'processing' : 'complete',
}))

export const HISTORY_EVENTS = [
  ...ZONES.map(z => ({
    id: `EVT-${z.id}`,
    type: 'detection',
    zone: z.id,
    severity: z.severity,
    confidence: z.confidence,
    timestamp: z.last,
    message: `Nueva detección ${SEVERITY_CONFIG[z.severity].label.toLowerCase()} en zona ${z.id}`,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `EVT-SYS-${i}`,
    type: ['system', 'report', 'maintenance'][Math.floor(Math.random() * 3)],
    zone: ZONES[Math.floor(Math.random() * ZONES.length)].id,
    severity: null,
    confidence: null,
    timestamp: subHours(new Date(), Math.floor(Math.random() * 72)),
    message: ['Reporte generado automáticamente', 'Dispositivo reconectado tras pérdida de señal', 'Calibración de cámara completada', 'Backup de datos realizado en S3', 'Actualización de modelo YOLOv8 aplicada'][Math.floor(Math.random() * 5)],
  })),
].sort((a, b) => b.timestamp - a.timestamp)
