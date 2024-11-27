import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from '../drizzle/schema';

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL no está definido en las variables de entorno');
}

const connectionString = process.env.DIRECT_URL;

// Configuración de conexión con opciones SSL
const connectionConfig = {
  ssl: {
    rejectUnauthorized: false // Necesario para Supabase
  },
  max: 1 // Limitar el número de conexiones
};

// Cliente para consultas normales
const queryClient = postgres(connectionString, connectionConfig);
export const db = drizzle(queryClient, { schema });

// Cliente para transacciones y pools 
export const poolClient = postgres(connectionString, {
  ...connectionConfig,
  max: 1
});
export const poolDb = drizzle(poolClient, { schema });

// Función para probar la conexión
export async function testConnection() {
  try {
    await queryClient`SELECT 1`;
    console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
} 