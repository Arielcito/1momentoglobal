'use client'

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Info, X } from "lucide-react"
import ChatExample from "./ChatExample"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [showInfo, setShowInfo] = useState(false)

  const handleBackClick = () => {
    // Implement your navigation logic here
    window.history.back()
  }

  const handleToggleInfo = () => {
    setShowInfo(!showInfo)
  }

  return (
    <div className="h-screen w-full relative lg:h-[calc(100vh-80px)] lg:static">
      {/* Mobile Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 lg:hidden"
        onClick={handleBackClick}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>

      {/* Info Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 lg:hidden"
        onClick={handleToggleInfo}
      >
        {showInfo ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Info className="h-6 w-6 text-white" />
        )}
      </Button>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Video Container */}
          <Card className="fixed top-0 left-0 right-0 aspect-video lg:relative lg:w-full">
            <div className="absolute inset-0 flex items-center justify-center bg-dark">
              <Skeleton className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-primary font-medium">
                  Transmisión en vivo
                </p>
              </div>
            </div>
          </Card>

          {/* Stream Info - Mobile */}
          <div className={cn(
            "fixed inset-x-0 top-[56.25vw] bottom-0 bg-background/95 backdrop-blur-sm z-40 transition-transform duration-300 lg:hidden",
            showInfo ? "translate-y-0" : "translate-y-full"
          )}>
            <Card className="h-full rounded-t-xl">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </div>

          {/* Stream Info - Desktop */}
          <Card className="hidden lg:block">
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
        <div className="fixed bottom-0 left-0 right-0 h-[40vh] lg:static lg:h-full lg:flex lg:flex-col">
          <ChatExample />
        </div>
      </div>
    </div>
  )
}
