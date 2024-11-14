import { StreamModel } from '@/models/stream'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const streams = await StreamModel.getLiveStreams()
    return NextResponse.json(streams)
  } catch (error) {
    console.error('Error fetching live streams:', error)
    return NextResponse.json(
      { error: 'Error fetching streams' },
      { status: 500 }
    )
  }
} 