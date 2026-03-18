import { Card } from '../components/ui/Card'
import { DashboardGrid } from '../components/dashboard/DashboardGrid'
import { useDashboardState } from '../components/dashboard/useDashboardState'

export function DashboardPage() {
  const { state, setDatePreset } = useDashboardState()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-100">Dashboard</div>
          <div className="text-sm text-slate-400">Live widgets bound to Customer Orders</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-300">Date</span>
            <select className="select" value={state.datePreset} onChange={(e) => setDatePreset(e.target.value as any)}>
              <option value="ALL">All time</option>
              <option value="TODAY">Today</option>
              <option value="LAST_7">Last 7 days</option>
              <option value="LAST_30">Last 30 days</option>
              <option value="LAST_90">Last 90 days</option>
            </select>
          </label>
        </div>
      </div>

      <Card title="Widgets">
        <DashboardGrid widgets={state.widgets} layouts={state.layouts as any} isEditable={false} />
      </Card>
    </div>
  )
}

