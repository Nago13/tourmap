import { NextRequest } from 'next/server'
import { getOpenAI, MODEL } from "@/lib/openai"
import type { ChatMessage, Event } from '@/lib/types'

export async function POST(request: NextRequest) {
  const {
    messages,
    userTaste,
    currentEvents,
  }: {
    messages: ChatMessage[]
    userTaste?: string
    currentEvents?: Event[]
  } = await request.json()

  const eventSummary = (currentEvents ?? [])
    .map(
      (e) =>
        `- ${e.name}${e.artist ? ` (${e.artist})` : ''} | ${e.city}, ${e.country} | ${e.date} | ${e.price ?? 'TBC'}`
    )
    .join('\n')

  const systemPrompt = `You are a deeply knowledgeable travel concierge for Vibe Trip — a service that combines live music events with trip planning. You know this user intimately through their listening habits.

USER'S MUSIC TASTE:
${userTaste ?? 'Not provided'}

EVENTS CURRENTLY IN THEIR MAP:
${eventSummary || 'No events loaded'}

YOUR PERSONALITY & APPROACH:
- You speak like a brilliant friend who's been to every festival in Europe and happens to have a PhD in music
- You make specific, personal observations — never generic advice like "it depends on your budget"
- You connect dots: "if you're going to Glastonbury for Radiohead you'd be a fool not to stay an extra day for..."
- You remember the full conversation context and build on it
- You give opinions when asked. Don't hedge everything
- Practical travel details (train times, hotel areas, ticket tips) mixed naturally with cultural context
- If the user asks about booking, remind them they can book tickets, flights, hotels, and cars directly in Vibe Trip without leaving the app
- Keep responses conversational and readable — no walls of text, use line breaks naturally
- Be specific about dates, venues, neighbourhoods, logistics

You are NOT a generic travel bot. You know this person's music taste and you tailor everything to it.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamResponse = await getOpenAI().chat.completions.create({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          temperature: 0.8,
          max_tokens: 1024,
        })

        for await (const chunk of streamResponse) {
          const delta = chunk.choices[0]?.delta?.content
          if (delta) {
            const ssePayload = `data: ${JSON.stringify({ content: delta })}\n\n`
            controller.enqueue(encoder.encode(ssePayload))
          }

          if (chunk.choices[0]?.finish_reason) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          }
        }
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : 'Stream error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMessage })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
