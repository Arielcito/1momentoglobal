'use client'

import React from 'react'
import { Input } from '../ui/input'
import { CopyButton } from '../ui/copy-button'
import { useQuery } from 'react-query'

interface StreamcardProps {
  userId: string
}

const fetchStreamKey = async (userId: string) => {
  const response = await fetch(`/api/stream/${userId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return data.streamKey ?? 'No disponible'
}

export default function Streamcard({ userId }: StreamcardProps) {
  const { data: streamKey = 'Cargando...', isLoading } = useQuery(['streamKey', userId], () => fetchStreamKey(userId))

  return (
    <div className="rounded-xl bg-muted p-4 mt-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Stream Key
          </p>
          <CopyButton value={streamKey} />
        </div>
        <Input 
          value={isLoading ? 'Cargando...' : streamKey} 
          disabled 
          type="password"
        />
      </div>
    </div>
  )
}
