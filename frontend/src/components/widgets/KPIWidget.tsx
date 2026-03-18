import type { CustomerOrder } from '../../services/ordersApi'
import type { KPIWidgetConfig } from '../dashboard/types'
import { kpiValue } from '../dashboard/analytics'

export function KPIWidget({ cfg, orders }: { cfg: KPIWidgetConfig; orders: CustomerOrder[] }) {
  const value = kpiValue(cfg, orders)
  const formatted =
    cfg.metric === 'revenue' || cfg.metric === 'avgOrderValue'
      ? `$${value.toFixed(2)}`
      : new Intl.NumberFormat().format(Math.round(value))

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="text-xs font-medium text-slate-400">Metric</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">{formatted}</div>
      <div className="mt-1 text-xs text-slate-400">
        {cfg.metric === 'revenue' ? 'Total revenue' : cfg.metric === 'orders' ? 'Order count' : 'Average order value'}
      </div>
      <div className="mt-4 rounded-lg border border-border bg-white/5 p-3 text-xs text-slate-300">
        Tip: change date preset to filter KPIs in real time.
      </div>
    </div>
  )
}

