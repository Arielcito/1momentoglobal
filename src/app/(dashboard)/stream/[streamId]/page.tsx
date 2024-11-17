'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { useSession } from 'next-auth/react'

export default function StreamPage() {
  const [token, setToken] = useState("")
  const params = useParams()
  const { data: session } = useSession()
  const streamId = params.streamId as string

  useEffect(() => {
    if (!session?.user) return

    const getToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit/token?room=${streamId}`
        )
        const data = await resp.json()
        setToken(data.token)
      } catch (e) {
        console.error(e)
      }
    }

    getToken()
  }, [streamId, session?.user])

  if (token === "") {
    return <div>Loading...</div>
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      video={false}
      audio={false}
    >
      <div className="h-[calc(100vh-80px)]">
        <GridLayout tracks={[]}>
          <ParticipantTile />
        </GridLayout>
      </div>
    </LiveKitRoom>
  )
} 