import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    const { user, token } = await authService.login(email, password);

    res.json({ user, token });
  } catch (error) {
    if (error instanceof Error && error.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}; 