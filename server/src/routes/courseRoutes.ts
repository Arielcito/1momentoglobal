import { Router } from 'express';
import { auth, adminAuth } from '../middleware/auth';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  getCoursesByInstructor
} from '../controllers/courseController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - instructor_id
 *         - image_url
 *         - price
 *       properties:
 *         course_id:
 *           type: integer
 *           description: ID único del curso
 *         title:
 *           type: string
 *           description: Título del curso
 *         description:
 *           type: string
 *           description: Descripción del curso
 *         instructor_id:
 *           type: string
 *           description: ID del instructor
 *         category_id:
 *           type: integer
 *           description: ID de la categoría
 *         image_url:
 *           type: string
 *           description: URL de la imagen del curso
 *         price:
 *           type: number
 *           description: Precio del curso
 *         level:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *           description: Nivel del curso
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *           description: Estado del curso
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Obtiene todos los cursos
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', getCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Obtiene un curso por ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /courses/instructor/{instructorId}:
 *   get:
 *     summary: Obtiene todos los cursos de un instructor
 *     tags: [Courses]
 */
router.get('/instructor/:instructorId', getCoursesByInstructor);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Crea un nuevo curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - instructor_id
 *               - image_url
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor_id:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               price:
 *                 type: number
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/', auth, createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Actualiza un curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Elimina un curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, deleteCourse);

/**
 * @swagger
 * /courses/{id}/publish:
 *   put:
 *     summary: Publica un curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/publish', auth, publishCourse);

// Más rutas...

export default router; 