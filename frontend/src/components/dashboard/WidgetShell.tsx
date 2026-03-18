import type { ReactNode } from 'react'

export function WidgetShell({
  title,
  editable,
  onRemove,
  children,
}: {
  title: string
  editable: boolean
  onRemove?: () => void
  children: ReactNode
}) {
  return (
    <div className="panel h-full overflow-hidden">
      <div className="panel-header">
        <div className="min-w-0">
          <div className="widget-handle cursor-move select-none truncate text-sm font-semibold text-slate-100">
            {title}
          </div>
          <div className="text-xs text-slate-400">Orders dataset</div>
        </div>
        {editable ? (
          <div className="flex items-center gap-2">
            {onRemove ? (
              <button className="btn-ghost px-2 py-1 text-xs" onClick={onRemove} type="button">
                Remove
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="panel-body h-full min-h-0">{children}</div>
    </div>
  )
}

