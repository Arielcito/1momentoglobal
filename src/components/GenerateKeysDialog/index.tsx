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

const RTMP = String(IngressInput.RTMP_INPUT)
const WHIP = String(IngressInput.WHIP_INPUT)

type IngressType = typeof RTMP | typeof WHIP

interface GenerateKeysDialogProps {
  onSuccess?: () => void;
}

export function GenerateKeysDialog({ onSuccess }: GenerateKeysDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const res = await createIngress()
        console.log(res)
        toast.success("Keys generated successfully")
        setOpen(false)
        onSuccess?.() // Call the refetch function after successful generation
      } catch (error) {
        console.error(error)
        toast.error("Failed to generate keys")
      }
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select streaming protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WHIP">WHIP</SelectItem>
              <SelectItem value="RTMP">RTMP</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}