const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const adminAuthService = require('../services/adminAuthService');
const adminContenidoService = require('../services/adminContenidoService');
const publicacionesService = require('../services/publicacionesService');
const boletinesService = require('../services/boletinesService');
const { requiereAdmin, NOMBRE_COOKIE } = require('../middleware/requiereAdmin');

const router = express.Router();

const TIPOS_PERMITIDOS = /^image\/(jpeg|png|webp|gif)$|^video\/(mp4|webm|quicktime)$/;
const TIPOS_PERMITIDOS_BOLETIN = /^image\/(jpeg|png|webp|gif)$|^application\/pdf$/;

function nombreArchivoUnico(originalname) {
  const extension = path.extname(originalname).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;
}

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, publicacionesService.DIR_ARCHIVOS),
  filename: (req, file, cb) => cb(null, nombreArchivoUnico(file.originalname)),
});

const subirArchivo = multer({
  storage: almacenamiento,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB — suficiente para foto/video corto de celular
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.test(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif) o video (mp4, webm, mov).'));
    }
    cb(null, true);
  },
});

const almacenamientoBoletin = multer.diskStorage({
  destination: (req, file, cb) => cb(null, boletinesService.DIR_ARCHIVOS),
  filename: (req, file, cb) => cb(null, nombreArchivoUnico(file.originalname)),
});

const subirBoletin = multer({
  storage: almacenamientoBoletin,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS_BOLETIN.test(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif) o documentos PDF.'));
    }
    cb(null, true);
  },
});

const OPCIONES_COOKIE = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 12 * 60 * 60 * 1000, // 12 horas
};

router.post('/api/login', (req, res) => {
  if (!adminAuthService.contrasenaConfigurada()) {
    return res.status(500).json({ error: 'El panel no tiene ADMIN_PASSWORD configurada en el servidor.' });
  }
  const { contrasena } = req.body || {};
  const token = adminAuthService.iniciarSesion(contrasena);
  if (!token) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }
  res.cookie(NOMBRE_COOKIE, token, OPCIONES_COOKIE);
  res.json({ ok: true });
});

router.post('/api/logout', (req, res) => {
  const token = req.cookies ? req.cookies[NOMBRE_COOKIE] : null;
  adminAuthService.cerrarSesion(token);
  res.clearCookie(NOMBRE_COOKIE);
  res.json({ ok: true });
});

router.get('/api/sesion', (req, res) => {
  const token = req.cookies ? req.cookies[NOMBRE_COOKIE] : null;
  res.json({ autenticado: adminAuthService.sesionValida(token) });
});

router.get('/api/archivos', requiereAdmin, (req, res) => {
  res.json(adminContenidoService.listarArchivosEditables());
});

router.get('/api/archivos/:clave', requiereAdmin, (req, res) => {
  const contenido = adminContenidoService.leerCrudoPorClave(req.params.clave);
  if (contenido === null) return res.status(404).json({ error: 'Archivo no reconocido.' });
  res.type('application/json').send(contenido);
});

router.put('/api/archivos/:clave', requiereAdmin, (req, res) => {
  try {
    const textoJSON = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const guardado = adminContenidoService.guardarPorClave(req.params.clave, textoJSON);
    res.json({ ok: true, datos: guardado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/api/archivos/:clave/marcar-revisado', requiereAdmin, (req, res) => {
  try {
    const guardado = adminContenidoService.marcarRevisadoHoy(req.params.clave);
    res.json({ ok: true, datos: guardado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------- Publicaciones (flyers/video reales, alojados o por enlace) ----------

router.get('/api/publicaciones', requiereAdmin, (req, res) => {
  res.json(publicacionesService.listar(req.query.seccion));
});

router.post('/api/publicaciones/archivo', requiereAdmin, (req, res) => {
  subirArchivo.single('archivo')(req, res, (errorSubida) => {
    if (errorSubida) {
      return res.status(400).json({ error: errorSubida.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    try {
      const publicacion = publicacionesService.crear({
        seccion: req.body.seccion,
        tipo_presentacion: 'alojado',
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        nivel_confianza: req.body.nivel_confianza,
        archivo: `/img/publicaciones/${req.file.filename}`,
        tipo_archivo: req.file.mimetype.startsWith('video') ? 'video' : 'imagen',
      });
      res.json({ ok: true, publicacion });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

router.post('/api/publicaciones/enlace', requiereAdmin, (req, res) => {
  try {
    const publicacion = publicacionesService.crear({
      seccion: req.body.seccion,
      tipo_presentacion: 'tarjeta_enlace',
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      nivel_confianza: req.body.nivel_confianza,
      url_externa: req.body.url_externa,
    });
    res.json({ ok: true, publicacion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/api/publicaciones/:id', requiereAdmin, (req, res) => {
  try {
    publicacionesService.eliminar(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------- Boletines oficiales (Alcaldía / Departamento / Nación) ----------

router.get('/api/boletines', requiereAdmin, (req, res) => {
  res.json(boletinesService.listar(req.query.nivel_gobierno));
});

router.post('/api/boletines', requiereAdmin, (req, res) => {
  subirBoletin.single('archivo')(req, res, (errorSubida) => {
    if (errorSubida) {
      return res.status(400).json({ error: errorSubida.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    try {
      const boletin = boletinesService.crear({
        nivel_gobierno: req.body.nivel_gobierno,
        entidad: req.body.entidad,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        fecha_del_boletin: req.body.fecha_del_boletin,
        archivo: `/img/boletines/${req.file.filename}`,
        tipo_archivo: req.file.mimetype === 'application/pdf' ? 'documento' : 'imagen',
      });
      res.json({ ok: true, boletin });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

router.delete('/api/boletines/:id', requiereAdmin, (req, res) => {
  try {
    boletinesService.eliminar(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
