import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Para consultas normales
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// Para transacciones y pools
export const poolClient = postgres(connectionString, { max: 1 });
export const poolDb = drizzle(poolClient, { schema }); 