import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername
} from '../controllers/userController';
import { auth, adminAuth } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/', createUser); // Registro de usuario

// Rutas protegidas
router.get('/', auth, adminAuth, getUsers); // Solo admin puede ver todos los usuarios
router.get('/:id', auth, getUserById);
router.get('/username/:username', auth, getUserByUsername);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser); // Solo admin puede eliminar usuarios

export default router; 