import { useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'
import { DashboardGrid, defaultLayouts } from '../components/dashboard/DashboardGrid'
import type { WidgetConfig, WidgetType } from '../components/dashboard/types'
import { useDashboardState } from '../components/dashboard/useDashboardState'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}`
}

export function DashboardConfigPage() {
  const { state, setLayouts, addWidget, removeWidget, updateWidget, reset, persistNow } = useDashboardState()
  const [selectedId, setSelectedId] = useState<string | null>(state.widgets[0]?.id ?? null)

  const selected = useMemo(() => state.widgets.find((w) => w.id === selectedId) ?? null, [state.widgets, selectedId])

  function onAdd(type: WidgetType) {
    const w: WidgetConfig =
      type === 'KPI'
        ? { id: uid('w_kpi'), type: 'KPI', title: 'New KPI', metric: 'revenue' }
        : type === 'BAR'
          ? { id: uid('w_bar'), type: 'BAR', title: 'New Bar', groupBy: 'status', metric: 'revenue' }
          : type === 'PIE'
            ? { id: uid('w_pie'), type: 'PIE', title: 'New Pie', groupBy: 'product', metric: 'orders' }
            : { id: uid('w_table'), type: 'TABLE', title: 'New Table', columns: ['id', 'customer', 'product', 'totalAmount'], pageSize: 10 }

    addWidget(w)
    setSelectedId(w.id)
    // Ensure layouts exist for new widget (fallback)
    if (!state.layouts || Object.keys(state.layouts).length === 0) {
      setLayouts(defaultLayouts([...state.widgets, w]) as any)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-100">Dashboard Configuration</div>
          <div className="text-sm text-slate-400">Drag, resize, add widgets, then save layout</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-ghost" type="button" onClick={() => onAdd('KPI')}>
            + KPI
          </button>
          <button className="btn-ghost" type="button" onClick={() => onAdd('BAR')}>
            + Bar
          </button>
          <button className="btn-ghost" type="button" onClick={() => onAdd('PIE')}>
            + Pie
          </button>
          <button className="btn-ghost" type="button" onClick={() => onAdd('TABLE')}>
            + Table
          </button>
          <button className="btn-primary" type="button" onClick={persistNow}>
            Save layout
          </button>
          <button className="btn-ghost" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <Card title="Canvas (drag & resize)">
          <div className="text-xs text-slate-400">
            Breakpoints: <span className="text-slate-200">Desktop 12</span> • <span className="text-slate-200">Tablet 8</span> •{' '}
            <span className="text-slate-200">Mobile 4</span>
          </div>
          <div className="mt-3">
            <DashboardGrid
              widgets={state.widgets}
              layouts={state.layouts as any}
              isEditable={true}
              onLayoutsChange={(l) => setLayouts(l as any)}
              onRemoveWidget={(id) => {
                removeWidget(id)
                if (selectedId === id) setSelectedId(state.widgets[0]?.id ?? null)
              }}
            />
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Tip: click a widget in the list on the right to edit its settings.
          </div>
        </Card>

        <Card title="Widget settings">
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-300">Select widget</span>
              <select className="select" value={selectedId ?? ''} onChange={(e) => setSelectedId(e.target.value)}>
                {state.widgets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w.type})
                  </option>
                ))}
              </select>
            </label>

            {selected ? (
              <>
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-slate-300">Title</span>
                  <input
                    className="input"
                    value={selected.title}
                    onChange={(e) => updateWidget(selected.id, { title: e.target.value } as any)}
                  />
                </label>

                {selected.type === 'KPI' ? (
                  <Select
                    label="Metric"
                    value={selected.metric}
                    options={['revenue', 'orders', 'avgOrderValue']}
                    onChange={(v) => updateWidget(selected.id, { metric: v } as any)}
                  />
                ) : null}

                {selected.type === 'BAR' ? (
                  <>
                    <Select
                      label="Group by"
                      value={selected.groupBy}
                      options={['status', 'product', 'createdAtDay']}
                      onChange={(v) => updateWidget(selected.id, { groupBy: v } as any)}
                    />
                    <Select
                      label="Metric"
                      value={selected.metric}
                      options={['revenue', 'orders']}
                      onChange={(v) => updateWidget(selected.id, { metric: v } as any)}
                    />
                  </>
                ) : null}

                {selected.type === 'PIE' ? (
                  <>
                    <Select
                      label="Group by"
                      value={selected.groupBy}
                      options={['status', 'product']}
                      onChange={(v) => updateWidget(selected.id, { groupBy: v } as any)}
                    />
                    <Select
                      label="Metric"
                      value={selected.metric}
                      options={['revenue', 'orders']}
                      onChange={(v) => updateWidget(selected.id, { metric: v } as any)}
                    />
                  </>
                ) : null}

                {selected.type === 'TABLE' ? (
                  <>
                    <Select
                      label="Page size"
                      value={String(selected.pageSize)}
                      options={['5', '8', '10', '20']}
                      onChange={(v) => updateWidget(selected.id, { pageSize: Number(v) } as any)}
                    />
                    <div className="rounded-xl border border-border bg-white/5 p-3">
                      <div className="text-xs font-semibold text-slate-200">Columns</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(
                          [
                            'id',
                            'customer',
                            'email',
                            'product',
                            'quantity',
                            'unitPrice',
                            'totalAmount',
                            'status',
                            'createdAt',
                          ] as const
                        ).map((c) => {
                          const on = selected.columns.includes(c)
                          return (
                            <button
                              key={c}
                              type="button"
                              className={[
                                'rounded-full border px-3 py-1 text-xs transition',
                                on ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100' : 'border-border bg-white/5 text-slate-200 hover:bg-white/10',
                              ].join(' ')}
                              onClick={() => {
                                const next = on ? selected.columns.filter((x) => x !== c) : [...selected.columns, c]
                                updateWidget(selected.id, { columns: next } as any)
                              }}
                            >
                              {c}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="text-sm text-slate-400">No widgets.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

