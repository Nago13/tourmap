export type { EventType, Artist, Event } from '../data/seed'

export interface Recommendation {
  eventId: string
  rank: number
  reason: string
  matchScore: number
}

export interface BookingItem {
  type: 'ticket' | 'flight' | 'hotel' | 'car'
  label: string
  detail: string
  price: string
  url: string
  confirmationRef?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
