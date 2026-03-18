import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Toast } from '../components/ui/Toast'
import { createOrder, deleteOrder, listOrders, updateOrder, type CustomerOrder, type OrderUpsert } from '../services/ordersApi'

const empty: OrderUpsert = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  product: '',
  quantity: 1,
  unitPrice: 0,
  status: 'NEW',
  createdBy: 'admin',
}

export function OrdersPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('createdAt,desc')
  const [data, setData] = useState<CustomerOrder[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<CustomerOrder | null>(null)
  const [form, setForm] = useState<OrderUpsert>(empty)
  const [toast, setToast] = useState<{ msg: string; kind?: 'success' | 'error' } | null>(null)

  const totalPreview = useMemo(() => Number(form.quantity) * Number(form.unitPrice || 0), [form.quantity, form.unitPrice])

  async function refresh() {
    setLoading(true)
    try {
      const res = await listOrders({ page, size, sort })
      setData(res.content)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sort])

  function startCreate() {
    setEditing(null)
    setForm(empty)
  }

  function startEdit(o: CustomerOrder) {
    setEditing(o)
    setForm({
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      streetAddress: o.streetAddress,
      city: o.city,
      state: o.state,
      postalCode: o.postalCode,
      country: o.country,
      product: o.product,
      quantity: o.quantity,
      unitPrice: o.unitPrice,
      status: o.status,
      createdBy: o.createdBy,
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.quantity < 1) {
      setToast({ msg: 'Quantity must be at least 1.', kind: 'error' })
      return
    }
    setLoading(true)
    try {
      if (editing) {
        await updateOrder(editing.id, form)
        setToast({ msg: 'Order updated.', kind: 'success' })
      } else {
        await createOrder(form)
        setToast({ msg: 'Order created.', kind: 'success' })
      }
      startCreate()
      await refresh()
    } catch (err: any) {
      setToast({ msg: err?.response?.data?.message ?? 'Request failed.', kind: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(o: CustomerOrder) {
    if (!confirm(`Delete order #${o.id}?`)) return
    setLoading(true)
    try {
      await deleteOrder(o.id)
      setToast({ msg: 'Order deleted.', kind: 'success' })
      await refresh()
    } catch (err: any) {
      setToast({ msg: err?.response?.data?.message ?? 'Delete failed.', kind: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-100">Customer Orders</div>
          <div className="text-sm text-slate-400">CRUD + validation + computed totals</div>
        </div>
        <button className="btn-primary" onClick={startCreate} type="button">
          New order
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[440px_1fr]">
        <Card
          title={editing ? `Edit order #${editing.id}` : 'Create order'}
          right={<div className="text-xs text-slate-400">Total preview: ${totalPreview.toFixed(2)}</div>}
        >
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Field label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            </div>
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Street address" value={form.streetAddress} onChange={(v) => setForm({ ...form, streetAddress: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Postal code" value={form.postalCode} onChange={(v) => setForm({ ...form, postalCode: v })} />
              <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Product" value={form.product} onChange={(v) => setForm({ ...form, product: v })} />
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v })}
                options={['NEW', 'PAID', 'SHIPPED', 'CANCELLED']}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Qty" value={form.quantity} onChange={(n) => setForm({ ...form, quantity: n })} min={1} />
              <NumberField
                label="Unit price"
                value={form.unitPrice}
                onChange={(n) => setForm({ ...form, unitPrice: n })}
                step={0.01}
              />
              <Field label="Created by" value={form.createdBy} onChange={(v) => setForm({ ...form, createdBy: v })} />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button className="btn-primary" disabled={loading} type="submit">
                {editing ? 'Save changes' : 'Create order'}
              </button>
              {editing ? (
                <button className="btn-ghost" disabled={loading} type="button" onClick={startCreate}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card
          title="Orders table"
          right={
            <div className="flex items-center gap-2">
              <Select
                label=""
                value={sort}
                onChange={(v) => setSort(v)}
                options={['createdAt,desc', 'createdAt,asc', 'totalAmount,desc', 'totalAmount,asc']}
              />
            </div>
          }
        >
          <div className="overflow-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  {['ID', 'Customer', 'Product', 'Qty', 'Unit', 'Total', 'Status', 'Created'].map((h) => (
                    <th key={h} className="border-b border-border px-2 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                  <th className="border-b border-border px-2 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5">
                    <td className="border-b border-border px-2 py-2 text-slate-200">{o.id}</td>
                    <td className="border-b border-border px-2 py-2">
                      <div className="font-medium text-slate-100">
                        {o.firstName} {o.lastName}
                      </div>
                      <div className="text-xs text-slate-400">{o.email}</div>
                    </td>
                    <td className="border-b border-border px-2 py-2 text-slate-200">{o.product}</td>
                    <td className="border-b border-border px-2 py-2 text-slate-200">{o.quantity}</td>
                    <td className="border-b border-border px-2 py-2 text-slate-200">${Number(o.unitPrice).toFixed(2)}</td>
                    <td className="border-b border-border px-2 py-2 font-semibold text-slate-100">
                      ${Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td className="border-b border-border px-2 py-2">
                      <span className="rounded-full border border-border bg-white/5 px-2 py-1 text-xs text-slate-200">
                        {o.status}
                      </span>
                    </td>
                    <td className="border-b border-border px-2 py-2 text-xs text-slate-400">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="border-b border-border px-2 py-2">
                      <div className="flex gap-2">
                        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => startEdit(o)} type="button">
                          Edit
                        </button>
                        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => void onDelete(o)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-2 py-8 text-center text-slate-400">
                      {loading ? 'Loading…' : 'No orders yet. Create one to see analytics.'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Page {page + 1} / {Math.max(1, totalPages)}
            </div>
            <div className="flex items-center gap-2">
              <Select label="" value={String(size)} onChange={(v) => setSize(Number(v))} options={['10', '20', '50']} />
              <button className="btn-ghost px-3" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>
                Prev
              </button>
              <button
                className="btn-ghost px-3"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>

      {toast ? <Toast message={toast.msg} kind={toast.kind} /> : null}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  step?: number
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <input
        className="input"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
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
      {label ? <span className="text-xs font-medium text-slate-300">{label}</span> : null}
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

