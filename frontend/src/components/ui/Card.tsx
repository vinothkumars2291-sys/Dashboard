import type { ReactNode } from 'react'

export function Card({ title, right, children }: { title?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="panel">
      {title ? (
        <div className="panel-header">
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <div>{right}</div>
        </div>
      ) : null}
      <div className="panel-body">{children}</div>
    </section>
  )
}

