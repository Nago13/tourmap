export type EventType = 'concert' | 'sports' | 'nightclub' | 'restaurant'

export interface Artist {
  id: string
  name: string
  genre: string
  imageUrl: string
}

export interface Event {
  id: string
  type: EventType
  name: string
  artist?: string
  city: string
  country: string
  venue: string
  date: string
  lat: number
  lng: number
  imageUrl: string
  ticketUrl: string
  price?: string
}

export const DEMO_ARTISTS: Artist[] = [
  { id: '1', name: 'Radiohead', genre: 'Art Rock', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb989ed05e1f0570cc4726b2de' },
  { id: '2', name: 'Bon Iver', genre: 'Indie Folk', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebc79b69b5d99a3b54c72b7fec' },
  { id: '3', name: 'LCD Soundsystem', genre: 'Dance-Punk', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebfaa1e0ef35de0d1f0b8c0e67' },
  { id: '4', name: 'Phoebe Bridgers', genre: 'Indie Folk', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebe4f2e4d2de1ab65c2c5568e0' },
  { id: '5', name: 'Arcade Fire', genre: 'Indie Rock', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb9b4e7d9e1fb7a9e9f9c4b9e0' },
]

export const DEMO_EVENTS: Event[] = [
  { id: '1', type: 'concert', name: 'Glastonbury Festival', artist: 'Radiohead', city: 'Pilton', country: 'UK', venue: 'Glastonbury Festival', date: '2026-06-14', lat: 51.1487, lng: -2.6397, imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', ticketUrl: 'https://www.ticketmaster.co.uk', price: '£280' },
  { id: '2', type: 'concert', name: 'Primavera Sound', artist: 'Bon Iver', city: 'Barcelona', country: 'Spain', venue: 'Parc del Fòrum', date: '2026-06-05', lat: 41.4036, lng: 2.2267, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ticketUrl: 'https://www.ticketmaster.es', price: '€220' },
  { id: '3', type: 'concert', name: 'LCD Soundsystem', artist: 'LCD Soundsystem', city: 'Berlin', country: 'Germany', venue: 'Tempodrom', date: '2026-06-10', lat: 52.5009, lng: 13.3785, imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854cffd?w=400', ticketUrl: 'https://www.ticketmaster.de', price: '€75' },
  { id: '4', type: 'concert', name: 'All Points East', artist: 'Phoebe Bridgers', city: 'London', country: 'UK', venue: 'Victoria Park', date: '2026-06-20', lat: 51.5362, lng: -0.0385, imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400', ticketUrl: 'https://www.ticketmaster.co.uk', price: '£85' },
  { id: '5', type: 'concert', name: 'Rock en Seine', artist: 'Arcade Fire', city: 'Paris', country: 'France', venue: 'Domaine National de Saint-Cloud', date: '2026-08-22', lat: 48.8427, lng: 2.2219, imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400', ticketUrl: 'https://www.ticketmaster.fr', price: '€95' },
  { id: '6', type: 'sports', name: 'Champions League Final', city: 'Munich', country: 'Germany', venue: 'Allianz Arena', date: '2026-06-01', lat: 48.2188, lng: 11.6247, imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', ticketUrl: 'https://www.uefa.com/tickets', price: '€150' },
  { id: '7', type: 'sports', name: 'Wimbledon Finals', city: 'London', country: 'UK', venue: 'All England Club', date: '2026-07-13', lat: 51.4341, lng: -0.2139, imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400', ticketUrl: 'https://www.wimbledon.com/tickets', price: '£250' },
  { id: '8', type: 'sports', name: 'Tour de France - Paris Finish', city: 'Paris', country: 'France', venue: 'Champs-Élysées', date: '2026-07-26', lat: 48.8698, lng: 2.3078, imageUrl: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400', ticketUrl: 'https://www.letour.fr/tickets', price: 'Free' },
  { id: '9', type: 'concert', name: 'Melt Festival', artist: 'LCD Soundsystem', city: 'Gräfenhainichen', country: 'Germany', venue: 'Ferropolis', date: '2026-07-17', lat: 51.7256, lng: 12.4356, imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', ticketUrl: 'https://www.ticketmaster.de', price: '€120' },
  { id: '10', type: 'concert', name: 'Sonar Festival', artist: 'Arcade Fire', city: 'Barcelona', country: 'Spain', venue: 'Fira Barcelona', date: '2026-06-18', lat: 41.3757, lng: 2.1489, imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400', ticketUrl: 'https://www.sonar.es/tickets', price: '€180' },
]
