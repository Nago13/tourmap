'use client'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import ChatPanel from './ChatPanel'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#00d4ff] text-[#06232c] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
