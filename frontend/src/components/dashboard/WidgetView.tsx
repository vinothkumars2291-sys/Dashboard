import { useEffect, useMemo, useState } from 'react'
import type { CustomerOrder } from '../../services/ordersApi'
import { listOrders } from '../../services/ordersApi'
import { inRange } from './date'
import type { WidgetConfig } from './types'
import { useDashboardState } from './useDashboardState'
import { KPIWidget } from '../widgets/KPIWidget'
import { BarChartWidget } from '../widgets/BarChartWidget'
import { PieChartWidget } from '../widgets/PieChartWidget'
import { TableWidget } from '../widgets/TableWidget'

export function WidgetView({ widget }: { widget: WidgetConfig }) {
  const { state } = useDashboardState()
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      try {
        // For MVP we pull first 200 orders and compute analytics client-side.
        const res = await listOrders({ page: 0, size: 200, sort: 'createdAt,desc' })
        if (!mounted) return
        setOrders(res.content)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void run()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => inRange(o.createdAt, state.datePreset))
  }, [orders, state.datePreset])

  if (loading && orders.length === 0) {
    return <div className="text-sm text-slate-400">Loading…</div>
  }

  switch (widget.type) {
    case 'KPI':
      return <KPIWidget cfg={widget} orders={filtered} />
    case 'BAR':
      return <BarChartWidget cfg={widget} orders={filtered} />
    case 'PIE':
      return <PieChartWidget cfg={widget} orders={filtered} />
    case 'TABLE':
      return <TableWidget cfg={widget} orders={filtered} />
    default:
      return <div className="text-sm text-slate-400">Unsupported widget</div>
  }
}

