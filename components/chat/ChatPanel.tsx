'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { ChatMessage } from '@/lib/types'

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I know your music taste. Planning a trip? Tell me where you're going and I'll find you the best events." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      })
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body from chat API')
      const decoder = new TextDecoder()
      let assistantContent = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.replace('data: ', '')
          if (data === '[DONE]') break
          try {
            const { content } = JSON.parse(data)
            assistantContent += content
            setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }])
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }])
    }
    setLoading(false)
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-[#0a3040] rounded-2xl border border-[#0e3d52] shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#0e3d52]">
        <span className="text-white font-semibold text-sm">TourMap AI</span>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-white"><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-xl max-w-[90%] ${msg.role === 'user' ? 'bg-[#00d4ff] text-[#06232c]' : 'bg-[#0e3d52] text-white'}`}>
              {msg.content || <span className="opacity-50">...</span>}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-[#0e3d52] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about events..."
          className="flex-1 bg-[#06232c] text-white text-sm px-3 py-2 rounded-lg border border-[#0e3d52] outline-none focus:border-[#00d4ff] placeholder-[#94a3b8]"
        />
        <button onClick={send} disabled={loading} className="bg-[#00d4ff] text-[#06232c] p-2 rounded-lg hover:opacity-90 disabled:opacity-50">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
