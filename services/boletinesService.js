const supabase = require('./supabaseClient');
const { fechaHoyColombia } = require('./fechaUtil');

const BUCKET = 'sismo-archivos';
const NIVELES_GOBIERNO_VALIDOS = ['alcaldia', 'departamento', 'nacion'];

async function listar(nivelGobierno) {
  let consulta = supabase.from('sismo_boletines_oficiales').select('*').order('creado_en', { ascending: false });
  if (nivelGobierno) consulta = consulta.eq('nivel_gobierno', nivelGobierno);
  const { data, error } = await consulta;
  if (error) throw error;
  return data.map(formatearSalida);
}

function formatearSalida(fila) {
  return {
    id: fila.id,
    nivel_gobierno: fila.nivel_gobierno,
    entidad: fila.entidad,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    archivo: fila.archivo,
    tipo_archivo: fila.tipo_archivo,
    fecha_del_boletin: fila.fecha_del_boletin,
    fecha_publicado: fila.fecha_publicado,
    publicado_por: fila.publicado_por,
  };
}

function validar(campos) {
  if (!NIVELES_GOBIERNO_VALIDOS.includes(campos.nivel_gobierno)) {
    throw new Error(`Nivel de gobierno no reconocido. Debe ser uno de: ${NIVELES_GOBIERNO_VALIDOS.join(', ')}`);
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

async function subirArchivoAStorage(buffer, nombreUnico, mimetype) {
  const { error } = await supabase.storage.from(BUCKET).upload(`boletines/${nombreUnico}`, buffer, {
    contentType: mimetype,
    upsert: false,
  });
  if (error) throw new Error('No se pudo subir el archivo: ' + error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`boletines/${nombreUnico}`);
  return data.publicUrl;
}

async function crear(campos) {
  validar(campos);

  const fila = {
    nivel_gobierno: campos.nivel_gobierno,
    entidad: campos.entidad.trim(),
    titulo: campos.titulo.trim(),
    descripcion: (campos.descripcion || '').trim() || null,
    archivo: campos.archivo,
    tipo_archivo: campos.tipo_archivo,
    fecha_del_boletin: campos.fecha_del_boletin || null,
    fecha_publicado: fechaHoyColombia(),
    publicado_por: campos.publicado_por || 'Equipo Buenaventura SE LEVANTA',
  };

  const { data, error } = await supabase.from('sismo_boletines_oficiales').insert(fila).select().single();
  if (error) throw error;
  return formatearSalida(data);
}

async function eliminar(id) {
  const { data: fila, error: errorLectura } = await supabase.from('sismo_boletines_oficiales').select('archivo').eq('id', id).single();
  if (errorLectura) throw new Error('Boletín no encontrado.');

  const rutaEnBucket = 'boletines/' + fila.archivo.split('/boletines/')[1];
  await supabase.storage.from(BUCKET).remove([rutaEnBucket]);

  const { error } = await supabase.from('sismo_boletines_oficiales').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { listar, crear, eliminar, subirArchivoAStorage };
