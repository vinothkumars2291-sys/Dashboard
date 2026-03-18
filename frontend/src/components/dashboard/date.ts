import type { DatePreset } from './types'

export function presetToRange(preset: DatePreset): { from?: Date; to?: Date } {
  const now = new Date()
  const end = now
  const start = new Date(now)

  switch (preset) {
    case 'ALL':
      return {}
    case 'TODAY':
      start.setHours(0, 0, 0, 0)
      return { from: start, to: end }
    case 'LAST_7':
      start.setDate(start.getDate() - 7)
      return { from: start, to: end }
    case 'LAST_30':
      start.setDate(start.getDate() - 30)
      return { from: start, to: end }
    case 'LAST_90':
      start.setDate(start.getDate() - 90)
      return { from: start, to: end }
    default:
      return {}
  }
}

export function inRange(iso: string, preset: DatePreset): boolean {
  const { from, to } = presetToRange(preset)
  if (!from || !to) return true
  const d = new Date(iso)
  return d >= from && d <= to
}

