import { db } from '../db';
import { stream } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Stream, CreateStreamDTO, UpdateStreamDTO } from '../types/stream';

export const streamService = {
  async getStreamByUserId(userId: string): Promise<Stream | null> {
    const result = await db.select()
      .from(stream)
      .where(eq(stream.userId, userId));
    return result[0] || null;
  },

  async createStream(userId: string, data: CreateStreamDTO): Promise<Stream> {
    const result = await db.insert(stream)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        thumbnailUrl: data.thumbnailUrl,
        description: data.description,
        title: data.title,
        userId: userId,
        isLive: false,
        isChatEnabled: false,
        isChatDelayed: false,
        createdAt: new Date().toISOString(),

      })
      .returning();

    return result[0];
  },

  async updateStream(userId: string, data: UpdateStreamDTO): Promise<Stream> {
    const result = await db.update(stream)
      .set(data)
      .where(eq(stream.userId, userId))
      .returning();

    if (!result[0]) {
      throw new Error('Stream no encontrado');
    }

    return result[0];
  },

  async deleteStream(userId: string): Promise<void> {
    const result = await db.delete(stream)
      .where(eq(stream.userId, userId))
      .returning();
    
    if (!result[0]) {
      throw new Error('Stream no encontrado');
    }
  },

  async toggleStreamStatus(userId: string, isLive: boolean): Promise<Stream> {
        const result = await db.update(stream)
      .set({ isLive })
      .where(eq(stream.userId, userId))
      .returning();

    if (!result[0]) {
      throw new Error('Stream no encontrado');
    }

    return result[0];
  }
}; 