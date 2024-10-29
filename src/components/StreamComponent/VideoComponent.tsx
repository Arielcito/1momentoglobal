'use client'

import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { createViewerToken, createHostToken } from "@/actions/token";

interface VideoComponentProps {
  hostIdentity: string;
  isHost?: boolean;
}

export function VideoComponent({ 
  hostIdentity,
  isHost = false 
}: VideoComponentProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = isHost 
          ? await createHostToken(hostIdentity)
          : await createViewerToken(hostIdentity);
        
        setToken(token);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    getToken();
  }, [hostIdentity, isHost]);

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      className="h-[calc(100vh-80px)]"
      data-lk-theme="default"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
