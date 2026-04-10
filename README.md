# Corpacero — Dashboard de Monitoreo NDT

Dashboard web para el sistema de detección de corrosión en estructuras de acero usando YOLOv8 en Raspberry Pi 4 con pipeline AWS IoT Core → Lambda → DynamoDB.

## Stack

- React 18 + Vite
- React Router DOM v6
- Recharts (gráficos)
- Leaflet + React-Leaflet (mapa)
- Lucide React (iconos)
- IBM Plex Sans / IBM Plex Mono (tipografía)

## Desarrollo local

```bash
npm install
npm run dev
```

## Build y despliegue

```bash
npm run build
```

Despliega automáticamente en Vercel conectando el repositorio. El archivo `vercel.json` maneja el routing de la SPA.

## Secciones

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal con métricas, gráficos y estado del sistema |
| `/live` | Feed en vivo con viewer de frames, bounding boxes y tira de capturas |
| `/inspecciones` | Tabla de todas las inspecciones con filtros y panel de detalle |
| `/mapa` | Mapa Leaflet georreferenciado con marcadores por severidad |
| `/historial` | Timeline de eventos y gráfico de tendencias 30 días |
| `/reportes` | Gestión de reportes de inspección con estadísticas |
| `/configuracion` | Parámetros del dispositivo edge, MQTT, LTE y notificaciones |

## Datos

Actualmente usa datos mock en `src/data/mock.js`. Para conectar al backend real, reemplazar las importaciones de `mock.js` con llamadas a la API de AWS o DynamoDB según corresponda.
