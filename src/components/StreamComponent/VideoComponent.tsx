'use client'

interface VideoComponentProps {
  streamId: string
}

export function VideoComponent({ streamId }: VideoComponentProps) {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          controls
          id={`video-${streamId}`}
        />
      </div>
    </div>
  )
}