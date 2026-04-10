import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Live from './pages/Live'
import Inspecciones from './pages/Inspecciones'
import Mapa from './pages/Mapa'
import Historial from './pages/Historial'
import Reportes from './pages/Reportes'
import Configuracion from './pages/Configuracion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="live" element={<Live />} />
          <Route path="inspecciones" element={<Inspecciones />} />
          <Route path="mapa" element={<Mapa />} />
          <Route path="historial" element={<Historial />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
