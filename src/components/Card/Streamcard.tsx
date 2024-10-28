'use client'

import React from 'react'
import { Input } from '../ui/input'
import { CopyButton } from '../ui/copy-button'
import { useQuery } from 'react-query'
import { STREAM_KEYS } from '@/lib/constants'

interface StreamcardProps {
  streamKey: string
  isLoading: boolean
}


export default function Streamcard({  streamKey, isLoading }: StreamcardProps) {

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
