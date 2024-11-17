'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { StreamPlayer, StreamSkeleton } from '@/components/StreamComponent/StreamPlayer'
import { useQuery } from 'react-query'

export default function StreamPage() {
  const params = useParams()
  const { data: session } = useSession()
  const streamId = params.streamId as string

 

  const { data: streamData, isLoading } = useQuery(
    ['stream', streamId],
    async () => {
      const res = await fetch(`/api/streams/${streamId}`)
      if (!res.ok) throw new Error('Failed to fetch stream')
      return res.json()
    },
    {
      enabled: !!streamId
    }
  )

  const { data: tokenData } = useQuery(
    ['stream-token', streamData?.roomName],
    async () => {
      const res = await fetch(`/api/livekit/token?room=${streamData?.roomName}`)
      if (!res.ok) throw new Error('Failed to fetch token')
      return res.json()
    },
    {
      enabled: !!session?.user && !!streamData?.roomName
    }
  )
  if (isLoading || !tokenData || !streamData) {
    return <StreamSkeleton />
  }

  const isHost = streamData.userId === session?.user?.id

  return (
    <StreamPlayer
      streamId={streamData.id}
      token={tokenData.token}
      hostName={streamData.user.name}
      hostImage={streamData.user.image}
      title={streamData.title}
      description={streamData.description}
      viewerCount={0}
      isHost={isHost}
    />
  )
} 