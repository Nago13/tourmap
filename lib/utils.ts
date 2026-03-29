import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import type { EventType } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, pattern = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), pattern)
  } catch {
    return dateString
  }
}

export function formatPrice(price?: string): string {
  if (!price) return 'Price TBD'
  return price
}

export function getEventColor(type: EventType): string {
  switch (type) {
    case 'concert':
      return '#7C3AED' // violet-600
    case 'sports':
      return '#059669' // emerald-600
    case 'nightclub':
      return '#DB2777' // pink-600
    case 'restaurant':
      return '#D97706' // amber-600
    default:
      return '#6B7280' // gray-500
  }
}

export function getEventColorClass(type: EventType): string {
  switch (type) {
    case 'concert':
      return 'bg-violet-600 text-white'
    case 'sports':
      return 'bg-emerald-600 text-white'
    case 'nightclub':
      return 'bg-pink-600 text-white'
    case 'restaurant':
      return 'bg-amber-600 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
