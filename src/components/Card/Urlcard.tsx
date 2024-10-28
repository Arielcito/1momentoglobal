'use client'

import React from 'react'
import { Input } from '../ui/input'
import { CopyButton } from '../ui/copy-button'
import { useQuery } from 'react-query'

interface UrlcardProps {
  userId: string
}

const fetchServerUrl = async (userId: string) => {
  const response = await fetch(`/api/stream/${userId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return data.serverUrl ?? 'No disponible'
}

export default function Urlcard({ userId }: UrlcardProps) {
  const { data: serverUrl = 'Cargando...', isLoading } = useQuery(['serverUrl', userId], () => fetchServerUrl(userId))

  return (
    <div className="rounded-xl bg-muted p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Server URL
          </p>
          <CopyButton value={serverUrl} />
        </div>
        <Input value={isLoading ? 'Cargando...' : serverUrl} disabled />
      </div>
    </div>
  )
}
