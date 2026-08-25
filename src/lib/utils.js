import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-aware className joiner. */
export const cn = (...inputs) => twMerge(clsx(inputs))

export const formatRelativeTime = (iso) => {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const formatTimestamp = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
