import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import streamRoutes from './streamRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stream', streamRoutes);

export default router; 