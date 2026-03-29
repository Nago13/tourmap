'use client'

import { X, Ticket, Plane, Hotel, Car, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingItem } from '@/lib/types'

interface BookingReviewModalProps {
  isOpen: boolean
  items: BookingItem[]
  onConfirm: () => void
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

function itemColor(type: BookingItem['type']) {
  switch (type) {
    case 'ticket':
      return 'bg-violet-600/20 text-violet-400'
    case 'flight':
      return 'bg-sky-600/20 text-sky-400'
    case 'hotel':
      return 'bg-amber-600/20 text-amber-400'
    case 'car':
      return 'bg-emerald-600/20 text-emerald-400'
  }
}

export default function BookingReviewModal({
  isOpen,
  items,
  onConfirm,
  onClose,
}: BookingReviewModalProps) {
  if (!isOpen) return null

  const total = items.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[^0-9.]/g, ''))
    return isNaN(num) ? sum : sum + num
  }, 0)

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(3, 22, 29, 0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Card */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl',
          'bg-[#06232c] border border-[rgba(14,61,82,0.9)]',
          'shadow-[0_24px_80px_rgba(0,0,0,0.6)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[rgba(14,61,82,0.6)]">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Review Your Bookings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#0a3040] text-slate-400 hover:text-white hover:bg-[#0e3d52] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="px-6 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">
              No booking items selected yet.
            </p>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-[#0a3040] border border-[rgba(14,61,82,0.6)] p-3"
              >
                {/* Icon */}
                <span
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-lg shrink-0 mt-0.5',
                    itemColor(item.type),
                  )}
                >
                  {itemIcon(item.type)}
                </span>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                    {item.detail}
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm font-bold text-[#00d4ff] shrink-0 self-center">
                  {item.price}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pt-3 pb-5 border-t border-[rgba(14,61,82,0.6)] space-y-3">
          {/* Total */}
          {total > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Estimated total</span>
              <span className="text-white font-bold">
                ~{items[0]?.price?.match(/[£€$]/) ?? '€'}{Math.round(total).toLocaleString()}
              </span>
            </div>
          )}

          {/* AI notice */}
          <div className="flex items-center gap-2 rounded-lg bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.15)] px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-[#00d4ff] shrink-0" />
            <p className="text-[11px] text-slate-300 leading-snug">
              AI will handle all bookings simultaneously and send you confirmations.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-semibold',
                'bg-[#0a3040] border border-[rgba(14,61,82,0.8)] text-slate-300',
                'hover:bg-[#0e3d52] hover:text-white transition-colors',
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={items.length === 0}
              className={cn(
                'flex-[2] flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold',
                'bg-[#00d4ff] text-[#03161d]',
                'hover:bg-[#00bde8] active:bg-[#00a8d0]',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                'transition-colors shadow-[0_0_20px_rgba(0,212,255,0.3)]',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Confirm — Let AI Book Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
