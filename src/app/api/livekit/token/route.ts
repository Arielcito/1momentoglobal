import { AccessToken } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  console.log("[LIVEKIT_TOKEN] Starting token generation")
  
  try {
    const session = await getServerSession(authOptions)
    console.log("[LIVEKIT_TOKEN] Session:", session?.user?.email)
    
    if (!session?.user) {
      console.log("[LIVEKIT_TOKEN] Unauthorized - No session found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const room = searchParams.get('room')
    const username = session.user.name
    
    console.log("[LIVEKIT_TOKEN] Request params:", { room, username })

    if (!room) {
      console.log("[LIVEKIT_TOKEN] Missing room parameter")
      return new NextResponse("Missing 'room' query parameter", { status: 400 })
    }

    // Validar configuración de LiveKit
    console.log("[LIVEKIT_TOKEN] LiveKit Config:", {
      apiKey: process.env.LIVEKIT_API_KEY ? "Set" : "Not set",
      apiSecret: process.env.LIVEKIT_API_SECRET ? "Set" : "Not set"
    })

    // Create a new token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY || '',
      process.env.LIVEKIT_API_SECRET || '',
      {
        identity: session.user.id,
        name: username || 'anonymous',
      }
    )

    at.addGrant({ 
      room,
      roomJoin: true,
      canPublish: false,
      canPublishData: true 
    })

    const token = at.toJwt()
    console.log("[LIVEKIT_TOKEN] Token generated successfully")

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[LIVEKIT_TOKEN] Error generating token:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    )
  }
} 