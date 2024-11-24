import pool from '../config/database';

export class UserModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS "User" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE,
        emailVerified TIMESTAMP,
        image TEXT,
        password TEXT,
        passwordResetToken TEXT UNIQUE,
        passwordResetTokenExp TIMESTAMP,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await pool.query(query);
      console.log('Tabla User creada exitosamente');
    } catch (error) {
      console.error('Error creando tabla User:', error);
      throw error;
    }
  }
} 