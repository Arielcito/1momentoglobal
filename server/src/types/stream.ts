export interface Stream {
  id: string;
  name: string;
  thumbnail_url?: string | null;
  ingressId?: string | null;
  serverUrl?: string | null;
  streamKey?: string | null;
  isLive: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  userId: string;
  created_at: Date;
  description?: string | null;
  title?: string | null;
}

export interface CreateStreamDTO {
  name: string;
  thumbnail_url?: string;
  description?: string;
  title?: string;
}

export interface UpdateStreamDTO {
  name?: string;
  thumbnail_url?: string;
  isLive?: boolean;
  isChatEnabled?: boolean;
  isChatDelayed?: boolean;
  description?: string;
  title?: string;
} 