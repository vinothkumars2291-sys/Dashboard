import type { CustomerOrder } from '../../services/ordersApi'
import type { TableWidgetConfig } from '../dashboard/types'

export function TableWidget({ cfg, orders }: { cfg: TableWidgetConfig; orders: CustomerOrder[] }) {
  const cols = cfg.columns
  const rows = orders.slice(0, cfg.pageSize)

  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="text-slate-200">{rows.length}</span> of{' '}
          <span className="text-slate-200">{orders.length}</span>
        </div>
        <div className="rounded-full border border-border bg-white/5 px-2 py-1">
          Page size: <span className="text-slate-200">{cfg.pageSize}</span>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr>
              {cols.map((c) => (
                <th key={c} className="border-b border-border px-2 py-2 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="hover:bg-white/5">
                {cols.map((c) => (
                  <td key={c} className="border-b border-border px-2 py-2 text-slate-200">
                    {renderCell(c, o)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="px-2 py-8 text-center text-slate-400">
                  No rows
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderCell(col: TableWidgetConfig['columns'][number], o: CustomerOrder) {
  switch (col) {
    case 'id':
      return o.id
    case 'customer':
      return `${o.firstName} ${o.lastName}`
    case 'email':
      return o.email
    case 'product':
      return o.product
    case 'quantity':
      return o.quantity
    case 'unitPrice':
      return `$${Number(o.unitPrice).toFixed(2)}`
    case 'totalAmount':
      return `$${Number(o.totalAmount).toFixed(2)}`
    case 'status':
      return o.status
    case 'createdAt':
      return new Date(o.createdAt).toLocaleString()
    default:
      return ''
  }
}

