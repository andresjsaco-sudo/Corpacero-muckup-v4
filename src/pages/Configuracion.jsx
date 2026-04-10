import React, { useState } from 'react'
import { Panel } from '../components/UI'
import { Save, Wifi, Camera, Cloud, Bell } from 'lucide-react'

function Section({ title, icon: Icon, children }) {
  return (
    <Panel>
      <div style={{ padding: '14px 16px 0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={15} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </Panel>
  )
}

function Field({ label, defaultValue, hint, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        style={{
          width: '100%',
          background: 'var(--bg-base)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: 13,
          color: 'var(--text-primary)',
          fontFamily: defaultValue?.toString().includes('mqtt') || defaultValue?.toString().includes('aws') ? 'var(--mono)' : 'var(--font)',
          outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, defaultChecked, hint }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 13 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</div>}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10,
          background: checked ? 'var(--accent)' : 'var(--bg-hover)',
          border: '0.5px solid var(--border)',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

export default function Configuracion() {
  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <Section title="Dispositivo Edge" icon={Camera}>
          <Field label="Endpoint Raspberry Pi" defaultValue="192.168.1.100" hint="IP local del dispositivo en la red LTE" />
          <Field label="Intervalo de captura (segundos)" defaultValue="30" type="number" />
          <Field label="Modelo YOLOv8" defaultValue="yolov8n-corrosion-v2.pt" />
          <Toggle label="Inferencia en tiempo real" defaultChecked={true} hint="Procesamiento local en el Pi antes de enviar" />
          <Toggle label="Guardar frames originales en SD" defaultChecked={false} />
        </Section>

        <Section title="AWS IoT Core / MQTT" icon={Cloud}>
          <Field label="Broker endpoint" defaultValue="xxxxxx-ats.iot.us-east-1.amazonaws.com" />
          <Field label="Topic de publicación" defaultValue="corpacero/detections" />
          <Field label="Topic de comandos" defaultValue="corpacero/commands" />
          <Toggle label="QoS 1 (at least once)" defaultChecked={true} />
          <Toggle label="Retener último mensaje" defaultChecked={false} />
        </Section>

        <Section title="Conectividad LTE" icon={Wifi}>
          <Field label="APN operador" defaultValue="internet.claro.com.co" />
          <Field label="Umbral de reconexión (ms)" defaultValue="5000" type="number" hint="Tiempo de espera antes de reintentar conexión" />
          <Toggle label="Failover a WiFi si disponible" defaultChecked={true} />
        </Section>

        <Section title="Notificaciones y alertas" icon={Bell}>
          <Field label="Email para alertas críticas" defaultValue="calidad@corpacero.com.co" type="email" />
          <Field label="Umbral confianza mínima (%)" defaultValue="60" type="number" hint="Detecciones por debajo de este umbral serán ignoradas" />
          <Toggle label="Notificar detecciones críticas inmediatamente" defaultChecked={true} />
          <Toggle label="Resumen diario por correo" defaultChecked={true} />
          <Toggle label="Notificar pérdida de conectividad" defaultChecked={true} />
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            padding: '9px 20px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            fontWeight: 500,
            color: 'white',
            display: 'flex', alignItems: 'center', gap: 7,
            cursor: 'pointer',
          }}>
            <Save size={14} />
            Guardar configuración
          </button>
        </div>
      </div>
    </div>
  )
}
