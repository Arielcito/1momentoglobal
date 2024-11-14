'use client'

import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar
} from '@livekit/components-react'

interface StreamPageProps {
  params: {
    streamId: string
  }
}

export default function StreamPage({ params }: StreamPageProps) {
  const { status } = useSession()
  const router = useRouter()

  const { data: stream, isLoading } = useQuery(
    ['stream', params.streamId],
    async () => {
      const res = await fetch(`/api/stream/${params.streamId}`)
      if (!res.ok) throw new Error('Failed to fetch stream')
      return res.json()
    }
  )

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!stream?.isLive) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-white">Stream no disponible</h1>
        <p className="text-zinc-400">Este stream no está en vivo actualmente</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={stream.token}
      connect={true}
      video={false}
      audio={false}
    >
      <div className="h-full flex flex-col">
        <VideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </LiveKitRoom>
  )
} 