import React from 'react'
import { Input } from '../ui/input'

export default function Urlcard({serverUrl}: {serverUrl: string}) {
  return (
    <div className="rounded-xl bg-muted p-4">
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
                Server URL
            </p>
            <Input value={serverUrl} disabled />
        </div>
    </div>
  )
}
