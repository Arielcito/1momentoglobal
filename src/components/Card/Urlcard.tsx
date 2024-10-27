'use client'

import React from 'react'
import { Input } from '../ui/input'
import { CopyButton } from '../ui/copy-button'

interface UrlcardProps {
  serverUrl: string
}

export default function Urlcard({ serverUrl }: UrlcardProps) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Server URL
          </p>
          <CopyButton value={serverUrl} />
        </div>
        <Input value={serverUrl} disabled />
      </div>
    </div>
  )
}
