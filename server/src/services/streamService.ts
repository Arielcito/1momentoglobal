import pool from '../config/database';
import type { Stream, CreateStreamDTO, UpdateStreamDTO } from '../types/stream';

export const streamService = {
  async getStreamByUserId(userId: string): Promise<Stream | null> {
    const result = await pool.query(
      'SELECT * FROM "Stream" WHERE "userId" = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async createStream(userId: string, data: CreateStreamDTO): Promise<Stream> {
    const { name, thumbnail_url, description, title } = data;
    
    const result = await pool.query(
      `INSERT INTO "Stream" (
        id,
        name,
        thumbnail_url,
        description,
        title,
        "userId",
        "isLive",
        "isChatEnabled",
        "isChatDelayed"
      ) VALUES (
        gen_random_uuid(),
        $1, $2, $3, $4, $5,
        false, false, false
      )
      RETURNING *`,
      [name, thumbnail_url, description, title, userId]
    );

    return result.rows[0];
  },

  async updateStream(userId: string, data: UpdateStreamDTO): Promise<Stream> {
    const {
      name,
      thumbnail_url,
      isLive,
      isChatEnabled,
      isChatDelayed,
      description,
      title
    } = data;

    const result = await pool.query(
      `UPDATE "Stream"
       SET name = COALESCE($1, name),
           thumbnail_url = COALESCE($2, thumbnail_url),
           "isLive" = COALESCE($3, "isLive"),
           "isChatEnabled" = COALESCE($4, "isChatEnabled"),
           "isChatDelayed" = COALESCE($5, "isChatDelayed"),
           description = COALESCE($6, description),
           title = COALESCE($7, title)
       WHERE "userId" = $8
       RETURNING *`,
      [name, thumbnail_url, isLive, isChatEnabled, isChatDelayed, description, title, userId]
    );

    if (!result.rows[0]) {
      throw new Error('Stream no encontrado');
    }

    return result.rows[0];
  },

  async deleteStream(userId: string): Promise<void> {
    const result = await pool.query(
      'DELETE FROM "Stream" WHERE "userId" = $1 RETURNING *',
      [userId]
    );
    
    if (!result.rows[0]) {
      throw new Error('Stream no encontrado');
    }
  },

  async toggleStreamStatus(userId: string, isLive: boolean): Promise<Stream> {
    const result = await pool.query(
      `UPDATE "Stream"
       SET "isLive" = $1
       WHERE "userId" = $2
       RETURNING *`,
      [isLive, userId]
    );

    if (!result.rows[0]) {
      throw new Error('Stream no encontrado');
    }

    return result.rows[0];
  }
}; 