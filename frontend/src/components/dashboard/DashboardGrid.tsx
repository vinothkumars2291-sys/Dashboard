import { Responsive, useContainerWidth, type ResponsiveLayouts } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import type { WidgetConfig } from './types'
import { WidgetShell } from './WidgetShell'
import { WidgetView } from './WidgetView'

type Layouts = ResponsiveLayouts

export function DashboardGrid({
  widgets,
  layouts,
  isEditable,
  onLayoutsChange,
  onRemoveWidget,
}: {
  widgets: WidgetConfig[]
  layouts: Layouts
  isEditable: boolean
  onLayoutsChange?: (next: Layouts) => void
  onRemoveWidget?: (id: string) => void
}) {
  const { width, containerRef, mounted } = useContainerWidth()

  return (
    <div ref={containerRef} className="w-full">
      {mounted ? (
        <Responsive
          width={width}
          className="layout"
          layouts={layouts as any}
          breakpoints={{ lg: 1200, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={20}
          margin={[12, 12]}
          dragConfig={{ enabled: isEditable, handle: '.widget-handle' }}
          resizeConfig={{ enabled: isEditable }}
          onLayoutChange={(_current, all) => onLayoutsChange?.(all as any)}
        >
          {widgets.map((w) => (
            <div key={w.id} className="min-w-0">
              <WidgetShell
                title={w.title}
                editable={isEditable}
                onRemove={onRemoveWidget ? () => onRemoveWidget(w.id) : undefined}
              >
                <WidgetView widget={w} />
              </WidgetShell>
            </div>
          ))}
        </Responsive>
      ) : null}
    </div>
  )
}

export function defaultLayouts(widgets: WidgetConfig[]): Layouts {
  const base = widgets.map((w, i) => ({
    i: w.id,
    x: (i * 4) % 12,
    y: Math.floor((i * 4) / 12) * 8,
    w: 4,
    h: 12,
    minW: 2,
    minH: 8,
  }))

  return {
    lg: base,
    md: base.map((l) => ({ ...l, x: (l.x % 8), w: Math.min(l.w, 8) })),
    sm: base.map((l, idx) => ({ ...l, x: 0, w: 4, y: idx * 10 })),
  }
}

