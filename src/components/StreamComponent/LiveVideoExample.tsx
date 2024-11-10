'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
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
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Video Container */}
          <Card className="aspect-video relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-dark">
              <Skeleton className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-primary font-medium">
                  Transmisión en vivo
                </p>
              </div>
            </div>
          </Card>

          {/* Stream Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary">
                    <AvatarImage src={MOCK_STREAM.user.image} alt={MOCK_STREAM.user.username} />
                    <AvatarFallback className="bg-dark text-primary">
                      {MOCK_STREAM.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {MOCK_STREAM.name}
                    </h2>
                    <div className="flex items-center gap-2 my-2">
                      <Badge 
                        variant="destructive" 
                        className="animate-breathing bg-primary text-primary-foreground"
                      >
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
            </CardContent>
          </Card>
        </div>

        {/* Chat Column */}
        <div className="h-full flex flex-col">
          <ChatExample />
        </div>
      </div>
    </div>
  )
}
