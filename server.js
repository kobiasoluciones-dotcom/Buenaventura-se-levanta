require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PUERTO = process.env.PORT || 3000;
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || 'https://buenaventura-se-levanta.millerocoro.chatgpt.site';
const ORIGENES_PERMITIDOS = new Set(
  (process.env.ALLOWED_ORIGINS || PUBLIC_SITE_URL)
    .split(',')
    .map((origen) => origen.trim().replace(/\/$/, ''))
    .filter(Boolean),
);

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

// El portal visual y el backend pueden desplegarse en dominios distintos.
// Solo la API pública admite CORS; el panel conserva cookies sameSite=strict.
app.use('/api', (req, res, next) => {
  const origen = req.headers.origin ? req.headers.origin.replace(/\/$/, '') : '';
  if (origen && ORIGENES_PERMITIDOS.has(origen)) {
    res.setHeader('Access-Control-Allow-Origin', origen);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(302, PUBLIC_SITE_URL);
});

if (require.main === module) {
  app.listen(PUERTO, () => {
    console.log(`Buenaventura SE LEVANTA escuchando en el puerto ${PUERTO}`);
  });
}

module.exports = app;
