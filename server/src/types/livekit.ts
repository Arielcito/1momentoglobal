import type { ParticipantPermission } from 'livekit-server-sdk';
import type { Request, Response } from 'express';

export interface StreamMetadata {
  creator_identity: string;
  enable_chat: boolean;
  allow_participation: boolean;
}

export interface StreamRequest {
  room_name?: string;
  metadata?: StreamMetadata;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export interface StreamResponse {
  room_name: string;
  token: string;
  ws_url: string;
}

export interface ParticipantRequest {
  room_name: string;
  identity: string;
  permissions?: ParticipantPermission[];
} 