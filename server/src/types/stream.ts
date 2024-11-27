export interface Stream {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  ingressId?: string | null;
  serverUrl?: string | null;
  streamKey?: string | null;
  isLive: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  userId: string;
  createdAt: string;
  description?: string | null;
  title?: string | null;
}

export interface CreateStreamDTO {
  name: string;
  thumbnailUrl?: string;
  description?: string;
  title?: string;
}

export interface UpdateStreamDTO {
  name?: string;
  thumbnailUrl?: string;
  isLive?: boolean;
  isChatEnabled?: boolean;
  isChatDelayed?: boolean;
  description?: string;
  title?: string;
} 