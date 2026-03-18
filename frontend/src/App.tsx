import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { DashboardConfigPage } from './pages/DashboardConfigPage'
import { OrdersPage } from './pages/OrdersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/config" element={<DashboardConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
