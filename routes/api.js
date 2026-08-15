const express = require('express');
const contenidoService = require('../services/contenidoService');
const publicacionesService = require('../services/publicacionesService');
const boletinesService = require('../services/boletinesService');

const router = express.Router();

function manejar(promesaFn) {
  return async (req, res) => {
    try {
      res.json(await promesaFn(req));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

router.get('/publicaciones', manejar((req) => publicacionesService.listar(req.query.seccion)));
router.get('/novedades', manejar((req) => publicacionesService.contarDesde(req.query.desde)));
router.get('/boletines', manejar((req) => boletinesService.listar(req.query.nivel_gobierno)));
router.get('/cifras-oficiales', manejar(() => contenidoService.obtenerCifrasOficiales()));
router.get('/contactos-emergencia', manejar(() => contenidoService.obtenerContactosEmergencia()));
router.get('/directorio-ayuda', manejar(() => contenidoService.obtenerDirectorioAyuda()));
router.get('/plataformas', manejar(() => contenidoService.obtenerPlataformas()));
router.get('/verificado-falso', manejar(() => contenidoService.obtenerVerificadoFalso()));
router.get('/como-solicitar-ayuda-oficial', manejar(() => contenidoService.obtenerComoSolicitarAyudaOficial()));
router.get('/cuentas-y-voces', manejar(() => contenidoService.obtenerCuentasYVoces()));
router.get('/registro-visual', manejar(() => contenidoService.obtenerRegistroVisual()));

module.exports = router;
