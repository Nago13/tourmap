'use client'

import { CheckCircle2, Ticket, Plane, Hotel, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingItem } from '@/lib/types'

interface BookingConfirmScreenProps {
  bookings: BookingItem[]
  onClose: () => void
}

function itemIcon(type: BookingItem['type']) {
  switch (type) {
    case 'ticket':
      return <Ticket className="h-4 w-4" />
    case 'flight':
      return <Plane className="h-4 w-4" />
    case 'hotel':
      return <Hotel className="h-4 w-4" />
    case 'car':
      return <Car className="h-4 w-4" />
  }
}

function itemAccentColor(type: BookingItem['type']): string {
  switch (type) {
    case 'ticket':
      return 'text-violet-400'
    case 'flight':
      return 'text-sky-400'
    case 'hotel':
      return 'text-amber-400'
    case 'car':
      return 'text-emerald-400'
    default:
      return ''
  }
}

function itemBg(type: BookingItem['type']): string {
  switch (type) {
    case 'ticket':
      return 'bg-violet-600/15 border-violet-600/25'
    case 'flight':
      return 'bg-sky-600/15 border-sky-600/25'
    case 'hotel':
      return 'bg-amber-600/15 border-amber-600/25'
    case 'car':
      return 'bg-emerald-600/15 border-emerald-600/25'
    default:
      return ''
  }
}

export default function BookingConfirmScreen({
  bookings,
  onClose,
}: BookingConfirmScreenProps) {
  return (
    <div className="flex flex-col items-center w-full h-full px-4 py-8 overflow-y-auto">
      {/* Success icon — animate in */}
      <div className="flex flex-col items-center gap-4 mb-8 animate-in fade-in zoom-in-75 duration-500">
        <div className="relative flex items-center justify-center h-20 w-20">
          {/* Glow ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-emerald-500/10" />
          <CheckCircle2 className="relative h-12 w-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Your trip is booked!
          </h1>
          <p className="text-sm text-slate-400">
            All {bookings.length} item{bookings.length !== 1 ? 's' : ''} confirmed. Check your email for details.
          </p>
        </div>
      </div>

      {/* Booking confirmations list */}
      <div className="w-full max-w-lg space-y-3">
        {bookings.map((booking, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-xl border p-4 flex items-start gap-3',
              'animate-in fade-in slide-in-from-bottom-4',
              itemBg(booking.type),
            )}
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Icon */}
            <span className={cn('mt-0.5 shrink-0', itemAccentColor(booking.type))}>
              {itemIcon(booking.type)}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white leading-tight">
                  {booking.label}
                </p>
                <span className="text-sm font-bold text-white shrink-0">
                  {booking.price}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {booking.detail}
              </p>

              {/* Confirmation ref */}
              {booking.confirmationRef && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                    Ref
                  </span>
                  <code className="text-[11px] font-mono font-semibold text-[#00d4ff] bg-[rgba(0,212,255,0.08)] px-1.5 py-0.5 rounded">
                    {booking.confirmationRef}
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Done button */}
      <div className="mt-8 w-full max-w-lg">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'w-full rounded-xl py-3 text-sm font-bold',
            'bg-[#00d4ff] text-[#03161d]',
            'hover:bg-[#00bde8] active:bg-[#00a8d0]',
            'transition-colors shadow-[0_0_20px_rgba(0,212,255,0.25)]',
          )}
        >
          Done
        </button>
      </div>
    </div>
  )
}
