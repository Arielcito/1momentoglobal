import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LiveKit } from 'livekit-server-sdk'

const livekit = new LiveKit(
  process.env.LIVEKIT_API_URL || '',
  process.env.LIVEKIT_API_KEY || '',
  process.env.LIVEKIT_API_SECRET || ''
)

export async function POST(req: Request) {
  console.log("[STREAMS_POST] Starting stream creation process")
  
  try {
    const session = await getServerSession(authOptions)
    console.log("[STREAMS_POST] Session:", session?.user?.email)
    
    if (!session?.user) {
      console.log("[STREAMS_POST] Unauthorized - No session found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title } = body
    console.log("[STREAMS_POST] Received title:", title)

    // Validar configuración de LiveKit
    console.log("[STREAMS_POST] LiveKit Config:", {
      url: process.env.LIVEKIT_API_URL ? "Set" : "Not set",
      apiKey: process.env.LIVEKIT_API_KEY ? "Set" : "Not set",
      apiSecret: process.env.LIVEKIT_API_SECRET ? "Set" : "Not set"
    })
    
    // Crear el ingress
    console.log("[STREAMS_POST] Creating LiveKit ingress")
    const ingress = await livekit.createIngress('whip', {
      name: title,
      roomName: title,
    })
    console.log("[STREAMS_POST] Ingress created:", ingress)

    if (!ingress || !ingress.url || !ingress.streamKey) {
      console.error("[STREAMS_POST] Invalid ingress response:", ingress)
      throw new Error("Failed to create ingress")
    }

    // Crear el stream en la base de datos
    console.log("[STREAMS_POST] Creating stream in database")
    const stream = await db.stream.create({
      data: {
        title,
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
        userId: session.user.id,
      }
    })
    console.log("[STREAMS_POST] Stream created in database:", stream)

    return NextResponse.json(stream)
  } catch (error) {
    console.error("[STREAMS_POST] Error details:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    )
  }
} 