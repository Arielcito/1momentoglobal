import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getClassesByCourse,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  publishClass
} from '../controllers/classController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - course_id
 *         - title
 *         - description
 *         - order
 *       properties:
 *         class_id:
 *           type: integer
 *         course_id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         scheduled_at:
 *           type: string
 *           format: date-time
 *         is_live:
 *           type: boolean
 *         recording_url:
 *           type: string
 *         content:
 *           type: string
 *         duration:
 *           type: integer
 *         order:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 */

/**
 * @swagger
 * /courses/{courseId}/classes:
 *   get:
 *     summary: Obtiene todas las clases de un curso
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de clases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
router.get('/course/:courseId', getClassesByCourse);

// Más rutas y documentación...

export default router; 