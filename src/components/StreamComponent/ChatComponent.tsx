'use client'


import { useChat } from '@/hooks/useChat'
import { useState, useRef, useEffect } from 'react'

interface ChatComponentProps {
  streamId: string
}

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
}

export function ChatComponent({ streamId }: ChatComponentProps) {
  const [message, setMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage } = useChat(streamId)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(message)
    setMessage('')
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-card rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <p className="text-sm font-medium">{msg.sender}</p>
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}
