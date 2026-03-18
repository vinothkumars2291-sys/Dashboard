import type { CustomerOrder } from '../../services/ordersApi'
import type { PieChartWidgetConfig } from '../dashboard/types'
import { seriesForPie } from '../dashboard/analytics'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const palette = ['#6366f1', '#22c55e', '#f97316', '#06b6d4', '#a855f7', '#ef4444', '#eab308']

export function PieChartWidget({ cfg, orders }: { cfg: PieChartWidgetConfig; orders: CustomerOrder[] }) {
  const data = seriesForPie(cfg, orders)
  return (
    <div className="h-full min-h-[220px]">
      <div className="mb-2 text-xs text-slate-400">
        Group by <span className="text-slate-200">{cfg.groupBy}</span> • Metric{' '}
        <span className="text-slate-200">{cfg.metric}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: 'rgba(2,6,23,0.92)',
              border: '1px solid rgba(148,163,184,0.18)',
              borderRadius: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(226,232,240,0.9)' }} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={2}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={palette[idx % palette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

