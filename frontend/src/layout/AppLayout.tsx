import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-3 py-4 md:grid-cols-[260px_1fr] md:px-5">
        <Sidebar />
        <div className="md:col-start-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

