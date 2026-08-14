const supabase = require('./supabaseClient');

// Texto fijo del producto (no cambia con frecuencia, no necesita tabla propia).
const ADVERTENCIA_FRAUDE = {
  titulo: 'La Alcaldía de Buenaventura aclaró públicamente:',
  puntos: [
    'NO ha habilitado cuentas bancarias propias para recibir donaciones',
    'NO se debe entregar dinero en efectivo a ningún funcionario',
    'SÍ se puede donar en el centro de acopio oficial (Oficina de Atención al Ciudadano)',
  ],
  fuente_tipo: 'oficial',
};

const NIVELES_CONFIANZA = {
  oficial: 'Entidad de gobierno o institución pública reconocida',
  institucional: 'ONG o fundación con trayectoria y registro verificable, previa a la emergencia',
  colectivo: 'Organización o asociación identificable, con nombre y responsables, sin trayectoria institucional larga',
  individual: 'Persona particular — sin verificación institucional, usar criterio propio antes de donar',
};

const CRITERIOS_INCLUSION_CUENTAS = [
  'Identidad verificable — cuenta oficial, organización conocida o persona con nombre real y trayectoria previa a la crisis',
  'Evidencia de acción real en terreno, no solo mensaje',
  'Actividad sostenida en el tiempo, no un post aislado',
  'Si recauda fondos, por canal verificable — no cuenta personal sin rastro',
];

const CHECKLIST_REGISTRO_VISUAL = [
  'Origen confirmado geográfica y temporalmente',
  'No es contenido reciclado de otro país o evento (verificación inversa de imagen/video)',
  'Respeta dignidad: no muestra personas fallecidas ni menores identificables sin consentimiento',
  'Consentimiento de quien grabó, para publicar con o sin crédito',
];

async function obtenerCifrasOficiales() {
  const { data, error } = await supabase.from('sismo_cifras_oficiales').select('*').eq('id', 1).single();
  if (error) throw error;
  return {
    buenaventura: data.buenaventura,
    contexto_nacional: data.contexto_nacional,
    sismo_principal: data.sismo_principal,
    replicas_relevantes: data.replicas_relevantes,
    toque_de_queda: data.toque_de_queda,
    _meta: { ultima_revision_por_equipo: data.ultima_revision_por_equipo },
  };
}

async function obtenerContactosEmergencia() {
  const { data, error } = await supabase.from('sismo_contactos_emergencia').select('*').eq('id', 1).single();
  if (error) throw error;
  return {
    nacionales: data.nacionales,
    buenaventura: data.buenaventura,
    salud_mental: data.salud_mental,
    restablecimiento_contacto_familiar: data.restablecimiento_contacto_familiar,
    atencion_ciudadano_alcaldia: data.atencion_ciudadano_alcaldia,
    _meta: { ultima_revision_por_equipo: data.ultima_revision_por_equipo },
  };
}

async function obtenerDirectorioAyuda() {
  const { data, error } = await supabase.from('sismo_directorio_ayuda').select('*').order('orden');
  if (error) throw error;
  return {
    advertencia_fraude: ADVERTENCIA_FRAUDE,
    niveles_confianza: NIVELES_CONFIANZA,
    iniciativas: data.map(despojarCamposInternos),
  };
}

async function obtenerPlataformas() {
  const { data, error } = await supabase.from('sismo_plataformas').select('*').order('orden');
  if (error) throw error;
  return {
    ciudadanas: data.filter((p) => p.categoria === 'ciudadana').map(({ nombre, url, descripcion }) => ({ nombre, url, descripcion })),
    oficiales: data.filter((p) => p.categoria === 'oficial').map(({ nombre, url, descripcion }) => ({ nombre, url, descripcion })),
  };
}

async function obtenerVerificadoFalso() {
  const { data, error } = await supabase.from('sismo_verificado_falso').select('afirmacion, estado, explicacion, fuente').order('creado_en');
  if (error) throw error;
  return { aclaraciones_oficiales: data };
}

async function obtenerComoSolicitarAyudaOficial() {
  const { data, error } = await supabase.from('sismo_como_solicitar_ayuda').select('*').eq('id', 1).single();
  if (error) throw error;
  return {
    estado_contenido: data.estado_contenido,
    nota_transparencia: data.nota_transparencia,
    lo_que_se_sabe: data.lo_que_se_sabe,
    pendiente_de_confirmar: data.pendiente_de_confirmar,
    _meta: { ultima_revision_por_equipo: data.ultima_revision_por_equipo },
  };
}

async function obtenerCuentasYVoces() {
  const { data, error } = await supabase.from('sismo_cuentas_y_voces').select('*').order('orden');
  if (error) throw error;
  const porCategoria = (categoria) => data.filter((c) => c.categoria === categoria).map(({ nombre, canal, descripcion, estado_verificacion }) => ({ nombre, canal, descripcion, estado_verificacion }));
  return {
    criterios_inclusion: CRITERIOS_INCLUSION_CUENTAS,
    oficiales: porCategoria('oficiales'),
    medios_locales: porCategoria('medios_locales'),
    ong_con_trayectoria: porCategoria('ong_con_trayectoria'),
    profesionales_tecnicos: porCategoria('profesionales_tecnicos'),
    influencers_y_personalidades: porCategoria('influencers_y_personalidades'),
  };
}

async function obtenerRegistroVisual() {
  const { data, error } = await supabase
    .from('sismo_publicaciones')
    .select('id, titulo, descripcion, fecha_publicado')
    .eq('seccion', 'registro-visual')
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return {
    estado_contenido: data.length === 0 ? 'vacio' : 'con_contenido',
    nota_transparencia: 'Todavía no hay ningún video o foto que haya pasado el checklist de verificación del equipo. No se publica contenido visual sin verificar, aunque eso signifique que esta sección empiece vacía.',
    checklist_antes_de_publicar: CHECKLIST_REGISTRO_VISUAL,
    items: data.map((item) => ({ titulo: item.titulo, descripcion: item.descripcion, fecha_verificacion: item.fecha_publicado })),
  };
}

function despojarCamposInternos({ id, orden, ...resto }) {
  return resto;
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
