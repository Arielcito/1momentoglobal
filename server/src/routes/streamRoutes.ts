import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { streamService } from '../services/streamService';

const router = express.Router();

/**
 * @swagger
 * /api/stream:
 *   get:
 *     summary: Obtiene el stream del usuario autenticado
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const stream = await streamService.getStreamByUserId(req.user.id);
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el stream' });
  }
});

/**
 * @swagger
 * /api/stream:
 *   post:
 *     summary: Crea un nuevo stream para el usuario
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const stream = await streamService.createStream(req.user.id, req.body);
    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el stream' });
  }
});

/**
 * @swagger
 * /api/stream:
 *   put:
 *     summary: Actualiza el stream del usuario
 *     security:
 *       - bearerAuth: []
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    const stream = await streamService.updateStream(req.user.id, req.body);
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el stream' });
  }
});

/**
 * @swagger
 * /api/stream/status:
 *   put:
 *     summary: Cambia el estado del stream (live/offline)
 *     security:
 *       - bearerAuth: []
 */
router.put('/status', authenticateToken, async (req, res) => {
  try {
    const { isLive } = req.body;
    const stream = await streamService.toggleStreamStatus(req.user.id, isLive);
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del stream' });
  }
});

export default router; 