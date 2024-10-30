'use client'

import { useEffect, useState } from "react"
import { VideoComponent } from "./VideoComponent"
import { Skeleton } from "@/components/ui/skeleton"
import { Stream } from "@prisma/client"
import { useViewerToken } from "@/hooks/useViewerToken"
import { getSelf } from "@/lib/auth"
import { Chat, LiveKitRoom } from "@livekit/components-react"
import LiveVideoExample from "./LiveVideoExample"
import ChatExample from "./ChatExample"

// Variable de entorno o constante para controlar el modo ejemplo
const SHOW_EXAMPLE = true; // Cambia esto a false para mostrar el stream real

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
    if (SHOW_EXAMPLE) return;

    const checkStream = async () => {
      try {
        const response = await fetch(`/api/stream/${stream.userId}`)
        const data = await response.json()
        
        if (data?.stream?.isLive) {
          setIsStreamReady(true)
        } else {
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

  // Mostrar el ejemplo completo si SHOW_EXAMPLE es true
  if (SHOW_EXAMPLE) {
    return (
      <div className="h-[calc(100vh-80px)]">
        <div className="grid grid-cols-4 gap-4 h-full">
          <div className="col-span-3">
            <LiveVideoExample />
          </div>
          <div className="col-span-1 bg-card rounded-xl overflow-hidden">
            <ChatExample />
          </div>
        </div>
      </div>
    );
  }

  // A partir de aquí es la lógica del stream real
  if (!token) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-80px)]">
      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="col-span-3 flex flex-col gap-4">
          {!isStreamReady ? (
            <>
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-4 p-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            </>
          ) : (
            <LiveKitRoom
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
              className="h-full"
            >
              <div className="flex flex-col gap-4 h-full">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-background">
                  <VideoComponent 
                    hostName={user?.username || ''} 
                    hostIdentity={user?.id || ''} 
                  />
                </div>
                <div className="p-4 rounded-xl bg-card">
                  <h2 className="text-2xl font-bold mb-2">
                    {stream.name}
                  </h2>
                  <div className="flex items-center gap-x-2 mb-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      EN VIVO
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user?.username}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stream.isChatEnabled ? "Chat habilitado" : "Chat deshabilitado"}
                  </p>
                </div>
              </div>
            </LiveKitRoom>
          )}
        </div>
        <div className="col-span-1 bg-card rounded-xl">
          <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
            className="h-full"
          >
            <Chat />
          </LiveKitRoom>
        </div>
      </div>
    </div>
  )
}
