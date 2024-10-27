'use client'

import { useState } from 'react'

import { VideoComponent } from './VideoComponent'
import { ChatComponent } from './ChatComponent'

interface StreamComponentProps {
  streamId: string
  protocol?: string
}

export function StreamComponent({ streamId, protocol = 'whip' }: StreamComponentProps) {
  const [isChatOpen, setIsChatOpen] = useState(true)

  const handleToggleChat = () => setIsChatOpen(!isChatOpen)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
      <div className={`${isChatOpen ? 'lg:col-span-9' : 'lg:col-span-12'} h-full`}>
        <VideoComponent streamId={streamId} protocol={protocol} />
        <button
          onClick={handleToggleChat}
          className="lg:hidden fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          <ChatIcon className="h-6 w-6" />
        </button>
      </div>
      {isChatOpen && (
        <div className="lg:col-span-3 h-full">
          <ChatComponent streamId={streamId} />
        </div>
      )}
    </div>
  )
}

const ChatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
