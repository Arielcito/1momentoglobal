import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { User } from '../types/user';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const [loginUser] = await db
      .select() 
      .from(user)
      .where(eq(user.email, email));

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, loginUser.password || '');

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: loginUser.id, username: loginUser.username, isAdmin: loginUser.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = loginUser;
    return { user: userWithoutPassword as unknown as User, token };
  }
} 