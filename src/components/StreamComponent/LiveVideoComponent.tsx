"use client";

import React, { useRef } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

interface LiveVideoComponentProps {
  participant: Participant;
}

export default function LiveVideoComponent({
  participant,
}: LiveVideoComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]).filter((track) => track.participant.identity === participant.identity)
  .forEach((track) => {
   if(videoRef.current) {
    track.publication.track?.attach(videoRef.current);
   }
  });

  return (
    <div ref={wrapperRef} className="aspect-video relative">
      <video ref={videoRef} width={320} height={240} />
    </div>
  );
}
