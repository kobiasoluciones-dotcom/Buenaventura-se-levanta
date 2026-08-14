const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { fechaHoyColombia } = require('./fechaUtil');

const RUTA_DATOS = path.join(__dirname, '..', 'data', 'publicaciones.json');
const DIR_ARCHIVOS = path.join(__dirname, '..', 'public', 'img', 'publicaciones');

if (!fs.existsSync(DIR_ARCHIVOS)) {
  fs.mkdirSync(DIR_ARCHIVOS, { recursive: true });
}

function leer() {
  return JSON.parse(fs.readFileSync(RUTA_DATOS, 'utf-8'));
}

function escribir(datos) {
  const contenido = JSON.stringify(datos, null, 2);
  const rutaTemporal = RUTA_DATOS + '.tmp';
  fs.writeFileSync(rutaTemporal, contenido, 'utf-8');
  fs.renameSync(rutaTemporal, RUTA_DATOS);
}

function listar(seccion) {
  const datos = leer();
  if (!seccion) return datos.publicaciones;
  return datos.publicaciones.filter((p) => p.seccion === seccion);
}

function validar(campos) {
  const datos = leer();
  const { secciones_validas, niveles_confianza_validos } = datos._meta;

  if (!secciones_validas.includes(campos.seccion)) {
    throw new Error(`Sección no reconocida. Debe ser una de: ${secciones_validas.join(', ')}`);
  }
  if (!niveles_confianza_validos.includes(campos.nivel_confianza)) {
    throw new Error(`Nivel de confianza no reconocido. Debe ser uno de: ${niveles_confianza_validos.join(', ')}`);
  }
  if (!campos.titulo || !campos.titulo.trim()) {
    throw new Error('El título no puede estar vacío.');
  }
  if (campos.tipo_presentacion === 'alojado' && !campos.archivo) {
    throw new Error('Falta el archivo para una publicación alojada.');
  }
  if (campos.tipo_presentacion === 'tarjeta_enlace' && !campos.url_externa) {
    throw new Error('Falta el enlace externo para una tarjeta de enlace.');
  }
}

function crear(campos) {
  validar(campos);
  const datos = leer();

  const publicacion = {
    id: crypto.randomUUID(),
    seccion: campos.seccion,
    tipo_presentacion: campos.tipo_presentacion,
    titulo: campos.titulo.trim(),
    descripcion: (campos.descripcion || '').trim(),
    nivel_confianza: campos.nivel_confianza,
    archivo: campos.archivo || null,
    tipo_archivo: campos.tipo_archivo || null,
    url_externa: campos.url_externa || null,
    fecha_publicado: fechaHoyColombia(),
    publicado_por: campos.publicado_por || 'Equipo Buenaventura SE LEVANTA',
  };

  datos.publicaciones.unshift(publicacion);
  escribir(datos);
  return publicacion;
}

function eliminar(id) {
  const datos = leer();
  const publicacion = datos.publicaciones.find((p) => p.id === id);
  if (!publicacion) throw new Error('Publicación no encontrada.');

  if (publicacion.archivo) {
    const rutaArchivo = path.join(__dirname, '..', 'public', publicacion.archivo);
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
  }

  datos.publicaciones = datos.publicaciones.filter((p) => p.id !== id);
  escribir(datos);
}

module.exports = { listar, crear, eliminar, DIR_ARCHIVOS };
