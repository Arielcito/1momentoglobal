import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { user } from '../drizzle/schema';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0] || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const { username, email, password, full_name, is_admin = false } = userData;
    
    // Verificar si el usuario ya existe
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('El email ya está en uso');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(user).values({
      username,
      email,
      password: hashedPassword,
      full_name,
      is_admin
    }).returning();

    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const { name, email, image, password, full_name, is_admin } = userData;
    
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        name,
        email,
        image,
        password: hashedPassword,
        fullName,
        isAdmin
      })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Usuario no encontrado');
    }
  }
} 