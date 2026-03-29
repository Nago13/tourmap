'use client'

import { Ticket, Plane, Hotel, Car } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Event, BookingItem } from '@/lib/types'

interface BookingOption {
  type: BookingItem['type']
  label: string
  icon: React.ReactNode
  estimatedPrice: string
  description: string
}

interface BookingOptionsProps {
  event: Event
  onBook: (type: BookingItem['type']) => void
}

function deriveOptions(event: Event): BookingOption[] {
  return [
    {
      type: 'ticket',
      label: 'Get Tickets',
      icon: <Ticket className="h-4 w-4" />,
      estimatedPrice: formatPrice(event.price),
      description: `Entry to ${event.name}`,
    },
    {
      type: 'flight',
      label: 'Book Flight',
      icon: <Plane className="h-4 w-4" />,
      estimatedPrice: 'From ~€120',
      description: `Fly to ${event.city}`,
    },
    {
      type: 'hotel',
      label: 'Book Hotel',
      icon: <Hotel className="h-4 w-4" />,
      estimatedPrice: 'From ~€80/night',
      description: `Stay near ${event.venue}`,
    },
    {
      type: 'car',
      label: 'Arrange Car',
      icon: <Car className="h-4 w-4" />,
      estimatedPrice: 'From ~€35/day',
      description: 'Rental or transfer',
    },
  ]
}

export default function BookingOptions({ event, onBook }: BookingOptionsProps) {
  const options = deriveOptions(event)

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Book everything in-app
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onBook(opt.type)}
            className={cn(
              'group flex flex-col items-start gap-2 rounded-xl p-3',
              'bg-[#0a3040] border border-[rgba(14,61,82,0.8)]',
              'hover:bg-[#0e3d52] hover:border-[rgba(0,212,255,0.35)]',
              'transition-all duration-150 text-left',
            )}
          >
            {/* Icon row */}
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-[rgba(0,212,255,0.1)] text-[#00d4ff] group-hover:bg-[rgba(0,212,255,0.18)] transition-colors">
              {opt.icon}
            </span>

            {/* Labels */}
            <span className="text-sm font-semibold text-white leading-tight">
              {opt.label}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight line-clamp-1">
              {opt.description}
            </span>

            {/* Price */}
            <span className="mt-auto text-[11px] font-semibold text-[#00d4ff]">
              {opt.estimatedPrice}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
