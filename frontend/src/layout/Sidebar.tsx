import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/config', label: 'Dashboard Config' },
  { to: '/orders', label: 'Customer Orders' },
]

export function Sidebar() {
  return (
    <aside className="panel sticky top-16 hidden h-[calc(100vh-5rem)] overflow-auto md:block">
      <div className="panel-header">
        <div className="text-sm font-semibold text-slate-100">Navigation</div>
        <div className="text-xs text-slate-400">v0.1</div>
      </div>
      <div className="panel-body">
        <div className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                [
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                  isActive ? 'bg-indigo-500/15 text-indigo-100 ring-1 ring-indigo-500/30' : 'text-slate-300 hover:bg-white/5',
                ].join(' ')
              }
            >
              <span>{l.label}</span>
              <span className="text-xs text-slate-500">→</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-slate-700/20 bg-white/5 p-3">
          <div className="text-xs font-semibold text-slate-200">Tips</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-400">
            <li>Use Dashboard Config to add/resize widgets.</li>
            <li>Layouts are saved locally (can be wired to backend later).</li>
            <li>Orders power all widgets in real time.</li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

