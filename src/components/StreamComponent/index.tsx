'use client'

import { useEffect, useState } from "react"
import { VideoComponent } from "./VideoComponent"
import { useUser } from "@/hooks/useUser"
import { Skeleton } from "@/components/ui/skeleton"
import { Stream } from "@prisma/client"
import { User } from "@prisma/client"
import { useViewerToken } from "@/hooks/useViewerToken"
import { getSelf } from "@/lib/auth"
import { LiveKitRoom } from "@livekit/components-react"

interface StreamComponentProps {
  user: Awaited<ReturnType<typeof getSelf>>
  stream: Stream
}

export const StreamComponent = ({
  user,
  stream
}: StreamComponentProps) => {
  const [isStreamReady, setIsStreamReady] = useState(false)
  const {token, name, identity} = useViewerToken(stream.userId);

  useEffect(() => {
    const checkStream = async () => {
      try {
        const response = await fetch(`/api/stream/${stream.userId}`)
        const data = await response.json()
        
        if (data?.stream?.isLive) {
          setIsStreamReady(true)
        } else {
          // Check again in 3 seconds if not live
          setTimeout(checkStream, 3000)
        }
      } catch (error) {
        console.error("Error checking stream:", error)
        setIsStreamReady(false)
      }
    }

    checkStream()

    return () => {
      setIsStreamReady(false)
    }
  }, [stream.userId])

  if (!isStreamReady) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-[600px] w-full" />
        <div className="text-muted-foreground text-sm">
          Esperando que comience la transmisión...
        </div>
      </div>
    )
  }

  return (
    <>
      {token && (
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          className="grid grid-cols-1 gap-4 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"
        >
          <VideoComponent 
            hostName={user?.username || ''} 
            hostIdentity={user?.id || ''} 
          />
        </LiveKitRoom>
      )}
    </>
  )
}
