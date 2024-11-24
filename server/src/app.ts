import express from 'express';
import cors from 'cors';
import routes from './routes';
import { UserModel } from './models/User';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializar tablas
const initializeTables = async () => {
  try {
    await UserModel.createTable();
    console.log('Tablas inicializadas correctamente');
  } catch (error) {
    console.error('Error inicializando tablas:', error);
    process.exit(1);
  }
};

// Rutas
app.use('/api', routes);

const startServer = async () => {
  await initializeTables();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

startServer();

export default app; 