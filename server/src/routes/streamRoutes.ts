import express, { type Request, type Response } from 'express';
import { auth } from '../middleware/auth';
import type { StreamRequest, ParticipantRequest } from '../types/livekit';
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';
import pool from '../config/database';
import { db } from '../db';
import { stream, user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

const livekitHost = process.env.LIVEKIT_HOST || 'http://localhost:7880';
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set');
}

const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

/**
 * @swagger
 * /stream/create:
 *   post:
 *     summary: Crear una nueva sala de streaming
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_name:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Sala creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room_name:
 *                   type: string
 *                 token:
 *                   type: string
 *                 ws_url:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.post('/create', auth, async (req: any, res: Response) => {
  try {
    const streamRequest = req.body as StreamRequest;
    
    // Check if user has existing rooms and delete them
    const existingRooms = await roomService.listRooms();
    for (const room of existingRooms) {
      const metadata = room.metadata ? JSON.parse(room.metadata) : null;
      if (metadata?.creator_identity === req.user.id) {
        await roomService.deleteRoom(room.name);
      }
    }

    // Generate room name if not provided
    const streamRoom = streamRequest.room_name || `stream-${req.user.id}-${Date.now()}`;
    
    // Create new room in LiveKit
    await roomService.createRoom({
      name: streamRoom,
      metadata: JSON.stringify({
        creator_identity: req.user.id,
        ...streamRequest.metadata
      })
    });

    // Create access token for the streamer
    const at = new AccessToken(apiKey, apiSecret, {
      identity: req.user.id,
    });

    at.addGrant({
      room: streamRoom,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    res.json({
      room_name: streamRoom,
      token: await at.toJwt(),
      ws_url: process.env.LIVEKIT_WS_URL
    });

  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).json({ message: 'Error creating stream room' });
  }
});

/**
 * @swagger
 * /stream/rooms:
 *   delete:
 *     summary: Eliminar todas las salas creadas por el usuario
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salas eliminadas exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/rooms', auth, async (req: any, res: Response) => {
  try {
    const rooms = await roomService.listRooms();
    
    for (const room of rooms) {
      const metadata = room.metadata ? JSON.parse(room.metadata) : null;
      
      if (metadata?.creator_identity === req.user.id) {
        await roomService.deleteRoom(room.name);
      }
    }

    res.json({ message: 'Rooms deleted successfully' });

  } catch (error) {
    console.error('Error deleting rooms:', error);
    res.status(500).json({ message: 'Error deleting rooms' });
  }
});

/**
 * @swagger
 * /stream/remove-participant:
 *   post:
 *     summary: Remover participante de una sala
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_name
 *               - identity
 *             properties:
 *               room_name:
 *                 type: string
 *               identity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participante removido exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/remove-participant', auth, async (req: any, res: Response) => {
  try {
    const participantRequest = req.body as ParticipantRequest;

    // Verify room exists and user is creator
    const rooms = await roomService.listRooms([participantRequest.room_name]);
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];
    const metadata = room.metadata ? JSON.parse(room.metadata) : null;

    if (metadata?.creator_identity !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove participants' });
    }

    // Remove participant
    await roomService.removeParticipant(participantRequest.room_name, participantRequest.identity);

    res.json({ message: 'Participant removed successfully' });

  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ message: 'Error removing participant' });
  }
});

/**
 * @swagger
 * /stream/viewer-token:
 *   post:
 *     summary: Generar token para espectador
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_name
 *             properties:
 *               room_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 ws_url:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.post('/viewer-token', auth, async (req: any, res: Response) => {
  try {
    const { room_name } = req.body as { room_name: string };

    // Create viewer access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: req.user.id,
    });

    at.addGrant({
      room: room_name,
      roomJoin: true,
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });

    res.json({
      token: await at.toJwt(),
      ws_url: process.env.LIVEKIT_WS_URL
    });

  } catch (error) {
    console.error('Error generating viewer token:', error);
    res.status(500).json({ message: 'Error generating viewer token' });
  }
});

/**
 * @swagger
 * /stream/live:
 *   get:
 *     summary: Obtener todos los streams activos
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de streams activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   isLive:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/live', auth, async (req: Request, res: Response) => {
  try {
    const liveStreams = await db
      .select({
        id: stream.id,
        title: stream.title,
        name: stream.name,
        isLive: stream.isLive,
        userId: stream.userId,
        ingressId: stream.ingressId,
        userName: user.name,
        userImage: user.image
      })
      .from(stream)
      .leftJoin(user, eq(stream.userId, user.id))
      .where(eq(stream.isLive, true));

    const formattedStreams = liveStreams.map(stream => ({
      id: stream.id,
      title: stream.title || stream.name,
      isLive: stream.isLive,
      userId: stream.userId,
      ingressId: stream.ingressId,
      user: {
        name: stream.userName || 'Usuario',
        image: stream.userImage || '/default-avatar.png'
      }
    }));

    res.json(formattedStreams);
  } catch (error) {
    console.error('Error al obtener streams en vivo:', error);
    res.status(500).json({ message: 'Error al obtener streams en vivo' });
  }
});

/**
 * @swagger
 * /stream/live/{streamId}:
 *   get:
 *     summary: Obtener un stream específico
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: streamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 isLive:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *       404:
 *         description: Stream no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/live/:streamId', auth, async (req: Request, res: Response) => {
  try {
    const streamId = req.params.streamId;
    const streamData = await db
      .select({
        id: stream.id,
        title: stream.title,
        name: stream.name,
        description: stream.description,
        isLive: stream.isLive,
        userId: stream.userId,
        user: {
          name: user.name,
          image: user.image
        }
      })
      .from(stream)
      .leftJoin(user, eq(stream.userId, user.id))
      .where(eq(stream.id, streamId))

    if (!streamData) {
      return res.status(404).json({ message: 'Stream no encontrado' });
    }

    res.json(streamData[0]);
  } catch (error) {
    console.error('Error al obtener stream:', error);
    res.status(500).json({ message: 'Error al obtener stream' });
  }
});

export default router; 