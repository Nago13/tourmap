import { NextRequest } from 'next/server'
import { getOpenAI, MODEL } from "@/lib/openai"
import type { Event, Recommendation } from '@/lib/types'

export async function POST(request: NextRequest) {
  const { artistNames, events }: { artistNames: string[]; events: Event[] } =
    await request.json()

  const systemPrompt = `You are a music taste analyst and live events expert. The user's Spotify listening history features these artists prominently: ${artistNames.join(', ')}.

Your job is to rank a list of events by how well they match this specific listener's taste. Be insightful and specific — not generic. Reference actual signals in their listening history:
- Genre patterns and subgenre nuances (e.g. "art rock with post-rock tendencies" not just "rock")
- Catalog depth vs recency bias (do they stream mostly classic albums or new releases?)
- Festival mentality vs intimate venue preference implied by the artist mix
- Cross-genre connections (e.g. a Bon Iver fan who also listens to LCD Soundsystem suggests appreciation for emotionally complex, production-forward music)
- Surprise connections: "Phoebe Bridgers fans who stream OK Computer tend to prioritize emotional arc over spectacle"

Return a JSON array of recommendations with NO additional text.`

  const eventList = events
    .map(
      (e) =>
        `ID: ${e.id} | ${e.name}${e.artist ? ` (${e.artist})` : ''} | ${e.type} | ${e.city}, ${e.country} | ${e.venue} | ${e.date} | ${e.price ?? 'Price TBC'}`
    )
    .join('\n')

  const userPrompt = `Here are the available events:

${eventList}

Rank ALL ${events.length} events for this listener. Return a JSON array (no markdown, no code fences) where each item has:
- eventId: string (matching the ID above)
- rank: number (1 = best match, ${events.length} = worst)
- reason: string (2-3 sentences, specific to THIS listener's taste, not generic — reference their actual artists and what that implies about them)
- matchScore: number (0-100)

Order the array from rank 1 to rank ${events.length}.`

  let response
  try {
    response = await getOpenAI().chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })
  } catch (err) {
    console.error('OpenAI request failed:', err)
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const raw = response.choices[0].message.content ?? '{}'

  let recommendations: Recommendation[]
  try {
    const parsed = JSON.parse(raw)
    // Handle both { recommendations: [...] } and bare array responses
    recommendations = Array.isArray(parsed)
      ? parsed
      : (parsed.recommendations ?? parsed.events ?? Object.values(parsed)[0])
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return Response.json({ recommendations })
}
