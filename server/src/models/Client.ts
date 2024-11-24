import { Client } from '../types';
import pool from '../config/database';

export class ClientModel {
  static tableName = 'clients';

  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id SERIAL PRIMARY KEY,
        logo VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await pool.query(query);
    } catch (error) {
      console.error('Error creating clients table:', error);
      throw error;
    }
  }
} 