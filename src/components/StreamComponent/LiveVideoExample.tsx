'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChatExample from "./ChatExample"

const MOCK_STREAM = {
  id: '1',
  name: 'Análisis de Mercado en Vivo',
  description: 'Hoy analizaremos los principales pares de divisas y las oportunidades que nos presenta el mercado. Además, revisaremos las estrategias más efectivas para trading intradiario.',
  isLive: true,
  viewerCount: 432,
  user: {
    id: '1',
    username: 'TradingPro',
    image: '/avatars/trader.png'
  }
}

export default function LiveVideoExample() {
  return (
    <div className="h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Video and Info Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Video Player */}
          <div className="aspect-video relative rounded-xl overflow-hidden bg-background">
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Skeleton className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Transmisión en vivo
                </p>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="p-4 rounded-xl bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={MOCK_STREAM.user.image} />
                  <AvatarFallback>{MOCK_STREAM.user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">
                    {MOCK_STREAM.name}
                  </h2>
                  <div className="flex items-center gap-2 my-2">
                    <Badge variant="destructive" className="animate-pulse">
                      EN VIVO
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {MOCK_STREAM.user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {MOCK_STREAM.viewerCount} espectadores
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {MOCK_STREAM.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Column */}
          <div className="h-full flex flex-col">
              <ChatExample />
          </div>
        </div>
    </div>
  )
}
