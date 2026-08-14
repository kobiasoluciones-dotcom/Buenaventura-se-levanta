require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());
app.use((error, req, res, next) => {
  // express.json() lanza antes de llegar a cualquier ruta si el body no es
  // JSON válido — sin esto, Express muestra una página HTML con rutas del
  // sistema de archivos en vez de un error limpio.
  if (error && error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
  }
  next(error);
});
app.use(cookieParser());
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/premium', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index_premium.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PUERTO, () => {
  console.log(`Buenaventura SE LEVANTA escuchando en el puerto ${PUERTO}`);
});
