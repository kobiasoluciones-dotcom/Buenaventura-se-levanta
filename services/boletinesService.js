const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { fechaHoyColombia } = require('./fechaUtil');

const RUTA_DATOS = path.join(__dirname, '..', 'data', 'boletines-oficiales.json');
const DIR_ARCHIVOS = path.join(__dirname, '..', 'public', 'img', 'boletines');

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

function listar(nivelGobierno) {
  const datos = leer();
  if (!nivelGobierno) return datos.boletines;
  return datos.boletines.filter((b) => b.nivel_gobierno === nivelGobierno);
}

function validar(campos) {
  const datos = leer();
  if (!datos._meta.niveles_gobierno_validos.includes(campos.nivel_gobierno)) {
    throw new Error(`Nivel de gobierno no reconocido. Debe ser uno de: ${datos._meta.niveles_gobierno_validos.join(', ')}`);
  }
  if (!campos.entidad || !campos.entidad.trim()) {
    throw new Error('Falta el nombre de la entidad que emite el boletín.');
  }
  if (!campos.titulo || !campos.titulo.trim()) {
    throw new Error('El título no puede estar vacío.');
  }
  if (!campos.archivo) {
    throw new Error('Falta el archivo del boletín (imagen o PDF).');
  }
}

function crear(campos) {
  validar(campos);
  const datos = leer();

  const boletin = {
    id: crypto.randomUUID(),
    nivel_gobierno: campos.nivel_gobierno,
    entidad: campos.entidad.trim(),
    titulo: campos.titulo.trim(),
    descripcion: (campos.descripcion || '').trim(),
    archivo: campos.archivo,
    tipo_archivo: campos.tipo_archivo,
    fecha_del_boletin: campos.fecha_del_boletin || null,
    fecha_publicado: fechaHoyColombia(),
    publicado_por: campos.publicado_por || 'Equipo Buenaventura SE LEVANTA',
  };

  datos.boletines.unshift(boletin);
  escribir(datos);
  return boletin;
}

function eliminar(id) {
  const datos = leer();
  const boletin = datos.boletines.find((b) => b.id === id);
  if (!boletin) throw new Error('Boletín no encontrado.');

  const rutaArchivo = path.join(__dirname, '..', 'public', boletin.archivo);
  if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);

  datos.boletines = datos.boletines.filter((b) => b.id !== id);
  escribir(datos);
}

module.exports = { listar, crear, eliminar, DIR_ARCHIVOS };
