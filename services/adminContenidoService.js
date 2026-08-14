const fs = require('fs');
const path = require('path');
const { fechaHoyColombia } = require('./fechaUtil');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Lista blanca deliberada: el panel solo puede leer/escribir estos archivos,
// nunca una ruta arbitraria. Ver politica corporativa 4.5 (seguridad y datos).
const ARCHIVOS_EDITABLES = {
  'cifras-oficiales': { archivo: 'cifras-oficiales.json', etiqueta: 'Cifras oficiales' },
  'contactos-emergencia': { archivo: 'contactos-emergencia.json', etiqueta: 'Contactos de emergencia' },
  'directorio-ayuda': { archivo: 'directorio-ayuda.json', etiqueta: 'Directorio de ayuda' },
  'plataformas': { archivo: 'plataformas.json', etiqueta: 'Plataformas utiles' },
  'verificado-falso': { archivo: 'verificado-falso.json', etiqueta: 'Verificado / Falso' },
  'como-solicitar-ayuda-oficial': { archivo: 'como-solicitar-ayuda-oficial.json', etiqueta: 'Como solicitar ayuda oficial' },
  'cuentas-y-voces': { archivo: 'cuentas-y-voces.json', etiqueta: 'Cuentas y voces' },
  'registro-visual': { archivo: 'registro-visual.json', etiqueta: 'Registro visual' },
};

function listarArchivosEditables() {
  return Object.entries(ARCHIVOS_EDITABLES).map(([clave, info]) => {
    const datos = leerPorClave(clave);
    return {
      clave,
      etiqueta: info.etiqueta,
      ultima_revision_por_equipo: datos && datos._meta ? datos._meta.ultima_revision_por_equipo : null,
    };
  });
}

function rutaPorClave(clave) {
  const info = ARCHIVOS_EDITABLES[clave];
  if (!info) return null;
  return path.join(DATA_DIR, info.archivo);
}

function leerPorClave(clave) {
  const ruta = rutaPorClave(clave);
  if (!ruta) return null;
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

function leerCrudoPorClave(clave) {
  const ruta = rutaPorClave(clave);
  if (!ruta) return null;
  return fs.readFileSync(ruta, 'utf-8');
}

function guardarPorClave(clave, textoJSON) {
  const ruta = rutaPorClave(clave);
  if (!ruta) throw new Error('Archivo no reconocido.');

  let datos;
  try {
    datos = JSON.parse(textoJSON);
  } catch (error) {
    throw new Error('El contenido no es JSON valido: ' + error.message);
  }
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new Error('El contenido debe ser un objeto JSON, no una lista ni un valor suelto.');
  }

  // Escritura casi-atomica: primero a un archivo temporal, luego se reemplaza.
  // Evita dejar el JSON a medio escribir si algo falla a mitad de camino —
  // importa porque estos archivos incluyen cuentas bancarias reales.
  const contenidoFormateado = JSON.stringify(datos, null, 2);
  const rutaTemporal = ruta + '.tmp';
  fs.writeFileSync(rutaTemporal, contenidoFormateado, 'utf-8');
  fs.renameSync(rutaTemporal, ruta);

  return datos;
}

function marcarRevisadoHoy(clave) {
  const datos = leerPorClave(clave);
  if (!datos) throw new Error('Archivo no reconocido.');
  datos._meta = datos._meta || {};
  datos._meta.ultima_revision_por_equipo = fechaHoyColombia();
  return guardarPorClave(clave, JSON.stringify(datos));
}

module.exports = {
  ARCHIVOS_EDITABLES,
  listarArchivosEditables,
  leerCrudoPorClave,
  guardarPorClave,
  marcarRevisadoHoy,
};
