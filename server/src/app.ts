import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import { UserModel } from './models/User';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
    console.log(`Documentación API disponible en http://localhost:${PORT}/api-docs`);
  });
};

startServer();

export default app; 