'use client'

import { Music, Trophy, MapPin, Calendar, Ticket } from 'lucide-react'
import { cn, formatDate, formatPrice, getEventColorClass } from '@/lib/utils'
import type { Event, Recommendation } from '@/lib/types'

interface EventCardProps {
  event: Event
  isSelected: boolean
  onClick: () => void
  recommendation?: Recommendation
}

export default function EventCard({
  event,
  isSelected,
  onClick,
  recommendation,
}: EventCardProps) {
  const isConcert = event.type === 'concert'
  const isSports = event.type === 'sports'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl overflow-hidden transition-all duration-200',
        'bg-[#0a3040] border',
        'hover:bg-[#0e3d52] hover:scale-[1.015]',
        isSelected
          ? 'border-[#00d4ff] shadow-[0_0_16px_rgba(0,212,255,0.3)]'
          : 'border-[rgba(14,61,82,0.6)] hover:border-[rgba(0,212,255,0.4)]',
      )}
    >
      {/* Image strip */}
      <div className="relative h-28 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a3040] via-[rgba(10,48,64,0.4)] to-transparent" />

        {/* Event type badge */}
        <span
          className={cn(
            'absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
            getEventColorClass(event.type),
          )}
        >
          {isConcert && <Music className="h-2.5 w-2.5" />}
          {isSports && <Trophy className="h-2.5 w-2.5" />}
          {event.type}
        </span>

        {/* Price badge */}
        {event.price && (
          <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-[rgba(0,0,0,0.55)] px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Ticket className="h-2.5 w-2.5 text-[#00d4ff]" />
            {formatPrice(event.price)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pt-2.5 pb-3 space-y-1.5">
        {/* Event name */}
        <p className="text-sm font-semibold text-white leading-tight line-clamp-1">
          {event.name}
        </p>

        {/* Artist (concerts only) */}
        {event.artist && (
          <p className="text-xs text-[#00d4ff] font-medium line-clamp-1">
            {event.artist}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
            <span className="truncate">{event.city}, {event.country}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar className="h-3 w-3 text-slate-500" />
            {formatDate(event.date, 'MMM d')}
          </span>
        </div>

        {/* Venue */}
        <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight">
          {event.venue}
        </p>

        {/* Recommendation badge */}
        {recommendation && (
          <div className="mt-2 rounded-lg bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] px-2.5 py-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00d4ff]">
                AI Match
              </span>
              <span className="text-[11px] font-bold text-[#00d4ff]">
                {recommendation.matchScore}%
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug line-clamp-1">
              {recommendation.reason}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}
