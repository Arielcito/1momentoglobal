import pool from '../config/database';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user';
import bcrypt from 'bcrypt';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM "User"');
    return result.rows;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const { username, email, password, full_name, is_admin = false } = userData;
    
    // Verificar si el usuario ya existe
    const existingUser = await this.getUserByUsername(username);
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "User" (
        username, 
        email, 
        password, 
        full_name, 
        is_admin,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
      [username, email, hashedPassword, full_name, is_admin]
    );

    return result.rows[0];
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const { name, email, image, password, full_name, is_admin } = userData;
    
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE "User" 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           image = COALESCE($3, image),
           password = COALESCE($4, password),
           full_name = COALESCE($5, full_name),
           is_admin = COALESCE($6, is_admin)
       WHERE id = $7
       RETURNING *`,
      [name, email, image, hashedPassword, full_name, is_admin, id]
    );

    if (!result.rows[0]) {
      throw new Error('Usuario no encontrado');
    }

    return result.rows[0];
  }

  async deleteUser(id: string): Promise<void> {
    const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);
    
    if (!result.rows[0]) {
      throw new Error('Usuario no encontrado');
    }
  }
} 