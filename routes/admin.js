const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
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

// Memoria, no disco — el archivo va directo a Supabase Storage, nunca toca el
// filesystem del servidor (en Render no sobreviviría a un redeploy).
const subirArchivo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.test(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif) o video (mp4, webm, mov).'));
    }
    cb(null, true);
  },
});

const subirBoletin = multer({
  storage: multer.memoryStorage(),
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

router.get('/api/archivos', requiereAdmin, async (req, res) => {
  try {
    res.json(await adminContenidoService.listarArchivosEditables());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/archivos/:clave', requiereAdmin, async (req, res) => {
  try {
    const contenido = await adminContenidoService.leerCrudoPorClave(req.params.clave);
    if (contenido === null) return res.status(404).json({ error: 'Archivo no reconocido.' });
    res.type('application/json').send(contenido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/archivos/:clave', requiereAdmin, async (req, res) => {
  try {
    const textoJSON = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const guardado = await adminContenidoService.guardarPorClave(req.params.clave, textoJSON);
    res.json({ ok: true, datos: guardado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/api/archivos/:clave/marcar-revisado', requiereAdmin, async (req, res) => {
  try {
    const guardado = await adminContenidoService.marcarRevisadoHoy(req.params.clave);
    res.json({ ok: true, datos: guardado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------- Publicaciones (flyers/video reales, alojados o por enlace) ----------

router.get('/api/publicaciones', requiereAdmin, async (req, res) => {
  try {
    res.json(await publicacionesService.listar(req.query.seccion));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/publicaciones/archivo', requiereAdmin, (req, res) => {
  subirArchivo.single('archivo')(req, res, async (errorSubida) => {
    if (errorSubida) {
      return res.status(400).json({ error: errorSubida.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    try {
      const nombreUnico = nombreArchivoUnico(req.file.originalname);
      const urlArchivo = await publicacionesService.subirArchivoAStorage(req.file.buffer, nombreUnico, req.file.mimetype);
      const publicacion = await publicacionesService.crear({
        seccion: req.body.seccion,
        tipo_presentacion: 'alojado',
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        nivel_confianza: req.body.nivel_confianza,
        archivo: urlArchivo,
        tipo_archivo: req.file.mimetype.startsWith('video') ? 'video' : 'imagen',
      });
      res.json({ ok: true, publicacion });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

router.post('/api/publicaciones/enlace', requiereAdmin, async (req, res) => {
  try {
    const publicacion = await publicacionesService.crear({
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

router.delete('/api/publicaciones/:id', requiereAdmin, async (req, res) => {
  try {
    await publicacionesService.eliminar(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------- Boletines oficiales (Alcaldía / Departamento / Nación) ----------

router.get('/api/boletines', requiereAdmin, async (req, res) => {
  try {
    res.json(await boletinesService.listar(req.query.nivel_gobierno));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/boletines', requiereAdmin, (req, res) => {
  subirBoletin.single('archivo')(req, res, async (errorSubida) => {
    if (errorSubida) {
      return res.status(400).json({ error: errorSubida.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    try {
      const nombreUnico = nombreArchivoUnico(req.file.originalname);
      const urlArchivo = await boletinesService.subirArchivoAStorage(req.file.buffer, nombreUnico, req.file.mimetype);
      const boletin = await boletinesService.crear({
        nivel_gobierno: req.body.nivel_gobierno,
        entidad: req.body.entidad,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        fecha_del_boletin: req.body.fecha_del_boletin,
        archivo: urlArchivo,
        tipo_archivo: req.file.mimetype === 'application/pdf' ? 'documento' : 'imagen',
      });
      res.json({ ok: true, boletin });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

router.delete('/api/boletines/:id', requiereAdmin, async (req, res) => {
  try {
    await boletinesService.eliminar(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
