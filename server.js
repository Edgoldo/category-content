const cors = require('cors');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const { authenticate } = require('./src/middleware/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Conectar a MongoDB
connectDB().then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => console.log(err));

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
