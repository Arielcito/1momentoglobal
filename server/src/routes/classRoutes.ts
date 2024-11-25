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
 * /classes/course/{courseId}:
 *   get:
 *     summary: Obtiene todas las clases de un curso
 *     tags: [Classes]
 */
router.get('/course/:courseId', getClassesByCourse);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Obtiene una clase por ID
 *     tags: [Classes]
 */
router.get('/:id', getClassById);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Crea una nueva clase
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, createClass);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Actualiza una clase
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Elimina una clase
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, deleteClass);

/**
 * @swagger
 * /classes/{id}/publish:
 *   put:
 *     summary: Publica una clase
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/publish', auth, publishClass);

export default router; 