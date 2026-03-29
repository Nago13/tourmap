import { NextRequest } from 'next/server'
import { getOpenAI, MODEL } from "@/lib/openai"

type BookingType = 'ticket' | 'flight' | 'hotel' | 'car'

interface BookingRequest {
  bookingType: BookingType
  eventId: string
  details: Record<string, unknown>
}

interface BookingConfirmation {
  confirmationRef: string
  bookingType: BookingType
  eventId: string
  summary: string
  price: string
  details: Record<string, unknown>
  bookedAt: string
  status: 'confirmed'
}

function generateConfirmationRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = ''
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}

const executeBookingTool = {
  type: 'function' as const,
  function: {
    name: 'execute_booking',
    description:
      'Execute a booking for a ticket, flight, hotel, or car rental and return a mock confirmation. This completes the purchase in-app — no redirects.',
    parameters: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description:
            'A one-sentence confirmation summary (e.g. "1x General Admission ticket to Glastonbury Festival on 14 Jun 2026")',
        },
        price: {
          type: 'string',
          description: 'The total price including currency symbol (e.g. "£280.00")',
        },
        details: {
          type: 'object',
          description: 'Booking-type-specific details',
          properties: {
            // Ticket fields
            venue: { type: 'string', description: 'Venue name (tickets)' },
            eventDate: { type: 'string', description: 'Event date ISO string (tickets)' },
            seatInfo: {
              type: 'string',
              description: 'Seat or standing area info (tickets)',
            },
            // Flight fields
            airline: { type: 'string', description: 'Airline name (flights)' },
            flightNumber: { type: 'string', description: 'Flight number (flights)' },
            departure: { type: 'string', description: 'Departure airport & time (flights)' },
            arrival: { type: 'string', description: 'Arrival airport & time (flights)' },
            cabin: { type: 'string', description: 'Cabin class (flights)' },
            // Hotel fields
            hotelName: { type: 'string', description: 'Hotel name (hotels)' },
            checkIn: { type: 'string', description: 'Check-in date (hotels)' },
            checkOut: { type: 'string', description: 'Check-out date (hotels)' },
            roomType: { type: 'string', description: 'Room type (hotels)' },
            // Car fields
            carModel: { type: 'string', description: 'Car model/category (cars)' },
            pickupLocation: { type: 'string', description: 'Pickup location (cars)' },
            dropoffLocation: { type: 'string', description: 'Drop-off location (cars)' },
            rentalDays: { type: 'number', description: 'Number of rental days (cars)' },
          },
          additionalProperties: true,
        },
      },
      required: ['summary', 'price', 'details'],
    },
  },
}

export async function POST(request: NextRequest) {
  const { bookingType, eventId, details }: BookingRequest = await request.json()

  const systemPrompt = `You are TourMap's in-app booking engine. ALL purchases complete within the app — no external redirects, no third-party checkout pages.

When asked to book something, call the execute_booking function with realistic-looking mock confirmation data. Make the details specific and convincing:
- Use real-sounding airline codes, flight numbers, hotel names
- Prices should be realistic for the type and destination
- Dates should be coherent with a European summer 2026 festival trip
- For tickets: reference the actual venue and event
- For flights: route makes sense geographically from the user's inferred origin (assume London unless specified)
- For hotels: near the event venue, realistic hotel tier (boutique if budget suggests it)
- For cars: appropriate for the destination (e.g. compact for city, SUV for Glastonbury)

This is a mock booking — never mention "mock", "test", "demo" or "simulated" in the response. Treat it as real.`

  const userPrompt = `Execute this booking:
Type: ${bookingType}
Event ID: ${eventId}
User-provided details: ${JSON.stringify(details, null, 2)}

Call execute_booking with the confirmation data.`

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    tools: [executeBookingTool],
    tool_choice: { type: 'function', function: { name: 'execute_booking' } },
    temperature: 0.4,
  })

  const toolCall = response.choices[0].message.tool_calls?.[0]
  if (!toolCall || toolCall.function.name !== 'execute_booking') {
    return new Response(
      JSON.stringify({ error: 'Booking engine failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let bookingData: { summary: string; price: string; details: Record<string, unknown> }
  try {
    bookingData = JSON.parse(toolCall.function.arguments)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid booking response format' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const confirmation: BookingConfirmation = {
    confirmationRef: generateConfirmationRef(),
    bookingType,
    eventId,
    summary: bookingData.summary,
    price: bookingData.price,
    details: bookingData.details,
    bookedAt: new Date().toISOString(),
    status: 'confirmed',
  }

  return Response.json({ confirmation })
}
