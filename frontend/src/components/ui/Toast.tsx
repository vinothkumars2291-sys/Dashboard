import { useEffect, useState } from 'react'

export function Toast({ message, kind }: { message: string; kind?: 'success' | 'error' }) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 3500)
    return () => clearTimeout(t)
  }, [])

  if (!open) return null
  const cls =
    kind === 'error'
      ? 'border-red-400/30 bg-red-500/10 text-red-100'
      : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'

  return (
    <div className={`panel fixed bottom-5 right-5 max-w-sm border px-4 py-3 text-sm ${cls}`}>
      {message}
    </div>
  )
}

