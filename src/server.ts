import express, { Application } from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import categoryRoutes from './routes/categoryRoutes';

const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;
const MONGODB_URI: string = process.env.MONGO_URI || '';

// Conectar a MongoDB
connectDB().then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => console.log(err));

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
}

app.use(express.json());

// Habilita el control de acceso desde cualquier ruta 
app.use(cors());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas autenticadas
app.use('/api/content', contentRoutes);
app.use('/api/categories', categoryRoutes);

// Servir los archivos estáticos de la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Incluye documentación de las apis
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
