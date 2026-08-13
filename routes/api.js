const express = require('express');
const contenidoService = require('../services/contenidoService');

const router = express.Router();

router.get('/cifras-oficiales', (req, res) => {
  res.json(contenidoService.obtenerCifrasOficiales());
});

router.get('/contactos-emergencia', (req, res) => {
  res.json(contenidoService.obtenerContactosEmergencia());
});

router.get('/directorio-ayuda', (req, res) => {
  res.json(contenidoService.obtenerDirectorioAyuda());
});

router.get('/plataformas', (req, res) => {
  res.json(contenidoService.obtenerPlataformas());
});

router.get('/verificado-falso', (req, res) => {
  res.json(contenidoService.obtenerVerificadoFalso());
});

router.get('/como-solicitar-ayuda-oficial', (req, res) => {
  res.json(contenidoService.obtenerComoSolicitarAyudaOficial());
});

router.get('/cuentas-y-voces', (req, res) => {
  res.json(contenidoService.obtenerCuentasYVoces());
});

router.get('/registro-visual', (req, res) => {
  res.json(contenidoService.obtenerRegistroVisual());
});

module.exports = router;
