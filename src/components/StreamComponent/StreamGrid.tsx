'use client'

import { Stream } from '@prisma/client'
import { useQuery } from 'react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export const StreamGrid = () => {
  const router = useRouter()
  
  const { data: streams, isLoading } = useQuery<Stream[]>(
    'live-streams',
    async () => {
      const res = await fetch('/api/streams/live')
      if (!res.ok) throw new Error('Failed to fetch streams')
      return res.json()
    }
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-zinc-800/50 rounded-lg h-48"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams?.map((stream) => (
        <Card 
          key={stream.id}
          className="bg-zinc-900 border-zinc-800 hover:border-primary transition-colors cursor-pointer"
          onClick={() => router.push(`/stream/${stream.id}`)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">
                {stream.title || 'Stream sin título'}
              </h3>
              {stream.isLive && (
                <Badge 
                  variant="destructive"
                  className="animate-pulse bg-red-500"
                >
                  EN VIVO
                </Badge>
              )}
            </div>
            <p className="text-zinc-400 text-sm line-clamp-2">
              {stream.description || 'Sin descripción'}
            </p>
            <div className="mt-4 flex items-center text-sm text-zinc-500">
              <span>Por {stream.name}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 