import type { CustomerOrder } from '../../services/ordersApi'
import type { BarChartWidgetConfig, KPIWidgetConfig, PieChartWidgetConfig } from './types'

export function sumRevenue(orders: CustomerOrder[]) {
  return orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0)
}

export function countOrders(orders: CustomerOrder[]) {
  return orders.length
}

export function avgOrderValue(orders: CustomerOrder[]) {
  if (orders.length === 0) return 0
  return sumRevenue(orders) / orders.length
}

export function kpiValue(cfg: KPIWidgetConfig, orders: CustomerOrder[]) {
  switch (cfg.metric) {
    case 'revenue':
      return sumRevenue(orders)
    case 'orders':
      return countOrders(orders)
    case 'avgOrderValue':
      return avgOrderValue(orders)
  }
}

function groupKey(order: CustomerOrder, key: 'status' | 'product' | 'createdAtDay') {
  if (key === 'createdAtDay') {
    const d = new Date(order.createdAt)
    return d.toISOString().slice(0, 10)
  }
  return String((order as any)[key] ?? 'Unknown')
}

export function seriesForBar(cfg: BarChartWidgetConfig, orders: CustomerOrder[]) {
  const map = new Map<string, number>()
  for (const o of orders) {
    const k = groupKey(o, cfg.groupBy)
    const add = cfg.metric === 'orders' ? 1 : Number(o.totalAmount || 0)
    map.set(k, (map.get(k) ?? 0) + add)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }))
}

export function seriesForPie(cfg: PieChartWidgetConfig, orders: CustomerOrder[]) {
  const map = new Map<string, number>()
  for (const o of orders) {
    const k = groupKey(o, cfg.groupBy)
    const add = cfg.metric === 'orders' ? 1 : Number(o.totalAmount || 0)
    map.set(k, (map.get(k) ?? 0) + add)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }))
}

