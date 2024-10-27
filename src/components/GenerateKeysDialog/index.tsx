'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createIngress } from '@/actions/ingress'
import { IngressInput } from 'livekit-server-sdk'
import toast from 'react-hot-toast'

export function GenerateKeysDialog() {
  const [protocol, setProtocol] = React.useState<string>('')
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const onSubmit = () => {
    startTransition(async () => {
       createIngress(protocol as unknown as IngressInput).then(() => {
        toast.success("Keys generated successfully")
        setOpen(false)
       }).catch((error) => {
        console.error(error)
       })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Generate new keys
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Streaming Keys</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={protocol} onValueChange={setProtocol}>
            <SelectTrigger>
              <SelectValue placeholder="Select streaming protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WHIP">WHIP</SelectItem>
              <SelectItem value="RTMP">RTMP</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!protocol}>
              Generate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
