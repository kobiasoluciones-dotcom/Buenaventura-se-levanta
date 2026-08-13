require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PUERTO, () => {
  console.log(`Buenaventura SE LEVANTA escuchando en el puerto ${PUERTO}`);
});
