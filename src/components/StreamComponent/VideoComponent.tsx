'use client'

import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  useConnectionState,
  useRemoteParticipants,
  useRemoteParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import LiveVideoComponent from "./LiveVideoComponent";
import { Track } from "livekit-client";
import OfflineStreamComponent from "./OfflineStreamComponent";

interface VideoComponentProps {
  hostIdentity: string;
  hostName: string;
  thumbnailUrl?: string;
}

export function VideoComponent({ 
  hostIdentity,
  hostName,
  thumbnailUrl
}: VideoComponentProps) {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(
    hostIdentity
  );
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]).filter((track) => track.participant.identity === hostIdentity);

  if (tracks.length === 0) {
    return (
      <OfflineStreamComponent 
        username={hostName}
        thumbnailUrl={thumbnailUrl}
      />
    );
  }

  
  return (
    <div>
      {participant && <LiveVideoComponent participant={participant} />}  
    </div>
  );
}
