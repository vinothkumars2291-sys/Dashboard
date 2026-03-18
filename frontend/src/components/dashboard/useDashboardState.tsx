import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { DashboardState, WidgetConfig } from './types'
import { defaultLayouts } from './DashboardGrid'

const KEY = 'halleyx.dashboard.v1'

const defaultWidgets: WidgetConfig[] = [
  { id: 'w_kpi_revenue', type: 'KPI', title: 'Revenue', metric: 'revenue' },
  { id: 'w_kpi_orders', type: 'KPI', title: 'Orders', metric: 'orders' },
  { id: 'w_bar_status', type: 'BAR', title: 'Revenue by status', groupBy: 'status', metric: 'revenue' },
  { id: 'w_pie_product', type: 'PIE', title: 'Orders by product', groupBy: 'product', metric: 'orders' },
  { id: 'w_table', type: 'TABLE', title: 'Latest orders', columns: ['id', 'customer', 'product', 'totalAmount', 'status', 'createdAt'], pageSize: 8 },
]

const initial: DashboardState = {
  datePreset: 'LAST_30',
  widgets: defaultWidgets,
  layouts: defaultLayouts(defaultWidgets),
}

function load(): DashboardState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as DashboardState
    if (!parsed.layouts || !parsed.widgets) return initial
    return parsed
  } catch {
    return initial
  }
}

function save(state: DashboardState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

type Ctx = {
  state: DashboardState
  setDatePreset: (p: DashboardState['datePreset']) => void
  setLayouts: (layouts: DashboardState['layouts']) => void
  addWidget: (w: WidgetConfig) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, patch: Partial<WidgetConfig>) => void
  reset: () => void
  persistNow: () => void
}

const DashboardCtx = createContext<Ctx | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardState>(() => load())

  useEffect(() => {
    save(state)
  }, [state])

  const api = useMemo<Ctx>(
    () => ({
      state,
      setDatePreset: (p) => setState((s) => ({ ...s, datePreset: p })),
      setLayouts: (layouts) => setState((s) => ({ ...s, layouts })),
      addWidget: (w) =>
        setState((s) => {
          const widgets = [...s.widgets, w]
          return { ...s, widgets, layouts: s.layouts ?? defaultLayouts(widgets) }
        }),
      removeWidget: (id) =>
        setState((s) => {
          const widgets = s.widgets.filter((w) => w.id !== id)
          const nextLayouts: any = {}
          for (const k of Object.keys(s.layouts || {})) {
            nextLayouts[k] = (s.layouts as any)[k]?.filter((l: any) => l.i !== id) ?? []
          }
          return { ...s, widgets, layouts: nextLayouts }
        }),
      updateWidget: (id, patch) =>
        setState((s) => ({
          ...s,
          widgets: s.widgets.map((w) => (w.id === id ? ({ ...w, ...patch } as any) : w)),
        })),
      reset: () => setState(initial),
      persistNow: () => save(state),
    }),
    [state],
  )

  return <DashboardCtx.Provider value={api}>{children}</DashboardCtx.Provider>
}

export function useDashboardState() {
  const ctx = useContext(DashboardCtx)
  if (!ctx) throw new Error('useDashboardState must be used within DashboardProvider')
  return ctx
}

