const supabase = require('./supabaseClient');
const { fechaHoyColombia } = require('./fechaUtil');

const BUCKET = 'sismo-archivos';
const SECCIONES_VALIDAS = ['ofrecimientos', 'puntos-acopio', 'necesidades', 'salud', 'registro-visual', 'noticias'];
const NIVELES_CONFIANZA_VALIDOS = ['oficial', 'institucional', 'colectivo', 'individual'];
// Secciones que alimentan la pestaña "Ayuda" del frontend móvil (ver page.tsx
// sectionPresentation). No incluye "registro-visual" ni "noticias": esas viven
// en otras pestañas y no generan el badge de novedades de ayuda.
const SECCIONES_AYUDA = ['ofrecimientos', 'puntos-acopio', 'necesidades', 'salud'];

async function listar(seccion) {
  let consulta = supabase.from('sismo_publicaciones').select('*').order('creado_en', { ascending: false });
  if (seccion) consulta = consulta.eq('seccion', seccion);
  const { data, error } = await consulta;
  if (error) throw error;
  return data.map(formatearSalida);
}

// Para el badge "novedades" de la pestaña Ayuda en móvil: cuántas
// publicaciones de ayuda entraron después de `desde` (ISO), y cuál es la
// fecha de la más reciente (para que el siguiente sondeo use esa fecha como
// base). No hace falta filtrar por revisión del equipo aquí — a diferencia de
// cifras-oficiales o contactos-emergencia, sismo_publicaciones no tiene
// columna ultima_revision_por_equipo: cada fila ya pasó por el panel /admin
// al crearse (ver `crear` más abajo), que es su propio paso de verificación.
async function contarDesde(desde) {
  const { data: ultimaFila, error: errorUltima } = await supabase
    .from('sismo_publicaciones')
    .select('creado_en')
    .in('seccion', SECCIONES_AYUDA)
    .order('creado_en', { ascending: false })
    .limit(1);
  if (errorUltima) throw errorUltima;
  const ultima_fecha = ultimaFila && ultimaFila[0] ? ultimaFila[0].creado_en : null;

  let conteo = 0;
  if (desde) {
    const { count, error } = await supabase
      .from('sismo_publicaciones')
      .select('id', { count: 'exact', head: true })
      .in('seccion', SECCIONES_AYUDA)
      .gt('creado_en', desde);
    if (error) throw error;
    conteo = count ?? 0;
  }
  return { conteo, ultima_fecha };
}

function formatearSalida(fila) {
  return {
    id: fila.id,
    seccion: fila.seccion,
    tipo_presentacion: fila.tipo_presentacion,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    nivel_confianza: fila.nivel_confianza,
    archivo: fila.archivo,
    tipo_archivo: fila.tipo_archivo,
    url_externa: fila.url_externa,
    vigente_hasta: fila.vigente_hasta,
    fecha_publicado: fila.fecha_publicado,
    publicado_por: fila.publicado_por,
  };
}

function validar(campos) {
  if (!SECCIONES_VALIDAS.includes(campos.seccion)) {
    throw new Error(`Sección no reconocida. Debe ser una de: ${SECCIONES_VALIDAS.join(', ')}`);
  }
  if (!NIVELES_CONFIANZA_VALIDOS.includes(campos.nivel_confianza)) {
    throw new Error(`Nivel de confianza no reconocido. Debe ser uno de: ${NIVELES_CONFIANZA_VALIDOS.join(', ')}`);
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

// Sube el buffer del archivo a Supabase Storage y devuelve la URL pública.
async function subirArchivoAStorage(buffer, nombreUnico, mimetype) {
  const { error } = await supabase.storage.from(BUCKET).upload(`publicaciones/${nombreUnico}`, buffer, {
    contentType: mimetype,
    upsert: false,
  });
  if (error) throw new Error('No se pudo subir el archivo: ' + error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`publicaciones/${nombreUnico}`);
  return data.publicUrl;
}

async function crear(campos) {
  validar(campos);

  const fila = {
    seccion: campos.seccion,
    tipo_presentacion: campos.tipo_presentacion,
    titulo: campos.titulo.trim(),
    descripcion: (campos.descripcion || '').trim() || null,
    nivel_confianza: campos.nivel_confianza,
    archivo: campos.archivo || null,
    tipo_archivo: campos.tipo_archivo || null,
    url_externa: campos.url_externa || null,
    vigente_hasta: campos.vigente_hasta || null,
    fecha_publicado: fechaHoyColombia(),
    publicado_por: campos.publicado_por || 'Equipo Buenaventura SE LEVANTA',
  };

  const { data, error } = await supabase.from('sismo_publicaciones').insert(fila).select().single();
  if (error) throw error;
  return formatearSalida(data);
}

async function eliminar(id) {
  const { data: fila, error: errorLectura } = await supabase.from('sismo_publicaciones').select('archivo').eq('id', id).single();
  if (errorLectura) throw new Error('Publicación no encontrada.');

  if (fila.archivo) {
    const rutaEnBucket = 'publicaciones/' + fila.archivo.split('/publicaciones/')[1];
    await supabase.storage.from(BUCKET).remove([rutaEnBucket]);
  }

  const { error } = await supabase.from('sismo_publicaciones').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { listar, crear, eliminar, subirArchivoAStorage, contarDesde };
