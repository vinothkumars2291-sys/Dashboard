import type { CustomerOrder } from '../../services/ordersApi'
import type { BarChartWidgetConfig } from '../dashboard/types'
import { seriesForBar } from '../dashboard/analytics'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function BarChartWidget({ cfg, orders }: { cfg: BarChartWidgetConfig; orders: CustomerOrder[] }) {
  const data = seriesForBar(cfg, orders)
  return (
    <div className="h-full min-h-[220px]">
      <div className="mb-2 text-xs text-slate-400">
        Group by <span className="text-slate-200">{cfg.groupBy}</span> • Metric{' '}
        <span className="text-slate-200">{cfg.metric}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
          <XAxis dataKey="name" stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 12 }} />
          <YAxis stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(2,6,23,0.92)',
              border: '1px solid rgba(148,163,184,0.18)',
              borderRadius: 12,
            }}
          />
          <Bar dataKey="value" fill="rgba(99,102,241,0.85)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

