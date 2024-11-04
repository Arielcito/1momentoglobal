'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useState } from "react"

interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: Date
  isModerator?: boolean
  isCurrentUser?: boolean
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: '¿Qué opinas sobre el soporte en 1.0850 de EUR/USD?',
    sender: 'TradingPro',
    timestamp: new Date(Date.now() - 360000),
    isModerator: true,
  },
  {
    id: '2',
    content: 'El mercado está muy volátil hoy',
    sender: 'MarketWatcher',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    content: '¿Alguien más siguió la señal de GBP/JPY?',
    sender: 'ForexTrader',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '4',
    content: 'Excelente análisis del mercado asiático 👏',
    sender: 'AsiaTrader',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '5',
    content: 'Mantengamos el stop loss ajustado en esta operación',
    sender: 'TradingPro',
    timestamp: new Date(Date.now() - 30000),
    isModerator: true,
  },
]

export default function ChatExample() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'Tú',
      timestamp: new Date(),
      isCurrentUser: true,
    }

    setMessages([...messages, newMessage])
    setMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat en vivo</h3>
        <p className="text-xs text-muted-foreground">432 espectadores</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {msg.sender[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${msg.isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    msg.isModerator ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {msg.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.isCurrentUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t flex items-center gap-2"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Envía un mensaje..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
