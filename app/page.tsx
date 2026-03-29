'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DEMO_EVENTS, DEMO_ARTISTS } from '@/data/seed'
import { Event, Recommendation, BookingItem } from '@/lib/types'
import EventCard from '@/components/event-card/EventCard'
import RecommendPanel from '@/components/ai-agent/RecommendPanel'
import BookingOptions from '@/components/booking/BookingOptions'
import BookingReviewModal from '@/components/booking/BookingReviewModal'
import BookingConfirmScreen from '@/components/booking/BookingConfirmScreen'
import ChatWidget from '@/components/chat/ChatWidget'

const EventMap = dynamic(() => import('@/components/map/EventMap'), { ssr: false })

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recLoading, setRecLoading] = useState(false)
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([])
  const [showReview, setShowReview] = useState(false)
  const [confirmedBookings, setConfirmedBookings] = useState<BookingItem[] | null>(null)
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [recError, setRecError] = useState<string | null>(null)

  const personalize = async () => {
    setRecLoading(true)
    setIsPersonalized(true)
    setRecError(null)
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistNames: DEMO_ARTISTS.map(a => a.name), events: DEMO_EVENTS })
      })
      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      console.error('Failed to load recommendations:', err)
      setIsPersonalized(false)
      setRecError('Failed to load recommendations. Try again.')
    }
    setRecLoading(false)
  }

  const handleBook = (type: BookingItem['type']) => {
    if (!selectedEvent) return
    const labels = { ticket: 'Concert Ticket', flight: 'Flight', hotel: 'Hotel', car: 'Car Rental' }
    const details = { ticket: selectedEvent.venue, flight: `To ${selectedEvent.city}`, hotel: `${selectedEvent.city} — near venue`, car: `${selectedEvent.city} pickup` }
    const prices = { ticket: selectedEvent.price || '£80', flight: '£120', hotel: '£150/night', car: '£45/day' }
    setBookingItems(prev => {
      const exists = prev.find(b => b.type === type)
      if (exists) return prev
      return [...prev, { type, label: labels[type], detail: details[type], price: prices[type], url: '#' }]
    })
  }

  const confirmBookings = async () => {
    setShowReview(false)
    const confirmed = await Promise.all(bookingItems.map(async (item) => {
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingType: item.type, eventId: selectedEvent?.id, details: item })
        })
        const data = await res.json()
        return { ...item, confirmationRef: data.confirmation?.confirmationRef || 'TM' + Math.random().toString(36).substr(2,6).toUpperCase() }
      } catch (err) {
        console.error('Booking confirmation failed:', err)
        return { ...item, confirmationRef: 'TM' + Math.random().toString(36).substr(2,6).toUpperCase() }
      }
    }))
    setConfirmedBookings(confirmed)
  }

  if (confirmedBookings) {
    return <BookingConfirmScreen bookings={confirmedBookings} onClose={() => { setConfirmedBookings(null); setBookingItems([]) }} />
  }

  return (
    <div className="flex h-screen bg-[#06232c] overflow-hidden">
      {/* Left sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-[#0e3d52] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#0e3d52]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#00d4ff] rounded-lg flex items-center justify-center">
              <span className="text-[#06232c] font-bold text-sm">T</span>
            </div>
            <span className="text-white font-bold text-lg">TourMap</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a3040] rounded-lg px-3 py-2 mb-3">
            <div className="w-6 h-6 bg-[#1db954] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">♪</span>
            </div>
            <span className="text-white text-sm font-medium">Demo User</span>
            <span className="text-[#94a3b8] text-xs ml-auto">via Spotify</span>
          </div>
          <button
            onClick={personalize}
            disabled={recLoading || isPersonalized}
            className="w-full bg-[#00d4ff] text-[#06232c] font-semibold text-sm py-2 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {recLoading ? 'Analyzing your taste...' : isPersonalized ? '✓ Personalized' : 'Personalize my map'}
          </button>
          {recError && (
            <p className="text-red-400 text-xs mt-2 text-center">{recError}</p>
          )}
        </div>

        {/* Recommendations */}
        {(recommendations.length > 0 || recLoading) && (
          <div className="border-b border-[#0e3d52]">
            <RecommendPanel recommendations={recommendations} isLoading={recLoading} />
          </div>
        )}

        {/* Event list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {DEMO_EVENTS.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onClick={() => setSelectedEvent(event)}
              recommendation={recommendations.find(r => r.eventId === event.id)}
            />
          ))}
        </div>
      </div>

      {/* Main map */}
      <div className="flex-1 relative">
        <EventMap
          events={DEMO_EVENTS}
          selectedEventId={selectedEvent?.id}
          onEventSelect={setSelectedEvent}
        />

        {/* Event detail panel */}
        {selectedEvent && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#0a3040] border-t border-[#0e3d52] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-white font-bold text-lg">{selectedEvent.name}</h2>
                <p className="text-[#94a3b8] text-sm">{selectedEvent.city}, {selectedEvent.country} · {selectedEvent.date} · {selectedEvent.venue}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-[#94a3b8] hover:text-white text-xl">×</button>
            </div>
            <BookingOptions event={selectedEvent} onBook={handleBook} />
            {bookingItems.length > 0 && (
              <button
                onClick={() => setShowReview(true)}
                className="mt-3 w-full bg-[#00d4ff] text-[#06232c] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Book Everything ({bookingItems.length} items)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Booking review modal */}
      <BookingReviewModal
        isOpen={showReview}
        items={bookingItems}
        onConfirm={confirmBookings}
        onClose={() => setShowReview(false)}
      />

      {/* Chat widget */}
      <ChatWidget />
    </div>
  )
}
