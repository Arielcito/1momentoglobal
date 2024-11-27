import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Evento para monitorear errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de postgres:', err);
});

export default pool; 