'use client'
import { Recommendation } from '@/lib/types'
import { DEMO_EVENTS } from '@/data/seed'

interface Props {
  recommendations: Recommendation[]
  isLoading: boolean
}

export default function RecommendPanel({ recommendations, isLoading }: Props) {
  if (isLoading) return (
    <div className="p-4 text-[#94a3b8] animate-pulse">AI is analyzing your taste...</div>
  )
  if (!recommendations.length) return null
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-semibold text-[#00d4ff] uppercase tracking-wider">AI Picks for You</h3>
      {recommendations.map((rec) => {
        const event = DEMO_EVENTS.find(e => e.id === rec.eventId)
        if (!event) return null
        return (
          <div key={rec.eventId} className="bg-[#0a3040] rounded-lg p-3 border border-[#0e3d52]">
            <div className="flex justify-between items-start mb-1">
              <span className="text-white font-medium text-sm">{event.name}</span>
              <span className="text-[#00d4ff] text-xs font-bold">{rec.matchScore}%</span>
            </div>
            <p className="text-[#94a3b8] text-xs leading-relaxed">{rec.reason}</p>
          </div>
        )
      })}
    </div>
  )
}
