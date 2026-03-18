import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="border-b border-slate-700/20 bg-slate-900/40 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/30">
            HX
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-100">Halleyx Dashboard</div>
            <div className="text-xs text-slate-400">Orders analytics + custom widgets</div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <TopLink to="/dashboard" label="Dashboard" />
          <TopLink to="/orders" label="Orders" />
          <TopLink to="/dashboard/config" label="Configure" />
        </nav>
      </div>
    </header>
  )
}

function TopLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-lg px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

