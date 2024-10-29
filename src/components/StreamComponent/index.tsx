'use client'

import { useEffect, useState } from "react"
import { VideoComponent } from "./VideoComponent"
import { useUser } from "@/hooks/useUser"
import { Skeleton } from "@/components/ui/skeleton"

interface StreamComponentProps {
  hostIdentity: string
  isHost?: boolean
}

export const StreamComponent = ({
  hostIdentity,
  isHost = false
}: StreamComponentProps) => {
  const [isStreamReady, setIsStreamReady] = useState(false)

  useEffect(() => {
    const checkStream = async () => {
      try {
        const response = await fetch(`/api/stream/${hostIdentity}`)
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
  }, [hostIdentity])

  if (!isStreamReady && !isHost) {
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
    <div className="aspect-video relative">
      <VideoComponent
        hostIdentity={hostIdentity}
        isHost={isHost}
      />
    </div>
  )
}
