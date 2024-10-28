import { prisma } from "@/lib/prisma"
import { WebhookReceiver } from "livekit-server-sdk"
import { headers } from "next/headers"
import { NextRequest } from "next/server"

import { NextResponse } from "next/server"

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headerPayload = headers()
  const authorization = headerPayload.get('Authorization')

  if(!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const event = await receiver.receive(body, authorization);

  if(event.event === 'ingress_started') {
    await prisma.stream.update({
      where: {
        ingressId: event.ingressInfo?.ingressId
      },
      data: {
        isLive: true
      }
    })
  }

  if(event.event === 'ingress_ended') {
    await prisma.stream.update({
      where: {
        ingressId: event.ingressInfo?.ingressId
      },
      data: {
        isLive: false
      }
    })
  }

  return NextResponse.json({ message: 'Webhook received' })
}
