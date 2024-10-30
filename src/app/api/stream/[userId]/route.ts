import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function GET(
  request: NextRequest, 
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    const stream = await prisma.stream.findUnique({
      where: {
        userId
      },
      select: {
        streamKey: true,
        serverUrl: true,
        ingressId: true,
        isLive: true
      }
    })

    if (!stream) {
      return NextResponse.json({ streamKey: null }, { status: 404 })
    }

    return NextResponse.json({ stream })
  } catch (error) {
    console.error("[STREAM_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}