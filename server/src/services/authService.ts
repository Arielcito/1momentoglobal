import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from './userService';
import type { User } from '../types/user';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password || '');

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return { user, token };
  }
} 