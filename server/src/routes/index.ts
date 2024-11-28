import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import streamRoutes from './streamRoutes';
import courseRoutes from './courseRoutes';
import classRoutes from './classRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stream', streamRoutes);
router.use('/courses', courseRoutes);
router.use('/classes', classRoutes);
router.use('/categories', categoryRoutes);

export default router; 