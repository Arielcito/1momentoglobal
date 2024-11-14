'use client'

import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar
} from '@livekit/components-react'
import LiveVideoExample from '@/components/StreamComponent/LiveVideoExample'

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
    return <LiveVideoExample />
  }

  if (!stream?.isLive) {
    return <LiveVideoExample />
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