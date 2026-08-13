const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function leerJSON(nombreArchivo) {
  const rutaArchivo = path.join(DATA_DIR, nombreArchivo);
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
  return JSON.parse(contenido);
}

function obtenerCifrasOficiales() {
  return leerJSON('cifras-oficiales.json');
}

function obtenerContactosEmergencia() {
  return leerJSON('contactos-emergencia.json');
}

function obtenerDirectorioAyuda() {
  return leerJSON('directorio-ayuda.json');
}

function obtenerPlataformas() {
  return leerJSON('plataformas.json');
}

function obtenerVerificadoFalso() {
  return leerJSON('verificado-falso.json');
}

function obtenerComoSolicitarAyudaOficial() {
  return leerJSON('como-solicitar-ayuda-oficial.json');
}

function obtenerCuentasYVoces() {
  return leerJSON('cuentas-y-voces.json');
}

function obtenerRegistroVisual() {
  return leerJSON('registro-visual.json');
}

module.exports = {
  obtenerCifrasOficiales,
  obtenerContactosEmergencia,
  obtenerDirectorioAyuda,
  obtenerPlataformas,
  obtenerVerificadoFalso,
  obtenerComoSolicitarAyudaOficial,
  obtenerCuentasYVoces,
  obtenerRegistroVisual,
};
